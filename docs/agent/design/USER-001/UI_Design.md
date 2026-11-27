# UI Design — USER-001 Tài khoản & đội

| Mục | Giá trị |
|---|---|
| Mã chức năng | `USER-001` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (USER-001 nằm trong SYSTEM-001 — mục lục `docs/agent/upstream/README.md`); phần sửa bởi USER-002 → `docs/agent/upstream/business-spec/USER-002/` |
| Căn cứ | `ArenaFlow-spec@53aee11` (SRS SYSTEM-001 v1.15; API_Spec USER-001 v5.3, SYSTEM-002 v1.2 — quy ước thời gian) |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình). Bản v1.0 đã duyệt `2026-11-10` |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-27` / `v1.1` — lịch sử: `CHANGELOG.md` |

> Phần thêm/sửa của USER-002 (giải tán đội, chặn xoá tài khoản, đội đã giải tán, admin lịch sử thành viên) ghi ở `docs/agent/design/USER-002/UI_Design.md`.
> Màn S5 và S13 vẽ một lần, dùng chung cho cả hai mã: file ảnh/HTML để ở `USER-001/ui/`.
> Phần do USER-003 sửa (chọn khu vực tỉnh/thành → phường/xã ở S4, tìm người để mời ở S9, "Lời mời của tôi", "Đội của tôi") **không** vẽ ở file này — xem `docs/agent/design/USER-003/UI_Design.md`.

## 1. Danh sách màn hình

| # | Màn hình | Use case (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Đăng nhập / đăng ký | UC-U01 | `e3bbfd5a56df4254a8de29e793d2fc9e` / `d4388387a3364bacb820eb34dfaa3267` | `S1-dang-nhap-{desktop,mobile}.{png,html}` |
| S2a | Nhập số điện thoại | UC-U01 (Phone OTP), BR-U01 | `4bea086d7a9d427caf5dc897dcf81785` / `79ec8662ae55449ba86cd2dd9547bdfc` | `S2a-nhap-sdt-…` |
| S2b | Nhập mã OTP | UC-U01 (Phone OTP) | `d76d264a5da444e4b322c534b1e1b2c0` / `963bf74eaaa64e138e86fb2bb2ae5cdb` | `S2b-nhap-otp-…` |
| S3 | Hồ sơ cá nhân | UC-U02 | `caebd72ca38e4bf1be2c93f13d0cf92e` / `fb2674badcc94dbd886e1c615841d656` | `S3-ho-so-…` |
| S4 | Sửa hồ sơ | UC-U02, UC-U01 bước 5, BR-U03..U06 | `0c1cc1d9467e432ab13ee27217b31b5c` / `83b7955619d8436a83091f42b579c983` | `S4-sua-ho-so-…` |
| S5 | Xoá tài khoản (dialog / bottom sheet) | UC-U03 (sửa bởi USER-002), BR-ME18 | `bdf6f0012acb422381d577faa0fb34a0` / `f211b8df56254a43aeda9dd0ff044daa` (v1.1) | `S5-xoa-tai-khoan-…` |
| S6 | Danh sách đội + lời mời đang chờ | UC-T03, BR-T13 (lọc trạng thái) | `fe3b7da1cbde4e07ba2f3dfbb1ac2614` / `8f0dbb7dfab54c8b99d19baa9681924f` | `S6-danh-sach-doi-…` |
| S7 | Tạo đội | UC-T01, BR-T01, BR-T02 | `ee3e63d41c8048528f60bbdd4e4307e6` / `094195b048aa439c812f174bfb314d9c` | `S7-tao-doi-…` |
| S8a | Chi tiết đội (góc nhìn đội trưởng) | UC-T01 post, BC-T04/T05 | `5d2ed727c9194eefa4bea2bae0d2b840` / `e1cae38741d74162b2e11d075c1a67fb` | `S8a-chi-tiet-doi-…` |
| S9 | Mời thành viên | UC-T02, BR-T04 | `6d838a2f71e34a08bf06401abd05af4d` / `b45bb4bf0d27473f97056bab2381f480` | `S9-moi-thanh-vien-…` |
| S10 | Chuyển quyền đội trưởng | UC-T04, BR-T03, BR-T05 | `683c52cd94134dfda021f0840e031e43` / `e7aa41ac58a44f45aa76b0a326d67a77` | `S10-chuyen-quyen-…` |
| S11 | Rời đội (góc nhìn thành viên) | SYSTEM-001 §5 Authorization ("Rời đội") | `f029f78489e04ba0b6cc5a4fe8ac99c7` / `468c09ac4d194737a66e3b74a6287dfe` | `S11-roi-doi-…` |
| S13 | Admin quản lý đội + khoá đội | UC-T05 (sửa bởi USER-002) | `516d10df1e5e47539a3c4e65162db9e4` / `6088c2d9006a4e918871cfeecca47483` | `S13-admin-quan-ly-doi-…` |

> S8b, S12, S14 thuộc USER-002.

## 2. Chi tiết từng màn hình

> Dữ liệu trong mockup (tên người, tên đội, ngày) là **dữ liệu mẫu**.
> Mockup chỉ dùng để tham khảo, không copy HTML từ Stitch vào `src/`.

### S1 — Đăng nhập / đăng ký
- **Mục đích:** một điểm vào chung cho đăng nhập và đăng ký. Tài khoản được tạo tự động ở lần đăng nhập đầu (UC-U01; 3a: đã có tài khoản thì đăng nhập).
- **Thành phần UI chính:** bố cục chia đôi trên desktop (trái là cột thương hiệu nền xanh đậm, phải là thẻ đăng nhập). Trên mobile, thương hiệu nằm trên, thẻ nằm dưới. Có 3 nút full-width xếp dọc.
- **Dữ liệu hiển thị:** tiêu đề "Đăng nhập hoặc đăng ký" và dòng phụ "Tài khoản mới sẽ được tạo tự động ở lần đăng nhập đầu tiên".
- **Thao tác:**
  - "Tiếp tục với Google" / "Tiếp tục với Facebook" → chuyển sang OAuth provider.
  - "Tiếp tục bằng số điện thoại" → S2a.
  - Thành công, tài khoản mới → S4 (UC-U01 bước 5).
  - Thành công, tài khoản đã có → màn chính.
- **Trạng thái:**
  - *Loading:* nút đang chọn có spinner, cả 3 nút bị disable.
  - *Error:* banner "Đăng ký thất bại, vui lòng thử lại" (UC-U01 2a).
- **Responsive / a11y:** nút có nhãn chữ, không chỉ dựa vào icon. Banner lỗi dùng `role="alert"`. Màu lỗi luôn đi kèm icon và chữ.

### S2a — Nhập số điện thoại
- **Mục đích:** bước 1 của đăng nhập bằng SĐT.
- **Thành phần UI chính:** dùng lại bố cục của S1. Gồm link "Quay lại", ô "Số điện thoại", nút "Gửi mã xác thực".
- **Dữ liệu hiển thị:** dòng phụ "Chúng tôi sẽ gửi mã xác thực gồm 6 chữ số tới số này".
- **Thao tác:**
  - Gửi mã thành công → S2b.
  - "Quay lại" → S1.
- **Trạng thái:**
  - *Lỗi validation:* "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0" (BR-U01).
  - *Loading:* nút gửi bị disable và có spinner.
- **Responsive / a11y:** `inputmode="tel"`. Lỗi gắn với ô nhập bằng `aria-describedby`.
- **Không implement:** trong mockup desktop, nút đang dùng màu xanh sáng. Code dùng màu primary `#3d6943`.

