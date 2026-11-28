# UI Design — MATCH-002 Thương lượng ghép kèo luồng B (Pairing)

| Mục | Giá trị |
|---|---|
| Mã chức năng | `MATCH-002` |
| Nguồn SRS | `docs/agent/upstream/business-spec/SYSTEM-001/` (MATCH-002 nằm trong SYSTEM-001 — mục lục `docs/agent/upstream/README.md`); hợp đồng API tham chiếu: `docs/agent/upstream/api/MATCH-002/API_Spec.md` v3.1 |
| Căn cứ | `ArenaFlow-spec@53aee11` |
| Công cụ | Stitch MCP — project `ArenaFlow` (`2789586751825382546`, `docs/agent/external-knowledge.md` §3), design system `assets/17011466837528823159` |
| Thiết bị mục tiêu | Cả hai: web desktop (1280) + web mobile (trình duyệt điện thoại, khung 390px) — một codebase React responsive |
| Trạng thái duyệt | Đã duyệt 2026-11-27 — user duyệt trước toàn bộ UI/UX (ủy quyền, chưa xem từng màn hình) |
| Tác giả / Ngày / Phiên bản | `ui-designer` (agent) / `2026-11-28` / `v1.1` — lịch sử: `CHANGELOG.md` |

> **Phạm vi:** nhận kèo luồng B (tạo Pairing), danh sách Pairing của một kèo (phía đội tạo kèo), Pairing của đội, chi tiết Pairing (chốt phương án, chi phí + tiền cọc + khoản tự nhập, xác nhận gói hai bên), trạng thái `SUPERSEDED` / `EXPIRED`, cập nhật realtime, lối vào chat của Pairing.
> **Không vẽ ở đây:** form tạo kèo (kể cả luồng B), tìm kèo, chi tiết kèo, phòng chat hai đội, "Tin nhắn của tôi" → **MATCH-001** (`docs/agent/design/MATCH-001/UI_Design.md` v1.1). Đánh giá / report → REPUTATION-001. Thông báo → NOTIFICATION-001. Mercenary → MERCENARY-001.
> **Thuật ngữ trên UI:** Pairing = "Thương lượng"; gói = "Gói thương lượng" (phương án + chi phí + tiền cọc + khoản tự nhập — BR-M19).

## 1. Danh sách màn hình

| # | Màn hình | Use case (SRS) | Stitch screen id (desktop / mobile) | File xuất (`ui/`) |
|---|---|---|---|---|
| S1 | Nhận kèo (dialog / bottom sheet trên chi tiết kèo luồng B) | UC-M05, BR-M08, BR-M14, BR-M15, BR-M17, BR-M21 | _chưa có_ / _chưa có_ | `S1-nhan-keo-{desktop,mobile}.{png,html}` — chưa xuất |
| S2 | Đội đang thương lượng (trên kèo của đội mình) | UC-M05 post, BR-M08 | _chưa có_ / _chưa có_ | `S2-doi-dang-thuong-luong-…` — chưa xuất |
| S3 | Thương lượng của đội | UC-M06, UC-M07 (theo dõi), BR-M21 | _chưa có_ / _chưa có_ | `S3-thuong-luong-cua-doi-…` — chưa xuất |
| S4a | Chi tiết thương lượng — chưa chốt phương án | UC-M06, UC-M07 2a, BR-M19 | _chưa có_ / _chưa có_ | `S4a-thuong-luong-chua-chot-…` — chưa xuất |
| S4b | Chi tiết thương lượng — đang trao đổi, chờ xác nhận | UC-M06, UC-M07, UC-C01, BR-M07, BR-M19, BR-C05 | _chưa có_ / `69c159f226f54a15876d859fcd66e72c` | `S4b-thuong-luong-cho-xac-nhan-mobile.{png,html}` |
| S4c | Chi tiết thương lượng — đã ghép (`CONFIRMED`) | UC-M07 post, AC-M04, BR-N05 | _chưa có_ / _chưa có_ | `S4c-thuong-luong-da-ghep-…` — chưa xuất |
| S4d | Chi tiết thương lượng — đã kết thúc (`SUPERSEDED` / `EXPIRED`, chỉ xem) | UC-M07 5a, UC-M09, AC-M05, BR-M17, BR-N05 | _chưa có_ / _chưa có_ | `S4d-thuong-luong-ket-thuc-…` — chưa xuất |
| S4e | Chi tiết thương lượng — gói đã thay đổi (xung đột `revision`) | UC-M06 4b, UC-M07 2b, AC-M04, BR-M19 | _chưa có_ / _chưa có_ | `S4e-thuong-luong-goi-thay-doi-…` — chưa xuất |
| S5 | Chốt phương án (dialog / bottom sheet) | UC-M06 bước 4, 4a, BR-M19, BR-M20 | _chưa có_ / _chưa có_ | `S5-chot-phuong-an-…` — chưa xuất |
| S6 | Chi phí & tiền cọc (dialog / bottom sheet, form) | UC-C01, UC-C02, BR-C01..C05, BR-M19 | _chưa có_ / _chưa có_ | `S6-chi-phi-tien-coc-…` — chưa xuất |
| S7 | Xác nhận gói (dialog / bottom sheet) | UC-M07 bước 1–6, 2a–2c, 5a, BR-M07 | _chưa có_ / _chưa có_ | `S7-xac-nhan-goi-…` — chưa xuất |

