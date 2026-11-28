# UI Design — NOTIFICATION-001 Thông báo in-app

| Mục | Giá trị |
|---|---|
| Mã chức năng | `NOTIFICATION-001` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (NOTIFICATION-001 nằm trong SYSTEM-001 — mục lục `docs/agent/upstream/README.md`): UC-N02, UC-N03; BR-N02, BR-N07..BR-N12; BC-N02; Business_Rules §8.6 (35 loại); AC-N02, AC-N08. Hợp đồng API: `docs/agent/upstream/api/NOTIFICATION-001/API_Spec.md` v2.0. Định dạng thời gian: `docs/agent/upstream/api/SYSTEM-002/API_Spec.md` §1.1 |
| Căn cứ | `ArenaFlow-spec@53aee11` |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280) + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-27` / `v1.0` |

> Khung app (header, menu avatar, layout quản trị, theme) dùng lại `docs/agent/design/USER-001/UI_Design.md` §3. NOTIFICATION-001 chỉ **thêm** nút chuông + badge vào header đó, và các màn hình thông báo bên dưới.
> "Tin nhắn" (danh sách chat, dấu chưa đọc của chat, tín hiệu realtime `CONVERSATION_ACTIVITY`) thuộc MATCH-001 — không vẽ ở đây. Chuông **không** tính tin nhắn chat (BR-N12).

## 1. Danh sách màn hình

| # | Màn hình | Use case (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Danh sách thông báo — chuông + badge; panel thả xuống (desktop) / trang "Thông báo" (mobile) | UC-N02 luồng người nhận bước 1–4, BR-N11, BR-N02, AC-N08 | `6079696bea264cbaa6897062122c9876` / `33692fa29d5e46d3b40ac9da5e5ce8df` | `S1-danh-sach-thong-bao-{desktop,mobile}.{png,html}` |
| S2 | Trạng thái danh sách: đang tải · chưa có thông báo · đã đọc hết (tab Chưa đọc) · lỗi tải · lỗi tải thêm | UC-N02, BR-N02, BR-N11 | `adf4e620cd864640b59af24ec9ee27c3` / `65d021fcd2af416e986552be89e22e9d` | `S2-trang-thai-danh-sach-{desktop,mobile}.{png,html}` |
| S3 | Thông báo mới realtime — toast + badge tăng | UC-N02 bước 4, BR-N10, AC-N08 ("app đang mở → hiện ngay") | `aebe88c1eed140b587f1767482fa3ed2` / `20fe285603aa46d2b33111ab1b970905` | `S3-thong-bao-moi-realtime-{desktop,mobile}.{png,html}` |
| S4 | Biểu tượng theo nhóm loại thông báo (bảng tham chiếu) | Business_Rules §8.6, BR-N07; API_Spec §4.2 | `328751507c4b4e4195356fa4bca5fdee` / `a85cc33a225a488e96b6586a5f25c306` | `S4-nhom-thong-bao-{desktop,mobile}.{png,html}` |

> Mỗi màn có bản desktop và mobile. Screen id dùng để mở lại trên Stitch (`projects/2789586751825382546/screens/<id>`).

## 2. Chi tiết từng màn hình

> Dữ liệu trong mockup (tên đội, tên sân, giờ, tên người dùng) là **dữ liệu mẫu**. Tiêu đề / nội dung thông báo thật do hệ thống soạn sẵn; FE hiển thị **nguyên văn**, không tự ghép câu theo loại (BR-N09, API_Spec §1.1).
> Mockup chỉ dùng để tham khảo, không copy HTML từ Stitch vào `src/`. Màu trong code lấy từ token design system (§3), không lấy các mã màu Tailwind mặc định mà Stitch tự sinh (vd `amber-100`, `rose-100`, `#16a34a`).

### S1 — Danh sách thông báo (chuông + panel / trang)

