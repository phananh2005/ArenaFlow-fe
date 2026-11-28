# UI Design — USER-002 Giải tán đội & quy tắc xoá tài khoản đội trưởng

| Mục | Giá trị |
|---|---|
| Mã chức năng | `USER-002` |
| Nguồn SRS | `docs/agent/upstream/business-spec/USER-002/` (sửa một phần `SYSTEM-001` — UC-U03, UC-T05) |
| Căn cứ | `ArenaFlow-spec@53aee11` (SRS SYSTEM-001 v1.15, USER-002 AC sửa §5 mục 5; API_Spec USER-002 v4.0, USER-001 v5.3, SYSTEM-002 v1.2) |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình). Bản v1.0 đã duyệt `2026-11-10` |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-28` / `v1.2` — lịch sử: `CHANGELOG.md` |

> File này **chỉ ghi phần thêm/sửa** so với `docs/agent/design/USER-001/UI_Design.md`: theme, thành phần dùng chung và các màn S1–S11, S13.
> Màn S5 và S13 vẽ chung cho hai mã; file ảnh/HTML nằm ở `docs/agent/design/USER-001/ui/`.

## 1. Danh sách màn hình

| # | Màn hình | Use case (SRS) | Stitch screen id (desktop / mobile) | File xuất |
|---|---|---|---|---|
| S5 | Xoá tài khoản: trạng thái bị chặn (sửa) | UC-U03 (sửa), BR-T06 (sửa), BR-T14 | `bdf6f0012acb422381d577faa0fb34a0` / `f211b8df56254a43aeda9dd0ff044daa` (v1.1) | `../USER-001/ui/S5-xoa-tai-khoan-{desktop,mobile}.{png,html}` |
| S8b | Chi tiết đội đã giải tán + lịch sử đội trưởng (mới) | BR-T11, BR-T13, AC §5 mục 3, 5 | `63fda96f71424b3faf51fd6b88396370` / `7e889b625e174eafb8a20e185c079b84` | `ui/S8b-doi-da-giai-tan-…` |
| S12 | Giải tán đội (mới) | UC-T06, BR-T07..T10, BR-T12 | `6dade853749f4fe49462d12f1f1e507c` / `12f000184c4846279148726d28054991` | `ui/S12-giai-tan-doi-…` |
| S13 | Admin quản lý đội: trạng thái "Đã giải tán" (sửa) | UC-T05 (sửa), BR-T11 | `516d10df1e5e47539a3c4e65162db9e4` / `6088c2d9006a4e918871cfeecca47483` | `../USER-001/ui/S13-admin-quan-ly-doi-…` |
| S14 | Admin lịch sử thành viên (mới) | BR-T13, AC §5 mục 6, BC-U02 (SYSTEM-001 v1.7) | `a11aac01c4ab4c9aaf6a8b23b1c8f190` / `871dff6c37624934ab96ce5a7e578d08` (v1.1 — xem §4 mục 3) | `ui/S14-admin-lich-su-thanh-vien-…` |

## 2. Chi tiết từng màn hình

> Dữ liệu trong mockup (tên, ngày) là **dữ liệu mẫu**. Mockup chỉ để tham khảo, không copy HTML vào `src/`.

### S5 — Xoá tài khoản: trạng thái bị chặn (sửa)
- **Mục đích:** chặn xoá tài khoản khi người dùng còn là đội trưởng của đội chưa giải tán. Áp dụng cả khi là người duy nhất trong đội và khi đội đang bị khoá (UC-U03 4a sửa, BR-T06 sửa).
- **Thành phần UI chính:** dialog/bottom sheet S5 (USER-001), thêm banner lỗi viền đỏ có icon cảnh báo.
- **Dữ liệu hiển thị:**
  - Banner: "Bạn phải chuyển quyền đội trưởng hoặc giải tán đội trước khi xóa tài khoản".
  - Nội dung cảnh báo có thêm "Các lời mời vào đội đang chờ sẽ bị từ chối" (BR-T14).
- **Thao tác (v1.1):** khi bị chặn, "Xoá tài khoản" chỉ hiện lỗi, không đăng xuất. Banner có link "Xem các đội bạn đang làm đội trưởng →" mở "Đội của tôi" lọc vai trò đội trưởng (API_Spec USER-002 v3.1 — `USER_003`; USER-003 UC-T08 1a), từ đó vào S8a để chuyển quyền (S10) hoặc giải tán đội (S12). Màn đích thuộc USER-003 — xem `docs/agent/design/USER-003/UI_Design.md`.
- **Nội dung cảnh báo (v1.1):** thêm câu về đơn ứng tuyển mercenary tự rút (BR-ME18) — chi tiết ở `USER-001/UI_Design.md` S5.
- **Trạng thái:** banner chỉ hiện sau khi hệ thống báo bị chặn. Trường hợp bình thường không có banner (USER-001 S5).
- **Bỏ (BC-T02 sửa):** không còn luồng "đội trưởng duy nhất xoá tài khoản → đội tự INACTIVE". Không vẽ thông báo nào cho luồng cũ.
- **Responsive / a11y:** banner dùng `role="alert"`, được đọc ngay khi xuất hiện. Không chỉ dựa vào màu đỏ, luôn có icon và chữ.

### S8b — Chi tiết đội đã giải tán (mới)
- **Mục đích:** xem đội đã giải tán. Đội vẫn xem được, có dấu "Đã giải tán", và mọi thao tác bị chặn (BR-T11, BR-T13).
- **Thành phần UI chính:**
  - Header đội (dùng chung với S8a): badge "Đã giải tán", ngày tạo, "Người giải tán: <tên>" thay cho "Đội trưởng" (AC §5 mục 3).
  - Banner thông tin: "Đội đã giải tán ngày <dd/mm/yyyy>. Lý do: <lý do>" (lý do mặc định "Đội trưởng giải tán đội", BR-T08).
  - Thanh liên kết tính năng của đội ở trạng thái đã giải tán (v1.2): giữ 3 liên kết chỉ xem ("Kèo của đội", "Uy tín đội", "Mercenary đánh giá"); ẩn "Report của đội" và "Tuyển mercenary" (BR-T11 — mọi thao tác quản trị / tuyển bị chặn).
  - Tab "Thành viên (0)" | "Lịch sử đội trưởng".
  - Không có nút "Mời thành viên", "Sửa thông tin", "Thao tác quản trị", "Rời đội" (BR-T11).
- **Dữ liệu tab Lịch sử đội trưởng:**
  - Mỗi mục là một mốc "<cũ> → <mới>", kèm thời điểm và "Lý do: …" (`—` khi trống).
  - Mốc đầu: "Tạo đội — <tên> trở thành đội trưởng".
  - Đếm "n bản ghi", có phân trang.
- **Dữ liệu tab Thành viên:** User chỉ thấy số 0 và trạng thái empty, vì không còn thành viên đang hoạt động. Lịch sử thành viên chỉ admin xem, ở S14 (BR-T13).
- **Người dùng đã xoá:** người giải tán hoặc người trong lịch sử đã xoá tài khoản thì hiện "Người dùng đã xóa" (AC §5 mục 5 — áp cho endpoint thường; S8b là màn người dùng thường nên giữ nguyên).
- **Trạng thái:**
  - *Loading:* skeleton.
  - *Lịch sử trống:* chỉ có mốc tạo đội.
- **Responsive / a11y:** mobile chuyển timeline thành danh sách dọc. Mũi tên "→" có `aria-label` "chuyển cho".
- **Không implement** (Stitch tự thêm, sai SRS):
  - Tiêu đề "Nhật ký chuyển giao ban cán sự" / "Nhật ký ban cán sự" → đúng là **"Lịch sử đội trưởng"**.
  - Dòng phụ "Lưu trữ toàn bộ các mốc thay đổi vị trí Đội trưởng từ thời điểm thành lập" → bỏ.
  - "Ghi chú: Khởi tạo đội bóng" ở mốc tạo đội → bỏ.

### S12 — Giải tán đội (mới)
- **Mục đích:** đội trưởng đang hoạt động giải tán đội vĩnh viễn (UC-T06, BR-T07).
- **Thành phần UI chính:**
  - Desktop dùng dialog, mobile dùng bottom sheet, phủ lên S8a. Mở từ "Thao tác quản trị › Giải tán đội".
  - Tiêu đề "Giải tán đội <tên>?".
  - Cảnh báo: "Giải tán là vĩnh viễn và không thể khôi phục. Mọi thành viên (kể cả bạn) sẽ rời đội, các lời mời đang chờ sẽ bị huỷ" (BR-T09, BR-T10).
  - Ô "Lý do (không bắt buộc)", bộ đếm `n/100`, dòng gợi ý "Để trống sẽ ghi lý do mặc định "Đội trưởng giải tán đội"" (BR-T08).
  - Hai nút "Huỷ" / "Giải tán đội" (nút này màu error).
- **Thao tác:**
  - Xác nhận thành công → thông báo giải tán thành công, chuyển sang S8b của đội.
- **Trạng thái:**
  - *Lỗi validation:* vượt 100 ký tự → viền đỏ, "Lý do tối đa 100 ký tự", bộ đếm đỏ (vd `112/100`), nút bị disable (UC-T06 3a). Mockup vẽ trạng thái này.
  - *Lý do chỉ gồm khoảng trắng:* coi như để trống, dùng lý do mặc định (BR-T08, AC §5 mục 4).
  - *Lỗi nghiệp vụ:*
    - "Chỉ đội trưởng mới được giải tán đội" (1a).
    - "Không tìm thấy đội" (1b).
    - "Đội đã giải tán" (1c).
    - Đụng độ với thao tác khác (4a) → tải lại chi tiết đội.
  - *Đội đang bị khoá:* vẫn mở được S12 (BR-T12).
- **Lỗi field từ BE (v1.1, API_Spec USER-002 v4.0):** `reason` sai kiểu trả `field = "reason"` → hiện dưới ô lý do; `field = "body"` → lỗi chung trong dialog. Không đổi mockup.
- **Responsive / a11y:**
  - Dialog dùng `role="alertdialog"` và giữ focus trong dialog.
  - Focus mặc định ở nút "Huỷ".
  - Bộ đếm ký tự dùng `aria-live="polite"`.

### S13 — Admin quản lý đội: đội đã giải tán (sửa)
- **Mục đích:** admin thấy đội đã giải tán nhưng không khoá hay kích hoạt lại được (UC-T05 sửa, BR-T11).
- **Thay đổi so với USER-001 S13:**
  - Thêm tab lọc "Đã giải tán".
  - Dòng đội đã giải tán: badge "Đã giải tán", "Người giải tán: <tên>", số thành viên 0. Chỉ có nút "Lịch sử thành viên" (→ S14), không có "Khoá đội" hay "Kích hoạt lại".
  - Đội bị khoá vẫn giữ "Lý do: …" của admin khi sau này bị giải tán (BR-T12). Lý do giải tán xem ở S8b.
  - **v1.1 (API_Spec USER-002 v3.0, AC §5 mục 5 sửa):** "Người giải tán" / "Đội trưởng" đã xoá tài khoản hiện **tên thật** kèm nhãn "Đã xoá tài khoản" theo cờ `isDisbandedByDeleted` / `isCaptainDeleted`, không hiện "Người dùng đã xóa". Mockup S13 không vẽ lại (lý do: `USER-001/UI_Design.md` S13).
- **Trạng thái:** khoá hoặc kích hoạt lại một đội vừa bị giải tán (đụng độ) → hệ thống báo "Đội đã giải tán", tải lại danh sách.

### S14 — Admin lịch sử thành viên (mới)
- **Mục đích:** admin xem mọi người đã từng tham gia đội, ở mọi trạng thái đội (BR-T13, AC §5 mục 6).
- **Thành phần UI chính:**
  - Layout quản trị, breadcrumb "Quản lý đội › <tên đội> › Lịch sử thành viên".
  - Header gồm tên đội và badge trạng thái.
  - Dòng phụ "Gồm mọi người đã từng tham gia đội; không gồm lời mời".
  - Desktop là bảng, mobile là thẻ. Có phân trang "Hiển thị n trên m".
- **Dữ liệu hiển thị:**
  - Cột Thành viên · Vai trò (Đội trưởng / Thành viên) · Trạng thái (Đang hoạt động / Đã rời) · Ngày tham gia · Ngày rời.
  - **Người đã xoá tài khoản (v1.1 — API_Spec USER-002 v2.0/v3.0, BC-U02 v1.7):** hiện tên thật + ảnh thật (avatar mặc định nếu `avatarUrl = null`), kèm nhãn trung tính "Đã xoá tài khoản" (viền xám, icon `person_off`, không màu đỏ) khi `isUserDeleted = true`. Không so chuỗi tên. Mockup v1.1 vẽ dòng "Trần Thị Bình" (dữ liệu mẫu).
  - Mobile gộp hai ngày thành "Tham gia … • Rời …".
- **Trạng thái:**
  - *Loading:* skeleton bảng.
  - *Empty:* "Chưa có ai tham gia đội". Mockup không vẽ.
  - *Không tìm thấy đội:* quay về S13.
- **Responsive / a11y:** bảng có `<th scope="col">`. Trạng thái luôn có chữ. Nhãn "Đã xoá tài khoản" là chữ, không chỉ icon.
- **Ngày giờ (v1.1, SYSTEM-002):** `joinedAt`, `leftAt` là giờ Việt Nam không kèm múi giờ; hiển thị nguyên ngày (`dd/mm/yyyy`), không đổi theo múi giờ thiết bị.
- **Quyền:** User thường không vào được màn này (BR-T13).

## 3. Thành phần dùng chung giữa các màn hình
- Dùng lại toàn bộ §3 của `docs/agent/design/USER-001/UI_Design.md`: header ứng dụng, layout quản trị, header đội, badge trạng thái, dialog/bottom sheet, phân trang, hiển thị người dùng đã xoá.
- **Mới:**
  - **Banner trạng thái đội**, dùng ở S8b. Có thể dùng lại cho banner "đội bị khoá" ở S8a.
  - **Timeline lịch sử đội trưởng**, dùng ở S8b và tab "Lịch sử đội trưởng" của S8a.

## 4. `[cần xác nhận]`
> Lưu để xử lý sau (user chốt 2026-11-10). Các mục chung của cụm tài khoản/đội (lời mời, mời theo username, phường/xã, upload ảnh, "đội của tôi") ghi ở `docs/agent/design/USER-001/UI_Design.md` §4.

1. **Kèo/trận đang có khi giải tán** (USER-002 AC §5 mục 1): chốt khi triển khai domain Match. S12 chưa có cảnh báo hay chặn liên quan tới kèo.
2. **Thứ tự sắp xếp** lịch sử đội trưởng (S8b) và lịch sử thành viên (S14): mockup vẽ mốc mới nhất ở trên cho S8b và theo ngày tham gia tăng dần cho S14. SRS không nêu.
3. **S14 mobile trên Stitch chưa đồng bộ (v1.1):** Stitch trả timeout ở 3 lần sửa S14 mobile; lần dùng model nhanh chỉ trả thao tác DOM, không lưu vào file của screen `871dff6c37624934ab96ce5a7e578d08`. Bản đúng là file trong `ui/` (đã áp thao tác DOM đó, đổi ảnh mẫu sang ảnh của S14 desktop, sửa chữ viết tắt "LQC" → "LQB", ảnh chụp render lại bằng Chrome headless). Cần đồng bộ lại screen trên Stitch khi dịch vụ ổn định.
