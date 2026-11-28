# CHANGELOG — MERCENARY-001 thiết kế kỹ thuật

> Phiên bản của `Screen_Flow.md`, `Component_Design.md`, `State_API_Integration.md`. `UI_Design.md` có phiên bản riêng (v1.0, chưa đổi). Baseline v1.0 = bản đầu + sửa sau `architect-reviewer` vòng 1 (2026-11-27).

## [v1.3] — 2026-11-27

**Type:** MINOR (sửa tham chiếu / ghi chú) · **Tóm tắt:** Theo review chốt: trỏ SHARED v1.2, cập nhật #2, ghi chú bộ chọn sân trùng MATCH-001.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Header 3 tài liệu; State `[cần xác nhận]` #1 | Sửa | SHARED/APP-SHELL v1.1 → v1.2 | SHARED v1.2 |
| 2 | State `[cần xác nhận]` #2 | Sửa | "`FeatureSlotsProvider` chưa có ở SHARED" → đã có ở SHARED v1.2, chỉ còn FE ADR-0010 chặn | SHARED v1.2 |
| 3 | Component_Design §2 `VenuePickerDialog`; State #24 | Sửa | Ghi chú cân nhắc đưa phần trình bày lên `shared/` khi `reuse-scan` | Trùng MATCH-001 |

### Ảnh hưởng
- Chưa có code → không ảnh hưởng `src/`.

## [v1.2] — 2026-11-27

**Type:** MINOR (chốt `[cần xác nhận]`, chỉ đổi tham chiếu) · **Tóm tắt:** Đồng bộ SHARED v1.2 — realtime `subscribe(dest, onFrame, { onError?, onReady? })` và đề xuất thứ tự nav.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Component_Design §5 `useApplicationRealtime`, §6.2; State_API_Integration §4.2 | Sửa | Trỏ MATCH-001 C16 → trỏ SHARED State_API_Integration §6 v1.2 (không mô tả lại hợp đồng) | SHARED v1.2 |
| 2 | Screen_Flow §6 C4 | Chốt | Chặn code → đã áp ở SHARED v1.2 | SHARED v1.2 §6 |
| 3 | `[cần xác nhận]` #4 (3 tài liệu) | Chốt | Bỏ phần realtime; còn ngưỡng phòng chat (MATCH-001 #4) | SHARED v1.2 §6 |
| 4 | Screen_Flow §1 nav, `[cần xác nhận]` #15 | Sửa | `order` 40 / 45 → 50 / 55 | SHARED Screen_Flow §6 #5 |

### Ảnh hưởng
- Chưa có code → không ảnh hưởng `src/`.

## [v1.1] — 2026-11-27

**Type:** MINOR (chốt `[cần xác nhận]`, đổi nơi khai key / util sang `shared/`, thêm tham số `onReady` khi dùng realtime; không đổi route public, props slot hay store toàn cục) · **Tóm tắt:** Áp các thay đổi MATCH-001 (Screen_Flow §6 C3, C5, C7, C12, C16) nhắm vào MERCENARY-001 trong vòng lặp design đợt 2; REPUTATION-001 §6 (C8) và MATCH-002 §6 không có mục mới cần áp.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow §1 "Path của mã khác" | Sửa | `buildConversationPath`, `buildMatchDetailPath` "MATCH-001 chốt #4, #5" → đã chốt `/conversations/:conversationId`, `/matches/:matchId` | MATCH-001 Screen_Flow §1, C12 |
| 2 | Screen_Flow §6 C4, C11 | Sửa | C4 ghi trùng MATCH-001 C7 (áp một lần) + `onReady(epoch)` (C16); C11 → "đã áp" | MATCH-001 C7, C12, C16 |
| 3 | Component_Design §5 `formatMatchTimeRange` | Sửa | Util trong module → dùng SHARED `vn-datetime` | MATCH-001 C5 |
| 4 | Component_Design §5 `useApplicationRealtime`, §6.1, §6.2 | Sửa | Thêm `onReady`; ghi phía host đã chốt (`toSlotApplicationStatus`, `viewerSide`, `hasMessages`, vị trí, `Suspense`) | MATCH-001 Component_Design §7, C16 |
| 5 | State_API_Integration §1 (S19), §4.2, §5.12 | Sửa | 2.10 tải sau `onReady` đầu tiên (dự phòng 3 s); bù bằng `onReady` epoch mới thay `onReconnected` | MATCH-001 C16, State §4.4 |
| 6 | State_API_Integration §3.1 | Sửa | `venuePickerKey` khai trong module → dùng bản `shared/` (`venue-picker-query-key.constant.ts`) | MATCH-001 C3 |
| 7 | `[cần xác nhận]` #4, #5, #15, #21 (3 tài liệu) | Chốt / sửa | #5, #21 đóng; #4 chỉ còn realtime (C4/C16) + ngưỡng phòng chat (MATCH-001 #4); #15 đề xuất `order` 40 / 45 | MATCH-001 C5, C12, Screen_Flow §1 nav |

### Ảnh hưởng
- Chưa có code → không ảnh hưởng `src/`.
- Còn chờ REPUTATION-001 áp MERCENARY-001 Screen_Flow §6 C5, C6, C7 (`useNowMs` / `isDisputeOpen` lên `shared/`, `SlotMatchViewer`, slot `teamMercenaryReportsPanel`) — `[cần xác nhận]` #6 giữ **Có**.