- **Mục đích:** người dùng xem thông báo của mình trong 30 ngày gần nhất, mới nhất trước; lọc "chỉ chưa đọc"; tải thông báo cũ hơn; bấm một thông báo để mở màn hình liên quan; đánh dấu tất cả đã đọc (UC-N02 luồng người nhận, BR-N11).
- **Chọn panel (desktop) / trang riêng (mobile) — lý do:**
  - Desktop: panel thả xuống dưới chuông (~400px), mở trên mọi trang, không rời màn hình đang làm. Thông báo là thao tác nhanh "xem → bấm đi tiếp".
  - Mobile 390px: không đủ chỗ cho popover; dùng trang "Thông báo" toàn màn hình, có nút quay lại.
  - `[cần xác nhận]` Desktop có cần thêm trang "Thông báo" đầy đủ (vd mở thẳng URL) hay chỉ có panel — §4 mục 2.
- **Thành phần UI chính:**
  - **Chuông trên header** (header chung USER-001 §3, đặt bên trái avatar): icon `notifications`, badge đỏ số chưa đọc. Trạng thái "đang mở" có nền tròn xanh nhạt.
  - **Đầu panel / trang:** tiêu đề "Thông báo"; nút chữ `done_all` "Đánh dấu tất cả đã đọc" (desktop) / "Đọc tất cả" (mobile). Mobile có nút quay lại.
  - **Tab phân đoạn:** "Tất cả" (mặc định) | "Chưa đọc" kèm số chưa đọc.
  - **Danh sách:** mỗi dòng gồm icon tròn 40px theo nhóm loại (S4), tiêu đề (1 dòng, cắt `…`), nội dung (tối đa 2 dòng), thời điểm.
  - **Cuối danh sách:** nút viền "Tải thêm" (khi còn thông báo cũ hơn) và dòng phụ "Chỉ hiển thị thông báo trong 30 ngày gần nhất" (BR-N02).
- **Dữ liệu hiển thị:**

  | Hiển thị | Nguồn |
  |---|---|
  | Số trên badge chuông và tab "Chưa đọc" | Số thông báo chưa đọc trong 30 ngày, không tính chat (BR-N11, BR-N12; API 2.2) |
  | Tiêu đề, nội dung | Nguyên văn do hệ thống soạn (BR-N09) |
  | Icon, màu icon | Theo loại thông báo → nhóm (S4) |
  | Thời điểm | Thời điểm tạo, in nguyên giá trị giờ Việt Nam, định dạng `HH:mm · DD/MM/YYYY` (SYSTEM-002 §1.1 — không đổi theo múi giờ máy) |
  | Chưa đọc / đã đọc | Trạng thái đọc của thông báo |

- **Hiển thị chưa đọc / đã đọc:**
  - *Chưa đọc:* nền dòng xanh rất nhạt, tiêu đề đậm, chấm xanh primary bên phải, kèm chữ ẩn "Chưa đọc" cho trình đọc màn hình.
  - *Đã đọc:* nền trắng, tiêu đề thường, không có chấm.
- **Badge chuông:** `unreadCount = 0` → ẩn badge; 1..99 → số; > 99 → "99+".
- **Thao tác:**
  - Bấm chuông: desktop → mở / đóng panel; mobile → sang trang "Thông báo".
  - Đổi tab "Tất cả" / "Chưa đọc" → tải lại danh sách theo bộ lọc.
  - "Tải thêm" → nối thông báo cũ hơn vào cuối danh sách; hết thông báo cũ hơn → ẩn nút, chỉ còn dòng phụ 30 ngày.
  - **Bấm một thông báo:**
    - Chưa đọc → đánh dấu đã đọc (dòng chuyển sang kiểu đã đọc, badge −1) **và** mở màn hình liên quan (§2 "Điều hướng theo loại màn hình liên quan").
    - Đã đọc → chỉ mở màn hình liên quan.
    - Không có màn hình liên quan (hoặc loại chưa biết) → chỉ đánh dấu đã đọc, ở lại danh sách; dòng không có kiểu "link" (API_Spec §1.1).
    - Thông báo không còn tồn tại (quá 30 ngày / đã bị xoá — UC-N02 U3a) → bỏ dòng khỏi danh sách; vẫn mở màn hình liên quan nếu có (API_Spec 2.3).
    - Desktop: panel đóng sau khi điều hướng.
  - **"Đánh dấu tất cả đã đọc":** mọi dòng đang hiển thị thành đã đọc, badge về 0 (ẩn). Thông báo đến sau thao tác vẫn chưa đọc (BR-N11). Bị disable khi số chưa đọc = 0 hoặc đang tải. Đang xử lý → disable, tránh bấm hai lần.
  - **Không có** thao tác xoá, "đánh dấu chưa đọc", hay cài đặt loại thông báo (BR-N11; API_Spec §1 "Ngoài phạm vi").
