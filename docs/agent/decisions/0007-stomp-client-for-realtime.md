# ADR-0007: Một kết nối STOMP dùng chung (`@stomp/stompjs` qua WebSocket thuần) cho chat và thông báo

| | |
|---|---|
| **Trạng thái** | Accepted |
| **Ngày** | 2026-11-28 |
| **Người quyết định** | Product Owner (đã duyệt 2026-11-28) · solution-architect (đề xuất) |
| **Liên quan** | BE ADR-0014 (STOMP/WebSocket, SockJS, broker trong bộ nhớ) · BE ADR-0015 (kênh cá nhân `/user/queue/notifications`) · MATCH-001 `API_Spec.md` §1.7 · NOTIFICATION-001 `API_Spec.md` §1.4 · FE ADR-0002 · FE ADR-0006 · `docs/agent/design/SHARED/APP-SHELL/State_API_Integration.md` §6 |

## Bối cảnh (Context)
- BE đẩy frame qua STOMP tại `/ws` (cùng host API, không tiền tố `/api/v1`); bật SockJS, WebSocket thuần ở `/ws/websocket`; `CONNECT` kèm `Authorization: Bearer <access token>`; heartbeat `10000,10000`; client chỉ `SUBSCRIBE`, không `SEND` (MATCH-001 §1.7).
- Hai nhu cầu dùng chung **một** kết nối (NOTIFICATION-001 §1.4): topic `/topic/conversations/{id}` khi mở phòng chat (MATCH-001, MATCH-002, MERCENARY-001) và kênh cá nhân `/user/queue/notifications` một lần mỗi kết nối (frame `NOTIFICATION_CREATED`, `CONVERSATION_ACTIVITY`).
- Không bảo đảm giao frame → sau mỗi lần kết nối lại phải `SUBSCRIBE` lại trước, rồi bù bằng REST (MATCH-001 §1.7 thứ tự 1–3; NOTIFICATION-001 §1.4).
- Lỗi `ERROR` header `message: <mã>` rồi server đóng kết nối; `AUTH_001` → refresh token rồi kết nối lại; BE yêu cầu kết nối lại sau mỗi lần refresh token.
- BE ADR-0014 ghi `[cần xác nhận]` Spring 7 còn hỗ trợ SockJS hay không; nếu bỏ, WebSocket thuần vẫn giữ.

## Quyết định (Decision)
Chúng tôi dùng **`@stomp/stompjs`** (bản ổn định mới nhất tại lúc cài), transport **WebSocket thuần** tới `/ws/websocket` (URL tính từ origin hiện tại, `ws:`/`wss:` theo `http:`/`https:`); **không** cài `sockjs-client`.
- Một singleton `src/core/realtime/realtime.service.ts` giữ kết nối duy nhất; module chỉ gọi `subscribe(destination, handler, { onError?, onReady?(epoch) })` (đếm tham chiếu: nhiều subscriber cùng destination dùng một `SUBSCRIBE` với server nhưng **mọi** subscriber đều nhận mọi frame; huỷ một subscriber không ảnh hưởng subscriber khác; `onError` gọi cho mọi subscriber; `onReady` gọi sau khi `SUBSCRIBE` được gửi ở mỗi epoch kết nối, kể cả khi đăng ký lúc đã kết nối; `getConnectionEpoch()`) / `subscribePersonal(frameType, handler)` (trả hàm huỷ) `onConnected(handler)` (sau khi `SUBSCRIBE` xong ở mọi lần kết nối, gồm lần đầu; đăng ký khi đã kết nối → gọi ngay sau `SUBSCRIBE`) và `onReconnected(handler)` (chỉ các lần kết nối lại).
- **Mở kết nối lười:** chỉ khi có subscription đầu tiên và session `authenticated`; đóng khi không còn subscription hoặc `endSession`.
- Kênh cá nhân: service `SUBSCRIBE /user/queue/notifications` **một lần** mỗi kết nối khi có ít nhất một listener cá nhân, rồi phân phát frame theo `type` cho listener đã đăng ký. Chỉ bật khi hằng `PERSONAL_CHANNEL_ENABLED` = `true` (bật cùng bản phát hành BE NOTIFICATION-001); `false` → không `SUBSCRIBE` kênh cá nhân.
- Kết nối lại: backoff tăng dần (1 s → 2 s → 4 s … tối đa 30 s) cho lỗi mạng; khi kết nối lại thành công: `SUBSCRIBE` lại kênh cá nhân và mọi topic đang có, **sau đó** phát sự kiện `reconnected` để module bù REST (bỏ trùng theo id do module làm).
- Frame `ERROR`: `AUTH_001` → `refreshSession()` (FE ADR-0002, single-flight) rồi kết nối lại; refresh thất bại → `endSession`. `CHAT_002` / `CHAT_003` / `USER_001` khi `SUBSCRIBE` topic → báo lỗi cho đúng subscription đó (module xử lý), bỏ topic đó khỏi danh sách đăng ký lại. `SYS_004` → lỗi lập trình, log mã lỗi (không log token), không đăng ký lại destination đó.
- Sau mỗi lần refresh token thành công khi đang kết nối → ngắt và kết nối lại với token mới.
- Dev: Vite proxy thêm `/ws` với `ws: true` (thay đổi `vite.config.ts` làm cùng code realtime đầu tiên).

Phương án đã loại:
- **`sockjs-client` làm transport:** thêm bundle, thư viện ít được bảo trì; BE còn chưa chắc giữ SockJS; mạng chặn WebSocket hiếm với web app hiện đại — khi đó app vẫn dùng được nhờ REST (chỉ mất realtime).
- **Tự viết STOMP trên `WebSocket`:** phải tự xử lý frame, heartbeat, reconnect — rủi ro.
- **Polling REST thay realtime:** trễ, tăng số request, trái SRS (độ trễ < 1 s — BE ADR-0014).
- **Mỗi module tự mở kết nối:** trái NOTIFICATION-001 §1.4 (dùng chung một kết nối), tốn tài nguyên server.

## Hệ quả (Consequences)

**Tích cực**
- Một nơi xử lý token, reconnect, đăng ký lại; module chỉ lo frame của mình và việc bù REST.
- Không mở WebSocket khi chưa có màn hình nào cần (USER-001/002 không dùng realtime).

**Tiêu cực / đánh đổi**
- Thêm một dependency runtime; nên nạp động (`import()`) khi mở kết nối lần đầu để không vào chunk chính.
- Không có fallback SockJS: môi trường chặn WebSocket chỉ còn dữ liệu qua REST.
- Kết nối lại sau mỗi lần refresh token (≈ mỗi giờ khi đang dùng) gây khoảng trống ngắn → dựa vào bù REST.

**Cần theo dõi**
- BE xác nhận bỏ / giữ SockJS (BE ADR-0014 `[cần xác nhận]`); có người dùng thật bị chặn WebSocket → cân nhắc thêm fallback.
- BE chạy ≥ 2 instance (broker relay) → hợp đồng kênh có thể đổi; rà lại service.
- Kênh cá nhân chỉ mở cùng bản phát hành NOTIFICATION-001 (trước đó `SUBSCRIBE` trả `SYS_004`) → không đăng ký kênh cá nhân trước khi NOTIFICATION-001 có code.