> **Mockup chưa đủ:** khi sinh MATCH-002, Stitch MCP liên tục trả `The operation timed out` (2026-11-27: 14 lần gọi `generate_screen_from_text` / `generate_variants`, thử cả model mặc định, `GEMINI_3_8_FLASH`, `GEMINI_3_5_FLASH_LITE`; 1 lần thành công — S4b mobile; 1 lần trả lời chữ nhưng không kèm screen); màn sinh dở không lấy lại được vì `list_screens` / `get_project` không trả màn mới (chỉ `get_screen` theo id đọc được). Các màn "chưa có" ở trên mới có **đặc tả chữ** ở §2; cần chạy lại `ui-designer` để sinh mockup và điền screen id. Xem §4 mục 1.

## 2. Chi tiết từng màn hình

> Dữ liệu trong mockup (tên đội, tên người, sân, ngày, số tiền) là **dữ liệu mẫu**.
> Mockup chỉ dùng để tham khảo, không copy HTML từ Stitch vào `src/`.
> **Ngày giờ:** giờ Việt Nam, hiển thị nguyên giá trị API trả (không đổi múi giờ — SYSTEM-002), định dạng `dd/MM/yyyy HH:mm`; khung giờ `dd/MM/yyyy HH:mm – HH:mm`.
> **Tiền:** VND số nguyên, định dạng `600.000 đ` (BR-C01).
> **Nhãn cố định** dùng lại ở mọi màn:
> - Trạng thái thương lượng (§1.3 API): `NEGOTIATING` "Đang trao đổi" · `CONFIRMED` "Đã ghép" · `SUPERSEDED` "Đã kết thúc" · `EXPIRED` "Hết hạn". Badge luôn có chữ + icon, không chỉ màu.
> - Loại chi phí (BR-C04): "Tiền sân" · "Tiền nước" · "Tiền sân và tiền nước".
> - Cách chia (UC-C01 bước 4): "Chia đôi 50-50" · "70-30, đội chủ nhà bao 70%" · "70-30, đội thua bao 70%" · "Đội thua trả toàn bộ tiền nước" (`[cần xác nhận]` §4 mục 5).
> - Vai trò: "Đội tạo kèo" (author) · "Đội nhận kèo" (interested) · chip "Bên của bạn".

### S1 — Nhận kèo
- **Mục đích:** đội trưởng nhận một kèo luồng B đang mở → mở thương lượng với đội tạo kèo (UC-M05).
- **Vùng hành động trên chi tiết kèo luồng B (S10 `MATCH-001` — v1.1):**
  - Khi người xem làm đội trưởng > 1 đội khác đội tạo kèo: hiện ô chọn "Nhận kèo bằng đội" ngay trên thẻ hành động của S10 (đội tạm ngưng bị disable kèm "(tạm ngưng)"; mặc định chọn đội `ACTIVE` đầu tiên).
  - Nếu đội đang chọn đã có thương lượng cho kèo này: hiện badge trạng thái thương lượng + nút "Xem thương lượng" (→ S4) + "Nhắn tin" (→ phòng chat S13 `MATCH-001`).
  - Nếu đội đang chọn chưa nhận kèo: hiện nút "Nhận kèo" (mở dialog S1) + dòng "Hai đội sẽ chat để chốt địa điểm, giờ và chi phí."
  - Nếu người xem chưa làm đội trưởng đội nào đang hoạt động: hiện dòng "Bạn cần là đội trưởng của một đội đang hoạt động để nhận kèo" ngay trên thẻ hành động (không mở dialog).
- **Thành phần UI chính của dialog S1 (v1.1):** desktop là dialog phủ trên chi tiết kèo (`MATCH-001`); mobile là bottom sheet.
  - Tiêu đề "Nhận kèo của <đội tạo kèo>".
  - Dòng xác nhận đội nhận kèo: "Nhận kèo với tư cách đội: **<tên đội đang chọn>**" (không lặp lại radio list chọn đội và không hiển thị "Uy tín n/100" của đội mình trong dialog).
  - Đoạn giải thích: "Nhận kèo sẽ mở thương lượng giữa đội bạn và <đội tạo kèo>. Hai đội trò chuyện, chốt địa điểm, giờ, chi phí rồi cùng xác nhận. Kèo vẫn mở cho đội khác trong lúc thương lượng." (UC-M05 post, BR-M08).
  - Ô tóm tắt: lựa chọn địa điểm, lựa chọn khung giờ, hạn nhận kèo (`expiresAt`) — lấy từ chi tiết kèo MATCH-001.
  - Nút "Huỷ" / "Nhận kèo".
- **Dữ liệu hiển thị:** đội tạo kèo, `venueOptions`, `timeOptions`, `expiresAt` (MATCH-001 chi tiết kèo); tên đội đang chọn từ vùng S10.
- **Thao tác:**
  - "Nhận kèo" thành công → đóng dialog, chuyển tới S4a của thương lượng mới.
  - "Huỷ" / Esc / chạm nền → đóng.
  - Nút "Nhận kèo" trên chi tiết kèo **ẩn** khi kèo là của đội mình (author) — nơi đó hiện nút "Xem thương lượng" mở S2 (`MATCH-001` S10).