- **Trạng thái:** đang tải · rỗng · lỗi → S2. Thông báo mới khi panel / trang đang mở → chèn lên đầu danh sách, không hiện toast (S3).
- **Responsive / a11y:**
  - Chuông là `<button>` có `aria-label` gồm số chưa đọc (vd "Thông báo, 3 chưa đọc"); desktop thêm `aria-haspopup` + `aria-expanded`.
  - Panel desktop: vùng có nhãn "Thông báo"; `Esc` hoặc bấm ra ngoài để đóng, focus trả về chuông.
  - Danh sách là `<ul>`; mỗi dòng là một phần tử bấm được bằng bàn phím (Enter); tên truy cập gồm tiêu đề + nội dung + thời điểm + "chưa đọc".
  - Chưa đọc không chỉ thể hiện bằng màu: có chữ đậm + chấm + chữ ẩn.
  - Tab là `role="tablist"`.
  - Mobile: mỗi dòng cao ≥ 64px.
- **Không implement (Stitch tự thêm, không có trong SRS):**
  - Desktop: dòng "Thành viên từ 10/11/2026" trên thẻ hồ sơ nền.
  - Mobile: chấm chưa đọc dùng `#16a34a` → code dùng màu primary.
  - Nền mockup desktop là trang "Hồ sơ cá nhân" (USER-001 S3) — panel mở trên **mọi** trang.

### S2 — Trạng thái danh sách

- **Mục đích:** chuẩn hoá các trạng thái của panel (desktop) / trang (mobile) ở S1.
- **Các trạng thái:**

  | Trạng thái | Hiển thị | Nguồn |
  |---|---|---|
  | Đang tải (lần đầu, đổi tab) | 3–4 dòng skeleton (tròn + 2 thanh). Nút "Đánh dấu tất cả đã đọc" disable | — |
  | Rỗng — tab "Tất cả" | Icon chuông trong vòng tròn nhạt, "Chưa có thông báo nào", "Thông báo trong 30 ngày gần nhất sẽ hiển thị ở đây." | BR-N02 |
  | Rỗng — tab "Chưa đọc" | Icon `done_all`, "Bạn đã đọc hết thông báo", "Không có thông báo chưa đọc trong 30 ngày gần nhất.", link "Xem tất cả thông báo" (→ tab "Tất cả") | BR-N11 |
  | Lỗi tải | Icon lỗi nền đỏ nhạt, "Không tải được thông báo", "Đã có lỗi xảy ra. Vui lòng thử lại.", nút "Thử lại" | — |
  | Lỗi khi tải thêm | Giữ danh sách đã có; cuối danh sách hiện "Không tải thêm được thông báo." + nút chữ "Thử lại" | — |
  | Đang tải thêm | Nút "Tải thêm" có spinner, disable | — |

- **Xử lý lỗi đặc biệt (không có giao diện riêng):**
  - Mốc tải thêm không còn hợp lệ (`NOTIFICATION_002`) → tự tải lại trang đầu, không báo lỗi (API_Spec 2.1).
  - Tài khoản đã bị xoá (`USER_001`) → đăng xuất như USER-001.
  - Đánh dấu tất cả đã đọc thất bại → toast lỗi chung, giữ nguyên trạng thái.