### S2b — Nhập mã OTP
- **Mục đích:** bước 2, xác thực OTP.
- **Thành phần UI chính:** 6 ô nhập, mỗi ô 1 chữ số. Dòng "Mã gồm 6 chữ số đã được gửi tới số <SĐT>". Link "Đổi số điện thoại" (về S2a). Nút "Xác nhận".
- **Thao tác:**
  - Xác nhận thành công → như S1 (tài khoản mới → S4, đã có → màn chính).
- **Trạng thái:**
  - *Error:* "Mã xác thực không đúng".
  - *Loading:* nút bị disable.
- **Responsive / a11y:** `inputmode="numeric"`, `autocomplete="one-time-code"`. Dán cả 6 số vào một lần phải được. Mỗi ô có `aria-label` "Chữ số n".
- `[cần xác nhận]` Mockup không vẽ nút "Gửi lại mã" và đồng hồ đếm ngược, vì SRS không nêu (§4 mục 6).

### S3 — Hồ sơ cá nhân
- **Mục đích:** xem hồ sơ (UC-U02 bước 2).
- **Thành phần UI chính:** thanh đầu trang dùng chung, thẻ hồ sơ (avatar, tên, nút "Sửa hồ sơ"), danh sách trường chỉ đọc, và vùng nguy hiểm "Xoá tài khoản".
- **Dữ liệu hiển thị (UC-U02):** tên hiển thị, ảnh, tiểu sử, vị trí chơi ưa thích, ngày sinh, giới tính, khu vực. Trường nào trống thì hiện "Chưa cập nhật".
- **Thao tác:**
  - "Sửa hồ sơ" → S4.
  - "Xoá tài khoản" → mở S5.
  - Vùng nguy hiểm có dòng nhắc: "Bạn sẽ bị đăng xuất và rời mọi đội đang tham gia. Nếu đang là đội trưởng, bạn cần chuyển quyền hoặc giải tán đội trước."
