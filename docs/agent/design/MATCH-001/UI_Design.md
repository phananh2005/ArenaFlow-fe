# UI Design — MATCH-001 Kèo luồng A, vòng đời kèo & chat dùng chung

| Mục | Giá trị |
|---|---|
| Mã chức năng | `MATCH-001` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (MATCH-001 nằm trong SYSTEM-001 — mục lục `docs/agent/upstream/README.md`) — UC-M01..M04, M08, M09, UC-C01, C02, UC-N01, UC-N04; BR-M01..M18, BR-C01..C04, BR-N01, BR-N03..N06, BR-N12; AC-M01..M03, M06..M12, AC-C01, AC-N01, AC-N03, AC-N04. Hợp đồng: `docs/agent/upstream/api/MATCH-001/API_Spec.md` v3.2; ngày giờ: `api/SYSTEM-002/API_Spec.md` §1.1 |
| Căn cứ | `ArenaFlow-spec@53aee11` |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280) + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-28` / `v1.1` — lịch sử: `CHANGELOG.md` |

> Phạm vi: luồng A (đã có sân) trọn vẹn; form tạo kèo chung cho cả hai luồng (chế độ "Chưa có sân" vẽ ở S3); xem chi tiết / tìm / huỷ kèo cả hai luồng; chat dùng chung (S13, S14) — MATCH-002 và MERCENARY-001 tái dùng.
> Ngoài phạm vi (chỉ chừa điểm vào): thương lượng / "Nhận kèo" luồng B (MATCH-002), đánh giá + report đối thủ (REPUTATION-001), tuyển mercenary (MERCENARY-001), chuông thông báo (NOTIFICATION-001), màn địa điểm (VENUE-001).
> Dữ liệu trong mockup (tên đội, tên người, sân, giờ) là **dữ liệu mẫu**. Mockup chỉ để tham khảo — không copy HTML của Stitch vào `src/`.

## 1. Danh sách màn hình

> **Trạng thái mockup (2026-11-27):** Stitch quá tải (model mặc định / `GEMINI_3_8_FLASH` timeout, không trả id) — các màn đã có sinh bằng `GEMINI_3_5_FLASH_LITE`. Ô "chưa có" = chưa có mockup, **đặc tả §2 là nguồn chuẩn**; sẽ sinh bù tuần tự ở lượt sau (giữ nguyên tên/đánh số S<n>). Stitch label: `ArenaFlow — MATCH-001 S<n> <tên> (desktop)` / `(mobile web 390px)`.

| # | Màn hình | Use case (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Tìm kèo | UC-M03 b1, BR-M14, BR-M15 | chưa có / `0e5583036ba9432bb920f6a6f2e726a5` | `S1-tim-keo-mobile.{png,html}` |
| S2 | Tạo kèo — "Đã có sân" | UC-M01, BR-M01, M02, M15, M16 | chưa có / chưa có | — |
| S3 | Tạo kèo — "Chưa có sân" | UC-M02, BR-M03 | chưa có / chưa có | — |
| S4 | Chọn địa điểm (dialog / bottom sheet) | UC-M01 b3, UC-M02 b3, BR-V13 | chưa có / `9878e56e84644777b5ca03ffd36c26ed` | `S4-chon-dia-diem-mobile.html` (ảnh Stitch trả về trống — chưa có `.png`) |
| S5 | Chi tiết kèo A — đội khác (gửi / theo dõi yêu cầu) | UC-M03, BR-N04 | chưa có / chưa có | — |
| S6 | Chi tiết kèo A — đội tạo kèo (xử lý yêu cầu) | UC-M04, UC-M08 (OPEN), UC-C01 | chưa có / `8a6edd6664084695910a8b856a4c6e5b` | `S6-chi-tiet-keo-doi-tao-mobile.{png,html}` |
| S7 | Thoả thuận chi phí (dialog / bottom sheet) | UC-C01, UC-C02, BR-C01..C04 | chưa có / `4434b7adeee74254aa73bbfa258fbf70` | `S7-thoa-thuan-chi-phi-mobile.{png,html}` |
| S8 | Chi tiết kèo đã ghép + trạng thái kết thúc | API §3.1, Business_Rules §2.1 | chưa có / chưa có | — |
| S9 | Huỷ kèo đã ghép / rút yêu cầu đã chấp nhận | UC-M08 (CONFIRMED, Alt. Flow), BR-M09..M13 | chưa có / `c481c0db14394ac8b8084157e034acd8` | `S9-huy-keo-da-ghep-mobile.{png,html}` |
| S10 | Chi tiết kèo luồng B (chưa ghép) | UC-M02 post, UC-M08, BC-M04 | chưa có / chưa có | — |
| S11 | Kèo của đội | API 2.11 | chưa có / `875f40934816411897df20c7ceed897c` | `S11-keo-cua-doi-mobile.html` (ảnh Stitch trả về trống — chưa có `.png`) |
| S12 | Yêu cầu đã gửi | API 2.12, Business_Rules §2.2, BR-M12, M13 | chưa có / chưa có | — |
| S13 | Phòng chat (dùng chung) | UC-N01, BR-N03..N05 | `0831d04f5afd43e3b1c3765d27db8d15` / `512a679fd3c349d39d532eb41bc98434` | `S13-phong-chat-{desktop,mobile}.{png,html}` |
| S14 | Tin nhắn của tôi | UC-N04, BR-N06, BR-N12 | dùng khung trái của S13 desktop (`0831d04f…`) / chưa có | xem `S13-phong-chat-desktop.*` |
| S15 | Admin quản lý bộ môn | API 2.14, 2.15, BR-M15 | chưa có / `1a4e7b4787374b7fb50272cf494ad36a` | `S15-admin-bo-mon-mobile.{png,html}` |

**Không implement (chi tiết Stitch tự thêm, không có trong SRS / API):**
- S6 mobile: dòng trích dẫn mô tả đội trong thẻ yêu cầu, "Cập nhật lúc 10:30", header mobile có avatar thay icon "Tin nhắn".
- S7 mobile: nhãn "Khuyên dùng" ở "Chia đôi 50-50"; nhãn "MATCH-001 S7" trên tiêu đề.
- S9 mobile: nền mờ ghi "Sân bóng Chảo Lửa…", "Đã ghép đôi thành công - Chờ đến giờ thi đấu" — nền thực tế là S8.
- S11 mobile: tiêu đề phụ "Quản lý toàn bộ trận đấu và lời mời giao lưu", nhãn "Đội chính", tỷ số "4 - 3", "Đã đánh giá đối thủ (5.0)", "Xem biên bản", "Tạo lại kèo", "Đang nhận yêu cầu ghép (3 đội đề xuất)", nút "⋮" trên thẻ; HTML Stitch bị lặp thẻ đóng ở cuối (lỗi Stitch).
- S13 desktop: ô tìm kiếm hội thoại, nút lọc, nút gọi điện / thông tin, đính kèm tệp / ảnh / biểu tượng cảm xúc, badge "Đối thủ chính thức", ngữ cảnh "Thách đấu…", "Giải phong trào S12" ở khung trái. S13 mobile: nút "+" đính kèm.
- S15 mobile: thẻ `<title>` HTML ghi "S13 Admin quản lý đội" (Stitch dùng lại tiêu đề cũ); huy hiệu "Admin" trên thanh đầu.
- Chung: header mobile Stitch không thống nhất (có màn dùng logo "AF" + menu bên phải) — chuẩn là header §3.

## 2. Chi tiết từng màn hình

> Quy ước hiển thị chung cho mọi màn (chi tiết ở §3):
> - Ngày giờ in nguyên giá trị giờ Việt Nam của API, không đổi theo múi giờ máy (SYSTEM-002 §1.1). Dạng hiển thị: `18:00 – 20:00 · Thứ Bảy 05/12/2026`.
> - Định dạng: `FIVE_A_SIDE`/`SEVEN_A_SIDE`/`ELEVEN_A_SIDE` → "Sân 5" / "Sân 7" / "Sân 11". Loại kèo: `HAS_VENUE` → "Đã có sân", `NEED_VENUE` → "Chưa có sân".
> - `skillLevels = []` → chip "Mọi trình độ". Điểm uy tín đội → "Uy tín 80/100".
> - Tiền: VND, phân tách hàng nghìn bằng dấu chấm, hậu tố "đ" (`600.000 đ`).
> - Nút thao tác ghi chỉ hiện với **đội trưởng** của đội liên quan (API §1.2); thành viên thường chỉ xem.

### S1 — Tìm kèo
- **Mục đích:** tìm kèo đang tìm đối (cả hai luồng) để gửi yêu cầu / nhận kèo (UC-M03 bước 1; AC-M03; BR-M14, BR-M15 — kèo của đội không hoạt động / bộ môn tắt không hiện).
- **Thành phần UI chính:** desktop — tiêu đề + nút "+ Tạo kèo", cột trái thẻ "Bộ lọc", cột phải danh sách thẻ kèo + phân trang. Mobile — hàng chip lọc cuộn ngang (chip "Bộ lọc (n)" mở bottom sheet chứa đủ bộ lọc như desktop), danh sách 1 cột.
- **Bộ lọc (map query 2.2):** Loại kèo (Tất cả / Đã có sân / Chưa có sân → `type`) · Bộ môn (2.13 → `sportId`) · Định dạng (`format`) · Trình độ (**một** nhãn → `skillLevel`) · Từ ngày / Đến ngày (`startsAtFrom`/`startsAtTo`) · công tắc "Gần tôi" + Bán kính km 0,1–50, mặc định 10 (`lat`/`lng`/`radiusKm`). Nút "Áp dụng", "Xoá lọc".
- **Dữ liệu thẻ kèo (§4.3):** avatar + tên đội tạo kèo, "Uy tín n/100", badge loại kèo, "Bóng đá · Sân 7", giờ đá, địa điểm (`venueName` · địa chỉ) hoặc kèo B "n lựa chọn địa điểm · m khung giờ" và giờ "Từ <khung sớm nhất>", khoảng cách (`distanceKm`, chỉ khi bật "Gần tôi"), chip trình độ, "Hạn nhận đối: <expiresAt>".
- **Thao tác:** bấm thẻ / "Xem chi tiết" → S5 (kèo A) hoặc S10 (kèo B); "+ Tạo kèo" → S2.
- **Trạng thái:**
  - *Loading:* skeleton 3 thẻ.
  - *Empty:* "Không có kèo phù hợp" + nút "Xoá lọc" (mockup không vẽ — dùng khung empty chung).
  - *Error:* khung lỗi + "Thử lại" (timeout 15 giây — `non-functional-standards.md` §2).
  - *GPS bị từ chối:* tắt "Gần tôi", banner "Bật GPS để tìm kèo gần bạn hơn" `[cần xác nhận]` (§4 mục 4).
  - *Lỗi bộ lọc:* "Từ ngày" sau "Đến ngày" → lỗi dưới ô ngày, không gọi API.
- **Responsive / a11y:** ô lọc có `label`; chip lọc mobile là nút bấm được bằng bàn phím; badge loại kèo luôn có chữ. Thẻ kèo là link có tên đội + giờ trong nhãn.
- **Thứ tự:** theo API (có toạ độ: gần nhất trước; không: giờ đá sớm nhất trước) — FE không tự sắp xếp.

### S2 — Tạo kèo: chế độ "Đã có sân" (luồng A)
- **Mục đích:** đội trưởng tạo kèo luồng A (UC-M01, AC-M01, AC-M12).
- **Thành phần UI chính:** breadcrumb "Tìm kèo › Tạo kèo"; thẻ form; segmented "Đã có sân" / "Chưa có sân" (đổi sang S3 — cùng một form); chân form "Huỷ" / "Tạo kèo". Mobile: nút cố định đáy.
- **Trường của form:**

  | Trường | Điều khiển | Quy tắc / nguồn |
  |---|---|---|
  | Đội tạo kèo `*` | ô chọn — chỉ đội người dùng là đội trưởng và đội đang hoạt động | API §1.2, BR-M14 · nguồn danh sách `[cần xác nhận]` (§4 mục 2) |
  | Bộ môn `*` | ô chọn — bộ môn đang bật (2.13) | BR-M15 |
  | Địa điểm `*` | thẻ địa điểm đã chọn + "Đổi địa điểm"; chưa chọn → nút "Chọn địa điểm" mở S4 | UC-M01 bước 3, VENUE-001 2.2 |
  | Định dạng `*` | 3 lựa chọn Sân 5 / 7 / 11 | §4.1 `format` |
  | Giờ bắt đầu `*`, Giờ kết thúc `*` | chọn ngày + giờ | BR-M01 (≥ hiện tại + 1 giờ), BR-M16 (kết thúc sau bắt đầu, ≤ 12 giờ) |
  | Hạn nhận đối `*` | chọn ngày + giờ, dòng phụ "Sau thời điểm này kèo hết hạn nếu chưa ghép được đối" | BR-M02: sau hiện tại, trong 7 ngày trước giờ bắt đầu |
  | Trình độ mong muốn | 9 chip chọn nhiều, "Đã chọn n/3 · Không chọn = nhận mọi trình độ" | BR-M16 |
  | Ghi chú độ tuổi | input, bộ đếm `n/100` | BR-M16 |
  | Tính chất trận | input, bộ đếm `n/200` | BR-M16 |

- **Thao tác:** "Tạo kèo" thành công → toast "Kèo đã được tạo" (UC-M01 bước 6), sang chi tiết kèo mới (S6). "Huỷ" → quay lại trang trước.
- **Trạng thái:**
  - *Lỗi validation:* dưới từng trường (`validationErrors[].field`). `expiresAt`: "Thời hạn phải nằm trong 7 ngày trước giờ bắt đầu trận" (UC-M01 4a — trạng thái mockup đang vẽ); giờ trận sai: lỗi tại trường giờ tương ứng (4b).
  - *Đủ 3 nhãn trình độ:* chip còn lại disable (như S7 USER-001).
  - *Bộ môn tắt (`SPORT_002`):* banner lỗi "Bộ môn hiện không được hỗ trợ" + tải lại danh sách bộ môn (UC-M01 4c).
  - *Đội tạm ngưng / đã giải tán (`TEAM_015` / `TEAM_016`):* banner lỗi, không cho tạo bằng đội đó.
  - *Địa điểm ngừng hoạt động / không tồn tại (`VENUE_002` / `VENUE_001`):* lỗi dưới trường địa điểm, cho chọn lại.
  - *Không làm đội trưởng đội nào đang hoạt động:* thay form bằng khung trống "Bạn cần là đội trưởng của một đội đang hoạt động để tạo kèo" + link "Đội của tôi".
  - *Đang lưu:* nút "Tạo kèo" disable + spinner (chống bấm lặp — API chưa hỗ trợ `Idempotency-Key`).
- **Responsive / a11y:** mọi input có `label`; trường bắt buộc `*` + `aria-required`; lỗi gắn `aria-describedby`; segmented là `radiogroup`; chip trình độ là checkbox.
- **Lưu ý:** không có màn sửa kèo — muốn đổi phải huỷ rồi tạo lại (BR-M02, BR-M04).

### S3 — Tạo kèo: chế độ "Chưa có sân" (luồng B)
- **Mục đích:** đội trưởng tạo kèo luồng B (UC-M02, AC-M02). Cùng form S2; chỉ khác các trường dưới. Ghép / thương lượng sau đó thuộc MATCH-002.
- **Trường khác S2:**

  | Trường | Điều khiển | Quy tắc |
  |---|---|---|
  | Lựa chọn địa điểm `*` (n/5) | danh sách đánh số theo thứ tự chọn, mỗi dòng có nút xoá; "+ Thêm địa điểm" mở S4 ở chế độ chọn nhiều; đủ 5 → nút disable | BR-M03 (1–5, không trùng), giữ thứ tự |
  | Khung giờ `*` (n/5) | mỗi dòng: Ngày + Từ + Đến + nút xoá; "+ Thêm khung giờ"; đủ 5 → disable | BR-M03, BR-M01, BR-M16; giờ bắt đầu không trùng nhau |
  | Hạn nhận đối `*` | ngày + giờ, phụ "Không sau khung giờ sớm nhất và trong 7 ngày trước khung giờ đó" | BR-M03 |

- **Thao tác:** như S2; thành công → toast "Kèo đã được tạo" → chi tiết kèo B (S10 góc nhìn đội tạo kèo — phần thương lượng do MATCH-002 vẽ).
- **Trạng thái:**
  - *Lỗi cả danh sách* (`venueOptionIds`, `timeOptions`): hiện dưới tiêu đề khối.
  - *Lỗi một khung giờ* (`timeOptions[i].startsAt` / `.endsAt`): hiện ở đúng dòng (mockup desktop: "Giờ bắt đầu trùng với một khung giờ khác").
  - *Lỗi hạn nhận đối:* "Thời hạn không được sau khung giờ sớm nhất" (4a1 — mockup mobile) / "Thời hạn phải nằm trong 7 ngày trước khung giờ sớm nhất" (4a2) / không sau hiện tại (4a3).
  - Các trạng thái còn lại như S2.
- **Responsive / a11y:** mobile mỗi khung giờ là thẻ nhỏ; nút xoá có `aria-label` "Xoá khung giờ n" / "Xoá địa điểm n".
- **Lưu ý:** hộp thông tin "Đội khác bấm Nhận kèo để thương lượng…" là câu giải thích do ui-designer thêm; nội dung chốt cùng MATCH-002 `[cần xác nhận]` (§4 mục 13).

### S4 — Chọn địa điểm (dialog / bottom sheet)
- **Mục đích:** chọn sân cho kèo — một địa điểm (S2) hoặc 1–5 địa điểm (S3). Chỉ địa điểm đang hoạt động (BR-V13, VENUE-001 2.2).
- **Thành phần UI chính:** desktop dialog ~640px phủ lên S2/S3; mobile bottom sheet gần toàn màn. Ô tìm "Tìm theo tên sân hoặc địa chỉ" (`q`, debounce 300 ms), công tắc "Gần tôi" + "Bán kính" (mặc định 5 km theo VENUE-001 2.2), danh sách kết quả cuộn, link "Thêm địa điểm mới" (→ màn thêm địa điểm của VENUE-001; quay lại và tự chọn địa điểm vừa tạo `[cần xác nhận]` §4 mục 14).
- **Dữ liệu mỗi dòng (VENUE-001 §4.3):** ảnh chính (không có → ô xám icon sân), tên, địa chỉ, loại sân, khoảng cách (khi có toạ độ).
- **Chế độ:** chọn một — radio + nút "Chọn địa điểm này"; chọn nhiều — checkbox, tiêu đề "Chọn địa điểm (n/5)", nút "Xong (n địa điểm)"; đủ 5 → checkbox còn lại disable.
- **Trạng thái:** *loading* skeleton dòng · *empty* "Không tìm thấy địa điểm" + link "Thêm địa điểm mới" · *error* + "Thử lại" · *GPS bị từ chối* banner "Bật GPS để tìm sân gần bạn hơn", danh sách theo tên A→Z.
- **Responsive / a11y:** focus giữ trong dialog, `Esc` đóng; danh sách là `listbox` (`aria-multiselectable` ở chế độ nhiều); ảnh có `alt` = tên sân.
- **Lưu ý:** màn danh sách / chi tiết / thêm địa điểm thuộc VENUE-001 — S4 chỉ là bộ chọn trong form tạo kèo.

### S5 — Chi tiết kèo luồng A: góc nhìn đội khác (gửi / theo dõi yêu cầu)
- **Mục đích:** xem kèo và gửi yêu cầu ghép kèo (UC-M03, AC-M03); theo dõi / rút yêu cầu đã gửi; mở chat với đội tạo kèo (BR-N04).
- **Thành phần UI chính:** desktop 2 cột — trái: thẻ đầu kèo (badge trạng thái + loại kèo, bộ môn · định dạng, giờ đá, hạn nhận đối, chip trình độ, độ tuổi, tính chất trận), thẻ "Địa điểm" (ảnh, tên, địa chỉ, link "Xem địa điểm" → VENUE-001), thẻ "Thoả thuận chi phí" (chỉ xem); phải: thẻ "Đội tạo kèo" (avatar, tên, uy tín, link "Xem đội"), thẻ hành động. Mobile 1 cột, nút thao tác cố định đáy.
- **Thẻ hành động theo tình huống (đội trưởng):**

  | Tình huống | Hiển thị |
  |---|---|
  | Chưa gửi (hoặc yêu cầu trước đã rút / hết hạn) | ô chọn "Gửi yêu cầu bằng đội" (khi là đội trưởng nhiều đội — API §1.2) + nút "Gửi yêu cầu ghép kèo" + "Sau khi gửi, bạn có thể nhắn tin với đội trưởng <đội>" |
  | Đã gửi, `PENDING` | thẻ "Yêu cầu của <đội>" badge "Đang chờ", "Đã gửi <requestedAt>"; nút "Rút yêu cầu" (viền) + "Nhắn tin" |
  | `ACCEPTED` | kèo đã `CONFIRMED` → hiển thị như S8 (góc nhìn đội đã ghép) |
  | `REJECTED` / `SUPERSEDED` | badge "Bị từ chối" / "Đã ghép đội khác", lý do (nếu có); không có nút gửi; "Xem tin nhắn" (chỉ xem) |
  | Không phải đội trưởng đội nào | không có thẻ hành động |

- **Gửi yêu cầu:** bấm "Gửi yêu cầu ghép kèo" → gửi ngay (UC-M03 bước 2–3), thành công → toast "Yêu cầu đã được gửi" (bước 7), thẻ hành động chuyển `PENDING`. Có cần hộp xác nhận trước khi gửi không `[cần xác nhận]` (§4 mục 15).
- **Rút yêu cầu `PENDING`:** dialog "Rút yêu cầu?" + "Lý do (không bắt buộc)" `n/500` — "Huỷ" / "Rút yêu cầu"; không trừ điểm; gửi trạng thái đang hiển thị (BR-M13).
- **Trạng thái / lỗi:**
  - `MATCH_003` "Kèo đã được ghép" (UC-M03 3a), `MATCH_004` "Kèo đã hết hạn" (3b), `MATCH_013` / `SPORT_002` (3c), `MATCH_006` "Đội đã gửi yêu cầu cho kèo này" (3d) → banner lỗi + tải lại chi tiết.
  - Màn mở lâu quá `expiresAt` → ẩn nút gửi, badge "Hết hạn" (API §1.3).
  - *Loading* skeleton · `MATCH_001` "Không tìm thấy kèo" + "Về Tìm kèo".
  - Chưa có thoả thuận chi phí → "Chưa có thoả thuận chi phí".
- **Responsive / a11y:** badge trạng thái luôn có icon + chữ; nút thao tác có tên đội trong `aria-label`.

### S6 — Chi tiết kèo luồng A: góc nhìn đội tạo kèo (kèo đang mở, xử lý yêu cầu)
- **Mục đích:** đội trưởng đội tạo kèo xem yêu cầu ghép kèo, chấp nhận / từ chối, nhắn tin với từng đội, sửa chi phí, huỷ kèo đang mở (UC-M04, UC-M08 nhánh OPEN, UC-C01).
- **Thành phần UI chính:** như S5 (thẻ đầu kèo, địa điểm, chi phí) + khối "Yêu cầu ghép kèo (n)" với tab "Đang chờ" (mặc định) / "Tất cả". Mỗi dòng: avatar + tên đội gửi, "Uy tín n/100", "Gửi lúc <requestedAt>", badge trạng thái; nút "Nhắn tin" (→ S13), "Từ chối" (viền), "Chấp nhận" (chính). Thẻ "Thoả thuận chi phí" có nút "Sửa chi phí" (→ S7). Menu "Thao tác khác" → "Huỷ kèo".
- **Thao tác:**
  - "Chấp nhận" → dialog "Chấp nhận yêu cầu của <đội>? Các yêu cầu đang chờ khác sẽ chuyển sang 'Đã ghép đội khác'." (UC-M04 bước 3) → thành công: kèo `CONFIRMED`, màn chuyển S8.
  - "Từ chối" → dialog "Lý do (không bắt buộc)" `n/500` → dòng chuyển "Bị từ chối" (không ảnh hưởng uy tín).
  - "Huỷ kèo" khi kèo đang mở: còn yêu cầu đang chờ → thông báo "Vui lòng từ chối tất cả yêu cầu trước khi hủy" + "Xem yêu cầu" (UC-M08 3a, BR-M05); không còn → dialog "Huỷ kèo?" + "Lý do (không bắt buộc)" `n/500`, ghi "Huỷ kèo đang mở không trừ điểm uy tín".
- **Trạng thái / lỗi:**
  - *Không có yêu cầu:* "Chưa có đội nào gửi yêu cầu".
  - `MATCH_003` "Kèo đã được ghép bởi request khác" (UC-M04 3a), `MATCH_008` "Yêu cầu đã được xử lý" (3b), `MATCH_004` (3c), `MATCH_013` / `SPORT_002` (3d), `MATCH_014` → message + tải lại kèo và danh sách yêu cầu.
  - `MATCH_015` khi huỷ → "Trạng thái đã thay đổi, vui lòng tải lại", tải lại; người dùng tự bấm lại (BR-M13).
  - Đội tạm ngưng: ẩn "Chấp nhận" và "Sửa chi phí" (`TEAM_015`), vẫn "Từ chối" và "Huỷ kèo" (API §1.2).
  - Kèo quá `expiresAt` → ẩn mọi nút ghi, badge "Hết hạn".
- **Responsive / a11y:** mobile mỗi yêu cầu là thẻ; danh sách yêu cầu có phân trang; nút có tên đội trong `aria-label`.
- **Lưu ý:** kèo luồng B ở góc nhìn đội tạo kèo (danh sách thương lượng) thuộc MATCH-002.

### S7 — Thoả thuận chi phí (dialog / bottom sheet)
- **Mục đích:** đội trưởng đội tạo kèo luồng A nhập / sửa / xoá thoả thuận chi phí khi kèo đang mở (UC-C01, UC-C02, AC-C01, BR-C01..C04). Chỉ hiển thị — ArenaFlow không thu/giữ tiền.
- **Thành phần UI chính:** desktop dialog ~640px phủ lên S6; mobile bottom sheet.

  | Trường | Điều khiển | Quy tắc |
  |---|---|---|
  | Loại chi phí | Tiền sân / Tiền nước / Cả hai / Không có | BR-C04 · `costType` |
  | Tiền sân (VND) | input số, chỉ hiện khi loại có tiền sân | 1..1.000.000.000 (BR-C02, C04) |
  | Tiền nước (VND) | input số, chỉ hiện khi loại có tiền nước | như trên |
  | Cách chia | Chia đôi 50-50 / 70-30 đội chủ nhà bao 70% / 70-30 đội thua bao 70% / Đội thua trả toàn bộ tiền nước (chỉ bật khi có tiền nước) | UC-C01 bước 4, BR-C04 |
  | Khoản khác (n/10) | dòng "Tên khoản" (`n/100`) + "Số tiền" + nút xoá; "+ Thêm khoản phí"; đủ 10 → disable | UC-C02, BR-C04 |

  Chú thích "ArenaFlow không thu hay giữ tiền; hai đội tự thanh toán." Chân: "Xoá thoả thuận" (chữ màu lỗi), "Huỷ", "Lưu thoả thuận".
- **Thao tác:** lưu thành công → đóng, toast "Đã lưu thoả thuận chi phí", thẻ chi phí S6 cập nhật (mỗi lần lưu thay toàn bộ — BR-C03).
- **Trạng thái:** *lỗi validation* tại trường / dòng khoản tương ứng (UC-C02 4a) · `MATCH_003` / `MATCH_004` / `MATCH_005` → đóng, tải lại kèo · `MATCH_014` → message, tải lại rồi cho lưu lại · *đang lưu* nút disable.
- **Responsive / a11y:** số tiền `inputmode="numeric"` có phân tách hàng nghìn; cách chia là `radiogroup`, lựa chọn bị khoá có lý do "Chỉ chọn được khi có tiền nước".
- **Không vẽ:** tiền cọc (chỉ luồng B — MATCH-002).

### S8 — Chi tiết kèo đã ghép + trạng thái kết thúc
- **Mục đích:** xem kèo `CONFIRMED` ở góc nhìn đội tạo kèo hoặc đội đã ghép; huỷ kèo đã ghép; nhắn tin; các trạng thái `ARCHIVED` / `COMPLETED` / `EXPIRED` / `CANCELLED` (API §3.1, Business_Rules §2.1).
- **Thành phần UI chính:** khối đối đầu "<Đội tạo kèo> vs <Đội đã ghép>" (avatar, tên, uy tín); badge "Đã ghép"; giờ đá, địa điểm, thoả thuận chi phí (chỉ xem — không sửa sau khi ghép, BR-C03, BR-M04; với kèo luồng B hiển thị thêm "Tiền cọc" và "Người giữ cọc" nếu có — BR-C05); nút "Nhắn tin với <đội kia>" (→ S13); nút "Huỷ kèo" (viền màu lỗi, → S9) chỉ hiện khi giờ hiện tại < `startsAt`; với kèo luồng B (`NEED_VENUE`) ở trạng thái `CONFIRMED` và người xem là đội trưởng một trong hai đội: thêm link "Xem thương lượng" (v1.1 → mở S4 của `MATCH-002`).
- **Theo trạng thái (mockup vẽ `CONFIRMED`; trạng thái khác dùng banner đầu trang):**

  | Trạng thái | Badge | Banner / thao tác |
  |---|---|---|
  | `CONFIRMED`, trước giờ đá | "Đã ghép" | Huỷ kèo, Nhắn tin |
  | `CONFIRMED`, từ giờ đá | "Đã ghép" + dòng "Trận đang diễn ra" | ẩn Huỷ (BR-M11) |
  | `ARCHIVED` | "Chờ đánh giá" | "Trận đã kết thúc" + điểm vào "Đánh giá trận" (REPUTATION-001 — chỉ chừa nút) |
  | `COMPLETED` | "Hoàn thành" | điểm vào "Xem đánh giá" (REPUTATION-001) |
  | `EXPIRED` | "Hết hạn" | "Kèo đã hết hạn mà chưa ghép được đối" |
  | `CANCELLED` | "Đã huỷ" | "<Đội> đã huỷ kèo lúc <cancelledAt>" + "Lý do: <cancelReason>" |

- **Trạng thái / lỗi:** loading · `MATCH_001` · thao tác gặp lỗi trạng thái → tải lại (2.3).
- **Responsive / a11y:** khối đối đầu xếp dọc trên mobile; badge có chữ.
- **Lưu ý:** địa điểm ngừng hoạt động vẫn hiện trên kèo cũ (BR-V10) kèm nhãn "Ngừng hoạt động".

### S9 — Huỷ kèo đã ghép / rút yêu cầu đã được chấp nhận (dialog / bottom sheet)
- **Mục đích:** xác nhận huỷ kèo `CONFIRMED` (đội tạo kèo hoặc đội đã ghép) hoặc rút yêu cầu `ACCEPTED` (đội đã ghép, từ S12) — cùng kết quả, trừ điểm uy tín đội thực hiện (UC-M08 nhánh CONFIRMED + Alternative Flow, BR-M09..M13, BR-M16, AC-M06, AC-M09).
- **Thành phần UI chính:** icon cảnh báo, tiêu đề "Huỷ kèo đã ghép?" (từ S12: "Rút yêu cầu đã được chấp nhận?"); dòng "<Đội kia> sẽ được thông báo. Kèo sẽ bị huỷ."; hộp cảnh báo màu lỗi "Huỷ trước giờ đá <Δ> → đội <đội mình> bị trừ <2/5/10> điểm uy tín" (FE tính trước từ `startsAt` theo bảng API §1.5; con số chính thức từ response); ô "Lý do huỷ `*`" `n/500`; "Không huỷ" / "Huỷ kèo" (màu lỗi).
- **Thao tác:** thành công → toast "Đã huỷ kèo · Trừ <n> điểm uy tín" (`reliabilityPenalty`), S8 chuyển `CANCELLED`. Chat với đội kia vẫn nhắn được (BR-N05).
- **Trạng thái / lỗi:**
  - Lý do trống → "Vui lòng nhập lý do hủy" (UC-M08 3d, `MATCH_011`).
  - `MATCH_012` "Trận đã bắt đầu, không thể hủy" (3b) → đóng, ẩn nút huỷ.
  - `MATCH_015` "Trạng thái đã thay đổi, vui lòng tải lại" (3c, A2a) → đóng, tải lại; **không** tự gửi lại.
  - `MATCH_005` (kèo vừa bị đội kia huỷ) → tải lại.
  - *Đang xử lý:* nút disable + spinner.
- **Responsive / a11y:** `role="alertdialog"`, focus mặc định ở "Không huỷ", `Esc` đóng; mức trừ điểm có chữ, không chỉ màu.

### S10 — Chi tiết kèo luồng B (chưa ghép)
- **Mục đích:** xem kèo "Chưa có sân": lựa chọn địa điểm và khung giờ (2.3 `venueOptions`, `timeOptions`); điểm vào "Nhận kèo" (MATCH-002); đội tạo kèo huỷ kèo đang mở (UC-M08 — không cần đóng thương lượng trước, BC-M04).
- **Thành phần UI chính:** thẻ đầu kèo như S5 (badge "Chưa có sân"); thẻ "Lựa chọn địa điểm (n)" — danh sách đánh số đúng thứ tự đội tạo kèo nhập (tên, địa chỉ); thẻ "Khung giờ (n)" — theo giờ tăng dần; thẻ "Đội tạo kèo"; thẻ hành động (v1.1 — đồng bộ `MATCH-002`):
  - Đội khác (đội trưởng ≥ 1 đội khác đội tạo kèo): ô chọn "Nhận kèo bằng đội" (khi làm đội trưởng > 1 đội; đội tạm ngưng bị disable kèm "(tạm ngưng)"); nếu đội đang chọn chưa nhận kèo → nút "Nhận kèo" (mở dialog S1 của `MATCH-002`) + dòng "Hai đội sẽ chat để chốt địa điểm, giờ và chi phí."; nếu đội đang chọn đã nhận kèo → hiện badge trạng thái thương lượng + nút "Xem thương lượng" (→ S4 `MATCH-002`) + "Nhắn tin" (→ S13).
  - Đội tạo kèo: nút "Xem thương lượng" (→ S2 `MATCH-002`) + "Huỷ kèo" → dialog "Huỷ kèo? Mọi thương lượng đang trao đổi sẽ kết thúc." + "Lý do (không bắt buộc)" `n/500`.
- **Không có** thoả thuận chi phí khi chưa ghép (chi phí luồng B nằm trong thương lượng). Kèo B đã ghép → như S8 (một địa điểm, một khung giờ; tiền cọc hiển thị trong thẻ thoả thuận chi phí ở S8).
- **Trạng thái:** như S5 (loading, không tìm thấy, hết hạn).
- **Responsive / a11y:** hai danh sách là `ol`.

### S11 — Kèo của đội
- **Mục đích:** xem mọi kèo đội đã tạo hoặc đã ghép, mọi trạng thái (2.11 — mọi người dùng đã đăng nhập xem được).
- **Thành phần UI chính:** tiêu đề "Kèo của đội"; ô chọn đội `[cần xác nhận]` (§4 mục 2, 8); tab "Tất cả / Đang tìm đối / Đã ghép / Chờ đánh giá / Hoàn thành / Hết hạn / Đã huỷ" (`status`); lọc vai trò "Tất cả / Đội tạo kèo / Đội đã ghép" (`role`); link "Yêu cầu đã gửi" (→ S12, chỉ đội trưởng) và link "Thương lượng" (v1.1 → S3 của `MATCH-002`, chỉ đội trưởng); nút "+ Tạo kèo"; thẻ kèo (như S1 + badge trạng thái + "vs <đội đối thủ>" khi đã ghép + nhãn vai trò); phân trang. Thứ tự theo API: giờ đá mới/xa nhất trước.
- **Thao tác:** bấm thẻ → S5/S6/S8/S10 theo loại, trạng thái, vai trò.
- **Trạng thái:** loading skeleton · empty theo tab "Chưa có kèo nào" + "+ Tạo kèo" · error + "Thử lại" · `TEAM_001` "Không tìm thấy đội".
- **Responsive / a11y:** tab là `tablist`, mobile cuộn ngang; badge có chữ.

### S12 — Yêu cầu đã gửi
- **Mục đích:** đội trưởng theo dõi yêu cầu ghép kèo đội mình đã gửi, rút yêu cầu, mở chat (2.12; Business_Rules §2.2; BR-M12, BR-M13).
- **Thành phần UI chính:** breadcrumb "Kèo của đội › Yêu cầu đã gửi"; ô chọn đội; tab "Tất cả / Đang chờ / Đã chấp nhận / Bị từ chối / Đã rút / Đã ghép đội khác / Hết hạn"; dòng: tên đội tạo kèo, giờ đá (`startsAt`), "Gửi lúc <requestedAt>", badge trạng thái, lý do (nếu có), nút "Xem kèo", "Nhắn tin" (→ S13), "Rút yêu cầu" (khi `PENDING`, hoặc `ACCEPTED` trước giờ đá).
- **Thao tác:** rút `PENDING` → dialog lý do không bắt buộc, không trừ điểm (như S5); rút `ACCEPTED` → S9 chế độ "Rút yêu cầu đã được chấp nhận".
- **Trạng thái / lỗi:** `MATCH_015` / `MATCH_008` → "Trạng thái đã thay đổi, vui lòng tải lại" + tải lại (UC-M08 A2a) · `MATCH_012` · loading / empty "Đội chưa gửi yêu cầu nào" / error · `TEAM_016` "Đội đã giải tán".
- **Responsive / a11y:** mobile dạng thẻ; nút có tên kèo trong `aria-label`.

### S13 — Phòng chat (dùng chung)
- **Mục đích:** hai đội trưởng nhắn tin trong một kèo (UC-N01, AC-N01, AC-N03; BR-N03..N05). Dùng chung cho mọi cuộc trò chuyện (2.16–2.19): luồng A (từ yêu cầu ghép kèo), luồng B (MATCH-002), theo đơn ứng tuyển (MERCENARY-001).
- **Thành phần UI chính:**
  - Desktop: 2 khung — trái danh sách "Tin nhắn" (S14), phải phòng chat. Mobile: phòng chat toàn màn, "‹" quay lại.
  - **Đầu phòng (2.19):** avatar + tên bên kia; "Đội trưởng: <captainName>" của **cả hai** đội (đội trưởng hiện tại — BR-N03); "Bạn nhắn với tư cách <đội mình>" (`viewerPartyId`); dòng ngữ cảnh "Kèo · <giờ đá> · <địa điểm>" (link → chi tiết kèo) + badge trạng thái yêu cầu (`requestStatus`). Menu "⋮": "Xem kèo", "Báo cáo giao tiếp tệ" (điểm vào REPUTATION-001 2.10 — chỉ hiện khi đã có ≥ 1 tin).
  - **Vùng tin (2.17):** tin bên kia bên trái (avatar người gửi + "<tên đội> · <senderName>"), tin của mình bên phải nền xanh; mốc ngày phân cách; giờ gửi; người gửi đã xoá tài khoản → "Người dùng đã xóa", avatar mặc định; cuộn lên tải tin cũ.
  - **Ô soạn (2.16):** "Nhập tin nhắn…", bộ đếm `n/1000`, nút gửi.
- **Đầu phòng theo ngữ cảnh (tái dùng — v1.1):** `TEAM_MATCH` luồng A → như trên; `TEAM_MATCH` luồng B (`matchType = NEED_VENUE`) → như luồng A, kèm badge trạng thái thương lượng (`pairingStatus`) + link "Mở thương lượng" (→ S4 của `MATCH-002`; **không** nhúng khối gói thương lượng trong phòng chat); `MERCENARY_APPLICATION` → bên kia là ứng viên / đội tuyển, ngữ cảnh "Đơn ứng tuyển · <trận>" (khối đầu phòng do `MERCENARY-001` S19 định nghĩa).
- **Trạng thái:**
  - *Chỉ xem* (`canSend = false` — yêu cầu bị từ chối / thay thế / hết hạn / rút khi còn chờ; người đã giải tán đội): ô soạn thay bằng thanh xám icon khoá "Cuộc trò chuyện chỉ còn xem" (UC-N01 1a, 1c). Gửi gặp `CHAT_004` / `MATCH_004` → chuyển sang trạng thái này + tải lại đầu phòng.
  - *Chưa có tin:* "Hãy gửi lời chào tới <đội kia>".
  - *Đang gửi:* tin mờ + spinner; lỗi → "Gửi không thành công · Thử lại".
  - *Mất kết nối realtime:* banner nhỏ "Đang kết nối lại…".
  - *Không còn quyền* (`CHAT_003`, vd vừa chuyển quyền — UC-N01 1d) / *không tồn tại* (`CHAT_002`) → "Bạn không còn xem được cuộc trò chuyện này" + quay lại.
  - *Validation:* rỗng → nút gửi disable; > 1000 ký tự → lỗi dưới ô.
- **Responsive / a11y:** vùng tin `role="log"` `aria-live="polite"`; Enter gửi, Shift+Enter xuống dòng; tin mình / bên kia phân biệt bằng vị trí + nhãn tên, không chỉ màu.
- **Không implement:** dấu "Đã xem" dưới tin của mình `[cần xác nhận]` (§4 mục 9).

### S14 — Tin nhắn của tôi
- **Mục đích:** danh sách mọi cuộc trò chuyện người dùng xem được, tin mới nhất lên đầu (UC-N04, AC-N04, BR-N06) — chat hai đội (luồng A, B) và chat theo đơn mercenary.
- **Thành phần UI chính:** tiêu đề "Tin nhắn"; dòng (2.20): avatar + tên bên kia (`otherParty`), "Đội của bạn: <viewerParty>", ngữ cảnh "Kèo · <startsAt>" hoặc "Đơn ứng tuyển · <startsAt>", tin cuối "<senderName>: <contentPreview>" + thời điểm, chấm "chưa đọc" (`hasUnread`) + chữ đậm, nhãn "Chỉ xem" (icon khoá) khi `canSend = false`; chưa có tin → "Chưa có tin nhắn". Phân trang / tải thêm khi cuộn. Desktop: khung trái của bố cục 2 khung; khung phải "Chọn một cuộc trò chuyện để bắt đầu".
- **Thao tác:** bấm dòng → S13. Có tin mới (realtime) → tải lại trang 1.
- **Trạng thái:** loading skeleton · empty "Bạn chưa có cuộc trò chuyện nào" (UC-N04 1a) · error + "Thử lại".
- **Chỉ báo "Tin nhắn" trên header:** chấm đỏ cạnh mục "Tin nhắn" (desktop) / icon tin nhắn (mobile) khi còn cuộc trò chuyện chưa đọc — không hiện số (BR-N12). Nguồn dữ liệu `[cần xác nhận]` (§4 mục 12).
- **Responsive / a11y:** mỗi dòng là link; "chưa đọc" có chữ ẩn cho trình đọc màn hình; "Chỉ xem" có icon + chữ.

### S15 — Admin quản lý bộ môn
- **Mục đích:** admin bật / tắt bộ môn (2.14, 2.15; Overview §9.7; Business_Rules §5.4; BR-M15).
- **Thành phần UI chính:** layout "Quản trị" (như S13 USER-001) thêm menu "Bộ môn"; tab "Tất cả / Đang bật / Đang tắt" (`isActive`); desktop bảng "Bộ môn · Trạng thái · Ngày tạo · Bật / tắt"; mobile thẻ; phân trang.
- **Thao tác:** gạt **tắt** → dialog "Tắt bộ môn <tên>?" — "Kèo đang mở của bộ môn sẽ bị ẩn khỏi tìm kèo và không gửi/chấp nhận yêu cầu được. Kèo không tự huỷ; kèo đã ghép tiếp tục bình thường." — "Huỷ" / "Tắt bộ môn" (màu lỗi). Gạt **bật** → bật ngay, toast "Đã bật bộ môn <tên>".
- **Trạng thái:** loading skeleton · empty "Không có bộ môn" · `AUTH_004` → ẩn trang quản trị · `SPORT_001` → tải lại · đang lưu: công tắc disable.
- **Responsive / a11y:** công tắc là `switch`, `aria-label` "Bật/tắt <tên bộ môn>"; trạng thái có chữ.
- **Không có:** thêm / sửa tên bộ môn (API không có endpoint).
- **Không implement:** mockup mobile có huy hiệu "Admin" trên thanh đầu do Stitch thêm.

## 3. Thành phần dùng chung giữa các màn hình

- **Header ứng dụng (mở rộng từ USER-001 §3):**
  - Desktop: logo ArenaFlow · "Tìm kèo" · "Kèo của đội" · "Đội của tôi" · "Tin nhắn" (chấm đỏ khi có cuộc trò chuyện chưa đọc) · avatar + tên (menu "Hồ sơ cá nhân", "Đăng xuất").
  - Mobile: nút menu (ngăn kéo chứa các mục trên), logo, icon "Tin nhắn" có chấm đỏ.
  - Mục của chức năng khác (VENUE-001 "Địa điểm", chuông NOTIFICATION-001, MERCENARY-001) gộp vào cùng header — thứ tự chung `[cần xác nhận]` (§4 mục 3).
- **Layout quản trị:** như USER-001 (S13, S14), thêm menu "Bộ môn" (S15).
- **Thẻ kèo (Kèo rút gọn §4.3):** S1, S11 — avatar + tên đội tạo kèo, uy tín, badge loại kèo (+ badge trạng thái ở S11), bộ môn · định dạng, giờ đá, địa điểm hoặc "n lựa chọn địa điểm · m khung giờ", khoảng cách, chip trình độ, hạn nhận đối.
- **Thẻ đầu kèo + thẻ địa điểm + thẻ thoả thuận chi phí (chỉ xem):** S5, S6, S8, S10.
- **Badge trạng thái kèo** (icon + chữ, nhãn `[cần xác nhận]` §4 mục 1): `OPEN` "Đang tìm đối" · `CONFIRMED` "Đã ghép" · `ARCHIVED` "Chờ đánh giá" · `COMPLETED` "Hoàn thành" · `EXPIRED` "Hết hạn" · `CANCELLED` "Đã huỷ".
- **Badge trạng thái yêu cầu ghép kèo:** `PENDING` "Đang chờ" · `ACCEPTED` "Đã chấp nhận" · `REJECTED` "Bị từ chối" · `WITHDRAWN` "Đã rút" · `SUPERSEDED` "Đã ghép đội khác" · `EXPIRED` "Hết hạn".
- **Badge loại kèo:** "Đã có sân" (xanh) / "Chưa có sân" (vàng nhạt) — luôn có chữ.
- **Chip nhãn trình độ:** tái dùng USER-001 (hiển thị; chọn tối đa 3).
- **Bộ chọn địa điểm (S4):** chế độ một / nhiều (tối đa 5).
- **Dialog xác nhận / bottom sheet:** như USER-001 §3; thao tác nguy hiểm (huỷ kèo, rút yêu cầu, tắt bộ môn) dùng nút màu error; ô lý do `n/500` (bắt buộc ở S9; không bắt buộc ở từ chối, rút `PENDING`, huỷ kèo đang mở).
- **Phòng chat (S13) + danh sách Tin nhắn (S14):** bố cục 2 khung desktop; MATCH-002, MERCENARY-001 tái dùng, chỉ thay khối ngữ cảnh đầu phòng.
- **Phân trang "Trước | 1 | 2 | Sau":** S1, S6 (yêu cầu), S11, S12, S14, S15.
- **Người dùng đã xoá:** "Người dùng đã xóa", avatar mặc định (BC-U02, BR-N03).
- **Theme:** project Stitch `ArenaFlow` — Be Vietnam Pro, primary `#3d6943`, error `#a73b21`, nền `#f8faf3`, bo góc 8px (khớp USER-001 §3). Badge "Chưa có sân" tông vàng nhạt do Stitch chọn — khi code map sang token `tertiary-container` `[cần xác nhận]` (§4 mục 16).

