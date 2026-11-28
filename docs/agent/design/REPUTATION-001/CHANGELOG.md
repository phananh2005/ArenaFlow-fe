# CHANGELOG — REPUTATION-001 thiết kế kỹ thuật FE

> Lịch sử của `Screen_Flow.md`, `Component_Design.md`, `State_API_Integration.md` (`design-standards.md` §10). `UI_Design.md` giữ phiên bản riêng (v1.0). Baseline v1.0 (2026-11-27) không có entry.

## [v1.2] — 2026-11-27

**Type:** MINOR (chốt trạng thái phụ thuộc, không đổi hợp đồng) · **Tóm tắt:** Ghi nhận SHARED v1.2 đã có `FeatureSlotsProvider` / `useFeatureSlot` và ghi props slot theo file `<mã>-slots.type.ts`.

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | State §7 #2; Screen_Flow §6 C2, §7 #2; Component_Design §8 #2 | Sửa | "SHARED chưa có `FeatureSlotsProvider`" → đã có ở SHARED v1.2; #2 chỉ còn ADR-0010 `Proposed` chặn; C2 không còn chặn | Review chốt |
| 2 | FE ADR-0010 "Liên quan", Bối cảnh, mục 8 | Sửa | SHARED v1.1 → v1.2 (thêm provider / hook, `<mã>-slots.type.ts`) | Review chốt |
| 3 | Header 3 tài liệu | Ghi nhận | v1.1 → v1.2 | §10 |

**Ảnh hưởng:** không đổi route, props slot, query key. Chặn code còn lại: State_API_Integration §7 #1, #2, #3.

## [v1.1] — 2026-11-27

**Type:** MINOR (thêm tham số / slot tuỳ chọn, chuyển type / util lên `shared/` cùng shape, chốt `[cần xác nhận]`; không đổi route, props slot đã công bố hay query key) · **Tóm tắt:** Áp các mục nhắm vào REPUTATION-001 trong §6 của MERCENARY-001 (C5–C8) và MATCH-001 (C11); MATCH-002 §6 không có mục cho REPUTATION-001.

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Component_Design §3, §5 | Chuyển | `useNowMs`, `isDisputeOpen` trong module `reputation` → `src/shared/hooks/use-now-ms.hook.ts`, `src/shared/utils/dispute-window.util.ts` (`isDisputeOpen(r: { canDispute; disputeDeadlineAt }, nowMs)`) | MERCENARY-001 C5 (S10, S17 dùng cùng logic) |
| 2 | Component_Design §3, §6, §6.1 | Chuyển | `SlotTeamRef` ở `reputation-slots.type.ts`, `viewer` khai inline → `SlotTeamRef` + `SlotMatchViewer` ở `src/shared/types/feature-slots.type.ts`; `MatchReputationSectionProps.viewer: SlotMatchViewer` (cùng shape) | MERCENARY-001 C6 |
| 3 | Screen_Flow §1, S6, §2; Component_Design §2 `TeamReportsPage`, §6.4 (mới); State §1, §3.1 | Thêm | S6 có `scope` ∈ `team` (mặc định) \| `mercenary`; `scope=mercenary` render slot `teamMercenaryReportsPanel` (`teamId`, `direction`, `page`, `onPageChange`), không gọi 2.4; `buildTeamReportsPath` thêm `scope?` | MERCENARY-001 C7; đóng `[cần xác nhận]` #10 |
| 4 | Component_Design §3 | Ghi nhận | MERCENARY-001 dùng chung nhãn + component report / sao / mức uy tín | MERCENARY-001 C8 |
| 5 | Component_Design §6.1; State §7 #5; Screen_Flow §6 C7 | Chốt | Hợp đồng `matchReputationSection`, `conversationReportDialog` "chờ MATCH-001" → MATCH-001 chấp nhận; nguồn vai trò `myTeamsKey({ role: null, page: 1, pageSize: 100 })` lọc `CAPTAIN` (thay đề xuất `role=CAPTAIN`); #5 không còn chặn ở phía hợp đồng | MATCH-001 C11 |
| 6 | Screen_Flow S3, S5, §2, §5 | Sửa | Đích "chi tiết kèo" / "phòng chat" chưa có hằng → `buildMatchDetailPath(matchId)`, `/conversations/:conversationId` (MATCH-001 Screen_Flow §1) | MATCH-001 đăng ký route |
| 7 | Screen_Flow §6 | Thêm / Sửa | + C11 (SHARED: `useNowMs`, `isDisputeOpen`, `SlotTeamRef`, `SlotMatchViewer`); C7, C8 → "đã áp ở MATCH-001 / MERCENARY-001" | Đồng bộ danh sách đổi |
| 8 | Header 3 tài liệu | Ghi nhận | v1.0 → v1.1 | §10 |

**Ảnh hưởng:** không đổi route public, props slot của REPUTATION-001 hay query key. Code: `useNowMs`, `isDisputeOpen`, `SlotTeamRef`, `SlotMatchViewer` tạo ở `shared/` (mã code trước tạo, `reuse-scan`). Chặn code còn lại: State_API_Integration §7 #1, #2, #3.