- **Trạng thái:**
  - *Loading:* skeleton cho thẻ hồ sơ.
  - *Error:* lỗi tải hồ sơ kèm nút thử lại. Mockup không vẽ trạng thái này; dùng khung lỗi chung.
- **Responsive / a11y:** mobile xếp 1 cột. Avatar có `alt` là tên người dùng.

### S4 — Sửa hồ sơ
- **Mục đích:** cập nhật hồ sơ (UC-U02 bước 3–6). Đây cũng là màn hoàn thiện hồ sơ sau khi đăng ký (UC-U01 bước 5).
- **Thành phần UI chính:** breadcrumb "Hồ sơ cá nhân › Sửa hồ sơ", khu avatar có nút "Đổi ảnh", form, và hai nút "Huỷ" / "Lưu thay đổi".
- **Phần do USER-003 sửa:** ô "Khu vực" chọn tỉnh/thành → phường/xã từ danh mục (UC-U02 bước 3, UC-U04) — xem `docs/agent/design/USER-003/UI_Design.md`. Mockup S4 hiện tại (combobox phường/xã) giữ nguyên, không vẽ lại ở mã này.
- **Trường của form:**

  | Trường | Điều khiển | Quy tắc |
  |---|---|---|
  | Tên hiển thị `*` | input, bộ đếm `n/100` | BR-U03 |
  | Tiểu sử | textarea, bộ đếm `n/1000` | SRS không nêu; giới hạn theo API_Spec USER-001 §2.6 (`bio` ≤ 1000) |
  | Vị trí chơi ưa thích | nhóm chọn 1 trong 4: Thủ môn / Hậu vệ / Tiền vệ / Tiền đạo | BR-U06 |
  | Ngày sinh | date picker, lỗi "Bạn phải đủ 13 tuổi" | BR-U04, BC-U01 |
  | Giới tính | Nam / Nữ / Khác | — |
  | Khu vực (phường/xã) | combobox có tìm kiếm — thay bằng bộ chọn của USER-003 | BR-U05, UC-U04 (USER-003) |

- **Thao tác:**
  - "Lưu thay đổi" thành công → toast "Cập nhật thành công", về S3 (UC-U02 bước 6).
  - "Huỷ" → về S3.
- **Trạng thái:**
  - *Lỗi validation:* lỗi hiện dưới từng trường (UC-U02 5a).
  - *Đang lưu:* nút Lưu bị disable và có spinner.
- **Responsive / a11y:** mobile xếp 1 cột, nút cố định ở cuối. Mọi input có `label`. Trường bắt buộc đánh dấu bằng `*` kèm `aria-required`.
- **Không implement:** dòng "Định dạng JPG, PNG dung lượng dưới 5MB" do Stitch tự thêm, SRS không có.
- **Lỗi validation từ BE (v1.1):** lỗi field sai kiểu / sai định dạng (vd `dateOfBirth`) nay trả đúng tên field → hiện dưới ô đó; lỗi `field = "body"` hiện ở banner lỗi chung của form (API_Spec USER-001 v5.0 §1.2). Không đổi bố cục.
- `[cần xác nhận]` (§4):
  - Luồng "Đổi ảnh" (§4 mục 4).

