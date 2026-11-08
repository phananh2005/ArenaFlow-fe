# Bảo mật Frontend — ArenaFlow-fe

> Áp dụng cho mọi code trong `src/`. Kiểm tra quyền thật luôn ở BE — FE chỉ ẩn/hiện UI.

## 1. Xử lý token (JWT)

> Chiến lược đã duyệt 2026-11-03, ghi thành ADR-0002 ở chức năng đầu tiên (`docs/agent/decisions/`).

- Access token: giữ **trong bộ nhớ** (store/biến module), không ghi `localStorage`/`sessionStorage`.
- Refresh token: `localStorage` (đánh đổi đã chấp nhận vì BE trả token trong body). Muốn chuyển sang httpOnly cookie → phải sửa BE qua luồng thiết kế BE.
- Gắn header `Authorization: Bearer …` **chỉ** trong `src/core/services/http.service.ts`, chỉ cho request tới `VITE_API_BASE_URL`.
- 401 → thử refresh một lần; thất bại → xoá token, chuyển về đăng nhập. Không retry vô hạn.
- Đăng xuất → xoá cả access lẫn refresh token, xoá cache dữ liệu người dùng.
- **NEVER** đưa token vào URL/query string, log, thông báo lỗi, hay state dễ bị serialize ra ngoài.

## 2. XSS

- Mặc định để React escape nội dung (`{value}`).
- **NEVER** dùng `dangerouslySetInnerHTML` với dữ liệu chưa sanitize; cần render HTML → đề xuất thư viện sanitize (ADR) trước.
- **NEVER** `eval`, `new Function`, `innerHTML` tự gán.
- URL từ dữ liệu người dùng gán vào `href`/`src` → chỉ cho `http:`/`https:` (chặn `javascript:`).
- Link mở tab mới → `rel="noopener noreferrer"`.

## 3. Biến môi trường & secret

- Mọi biến `VITE_*` bị nhúng vào bundle → coi là **công khai**. **NEVER** đặt API key bí mật, mật khẩu, khoá ký JWT vào đó.
- `.env`, `.env.local`, `.env.*` (trừ `.env.example`) được gitignore; pre-commit quét secret trong staged files kể cả `.env*`.
- `.env.example` chỉ chứa giá trị mẫu không nhạy cảm.

## 4. Dữ liệu cá nhân (PII) & log

- **NEVER** `console.log` token, mật khẩu, email/số điện thoại người dùng, response chứa PII.
- Không lưu PII vào `localStorage` ngoài mức cần thiết cho chức năng đã duyệt.
- Thông báo lỗi hiển thị cho người dùng lấy `error.message` từ BE; không hiển thị stack trace / `details` kỹ thuật.

## 5. Phân quyền phía client

- Ẩn/hiện nút, route guard chỉ là trải nghiệm. Mọi thao tác vẫn phải chịu kiểm tra quyền ở BE (403).
- Route yêu cầu đăng nhập phải có guard; route guard không thay xử lý 401/403 trong `http.ts`.

## 6. Phụ thuộc & triển khai

- Thư viện mới phải được duyệt (ADR) trước khi cài; ưu tiên thư viện duy trì tích cực.
- Khi deploy: bật Content-Security-Policy, chặn inline script; cấu hình chi tiết ghi ở ADR deploy.
