# UI Design — MERCENARY-001 Tuyển mercenary, ứng tuyển, chat theo đơn, uy tín cá nhân

| Mục | Giá trị |
|---|---|
| Mã chức năng | `MERCENARY-001` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (MERCENARY-001 nằm trong SYSTEM-001 — mục lục `docs/agent/upstream/README.md`): UC-ME01..ME09, BR-ME01..ME19, BC-ME01..ME05, AC-ME01..ME11; hợp đồng tham chiếu `docs/agent/upstream/api/MERCENARY-001/API_Spec.md` v3.0 |
| Căn cứ | `ArenaFlow-spec@53aee11` |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280px) + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-27` / `v1.0` |

> - Giờ hiển thị theo SYSTEM-002: giờ Việt Nam, hiển thị nguyên giá trị API trả về (không đổi múi giờ). Dạng hiển thị dùng trong mockup: `18:00 – 19:30 · Thứ Bảy 14/11/2026`.
> - Dữ liệu trong mockup (tên người, đội, sân, ngày) là **dữ liệu mẫu**. Mockup chỉ để tham khảo, không copy HTML từ Stitch vào `src/`.
> - **Không vẽ lại** (tái dùng thiết kế của mã khác):
>   - Phòng chat dùng chung + danh sách "Tin nhắn của tôi" → MATCH-001 (`docs/agent/design/MATCH-001/`). MERCENARY-001 chỉ vẽ **đầu phòng chat theo đơn** (S19) vì khác chat hai đội.
>   - Chi tiết kèo (nơi đặt nút "Tuyển mercenary") → MATCH-001. S1 chỉ vẽ dialog, nền là chi tiết kèo giả lập.
>   - Dialog tranh chấp report bùng (nhập bằng chứng), uy tín / report **đội** → REPUTATION-001.
>   - Khung app, header đội, hồ sơ cá nhân, dialog / bottom sheet, phân trang → USER-001 (`docs/agent/design/USER-001/UI_Design.md` §3).

## 1. Danh sách màn hình

| # | Màn hình | Use case / rule (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Đăng tin tuyển (dialog trên chi tiết kèo đã ghép) | UC-ME01, BR-ME01, BR-ME05, BR-ME08, AC-ME01 | — (chưa sinh — §5) | chưa có — dự kiến `S1-dang-tin-{desktop,mobile}.{png,html}` |
| S2 | Tuyển mercenary của đội (tin tuyển + trận ngoài) | UC-ME07, UC-ME01 A1, BR-ME05, BR-ME19 | — (chưa sinh — §5) | chưa có — dự kiến `S2-tuyen-mercenary-doi-…` |
| S3 | Ứng viên của tin (góc nhìn đội trưởng) | UC-ME04, BR-ME06, BR-ME07, BR-ME10 | — (chưa sinh — §5) | chưa có — dự kiến `S3-ung-vien-…` |
| S4 | Sửa số lượng (dialog) | UC-ME07, BR-ME08, AC-ME05 | — (chưa sinh — §5) | chưa có — dự kiến `S4-sua-so-luong-…` |
| S5 | Xác nhận duyệt / từ chối / đóng tin (dialog) | UC-ME04 bước 3, UC-ME07, BR-ME07, BR-ME10 | — (chưa sinh — §5) | chưa có — dự kiến `S5-xac-nhan-duyet-…` |
| S6 | Khai báo trận ngoài hệ thống (form) | UC-ME01 A1, BR-ME19, AC-ME11 | — (chưa sinh — §5) | chưa có — dự kiến `S6-khai-bao-tran-ngoai-…` |
| S7 | Chi tiết / sửa / huỷ trận ngoài | BR-ME19, BR-ME09, AC-ME11 | — (chưa sinh — §5) | chưa có — dự kiến `S7-tran-ngoai-chi-tiet-…` |
| S8 | Đánh giá sau trận (dialog, hai chiều) | UC-ME06, BR-ME12, BR-ME13, AC-ME07 | — (chưa sinh — §5) | chưa có — dự kiến `S8-danh-gia-…` |
| S9 | Report (dialog, hai chiều) | UC-ME08, BR-ME14, BR-R09, AC-ME08 | — (chưa sinh — §5) | chưa có — dự kiến `S9-report-…` |
| S10 | Report liên quan mercenary của đội | UC-ME08, BR-ME14, BR-R10 | — (chưa sinh — §5) | chưa có — dự kiến `S10-report-doi-…` |
| S11 | Mercenary đánh giá (mục hồ sơ đội) | UC-ME06 bước 4, BR-ME13 | — (chưa sinh — §5) | chưa có — dự kiến `S11-mercenary-danh-gia-doi-…` |
| S12 | Tìm kèo mercenary (GPS / không GPS) | UC-ME02, BR-ME03, BR-ME04, BR-ME17, BC-ME03..05, AC-ME02 | `974c71fe58ae438f9bc9604620eea100` / — (mobile chưa sinh) | `S12-tim-keo-desktop.{png,html}` (mobile: chưa có) |
| S13 | Chi tiết tin tuyển (góc nhìn người tìm kèo) | UC-ME02 bước 6, UC-ME03, BR-ME04, BR-ME06 | — (chưa sinh — §5) | chưa có — dự kiến `S13-chi-tiet-tin-…` |
| S14 | Kèo mercenary của tôi (đơn của tôi) | UC-ME03, UC-ME05, BR-ME04, BR-ME09 | — (chưa sinh — §5) | chưa có — dự kiến `S14-keo-cua-toi-…` |
| S15 | Chi tiết đơn (mercenary đã duyệt) | UC-ME05, UC-ME06, BR-ME04, BR-ME11 | — (chưa sinh — §5) | chưa có — dự kiến `S15-chi-tiet-don-…` |
| S16 | Rút đơn / rút lui (dialog) | UC-ME03 A1, UC-ME05, BR-ME11, AC-ME03 | — (chưa sinh — §5) | chưa có — dự kiến `S16-rut-lui-…` |
| S17 | Report của tôi (vai trò mercenary) | UC-ME08, BR-ME14 | — (chưa sinh — §5) | chưa có — dự kiến `S17-report-cua-toi-…` |
| S18 | Uy tín cá nhân | BR-ME15, Business_Rules §3.1–§3.3, §8.2, AC-ME09 | — (chưa sinh — §5) | chưa có — dự kiến `S18-uy-tin-ca-nhan-…` |
| S19 | Phòng chat theo đơn — đầu phòng + trạng thái chỉ xem | UC-ME09, BR-ME16, BR-ME04 (ngoại lệ chat), AC-ME10 | — (chưa sinh — §5) | chưa có — dự kiến `S19-chat-don-…` |
| S20 | Admin: hàng chờ tranh chấp mercenary | UC-ME08 bước 4, BR-ME14 | — (chưa sinh — §5) | chưa có — dự kiến `S20-admin-tranh-chap-…` |
| S21 | Admin: chi tiết + quyết định tranh chấp | UC-ME08 bước 4, BR-ME14, BR-R05, BR-R06 | — (chưa sinh — §5) | chưa có — dự kiến `S21-admin-tranh-chap-chi-tiet-…` |

## 2. Chi tiết từng màn hình

> Nhãn tiếng Việt của trạng thái (tin, đơn, report, mức uy tín) là **đề xuất** — SRS / API_Spec chỉ có mã enum (§4 mục 6).
> Mỗi mục "Không implement" liệt kê phần Stitch tự thêm hoặc vẽ lệch mô tả — code bỏ qua.

### S1 — Đăng tin tuyển (dialog)
- **Mục đích:** đội trưởng đội tạo kèo hoặc đội đã ghép tạo tin tuyển cho trận đã ghép (UC-ME01). Mỗi vị trí chọn thành một tin riêng (BR-ME05).
- **Thành phần UI chính:** desktop là dialog trên nền chi tiết kèo; mobile là bottom sheet.
  - Tiêu đề "Tuyển mercenary", dòng phụ "Chọn vị trí cần thêm người. Mỗi vị trí tạo một tin tuyển riêng."
  - Nhóm radio "Tuyển cho đội" — **chỉ hiện** khi người dùng là đội trưởng cả hai đội của trận (API_Spec §1.2, BR-M18).
  - 4 dòng vị trí: checkbox + tên (Thủ môn / Hậu vệ / Tiền vệ / Tiền đạo) + bộ tăng giảm số lượng 1–10.
  - Nút "Huỷ", nút chính "Đăng n tin tuyển" (n = số vị trí đã chọn).
- **Dữ liệu:** vị trí (BR-ME05, nhãn như `preferredPosition`), số lượng 1–10 (BR-ME05).
- **Thao tác:**
  - Đăng thành công → đóng dialog, toast "Đã đăng n tin tuyển", sang S2 lọc theo trận.
  - Vị trí đã có tin `OPEN`/`FILLED` → dòng bị khoá, ghi chú "Đã có tin đang mở · tăng số lượng ở tin đó" (link sang S4 của tin đó) (BR-ME05).
- **Trạng thái:**
  - *Validation:* chưa chọn vị trí nào → nút đăng bị disable; số lượng ngoài 1–10 → lỗi cạnh dòng.
  - *Lỗi nghiệp vụ (banner `role="alert"` trong dialog):* "Chỉ có thể tuyển mercenary sau khi kèo đã ghép" (UC-ME01 3a); "Trận đã bắt đầu" (UC-ME01 3b) — ẩn nút "Tuyển mercenary" ở chi tiết kèo; "Đội đã có tin đang mở cho vị trí này, hãy tăng số lượng" (mockup vẽ trạng thái này); đội tạm ngưng / giải tán.
  - *Đang gửi:* nút đăng disable + spinner.
- **Responsive / a11y:** mỗi checkbox có `label` là tên vị trí; bộ tăng giảm có `aria-label` "Giảm/Tăng số lượng <vị trí>" và ô số `inputmode="numeric"`. Focus giữ trong dialog; `Esc` đóng.

### S2 — Tuyển mercenary của đội
- **Mục đích:** đội trưởng quản lý mọi tin tuyển và trận ngoài hệ thống của đội (UC-ME07, UC-ME01 A1).
- **Thành phần UI chính:**
  - Breadcrumb "Đội của tôi › <đội> › Tuyển mercenary"; nút chính "Khai báo trận ngoài hệ thống" → S6.
  - Hai tab: "Tin tuyển" | "Trận ngoài hệ thống".
  - **Tab Tin tuyển:** chip lọc "Đang tuyển" (mặc định = Đang mở + Đủ người) / "Đang mở" / "Đủ người" / "Đã đóng" / "Hết hạn" / "Tất cả". Tin nhóm theo trận, xếp theo giờ bắt đầu tăng dần. Tiêu đề nhóm: loại trận ("Kèo đã ghép" hoặc "Trận ngoài hệ thống · Đối thủ: …"), giờ, tên sân.
  - Dòng tin: vị trí, badge trạng thái, "Đã duyệt x/y", badge "n đơn chờ duyệt", nút "Xem ứng viên" (S3), "Sửa số lượng" (S4), "Đóng tin" (S5 biến thể đóng tin).
  - **Tab Trận ngoài hệ thống:** danh sách trận ngoài, lọc "Sắp diễn ra" (mặc định) / "Đã kết thúc" / "Đã huỷ" / "Tất cả"; bấm thẻ → S7. (Mockup S7 vẽ danh sách này ở cột trái.)
- **Thao tác theo trạng thái tin (API_Spec §3.1):**
  - `Đang mở` / `Đủ người`: hiện "Sửa số lượng", "Đóng tin".
  - `Đã đóng` / `Hết hạn`: chỉ "Xem ứng viên".
  - Từ giờ bắt đầu trận: vẫn sửa (chỉ giảm) và đóng được (BR-ME08).
- **Trạng thái:**
  - *Loading:* skeleton dòng tin. *Empty:* "Chưa có tin tuyển nào" + gợi ý "Tuyển mercenary từ trang chi tiết kèo đã ghép hoặc khai báo trận ngoài hệ thống".
  - *Đội tạm ngưng:* banner vàng "Đội đang tạm ngưng: không tạo tin, sửa số lượng hay duyệt được; vẫn đóng tin và từ chối đơn." (BR-ME05) — ẩn "Sửa số lượng", nút "Khai báo trận ngoài".
  - *Đội đã giải tán:* không vào được màn (lỗi `TEAM_016`) → khung lỗi chung.
  - *Error tải:* khung lỗi chung + "Thử lại".
- **Responsive / a11y:** mobile: tab và chip cuộn ngang; nút "Khai báo trận ngoài hệ thống" đặt trong tab Trận ngoài. Badge trạng thái luôn có chữ. Tab dùng `role="tablist"`.

### S3 — Ứng viên của tin (góc nhìn đội trưởng)
- **Mục đích:** xem hồ sơ, đánh giá, điểm uy tín của ứng viên để duyệt / từ chối (UC-ME04 bước 1–2).
- **Thành phần UI chính:**
  - Thẻ tóm tắt tin: vị trí, badge trạng thái, "Đã duyệt x/y", trận, tên sân + địa chỉ (đội trưởng luôn thấy — BR-ME04), nút "Sửa số lượng", "Đóng tin".
  - Tab trạng thái đơn: "Chờ duyệt (n)" (mặc định) / "Đã duyệt" / "Bị từ chối" / "Đã rút" / "Tất cả"; ghi chú "Xếp theo thời gian ứng tuyển, ai đến trước xếp trước".
  - Thẻ ứng viên: avatar, tên, vị trí ưa thích; khối uy tín (điểm + nhãn mức, "Mới tham gia x/5 trận" hoặc "Tỉ lệ hoàn thành n%", "★ 4.7 (3 đánh giá)", huy hiệu "Đã xác minh"); "Ứng tuyển lúc …".
  - Nút: "Nhắn tin" (→ phòng chat của đơn, S19), "Từ chối" (viền màu lỗi), "Duyệt" (chính). Cả hai qua dialog xác nhận S5 (UC-ME04 bước 3).
  - **Tab "Đã duyệt" sau khi trận kết thúc:** mỗi thẻ có "Đánh giá" (S8) và "Report" (S9); đã đánh giá → hiện kết quả đã gửi thay nút (API_Spec §3.2).
- **Thao tác / quy tắc hiển thị nút:**
  - Tin `Đủ người`: "Duyệt" disable, chú thích "Tin đã đủ người — tăng số lượng để duyệt thêm" (BR-ME07); vẫn "Từ chối".
  - Từ giờ bắt đầu trận: ẩn "Duyệt" (BR-ME07); vẫn "Từ chối".
  - Đơn đã duyệt không có nút huỷ duyệt (BR-ME10).
  - Duyệt bị chặn vì ứng viên vừa vào đội / vừa được duyệt trận trùng giờ → toast lỗi, đơn giữ "Chờ duyệt" (UC-ME04 4a).
- **Trạng thái:** *Loading:* skeleton thẻ. *Empty theo tab:* "Chưa có ứng viên". *Đơn vừa đổi trạng thái* (ứng viên đã rút) → toast "Trạng thái đơn đã thay đổi, vui lòng tải lại" + tải lại danh sách.
- **Responsive / a11y:** mobile 1 cột, ba nút xếp hàng dưới thẻ (Duyệt full-width). Nhãn mức uy tín đi kèm chữ (không chỉ màu vàng/đỏ). Sao có `aria-label` "Trung bình 4,7 sao trên 3 đánh giá".

### S4 — Sửa số lượng (dialog)
- **Mục đích:** đổi số người cần tuyển của tin (UC-ME07, BR-ME08). Không đổi vị trí.
- **Thành phần UI chính:** tiêu đề "Sửa số lượng · <vị trí>", dòng "Đã duyệt n người · vị trí không đổi được", ô số có nút –/+ (1–10), gợi ý "Bằng số đã duyệt → tin chuyển Đủ người; lớn hơn → tin mở lại", nút "Huỷ" / "Lưu".
- **Trạng thái:**
  - *Validation (mockup vẽ):* thấp hơn số đã duyệt → "Số lượng không được thấp hơn số người đã duyệt" (UC-ME07 1a, AC-ME05).
  - Từ giờ bắt đầu trận: nút "+" bị khoá vượt quá số hiện tại, chú thích "Trận đã bắt đầu — chỉ giảm được số lượng" (BR-ME08).
  - Tin vừa đóng / hết hạn → toast lỗi, đóng dialog, tải lại.
- **Responsive / a11y:** bottom sheet trên mobile; lỗi gắn ô số qua `aria-describedby`.

### S5 — Xác nhận duyệt / từ chối / đóng tin (dialog)
- **Mục đích:** bước xác nhận của UC-ME04 bước 3 và đóng tin UC-ME07. Mockup vẽ biến thể **duyệt**; hai biến thể còn lại dùng cùng khung.
- **Nội dung theo biến thể:**
  - *Duyệt:* "Duyệt <tên>?" — "<tên> sẽ thấy tên sân, địa chỉ và tên đội trưởng. Bạn không thể huỷ duyệt sau khi xác nhận; chỉ mercenary tự rút lui được." (BR-ME04, BR-ME10); dòng "Sau khi duyệt: x/y — tin chuyển Đủ người" khi đủ. Nút chính "Duyệt".
  - *Từ chối:* "Từ chối <tên>?" — "Ứng viên sẽ nhận thông báo. Việc từ chối không ảnh hưởng uy tín của ứng viên." Nút màu lỗi "Từ chối".
  - *Đóng tin:* "Đóng tin <vị trí>?" — "n đơn đang chờ sẽ bị từ chối và ứng viên nhận thông báo. Người đã duyệt giữ nguyên. Không mở lại được tin đã đóng." (BR-ME07, BR-ME08). Nút màu lỗi "Đóng tin".
- **Trạng thái:** đang xử lý → nút disable + spinner; lỗi → banner trong dialog (vd "Tin tuyển đã đủ người", "Trận đã bắt đầu").
- **Responsive / a11y:** `role="alertdialog"`; focus mặc định ở "Huỷ"; `Esc` đóng.

### S6 — Khai báo trận ngoài hệ thống (form)
- **Mục đích:** tuyển cho trận không ghép qua ArenaFlow (UC-ME01 A1, BR-ME19, AC-ME11). Một lần gửi tạo trận ngoài + mỗi vị trí một tin.
- **Trường của form:**

  | Trường | Điều khiển | Quy tắc |
  |---|---|---|
  | Sân `*` | combobox có tìm kiếm từ danh sách địa điểm + link "Chưa có sân? Thêm địa điểm" | BR-ME19 (thêm địa điểm theo VENUE-001) |
  | Giờ bắt đầu `*` | chọn ngày + giờ | ≥ hiện tại + 1 giờ (BR-ME19, BR-M01) |
  | Giờ kết thúc `*` | chọn ngày + giờ | sau giờ bắt đầu, không quá 12 giờ (BR-ME19, BR-M16) |
  | Trình độ | chip chọn tối đa 3 trong 9 nhãn; bỏ trống = mọi trình độ | như kèo (MATCH-001) |
  | Tên đối thủ (tuỳ chọn) | input, bộ đếm `n/100` | ≤ 100 ký tự |
  | Vị trí cần tuyển `*` | 4 dòng checkbox + số lượng 1–10 (giống S1) | BR-ME05 |

- **Thao tác:** "Khai báo và đăng tin" thành công → toast, sang S7 của trận vừa tạo. "Huỷ" → S2.
- **Trạng thái:**
  - *Validation (mockup vẽ):* "Giờ kết thúc phải sau giờ bắt đầu và không quá 12 giờ". Lỗi khác hiện dưới trường.
  - *Lỗi nghiệp vụ:* sân đã ngừng hoạt động → "Chọn sân khác"; đội tạm ngưng / giải tán → banner.
  - *Đang gửi:* nút disable + spinner.
- **Responsive / a11y:** mobile 1 cột, nút cố định cuối màn. Trường bắt buộc có `*` + `aria-required`.

### S7 — Chi tiết / sửa / huỷ trận ngoài
- **Mục đích:** sửa thông tin, thêm vị trí, huỷ trận ngoài (BR-ME19, BR-ME09).
- **Thành phần UI chính:**
  - Tiêu đề "Trận ngoài · Đối thủ: …", badge "Đã khai báo" / "Đã huỷ" / "Đã kết thúc" (kết thúc tính theo giờ kết thúc).
  - Form sửa: Sân, Giờ, Trình độ, Tên đối thủ + "Lưu thay đổi".
  - Khối "Tin tuyển của trận": dòng tin + "Xem ứng viên"; nút viền "Thêm vị trí" (mở dialog giống S1, không có chọn đội).
  - Vùng nguy hiểm: "Huỷ trận ngoài" + mô tả hậu quả; mở dialog xác nhận (khung S5, nút màu lỗi): "Mọi tin sẽ đóng, đơn chờ bị từ chối, mercenary đã duyệt nhận thông báo; không ai bị trừ điểm."
  - Desktop: cột trái liệt kê trận ngoài của đội (lọc Sắp diễn ra / Đã kết thúc / Đã huỷ / Tất cả).
- **Quy tắc khoá (mockup vẽ trạng thái đã có mercenary được duyệt):**
  - Đã có mercenary được duyệt → khoá Sân / Giờ / Trình độ (icon ổ khoá), banner "Đã có mercenary được duyệt nên không sửa được sân, giờ và trình độ. Vẫn sửa được tên đối thủ." (BR-ME19, AC-ME11).
  - Từ giờ bắt đầu → chỉ sửa tên đối thủ; ẩn "Huỷ trận ngoài", "Thêm vị trí".
  - Đã kết thúc / đã huỷ → chỉ xem.
- **Trạng thái:** loading skeleton; lỗi tải → khung lỗi chung; dữ liệu vừa đổi (có người được duyệt) → toast + tải lại + khoá ô.
- **Responsive / a11y:** mobile bỏ cột danh sách (vào từ tab Trận ngoài ở S2). Ô bị khoá dùng `disabled` + chú thích đọc được.

### S8 — Đánh giá sau trận (dialog)
- **Mục đích:** sau trận, đội trưởng đánh giá từng mercenary đã tham gia; mercenary đánh giá đội (UC-ME06, BR-ME12, BR-ME13).
- **Biến thể:**
  - *Đội trưởng → mercenary (mockup vẽ):* 5 sao + nút bật "Không đến" (chọn thì tắt sao); nhận xét tuỳ chọn ≤ 500; ghi chú "Mỗi người chỉ đánh giá một lần, không sửa được." Gửi "Không đến" thành công → hỏi tiếp "Bạn có muốn report bùng không?" → mở S9 với loại "Bùng" (API_Spec 2.18).
  - *Mercenary → đội:* tiêu đề "Đánh giá <đội>", chỉ 1–5 sao + nhận xét; **không** có "Không đến". Mở từ S14 / S15.
- **Điểm vào:** đội trưởng — S3 tab "Đã duyệt"; mercenary — S14, S15. Chỉ hiện khi trận đã kết thúc và đơn còn "Đã duyệt" lúc kết thúc; trận bị huỷ → không hiện (UC-ME06 3b).
- **Trạng thái:** chưa chọn sao/Không đến → nút gửi disable; "Bạn đã đánh giá người chơi này" (UC-ME06 3a) → đóng dialog, hiện kết quả; "trận vừa kết thúc" → "Thử lại sau ít phút".
- **Responsive / a11y:** sao là nhóm radio (`role="radiogroup"`, mỗi sao `aria-label` "n sao"), dùng phím mũi tên được.

### S9 — Report (dialog, dùng chung hai phía)
- **Mục đích:** đội trưởng report mercenary hoặc mercenary / ứng viên report đội (UC-ME08, BR-ME14).
- **Thành phần UI chính:** tiêu đề "Report <tên bên kia>", dòng phụ "Report được ghi nhận ngay và trừ điểm uy tín bên bị report"; radio 4 loại "Bùng" / "Chơi xấu" / "Giao tiếp tệ" / "Không đúng trình độ"; ô "Lý do `*`" 1–1000, bộ đếm; "Huỷ" / "Gửi report" (màu lỗi).
- **Quy tắc loại được chọn:**
  - Trận đã kết thúc + đơn đã duyệt (đã tham gia): cả 4 loại.
  - Chỉ có ngữ cảnh tin nhắn (đơn chưa tham gia trận, đã có tin nhắn): chỉ "Giao tiếp tệ"; loại khác disable kèm chú thích; banner "Đơn này chỉ report được giao tiếp tệ" — **mockup vẽ trạng thái này**.
  - Loại đã report trong trận → disable, nhãn "Đã report".
  - Chưa tham gia và chưa có tin nhắn → ẩn nút "Report" ở nơi gọi.
- **Điểm vào:** menu "Report" ở đầu phòng chat (S19), S15 (mercenary), S3 tab "Đã duyệt" (đội trưởng), sau đánh giá "Không đến" (S8).
- **Trạng thái:** lý do trống → "Vui lòng nhập lý do"; đội tạm ngưng (phía đội) → banner; đang gửi → disable.
- **Responsive / a11y:** radio có `label`; mô tả loại "Giao tiếp tệ" theo REPUTATION-001 §4.1 có thể hiện dạng chú thích nhỏ.

### S10 — Report liên quan mercenary của đội
- **Mục đích:** đội trưởng xem report đội nhận từ mercenary và đội đã gửi cho mercenary (UC-ME08, BR-ME14).
- **Thành phần UI chính:** tab cấp 1 "Giữa hai đội" (REPUTATION-001) | "Mercenary"; tab cấp 2 "Đội nhận" (mặc định) | "Đội đã gửi". Thẻ report mới nhất trước: mercenary, giờ trận (+ nhãn "Trận ngoài hệ thống"), chip loại, badge trạng thái, lý do, "Điểm đội bị trừ: −n" (chỉ tab nhận), bằng chứng tranh chấp nếu có.
- **Thao tác:** report bùng còn hạn ở tab "Đội nhận" → "Hạn tranh chấp: <giờ>" + nút "Tranh chấp" → dialog tranh chấp của REPUTATION-001 (nhập bằng chứng 1–1000).
- **Trạng thái:** empty "Chưa có report nào"; đội tạm ngưng / giải tán → không xem được (BR-R10), hiện khung thông báo.
- **Responsive / a11y:** mobile tab cuộn ngang, thẻ 1 cột.

### S11 — Mercenary đánh giá (mục hồ sơ đội)
- **Mục đích:** hiển thị riêng đánh giá của mercenary dành cho đội (BR-ME13), không gộp vào sao trung bình đội.
- **Thành phần UI chính:** tab "Mercenary đánh giá" trên hồ sơ đội; ghi chú "Đánh giá từ người đá thuê, hiển thị riêng, không tính vào sao trung bình của đội."; dòng đánh giá: avatar + tên mercenary (hoặc "Người dùng đã xóa"), sao, giờ trận (+ nhãn trận ngoài), nhận xét; phân trang.
- **Quy tắc:** chỉ liệt kê đánh giá mà đội đã đánh giá lại mercenary đó (BR-ME13, BC-R03) — FE chỉ hiển thị dữ liệu trả về.
- **Trạng thái:** empty "Chưa có đánh giá từ mercenary"; loading skeleton.
- **Responsive / a11y:** người xem: mọi người dùng đã đăng nhập; đội ở mọi trạng thái.

### S12 — Tìm kèo mercenary
- **Mục đích:** tìm tin đang tuyển gần mình (UC-ME02).
- **Thành phần UI chính:**
  - Bộ lọc: chỉ báo vị trí ("Đang dùng vị trí của bạn"), thanh trượt "Bán kính" 1–20 km (mặc định 3), chọn "Vị trí cần".
  - Dòng kết quả "n kèo trong bán kính x km · sắp theo khoảng cách"; ghi chú "Tên sân và địa chỉ chỉ hiện sau khi bạn được duyệt".
  - Thẻ kèo: vị trí, "Cần y · đã có x", khoảng cách "2.5 km từ bạn", khu vực "phường, tỉnh", giờ, định dạng sân, trình độ, đội tuyển, nút "Xem chi tiết" (→ S13). Nhãn "Trận ngoài hệ thống · Đối thủ: …" và "Bạn đã ứng tuyển" khi có.
  - Phân trang.
- **Chế độ (BR-ME03):**
  - *Có GPS (desktop vẽ):* theo bán kính, sắp theo khoảng cách.
  - *Không GPS (mobile vẽ):* banner "Bật GPS để tìm kèo gần bạn hơn" + nút "Bật GPS"; nhãn "Đang tìm theo khu vực hồ sơ: <tỉnh> · <phường> lên đầu"; ẩn thanh trượt; thẻ không có khoảng cách; sắp: cùng phường trước, rồi giờ đá.
- **Bảo vệ vị trí (BR-ME04, BC-ME03):** thẻ **không** có tên sân, địa chỉ, toạ độ. Khoảng cách làm tròn 0,5 km (theo API).
- **Trạng thái:**
  - *Loading:* skeleton thẻ.
  - *Empty:* "Chưa có kèo nào trong bán kính x km" + gợi ý "Tăng bán kính" (chế độ GPS) / "Chưa có kèo nào ở <tỉnh>" (không GPS).
  - *Không GPS và hồ sơ chưa có phường (BR-ME17):* khung thông báo "Bật GPS hoặc cập nhật khu vực trong hồ sơ để tìm kèo" + nút "Bật GPS" và "Cập nhật hồ sơ" (→ USER-001 S4).
  - *Error:* khung lỗi chung + "Thử lại".
- **Responsive / a11y:** mobile 1 cột, bộ lọc gọn trên đầu. Thanh trượt có `aria-valuetext` "3 km". Banner GPS `role="status"`.
- **Không implement (mockup desktop):**
  - Khoảng cách "1.2 km", "1.8 km", "2.9 km" — sai quy tắc làm tròn 0,5 km (API_Spec §1.4); chỉ "2.5 km" đúng.
  - Nhãn trình độ "Khá - Nhanh", "Trung bình - Vui vẻ" — không thuộc 9 nhãn trình độ (MATCH-001); chip trình độ hiển thị đúng nhãn API trả về.
  - Điều khiển sắp xếp "Gần nhất trước" — API không có tham số sắp xếp (thứ tự cố định theo chế độ — BR-ME03).
  - Footer "Nền tảng kết nối & đặt kèo…" / "© 2026 ArenaFlow…" — không có trong SRS, khung USER-001 không có footer.
  - Badge số "2" cạnh "Tin nhắn" ở header — dấu chưa đọc thuộc NOTIFICATION-001 / MATCH-001, không thuộc màn này.
  - Avatar đội nhiều màu (HL, DN, PN, SL) — dữ liệu mẫu; dùng `avatarUrl` hoặc avatar mặc định chung.

### S13 — Chi tiết tin tuyển (góc nhìn người tìm kèo)
- **Mục đích:** xem chi tiết tin và ứng tuyển (UC-ME02 bước 6, UC-ME03).
- **Thành phần UI chính:** vị trí, badge trạng thái, "Cần y · đã có x"; khối trận (giờ, định dạng sân, trình độ, khu vực, khoảng cách); khối khoá "Tên sân, địa chỉ và tên đội trưởng sẽ hiện sau khi bạn được duyệt"; khối đội tuyển (link hồ sơ đội — có S11); thanh hành động.
- **Nút theo trạng thái (API_Spec §3.1, §3.2):**
  - Chưa ứng tuyển, tin "Đang mở", chưa tới giờ bắt đầu: "Ứng tuyển" (mockup vẽ) + dòng "Đội trưởng sẽ nhận thông báo. Bạn có thể nhắn tin với đội trưởng ngay sau khi ứng tuyển."
  - Đã ứng tuyển (chờ duyệt): badge "Đã ứng tuyển · Chờ duyệt", nút "Nhắn tin" (S19), "Rút đơn" (S16 biến thể không trừ điểm).
  - Đã duyệt: hiện tên sân, địa chỉ, toạ độ, tên đội trưởng (BR-ME04) — như S15.
  - Không ứng tuyển được: nút disable + lý do: "Bạn là thành viên của đội trong trận, không thể làm mercenary" / "Tin tuyển đã đủ người" / "Trận đã bắt đầu" / "Đã có đơn được duyệt ở trận trùng giờ" / "Đội tuyển hiện không hoạt động" / tin đã đóng / hết hạn (BR-ME06, BR-ME07).
- **Trạng thái:** ứng tuyển thành công → toast "Đã gửi đơn ứng tuyển", thanh hành động chuyển sang trạng thái chờ duyệt; loading skeleton; không tìm thấy tin → "Không tìm thấy tin tuyển" + "Quay lại".
- **Responsive / a11y:** mobile: thanh hành động cố định cuối màn. Khối khoá có icon + chữ.

### S14 — Kèo mercenary của tôi
- **Mục đích:** xem đơn đang chờ, đã duyệt (thấy sân) và lịch sử (UC-ME03, UC-ME05).
- **Thành phần UI chính:** chip lọc "Đang hoạt động" (mặc định = chờ duyệt + đã duyệt) / "Chờ duyệt" / "Đã duyệt" / "Bị từ chối" / "Đã rút" / "Tất cả"; thẻ đơn mới nhất trước: badge trạng thái, "vị trí · đội", giờ; đơn đã duyệt có tên sân + địa chỉ + "Đội trưởng: …" (BR-ME04); đơn chưa duyệt chỉ có khu vực.
- **Nút theo trạng thái:** chờ duyệt → "Nhắn tin", "Rút đơn"; đã duyệt trước giờ bắt đầu → "Nhắn tin", "Xem đơn" (rút lui ở S15); trận đã kết thúc → "Đánh giá đội" (S8) khi chưa đánh giá; bị từ chối / đã rút → "Xem chat" (chỉ xem).
- **Nhãn phụ:** "Trận đã huỷ" + "Trận bị huỷ — bạn không bị trừ điểm" (BR-ME09); "Trận đã kết thúc".
- **Trạng thái:** empty theo tab "Bạn chưa có đơn ứng tuyển nào" + nút "Tìm kèo mercenary" (S12); loading skeleton; error khung lỗi chung.
- **Responsive / a11y:** mobile chip cuộn ngang, thẻ 1 cột.

### S15 — Chi tiết đơn (mercenary đã duyệt)
- **Mục đích:** xem thông tin sân sau khi được duyệt, nhắn tin, rút lui, đánh giá / report sau trận (UC-ME05, UC-ME06, UC-ME08).
- **Thành phần UI chính:** badge "Đã duyệt" + "Duyệt lúc …"; thẻ trận; thẻ sân mở khoá (tên, địa chỉ, toạ độ) (BR-ME04); "Đội trưởng: …"; nút "Nhắn tin với đội trưởng"; nút viền màu lỗi "Rút lui" + chú thích mức trừ dự kiến tính theo giờ bắt đầu (BR-ME11); khối "Sau trận" (Đánh giá đội, Report) mờ tới khi trận kết thúc.
- **Theo trạng thái (API_Spec §3.2):** từ giờ bắt đầu → ẩn "Rút lui"; trận kết thúc → mở "Đánh giá đội" (S8), "Report" (S9 đủ 4 loại); trận bị huỷ → banner "Trận đã bị huỷ — bạn không bị trừ điểm, không đánh giá"; vẫn nhắn tin được.
- **Trạng thái:** loading skeleton; không phải đơn của mình → "Bạn không tham gia đơn ứng tuyển này" + "Quay lại".
- **Responsive / a11y:** mobile 1 cột, nút "Nhắn tin" full-width. Toạ độ chỉ hiển thị chữ — `[cần xác nhận]` nút "Mở bản đồ" (§4 mục 4).

### S16 — Rút đơn / rút lui (dialog)
- **Mục đích:** xác nhận rút (UC-ME03 A1, UC-ME05).
- **Biến thể:**
  - *Rút lui sau khi được duyệt (mockup vẽ):* "Rút lui khỏi trận?"; hộp cảnh báo màu lỗi "Còn n giờ đến giờ bắt đầu: bạn sẽ bị trừ x điểm uy tín và chuỗi trận sạch về 0."; bảng mức trừ "Từ 24 giờ trở lên: −1 · Từ 4 đến dưới 24 giờ: −3 · Dưới 4 giờ: −5" (BR-ME11, AC-ME03); nút "Giữ đơn" (focus mặc định) / "Rút lui" (màu lỗi).
  - *Rút đơn đang chờ:* "Rút đơn ứng tuyển?" — "Rút đơn đang chờ không ảnh hưởng uy tín." Nút "Rút đơn".
- **Trạng thái:** đơn vừa được duyệt / vừa bị từ chối khi đang mở dialog → "Trạng thái đơn đã thay đổi, vui lòng tải lại" (tải lại, cho chọn lại — không rút); trận đã bắt đầu → "Trận đã bắt đầu — không rút lui được"; thành công → toast "Đã rút lui · bị trừ x điểm" / "Đã rút đơn".
- **Responsive / a11y:** `role="alertdialog"`; mức trừ đọc được bằng chữ, không chỉ màu.

### S17 — Report của tôi (vai trò mercenary)
- **Mục đích:** xem report tôi nhận từ đội trưởng và report tôi đã gửi cho đội (UC-ME08).
- **Thành phần UI chính:** tab "Tôi nhận" (mặc định) / "Tôi đã gửi"; thẻ: đội, giờ trận, chip loại, badge trạng thái, lý do, "Điểm bị trừ: −n" (tab nhận); report bùng còn hạn → "Hạn tranh chấp: …" + "Tranh chấp" (dialog REPUTATION-001); report bị Admin bác → "Đã hoàn n điểm".
- **Trạng thái:** empty "Chưa có report nào"; loading; error.
- **Responsive / a11y:** như S10. Điểm vào: menu avatar / hồ sơ cá nhân — `[cần xác nhận]` (§4 mục 1).

### S18 — Uy tín cá nhân
- **Mục đích:** hiển thị uy tín mercenary của một người (BR-ME15, §3.1–§3.3, §8.2). Dùng ở hồ sơ của chính mình, hồ sơ người chơi khác; khối rút gọn dùng trong thẻ ứng viên S3.
- **Thành phần UI chính:** điểm "82 / 100" + nhãn mức (4 mức theo REPUTATION-001: 95–100, 70–94, 50–69, 0–49); "Tỉ lệ hoàn thành" — dưới 5 trận được tính hiện "Mới tham gia x/5 trận" + thanh tiến độ, từ 5 trận hiện phần trăm; "Sao trung bình" + số đánh giá; huy hiệu "Đã xác minh" / "Chưa xác minh" + chú thích 4 điều kiện.
- **Trạng thái:** chưa có sao → "Chưa có đánh giá"; người dùng không tồn tại / đã xoá → "Không tìm thấy người dùng"; loading skeleton.
- **Responsive / a11y:** điểm có `aria-label` "Điểm uy tín 82 trên 100, mức Bình thường".

### S19 — Phòng chat theo đơn (đầu phòng + trạng thái chỉ xem)
- **Mục đích:** chat 1–1 đội trưởng ↔ ứng viên (UC-ME09, BR-ME16). Thân phòng chat, danh sách tin, realtime, "Tin nhắn của tôi" **dùng chung MATCH-001**; màn này chỉ quy định phần khác.
- **Phần riêng của chat theo đơn:**
  - Đầu phòng: đội tuyển + "Đội trưởng <tên>" (luôn hiện, kể cả đơn chờ duyệt — BR-ME04 ngoại lệ chat) và ứng viên; thẻ tóm tắt đơn "Ứng tuyển <vị trí> · <giờ trận>", badge trạng thái đơn, link "Xem đơn" (S15 / S3); menu ba chấm "Report" (S9).
  - Góc nhìn đội trưởng, đơn chờ duyệt: nút nhanh "Từ chối", "Duyệt" (qua S5).
  - Tin của bên đội hiển thị "<tên đội> · <người gửi>" (BR-ME16, như BR-N03).
  - Ô soạn 1–1000 ký tự, bộ đếm.
- **Trạng thái:**
  - *Chỉ xem (mobile vẽ):* đơn bị từ chối / đã rút → ô soạn khoá, dòng "Đơn đã bị từ chối — bạn chỉ xem được lịch sử tin nhắn" (biến thể "Bạn đã rút đơn — …").
  - *Đội tuyển đã giải tán, người xem là người đã giải tán:* ô soạn khoá, "Đội đã giải tán — bạn chỉ xem được lịch sử tin nhắn" (BR-ME16).
  - Trạng thái đơn đổi khi đang mở phòng (duyệt / từ chối / rút) → badge cập nhật, nút nhanh cập nhật.
  - Gửi lỗi vì đơn vừa chuyển chỉ xem → khoá ô soạn + thông báo.
- **Responsive / a11y:** mobile: thẻ tóm tắt đơn thu gọn 1 dòng dưới đầu phòng. Danh sách tin `role="log"`, `aria-live="polite"`.

### S20 — Admin: hàng chờ tranh chấp mercenary
- **Mục đích:** Admin xem tranh chấp report bùng giữa đội trưởng và mercenary (UC-ME08 bước 4, BR-ME14 — hàng chờ riêng).
- **Thành phần UI chính:** layout quản trị (như USER-001 S13), menu "Tranh chấp mercenary"; tab "Chờ xử lý (n)" (mặc định) / "Đã quyết định" / "Tất cả"; bảng: Trận (+ nhãn trận ngoài), Bên report ("Đội → Mercenary" / "Mercenary → Đội"), Đội tuyển + trạng thái đội, Mercenary, Người tranh chấp, Gửi tranh chấp lúc, Trạng thái, "Xem chi tiết" (S21); phân trang.
- **Dữ liệu:** Admin thấy tên thật kèm nhãn "(đã xoá tài khoản)" khi người đó đã xoá (ADR-0002, API_Spec §1.1).
- **Trạng thái:** empty "Không có tranh chấp nào đang chờ"; không phải Admin → ẩn menu.
- **Responsive / a11y:** mobile: bảng thành danh sách thẻ. Bảng có `<th scope="col">`.

### S21 — Admin: chi tiết + quyết định tranh chấp
- **Mục đích:** xem report, bằng chứng, đánh giá hai bên; quyết định (UC-ME08 bước 4, BR-R05, BR-R06).
- **Thành phần UI chính:** khối trận (môn, giờ, sân, trạng thái, đối thủ nếu trận ngoài), vị trí; hai cột đội tuyển / mercenary với điểm uy tín hiện tại, người report, người tranh chấp; khối report (loại, lý do, thời điểm, điểm đã trừ); khối bằng chứng; khối đánh giá hai bên đã gửi (0–2); ghi chú "Admin không xem được nội dung chat."; form quyết định: radio "Report đúng (giữ điểm đã trừ)" / "Bác report (hoàn n điểm cho bên bị report)", "Lý do quyết định `*`" 1–500 + bộ đếm, nút "Xác nhận quyết định", ghi chú "Quyết định là cuối cùng, hai bên nhận thông báo."
- **Trạng thái:** *Validation (mockup vẽ):* "Vui lòng nhập lý do"; đã quyết định → form ẩn, hiện kết quả + người xử lý + thời điểm; tranh chấp vừa được Admin khác quyết định → thông báo + tải lại.
- **Responsive / a11y:** mobile 1 cột; radio có `label`.

## 3. Thành phần dùng chung giữa các màn hình
- **Khung app, layout quản trị, dialog / bottom sheet, phân trang, hiển thị người dùng đã xoá, theme:** USER-001 `UI_Design.md` §3.
- **Header ứng dụng:** mockup MERCENARY-001 thêm mục "Tìm kèo mercenary", "Kèo mercenary của tôi", "Tin nhắn" cạnh "Đội của tôi" — `[cần xác nhận]` (§4 mục 1).
- **Chip vị trí** (Thủ môn / Hậu vệ / Tiền vệ / Tiền đạo): S1, S2, S3, S6, S12–S15.
- **Bộ chọn vị trí + số lượng** (checkbox + tăng giảm 1–10): S1, S6, dialog "Thêm vị trí" ở S7.
- **Badge trạng thái tin:** Đang mở / Đủ người / Đã đóng / Hết hạn. **Badge trạng thái đơn:** Chờ duyệt / Đã duyệt / Bị từ chối / Đã rút. **Badge report:** Đã chấp nhận tự động / Đang tranh chấp / Xác nhận / Admin bác. Luôn có chữ.
- **Nhãn "Trận ngoài hệ thống · Đối thủ: …":** S2, S7, S10–S12, S14, S20.
- **Khối khoá vị trí sân** ("Tên sân và địa chỉ chỉ hiện sau khi bạn được duyệt"): S12, S13.
- **Khối uy tín cá nhân** (đầy đủ ở S18, rút gọn ở thẻ ứng viên S3).
- **Thẻ report** (S10, S17) và **dialog xác nhận** (S5, S16, huỷ trận ngoài ở S7).
- **Theme:** project Stitch `ArenaFlow` — font Be Vietnam Pro, primary `#3d6943`, error `#a73b21`, nền `#f8faf3`, bo góc 8px.