### S5 — Xoá tài khoản
- **Mục đích:** xác nhận soft-delete tài khoản (UC-U03).
- **Thành phần UI chính:** desktop dùng dialog, mobile dùng bottom sheet, phủ lên nền S3. Có icon cảnh báo, tiêu đề "Xoá tài khoản?", nội dung cảnh báo, và hai nút "Huỷ" / "Xoá tài khoản" (nút này màu error).
- **Dữ liệu hiển thị (v1.1):** "Bạn sẽ bị đăng xuất và rời mọi đội đang tham gia. Các lời mời vào đội đang chờ sẽ bị từ chối. Các đơn ứng tuyển mercenary đang chờ hoặc đã được duyệt của trận chưa bắt đầu sẽ tự rút, không bị trừ điểm uy tín. Ở lịch sử các đội, tên bạn sẽ hiển thị là "Người dùng đã xóa"" (UC-U03 post, BC-U02, BR-T14, BR-ME18).
  - Câu "Ở lịch sử các đội… Người dùng đã xóa" đúng với màn người dùng thường; màn Admin thấy tên thật kèm nhãn (BC-U02 v1.7). `[cần xác nhận]` có cần nói rõ điều này với người dùng trong hộp xác nhận không (§4 mục 8).
  - Từ "mercenary" giữ theo SRS; nhãn tiếng Việt cho tính năng mercenary chốt khi làm UI của MERCENARY-001 (§4 mục 9).
- **Thao tác:**
  - Xác nhận thành công → đăng xuất, về S1 (UC-U03 bước 6).
- **Trạng thái:**
  - *Bị chặn:* nếu người dùng còn là đội trưởng của đội chưa giải tán, hiện banner lỗi "Bạn phải chuyển quyền đội trưởng hoặc giải tán đội trước khi xóa tài khoản". Đây là trạng thái mockup đang vẽ (UC-U03 4a, sửa bởi USER-002 — xem `USER-002/UI_Design.md`).
  - *Bị chặn — link (v1.1):* trong banner có link "Xem các đội bạn đang làm đội trưởng →", mở "Đội của tôi" lọc vai trò đội trưởng (API_Spec USER-002 v3.1 `USER_003`; USER-003 UC-T08 1a). Màn đích thuộc USER-003 — xem `docs/agent/design/USER-003/UI_Design.md`. `[cần xác nhận]` nhãn link khớp với màn "Đội của tôi" của USER-003 (§4 mục 10).
  - *Đang xử lý:* nút bị disable.
- **Responsive / a11y:**
  - Focus bị giữ trong dialog; `Esc` hoặc "Huỷ" để đóng; focus mặc định ở nút "Huỷ".
  - Dialog có `role="alertdialog"`.
- **Không implement:** nền mockup desktop (đã làm mờ) có dòng "Vĩnh viễn xoá dữ liệu hoạt động và tài khoản cá nhân của bạn" và "Tiền đạo cắm (ST) • FC Gò Vấp". Hai dòng này sai với soft-delete (BC-U02) và không có trong SRS. Nền thực tế là S3. Ảnh avatar ở nền mockup v1.1 bị lỗi tải ảnh mẫu — chỉ là nền mờ, bỏ qua.

### S6 — Danh sách đội + lời mời đang chờ
- **Mục đích:** xem danh sách đội, lọc theo trạng thái, và xử lý lời mời vào đội (UC-T03).
- **Thành phần UI chính:**
  - Tiêu đề "Đội bóng" và nút "Tạo đội".
  - Khối "Lời mời đang chờ (n)": mỗi thẻ lời mời gồm tên đội, ngày mời, nút "Chấp nhận" / "Từ chối". Nguồn dữ liệu và màn "Lời mời của tôi" do USER-003 sửa (UC-T03 bước 1, UC-T07) — xem `docs/agent/design/USER-003/UI_Design.md`; mockup S6 giữ nguyên ở mã này.
  - Tab lọc: Đang hoạt động (mặc định) / Bị khoá / Đã giải tán / Tất cả (BR-T13).
  - Lưới thẻ đội và phân trang.
- **Dữ liệu thẻ đội:**
  - Tên đội, badge trạng thái, tối đa 3 nhãn trình độ, số thành viên.
  - "Đội trưởng: <tên>". Đội đã giải tán thì thay bằng "Người giải tán: <tên>" (USER-002 AC §5 mục 3).
  - Người dùng đã xoá hiện "Người dùng đã xóa" (BC-U02).