- **Responsive / a11y:** khối lỗi dùng `role="alert"`; skeleton có `aria-busy="true"` trên danh sách; icon trạng thái là trang trí (`aria-hidden`).
- **Không implement:**
  - Desktop: tiêu đề trang "Hệ thống trạng thái / Trạng thái danh sách thông báo", dòng giới thiệu, khối "Quy tắc tương tác hệ thống thông báo ArenaFlow" và footer (điều khoản, bản quyền) — chỉ là khung trình bày bảng trạng thái.
  - Desktop: tab dạng gạch chân và nút "Đánh dấu tất cả đã đọc" màu xanh ở panel 3 — code dùng tab phân đoạn như S1 và nút disable khi số chưa đọc = 0.
  - Desktop panel 3 thiếu dòng phụ "Không có thông báo chưa đọc trong 30 ngày gần nhất." — code có dòng này.
  - Mobile: nhãn "Trạng thái 1..4", dòng mẫu "Trận đấu Sân Thống Nhất đã bắt đầu" / "10 phút trước" (không phải loại thông báo có thật, và thời gian hiển thị theo định dạng tuyệt đối ở S1).

### S3 — Thông báo mới realtime

- **Mục đích:** khi app đang mở, thông báo mới hiện ngay (UC-N02 bước 4, BR-N10, AC-N08).
- **Thành phần UI chính:**
  - **Badge chuông** tăng 1, có vòng nhấp nháy nhẹ một lần.
  - **Toast** (desktop: góc trên phải dưới header, rộng ~380px; mobile: ngay dưới header, rộng toàn khung, lề 12px): viền trái xanh 4px, icon nhóm (S4), nhãn "Thông báo mới", tiêu đề đậm, nội dung tối đa 2 dòng, thời điểm, nút chữ "Xem", nút đóng `X`.
- **Thao tác:**
  - "Xem" (hoặc bấm vào toast) → như bấm một thông báo ở S1: đánh dấu đã đọc + mở màn hình liên quan. Thông báo không có màn hình liên quan → toast không có nút "Xem", chỉ có nút đóng.
  - `X` → đóng toast; thông báo vẫn chưa đọc.
  - Tự ẩn sau một khoảng thời gian; dừng đếm khi rê chuột / focus vào toast. `[cần xác nhận]` thời lượng và số toast hiển thị cùng lúc (§4 mục 4).
  - Panel / trang "Thông báo" đang mở → không hiện toast; chèn thông báo lên đầu danh sách (bỏ trùng).
- **Đồng bộ:** mất kết nối rồi kết nối lại, hoặc app trở lại foreground → cập nhật lại số chưa đọc (BR-N10); không có banner "mất kết nối" riêng cho thông báo.
- **Responsive / a11y:**
  - Toast `role="status"`, `aria-live="polite"`; không lấy focus.
  - Vòng nhấp nháy tắt khi người dùng bật `prefers-reduced-motion`.
  - Nút đóng có `aria-label="Đóng thông báo"`.
- **Không implement:**
  - Desktop: nền trang khác USER-001 S3 (thống kê "Trận đã đấu", "Tỷ lệ thắng", "ID: #AF-…", "Trạng thái: Đang hoạt động", "Bảo mật tài khoản", "Thành viên ArenaFlow") — nền thực tế là trang đang mở.
  - Desktop: mục "Đội của tôi" ở header đang ở trạng thái active; avatar header là icon `person` — giữ như header USER-001.
  - Mobile: thống kê "Trận đấu / Bàn thắng / Điểm Fair-play", chip "Tiền đạo cánh", "Thành viên từ Tháng 3/2024", huy hiệu trên avatar.
  - Mobile: thời điểm rút gọn "15:00 · 16/11" và nút "Xem chi tiết" → code dùng đúng định dạng S1 (`HH:mm · DD/MM/YYYY`) và nhãn "Xem" như desktop.
  - Mobile: badge màu `error-container` nhạt → code dùng badge đỏ như S1.

### S4 — Biểu tượng theo nhóm loại thông báo

- **Mục đích:** bảng tham chiếu icon + tông màu cho 35 loại (Business_Rules §8.6). Loại chỉ dùng để chọn icon / màu; nội dung luôn lấy nguyên văn (API_Spec §1.1).
- **Tông màu (token design system, §3):**
  - *Tích cực / thông tin:* nền `primary-container`, icon `on-primary-container`.
  - *Nhắc việc:* nền `tertiary-container`, icon `on-tertiary-container`.
  - *Tiêu cực (huỷ, hết hạn, từ chối, thu hồi, tạm ngưng, bị report):* nền error nhạt, icon `error`.
  - *Admin / chưa biết:* nền `surface-container-high`, icon `on-surface-variant`.
  - Màu chỉ bổ trợ — ý nghĩa luôn nằm ở tiêu đề chữ.