- **Trạng thái:**
  - *Đang gửi:* nút "Nhận kèo" có spinner, cả hai nút disable.
  - *Lỗi (banner `role="alert"` trong dialog, icon + chữ):*
    - "Kèo đã được ghép" (`MATCH_003`) · "Kèo đã hết hạn" (`MATCH_004`, BR-M17) · kèo đã huỷ / lưu trữ / hoàn thành (`MATCH_005`) → banner + nút "Quay lại" tải lại tìm kèo.
    - "Đội đã nhận kèo này" (`PAIRING_003`, BR-M21) → banner + link "Mở thương lượng đã có" (→ S4 của thương lượng đó).
    - "Đội đối phương hiện không hoạt động" (`MATCH_013`, BR-M14) · "Bộ môn hiện không được hỗ trợ" (`SPORT_002`, BR-M15) · "Đội đang tạm ngưng hoạt động" (`TEAM_015`, BR-M14) · đội đã giải tán (`TEAM_016`).
    - Có thao tác khác cùng lúc (`MATCH_014`) → banner + cho bấm lại.
- **Responsive / a11y:** dialog có `role="dialog"`, `aria-modal`, focus trap, Esc đóng, focus về nút mở khi đóng.
- **Mockup:** chưa sinh được (§1).

### S2 — Đội đang thương lượng (kèo của đội mình)
- **Mục đích:** đội trưởng đội tạo kèo xem các đội đang thương lượng trên kèo luồng B của mình và mở từng thương lượng (BR-M08: nhiều Pairing cùng lúc).
- **Thành phần UI chính:**
  - Thẻ tóm tắt kèo: "Kèo của <đội>", badge trạng thái kèo, chip "Chưa có sân", bộ môn · định dạng, lựa chọn địa điểm / khung giờ, "Hạn nhận kèo".
  - Dòng giải thích: "Kèo vẫn mở trong lúc thương lượng. Đội đầu tiên được cả hai bên xác nhận gói sẽ được ghép; các thương lượng khác kết thúc." (BR-M07, UC-M07 bước 7).
  - Tiêu đề "Đội đang thương lượng" + số lượng.
  - Tab lọc trạng thái: Tất cả · Đang trao đổi · Đã ghép · Đã kết thúc · Hết hạn.
  - Desktop: bảng `ĐỘI NHẬN KÈO · PHƯƠNG ÁN · XÁC NHẬN · TRẠNG THÁI · NHẬN KÈO LÚC · thao tác`. Mobile: thẻ.
  - Mỗi dòng: tên đội nhận kèo + "Uy tín n/100"; phương án đã chốt (tên sân + khung giờ, map `proposalVenueId` / `proposalTimeOptionId` với lựa chọn của kèo) hoặc "Chưa chốt"; tình trạng xác nhận ("<đội> đã xác nhận · Bạn chưa", "Chưa đội nào xác nhận", "Hai đội đã xác nhận"); badge trạng thái; thời điểm nhận kèo; nút "Mở thương lượng" (→ S4) và "Nhắn tin" (→ phòng chat MATCH-001 theo `conversationId`).
  - Phân trang "Trước | 1 | Sau" (giống USER-001).
- **Thứ tự:** nhận kèo trước lên trước (API 2.2).
- **Trạng thái:**
  - *Loading:* skeleton bảng / thẻ.
  - *Empty:* "Chưa có đội nào nhận kèo" + "Kèo đang hiển thị trong tìm kèo tới <expiresAt>". Lọc ra rỗng: "Không có thương lượng ở trạng thái này".
  - *Error:* banner lỗi chung + "Thử lại". Không phải đội trưởng đội tạo kèo (`TEAM_002`) → ẩn cả mục. Đội đã giải tán (`TEAM_016`) → banner message.
  - *Kèo đã ghép:* dòng thắng badge "Đã ghép", các dòng khác "Đã kết thúc".
- **Responsive / a11y:** bảng có `<th scope>`; nút thao tác có `aria-label` kèm tên đội ("Mở thương lượng với Team Beta").
- **Vị trí & điều hướng (v1.1):** trang riêng (`/matches/:matchId/pairings`), mở từ nút "Xem thương lượng" trên chi tiết kèo luồng B (S10 `MATCH-001`), có breadcrumb "Kèo <bộ môn · định dạng> › Đội đang thương lượng".
- **Mockup:** chưa sinh được (§1).