- **Thao tác:**
  - Bấm thẻ đội → S8a (hoặc S8b nếu đội đã giải tán).
  - "Tạo đội" → S7.
  - "Chấp nhận" / "Từ chối" → cập nhật lời mời, bỏ thẻ khỏi khối lời mời.
- **Trạng thái:**
  - *Loading:* skeleton thẻ.
  - *Empty theo tab:* "Chưa có đội nào". Mockup không vẽ, dùng khung empty chung.
  - *Không có lời mời:* ẩn hẳn khối lời mời.
- **Responsive / a11y:** desktop dạng lưới, mobile 1 cột. Badge trạng thái luôn có chữ, không chỉ màu. Tab là `role="tablist"`.
- §4 mục 1 (khối lời mời) và mục 5 ("Đội của tôi") chuyển sang USER-003 xử lý (v1.1).

### S7 — Tạo đội
- **Mục đích:** tạo đội mới, người tạo làm đội trưởng (UC-T01).
- **Thành phần UI chính:** breadcrumb "Đội của tôi › Tạo đội", khu logo có nút "Chọn ảnh", form, và hai nút "Huỷ" / "Tạo đội".
- **Trường của form:**

  | Trường | Điều khiển | Quy tắc |
  |---|---|---|
  | Logo đội | chọn ảnh | — |
  | Tên đội `*` | input, bộ đếm `n/100`, lỗi "Tên đội không được để trống" | BR-T01; trùng tên vẫn được (BC-T01) |
  | Mô tả | textarea, bộ đếm `n/1000` | SRS không nêu; theo API_Spec USER-001 §2.8 (`description` ≤ 1000) |
  | Trình độ đội | 9 chip chọn nhiều: Chill, Nhiệt tình, Máu lửa, Vui chơi, Rèn luyện, Thi đấu, Mới bắt đầu, Đã có kinh nghiệm, Lão làng; dòng "Đã chọn n/3" | BR-T02; 9 nhãn khớp enum `skillLevels` API_Spec USER-001 §4.1 |

- **Thao tác:**
  - "Tạo đội" thành công → toast "Đội đã được tạo", sang S8a của đội mới.
  - "Huỷ" → về S6.
- **Trạng thái:**
  - *Lỗi validation:* hiện dưới trường (UC-T01 3a).
  - *Đã chọn đủ 3 nhãn:* các chip còn lại bị disable, kèm dòng "Chọn tối đa 3 nhãn".
  - *Đang lưu:* nút bị disable.
- **Responsive / a11y:** mỗi chip là checkbox có nhãn chữ và `aria-pressed`/`checked`.
- `[cần xác nhận]` (§4):
  - Luồng tải logo (§4 mục 4).

### S8a — Chi tiết đội (đội trưởng)
- **Mục đích:** xem đội và vào các thao tác quản lý.
- **Thành phần UI chính:**
  - Breadcrumb "Đội của tôi › <tên đội>".
  - Header đội: logo, tên, badge trạng thái, ngày tạo, "Đội trưởng: <tên>", nhãn trình độ, mô tả.
  - Nút "Mời thành viên" (→ S9) và "Sửa thông tin".
  - Menu "Thao tác quản trị": "Chuyển quyền đội trưởng" (→ S10), "Giải tán đội" (→ S12, USER-002).
  - Tab "Thành viên (n)" | "Lịch sử đội trưởng" (BC-T05).
- **Dữ liệu tab Thành viên:** bảng các thành viên đang hoạt động, gồm cột Thành viên / Vai trò / Ngày tham gia. Dòng của chính mình có nhãn "Bạn". Người đã xoá hiện "Người dùng đã xóa". Có phân trang.
- **Dữ liệu tab Lịch sử đội trưởng:** các lần chuyển quyền (từ → đến, thời điểm, lý do). Bố cục giống tab này ở S8b.
- **Thao tác theo vai trò:**
  - Thành viên thường không thấy nút quản lý, chỉ thấy "Rời đội" (S11).
  - Đội bị khoá: chặn các thao tác ghi (UC-T05 post). Đội trưởng vẫn được giải tán (BR-T12).
- **Trạng thái:**
  - *Loading:* skeleton.
  - *Không tìm thấy đội:* màn lỗi "Không tìm thấy đội".
  - *Đội bị khoá:* banner lý do khoá. Mockup không vẽ; dùng banner giống S8b.