- **Bảng loại → nhóm → icon → tông:**

  | # | Loại (§8.6) | Nhóm | Icon (Material Symbols) | Tông |
  |---|---|---|---|---|
  | 1 | `WELCOME` | Tài khoản | `waving_hand` | Tích cực |
  | 2 | `TEAM_INVITATION` | Đội & lời mời | `group_add` | Tích cực |
  | 3 | `TEAM_INVITATION_ACCEPTED` | Đội & lời mời | `how_to_reg` | Tích cực |
  | 4 | `TEAM_INVITATION_REJECTED` | Đội & lời mời | `person_remove` | Tiêu cực |
  | 5 | `CAPTAIN_TRANSFERRED` | Đội & lời mời | `shield_person` | Tích cực |
  | 6 | `TEAM_MARKED_INACTIVE` | Đội & lời mời | `block` | Tiêu cực |
  | 7 | `TEAM_REACTIVATED` | Đội & lời mời | `check_circle` | Tích cực |
  | 8 | `MATCH_REQUEST_RECEIVED` | Kèo & yêu cầu ghép | `sports_soccer` | Tích cực |
  | 9 | `REQUEST_WITHDRAWN` | Kèo & yêu cầu ghép | `undo` | Tiêu cực |
  | 10 | `REQUEST_ACCEPTED` | Kèo & yêu cầu ghép | `check_circle` | Tích cực |
  | 11 | `REQUEST_REJECTED` | Kèo & yêu cầu ghép | `cancel` | Tiêu cực |
  | 12 | `REQUEST_SUPERSEDED` | Kèo & yêu cầu ghép | `swap_horiz` | Tiêu cực |
  | 13 | `REQUEST_EXPIRED` | Kèo & yêu cầu ghép | `event_busy` | Tiêu cực |
  | 14 | `PAIRING_NEW` | Thương lượng | `handshake` | Tích cực |
  | 15 | `PAIRING_SUPERSEDED` | Thương lượng | `swap_horiz` | Tiêu cực |
  | 16 | `PAIRING_EXPIRED` | Thương lượng | `event_busy` | Tiêu cực |
  | 17 | `MATCH_CONFIRMED` | Kèo & yêu cầu ghép | `event_available` | Tích cực |
  | 18 | `MATCH_CANCELLED` | Kèo & yêu cầu ghép | `event_busy` | Tiêu cực |
  | 19 | `MATCH_EXPIRED` | Kèo & yêu cầu ghép | `event_busy` | Tiêu cực |
  | 20 | `REMINDER_BEFORE_MATCH` | Nhắc trận & đánh giá | `alarm` | Nhắc việc |
  | 21 | `MATCH_COMPLETED` | Nhắc trận & đánh giá | `rate_review` | Nhắc việc |
  | 22 | `MERCENARY_RATING_REMINDER` | Nhắc trận & đánh giá | `rate_review` | Nhắc việc |
  | 23 | `RATING_RECEIVED` | Nhắc trận & đánh giá | `star` | Tích cực |
  | 24 | `REPORT_RECEIVED` | Report & tranh chấp | `flag` | Tiêu cực |
  | 25 | `REPORT_DISPUTED` | Report & tranh chấp | `gavel` | Nhắc việc |
  | 26 | `DISPUTE_RESOLVED` | Report & tranh chấp | `gavel` | Tích cực |
  | 27 | `VERIFICATION_BADGE_GRANTED` | Huy hiệu xác minh | `verified` | Tích cực |
  | 28 | `VERIFICATION_BADGE_REVOKED` | Huy hiệu xác minh | `gpp_bad` | Tiêu cực |
  | 29 | `MERCENARY_APPLICATION` | Mercenary | `person_add` | Tích cực |
  | 30 | `MERCENARY_APPLICATION_APPROVED` | Mercenary | `how_to_reg` | Tích cực |
  | 31 | `MERCENARY_APPLICATION_REJECTED` | Mercenary | `person_remove` | Tiêu cực |
  | 32 | `MERCENARY_WITHDRAWN` | Mercenary | `person_remove` | Tiêu cực |
  | 33 | `MERCENARY_GAME_CANCELLED` | Mercenary | `event_busy` | Tiêu cực |
  | 34 | `VENUE_ADMIN_ALERT` | Admin | `admin_panel_settings` | Admin |
  | 35 | `DISPUTE_CREATED` | Admin | `gavel` | Admin |
  | — | Loại chưa biết (loại mới BE thêm sau) | Mặc định | `notifications` | Admin / chưa biết |