### S3 — Thương lượng của đội
- **Mục đích:** đội trưởng xem mọi thương lượng của đội (kèo của đội mình + kèo đội mình nhận), mở lại thương lượng / chat, theo dõi xác nhận (API 2.3).
- **Thành phần UI chính:**
  - Breadcrumb (v1.1): "Kèo của đội › Thương lượng ghép kèo" (mở từ link "Thương lượng" trên màn Kèo của đội S11 `MATCH-001`).
  - Tiêu đề "Thương lượng ghép kèo", dòng phụ "Các kèo chưa có sân mà đội đang trao đổi để chốt địa điểm, giờ và chi phí."
  - Thanh lọc: chọn "Đội" (các đội người dùng làm đội trưởng); "Vai trò": Tất cả · Kèo của đội · Đội nhận kèo; "Trạng thái": Tất cả · Đang trao đổi · Đã ghép · Đã kết thúc · Hết hạn.
  - Danh sách (desktop: các dòng trong một thẻ; mobile: thẻ). Mỗi dòng: "<đội nhận kèo> nhận kèo của <đội tạo kèo>", chip vai trò của đội mình, "Trận sớm nhất: <matchStartsAt>" (đã ghép: "Trận: …"), "Hạn: <matchExpiresAt>" khi còn trao đổi, badge trạng thái, dòng tình trạng ("Chưa chốt phương án" / "Đã chốt phương án" / "<đội> đã xác nhận" / "Hai đội đã xác nhận <confirmedAt>" / "Chỉ xem"), nút "Xem" (→ S4), "Nhắn tin" (→ chat MATCH-001; luôn mở được, kể cả khi chỉ xem).
  - Phân trang.
- **Thứ tự:** vừa thay đổi lên trước (API 2.3).
- **Trạng thái:** loading skeleton; empty "Đội chưa có thương lượng nào" (+ link "Tìm kèo"); lọc rỗng "Không có thương lượng phù hợp"; lỗi chung + "Thử lại"; `TEAM_001` "Không tìm thấy đội"; `TEAM_016` message; không làm đội trưởng đội nào → "Chỉ đội trưởng xem được thương lượng của đội".
- **Responsive / a11y:** bộ lọc vai trò là segmented control dạng `radiogroup`; mobile cuộn ngang chip.
- **Lưu ý:** dòng không hiển thị tên sân / bộ môn — danh sách rút gọn chỉ có id phương án, không có bộ môn (§4.3 API); `[cần xác nhận]` §4 mục 6.
- **Mockup:** chưa sinh được (§1).

### S4 — Chi tiết thương lượng (khung chung cho S4a–S4e)
- **Mục đích:** màn chính của luồng B: xem gói, chốt phương án, sửa chi phí, xác nhận qua UI riêng (không qua chat — BR-M07), mở chat.
- **Thành phần UI chính:**
  - Header ứng dụng (§3). Desktop (v1.1): breadcrumb "Kèo của đội › Thương lượng ghép kèo › <đội kia>". Mobile: sub header nút quay lại + "Thương lượng ghép kèo".
  - **Thẻ đầu trang:** tiêu đề "Thương lượng ghép kèo", badge trạng thái, "Bộ môn · định dạng" (từ chi tiết kèo), "Hạn thương lượng: <matchExpiresAt>" (chỉ khi đang trao đổi). Hai khối đội (desktop cạnh nhau có "VS"; mobile xếp dọc): tên đội, vai trò ("Đội tạo kèo" / "Đội nhận kèo"), chip "Bên của bạn", "Đội trưởng: <captainName>" (đội trưởng **hiện tại**; "Người dùng đã xóa" khi đã xoá tài khoản; không còn đội trưởng → "—"), "Uy tín n/100". Nút "Nhắn tin với <đội kia>" (desktop trong thẻ; mobile ở thanh dưới) → phòng chat MATCH-001 theo `conversationId`.
  - **"Gói thương lượng"** + dòng phụ "Gói thay đổi sẽ xoá xác nhận của cả hai đội." (BR-M19):
    - Thẻ "Phương án đã chốt": địa điểm (tên + địa chỉ), khung giờ (thứ + ngày, giờ bắt đầu – kết thúc). Link "Đổi phương án" → S5.
    - Thẻ "Chi phí & tiền cọc": loại chi phí, tiền sân, tiền nước, cách chia, "Khoản phí khác" (từng khoản: tên — số tiền, đúng thứ tự nhập), "Tiền cọc", "Người giữ cọc", ghi chú "ArenaFlow không thu, giữ hay hoàn tiền. Hai đội tự thanh toán bên ngoài." (UC-C01 post). Link "Sửa chi phí" → S6. Field `null` → không hiện dòng.
  - **Thẻ "Xác nhận gói"** (desktop cột phải, sticky; mobile cuối nội dung): mỗi đội một dòng, icon + chữ "Đã xác nhận <thời điểm>" / "Chưa xác nhận". Nút chính "Xác nhận gói này" → S7. Dòng phụ "Khi cả hai đội xác nhận, kèo được ghép với <đội nhận kèo> và các thương lượng khác của kèo sẽ kết thúc."
  - Mobile: thanh thao tác dính đáy gồm "Nhắn tin" + "Xác nhận gói này".
