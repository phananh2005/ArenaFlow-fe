# CHANGELOG — NOTIFICATION-001 Thông báo in-app (thiết kế FE)

## [v1.3] — 2026-11-27

**Type:** MINOR (sửa tham chiếu, không đổi thiết kế) · **Tóm tắt:** Sửa tham chiếu theo review chốt.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Header 3 tài liệu; Screen_Flow §6 #8; Component_Design §1; State_API_Integration §4.2 | Sửa | SHARED v1.1 / không ghi bản → SHARED v1.2 | Review chốt |
| 2 | State_API_Integration §7 #4 | Sửa | USER-003 `[cần xác nhận]` #1 → #2 | Đúng số mục ở USER-003 State_API_Integration §9 |
| 3 | State_API_Integration §3.3 dòng `TEAM_INVITATION`, §7 #4 | Sửa | Literal `[QUERY_ROOTS.team, 'my-invitations']` → ghi rõ là hợp đồng tiền tố của USER-003 = `teamKeys.myInvitations()` (USER-003 State_API_Integration §3.1), invalidate theo tiền tố (SHARED §4) | Review chốt |

### Ảnh hưởng
- Không ảnh hưởng code (chưa có).

## [v1.2] — 2026-11-27

**Type:** MINOR (thêm điều kiện bật kênh cá nhân; không đổi route, props dùng chung, store toàn cục) · **Tóm tắt:** Bridge kênh cá nhân chỉ bật khi `isPersonalChannelEnabled()` (SHARED v1.2); tắt → fallback gọi 2.2 một lần.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | State_API_Integration §4.2 (cổng kênh, fallback mục 1, phụ thuộc phát hành); §1 dòng Fallback | Thêm | Luôn `subscribePersonal` + `onConnected` → chỉ khi `isPersonalChannelEnabled()`; `false` → bật `countEnabled` ngay khi mount (như không có `WebSocket`) | SHARED State_API_Integration §6 v1.2 |
| 2 | State_API_Integration §4.2 bước 1 | Sửa | `getConnectionEpoch()` trỏ MATCH-001 C16, có nhánh "SHARED chưa có" → trỏ SHARED §6 v1.2, bỏ nhánh | SHARED v1.2 đã chốt |
| 3 | Component_Design §2 `NotificationRealtimeBridge`, §6 #4 | Sửa | Phụ thuộc SHARED v1.1 + MATCH-001 C16 → SHARED v1.2 (thêm `PERSONAL_CHANNEL_ENABLED`) | Như trên |

### Ảnh hưởng
- Chưa có code. Trước khi BE mở kênh: NOTIFICATION-001 chạy không realtime, số call khi tải không đổi (2.2 một lần qua fallback).

## [v1.1] — 2026-11-27

**Type:** MINOR (chốt `[cần xác nhận]` route đích, dùng prop tuỳ chọn mới của SHARED v1.1, bỏ trùng theo epoch kết nối; không đổi route public, props component dùng chung hay store toàn cục) · **Tóm tắt:** Áp các mục §6 "thay đổi cho mã khác" của REPUTATION-001, MERCENARY-001, MATCH-001, MATCH-002 nhắm vào NOTIFICATION-001.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow §5 `MATCH` | Chốt | đề xuất → `buildMatchDetailPath(matchId)` | MATCH-001 §6 C13 |
| 2 | Screen_Flow §5 `PAIRING` | Chốt | đề xuất → `buildPairingDetailPath(pairingId)` (`/pairings/:pairingId`) | MATCH-002 §6 C9 |
| 3 | Screen_Flow §5 `MERCENARY_APPLICATION`, `MERCENARY_DISPUTE`; §6 #6 | Chốt / Đóng | đề xuất → `buildMercenaryApplicationPath`, `buildAdminMercenaryDisputePath`; vai trò do S15 tự phân luồng | MERCENARY-001 §6 C12 |
| 4 | Screen_Flow §5 `DISPUTE` | Sửa | `buildAdminDisputePath` → `buildAdminDisputeDetailPath` | REPUTATION-001 §6 C6 |
| 5 | Screen_Flow §5 `REPORT`; §6 #7 | Sửa | chưa xác định → tạm `buildMyTeamsPath({ role: 'CAPTAIN' })`; giữ `[cần xác nhận]` cho report cá nhân | REPUTATION-001 §6 C6; MERCENARY-001 §5 |
| 6 | Screen_Flow §6 #5, #8 | Sửa | "hằng chưa có" → "đã chốt, chưa commit"; thêm MATCH-001 C7, C16 vào điều kiện ADR-0007 | Như trên |
| 7 | Component_Design §2 `EmptyState`, `ErrorState`; §6 #1 | Sửa / Đóng | bỏ icon / không tiêu đề → dùng `icon?`, `title?` | SHARED CHANGELOG v1.1 #6 |
| 8 | Component_Design §2 `NotificationRealtimeBridge`; §4 `notificationSyncStore` | Sửa | reset khi unmount → reset chỉ khi phiên kết thúc; store thêm `handledEpoch`; ghi chú dùng chung kênh với `ConversationActivityBridge` | MATCH-001 §6 C2, C4, C16 |
| 9 | State_API_Integration §3.1, §4.2 | Sửa | `onConnected` gọi 2.2 mỗi lần handler chạy → bỏ trùng theo `getConnectionEpoch()`; kênh cá nhân không dùng `subscribe(…, { onReady })` | MATCH-001 §6 C16 |
| 10 | State_API_Integration §1, §7 #1 | Sửa | mở thẳng `/notifications` 4–5 call → 5 (thêm `GET /profile/conversations` của MATCH-001 trong `onConnected`) | MATCH-001 §6 C2 |

### Ảnh hưởng
- Chưa có code → không ảnh hưởng `src/`.
- Vẫn chặn code: SHARED + FE ADR chưa merge / `Accepted` (Screen_Flow §6 #8); ngưỡng call khung (State_API_Integration §7 #1).