- **Ghi chú:** bảng nhóm / icon / tông là quyết định giao diện (SRS và API_Spec chỉ nói "`type` dùng để chọn biểu tượng / màu"), nằm trong phạm vi user đã duyệt trước 2026-11-27 — `[cần xác nhận]` §4 mục 8. Loại chưa biết vẫn hiển thị bình thường (API_Spec §1.1).
- **Mockup:** lưới 10 thẻ (desktop) / danh sách 10 dòng (mobile), mỗi nhóm một mẫu. **Bảng trên là nguồn chuẩn**; mockup chỉ minh hoạ tông màu.
- **Không implement:**
  - Desktop: header thiếu chuông (Stitch bỏ) — header thật như S1; nhãn "ID: 01..10", "Hệ thống thông báo S4", "10 nhóm hoạt động".
  - Mobile: bộ lọc "Tất cả (12) / Đội nhóm / Trận đấu / Hệ thống", thời gian tương đối ("10 phút trước", "Hôm qua"…), nội dung mẫu tự sinh (có tên cá nhân — trái BR-N09), khối "Biến thể cảnh báo" có nút "Xử lý ngay" / "Bỏ qua" và "Điểm uy tín sụt giảm", header có nút quay lại và icon `stadium` thay cho chuông.
  - Mobile: nhóm "Thương lượng" dùng `secondary-container`, "Mercenary" dùng nền xám — code theo bảng (tích cực = `primary-container`).

### Điều hướng theo loại màn hình liên quan

> Màn đích thuộc mã chức năng khác — chỉ ghi map, không vẽ. Đối tượng có thể đã đổi trạng thái hoặc người dùng không còn quyền xem (vd đã chuyển quyền đội trưởng) → màn đích tự xử lý lỗi của nó (BR-N09; API_Spec §4.3).

| Màn hình liên quan (`referenceType`) | Màn đích | Mã chức năng sở hữu |
|---|---|---|
| Kèo (`MATCH`) | Chi tiết kèo (đội tạo kèo: kèm yêu cầu / thương lượng; sau trận: đánh giá) | MATCH-001 (+ MATCH-002, REPUTATION-001) |
| Thương lượng (`PAIRING`) | Chi tiết thương lượng | MATCH-002 |
| Đội (`TEAM`) | Chi tiết đội — USER-001 S8a (đội đã giải tán: USER-002 S8b) / uy tín đội | USER-001, REPUTATION-001 |
| Lời mời vào đội (`TEAM_INVITATION`) | Lời mời vào đội — chấp nhận / từ chối. `[cần xác nhận]` §4 mục 1 | USER-001 / USER-003 |
| Người dùng (`USER`) | Hồ sơ của tôi — USER-001 S3 / uy tín cá nhân | USER-001, MERCENARY-001 |
| Địa điểm (`VENUE`) | Chi tiết địa điểm (Admin) | VENUE-001 |
| Report (`REPORT`) | Danh sách report (đội / cá nhân) | REPUTATION-001, MERCENARY-001 |
| Tranh chấp (`DISPUTE`) | Admin: chi tiết tranh chấp | REPUTATION-001 |
| Tranh chấp mercenary (`MERCENARY_DISPUTE`) | Admin: chi tiết tranh chấp mercenary | MERCENARY-001 |
| Đơn ứng tuyển (`MERCENARY_APPLICATION`) | Chi tiết đơn (đội trưởng: kèm ứng viên của tin tuyển) | MERCENARY-001 |
| Không có / chưa biết | Không điều hướng — chỉ đánh dấu đã đọc | — |