- **Hiển thị nút theo trạng thái** (API §3, "Gợi ý hiển thị nút"):

  | Điều kiện | Đổi phương án / Sửa chi phí | Xác nhận gói | Nhắn tin |
  |---|---|---|---|
  | `NEGOTIATING`, chưa có phương án | "Chốt phương án" / "Nhập chi phí" | Ẩn — "Cần chốt phương án trước khi xác nhận." | Có |
  | `NEGOTIATING`, có phương án, mình chưa xác nhận | Có | "Xác nhận gói này" | Có |
  | `NEGOTIATING`, mình đã xác nhận | Có (đổi gói sẽ xoá xác nhận) | Thay bằng trạng thái "Đã xác nhận, chờ <đội kia>" | Có |
  | `NEGOTIATING`, `proposal.venueStatus = INACTIVE` | Có | Ẩn — banner "Địa điểm đã ngừng hoạt động — chốt lại địa điểm khác" (BR-M20) | Có |
  | `NEGOTIATING`, đã quá `matchExpiresAt` theo giờ hiển thị | Ẩn | Ẩn | Có (chỉ xem sau khi máy chủ chuyển `EXPIRED`) |
  | `CONFIRMED` | Ẩn | Ẩn | Có — nhắn được (BR-N05) |
  | `SUPERSEDED` / `EXPIRED` | Ẩn | Ẩn | Có — chỉ xem |
  | Đội mình tạm ngưng | Ẩn + banner "Đội đang tạm ngưng hoạt động" (BR-M14) | Ẩn | Có |

- **Trạng thái chung:**
  - *Loading:* skeleton thẻ đầu + 3 thẻ gói.
  - *Error:* `PAIRING_001` "Không tìm thấy thương lượng ghép kèo" + "Về danh sách" (→ S3); `PAIRING_002` "Đội không tham gia thương lượng này" + "Quay lại"; lỗi mạng → banner + "Thử lại".
  - *Realtime* (API §1.6): nhận `PAIRING_UPDATED` → tải lại chi tiết rồi hiện banner thông tin theo `change`: `CONFIRMATION` "<đội> vừa xác nhận gói." · `PROPOSAL` "<đội> vừa đổi phương án. Xác nhận của hai đội đã bị xoá." · `COST` "<đội> vừa sửa chi phí. Xác nhận của hai đội đã bị xoá." · thương lượng `CONFIRMED` → chuyển S4c. Trong lúc tải lại, nút "Xác nhận gói này" disable. Mất kết nối realtime → dải nhỏ "Đang kết nối lại…" (`role="status"`); kết nối lại xong tải lại chi tiết.
  - *Thao tác ghi lỗi chung* (S5, S6, S7): `MATCH_004` "Kèo đã hết hạn" → tải lại → S4d; `PAIRING_005` "Thương lượng đã kết thúc" → tải lại → S4c / S4d; `PAIRING_006` → S4e; `MATCH_014` → tải lại, cho bấm lại; `TEAM_015` / `TEAM_016` message.
- **Người làm đội trưởng cả hai đội (BR-M18 — v1.1):** hiện thanh chọn segmented "Thao tác với tư cách: <đội tạo kèo> | <đội nhận kèo>" (mặc định đội tạo kèo) phía trên thẻ Gói thương lượng để chọn `teamId` khi thực hiện S5, S6, S7.
- **Responsive / a11y:** desktop 2 cột (gói 2/3, xác nhận 1/3); mobile 1 cột + thanh đáy. Banner realtime `role="status"`, banner lỗi `role="alert"`. Tình trạng xác nhận dùng icon + chữ. Nút sửa có `aria-label` ("Đổi phương án", "Sửa chi phí").

#### S4a — Chưa chốt phương án
- Thương lượng vừa tạo (`revision = 0`, `proposal = null`, chi phí rỗng — UC-M05 post).
- Thẻ "Phương án": trạng thái rỗng "Chưa chốt địa điểm và giờ" + "Chọn 1 địa điểm và 1 khung giờ trong các lựa chọn của kèo (n địa điểm, m khung giờ)." + nút "Chốt phương án" (→ S5).
- Thẻ "Chi phí & tiền cọc": "Chưa có thoả thuận chi phí" + nút "Nhập chi phí" (→ S6).
- Thẻ "Xác nhận gói": hai dòng "Chưa xác nhận"; text "Cần chốt phương án trước khi xác nhận." (UC-M07 2a, BR-M07). Không hiện nút xác nhận.
- Ngay sau khi nhận kèo (từ S1): toast "Đã nhận kèo. Hãy trò chuyện với <đội tạo kèo> để chốt phương án."
- **Mockup:** chưa sinh được (§1).

#### S4b — Đang trao đổi, chờ xác nhận
- Có phương án + chi phí; đội kia đã xác nhận, mình chưa → nút "Xác nhận gói này".
- Biến thể "mình đã xác nhận": thẻ xác nhận thay nút bằng dòng "Đã xác nhận, chờ <đội kia>" (icon đồng hồ); vẫn sửa được gói.
- **Mockup:** mobile `69c159f226f54a15876d859fcd66e72c` (`ui/S4b-thuong-luong-cho-xac-nhan-mobile.{png,html}`). Desktop chưa sinh được (bố cục desktop theo §2 S4).
- **Không implement từ mockup:** chip "Đã duyệt" / "Chờ bạn duyệt" ở thẻ xác nhận (chỉ dùng "Đã xác nhận …" / "Chưa xác nhận"); "(120 phút)" sau khung giờ (không có trong SRS — tuỳ chọn); chấm nhấp nháy ở badge trạng thái; ảnh avatar (API có `avatarUrl` nhưng mockup dùng ảnh mẫu).

