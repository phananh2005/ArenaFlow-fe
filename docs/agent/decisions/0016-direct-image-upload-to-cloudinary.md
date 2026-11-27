# ADR-0016: Upload ảnh từ trình duyệt thẳng lên Cloudinary qua `uploadFileDirect` (XHR) trong `http.service`

| | |
|---|---|
| **Trạng thái** | Proposed |
| **Ngày** | 2026-11-27 |
| **Người quyết định** | Product Owner (duyệt qua PR) · solution-architect (đề xuất) |
| **Liên quan** | BE ADR-0009 (`docs/agent/upstream/decisions/0009-cloudinary-signed-direct-upload.md`, Accepted) · API_Spec VENUE-001 "Luồng thêm ảnh", 2.4, 2.5, `[cần xác nhận #19]` · `docs/agent/design/VENUE-001/State_API_Integration.md` §4.2, §5.3 · `docs/agent/convention-frontend.md` §5 · `docs/agent/non-functional-standards.md` §2 · `docs/agent/security-frontend.md` §1, §6 · FE ADR-0004 (Proposed, nhánh `feature/USER-001-user-team`) · `docs/agent/design/SHARED/APP-SHELL/State_API_Integration.md` §2.1, §2.2, §4 (nhánh `feature/USER-001-user-team`; danh sách sửa: VENUE-001 State_API_Integration §8) |

## Bối cảnh (Context)
- BE ADR-0009: ảnh lưu trên Cloudinary; FE xin chữ ký ở BE (2.4), upload file **thẳng** tới `uploadUrl` của Cloudinary (multipart, đúng 7 field đã ký), rồi gửi kết quả về BE (2.5). Mỗi file một chữ ký.
- `convention-frontend.md` §5: mọi request đi qua `src/core/services/http.service.ts`; **NEVER** `fetch` ngoài file đó. Wrapper hiện tại chỉ phục vụ API BE (JSON envelope, gắn Bearer).
- UI S5 cần **thanh tiến trình** khi upload — `fetch` không báo tiến trình gửi body; `XMLHttpRequest` có `upload.onprogress`.
- Ngưỡng timeout 15 s là cho request API; file ảnh vài MB trên mạng di động có thể lâu hơn.
- Giới hạn dung lượng file chưa chốt ở BE (chữ ký không giới hạn được dung lượng) — FE nên tự giới hạn.
- Cơ chế dự kiến dùng lại cho avatar đội / người dùng (BE ADR-0009).

## Quyết định (Decision)
Chúng tôi thêm hàm **`http.uploadFileDirect(opts)`** vào chính `src/core/services/http.service.ts` (giữ nguyên quy tắc "chỉ một file gọi mạng"):
- Dùng `XMLHttpRequest`, `POST` `multipart/form-data` (`FormData`) tới URL nhận vào; **không** gắn `Authorization`, không đọc/ghi token; không theo envelope BE.
- Chỉ chấp nhận URL có tiền tố trong `DIRECT_UPLOAD_ALLOWED_URL_PREFIXES` (hiện `https://api.cloudinary.com/`, hằng trong `core`); URL khác → ném `ApiError` `INVALID_REQUEST`, không gửi file.
- Tham số (`DirectUploadOptions`): `url`, `fields: Record<string, string>` (gửi đúng, không thêm), `file`, `onProgress(loaded, total)`, `signal` (huỷ → `xhr.abort()`), `timeoutMs` (mặc định `DIRECT_UPLOAD_TIMEOUT_MS` = **120 s** — ngoại lệ của ngưỡng 15 s; **chặn code S5 tới khi user duyệt**, hoặc chốt giá trị khác).
- Kết quả: JSON thô của Cloudinary; lỗi chuẩn hoá thành `ApiError` với `code`: `UPLOAD_REJECTED` (HTTP ≠ 2xx), `NETWORK_ERROR`, `TIMEOUT`, `ABORTED`, `INVALID_RESPONSE`, `INVALID_REQUEST` (mã mới `UPLOAD_REJECTED`, `INVALID_REQUEST` thêm vào APP-SHELL §2.2); `message` là câu FE "Tải ảnh thất bại" — **không** hiển thị message của Cloudinary.
- Ghép 3 bước, kiểm hạn `expiresAt`, quy tắc thử lại, ánh xạ field: hook `useVenueImageUpload` của module (VENUE-001 State_API_Integration §4.2) — `http.service` không biết nghiệp vụ.
- FE tự kiểm trước khi xin chữ ký: định dạng `jpg`/`jpeg`/`png`/`webp` (MIME + đuôi) và **dung lượng ≤ 10 MB** (đề xuất, chờ chốt cùng API_Spec #19).
- Không log `signature`, `apiKey`, `publicId`, nội dung file.

Phương án đã loại:
- **`fetch` trong một service riêng (`direct-upload.service.ts`):** không có tiến trình upload; và phải sửa `convention-frontend.md` §5 để có file thứ hai gọi mạng.
- **Thư viện upload (Uppy, SDK Cloudinary phía client…):** thêm dependency lớn cho một form một file; SDK upload widget nạp script ngoài, nới CSP.
- **Upload qua BE:** BE ADR-0009 đã loại.
- **Dùng chung timeout 15 s:** dễ hỏng upload hợp lệ trên mạng chậm.

## Hệ quả (Consequences)

**Tích cực**
- Một nơi duy nhất mở kết nối mạng; Bearer không bao giờ rời sang domain Cloudinary.
- Có tiến trình upload cho S5; dùng lại được cho avatar.

**Tiêu cực / đánh đổi**
- `http.service.ts` có hai kiểu transport (`fetch` cho API, XHR cho upload) → test riêng cho `uploadFileDirect` (mock `XMLHttpRequest`).
- CSP khi deploy phải cho `connect-src https://api.cloudinary.com` và `img-src https://res.cloudinary.com`.
- Timeout upload dài hơn ngưỡng chung — cần user duyệt.
- File đã lên Cloudinary nhưng không lưu được ở 2.5 thành ảnh mồ côi, do job dọn của BE xử lý (BE ADR-0009).

**Cần theo dõi**
- BE chốt giới hạn dung lượng (API_Spec #19) → cập nhật hằng FE.
- Thêm nhà cung cấp ảnh khác → mở rộng danh sách tiền tố URL cho phép (sửa ADR, mục Sửa đổi sau khi `Accepted`).
- Khi áp cho avatar: dùng lại `uploadFileDirect`, không tạo đường upload song song.
