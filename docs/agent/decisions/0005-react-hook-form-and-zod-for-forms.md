# ADR-0005: Dùng React Hook Form + Zod cho form và validate phía client

| | |
|---|---|
| **Trạng thái** | Accepted |
| **Ngày** | 2026-11-28 |
| **Người quyết định** | Product Owner (đã duyệt 2026-11-28) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/convention-frontend.md` §3 (`.schema.ts`) · `docs/agent/upstream/api/api-convention.md` §11 (`validationErrors[]`) · `docs/agent/design/SHARED/APP-SHELL/Component_Design.md` §4 |

## Bối cảnh (Context)
- Nhiều form có validate map 1-1 với BE: độ dài, chuỗi không chỉ khoảng trắng, enum, mảng ≤ 3 phần tử, đủ 13 tuổi, regex SĐT / OTP (USER-001 2.2, 2.3, 2.6, 2.8; các mã sau có form lớn hơn: tạo kèo, thoả thuận chi phí, tin tuyển).
- Lỗi field từ BE (`400 VALIDATION_ERROR`, `validationErrors[].field` có thể là đường dẫn như `timeOptions[0].startsAt`, hoặc `"body"`) phải gắn vào đúng ô.
- PATCH chỉ gửi field đã đổi (USER-001 §1.1) → cần biết field nào "dirty".
- Bộ đếm ký tự, nhóm chip chọn nhiều, form trong dialog.

## Quyết định (Decision)
Chúng tôi dùng **React Hook Form** (`react-hook-form`) + **Zod** (`zod`) qua `@hookform/resolvers` (bản ổn định mới nhất tại lúc cài):
- Mỗi form một schema `<form>.schema.ts` đặt cạnh component form (`modules/<domain>/components/<màn>/` — `convention-frontend.md` §2 không có thư mục `schemas/`), type form suy ra từ schema.
- Ràng buộc trong schema **chép từ API_Spec** của endpoint (không tự đặt thêm); câu lỗi tiếng Việt do FE chọn (BE nói `validationErrors[].message` không cố định — USER-001 §1.2).
- Lỗi BE: helper dùng chung `applyServerValidationErrors(setError, apiError, fieldMap?)` (thiết kế SHARED) gọi `setError` theo `field`; `field = "body"` hoặc field không có trên form → banner lỗi chung của form.
- PATCH: lấy `dirtyFields` để dựng body chỉ gồm field đã đổi.

Phương án đã loại:
- **Formik:** re-render nhiều hơn với form lớn, nhịp phát triển chậm.
- **TanStack Form:** mới, hệ sinh thái / ví dụ ít hơn ở thời điểm quyết định.
- **Tự viết state form:** phải tự làm dirty tracking, gắn lỗi theo đường dẫn mảng, focus lỗi đầu tiên.
- **Valibot thay Zod:** nhỏ hơn nhưng ít phổ biến hơn; cân nhắc lại nếu bundle vượt ngưỡng.

## Hệ quả (Consequences)

**Tích cực**
- Một cách viết form cho mọi module; lỗi client và lỗi BE hiển thị cùng một chỗ.
- Schema là nơi duy nhất giữ ràng buộc client → dễ đối chiếu API_Spec ở cổng tuân thủ.

**Tiêu cực / đánh đổi**
- Ba dependency runtime; Zod chiếm phần đáng kể trong bundle (`[Unverified]` — đo bằng `npm run build`).
- Ràng buộc nhân đôi FE/BE: BE đổi ràng buộc mà FE không cập nhật → lỗi BE vẫn hiển thị đúng nhờ helper, nhưng client có thể chặn sai.

**Cần theo dõi**
- Bundle ban đầu vượt 250 KB gzip → chỉ nạp schema trong chunk của page (lazy) hoặc chuyển sang bản rút gọn của Zod.
- BE công bố `openapi.json` (FE ADR-0001 "Cần theo dõi") → cân nhắc sinh schema tự động.