## 4. `[cần xác nhận]`
> Không chặn thiết kế UI (user duyệt trước toàn bộ UI/UX 2026-11-27); cần chốt trước hoặc trong lúc làm `solution-architect`. Phần thuộc hợp đồng API / nghiệp vụ → đề xuất ở repo BE.

1. **Điều hướng / điểm vào:** header mockup thêm "Tìm kèo mercenary", "Kèo mercenary của tôi", "Tin nhắn" (USER-001 chỉ có "Đội của tôi"); MATCH-001 / NOTIFICATION-001 đang vẽ song song có thể đặt điều hướng khác → cần thống nhất khung điều hướng chung. Điểm vào S2 (từ chi tiết đội), S10, S17 (menu avatar / hồ sơ) chưa chốt.
2. **Vị trí nút "Tuyển mercenary"** trên chi tiết kèo đã ghép thuộc MATCH-001; S1 vẽ nền giả lập.
3. **Vị trí S11 và S18 trên hồ sơ:** USER-001 S8a (chi tiết đội) và S3 (hồ sơ cá nhân) chưa có tab; chưa có màn "hồ sơ người chơi khác" (để đội trưởng xem uy tín ứng viên đầy đủ). Cần thống nhất với USER-001 / REPUTATION-001.
4. **"Mở bản đồ" (S15):** SRS cho mercenary đã duyệt thấy toạ độ (BR-ME04) nhưng không nói mở bản đồ ngoài; mockup có nút — chỉ hiển thị chữ nếu không chốt.
5. **Luồng bật GPS trên web (S12):** trình duyệt từ chối quyền thì nút "Bật GPS" không xin lại được; cần chốt nội dung hướng dẫn khi quyền đã bị chặn (BC-ME05 chỉ nói dựa vào quyền hệ điều hành).
6. **Nhãn tiếng Việt cho enum:** trạng thái tin / đơn / report / tranh chấp và 4 mức `reliabilityLevel` (đề xuất: Xuất sắc / Bình thường / Cảnh báo / Cảnh báo đỏ) — SRS/API chỉ có mã; cần thống nhất với REPUTATION-001.
7. **Danh mục 9 nhãn trình độ (S6):** lấy theo MATCH-001; mockup chỉ vẽ vài nhãn mẫu.
8. **Dialog tranh chấp cho mercenary (S17):** tái dùng dialog tranh chấp của REPUTATION-001 (thiết kế đang làm song song, chưa có bản đã duyệt).
9. **Cấu trúc tab Report của đội (S10):** giả định tab "Giữa hai đội" (REPUTATION-001) | "Mercenary"; cần khớp với màn report đội của REPUTATION-001.
10. **Menu Admin (S20):** thêm mục "Tranh chấp mercenary" tách khỏi hàng chờ tranh chấp giữa hai đội (REPUTATION-001); cần khớp menu quản trị chung.
11. **Nơi đội trưởng đánh giá / report mercenary sau trận:** đặt ở S3 tab "Đã duyệt" (không có màn "sau trận" riêng trong SRS); có thể thêm lối tắt từ chi tiết kèo đã kết thúc (MATCH-001).
12. **Biến thể không vẽ riêng:** S5 (từ chối, đóng tin), S8 (mercenary → đội), S16 (rút đơn chờ duyệt), dialog "Thêm vị trí" (S7), trạng thái "đã duyệt" của S13 — mô tả bằng chữ ở §2, dùng cùng khung.

