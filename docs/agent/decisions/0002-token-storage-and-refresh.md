# ADR-0002: Access token trong bộ nhớ, refresh token trong `localStorage`, làm mới một lần khi gặp 401

| | |
|---|---|
| **Trạng thái** | Accepted |
| **Ngày** | 2026-11-28 |
| **Người quyết định** | Product Owner (đã duyệt 2026-11-28) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/security-frontend.md` §1 (chiến lược đã duyệt 2026-11-03) · BE ADR-0001 (JWT HS256, access 1 giờ / refresh 7 ngày, không rotate) · USER-001 `API_Spec.md` §1.1, §1.2, 2.4, 2.7 · FE ADR-0006 (session store) · `docs/agent/design/SHARED/APP-SHELL/State_API_Integration.md` §2–§3 |

## Bối cảnh (Context)
- BE trả `accessToken` (hết hạn sau `expiresIn` = 3600 giây) và `refreshToken` (7 ngày) **trong body** (USER-001 2.1, 2.3, 2.4); không có cookie httpOnly, không có endpoint đăng xuất / thu hồi (BE ADR-0001).
- `security-frontend.md` §1 đã duyệt chiến lược lưu token ngày 2026-11-03 và yêu cầu ghi thành ADR-0002 ở chức năng đầu tiên — USER-001 là chức năng đó.
- Kết nối STOMP (FE ADR-0007) cũng cần access token còn hạn ở `CONNECT`.
- Nhiều request song song cùng nhận `401 AUTH_001` không được gọi refresh nhiều lần.

## Quyết định (Decision)
Chúng tôi sẽ:
1. **Access token** giữ trong biến module của `src/core/services/token-storage.service.ts` (kèm thời điểm hết hạn tính từ `expiresIn` theo đồng hồ máy); không ghi `localStorage`/`sessionStorage`, không đưa vào store React (FE ADR-0006 chỉ giữ `status`, `userId`, `role`).
2. **Refresh token** ghi `localStorage` (một khoá cố định, đọc/ghi bọc `try/catch`). Mỗi lần nhận `AuthResponse` mới → ghi đè cả hai token.
3. **Khởi động app:** có refresh token → gọi `POST /auth/refresh` một lần để lấy access token, trong lúc chờ session ở trạng thái `unknown` (guard hiện loading). Không có → `anonymous`.
4. **Làm mới khi gặp 401:** `http.service` nhận `401 AUTH_001` ở request có xác thực → gọi refresh **single-flight** (mọi request đang chờ dùng chung một promise) → gửi lại request gốc **một lần**. Kết quả refresh:
   - `401 AUTH_002` → `endSession('EXPIRED')`; `403 AUTH_003` → `endSession('ACCOUNT_DELETED')`.
   - **Lỗi mạng / hết giờ / 5xx → không xoá token, không kết thúc phiên**: request gốc ném lỗi mạng tương ứng (màn hiện lỗi + Thử lại); lần gọi sau thử refresh lại.
   - Lúc **khởi động** mà refresh gặp lỗi mạng → session `anonymous` lý do `NETWORK`, **giữ** refresh token (mở lại / bấm Thử lại sẽ refresh lại).
   - Request `/auth/*` không kích hoạt refresh.
5. **Kết thúc phiên** (`endSession(reason)`, `reason` là `LOGOUT`, `EXPIRED` hoặc `ACCOUNT_DELETED`): xoá hai token, xoá cache server state (`queryClient.clear()`), ngắt realtime, đặt session `anonymous` kèm lý do. Áp cho: đăng xuất, refresh bị BE từ chối (mục 4), xoá tài khoản thành công (`204`), và các mã "tài khoản đã xoá" mà từng endpoint khai báo (vd `404 USER_001` ở `GET/PATCH /profile`). Lý do `endReason` của session gồm 3 giá trị trên + `NETWORK` (chỉ đặt ở mục 4, không qua `endSession`).
6. **Nhiều tab:** lắng nghe sự kiện `storage` trên khoá refresh token:
   - Tab khác **xoá** token → tab này `endSession('LOGOUT')`.
   - Tab khác **ghi token mới** (đăng nhập lại, có thể là tài khoản khác) → tab này bỏ access token đang giữ, `refreshSession()` bằng refresh token mới; `userId` trả về khác session hiện tại → `queryClient.clear()`, ngắt realtime, cập nhật session sang tài khoản mới và điều hướng `HOME_PATH` (không giữ dữ liệu của tài khoản cũ trên màn hình).
7. Không làm mới chủ động theo đồng hồ; chỉ trước `CONNECT` realtime, nếu access token đã quá hạn theo đồng hồ máy → refresh trước.

Phương án đã loại:
- **Cả hai token trong bộ nhớ:** mất phiên mỗi lần tải lại trang — trải nghiệm kém, không có lợi ích bảo mật tương xứng khi BE không rotate.
- **Cả hai token trong `localStorage`:** access token bị XSS đọc trực tiếp, trái `security-frontend.md` §1.
- **Cookie httpOnly:** cần đổi BE (đặt cookie, CSRF) — phải làm qua luồng thiết kế BE; chưa có.
- **Làm mới chủ động theo `expiresIn`:** thêm timer, request thừa khi tab ẩn; 401-rồi-refresh đủ cho REST.

## Hệ quả (Consequences)

**Tích cực**
- Một chỗ duy nhất gắn `Authorization` và xử lý refresh; module nghiệp vụ không biết tới token.
- Tải lại trang giữ được phiên tới 7 ngày.

**Tiêu cực / đánh đổi**
- Refresh token trong `localStorage` bị XSS đọc được (đánh đổi đã chấp nhận ở `security-frontend.md` §1); BE không rotate nên token lộ dùng được tới 7 ngày (BE ADR-0001).
- Tải trang lần đầu có thêm một request refresh trước request dữ liệu (không tính vào ngưỡng — `non-functional-standards.md` §2).
- Không có đăng xuất phía server: token cũ còn hiệu lực tới khi hết hạn.

**Cần theo dõi**
- BE chuyển sang cookie httpOnly hoặc thêm rotate / thu hồi → ADR mới thay thế.
- Bật CSP khi deploy (`security-frontend.md` §6) để giảm rủi ro XSS đọc `localStorage`.