- Màn đích chưa được thiết kế / triển khai → `[cần xác nhận]` cách xử lý tạm (§4 mục 6).

## 3. Thành phần dùng chung giữa các màn hình

- **Header ứng dụng** (USER-001 §3): thêm **nút chuông + badge** bên trái avatar, có ở mọi trang đã đăng nhập. `[cần xác nhận]` có thêm vào header layout quản trị (USER-001 S13, USER-002 S14) hay không — §4 mục 3.
- **Dòng thông báo:** icon nhóm (S4) + tiêu đề + nội dung + thời điểm + trạng thái đọc. Dùng ở S1 (panel desktop, trang mobile) và S3 (toast, biến thể có nút "Xem" / đóng).
- **Badge số chưa đọc:** ẩn khi 0, "99+" khi > 99. Dùng ở chuông và tab "Chưa đọc".
- **Tab phân đoạn "Tất cả" / "Chưa đọc":** S1, S2.
- **Khối trạng thái rỗng / lỗi:** S2 — cùng phong cách khung empty / lỗi chung USER-001.
- **Toast:** S3 — kiểu toast khác toast kết quả thao tác của USER-001 (có icon nhóm và nút "Xem").
- **Theme:** project Stitch `ArenaFlow` — font Be Vietnam Pro; primary `#3d6943`, error `#a73b21`, tertiary `#5c6330`, nền `#f8faf3`; bo góc 8px (`ROUND_EIGHT`). Kiểm tra 2026-11-27: các màn S1–S4 sinh với design system `assets/17011466837528823159`, đúng font và màu primary; lệch chỉ ở một số mã màu Tailwind mặc định Stitch tự dùng (đã ghi "Không implement" từng màn).

## 4. `[cần xác nhận]`

> Không chặn thiết kế UI (user duyệt trước 2026-11-27); cần chốt trước hoặc trong lúc làm `solution-architect`.

1. **Màn đích của "Lời mời vào đội" (`TEAM_INVITATION`):** API_Spec §4.3 trỏ "Lời mời vào đội — chấp nhận / từ chối" (USER-001 2.13, 2.14). Ở FE có hai nơi: khối "Lời mời đang chờ" ở USER-001 S6 và "Lời mời của tôi" (USER-003, UC-T07). Chọn màn nào, và có làm nổi lời mời theo id không.
2. **Desktop chỉ có panel hay thêm trang "Thông báo":** đề xuất có một route "Thông báo" dùng chung; desktop bấm chuông mở panel, mở thẳng URL thì hiện danh sách dạng trang như mobile.
3. **Chuông ở layout quản trị:** Admin nhận `VENUE_ADMIN_ALERT`, `DISPUTE_CREATED` (BR-N08). Đề xuất có chuông ở cả header layout quản trị, cùng một danh sách.
4. **Hành vi toast (S3):** đề xuất tự ẩn sau 6 giây, dừng khi rê chuột / focus; chỉ một toast một lúc (thông báo mới thay toast cũ). SRS chỉ yêu cầu "hiện ngay".
5. **"Tải thêm" bằng nút hay tự tải khi cuộn:** mockup vẽ nút "Tải thêm" (dễ dùng bằng bàn phím). Có thể thêm tự tải khi cuộn tới cuối — quyết ở `solution-architect`.
6. **Màn đích chưa có thiết kế / chưa triển khai** (MATCH-001/002, REPUTATION-001, MERCENARY-001, VENUE-001, USER-003): bấm thông báo khi màn đích chưa có → hành vi tạm (vd chỉ đánh dấu đã đọc, không điều hướng).
7. **Đánh dấu một thông báo đã đọc thất bại vì lỗi mạng (không phải "không tồn tại"):** đề xuất vẫn mở màn hình liên quan, dòng giữ trạng thái chưa đọc. API_Spec 2.3 chỉ nêu cách xử lý `NOTIFICATION_001`.
8. **Bảng nhóm / icon / tông (S4):** quyết định giao diện, SRS không quy định. Cần xác nhận nếu muốn đổi trước khi `solution-architect` đưa vào thiết kế component.