## 4. `[cần xác nhận]`

> User duyệt trước toàn bộ UI/UX (2026-11-27) và cho làm tiếp khi còn điểm mở. Các mục dưới không chặn UI; cần chốt trước hoặc trong lúc làm `solution-architect`. Phần thuộc hợp đồng API → đề xuất làm ở repo BE.

1. **Nhãn tiếng Việt của trạng thái kèo / yêu cầu** (§3): SRS và API chỉ có enum; nhãn hiển thị do ui-designer đặt.
2. **Danh sách "đội tôi làm đội trưởng"** (S2, S3, S5, S11, S12): API §1.2 yêu cầu FE cho chọn đội trước khi gửi `teamId`, nhưng USER-001 chưa có API "đội của tôi" (USER-001 `UI_Design.md` §4 mục 5). Cần nguồn lọc đội `ACTIVE` mà người dùng là đội trưởng.
3. **Header chung:** thêm "Tìm kèo", "Kèo của đội", "Tin nhắn"; cần gộp với mục của VENUE-001, NOTIFICATION-001 (chuông), MERCENARY-001 đang vẽ song song — thứ tự, nhãn, mục nào vào ngăn kéo mobile.
4. **GPS bị từ chối ở Tìm kèo (S1):** SRS "Quyết định bổ sung" mục 3 nói fallback sang khu vực hồ sơ (phường/xã) + "Bật GPS để tìm kèo gần bạn hơn"; API 2.2 không có tham số phường/xã → UI chỉ tắt lọc khoảng cách. Cần xác nhận quyết định này có áp cho tìm kèo đội.
5. **Lọc trình độ (S1):** API 2.2 chỉ nhận một `skillLevel` → ô chọn một nhãn.
6. **Hạn nhận đối mặc định (S2, S3):** SRS không nêu → UI để trống, bắt buộc nhập.
7. **Kèo đang diễn ra (S8):** `CONFIRMED` từ `startsAt` tới khi `ARCHIVED` không có trạng thái riêng → UI chỉ thêm dòng "Trận đang diễn ra", ẩn nút huỷ.
8. **Điểm vào "Kèo của đội" (S11):** mục header mở đội đầu tiên trong danh sách đội của tôi; trên chi tiết đội S8a/S8b (`USER-001` / `USER-002` v1.2) đã bổ sung link "Kèo của đội".
9. **Dấu "Đã xem" trong chat (S13):** API có `isRead` nhưng không có tín hiệu realtime khi bên kia đọc (2.18) → chưa vẽ.
10. **Đầu phòng chat cho đơn ứng tuyển / thương lượng (S13 — v1.1):** đơn ứng tuyển dùng khối đầu phòng S19 của `MERCENARY-001`; thương lượng luồng B dùng đầu phòng `TEAM_MATCH` kèm badge `pairingStatus` + link "Mở thương lượng" (không vẽ khối gói thương lượng trong phòng chat). Mockup S13 hiện tại giữ nguyên cho luồng A.
11. **Báo cáo "giao tiếp tệ" (S13):** chỉ chừa mục menu; dialog và điều kiện hiển thị thuộc REPUTATION-001.
12. **Chấm đỏ "Tin nhắn" trên header:** 2.20 chỉ có `hasUnread` từng cuộc trò chuyện, không có tổng; kênh cá nhân (`CONVERSATION_ACTIVITY`) mở cùng bản phát hành NOTIFICATION-001. Lúc tải app: cần endpoint "có tin chưa đọc" ở BE, hay dùng trang 1 của 2.20 (có thể sót)?
13. **Câu giải thích & điểm vào luồng B (S3, S8, S10, S11 — v1.1):** đã đồng bộ với `MATCH-002` v1.1 (vùng chọn đội + "Nhận kèo" / "Xem thương lượng" ở S10, link "Xem thương lượng" ở S8 cho kèo B `CONFIRMED`, link "Thương lượng" ở S11).
14. **"Thêm địa điểm mới" từ S4:** quay lại form tạo kèo và tự chọn địa điểm vừa tạo — chốt cùng VENUE-001.
15. **Hộp xác nhận khi gửi yêu cầu (S5):** UC-M03 có bước "chọn" rồi "submit"; UI hiện gửi ngay khi bấm nút.
16. **Màu badge "Chưa có sân":** vàng nhạt ngoài bảng màu chính; map sang token `tertiary-container` khi code.
17. **Link "Xem đội" từ kèo (S5, S8, S10):** USER-001 chưa có màn xem đội công khai cho người không phải thành viên (S8a là góc nhìn thành viên).