#### S4c — Đã ghép (`CONFIRMED`)
- Badge "Đã ghép" (icon check). Banner thành công: "Kèo đã được ghép với <đội nhận kèo> lúc <confirmedAt>." + link "Xem kèo" (→ chi tiết kèo MATCH-001, hiện địa điểm, giờ, chi phí đã chốt — UC-M07 bước 6, BR-C05).
- Gói hiển thị chỉ đọc (không link sửa). Thẻ xác nhận: hai dòng "Đã xác nhận <thời điểm>".
- "Nhắn tin với <đội kia>" vẫn bật: "Hai đội tiếp tục trò chuyện trước, trong và sau trận." (BR-N05).
- Bên vừa bấm xác nhận cuối (S7 trả `CONFIRMED`) → vào thẳng S4c + toast "Đã ghép kèo".
- **Mockup:** chưa sinh được (§1).

#### S4d — Đã kết thúc (`SUPERSEDED` / `EXPIRED`, chỉ xem)
- `SUPERSEDED`: badge "Đã kết thúc"; banner trung tính "Thương lượng đã kết thúc: kèo đã được ghép với đội khác hoặc đã bị huỷ." (UC-M07 bước 7, API §1.3).
- `EXPIRED`: badge "Hết hạn" (icon đồng hồ); banner "Kèo đã hết hạn khi đang thương lượng." (UC-M09, BR-M17).
- Gói chỉ đọc (phần đã có), không nút sửa / xác nhận.
- Nút "Xem lịch sử trò chuyện" (→ chat MATCH-001 ở chế độ chỉ xem, BR-N05).
- **Mockup:** chưa sinh được (§1).

#### S4e — Gói đã thay đổi (xung đột `revision`)
- Khi chốt phương án / lưu chi phí / xác nhận trả `409 PAIRING_006`: đóng dialog đang mở, tải lại chi tiết (API §1.4), hiện banner cảnh báo `role="alert"`: "Phương án đã thay đổi, vui lòng tải lại." + dòng "Gói bên dưới là bản mới nhất. Xem lại rồi thao tác lại." (UC-M06 4b, UC-M07 2b).
- Thẻ có thay đổi gắn nhãn "Vừa thay đổi" (icon + chữ). Thẻ xác nhận về "Chưa xác nhận" cho cả hai đội (BR-M19).
- **Không** tự gửi lại; người dùng tự bấm lại.
- **Mockup:** chưa sinh được (§1).

### S5 — Chốt phương án
- **Mục đích:** chọn 1 địa điểm + 1 khung giờ trong lựa chọn của kèo (UC-M06 bước 4, BR-M19).
- **Thành phần UI chính:** desktop dialog, mobile bottom sheet.
  - Tiêu đề "Chốt phương án".
  - "Địa điểm `*`": radio list `venueOptions` theo thứ tự đội tạo kèo nhập — tên sân + địa chỉ. Địa điểm `INACTIVE`: làm mờ, disable, nhãn "Đã ngừng hoạt động" (API 2.5 `VENUE_002`, BR-M20).
  - "Khung giờ `*`": radio list `timeOptions` (giờ tăng dần) — "Thứ, dd/MM/yyyy HH:mm – HH:mm".
  - Phương án đang chốt được chọn sẵn, gắn nhãn "Đang chốt".
  - Cảnh báo (chỉ khi đã có xác nhận): "Đổi phương án sẽ xoá xác nhận của cả hai đội." (BR-M19).
  - Nút "Huỷ" / "Chốt phương án" (disable khi chưa chọn đủ hai mục).
- **Thao tác:** thành công → đóng, S4 cập nhật, toast "Đã chốt phương án". Chọn lại đúng phương án đang có → không đổi gì, đóng (API §1.4).
- **Trạng thái:** đang gửi (spinner, disable); lỗi `VENUE_002` "Địa điểm đã ngừng hoạt động" gắn vào nhóm địa điểm, giữ dialog để chọn lại (UC-M06 4a); `PAIRING_008` "Địa điểm hoặc giờ không thuộc lựa chọn của kèo" → tải lại lựa chọn; `PAIRING_006` → S4e; lỗi chung → S4.
- **Responsive / a11y:** hai `radiogroup` có `legend`; lỗi gắn `aria-describedby`.
- **Mockup:** chưa sinh được (§1).