- **Responsive / a11y:** mobile chuyển bảng thành danh sách thẻ, header xếp dọc. Menu quản trị là `menu` bấm được bằng bàn phím.
- **Không implement:** menu tài khoản trên header có mục "Cài đặt tài khoản" mà SRS không có. Menu chỉ gồm "Hồ sơ cá nhân" và "Đăng xuất".
- `[cần xác nhận]` Màn "Sửa thông tin" đội chưa vẽ. Tạm dùng lại form S7 ở chế độ sửa; cần xác nhận khi làm `solution-architect`.

### S9 — Mời thành viên
- **Mục đích:** đội trưởng mời người vào đội (UC-T02).
- **Phần do USER-003 sửa (v1.1):** UC-T02 bước 2 nay là tìm theo số điện thoại hoặc tên hiển thị rồi chọn một người (UC-U05) — ô "ID hoặc username" bên dưới đã lỗi thời; bản vẽ mới xem `docs/agent/design/USER-003/UI_Design.md`. Mockup S9 ở mã này giữ nguyên làm khung dialog / bottom sheet.
- **Thành phần UI chính:** desktop dùng dialog, mobile dùng bottom sheet, phủ lên S8a. Có dòng giải thích "Người được mời cần chấp nhận lời mời để trở thành thành viên của đội" (BR-T04), ô "ID hoặc username người được mời", và hai nút "Huỷ" / "Gửi lời mời".
- **Thao tác:**
  - Gửi thành công → đóng dialog, toast "Lời mời đã được gửi" (UC-T02 bước 6).
- **Trạng thái:**
  - *Lỗi:* "Không tìm thấy người dùng" (2a), "Người này đã là thành viên của đội" (4a).
  - *Đang gửi:* nút bị disable.
- **Responsive / a11y:** quy tắc dialog giống S5. Lỗi gắn với ô nhập.
- **Không implement:** nền mockup desktop có thanh menu "Giới thiệu / Sân bãi / Tìm đối / Cộng đồng" và cột "Vị trí / Số trận / Trạng thái (Sẵn sàng)", "@username". Các phần này không có trong SRS. Nền thực tế là S8a.
- §4 mục 2 (mời bằng ID/username) chuyển sang USER-003 (v1.1).

### S10 — Chuyển quyền đội trưởng
- **Mục đích:** chuyển quyền cho một thành viên đang hoạt động (UC-T04).
- **Thành phần UI chính:**
  - Desktop dùng dialog, mobile dùng bottom sheet.
  - Cảnh báo: "Người được chọn sẽ trở thành đội trưởng ngay lập tức và không thể từ chối. Bạn sẽ trở thành thành viên thường." (BR-T05, BC-T03).
  - Danh sách radio "Chọn thành viên đang hoạt động": tên, ngày tham gia (BR-T03).
  - Ô "Lý do (không bắt buộc)", bộ đếm `n/500`.
  - Hai nút "Huỷ" / "Chuyển quyền".
- **Thao tác:**
  - Xác nhận → quyền chuyển ngay; S8a làm mới, người dùng mất các nút quản lý.
- **Trạng thái:**
  - *Không có thành viên khác:* "Không có thành viên để chuyển quyền" (2a). Nút "Chuyển quyền" bị disable.
  - *Chưa chọn ai:* nút bị disable.
- **Thông báo (v1.1):** chỉ đội trưởng mới nhận thông báo; đội trưởng cũ không nhận (UC-T04 bước 6). Màn không có chữ nào hứa thông báo cho người thao tác — không đổi mockup.
- **Responsive / a11y:** danh sách là `radiogroup`.
- **Lưu ý:** SRS UC-T04 không nêu trường lý do; trường này lấy từ API_Spec USER-001 §2.15 (`reason` ≤ 500). Lý do hiển thị trong tab Lịch sử đội trưởng.
- **Không implement:** nền mockup có "Tạo kèo đấu" (domain Match, chưa làm) và "Sân bóng Trung Kính Hạ, Cầu Giấy / Bóng 7 người / 14 Thành viên" (mobile). Các phần này không có trong SRS. Nền thực tế là S8a.

