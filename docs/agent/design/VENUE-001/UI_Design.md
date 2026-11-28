# UI Design — VENUE-001 Quản lý địa điểm sân

| Mục | Giá trị |
|---|---|
| Mã chức năng | `VENUE-001` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (VENUE-001 nằm trong SYSTEM-001 — mục lục `docs/agent/upstream/README.md`): UC-V01..V07, BR-V01..V13, BC-V01..V07, AC-V01..V06, Business_Rules §2.6, §5.1, §5.4 |
| Căn cứ | `ArenaFlow-spec@53aee11` (SRS SYSTEM-001 v1.15; API_Spec VENUE-001 v6.2; ADR-0009 upload ảnh ký trực tiếp Cloudinary; SYSTEM-002 v1.2 — giờ Việt Nam) |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280) + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-27` / `v1.0` |

> Khung app (header, layout quản trị, dialog / bottom sheet, phân trang, theme) tái dùng từ `docs/agent/design/USER-001/UI_Design.md` §3.
> Dữ liệu trong mockup (tên sân, địa chỉ, toạ độ, tên người) là **dữ liệu mẫu**. Mockup chỉ để tham khảo, không copy HTML từ Stitch vào `src/`.
> Ảnh sân trong mockup hiển thị ô placeholder (Stitch không nạp ảnh thật khi chụp màn) — bản thật dùng `primaryImageUrl` / `imageUrl` từ API.

## 1. Danh sách màn hình

| # | Màn hình | Use case / rule (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Danh sách / tìm địa điểm (người dùng) | BR-V13, AC-V06, BC-V04 | `2d4325c572dc444a8acaa67fe3b430d3` / `82f8a662016a402eb10f2214c5e847b7` | `S1-danh-sach-dia-diem-{desktop,mobile}.{png,html}` |
| S2 | Thêm địa điểm | UC-V01, BR-V01, BR-V05, BR-V11, BR-V12, AC-V01 | chưa sinh (Stitch timeout — §5) | `S2-them-dia-diem-…` |
| S3 | Sửa địa điểm (Admin / người tạo) | UC-V05, BR-V06, BR-V11, BR-V12, AC-V04 | chưa sinh (Stitch timeout — §5) | `S3-sua-dia-diem-…` |
| S4a | Chi tiết địa điểm — đang hoạt động | UC-V02, UC-V05 1a, UC-V06, BR-V03, BR-V06, BR-V07, BR-V10 | chưa sinh (Stitch timeout — §5) | `S4a-chi-tiet-dia-diem-…` |
| S4b | Chi tiết địa điểm — đã ngừng hoạt động | Business_Rules §2.6, BC-V04, UC-V03 4b, AC-V06 | chưa sinh (Stitch timeout — §5) | `S4b-dia-diem-ngung-hoat-dong-…` |
| S5 | Thêm ảnh sân (dialog / bottom sheet) | UC-V02, BR-V02, BR-V03, BR-V07, ADR-0009 | chưa sinh (Stitch timeout — §5) | `S5-them-anh-…` |
| S6 | Xoá ảnh (xác nhận) | UC-V06, BR-V06, BR-V08, AC-V05 | chưa sinh (Stitch timeout — §5) | `S6-xoa-anh-…` |
| S7 | Report địa điểm (dialog / bottom sheet) | UC-V03, BR-V04, BR-V09, AC-V03 | chưa sinh (Stitch timeout — §5) | `S7-report-dia-diem-…` |
| S8 | Admin — danh sách địa điểm | UC-V07, BR-V13, AC-V06 | chưa sinh (Stitch timeout — §5) | `S8-admin-dia-diem-…` |
| S9 | Admin — report địa điểm (hàng chờ xác minh) | UC-V04 bước 1–2, BR-V04, BC-U02 | chưa sinh (Stitch timeout — §5) | `S9-admin-report-dia-diem-…` |
| S10 | Admin — đánh dấu ngừng hoạt động / kích hoạt lại (xác nhận) | UC-V04 bước 3–6, UC-V07 bước 4, Business_Rules §2.6 | chưa sinh (Stitch timeout — §5) | `S10-admin-ngung-hoat-dong-…` |

> Stitch label: `ArenaFlow — VENUE-001 S<n> <tên> (desktop)` / `(mobile web 390px)`.

## 2. Chi tiết từng màn hình

### S1 — Danh sách / tìm địa điểm (người dùng)
- **Mục đích:** người dùng xem, tìm địa điểm sân đang hoạt động; mở chi tiết; vào "Thêm địa điểm".
- **Thành phần UI chính:**
  - Header ứng dụng (USER-001 §3) thêm mục menu **"Địa điểm"** (đang chọn).
  - Tiêu đề "Địa điểm sân" + nút chính "+ Thêm địa điểm" (mobile: "+ Thêm").
  - Ô tìm "Tìm theo tên hoặc địa chỉ sân"; nút bật/tắt "Gần tôi"; chọn bán kính "Trong 5 km" (1 / 3 / 5 / 10 / 20 / 50 km).
  - Dòng phụ thứ tự sắp xếp: "Đang sắp xếp theo khoảng cách gần nhất" (khi bật "Gần tôi") / "Đang sắp xếp theo tên A→Z" (khi tắt).
  - Lưới thẻ địa điểm: desktop 3 cột, mobile danh sách thẻ ngang (ảnh vuông 88px bên trái).
  - Phân trang "Trước | 1 | 2 | Sau".
- **Dữ liệu hiển thị (thẻ địa điểm):** ảnh chính (không có → ô "Chưa có ảnh"), tên sân, địa chỉ, chip loại sân (Sân 5 / Sân 7 / Sân 11; chưa khai báo → không có chip — BR-V05), khoảng cách "1,24 km" (chỉ khi bật "Gần tôi").
- **Thao tác:**
  - Bấm thẻ → S4a.
  - "+ Thêm địa điểm" → S2.
  - Gõ từ khoá → lọc theo tên **hoặc** địa chỉ (khớp một phần).
  - "Gần tôi" bật → xin quyền vị trí trình duyệt; chỉ hiện địa điểm trong bán kính đã chọn, gần nhất trước. Tắt → sắp theo tên.
- **Trạng thái:**
  - *Loading:* skeleton 6 thẻ (mobile 4 thẻ).
  - *Empty:* "Không tìm thấy địa điểm phù hợp" + gợi ý "Thử từ khoá khác, mở rộng bán kính, hoặc thêm địa điểm mới" + nút "+ Thêm địa điểm". Mockup không vẽ.
  - *Chưa cho quyền vị trí:* banner vàng "Bật quyền vị trí để tìm sân gần bạn" + "Bật vị trí" (mockup mobile); khi đó "Gần tôi" ở trạng thái tắt.
  - *Error:* banner lỗi `role="alert"` "Không tải được danh sách địa điểm" + nút "Thử lại".
  - Danh sách **chỉ** có địa điểm đang hoạt động, kể cả khi người xem là Admin (BR-V13) — không có bộ lọc trạng thái ở màn này.
- **Responsive / a11y:** thẻ là link có tên sân làm nhãn; ảnh có `alt` = tên sân; khoảng cách có chữ "km", không chỉ icon. Nút "Gần tôi" dùng `aria-pressed`.
- **Không implement (lệch mockup):**
  - Mockup desktop vẽ **nhiều chip loại sân** trên một thẻ (vd "Sân 5 · Sân 7 · Sân 11") → sai BR-V05: mỗi địa điểm tối đa **một** loại sân; thẻ chỉ có 0 hoặc 1 chip (như mockup mobile).
  - Mockup mobile vẽ banner "Bật quyền vị trí" cùng lúc với "Gần tôi" đang bật — chỉ là minh hoạ hai trạng thái trên một khung.
- **Thành phần cho MATCH-001 / MERCENARY-001 tái dùng:** *Thẻ địa điểm* (bản ngang của mobile) và *Danh sách tìm địa điểm* (ô tìm + "Gần tôi" + danh sách) — bộ chọn sân khi tạo kèo / khai báo trận ngoài hệ thống dùng lại, thêm nút "Chọn" trên thẻ; màn bộ chọn thuộc thiết kế của mã đó.

### S2 — Thêm địa điểm
- **Mục đích:** người dùng (hoặc Admin) thêm địa điểm, có hiệu lực ngay, không chờ duyệt (UC-V01).
- **Thành phần UI chính:** desktop: trang riêng, link "← Địa điểm sân", thẻ form rộng ~760px; mobile: trang full màn, header "← Thêm địa điểm", nút lưu dính đáy.
- **Trường (map SRS):**
  | Trường | Bắt buộc | Quy tắc hiển thị | Nguồn |
  |---|---|---|---|
  | Tên sân | Có | Bộ đếm `n/200`; lỗi "Tên không được để trống" | BR-V01 |
  | Địa chỉ | Có | Bộ đếm `n/500` | UC-V01 bước 2 (giới hạn 500 theo API_Spec `[cần xác nhận #5]` của BE) |
  | Tỉnh/Thành phố → Phường/Xã | Có (phường/xã) | Hai ô chọn phụ thuộc; chọn tỉnh mới nạp danh sách phường; lỗi "Vui lòng chọn phường/xã" | BR-V11 |
  | Vị trí trên bản đồ (toạ độ) | Có | Bản đồ có ghim, nút "Dùng vị trí hiện tại", dòng chỉ đọc "Toạ độ: lat, lng" | UC-V01 bước 2 — cách nhập `[cần xác nhận]` (§4 mục 1) |
  | Loại sân | Không | Chọn một: Sân 5 / Sân 7 / Sân 11 / Không chọn | BR-V05 |
  | Số điện thoại, Website | Chỉ Admin | **Ẩn** với người không phải Admin; thay bằng ghi chú "Số điện thoại và website của sân do quản trị viên cập nhật." Admin thấy nhóm "Thông tin liên hệ" như S3 desktop | BR-V12 |
- **Thao tác:** "Lưu địa điểm" → thành công: toast "Địa điểm đã được thêm" (UC-V01 bước 5) rồi chuyển sang S4a của địa điểm mới. "Huỷ" → quay lại trang trước; form đã nhập → hỏi "Bỏ thay đổi?" `[cần xác nhận]` (§4 mục 6).
- **Trạng thái:**
  - *Lỗi validation:* lỗi dưới từng trường (mockup), focus về trường lỗi đầu tiên.
  - *Loading khi lưu:* nút "Đang lưu…" có spinner, khoá nút (không cho gửi lặp).
  - *Lỗi "Khu vực không hợp lệ":* lỗi dưới ô Phường/Xã, cho chọn lại.
  - *Lỗi hệ thống:* banner `role="alert"` đầu form, giữ dữ liệu đã nhập.
- **Responsive / a11y:** mọi ô có `label`; dấu `*` kèm chữ "bắt buộc" cho trình đọc màn hình; bản đồ có phương án bàn phím (nút "Dùng vị trí hiện tại") và dòng toạ độ dạng chữ.
- **Không có trong form:** ảnh sân (thêm sau ở S4a/S5), giá thuê, giờ mở cửa, mô tả — SRS không có.

### S3 — Sửa địa điểm
- **Mục đích:** người tạo (khi địa điểm đang hoạt động) hoặc Admin (mọi trạng thái) sửa thông tin (UC-V05).
- **Thành phần UI chính:** giống S2, các ô điền sẵn; tiêu đề "Sửa địa điểm"; nút "Lưu thay đổi".
  - *Biến thể Admin (mockup desktop):* header quản trị (USER-001 §3 "Layout quản trị") với menu "Địa điểm"; nhóm "Thông tin liên hệ" có chip "Chỉ quản trị viên": "Số điện thoại", "Website"; gợi ý "Để trống và lưu để xoá thông tin".
  - *Biến thể người tạo không phải Admin (mockup mobile):* khối chỉ đọc có icon khoá "Thông tin liên hệ" (số điện thoại, website hiện có) + "Chỉ quản trị viên được cập nhật số điện thoại và website." — không gửi hai trường này khi lưu, giá trị giữ nguyên (BR-V12).
- **Dữ liệu / quy tắc:** như S2. Phường/Xã: địa điểm chưa có phường (tạo trước khi có BR-V11) → banner vàng "Địa điểm cần bổ sung phường/xã — chọn phường/xã trước khi lưu", ô Phường/Xã được nhấn mạnh; phường đã có thì không xoá được (chỉ đổi). Loại sân chọn "Không chọn" = xoá giá trị.
- **Thao tác:** "Lưu thay đổi" → toast "Địa điểm đã được cập nhật" (UC-V05 bước 5) → về S4a. "Huỷ" → về S4a.
- **Trạng thái:**
  - *Lỗi validation:* như S2; website sai → "Website phải bắt đầu bằng http:// hoặc https://"; số điện thoại sai định dạng → "Số điện thoại không hợp lệ" (định dạng theo API_Spec `[cần xác nhận #5]` của BE).
  - *Loading khi lưu:* "Đang lưu…", khoá nút (mockup mobile).
  - *Mất quyền / địa điểm vừa ngừng hoạt động:* thông báo theo lỗi hệ thống, tải lại S4a.
  - *Xung đột (người khác vừa sửa):* "Dữ liệu vừa được cập nhật bởi thao tác khác, vui lòng thử lại" + tải lại dữ liệu mới.
  - *Loading khi mở:* skeleton form.
- **Responsive / a11y:** như S2; khối chỉ đọc không phải ô nhập (không focus được), có `aria-describedby` giải thích vì sao khoá.

### S4a — Chi tiết địa điểm (đang hoạt động)
- **Mục đích:** xem đầy đủ thông tin địa điểm, bản đồ / chỉ đường, ảnh; vào các thao tác theo quyền.
- **Thành phần UI chính:**
  - Thư viện ảnh: ảnh lớn (ảnh chính, nhãn "Ảnh chính") + hàng ảnh nhỏ, bộ đếm "3/5 ảnh"; ô "+ Thêm ảnh" khi < 5 ảnh.
  - Khối thông tin: tên sân, badge trạng thái "Đang hoạt động", chip loại sân, địa chỉ, khu vực "Phường Sài Gòn, TP. Hồ Chí Minh" (địa điểm chưa có phường → không hiển thị khu vực — BR-V11), số điện thoại, website (chỉ hiện khi có giá trị), "Người tạo: <tên>", "Cập nhật lúc HH:mm dd/MM/yyyy".
  - Bản đồ tĩnh có ghim + nút "Chỉ đường" (mở ứng dụng bản đồ ngoài, tab mới) — đúng mức "chỉ hiển thị bản đồ/chỉ đường" (Overview §5).
  - Thanh thao tác theo vai trò (bảng dưới).
- **Thao tác theo vai trò (Business_Rules §5.1, §5.4; API_Spec §3.1):**
  | Thao tác | Người tạo | User khác | Admin |
  |---|---|---|---|
  | "Sửa" → S3 | Có | Không — thay bằng gợi ý "Thông tin sai? Report thông tin sai" → S7 chọn sẵn lý do "Thông tin sai" (UC-V05 1a1) | Có |
  | "Report" → S7 | Có | Có | Không (Admin sửa / ngừng hoạt động trực tiếp) |
  | "+ Thêm ảnh" → S5 (khi < 5 ảnh) | Có | Có | Có |
  | Trên từng ảnh: "Đặt làm ảnh chính" | Có | Có | Có |
  | Trên từng ảnh: "Xoá ảnh" → S6 | Có | Không | Có |
  | "Đánh dấu ngừng hoạt động" → S10 | Không | Không | Có |
  | "Xem report của địa điểm" → S9 lọc theo địa điểm | Không | Không | Có |
- **Trạng thái:**
  - *Loading:* skeleton ảnh + khối thông tin.
  - *Không có ảnh:* ô "Chưa có ảnh" + nút "+ Thêm ảnh".
  - *Đủ 5 ảnh:* ẩn ô "+ Thêm ảnh", hiện chú thích "Tối đa 5 ảnh mỗi địa điểm".
  - *Không tìm thấy:* trang "Không tìm thấy địa điểm" + nút "Về danh sách địa điểm".
  - *Đặt ảnh chính thành công:* nhãn "Ảnh chính" chuyển sang ảnh mới, toast ngắn.
  - *Người tạo đã xoá tài khoản:* "Người tạo: Người dùng đã xóa" (BC-U02); không có người tạo → ẩn dòng.
- **Responsive / a11y:** mobile: ảnh full-width dạng trượt ngang có chấm chỉ vị trí, thông tin xếp dọc, thanh thao tác chính dính đáy ("Chỉ đường" + "Report"/"Sửa"), thao tác phụ trong menu "⋯". Menu thao tác trên ảnh mở bằng bàn phím; nút có `aria-label` kèm số thứ tự ảnh. Badge trạng thái có chữ, không chỉ màu.
- **Thời gian:** hiển thị nguyên giá trị giờ Việt Nam từ API, không đổi theo múi giờ thiết bị (SYSTEM-002).

### S4b — Chi tiết địa điểm (đã ngừng hoạt động)
- **Mục đích:** địa điểm `inactive` vẫn xem được chi tiết (vd mở từ kèo cũ) nhưng không còn trong danh sách / tìm kiếm của người dùng.
- **Thành phần UI chính:** như S4a, kèm banner xám/cam đầu trang "Địa điểm đã ngừng hoạt động" + "Không thể chọn địa điểm này cho kèo mới." Badge "Ngừng hoạt động".
- **Thao tác:**
  - Người dùng (kể cả người tạo): **không** có Sửa, Report, Thêm ảnh, Đặt ảnh chính, Xoá ảnh (BR-V06, BR-V07, BR-V09 — UC-V03 4b). Còn "Chỉ đường".
  - Admin: có Sửa, Thêm ảnh, Đặt ảnh chính, Xoá ảnh, "Kích hoạt lại" → S10; banner ghi thêm "Ngừng hoạt động từ HH:mm dd/MM/yyyy".
- **Trạng thái / a11y:** banner `role="status"`; nút bị ẩn chứ không disable (không có thao tác hợp lệ).

### S5 — Thêm ảnh sân
- **Mục đích:** thêm một ảnh cho địa điểm (UC-V02). Desktop: dialog giữa màn; mobile: bottom sheet.
- **Thành phần UI chính:** tiêu đề "Thêm ảnh sân"; bộ đếm "Địa điểm đang có 3/5 ảnh"; vùng chọn file (kéo-thả trên desktop) "Chọn ảnh JPG, PNG hoặc WEBP"; xem trước ảnh đã chọn; ô tích "Đặt làm ảnh chính"; nút "Huỷ" / "Tải ảnh lên".
- **Quy tắc:**
  - Mỗi lần thêm **một** ảnh (mỗi file một lượt upload — ADR-0009).
  - Địa điểm chưa có ảnh → ảnh đầu tiên luôn là ảnh chính: ô "Đặt làm ảnh chính" được tích sẵn và khoá, kèm chú thích "Ảnh đầu tiên sẽ là ảnh chính" (BR-V03).
  - Giới hạn dung lượng file `[cần xác nhận]` (§4 mục 3).
- **Trạng thái:**
  - *Đang tải:* thanh tiến trình "Đang tải ảnh lên…", khoá nút, không đóng dialog bằng click nền.
  - *Thành công:* đóng dialog, toast "Ảnh đã được thêm" (UC-V02 bước 6), ảnh xuất hiện cuối thư viện.
  - *Lỗi định dạng:* "Chỉ nhận ảnh JPG, JPEG, PNG hoặc WEBP".
  - *Đã đủ 5 ảnh:* "Tối đa 5 ảnh mỗi địa điểm" (UC-V02 2a), không cho tải.
  - *Dịch vụ ảnh tạm thời không khả dụng:* "Tạm thời không thêm được ảnh, vui lòng thử lại sau" + "Thử lại".
  - *Upload hỏng giữa chừng:* "Tải ảnh thất bại" + "Thử lại" (thử lại = một lượt mới).
- **Responsive / a11y:** vùng chọn file là `<button>` mở hộp chọn file, có `label`; tiến trình dùng `role="progressbar"`; lỗi `role="alert"`; focus bẫy trong dialog, Esc đóng (khi không đang tải).

### S6 — Xoá ảnh (xác nhận)
- **Mục đích:** người tạo / Admin xác nhận xoá một ảnh (UC-V06).
- **Thành phần UI chính:** desktop dialog, mobile bottom sheet (USER-001 §3); ảnh thu nhỏ; tiêu đề "Xoá ảnh này?"; nội dung "Ảnh bị xoá không khôi phục được."; nếu là ảnh chính và còn ảnh khác: thêm "Đây là ảnh chính — ảnh đứng đầu còn lại sẽ thành ảnh chính." (BR-V08); nút "Huỷ" / "Xoá ảnh" (màu error).
- **Trạng thái:** *Đang xoá:* spinner trên nút, khoá nút. *Thành công:* toast "Ảnh đã được xóa" (UC-V06 bước 5), thư viện cập nhật ngay (gồm ảnh chính mới). *Ảnh không còn:* "Ảnh không còn tồn tại" → tải lại S4a.
- **a11y:** focus mặc định ở "Huỷ"; `aria-label` của nút xoá trên thư viện kèm số thứ tự ảnh.

### S7 — Report địa điểm
- **Mục đích:** người dùng (không phải Admin) báo địa điểm đã đóng cửa / sai thông tin / lý do khác (UC-V03). Desktop dialog, mobile bottom sheet.
- **Thành phần UI chính:** tiêu đề "Report địa điểm <tên>"; nhóm radio "Lý do *": "Sân đã ngừng hoạt động", "Thông tin sai", "Khác"; ô "Chi tiết" (không bắt buộc) bộ đếm `n/1000`; dòng giải thích "Quản trị viên sẽ xác minh. Địa điểm không bị ẩn cho tới khi được xác minh." (BR-V04); nút "Huỷ" / "Gửi report".
- **Trạng thái:**
  - *Lỗi validation:* chưa chọn lý do → "Vui lòng chọn lý do".
  - *Đang gửi:* spinner, khoá nút.
  - *Thành công:* đóng, toast "Đã gửi report. Cảm ơn bạn!" `[cần xác nhận]` (§4 mục 7).
  - *Trùng report chờ xử lý cùng lý do:* lỗi trong dialog "Bạn đã report địa điểm này, đang chờ admin xử lý" (UC-V03 4a, BR-V09); chọn lý do khác vẫn gửi được.
  - *Địa điểm vừa ngừng hoạt động:* "Địa điểm đã ngừng hoạt động" → đóng, tải lại (S4b).
- **a11y:** radio trong `fieldset` có `legend`; lỗi `role="alert"`.
- **Ghi chú:** người dùng không xem lại được report của mình (API_Spec §3.2) — không có màn "Report của tôi".

### S8 — Admin: danh sách địa điểm
- **Mục đích:** Admin xem mọi địa điểm (đang hoạt động và ngừng hoạt động), lọc, mở chi tiết, sửa, ngừng hoạt động / kích hoạt lại (UC-V07).
- **Thành phần UI chính:**
  - Layout quản trị (USER-001 §3): header có nhãn "Quản trị", menu "Quản lý đội", **"Địa điểm"**, **"Report địa điểm"**.
  - Tiêu đề "Địa điểm"; ô tìm "Tìm theo tên hoặc địa chỉ"; tab lọc "Tất cả" (mặc định) / "Đang hoạt động" / "Ngừng hoạt động". Không có lọc theo vị trí (BR-V13).
  - Desktop: bảng (Địa điểm [ảnh nhỏ + tên] · Địa chỉ · Loại sân · Trạng thái · Lần được chọn gần nhất · Thao tác); mobile: thẻ.
  - Sắp theo tên A→Z (BR-V13); phân trang.
- **Thao tác theo trạng thái:** *Đang hoạt động:* "Xem", "Sửa" (→ S3), "Ngừng hoạt động" (→ S10). *Ngừng hoạt động:* "Xem", "Sửa", "Kích hoạt lại" (→ S10). Hàng ngừng hoạt động hiện thêm "Ngừng từ dd/MM/yyyy".
- **Trạng thái:** *Loading:* skeleton bảng. *Empty:* "Không có địa điểm phù hợp". *Error:* banner + "Thử lại". Lần được chọn chưa có → "Chưa được chọn".
- **Responsive / a11y:** bảng có `<th scope>`; nút thao tác có `aria-label` kèm tên địa điểm; tab lọc là `tablist`.

### S9 — Admin: report địa điểm
- **Mục đích:** hàng chờ xác minh report; Admin xem chi tiết từng report, chốt đúng / từ chối, ngừng hoạt động địa điểm (UC-V04).
- **Thành phần UI chính:**
  - Layout quản trị, menu "Report địa điểm" đang chọn.
  - Tab lọc trạng thái report: "Chờ xử lý" (mặc định) / "Đã xác nhận" / "Đã từ chối" / "Tất cả".
  - Chip lọc theo địa điểm khi mở từ S4a: "Địa điểm: Sân bóng Hoa Lư ×".
  - Desktop bảng (Địa điểm + badge trạng thái địa điểm · Lý do · Chi tiết · Người report · Thời gian · Trạng thái report · Thao tác); mobile thẻ. Mới nhất trước; phân trang.
  - Người report / người xử lý đã xoá tài khoản → tên thật kèm nhãn "(đã xoá)" (BC-U02 ngoại lệ Admin).
  - Report đã chốt: "Xử lý bởi <tên> lúc HH:mm dd/MM/yyyy".
- **Thao tác (report "Chờ xử lý"):** "Xác nhận đúng", "Từ chối" (mỗi nút hỏi xác nhận ngắn), "Ngừng hoạt động địa điểm" (→ S10; chỉ khi địa điểm đang hoạt động), link tên địa điểm → S4a.
  - Ghi chú dưới tab: "Xác nhận / từ chối report không đổi trạng thái địa điểm. Ngừng hoạt động địa điểm tự xác nhận các report 'Sân đã ngừng hoạt động' đang chờ."
- **Trạng thái:** *Loading* skeleton; *Empty* "Không có report chờ xử lý"; *Report đã được xử lý bởi admin khác:* toast "Báo cáo đã được xử lý" + tải lại danh sách; *Xung đột:* "Dữ liệu vừa được cập nhật bởi thao tác khác, vui lòng thử lại".
- **a11y:** như S8; chi tiết dài cắt 2 dòng + "Xem thêm" mở rộng tại chỗ.

### S10 — Admin: đánh dấu ngừng hoạt động / kích hoạt lại
- **Mục đích:** xác nhận đổi trạng thái địa điểm (Business_Rules §2.6). Desktop dialog trên nền S8; mobile bottom sheet.
- **Nội dung "Ngừng hoạt động":** tiêu đề "Đánh dấu ngừng hoạt động <tên>?"; liệt kê hệ quả: "Không còn hiện trong danh sách / tìm kiếm của người dùng", "Không chọn được cho kèo mới", "Kèo cũ vẫn giữ địa điểm và xem được chi tiết", "Các report 'Sân đã ngừng hoạt động' đang chờ sẽ được tự xác nhận"; nút "Huỷ" / "Ngừng hoạt động" (màu error).
- **Nội dung "Kích hoạt lại":** "Kích hoạt lại <tên>?" — "Địa điểm sẽ hiện lại trong danh sách và chọn được cho kèo mới."; nút "Huỷ" / "Kích hoạt lại" (primary).
- **Trạng thái:** *Đang xử lý:* spinner, khoá nút. *Thành công:* toast, cập nhật badge / hàng. *Đã ở trạng thái đó / xung đột:* thông báo lỗi theo message, tải lại.
- **Không có ô lý do:** SRS / API không có lý do ngừng hoạt động (khác khoá đội ở USER-001 S13).

## 3. Thành phần dùng chung giữa các màn hình
- **Header ứng dụng** (USER-001 §3) — thêm mục menu "Địa điểm" (S1–S7).
- **Layout quản trị** (USER-001 §3, S13/S14) — thêm mục "Địa điểm", "Report địa điểm" (S8–S10, S3 biến thể Admin).
- **Thẻ địa điểm** (mới): ảnh chính / "Chưa có ảnh", tên, địa chỉ, chip loại sân (0 hoặc 1), khoảng cách (tuỳ chọn). Hai dạng: dọc (lưới desktop) và ngang (mobile, danh sách chọn). Dùng ở S1; dự kiến MATCH-001 / MERCENARY-001 tái dùng.
- **Ô tìm địa điểm + "Gần tôi" + bán kính** (mới): S1; tái dùng cho bộ chọn sân.
- **Badge trạng thái địa điểm:** "Đang hoạt động" / "Ngừng hoạt động" — luôn có chữ (S4a, S4b, S8, S9).
- **Chip loại sân:** chế độ hiển thị (S1, S4a, S8) và chế độ chọn một (S2, S3).
- **Form địa điểm** (S2, S3): cùng bố cục, khác giá trị ban đầu và nhóm "Thông tin liên hệ" theo vai trò.
- **Ô chọn Tỉnh/Thành → Phường/Xã:** dùng chung với hồ sơ cá nhân (USER-003 / USER-001 S4) — trỏ `docs/agent/design/USER-003/UI_Design.md` nếu đã có.
- **Thư viện ảnh địa điểm** (S4a, S4b): ảnh chính + ảnh nhỏ, nhãn "Ảnh chính", menu thao tác trên ảnh.
- **Dialog xác nhận / bottom sheet** (USER-001 §3): S5, S6, S7, S10; thao tác nguy hiểm (S6, S10 ngừng hoạt động) dùng nút màu error.
- **Phân trang "Trước | 1 | 2 | Sau"** (USER-001 §3): S1, S8, S9.
- **Hiển thị người dùng đã xoá:** người dùng thường thấy "Người dùng đã xóa"; màn Admin thấy tên thật + "(đã xoá)" (BC-U02).
- **Theme:** project Stitch `ArenaFlow` — Be Vietnam Pro, primary `#3d6943`, error `#a73b21`, nền `#f8faf3`, bo góc 8px.

## 4. `[cần xác nhận]`
> Không chặn thiết kế UI (user chốt 2026-11-27: ghi lại, làm tiếp). Phần thuộc hợp đồng API / nghiệp vụ → đề xuất làm ở repo BE.

1. **Cách nhập toạ độ (S2, S3):** SRS chỉ ghi "nhập toạ độ" và "chỉ hiển thị bản đồ/chỉ đường" (Overview §5). Mockup vẽ bản đồ bấm đặt ghim + "Dùng vị trí hiện tại" + dòng toạ độ chỉ đọc. Cần chốt: có cho gõ tay lat/lng không; bản đồ dùng dịch vụ nào (thư viện bản đồ chưa có ADR); có tự điền địa chỉ từ ghim không (SRS không có — hiện **không** vẽ).
2. **Nút "Chỉ đường" (S4a, S4b):** mở ứng dụng bản đồ ngoài bằng toạ độ — dịch vụ / định dạng link chưa chốt.
3. **Giới hạn dung lượng file ảnh (S5):** API_Spec `[cần xác nhận #19]` — FE nên tự giới hạn; con số chưa có.
4. **Mục menu "Địa điểm" trên header người dùng (S1):** USER-001 header chỉ có "Đội của tôi"; thêm mục "Địa điểm" là đề xuất điều hướng, SRS không nêu vị trí vào màn danh sách.
5. **Bán kính "Gần tôi" (S1):** danh sách mốc 1/3/5/10/20/50 km là đề xuất UI trong miền API cho phép (0.1..50, mặc định 5).
6. **Hỏi "Bỏ thay đổi?" khi huỷ form có dữ liệu (S2, S3):** SRS không nêu.
7. **Câu chữ toast sau report (S7):** SRS UC-V03 không có thông điệp thành công.
8. **Report "Thông tin sai" / "Khác" sau khi Admin ngừng hoạt động địa điểm (S9, S10):** vẫn ở "Chờ xử lý" (API_Spec `[cần xác nhận #4]`) — Admin tự chốt từng report.
9. **Ngừng hoạt động khi không có report (S8, S10):** cho phép từ danh sách Admin (API_Spec `[cần xác nhận #3]`; UC-V04 điều kiện trước ghi "Có report chờ xác minh").
10. **Cảnh báo "180 ngày không được chọn" (BC-V05):** chỉ là thông báo Admin (NOTIFICATION-001); S8 hiển thị cột "Lần được chọn gần nhất" để Admin đối chiếu — chưa có bộ lọc riêng.
11. **Giới hạn độ dài / định dạng** `address` ≤ 500, `detail` ≤ 1000, số điện thoại `0` + 9–10 chữ số: theo API_Spec `[cần xác nhận #5]`, SRS không nêu.

## 5. Tình trạng mockup Stitch (2026-11-27)
- **Đã sinh và lưu:** S1 (desktop + mobile) — `ui/S1-danh-sach-dia-diem-{desktop,mobile}.{png,html}`.
- **Chưa sinh:** S2, S3, S4a, S4b, S5, S6, S7, S8, S9, S10. Từ lượt gọi thứ 3, mọi lệnh `generate_screen_from_text` / `edit_screens` trả "The operation timed out" (12 lần liên tiếp trong ~35 phút, đã thử model mặc định, `GEMINI_3_8_FLASH`, `GEMINI_3_5_FLASH_LITE`, có chờ giữa các lần). `list_screens` / `get_project` không trả các màn mới nên không lấy lại được id của lượt bị timeout.
- **Nội dung §2 của các màn chưa sinh là đặc tả chữ** (bố cục, trường, thao tác, trạng thái) — đủ cho `solution-architect`; mockup bổ sung khi Stitch ổn định (chạy lại `ui-designer`, giữ nguyên tên `S<n>` và label).
- **Có thể xuất hiện màn rác trong project Stitch** từ các lượt timeout (label `ArenaFlow — VENUE-001 S2 / S3 / S7 / S6 …`, kể cả một bản sửa S1 desktop). Không dùng các màn đó khi chưa ghi id vào bảng §1.
- **Sửa còn thiếu ở S1 desktop:** lệnh sửa "mỗi thẻ tối đa 1 chip loại sân" bị timeout — đã ghi "Không implement" ở §2 S1.