### S6 — Chi phí & tiền cọc
- **Mục đích:** một trong hai đội trưởng nhập / sửa / xoá thoả thuận chi phí + tiền cọc + khoản tự nhập của thương lượng (UC-C01, UC-C02, BR-C05). Lưu = thay toàn bộ, xoá xác nhận của cả hai (BR-M19).
- **Thành phần UI chính:** desktop dialog rộng (~640px), mobile bottom sheet toàn màn / trang riêng.
  - "Loại chi phí": radio "Không có" · "Tiền sân" · "Tiền nước" · "Tiền sân và tiền nước" (BR-C04).
  - "Tiền sân (đ) `*`" — hiện khi có tiền sân; "Tiền nước (đ) `*`" — hiện khi có tiền nước. Ô số, định dạng nghìn.
  - "Cách chia `*`" (hiện khi có loại chi phí): radio 4 lựa chọn; "Đội thua trả toàn bộ tiền nước" disable khi không có tiền nước + chú thích (BR-C04).
  - "Khoản phí khác": danh sách dòng (tên khoản ≤ 100 ký tự · số tiền · nút xoá có `aria-label` "Xoá khoản <tên>"); nút "+ Thêm khoản phí" (UC-C02); đếm "n/10"; đủ 10 → nút disable + "Tối đa 10 khoản" (BR-C04).
  - "Tiền cọc (đ)" (không bắt buộc, để trống = không cọc); "Người giữ cọc" (≤ 100 ký tự, chỉ bật khi có tiền cọc; bộ đếm `n/100`). Chú thích "Tiền cọc không chia giữa hai đội." (BR-C05).
  - Ghi chú: "ArenaFlow không thu, giữ hay hoàn tiền. Hai đội tự thanh toán bên ngoài."
  - Cảnh báo (khi đã có xác nhận): "Lưu chi phí sẽ xoá xác nhận của cả hai đội." Luôn ghi: "Mỗi lần lưu thay toàn bộ thoả thuận cũ."
  - Nút "Huỷ" / "Lưu chi phí". Xoá hết = chọn "Không có", xoá mọi khoản, xoá tiền cọc rồi lưu.
- **Validation** (BR-C02, BR-C04, BR-C05; lỗi cạnh field, thông điệp là bản nháp UI):
  - Số tiền trống khi bắt buộc → "Vui lòng nhập số tiền"; ≤ 0 → "Số tiền phải lớn hơn 0"; > 1.000.000.000 → "Số tiền tối đa 1.000.000.000 đ".
  - Chưa chọn cách chia khi có loại chi phí → "Vui lòng chọn cách chia".
  - Tên khoản trống → "Vui lòng nhập tên khoản phí"; > 100 ký tự → "Tên khoản tối đa 100 ký tự".
  - Người giữ cọc > 100 ký tự → "Tối đa 100 ký tự"; có nội dung mà không có tiền cọc → không cho nhập (ô disable).
  - Lỗi `400 VALIDATION_ERROR` từ máy chủ → gắn vào field tương ứng; không map được → banner đầu form.
- **Trạng thái:** đang lưu (spinner, disable); thành công → đóng, toast "Đã lưu chi phí", S4 cập nhật, xác nhận hai bên về "Chưa xác nhận"; `PAIRING_006` → S4e (giữ bản nháp? — không: người dùng nhập lại theo API 2.6); lỗi chung → S4.
- **Responsive / a11y:** nhóm radio có `fieldset/legend`; ô tiền `inputmode="numeric"`; lỗi `aria-describedby`; dòng khoản phí thêm mới nhận focus.
- **Mockup:** chưa sinh được (§1).

### S7 — Xác nhận gói
- **Mục đích:** đội trưởng xác nhận đúng gói đang thấy (UC-M07 bước 1, BR-M07).
- **Thành phần UI chính:** desktop dialog, mobile bottom sheet.
  - Tiêu đề "Xác nhận gói thương lượng".
  - Tóm tắt gói: địa điểm, khung giờ, chi phí (loại, số tiền, cách chia, khoản phí khác), tiền cọc + người giữ.
  - Đoạn: "Bạn đồng ý với toàn bộ gói trên. Khi <đội kia> cũng xác nhận, kèo được ghép và các thương lượng khác của kèo kết thúc." Nếu đội kia đã xác nhận: "<Đội kia> đã xác nhận. Xác nhận của bạn sẽ ghép kèo ngay."
  - Nút "Huỷ" / "Xác nhận".
- **Thao tác:** thành công, `status = NEGOTIATING` → đóng, S4b biến thể "Đã xác nhận, chờ <đội kia>", toast "Đã xác nhận gói"; `status = CONFIRMED` → S4c.
- **Trạng thái / lỗi:** đang gửi (spinner); `PAIRING_007` "Chưa chốt địa điểm và giờ" (UC-M07 2a) → đóng, S4a; `PAIRING_006` → S4e (2b); `VENUE_002` "Địa điểm đã ngừng hoạt động" (2c) → đóng, S4 banner chốt lại địa điểm; `PAIRING_005` "Thương lượng đã kết thúc" (5a, AC-M05) → S4d; `MATCH_013` "Đội đối phương hiện không hoạt động"; `SPORT_002` "Bộ môn hiện không được hỗ trợ"; `TEAM_015` "Đội đang tạm ngưng hoạt động"; `MATCH_004` "Kèo đã hết hạn" → S4d.
- **Responsive / a11y:** như dialog S5; nút "Xác nhận" là hành động chính (không dùng màu error).
- **Mockup:** chưa sinh được (§1).