### S11 — Rời đội
- **Mục đích:** thành viên thường rời đội.
- **Thành phần UI chính:** S8a ở góc nhìn thành viên: chỉ có nút "Rời đội", không có nút quản lý. Dialog (desktop) hoặc bottom sheet (mobile) có nội dung "Rời đội <tên đội>?", "Bạn sẽ không còn là thành viên của đội. Muốn quay lại, bạn cần được đội trưởng mời lại.", và hai nút "Huỷ" / "Rời đội".
- **Thao tác:**
  - Xác nhận → về S6, đội không còn trong danh sách của người dùng.
- **Trạng thái:**
  - *Đang xử lý:* nút bị disable.
  - *Lỗi:* toast lỗi chung.
- **Lưu ý:** SRS không có use case riêng cho "Rời đội" (chỉ có ở §5 Authorization). Theo API_Spec USER-001 §2.18, đội trưởng phải chuyển quyền trước (`TEAM_009`) nên mockup không vẽ nút "Rời đội" cho đội trưởng.

### S13 — Admin quản lý đội + khoá đội
- **Mục đích:** admin tìm đội, khoá đội hoặc kích hoạt lại (UC-T05).
- **Thành phần UI chính:**
  - Layout "Quản trị" có menu "Quản lý đội".
  - Tab lọc: Tất cả / Hoạt động / Bị khoá / Đã giải tán.
  - Desktop là bảng (Đội · Trạng thái · Đội trưởng · Thành viên · Ngày tạo · Thao tác); mobile là thẻ.
  - Có phân trang.
- **Thao tác theo trạng thái đội:**
  - *Hoạt động:* "Khoá đội", "Lịch sử thành viên" (→ S14).
  - *Bị khoá:* hiện "Lý do: …", có nút "Kích hoạt lại".
  - *Đã giải tán:* chỉ có "Lịch sử thành viên", không có khoá hay kích hoạt (USER-002).
- **Dialog khoá đội:**
  - Nội dung "Khoá đội <tên>?" và "Đội bị khoá sẽ không thực hiện được thao tác nào cho tới khi được kích hoạt lại".
  - Ô "Lý do `*`", bộ đếm `n/500`, lỗi "Vui lòng nhập lý do".
  - Hai nút "Huỷ" / "Khoá đội".
- **Trạng thái:**
  - *Lỗi validation:* lý do trống hoặc chỉ gồm khoảng trắng.
  - *Loading:* skeleton bảng.
  - *Empty:* "Không có đội". Mockup không vẽ.
- **Responsive / a11y:** bảng có `<th scope>`. Nút thao tác ghi kèm tên đội trong `aria-label`.
- **Lưu ý:** "Admin tìm đội" (UC-T05 bước 1) được vẽ bằng tab lọc trạng thái, không có ô tìm theo tên; khớp API_Spec USER-001 §2.21 (chỉ có `status`, `page`, `pageSize`).
- **Người dùng đã xoá tài khoản ở màn Admin (v1.1 — BC-U02 v1.7, API_Spec USER-001 v4.0):** cột/dòng "Đội trưởng" và "Người giải tán" hiện **tên thật**, kèm nhãn trung tính "Đã xoá tài khoản" (viền xám, icon `person_off`, không màu đỏ) khi cờ `isCaptainDeleted` / `isDisbandedByDeleted` = `true`. Không so chuỗi "Người dùng đã xóa". Mẫu nhãn giống S14 v1.1. Mockup S13 không vẽ lại: dialog khoá đội che bảng và mockup không có dòng nào của người đã xoá nên không sai.
- **Thông báo (v1.1):** khoá / kích hoạt lại đội gửi thông báo cho đội trưởng, không kèm lý do (UC-T05 bước 6, A1). Không đổi mockup.

## 3. Thành phần dùng chung giữa các màn hình
- **Header ứng dụng:**
  - Logo ArenaFlow, mục "Đội của tôi", avatar và tên người dùng.
  - Menu avatar gồm "Hồ sơ cá nhân", "Đăng xuất".
  - Dùng ở S3–S11.