## 5. Trạng thái xuất mockup (Stitch) — chưa đầy đủ
> Thiết kế §2 là đặc tả đầy đủ cho cả 21 màn; **mockup Stitch mới có 1/42 bản** (S12 desktop). Phần còn lại cần sinh lại khi Stitch ổn định — prompt đã soạn sẵn cho từng màn (phiên `ui-designer` sau dùng lại §2 làm nguồn).

- **Đã xuất:** S12 desktop — screen `974c71fe58ae438f9bc9604620eea100`, file `ui/S12-tim-keo-desktop.{png,html}`. Theme khớp design system `assets/17011466837528823159` (primary `#3d6943`, Be Vietnam Pro, bo góc 8px).
- **Chưa xuất (41 bản):** S1–S11, S13–S21 (desktop + mobile), S12 mobile.
- **Lỗi gặp phải (2026-11-27):**
  - `generate_screen_from_text` báo "The operation timed out" ở hầu hết các lần gọi, cả khi chạy song song lẫn tuần tự từng lệnh (lần chạy tuần tự: 16/20 lần timeout).
  - 4 lần thành công với model `GEMINI_3_5_FLASH_LITE` (S2 mobile, S3 mobile, S4 desktop, S5 mobile) **không trả về screen id / file** nên không tải được ảnh và HTML.
  - `list_screens` / `get_project` không liệt kê màn mới (kể cả S12 desktop đã sinh thành công) → không dò lại được màn sinh sau timeout.
- **Rủi ro trên project Stitch:** [Unverified] các lần gọi bị timeout có thể vẫn sinh màn ở phía server; project `ArenaFlow` có thể đang chứa màn MERCENARY-001 trùng / mồ côi không lấy được id. Cần kiểm tra trên giao diện web Stitch và dọn trước khi sinh lại.

