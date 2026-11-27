# UI Design — USER-003 Tra cứu cho người dùng

| Mục | Giá trị |
|---|---|
| Mã chức năng | `USER-003` |
| Nguồn SRS | `docs/agent/upstream/business-spec/USER-003/` (UC-U04, UC-U05, UC-T07, UC-T08; BR-U07..U17, BR-T15..T21) · API tham chiếu: `docs/agent/upstream/api/USER-003/API_Spec.md` |
| Căn cứ | `ArenaFlow-spec@53aee11` |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280) + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt `2026-11-27` — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-27` / `v1.0` |

> File này ghi 2 màn **mới** (S15, S16) và **phần thay đổi** trên 2 màn của USER-001 (S4, S9). Phần còn lại của S4/S9 và khung chung (theme, header, dialog, phân trang…) giữ theo `docs/agent/design/USER-001/UI_Design.md`.
> Đánh số `S<n>` nối tiếp USER-001/USER-002 (S1–S14): màn sửa giữ số cũ (S4, S9), màn mới là S15, S16 — cùng cách USER-002 làm với S5/S13. Không sửa file nào trong `design/USER-001/`.

## 1. Danh sách màn hình

| # | Màn hình | Use case (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S4 | Sửa hồ sơ — chọn khu vực tỉnh/thành → phường/xã (**thay đổi màn S4 của USER-001**) | UC-U04, UC-U02, BR-U05, BR-U07..U09 | `a30ce348f5294e41ab33a01abc027da3` / `[chưa sinh được]` | `S4-sua-ho-so-khu-vuc-desktop.{png,html}` · mobile: chưa có |
| S9 | Mời thành viên — tìm người theo SĐT/tên (**thay đổi màn S9 của USER-001**) | UC-U05, UC-T02, BR-U10..U15 | `fc56010021104ddb892e9fa2e7421790` (ảnh lỗi — xem §2 S9) / `[chưa sinh được]` | `S9-moi-thanh-vien-tim-nguoi-desktop.{png,html}` · mobile: chưa có |
| S15 | Lời mời của tôi (mới) | UC-T07, UC-T03, BR-T15..T18, BR-U16, BR-U17 | `[chưa sinh được]` / `[chưa sinh được]` | chưa có |
| S16 | Đội của tôi (mới) | UC-T08, BR-T19..T21, BR-U16 | `[chưa sinh được]` / `[chưa sinh được]` | chưa có |

> `[chưa sinh được]`: Stitch MCP liên tục trả `timeout` ngày 2026-11-27 (nhiều phiên dùng chung project cùng lúc); màn bị timeout không tra lại được id. Đặc tả dưới đây đủ để sinh lại — chạy lại `ui-designer` cho các ô này (prompt bám đúng §2).

## 2. Chi tiết từng màn hình

> Dữ liệu trong mockup (tên người, tên đội, ngày giờ) là **dữ liệu mẫu**. Mockup chỉ để tham khảo, không copy HTML vào `src/`.
> Ngày giờ: giờ Việt Nam, hiển thị nguyên giá trị BE trả, định dạng `dd/mm/yyyy HH:mm` (SYSTEM-002; ngày `dd/mm/yyyy` như USER-001).

### S4 — Sửa hồ sơ: chọn khu vực (thay đổi màn S4 của USER-001)
- **Mục đích:** chọn khu vực hồ sơ từ danh mục 2 cấp thay cho combobox "Khu vực (phường/xã)" một cấp của USER-001 (UC-U04; đóng USER-001 §4 mục 3).
- **Thay đổi so với USER-001 S4:** chỉ thay trường "Khu vực". Mọi trường, nút, bố cục khác giữ nguyên USER-001 S4.
- **Thành phần UI chính (trường "Khu vực"):**

  | Điều khiển | Hành vi | Quy tắc |
  |---|---|---|
  | Nhãn nhóm "Khu vực" + dòng gợi ý xám "Chọn tỉnh/thành trước, rồi chọn phường/xã" | — | BR-U07 |
  | Combobox "Tỉnh/thành" | Mở → toàn bộ tỉnh/thành, sắp theo tên tiếng Việt, không phân trang; gõ để lọc ngay trong danh sách (ứng dụng tự lọc, không gọi tìm kiếm) | UC-U04 bước 2, 2a; BR-U07 |
  | Combobox "Phường/xã" | Chỉ bật sau khi đã chọn tỉnh/thành. Mở → toàn bộ phường/xã của tỉnh đó, sắp theo tên; gõ để lọc (mockup: gõ "ben" → "Phường Bến Nghé", "Phường Bến Thành") | UC-U04 bước 4–5, 2a |

- **Dữ liệu hiển thị:** tên tỉnh/thành, tên phường/xã (UC-U04). Chỉ phường/xã được lưu làm khu vực (BR-U05, BR-U07).
- **Thao tác:**
  - Chọn tỉnh/thành → nạp danh sách phường/xã của tỉnh đó.
  - Đổi tỉnh/thành sau khi đã chọn phường/xã → bỏ phường/xã đã chọn, ô Phường/xã về trống (UC-U04 3a).
  - Chọn phường/xã → điền vào form; **chỉ lưu khi bấm "Lưu thay đổi"** (UC-U04 bước 6, postconditions).
- **Trạng thái:**
  - *Hồ sơ đã có khu vực (1a):* hai ô hiện sẵn tỉnh/thành và phường/xã hiện tại; người dùng chọn lại được.
  - *Chưa chọn tỉnh/thành:* ô Phường/xã bị vô hiệu, placeholder "Chọn phường/xã".
  - *Đang tải danh sách:* trong danh sách thả xuống hiện spinner + "Đang tải…" `[cần xác nhận]` (§4 mục 7).
  - *Lọc không khớp mục nào:* "Không có kết quả phù hợp" `[cần xác nhận]` (§4 mục 7).
  - *Tỉnh/thành chưa có phường/xã (4b):* danh sách trống kèm "Chưa có dữ liệu phường/xã cho tỉnh/thành này".
  - *Tỉnh/thành không còn trong danh mục (4a):* lỗi dưới ô Tỉnh/thành "Không tìm thấy tỉnh/thành"; tải lại danh sách tỉnh/thành, bỏ lựa chọn, cho chọn lại.
  - *Lưu với khu vực không hợp lệ (6a):* lỗi dưới nhóm "Khu vực": "Khu vực không hợp lệ" (UC-U02 5a, BR-U05).
  - *Tỉnh/thành của người dùng chưa có trong danh mục (2b):* không chọn được; các trường khác vẫn lưu được.
  - *Lỗi tải danh mục (lỗi mạng/hệ thống):* dùng khung lỗi chung + "Thử lại" trong danh sách thả xuống `[cần xác nhận]` (§4 mục 7).
- **Responsive / a11y:**
  - Desktop: hai combobox trên một hàng, danh sách thả xuống ngay dưới ô.
  - Mobile: hai ô xếp dọc; chạm ô mở **bottom sheet** chọn (tiêu đề "Chọn tỉnh/thành" / "Chọn phường/xã" + tên tỉnh, ô lọc, danh sách một chọn) — chưa có mockup mobile (§1).
  - Combobox theo mẫu ARIA `combobox` + `listbox`; mỗi ô có `label`; điều hướng ↑/↓, Enter chọn, Esc đóng; lỗi gắn bằng `aria-describedby`.
- **Không implement** (Stitch tự thêm, SRS không có): footer "© 2025 ArenaFlow… / Điều khoản / Chính sách bảo mật / Hỗ trợ"; dấu ✓ cạnh mục đang tô sáng chỉ là trạng thái hover/active, không phải đã lưu. Ảnh avatar trong mockup lỗi tải — dùng avatar như USER-001 S4.
- **Liên quan S3 (USER-001):** AC-U04-04 yêu cầu khu vực hiển thị "phường/xã kèm tên tỉnh/thành" — S3 hiện "Phường Bến Nghé, TP. Hồ Chí Minh" `[cần xác nhận]` (§4 mục 8).

### S9 — Mời thành viên: tìm người (thay đổi màn S9 của USER-001)
- **Mục đích:** đội trưởng tìm người cần mời bằng SĐT hoặc tên hiển thị, chọn một người rồi gửi lời mời (UC-U05 → UC-T02; đóng USER-001 §4 mục 2).
- **Thay đổi so với USER-001 S9:** thay ô "ID hoặc username người được mời" bằng **một ô tìm** + danh sách kết quả chọn một. Dialog (desktop) / bottom sheet (mobile), dòng mô tả BR-T04 và hai nút "Huỷ" / "Gửi lời mời" giữ nguyên.
- **Thành phần UI chính:**
  - Nhãn "Số điện thoại hoặc tên hiển thị"; ô tìm có icon kính lúp, tối đa 100 ký tự; gợi ý xám "Nhập số điện thoại hoặc ít nhất 2 ký tự của tên" (BR-U10).
  - Danh sách kết quả dạng nhóm radio (tối đa 20 dòng, cuộn trong dialog). Mỗi dòng **chỉ** có avatar + tên hiển thị — **không** số điện thoại (BR-U11, BC-U03).
  - Dòng có nhãn "Đã là thành viên" / "Đã được mời": mờ, radio vô hiệu, không chọn được (BR-U15, UC-U05 4a).
- **Dữ liệu hiển thị:** tên hiển thị, ảnh đại diện (UC-U05 bước 4). Không có ảnh → avatar chữ cái đầu. Thứ tự theo hệ thống trả (BR-U10).
- **Thao tác:**
  - Gõ → hệ thống tự tìm sau khi người dùng ngừng gõ một khoảng ngắn; nhập tên dưới 2 ký tự chữ/số thì không tìm (BR-U10, UC-U05 2a).
  - Chọn một người không có nhãn → bật "Gửi lời mời". Chưa chọn ai → nút vô hiệu.
  - "Gửi lời mời" thành công → đóng dialog, toast "Lời mời đã được gửi" (như USER-001 S9).
  - Đổi chuỗi tìm → bỏ lựa chọn cũ.
- **Trạng thái:**
  - *Ban đầu:* ô trống, chưa có danh sách, chỉ có gợi ý.
  - *Đang tìm:* spinner trong ô tìm, danh sách cũ mờ đi.
  - *Tên dưới 2 ký tự (2a):* thông báo dưới ô "Nhập ít nhất 2 ký tự".
  - *SĐT không hợp lệ (2b2):* lỗi dưới ô "Số điện thoại không hợp lệ".
  - *Không có ai (4c):* "Không tìm thấy người dùng" trong vùng kết quả.
  - *Hơn 20 người khớp (3a):* 20 dòng + dòng nhắc cuối danh sách "Nhập thêm để thu hẹp kết quả".
  - *Tìm quá nhanh (1b):* "Bạn tìm quá nhanh, vui lòng thử lại sau"; ô tìm tạm khoá tới khi hết thời gian chờ (API_Spec USER-003 §2.3; hiển thị đếm ngược hay không `[cần xác nhận]` §4 mục 9).
  - *Không còn quyền tìm (1a — không còn là đội trưởng / đội bị khoá / đã giải tán / không có đội):* đóng dialog, tải lại chi tiết đội, ẩn nút "Mời thành viên"; thông điệp theo quy tắc mời hiện hành `[cần xác nhận]` (§4 mục 10).
  - *Gửi lời mời bị từ chối (6a):* "Không tìm thấy người dùng" / "Người này đã là thành viên hoặc đã được mời" dưới danh sách; tìm lại để cập nhật nhãn (BR-U14).
  - *Lỗi hệ thống:* "Đã xảy ra lỗi hệ thống", gợi ý nhập thêm chữ để thu hẹp (API_Spec USER-003 §2.3).
  - *Đang gửi:* nút "Gửi lời mời" vô hiệu + spinner (chống bấm hai lần).
- **Responsive / a11y:**
  - Desktop dialog ~600px; mobile bottom sheet cao tối đa ~90% màn, ô tìm ghim trên, danh sách cuộn, hai nút ghim đáy.
  - Ô tìm có `label`; vùng kết quả `role="radiogroup"` có `aria-label`; số kết quả / thông báo trạng thái đọc qua `aria-live="polite"`; dòng có nhãn dùng `aria-disabled` và nhãn là chữ (không chỉ dựa vào độ mờ).
  - Quy tắc focus của dialog như USER-001 S5.
- **Lỗi mockup desktop (Stitch):** ảnh `S9-…-desktop.png` hiển thị **dialog cũ** "ID hoặc username" (USER-001) đè lên dialog mới, và header nền phía sau có "Giới thiệu / Sân bãi / Tìm đối / Cộng đồng". Trong `S9-…-desktop.html`: khối dialog **đúng** là khối đầu tiên (`role="dialog"`, `id="invite-modal-title"`); khối dialog thứ hai (ô "ID hoặc username…", "hoangnam_99") và header nền là phần thừa — **không implement**. Sửa trên Stitch (`edit_screens`) bị timeout; cần sinh lại khi Stitch ổn định.
- **Không implement** (Stitch tự thêm): icon "send" trong nút "Gửi lời mời" (tuỳ chọn), dòng mô tả vị trí dưới tên ở bảng nền.

### S15 — Lời mời của tôi (mới)
- **Mục đích:** người được mời xem mọi lời mời **đang chờ** gửi tới mình ở một nơi và chấp nhận/từ chối, không phụ thuộc thông báo (UC-T07; đóng USER-001 §4 mục 1).
- **Thành phần UI chính:**
  - Header ứng dụng (mục "Lời mời của tôi" đang chọn) — §3.
  - Tiêu đề "Lời mời của tôi", dòng phụ "<n> lời mời đang chờ" (tổng số — BR-T17).
  - Danh sách thẻ lời mời xếp dọc, mới nhất ở trên (BR-T17); phân trang "Trước | 1 | 2 | Sau" (USER-001 §3).
- **Dữ liệu mỗi thẻ (BR-T17):** logo đội (không có → icon mặc định), tên đội, huy hiệu trạng thái đội ("Hoạt động" / "Bị khoá" — có chữ + icon), chip nhãn trình độ (0–3), "Đội trưởng: <tên>" (đội trưởng **hiện tại** — AC-T07-01b; người đã xoá → "Người dùng đã xóa" — BR-U17), "<n> thành viên", "Mời lúc dd/mm/yyyy HH:mm".
- **Thao tác:**
  - "Chấp nhận" / "Từ chối" → UC-T03; thành công → thẻ biến mất, tổng số giảm (BR-T18). Chấp nhận → đội có trong S16 (UC-T07 bước 5). Thông điệp sau thao tác `[cần xác nhận]` (§4 mục 6).
  - "Xem đội" → chi tiết đội (UC-T07 2b) `[cần xác nhận]` (§4 mục 4).
- **Trạng thái:**
  - *Đội bị khoá (2c, BR-T16):* thẻ vẫn hiện, dải thông báo nền vàng có icon "Đội đang tạm ngưng — chưa thể chấp nhận/từ chối"; hai nút vô hiệu.
  - *Bấm khi đội vừa bị khoá (3a):* "Đội đang tạm ngưng hoạt động"; lời mời vẫn chờ; tải lại danh sách để thẻ chuyển sang trạng thái khoá.
  - *Đội vừa giải tán (3b):* "Đội đã giải tán"; tải lại, thẻ biến mất.
  - *Lời mời đã xử lý ở nơi khác (3c):* "Lời mời đã được xử lý"; tải lại danh sách.
  - *Đang xử lý một thẻ:* hai nút của thẻ đó vô hiệu + spinner trên nút vừa bấm (chống bấm hai lần); thẻ khác vẫn thao tác được.
  - *Empty (2a):* "Bạn chưa có lời mời nào" (khung empty chung, không có phân trang).
  - *Loading:* skeleton 3 thẻ.
  - *Lỗi tải:* khung lỗi chung + "Thử lại".
  - *Tài khoản đã bị xoá nhưng phiên còn hạn:* đăng xuất, về S1 (API_Spec USER-003 §2.4).
- **Responsive / a11y:**
  - Desktop: thẻ rộng ~960px, nút ở mép phải thẻ. Mobile: thẻ full width, thông tin xếp dọc, hai nút chia đôi hàng ở cuối thẻ.
  - Danh sách là `<ul>`; mỗi thẻ có tiêu đề là tên đội; nút có `aria-label` kèm tên đội ("Chấp nhận lời mời của FC Sao Mai"); dải "tạm ngưng" là chữ, không chỉ màu; kết quả thao tác đọc qua `aria-live`.
- **Mockup:** chưa sinh được (§1).

### S16 — Đội của tôi (mới)
- **Mục đích:** xem các đội mình đang là thành viên đang hoạt động, kèm vai trò và trạng thái đội; lọc nhanh các đội mình làm đội trưởng — đúng tập đội đang chặn xoá tài khoản (UC-T08, BR-T21; đóng USER-001 §4 mục 5).
- **Thành phần UI chính:**
  - Header ứng dụng (mục "Đội của tôi" đang chọn) — §3.
  - Tiêu đề "Đội của tôi", dòng phụ "<n> đội đang tham gia" (tổng số của danh sách đang xem).
  - Công tắc (switch) "Chỉ đội tôi làm đội trưởng" (BR-T21). **Không** có tab lọc trạng thái đội (BR-T19).
  - Danh sách hàng đội, cả hàng bấm được (mũi tên ">"), phân trang.
- **Dữ liệu mỗi hàng (BR-T20):** logo đội, tên đội, huy hiệu vai trò của tôi ("Đội trưởng" có icon vương miện / "Thành viên"), huy hiệu trạng thái đội ("Hoạt động" / "Bị khoá"), chip nhãn trình độ, "Đội trưởng: <tên>" (BR-U17), "<n> thành viên", "Tham gia dd/mm/yyyy HH:mm". Thứ tự: đội tôi làm đội trưởng trước, rồi tham gia mới nhất trước (BR-T20).
- **Thao tác:**
  - Bấm hàng → chi tiết đội S8a (USER-001; góc nhìn theo vai trò).
  - Bật/tắt công tắc → tải lại danh sách từ trang 1.
  - Luồng dọn đội trước khi xoá tài khoản (1a, AC-T08-03): vào S16 với công tắc **bật** → mở từng đội → chuyển quyền (S10) / giải tán (S12) → quay lại, đội đó rời khỏi danh sách lọc. Lối vào từ S5 `[cần xác nhận]` (§4 mục 3).
- **Trạng thái:**
  - *Empty không lọc (2a):* "Bạn chưa tham gia đội nào".
  - *Empty khi bật lọc (4a):* "Bạn không làm đội trưởng đội nào".
  - *Loading:* skeleton 4 hàng; công tắc vẫn bấm được.
  - *Lỗi tải:* khung lỗi chung + "Thử lại".
  - *Đội thay đổi giữa lúc xem và lúc thao tác (5a):* thao tác trên S8a theo quy tắc hiện hành; quay lại S16 thì tải lại danh sách.
  - *Tài khoản đã bị xoá nhưng phiên còn hạn:* đăng xuất, về S1 (API_Spec USER-003 §2.5).
- **Responsive / a11y:**
  - Desktop: hàng ngang ~960px. Mobile: hàng thành thẻ, huy hiệu xuống dòng dưới tên; công tắc full width dưới tiêu đề.
  - Công tắc là `role="switch"` có nhãn chữ, `aria-checked`; mỗi hàng là link có tên đội; vai trò và trạng thái luôn có chữ (không chỉ màu/icon).
- **Mockup:** chưa sinh được (§1). Dự kiến: desktop công tắc tắt (4 đội, 2 vai trò, có đội bị khoá); mobile công tắc bật (2 đội làm đội trưởng).

## 3. Thành phần dùng chung giữa các màn hình
- Dùng lại toàn bộ §3 của `docs/agent/design/USER-001/UI_Design.md`: theme, dialog/bottom sheet, badge trạng thái đội, chip nhãn trình độ, phân trang, hiển thị người dùng đã xoá, khung loading/empty/error.
- **Thay đổi đề xuất cho header ứng dụng** `[cần xác nhận]` (§4 mục 1): mục điều hướng "Đội bóng" (S6) · "Đội của tôi" (S16) · "Lời mời của tôi" (S15, huy hiệu số lời mời đang chờ). Mockup S4/S9 desktop đã vẽ theo đề xuất này.
- **Mới:**
  - **Combobox chọn từ danh sách tự lọc** (S4): danh sách đầy đủ tải một lần, lọc phía ứng dụng; mobile mở bottom sheet.
  - **Ô tìm + danh sách chọn một có nhãn khoá** (S9).
  - **Thẻ đội rút gọn** (S15, S16): logo, tên, huy hiệu trạng thái (+ vai trò ở S16), chip trình độ, dòng thông tin "Đội trưởng · thành viên · thời điểm". Gần thẻ đội S6 — tái dùng khi thiết kế kỹ thuật.
  - **Huy hiệu vai trò** "Đội trưởng" / "Thành viên" (S16).
  - **Dải thông báo trong thẻ** (S15, đội tạm ngưng): có thể dùng chung với banner trạng thái đội của USER-002.

## 4. `[cần xác nhận]`
> Không chặn thiết kế UI (user duyệt trước toàn bộ UI/UX 2026-11-27); cần chốt trước hoặc trong lúc làm `solution-architect`. Phần thuộc hợp đồng API → đề xuất làm ở repo BE.

1. **Header ứng dụng:** thêm "Đội bóng" (S6) và "Lời mời của tôi" (S15, kèm huy hiệu số), "Đội của tôi" trỏ sang S16 thay vì S6 — đổi khung chung của USER-001. Huy hiệu số cần thêm 1 lần gọi danh sách lời mời trên mọi trang (ảnh hưởng ngưỡng số API call — `non-functional-standards.md`).
2. **S6 khối "Lời mời đang chờ" (USER-001):** trùng chức năng S15 — giữ, bỏ, hay thay bằng link sang S15. Màn S6 thuộc USER-001, USER-003 không sửa.
3. **Lối vào S16 từ S5 bị chặn (USER-002):** thêm link "Xem các đội bạn làm đội trưởng" trên banner S5 mở S16 với công tắc bật (UC-T08 1a) — SRS chỉ nói "User mở Đội của tôi với lọc", không nêu link.
4. **"Xem đội" từ lời mời (S15):** người chưa là thành viên mở chi tiết đội — S8a chưa có góc nhìn "người ngoài đội" (không nút Rời đội, không nút quản lý).
5. **`captainName` null** (đội không còn đội trưởng đang hoạt động — API_Spec USER-003 §4.2) ở S15/S16: hiển thị "Đội trưởng: —"? SRS không nêu.
6. **Chấp nhận / từ chối ở S15:** "Từ chối" có cần hộp xác nhận không; nội dung toast sau khi chấp nhận/từ chối; câu chữ chính xác cho 3c ("Lời mời đã được xử lý"). SRS chỉ nêu ý.
7. **Câu chữ S4** cho: đang tải danh mục, lọc không khớp mục nào, lỗi tải danh mục, danh mục tỉnh/thành rỗng — SRS không nêu.
8. **Hiển thị khu vực ở S3 (USER-001)** dạng "Phường Bến Nghé, TP. Hồ Chí Minh" (AC-U04-04) — USER-001 S3 hiện chỉ có "Khu vực"; và bỏ chọn khu vực (để trống) có được không khi hồ sơ đã có khu vực (USER-001 API 2.6).
9. **Tìm quá nhanh (S9):** có hiện đếm ngược thời gian chờ không; header `Retry-After` chưa đọc được do CORS (API_Spec USER-003 §6 mục 1) → mặc định chờ 60 giây.
10. **S9 mất quyền tìm (TEAM_001/002/015/016):** câu thông báo cho người dùng — dùng thông điệp của quy tắc mời USER-001 (UC-T02) hay chỉ tải lại chi tiết đội.
11. **Nút "Tạo đội" ở S16:** có đặt ở "Đội của tôi" không (hiện chỉ ở S6). SRS USER-003 không nêu; mockup S16 không vẽ.
12. **Đánh số màn:** S15, S16 nối tiếp đánh số chung USER-001/002 thay vì đánh lại từ S1 trong USER-003.
13. **Mockup còn thiếu / lỗi:** S4 mobile, S9 mobile, S15 desktop+mobile, S16 desktop+mobile chưa sinh được; S9 desktop ảnh lỗi (dialog cũ đè lên) — cần chạy lại `ui-designer` khi Stitch hết timeout.