- **Layout xác thực chia đôi:** dùng ở S1, S2a, S2b.
- **Layout quản trị:** dùng ở S13 và S14 (USER-002).
- **Header đội:** logo, tên, badge trạng thái, ngày tạo, đội trưởng hoặc người giải tán, nhãn trình độ, mô tả. Dùng ở S8a–S12 và S8b.
- **Badge trạng thái đội:** Hoạt động / Bị khoá / Đã giải tán. Luôn có chữ, không chỉ màu.
- **Chip nhãn trình độ:** chế độ hiển thị (S6, S8a) và chế độ chọn (S7).
- **Dialog xác nhận / bottom sheet:**
  - Desktop là dialog giữa màn hình, mobile là bottom sheet.
  - Thao tác nguy hiểm (S5, S11, S12) dùng nút màu error.
  - Dùng ở S5, S9–S12, S13.
- **Phân trang "Trước | 1 | 2 | Sau":** dùng ở S6, S8a, S8b, S13, S14.
- **Hiển thị người dùng đã xoá (v1.1, BC-U02 v1.7):**
  - Màn người dùng thường (S6, S8a–S12, S8b): "Người dùng đã xóa", avatar mặc định.
  - Màn Admin (S13, S14): tên thật (+ ảnh thật nếu response có field ảnh) kèm nhãn "Đã xoá tài khoản" theo cờ `is…Deleted`.
- **Ngày giờ (v1.1, SYSTEM-002):** mọi thời điểm là giờ Việt Nam; hiển thị nguyên giá trị (`dd/mm/yyyy`, `HH:mm` khi có giờ), không đổi theo múi giờ thiết bị. Không đổi mockup.
- **Theme:** project Stitch `ArenaFlow`.
  - Font Be Vietnam Pro.
  - Primary `#3d6943`, error `#a73b21`, nền `#f8faf3`.
  - Bo góc 8px (`ROUND_EIGHT`).

## 4. `[cần xác nhận]`
> Lưu để xử lý sau (user chốt 2026-11-10). Không chặn thiết kế UI; cần chốt trước hoặc trong lúc làm `solution-architect`. Phần nào thuộc hợp đồng API → đề xuất làm ở repo BE.

1. **Nguồn lời mời (S6):**
   - SRS UC-T03 nói người dùng xem lời mời qua notification.
   - API_Spec USER-001 chưa có endpoint "lời mời của tôi".
   - Thẻ lời mời ở S6 được vẽ theo quyết định user 2026-11-10.
2. **Mời bằng ID/username (S9):**
   - UC-T02 cho nhập ID/username.
   - API 2.12 nhận `userId`, và chưa có API tìm người dùng theo username.
3. **Danh mục phường/xã (S4, BR-U05):** chưa có API danh mục đơn vị hành chính.
4. **Avatar / logo (S4, S7):**
   - API chỉ nhận URL (`avatarUrl`, ≤ 500).
   - Chưa có luồng upload ảnh.
5. **"Đội của tôi" (header, S6):**
   - Menu ghi "Đội của tôi", nhưng API 2.10 trả mọi đội.
   - Chưa có API "đội của tôi".
6. **OTP (S2b):** gửi lại mã, thời gian hết hạn và đếm ngược chưa có trong SRS nên chưa vẽ.
7. **Sửa thông tin đội (S8a):** chưa có màn riêng; dự kiến dùng lại form S7.
8. **Câu "tên bạn sẽ hiển thị là Người dùng đã xóa" ở S5 (v1.1):** từ BC-U02 v1.7, màn Admin thấy tên thật kèm nhãn. Giữ câu như cũ (đúng với người dùng khác) hay nói thêm về Admin — cần user / BA chốt.
9. **Nhãn "mercenary" ở S5 (v1.1):** SRS dùng từ "mercenary"; nhãn tiếng Việt hiển thị cho người dùng chưa chốt, chờ UI của MERCENARY-001.
10. **Link "Xem các đội bạn đang làm đội trưởng →" ở S5 (v1.1):** đích là "Đội của tôi" lọc vai trò đội trưởng (USER-003 UC-T08 1a); nhãn và cách mở (trang hay sheet) chốt cùng `docs/agent/design/USER-003/UI_Design.md`.

> **v1.1 — mục đã chuyển sang USER-003** (không còn xử lý ở mã này): 1 (nguồn lời mời → "Lời mời của tôi", UC-T07), 2 (mời theo ID/username → tìm theo SĐT / tên hiển thị, UC-U05), 3 (danh mục phường/xã → UC-U04), 5 ("Đội của tôi" → UC-T08). Chi tiết: `docs/agent/design/USER-003/UI_Design.md`.
