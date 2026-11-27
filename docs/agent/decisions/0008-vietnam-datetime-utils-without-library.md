# ADR-0008: Ngày giờ theo giờ Việt Nam không kèm múi giờ xử lý bằng util tự viết, không thêm thư viện ngày giờ

| | |
|---|---|
| **Trạng thái** | Proposed |
| **Ngày** | 2026-11-27 |
| **Người quyết định** | Product Owner (duyệt qua PR) · solution-architect (đề xuất) |
| **Liên quan** | BE ADR-0017 (giờ Việt Nam, không offset) · BE ADR-0018 · SYSTEM-002 `API_Spec.md` §1.1–§1.2 · `api-convention.md` §10 · `docs/agent/design/SHARED/APP-SHELL/Component_Design.md` §5 |

## Bối cảnh (Context)
- Mọi `datetime` BE là `YYYY-MM-DDTHH:mm:ss` giờ Việt Nam, **không** `Z`/offset; response có thể có phần lẻ giây 1–6 chữ số; `date` là `YYYY-MM-DD` (SYSTEM-002 §1.1).
- Hiển thị phải in nguyên giờ/ngày, **không** đổi theo múi giờ máy; so với "bây giờ" phải coi chuỗi là UTC+7; gửi lên theo đúng định dạng, không đổi sang UTC.
- Request kèm `Z`/offset → `400 VALIDATION_ERROR`.
- Nhu cầu hiện biết: định dạng `dd/mm/yyyy`, `HH:mm`; tính tuổi (≥ 13 — USER-001 2.6); đếm ngược / so quá giờ (kèo, OTP); dựng chuỗi gửi từ ô chọn ngày giờ.
- Việt Nam không có giờ mùa hè → độ lệch cố định +07:00.

## Quyết định (Decision)
Chúng tôi **không** thêm thư viện ngày giờ. Một file util thuần `src/shared/utils/vn-datetime.util.ts` (danh sách hàm: thiết kế SHARED Component_Design §5):
- **Hiển thị:** tách chuỗi bằng regex thành phần năm/tháng/ngày/giờ/phút → ghép chuỗi hiển thị; **không** qua `Date` → không phụ thuộc múi giờ máy.
- **So với bây giờ:** chuẩn hoá phần lẻ giây về 3 chữ số, ghép `+07:00`, `Date.parse` → epoch ms; so với `Date.now()`.
- **Dựng chuỗi gửi đi** từ ô `date`/`time`/`datetime-local` (giá trị là giờ người dùng chọn = giờ Việt Nam) → `YYYY-MM-DDTHH:mm:ss`, không thêm offset.
- **"Hôm nay" theo giờ Việt Nam** (tuổi, mốc ngày): `Date.now() + 7 giờ` rồi lấy phần ngày UTC.
- Chuỗi không khớp định dạng → hàm hiển thị trả chuỗi gốc + không ném lỗi (không làm vỡ màn hình).

Phương án đã loại:
- **date-fns / date-fns-tz, Day.js + plugin timezone, Luxon:** giải quyết bài toán múi giờ tổng quát trong khi app chỉ có một múi giờ cố định; thêm bundle.
- **`Intl.DateTimeFormat` với `timeZone: 'Asia/Ho_Chi_Minh'` để hiển thị:** phải đi qua `Date` (lấy chuỗi → epoch → định dạng lại) — vòng vo cho dữ liệu đã đúng giờ hiển thị, dễ sai khi quên ghép offset.
- **`new Date(chuoi)` trực tiếp:** trình duyệt hiểu chuỗi không offset là giờ máy → sai khi máy khác múi giờ (SYSTEM-002 §1.1 cấm).

## Hệ quả (Consequences)

**Tích cực**
- Không thêm bundle; hành vi xác định, test được bằng chuỗi cố định, không phụ thuộc múi giờ máy chạy test.

**Tiêu cực / đánh đổi**
- Tự viết và tự test các hàm; nhu cầu phức tạp (khoảng thời gian tương đối "3 phút trước", lịch) phải viết thêm.

**Cần theo dõi**
- Cần hiển thị thời gian tương đối phức tạp, đa ngôn ngữ, hoặc nhiều múi giờ → ADR mới cân nhắc thư viện.
- BE đổi quy ước thời gian (BE ADR-0017 bị thay) → rà util.
