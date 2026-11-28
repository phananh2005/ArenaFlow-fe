# UI Design — REPUTATION-001 Đánh giá, report, tranh chấp & uy tín đội

| Mục | Giá trị |
|---|---|
| Mã chức năng | `REPUTATION-001` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (UC-R01..R07, BR-R01..R10, BC-R03/R04, AC-R01..R08, Business_Rules §3.1–§3.3, §6) — mục lục `docs/agent/upstream/README.md`; hợp đồng tham chiếu `docs/agent/upstream/api/REPUTATION-001/API_Spec.md` v2.1 |
| Căn cứ | `ArenaFlow-spec@53aee11` |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280) + web mobile (trình duyệt điện thoại, khung 390px) — như USER-001 |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-27` / `v1.0` |

> Ngày giờ: giờ Việt Nam, hiển thị nguyên giá trị API trả về (SYSTEM-002), định dạng `dd/MM/yyyy HH:mm` như USER-001.
> Dữ liệu trong mockup (tên người, tên đội, sân, ngày) là **dữ liệu mẫu**. Mockup chỉ để tham khảo, không copy HTML từ Stitch vào `src/`.
> Ranh giới với mã khác: chi tiết kèo, kèo của đội, phòng chat hai đội thuộc **MATCH-001**; đánh giá/report/uy tín liên quan mercenary và uy tín cá nhân thuộc **MERCENARY-001**. REPUTATION-001 chỉ vẽ phần của mình và nêu **điểm gắn** (mục 3).

## 1. Danh sách màn hình

| # | Màn hình | Use case / rule (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Đánh giá đối phương (dialog / bottom sheet) | UC-R01, AC-R01, BR-R01, BR-R08, BR-R09, BR-R10 | `cd79179037d6420f9b33ddf4fa07263c` / `4b2156e24fda4744bf7314172c4b0ec7` | `S1-danh-gia-doi-phuong-{desktop,mobile}.{png,html}` |
| S2 | Gợi ý report bùng sau "Đội kia không đến" | UC-R01 bước 5 | `186417970eab49088a3c88aa718c3669` / `4e2f59977fd64e31a39ab68debcdef75` | `S2-goi-y-report-bung-…` |
| S3 | Khối "Đánh giá & report" trong chi tiết trận | UC-R01, UC-R02, AC-R07, BC-R03, BC-R04, BR-R08 | `d1862b9655f74118a2d528e698d34817` / `ffbfc6ff4afa4055b608ae82c32cc308` | `S3-danh-gia-report-tran-…` |
| S4 | Report đối phương (sau trận / kèo huỷ sau ghép) | UC-R02, AC-R02, BR-R06, BR-R07 (1)(2), BR-R09, §6.1 | `90930eb043604d3da47cdd631f813553` / `193afe83335c4b7bb5c8dd71cb56edc9` | `S4-report-doi-phuong-…` |
| S5 | Report "giao tiếp tệ" qua chat hai đội | UC-R02, AC-R08, BR-R07 (3) | `3627bfdb08d144ec9cc4fafa4045d54e` / `4784a62b4e504ccaad189aced037a961` | `S5-report-qua-chat-…` |
| S6 | Report của đội (tab Đội bị report / Đội đã report) | AC-R07, UC-R03 bước 1–2, BR-R05, BR-R10 | **chưa có** (Stitch timeout) / `49f6d69526bb4ba49de53847b240c68d` | `S6-report-cua-doi-mobile.{png,html}` |
| S7 | Tranh chấp report bùng | UC-R03, AC-R03, BR-R05, BR-R09, BR-R10 | **chưa có** / `46eb0cc47fcc45bb87ccc7b35c657df0` | `S7-tranh-chap-mobile.{png,html}` |
| S8 | Uy tín đội | UC-R05, UC-R06, UC-R07, BR-R02, BR-R03, BR-R04, Business_Rules §3.1 "Mức hiển thị" | **chưa có** / `da73a68e07e545c6b576afced8cae4b1` | `S8-uy-tin-doi-mobile.{png,html}` |
| S9 | Admin — danh sách tranh chấp | UC-R04 | **chưa có** / `6cc23efdd5ae434bbf8f5404afe60bf7` | `S9-admin-danh-sach-tranh-chap-mobile.{png,html}` |
| S10 | Admin — chi tiết + quyết định tranh chấp | UC-R04, AC-R03, BR-R09 | **chưa có** / `3e4a622f3e37402b9684f08ff9485944` | `S10-admin-chi-tiet-tranh-chap-mobile.{png,html}` |

**Ghi chú xuất file (lỗi Stitch khi nhiều phiên vẽ song song):**
- Bản desktop S6–S10 **chưa sinh được**: mọi lần gọi `generate_screen_from_text` với `DESKTOP` từ S6 trở đi đều timeout (S6 ×3, S7 ×3, S8 ×1, S9 ×1). Bố cục desktop mô tả bằng chữ ở mục 2, theo khung USER-001 — cần vẽ bổ sung khi Stitch ổn định.
- Stitch trộn khung (shell) của màn MATCH-001 / MERCENARY-001 vào một số màn của mã này. Đã xử lý:
  - S8, S9: bản đầu (`5825ab578f04468e8ec29003626a9e60`, `5c8dc2ec6ff44c6c8df91da246210344`) dính bottom sheet "Duyệt Trần Văn C?" của MERCENARY-001 → **bỏ**; dùng bản sửa / sinh lại ở bảng trên.
  - S7 bản đầu `189b0f5b58e44cde9e56a7da1be0ad18` vỡ bố cục → **bỏ**.
  - S7, S10 (mobile) và S5 (desktop): HTML tải về vẫn còn phần lẫn (bottom sheet, thanh đầu trang, mục menu "Tìm kèo mercenary"…). Đã **gỡ phần lẫn trong HTML ở `ui/`** (không đổi nội dung REPUTATION-001; S7, S10 thêm bảng màu token ArenaFlow vào cấu hình Tailwind để hiển thị đúng màu) và **render lại PNG** từ HTML đã làm sạch bằng Chrome headless. Màn tương ứng trên Stitch có thể vẫn còn phần lẫn.
  - Thẻ `<title>` HTML của S4 (desktop), S5, S7–S10 được sửa về đúng tên màn (Stitch ghi tên màn khác).

## 2. Chi tiết từng màn hình

### S1 — Đánh giá đối phương
- **Mục đích:** đội trưởng đánh giá đội đối phương sau trận (UC-R01). Mở từ nút "Đánh giá <đội>" ở S3 hoặc từ thông báo nhắc "Trận đấu hôm nay thế nào?…" (BR-N14 — NOTIFICATION-001).
- **Thành phần UI chính:** desktop là dialog (~560px), mobile là bottom sheet; nền là chi tiết trận (MATCH-001). Tiêu đề "Đánh giá đội <tên đội đối phương>", dòng phụ "Trận <giờ bắt đầu> · <sân>".
  - Segmented control 2 lựa chọn: "Chấm sao" / "Đội kia không đến" (UC-R01 bước 3).
  - **Chấm sao** (mockup desktop): "Số sao `*`" — 5 nút sao nguyên 1–5 + chữ "n/5"; "Tỷ số (không bắt buộc)" — 2 ô số (đội mình – đội đối phương), dòng phụ "Chỉ để lưu kỷ niệm, không ảnh hưởng điểm uy tín" (UC-R01 bước 6); "Nhận xét (không bắt buộc)" textarea, bộ đếm `n/500` (BR-R09).
  - **Đội kia không đến** (mockup mobile): ẩn sao và tỷ số, hộp thông tin "Đánh giá này không có sao và không có tỷ số." (AC-R01); vẫn có "Nhận xét (không bắt buộc)".
  - Ghi chú "Sau khi gửi, đánh giá không sửa hoặc xoá được." (UC-R01 post).
  - Nút "Huỷ" / "Gửi đánh giá".
- **Thao tác:**
  - Gửi thành công, chọn sao → đóng, toast "Đã gửi đánh giá", S3 làm mới sang trạng thái "đã đánh giá".
  - Gửi thành công, chọn "Đội kia không đến" → mở S2.
- **Trạng thái:**
  - *Lỗi validation:* chưa chọn sao → "Vui lòng chọn số sao"; nhập một ô tỷ số → "Nhập đủ tỷ số của hai đội" (API 2.1 yêu cầu gửi đủ cặp); tỷ số ngoài 0..999; nhận xét > 500 ký tự. `[cần xác nhận]` câu chữ lỗi (mục 4.9).
  - *Đang gửi:* nút disable + spinner, chặn bấm lặp (API chưa hỗ trợ `Idempotency-Key`).
  - *Lỗi nghiệp vụ:* "Bạn đã đánh giá trận này" (RATING_002 → tải lại S3); "Chỉ đánh giá được trận đã kết thúc" (RATING_001, kèm gợi ý thử lại sau ít phút); "Đội đang tạm ngưng hoạt động" (TEAM_015); "Bạn là đội trưởng của cả hai đội…" (RATING_003); xung đột MATCH_014 → "Dữ liệu vừa được cập nhật…", cho bấm lại.
- **Responsive / a11y:** nhóm sao là `radiogroup`, mỗi sao có `aria-label` "n sao"; segmented control là `radiogroup`; focus giữ trong dialog, `Esc` đóng; lỗi gắn field bằng `aria-describedby`; mobile nút chính full-width ở cuối sheet.
- **Không implement:** tag "Rất tốt" cạnh số sao (desktop), menu "Tìm đối / Sân bãi / Cộng đồng", chuông thông báo, khối "Tỷ số chung cuộc 3 - 2" và dòng "Đánh giá đối phương để củng cố điểm uy tín cộng đồng phủi" ở nền — Stitch tự thêm, SRS không có.

### S2 — Gợi ý report bùng
- **Mục đích:** sau khi gửi đánh giá "Đội kia không đến", hỏi "Bạn có muốn report bùng không?" — hai thao tác tách nhau (UC-R01 bước 5, API 2.1).
- **Thành phần UI chính:** dialog nhỏ (desktop) / bottom sheet (mobile); toast/snackbar "Đã gửi đánh giá" phía trên. Icon cờ, tiêu đề, nội dung: "Bạn vừa đánh giá <đội> là "Đội kia không đến". Đánh giá và report là hai thao tác riêng: report bùng sẽ trừ điểm uy tín của <đội>, và đội đó có 24 giờ để tranh chấp." (BR-R05). Nút "Để sau" / "Report bùng" (màu error).
- **Thao tác:** "Report bùng" → mở S4 với loại "Bùng" chọn sẵn; "Để sau" → đóng, về S3.
- **Trạng thái:** không gọi API. Nếu đội mình đã report bùng trận này (biết qua dữ liệu report đã gửi — mục 4.5) → không hiện S2.
- **Responsive / a11y:** `role="alertdialog"`, focus mặc định ở "Để sau".
- **Không implement:** nút đóng (X) trên toast, footer "© 2025 ArenaFlow…/Điều khoản/Hỗ trợ", "Lịch sử thi đấu", "Giao lưu 7 người" ở nền.

### S3 — Khối "Đánh giá & report" trong chi tiết trận
- **Mục đích:** khối nhúng vào màn chi tiết kèo/trận của MATCH-001, cho đội trưởng xem đánh giá và vào luồng đánh giá/report (AC-R07, API 2.2).
- **Thành phần UI chính (theo trạng thái):**
  - *Chưa đánh giá* (mockup mobile, `given = null`): câu "Trận đấu hôm nay thế nào? Hãy nhập tỷ số và đánh giá đối phương.", dòng phụ "Đánh giá của đối phương dành cho đội bạn sẽ hiện sau khi bạn đánh giá." (BC-R03), nút "Đánh giá <đội>" (→ S1) và nút viền đỏ "Report <đội>" (→ S4).
  - *Đã đánh giá* (mockup desktop): hai ô — "Đánh giá của đội bạn" (sao n/5 hoặc "Đội kia không đến", "Tỷ số bạn nhập: …", nhận xét, "Đã gửi <thời điểm>") và "Đánh giá <đội> dành cho đội bạn" (chỉ hiện khi `received ≠ null`). Khi `received = null` **ẩn hẳn ô thứ hai**, không hiện chữ "đối phương chưa đánh giá" (BC-R04, API §1.6).
  - Mục "Report đã gửi trong trận này": mỗi dòng gồm loại, thời điểm, trạng thái. Nút "Report <đội>" luôn hiện khi còn loại chưa report.
  - *Trường hợp khác* (mockup mobile): người là đội trưởng cả hai đội → banner "Bạn là đội trưởng của cả hai đội trong trận này nên không thể đánh giá hoặc report.", ẩn mọi nút (BR-R08).
- **Điều kiện hiện nút (API §3.1):** "Đánh giá" chỉ khi trận `ARCHIVED`/`COMPLETED` và `given = null`; "Report" khi trận `ARCHIVED`/`COMPLETED`, hoặc `CANCELLED` sau ghép (chỉ "giao tiếp tệ"); ẩn cả khối với người không phải đội trưởng (403 TEAM_002) và khi trận chưa kết thúc.
- **Trạng thái:** *loading* skeleton khối; *lỗi* TEAM_015 "Đội đang tạm ngưng hoạt động" / TEAM_016 "Đội đã giải tán" → banner thay nội dung khối, ẩn nút (BR-R10); lỗi mạng → "Không tải được đánh giá" + "Thử lại".
- **Responsive / a11y:** desktop 2 cột, mobile 1 cột; trạng thái report luôn có chữ + icon.
- **Không implement:** tag "Rất tốt"/"Tuyệt vời", "Đã ghi nhận", "Khớp kết quả", nhãn "REPUTATION-001 S3", badge "Chờ bạn hoàn tất", "Kèo 7 người", "Quận 1, TP. HCM" — SRS/API không có.

### S4 — Report đối phương
- **Mục đích:** report đội đối phương sau trận hoặc kèo huỷ sau ghép (UC-R02, API 2.3).
- **Thành phần UI chính:** dialog (desktop) / bottom sheet (mobile). Tiêu đề "Report <đội>", dòng phụ "Trận/Kèo <giờ> · <sân>".
  - "Loại report `*`": radio-card 4 loại kèm mô tả theo Business_Rules §6.1 — "Bùng" (… "Đội bị report có 24 giờ để tranh chấp."), "Chơi xấu", "Giao tiếp tệ", "Không đúng trình độ".
  - Loại đã report trong trận → disable + tag "Đã report" (mockup desktop; API 2.3 REPORT_004).
  - Kèo `CANCELLED` sau ghép → banner "Kèo đã huỷ sau khi ghép: chỉ report được "Giao tiếp tệ"." và disable 3 loại còn lại (mockup mobile; BR-R07 (2)).
  - "Lý do `*`" textarea, bộ đếm `n/1000` (BR-R09).
  - Ghi chú "Report được ghi nhận ngay và trừ điểm uy tín của đội bị report. Không sửa hoặc xoá được sau khi gửi." (BR-R06).
  - Nút "Huỷ" / "Gửi report" (màu error).
- **Thao tác:** gửi thành công → đóng, toast "Đã gửi report", S3 cập nhật danh sách report đã gửi.
- **Trạng thái:**
  - *Lỗi validation* (mockup desktop): chưa chọn loại; lý do trống/chỉ khoảng trắng → "Vui lòng nhập lý do"; > 1000 → "Lý do tối đa 1000 ký tự".
  - *Đang gửi* (mockup mobile): nút disable + spinner "Đang gửi report…".
  - *Lỗi nghiệp vụ:* REPORT_002 "Chỉ report được trận đã kết thúc" (kèm gợi ý report qua chat nếu hai đội đã nhắn tin); REPORT_003; REPORT_004 → tải lại danh sách loại đã report; REPORT_005; TEAM_015; MATCH_014.
- **Responsive / a11y:** nhóm loại là `radiogroup`; mục disable có `aria-disabled` + lý do bằng chữ; focus đầu vào loại đầu tiên còn chọn được.
- **Không implement:** tỷ số "3 - 2" ở nền desktop; tag "REPUTATION-001 S4" trong mobile.

### S5 — Report "giao tiếp tệ" qua chat hai đội
- **Mục đích:** report đội kia loại "Giao tiếp tệ" từ phòng chat hai đội của một kèo, ở mọi trạng thái kèo (UC-R02, AC-R08, BR-R07 (3), API 2.10). Phòng chat thuộc MATCH-001; REPUTATION-001 chỉ vẽ nút gắn và dialog.
- **Thành phần UI chính:**
  - Điểm gắn: nút cờ "Report" ở thanh đầu phòng chat (nền mockup).
  - Dialog (desktop) / bottom sheet (mobile): tiêu đề "Report giao tiếp tệ", dòng phụ "Đội bị report: <đội> · Kèo <giờ>". Ô chỉ đọc "Loại report: Giao tiếp tệ" + mô tả §6.1. "Lý do `*`" `n/1000`. Ghi chú "Mỗi đội chỉ report đội kia "Giao tiếp tệ" một lần trong mỗi kèo, dù gửi qua chat hay sau trận. Report được ghi nhận ngay và trừ điểm uy tín của đội bị report." Nút "Huỷ" / "Gửi report".
- **Điều kiện hiện nút "Report" trong chat:** người xem là đội trưởng hiện tại, đội `ACTIVE`, cuộc chat đã có ≥ 1 tin (REPORT_010), chưa report "giao tiếp tệ" kèo này (REPORT_004 — xem mục 4.5); ẩn với người đã giải tán đội (TEAM_016) và người là đội trưởng cả hai đội (REPORT_005).
- **Trạng thái:** *lỗi validation* (mockup mobile) "Lý do tối đa 1000 ký tự", bộ đếm đỏ `1024/1000`; *đang gửi*: disable; *lỗi* CHAT_002, CHAT_003 → đóng dialog, ẩn nút; REPORT_011 (chat theo đơn mercenary — không thuộc màn này); USER_001 → về đăng nhập.
- **Responsive / a11y:** như S4.
- **Không implement:** tag "Nghiêm trọng", "Đã chọn"; nội dung tin nhắn mẫu ở nền.

### S6 — Report của đội
- **Mục đích:** đội trưởng xem report đội mình bị nhận và đã gửi, vào tranh chấp (AC-R07, API 2.4).
- **Thành phần UI chính:** tiêu đề "Report của đội" + tên đội; tab "Đội bị report" (mặc định, `RECEIVED`) | "Đội đã report" (`SENT`); danh sách thẻ, mới nhất trước; phân trang "Trước | 1 | 2 | Sau" như USER-001.
  - **Thẻ tab Đội bị report:** đội đã report, "Trận <giờ bắt đầu>", chip loại, lý do, badge trạng thái (Đã chấp nhận / Đang tranh chấp / Đã xác nhận / Đã bác — luôn chữ + icon), "Bị trừ n điểm" (`reliabilityPenalty`).
    - Bùng, `canDispute = true` → "Hạn tranh chấp: <disputeDeadlineAt>" + nút "Tranh chấp" (→ S7). FE vẫn so hạn với giờ hiện tại khi màn mở lâu; quá hạn → ẩn nút.
    - Đang tranh chấp → hộp "Bằng chứng của đội bạn: …" + "Chờ Admin quyết định".
    - Đã bác → "Đã hoàn n điểm" + "Ghi chú của Admin: …" (API §4.4).
    - Đã xác nhận → ghi chú Admin nếu có (`dispute.resolutionNote`).
  - **Thẻ tab Đội đã report** (mockup mobile): đội bị report, trận/kèo, chip loại, lý do, badge trạng thái; không hiện điểm (`reliabilityPenalty = null`); report bùng đang tranh chấp → "Đội bị report đã gửi tranh chấp, chờ Admin quyết định." (không hiện bằng chứng — API trả `null`).
- **Desktop (chưa vẽ):** khung trang USER-001 (header ứng dụng, breadcrumb "Đội của tôi › <đội> › Report"), danh sách thẻ 1 cột rộng tối đa ~960px, nút "Tranh chấp" bên phải thẻ.
- **Trạng thái:** *loading* skeleton thẻ; *empty* theo tab: "Đội chưa bị report nào" / "Đội chưa report đội nào"; *lỗi* TEAM_015 / TEAM_016 → màn lỗi kèm thông điệp; TEAM_002 → không cho vào màn; lỗi mạng → "Thử lại".
- **Responsive / a11y:** tab `role="tablist"`; nút "Tranh chấp" có `aria-label` gồm tên đội và trận.
- **Không implement:** số đếm trên tab ("5", "3" — API chỉ trả `totalItems` của tab đang mở); thanh header desktop lồng trên màn mobile; nút "Tải thêm" (dùng phân trang như USER-001 — `[cần xác nhận]` mục 4.10).

### S7 — Tranh chấp report bùng
- **Mục đích:** đội trưởng đội bị report bùng gửi bằng chứng trong 24 giờ (UC-R03, API 2.5).
- **Thành phần UI chính:** desktop dialog (~560px, chưa vẽ) / mobile trang đầy đủ (mockup). Thẻ tóm tắt: "Đội report", "Trận", "Lý do của đội report", "Điểm uy tín đã bị trừ", "Hạn tranh chấp". "Bằng chứng `*`" textarea `n/1000`, dòng phụ "Chỉ nhập văn bản, không đính kèm ảnh hoặc tệp." (BR-R09). Ghi chú "Điểm đã trừ được giữ nguyên tới khi Admin quyết định. Quyết định của Admin là cuối cùng." (UC-R03 bước 6, §1.7). Nút "Huỷ" / "Gửi tranh chấp".
- **Thao tác:** gửi thành công → đóng, toast "Đã gửi tranh chấp", thẻ ở S6 chuyển "Đang tranh chấp".
- **Trạng thái:**
  - *Quá hạn* (mockup mobile): banner lỗi "Đã quá hạn 24 giờ để tranh chấp. Report đã được xác nhận." (REPORT_007 hoặc FE thấy quá `disputeDeadlineAt`), textarea và nút gửi disable, chỉ còn "Đóng".
  - *Lỗi validation:* trống → "Vui lòng nhập bằng chứng"; > 1000.
  - *Lỗi khác:* REPORT_008 "Report đã được tranh chấp hoặc đã có quyết định" → tải lại S6; TEAM_015/TEAM_016; MATCH_014.
- **Responsive / a11y:** banner lỗi `role="alert"`.
- **Không implement:** badge "Bị phạt", tiêu đề "Thông tin tranh chấp", chữ "5 điểm (-5 điểm)" (hiển thị "5"), tiêu đề banner "Đã quá hạn tranh chấp" có thể giữ hoặc bỏ.

### S8 — Uy tín đội
- **Mục đích:** mọi người dùng đã đăng nhập xem uy tín một đội (UC-R05..R07, API 2.9).
- **Thành phần UI chính:** header đội (logo, tên, badge "Đã xác minh" nếu `verification.isVerified`). Thẻ "Uy tín đội":
  - "Điểm uy tín" `n/100` + nhãn mức (Business_Rules §3.1 "Mức hiển thị", `reliabilityLevel`): 95–100 → icon huy chương + "Rất uy tín"; 70–94 → không nhãn; 50–69 → icon cảnh báo vàng + "Cảnh báo"; 0–49 → icon đỏ + "Cảnh báo mạnh". Luôn có chữ, không chỉ màu. `[cần xác nhận]` câu chữ nhãn (mục 4.3).
  - "Tỉ lệ hoàn thành" `n%` + "x/y trận" khi đủ 5 trận; chưa đủ → "Mới tham gia X/5 trận" (BR-R02, `isNewcomer`).
  - "Sao trung bình" `4.3 ★ (n đánh giá)`; chưa có → "Chưa có đánh giá".
  - "Huy hiệu xác minh" — "Đã xác minh · cấp <verifiedAt>"; không có → ẩn dòng.
  - Mockup mobile có mục "Các trường hợp hiển thị khác" minh hoạ 4 biến thể (mới tham gia, cảnh báo, cảnh báo mạnh, rất uy tín) — **chỉ để minh hoạ**, không phải một mục trên màn thật.
- **Desktop (chưa vẽ):** khối "Uy tín đội" gồm 4 ô số liệu nằm ngang trong trang chi tiết đội (dưới header đội của USER-001 S8a), cùng khung trang USER-001.
- **Thẻ uy tín rút gọn (điểm gắn MATCH-001):** một dòng "84 · 86% · 4.3★ · Đã xác minh" (hoặc "Mới tham gia X/5 trận") dùng trong thẻ đội ở danh sách kèo / thương lượng — chưa vẽ, `[cần xác nhận]` mục 4.2.
- **Trạng thái:** *loading* skeleton 4 ô; *lỗi* TEAM_001 "Không tìm thấy đội"; đội đã giải tán vẫn xem được (API 2.9).
- **Responsive / a11y:** mobile lưới 2 cột cho số liệu; số liệu đọc được bằng screen reader ("Điểm uy tín 84 trên 100").

### S9 — Admin: danh sách tranh chấp
- **Mục đích:** hàng chờ tranh chấp report bùng giữa hai đội (UC-R04, API 2.6).
- **Thành phần UI chính:** layout "Quản trị" như USER-001 S13/S14, thêm mục menu "Tranh chấp report bùng". Tab "Chờ xử lý" (mặc định) | "Đã xử lý" | "Tất cả"; dòng phụ cố định "Cũ nhất trước" (tab Chờ xử lý) / "Mới nhất trước" (2 tab còn lại) — thứ tự do API quyết định, **không** phải dropdown.
  - Mobile (mockup): thẻ gồm "Trận <giờ>", "<đội report> → <đội bị report>", badge trạng thái đội nếu khác Hoạt động ("Bị khoá", "Đã giải tán"), "Người report", "Người tranh chấp" + nhãn "đã xoá" theo cờ `is…Deleted` (ADR-0002), "Report <thời điểm> · Tranh chấp <thời điểm>", badge "Chờ xử lý" / "Đã xử lý" (+ quyết định), nút "Xem chi tiết" (→ S10).
  - Desktop (chưa vẽ): bảng như S13 — cột Trận · Đội report · Đội bị report · Người tranh chấp · Report lúc · Tranh chấp lúc · Trạng thái · Thao tác.
  - Phân trang "Trước | 1 | Sau".
- **Trạng thái:** *loading* skeleton; *empty* "Không có tranh chấp nào"; *lỗi* AUTH_004 → ẩn menu quản trị.
- **Responsive / a11y:** bảng desktop có `<th scope>`; nút "Xem" có `aria-label` gồm tên hai đội.
- **Không implement:** dòng mô tả "Quản lý và giải quyết các khiếu nại, tranh chấp kết quả trận đấu…" (sai nghĩa — chỉ là tranh chấp report bùng), "Hiển thị 2 tranh chấp", dropdown sắp xếp; nhãn "đã xoá" trong mockup ghi dạng "[đã xoá]" — dùng tag xám như USER-001.

### S10 — Admin: chi tiết + quyết định tranh chấp
- **Mục đích:** Admin xem bằng chứng hai bên và quyết định cuối cùng (UC-R04, API 2.7, 2.8).
- **Thành phần UI chính (mockup mobile, trạng thái Chờ xử lý):**
  - Đầu trang: "Chi tiết tranh chấp" + badge trạng thái.
  - Thẻ "Trận": môn, giờ bắt đầu – kết thúc, sân, trạng thái trận.
  - Thẻ "Đội report": tên đội + badge trạng thái đội, "Điểm uy tín hiện tại", "Người report" (+ "đã xoá"), "Report lúc", "Lý do report".
  - Thẻ "Đội bị report": tên đội + badge, "Điểm uy tín hiện tại", điểm đã bị trừ cho report này, "Người tranh chấp" (+ "đã xoá"), "Tranh chấp lúc", "Bằng chứng".
  - Thẻ "Đánh giá của trận": 0–2 đánh giá, cũ nhất trước (sao hoặc "Đội kia không đến", nhận xét, thời điểm).
  - Thẻ "Quyết định": radio "Xác nhận report — giữ nguyên điểm đã trừ" / "Bác report — hoàn n điểm cho <đội bị report>"; "Ghi chú lý do `*`" `n/500` (BR-R09); ghi chú "Quyết định là cuối cùng, không thay đổi được."; nút "Gửi quyết định".
  - Desktop (chưa vẽ): 2 cột — trái "Đội report", phải "Đội bị report"; dưới là "Đánh giá của trận" và "Quyết định".
- **Trạng thái:**
  - *Lỗi validation* (mockup): chưa chọn quyết định; ghi chú trống → "Vui lòng nhập ghi chú lý do"; > 500.
  - *Đã xử lý* (`RESOLVED`, chưa vẽ): thay thẻ "Quyết định" bằng khối chỉ đọc "Quyết định: Xác nhận/Bác report", "Ghi chú", "Người xử lý: <tên>" (+ "đã xoá"), "Lúc <resolvedAt>".
  - *Lỗi:* DISPUTE_001 → về S9; DISPUTE_002 "Tranh chấp đã được xử lý" → tải lại chi tiết; MATCH_014.
  - *Loading:* skeleton.
- **Responsive / a11y:** radio là `radiogroup`; lỗi gắn field.
- **Không implement:** "-5 điểm" dạng badge đỏ bên phải (giữ dạng chữ "Điểm đã bị trừ cho report này: 5" như prompt), placeholder "Nhập lý độ quyết định..." (sai chính tả).

## 3. Thành phần dùng chung giữa các màn hình
- **Khung ứng dụng / quản trị:** dùng lại header ứng dụng và layout "Quản trị" của `docs/agent/design/USER-001/UI_Design.md` §3. Thêm mục menu quản trị "Tranh chấp report bùng" (S9).
- **Dialog / bottom sheet:** quy ước USER-001 (desktop dialog, mobile bottom sheet, focus trap, `Esc`). Thao tác report dùng nút màu error; đánh giá / tranh chấp / quyết định dùng nút primary.
- **Chip loại report:** Bùng · Chơi xấu · Giao tiếp tệ · Không đúng trình độ (S3, S4, S5, S6, S9, S10).
- **Badge trạng thái report:** Đã chấp nhận (`AUTO_ACCEPTED`) · Đang tranh chấp (`DISPUTED`) · Đã xác nhận (`CONFIRMED`) · Đã bác (`REJECTED`); tranh chấp: Chờ xử lý / Đã xử lý. Luôn chữ + icon.
- **Hiển thị sao:** sao nguyên 1–5 (S1, S3, S10); "Đội kia không đến" thay cho sao.
- **Khối uy tín đội** (S8) và **thẻ uy tín rút gọn** (gắn vào MATCH-001).
- **Hiển thị người dùng đã xoá ở màn Admin:** tên thật + tag xám "đã xoá" (ADR-0002, API §4.5).
- **Điểm gắn với mã khác:**
  - MATCH-001 — chi tiết kèo/trận: nhúng khối S3 (mở S1, S2, S4); phòng chat hai đội: nút cờ "Report" (mở S5); thẻ đội trong danh sách kèo / thương lượng: thẻ uy tín rút gọn S8.
  - USER-001 — chi tiết đội S8a: khối "Uy tín đội" (S8) và lối vào "Report của đội" (S6, chỉ đội trưởng) — `[cần xác nhận]` mục 4.1.
  - NOTIFICATION-001 — thông báo "Trận đấu hôm nay thế nào?" → S1/S3; "Đội [X] report bạn bùng kèo…" → S6 (tab Đội bị report) / S7.
  - MERCENARY-001 — report/tranh chấp giữa đội và mercenary dùng màn của MERCENARY-001; S7 có thể dùng chung cho tranh chấp report bùng của mercenary với đội (API 2.5 nhận cả hai) — `[cần xác nhận]` mục 4.7.
- **Theme:** project Stitch `ArenaFlow` — Be Vietnam Pro, primary `#3d6943`, error `#a73b21`, nền `#f8faf3`, bo góc 8px (`ROUND_EIGHT`). Đã đối chiếu `get_project`: theme khớp `docs/agent/external-knowledge.md` §3, không cần `apply_design_system`.