## 3. Thành phần dùng chung giữa các màn hình
- **Header ứng dụng:** theo USER-001 §3 (logo ArenaFlow, mục điều hướng, avatar + menu). Mục điều hướng giả định "Tìm kèo · Đội của tôi · Tin nhắn" — mục "Tìm kèo", "Tin nhắn" do MATCH-001 định nghĩa (`[cần xác nhận]` §4 mục 2). Mobile: hamburger + logo giữa + avatar (như USER-001).
- **Dialog / bottom sheet:** theo USER-001 §3 (desktop dialog giữa màn hình, mobile bottom sheet). Dùng ở S1, S5, S6, S7.
- **Badge trạng thái thương lượng:** 4 giá trị (§2 nhãn cố định); chữ + icon, không chỉ màu. Dùng ở S2, S3, S4.
- **Thẻ "Gói thương lượng"** (phương án + chi phí + tiền cọc): chế độ sửa được (S4a/S4b) và chỉ đọc (S4c, S4d, tóm tắt trong S7).
- **Khối đội (tên, vai trò, đội trưởng, uy tín):** S4, S2 (dạng rút gọn).
- **Thẻ / dòng thương lượng:** S2, S3.
- **Phân trang "Trước | 1 | Sau":** theo USER-001. Dùng ở S2, S3.
- **Banner realtime / cảnh báo / lỗi:** thông tin `role="status"`, lỗi và xung đột `role="alert"`.
- **Phòng chat hai đội:** tái dùng màn chat MATCH-001 (`conversationId` của thương lượng) — không vẽ ở đây.
- **Hiển thị người dùng đã xoá:** "Người dùng đã xóa" (BC-U02, API §4.2 `captainName`).
- **Theme:** project Stitch `ArenaFlow` — font Be Vietnam Pro, primary `#3d6943`, error `#a73b21`, nền `#f8faf3`, bo góc 8px. Mockup S4b mobile đã kiểm khớp theme (không cần `apply_design_system`).

## 4. `[cần xác nhận]`
> Không chặn duyệt UI (user ủy quyền 2026-11-27); cần chốt trước hoặc trong `solution-architect`. Phần thuộc hợp đồng API → đề xuất làm ở repo BE.

1. **Mockup Stitch thiếu:** chỉ S4b mobile sinh được; còn 21 bản (S1–S7 desktop + mobile, trừ S4b mobile) chưa có do Stitch MCP timeout liên tục. Cần chạy lại `ui-designer` khi Stitch ổn định để sinh và lưu `ui/`, điền screen id ở §1.
2. **Vị trí lối vào S2 và S3, mục điều hướng (v1.1 — đã đồng bộ `MATCH-001` v1.1):** S2 là trang riêng mở từ nút "Xem thương lượng" trên S10 (`MATCH-001`); S3 mở từ link "Thương lượng" trên màn "Kèo của đội" S11 (`MATCH-001`), breadcrumb "Kèo của đội › Thương lượng ghép kèo" (không thêm mục trên thanh nav chính).
3. **Danh sách "đội tôi làm đội trưởng" cho S1 và S3 (v1.1):** lấy từ API "Đội của tôi" (`USER-003` §2.5); ở S1 việc chọn đội đặt tại thẻ hành động trên S10 (`MATCH-001`) và không hiển thị điểm uy tín đội mình trong dialog S1.
4. **Một người là đội trưởng cả hai đội (BR-M18 — v1.1):** S4 hiển thị thanh chọn segmented "Thao tác với tư cách: <đội>" (mặc định đội tạo kèo) cho các thao tác S5–S7.
5. **"Đội chủ nhà" ở luồng B:** cách chia "70-30, đội chủ nhà bao 70%" (`SEVENTY_THIRTY_HOME`) — SRS không định nghĩa đội chủ nhà khi kèo chưa có sân. Đang hiển thị nguyên nhãn.
6. **S3 thiếu thông tin trận:** thương lượng rút gọn (API §4.3) không có tên sân / bộ môn; S3 chỉ hiện "Đã chốt / Chưa chốt phương án". Muốn hiện tên sân / bộ môn → cần BE bổ sung field hoặc FE gọi chi tiết kèo cho từng dòng (ảnh hưởng số API call — `non-functional-standards.md`).
7. **Không có frame realtime khi thương lượng `SUPERSEDED` / `EXPIRED` / kèo bị huỷ** (API [cần xác nhận #15]): S4 chỉ chuyển S4d khi thao tác lỗi hoặc tải lại; riêng hết hạn FE tự khoá nút theo `matchExpiresAt`.
8. **Thông điệp validation S6** và các toast / banner không có nguyên văn trong SRS là bản nháp UI; các message có nguồn: "Kèo đã hết hạn" (BR-M17), "Đội đang tạm ngưng hoạt động", "Đội đối phương hiện không hoạt động" (BR-M14), "Bộ môn hiện không được hỗ trợ" (BR-M15), "Phương án đã thay đổi, vui lòng tải lại" (BR-M19), "Địa điểm đã ngừng hoạt động" (BR-M20), "Chưa chốt địa điểm và giờ", "Thương lượng đã kết thúc" (UC-M07).
9. **Thông báo "có đội nhận kèo"** cho đội tạo kèo (UC-M05 bước 5) và thông báo superseded (UC-M07 bước 8) thuộc NOTIFICATION-001 — không vẽ.