## 4. `[cần xác nhận]`
> Không chặn thiết kế UI (user duyệt trước 2026-11-27); cần chốt trước hoặc trong `solution-architect`. Mục nào thuộc hợp đồng API → đề xuất làm ở repo BE.

1. **Lối vào S6 "Report của đội":** SRS/API không nêu màn này mở từ đâu. Đề xuất: nút "Report của đội" trên chi tiết đội (USER-001 S8a, chỉ đội trưởng) + deep link từ thông báo bị report.
2. **Nơi hiển thị uy tín (S8):** API 2.9 nói "trang hồ sơ đội, thẻ đội trong danh sách kèo / thương lượng". Chưa có màn "hồ sơ đội" cho người ngoài đội (USER-001 S8a là góc nhìn thành viên). Cần chốt: khối uy tín đặt ở S8a và/hoặc trang hồ sơ đội công khai; dạng thẻ rút gọn do MATCH-001 gắn.
3. **Câu chữ nhãn mức uy tín:** SRS chỉ ghi "Lời khen / badge đặc biệt", "Cảnh báo (vàng)", "Cảnh báo mạnh (đỏ)". Mockup dùng "Rất uy tín" / "Cảnh báo" / "Cảnh báo mạnh" — chờ chốt.
4. **Hiển thị khi `received = null` sau khi đã đánh giá:** thiết kế ẩn hẳn ô đánh giá của đối phương (không lộ đã/chưa đánh giá — BC-R04). Xác nhận không cần dòng chữ trung tính nào.
5. **Biết loại đã report của một trận (hợp đồng API):** S3/S4/S5 cần biết đội mình đã report loại nào trong trận/kèo để disable loại / ẩn nút. API 2.4 không lọc theo `matchId` → FE phải tải hết `SENT` của đội. Đề xuất BE thêm bộ lọc `matchId` cho 2.4 hoặc trả danh sách loại đã report trong 2.2.
6. **Trạng thái "kèo huỷ sau ghép" cho S3/S4:** cần lấy từ API của MATCH-001 (trạng thái kèo + đã có đội ghép) — xác nhận field khi làm `solution-architect`.
7. **Report bùng của mercenary với đội:** API 2.5 cho đội tranh chấp cả report bùng do mercenary gửi, nhưng 2.4 (S6) không liệt kê report này (MERCENARY-001 2.21). Cần chốt màn nào hiển thị và mở S7 cho trường hợp này (phối hợp MERCENARY-001); và menu Admin có gộp hàng chờ tranh chấp mercenary (MERCENARY-001 2.25–2.27) với S9 hay tách.
8. **Desktop S6–S10 chưa vẽ** (Stitch timeout). Bố cục desktop hiện chỉ mô tả bằng chữ — cần vẽ bổ sung hoặc user chấp nhận làm theo mô tả.
9. **Câu chữ lỗi validation** chưa có trong SRS (vd "Vui lòng chọn số sao", "Nhập đủ tỷ số của hai đội", "Vui lòng nhập lý do", "Vui lòng nhập bằng chứng", "Vui lòng nhập ghi chú lý do") — đề xuất, chờ chốt.
10. **Phân trang mobile S6:** mockup mobile vẽ "Tải thêm"; thiết kế chọn phân trang "Trước | 1 | 2 | Sau" như USER-001 — xác nhận.
11. **Xác nhận trước khi gửi quyết định Admin (S10):** SRS không yêu cầu dialog xác nhận; thiết kế chỉ có ghi chú "Quyết định là cuối cùng". Xác nhận có cần thêm bước xác nhận hay không.
