---
dev: local-dev
saved: 2026-11-28 01:35
task: Thiết kế UI/UX và thiết kế kỹ thuật FE cho 9 mã đủ điều kiện thực hiện (ArenaFlow-spec@53aee11)
status: in_progress — đã xong UI_Design + thiết kế kỹ thuật + architect-reviewer cả 9 mã trên 8 worktree; chờ user chọn bước tiếp theo
---

> Lưu ý: `current-task.md` / `progress.md` vẫn là của task cũ "Đọc SRS/API_Spec/ADR qua submodule ArenaFlow-spec"
> (đã merge). Việc đang làm là thiết kế (chưa qua `task-state-init`); file `session-handoff.md` này là nguồn đúng.

## Đang làm dở
- Task: Hoàn thành thiết kế UI/UX và thiết kế kỹ thuật FE cho toàn bộ 9 mã đủ điều kiện thực hiện (`USER-001`, `USER-002`, `USER-003`, `VENUE-001`, `NOTIFICATION-001`, `REPUTATION-001`, `MERCENARY-001`, `MATCH-001`, `MATCH-002`, kèm `SYSTEM-002` trong SHARED/ADR-0008).
- Repo chính đang ở `main` (`4f92c72`, đã squash-merge PR #12 đồng bộ `ArenaFlow-spec@53aee11`).
- 8 nhánh feature nằm trên 8 worktree trong `.claude/worktrees/<MÃ>` (chưa commit phần thiết kế mới theo yêu cầu của user, đẩy qua `refs/wip/<nhánh>`):
  - `feature/USER-001-user-team`: 2 commit UI đã rebase lên `4f92c72` + cập nhật `UI_Design.md` (S5 USER-001, S14 USER-002) + thiết kế kỹ thuật v1.2 cho `USER-001`, `USER-002`, `SHARED/APP-SHELL` + FE ADR `0002`–`0008` (Proposed).
  - `feature/USER-003-lookup`: `UI_Design.md` (mockup 2/8) + thiết kế kỹ thuật v1.1.
  - `feature/VENUE-001-venue`: `UI_Design.md` (mockup 2/22) + thiết kế kỹ thuật v1.2 + FE ADR `0009` (Leaflet), `0016` (upload Cloudinary trực tiếp).
  - `feature/NOTIFICATION-001-notification`: `UI_Design.md` (mockup 8/8) + thiết kế kỹ thuật v1.3.
  - `feature/REPUTATION-001-reputation`: `UI_Design.md` (mockup 15/20) + thiết kế kỹ thuật v1.2 + FE ADR `0010` (feature slots nhúng chéo module).
  - `feature/MERCENARY-001-mercenary`: `UI_Design.md` (mockup 1/42) + thiết kế kỹ thuật v1.3 + `docs/agent/state/local-dev/decisions-log.md`.
  - `feature/MATCH-001-match-flow-a`: `UI_Design.md` (mockup 10/30) + thiết kế kỹ thuật v1.1 (gồm module `match` và module `chat`).
  - `feature/MATCH-002-match-flow-b`: `UI_Design.md` (mockup 1/22) + thiết kế kỹ thuật v1.1.

## File đang sửa (git status lúc handoff)
- Worktree gốc (`main`): `M .gitignore` (thêm `.claude/worktrees/`), `M docs/agent/state/local-dev/session-handoff.md`
- `feature/USER-001-user-team`: `M docs/agent/design/USER-00{1,2}/UI_Design.md`, `ui/` (S5, S14), `?? docs/agent/design/{USER-001,USER-002,SHARED/APP-SHELL}/{Screen_Flow,Component_Design,State_API_Integration,CHANGELOG}.md`, `?? docs/agent/decisions/0002..0008-*.md`
- `feature/USER-003-lookup`: `?? docs/agent/design/USER-003/`
- `feature/VENUE-001-venue`: `?? docs/agent/design/VENUE-001/`, `?? docs/agent/decisions/{0009,0016}-*.md`
- `feature/NOTIFICATION-001-notification`: `?? docs/agent/design/NOTIFICATION-001/`
- `feature/REPUTATION-001-reputation`: `?? docs/agent/design/REPUTATION-001/`, `?? docs/agent/decisions/0010-*.md`
- `feature/MERCENARY-001-mercenary`: `?? docs/agent/design/MERCENARY-001/`, `M docs/agent/state/local-dev/decisions-log.md`
- `feature/MATCH-001-match-flow-a`: `?? docs/agent/design/MATCH-001/`
- `feature/MATCH-002-match-flow-b`: `?? docs/agent/design/MATCH-002/`

## Quyết định / context quan trọng
- Spec BE đã đồng bộ lên `ArenaFlow-spec@53aee11` trên `main` (`4f92c72`, PR #12).
- User chọn làm trọn gói UI + thiết kế kỹ thuật cả 9 mã (coi như đã duyệt UI và phạm vi), không commit trên nhánh feature, dùng worktree.
- Stitch project `ArenaFlow` (`2789586751825382546`): do Stitch MCP timeout liên tục nên phần lớn mockup chưa tải đủ; đặc tả chữ trong `UI_Design.md` là nguồn chuẩn.
- Đã qua `architect-reviewer` từng mã + sửa findings + review chốt nhất quán chéo giữa 8 worktree (key TanStack Query dùng chung ở `shared/constants`, chữ ký `stompClient.subscribe(dest, onFrame, { onError?, onReady?(epoch) })`, slot registry ADR-0010, quy ước 3 cách tính A/B/C cho ngưỡng ≤ 3 API call/màn) → 0 CRITICAL / 0 MAJOR còn lại.
- Toàn bộ 8 nhánh feature đã rebase lên `origin/main` (`4f92c72`), con trỏ `docs/agent/upstream` đồng nhất ở `53aee11`.

## Blockers
- 10 điểm chặn code cần user / BE quyết trước khi implement:
  1. Chốt FE ADR 0002–0008 và merge nhánh `feature/USER-001-user-team` trước.
  2. Chốt FE ADR-0010 (cơ chế slot nhúng chéo module).
  3. Ngưỡng ≤ 3 API call/màn có tính các request của khung app (hồ sơ, số thông báo chưa đọc, huy hiệu lời mời, chấm "Tin nhắn") hay không.
  4. Phòng chat theo đơn mercenary (MATCH-001/MERCENARY-001) và mở thẳng link S4 của MATCH-002 vượt ngưỡng ≤ 3 call ngay cả khi chỉ tính call của màn.
  5. Timeout upload ảnh 120s (vượt mức chung 15s) ở VENUE-001.
  6. Nguồn icon và font cho khung app.
  7. MERCENARY-001 API 2.2 lọc theo `externalMatchId`: chấp nhận lọc client hay nhờ BE thêm bộ lọc.
  8. Nhà cung cấp tile bản đồ cho production (VENUE-001 — chặn phát hành).
  9. Đích điều hướng của thông báo `REPORT`: BE cần thêm `teamId` (REPUTATION-001, NOTIFICATION-001).
  10. Luồng B (MATCH-002) chưa định nghĩa "đội chủ nhà" trong SRS nên cách chia "70-30" chưa rõ nghĩa.

## Việc tiếp theo
- [ ] Chọn việc làm tiếp: (1) chốt 10 điểm chặn code trong bảng trên, (2) cập nhật `UI_Design.md` qua `ui-designer` cho các điểm bổ sung từ thiết kế kỹ thuật (link ở USER-001 S3/S8a, mục "Tin nhắn" trên header, badge + link thương lượng ở MATCH-001 S13/S8/S11, MATCH-002 C10), hoặc (3) sinh bù mockup Stitch tuần tự.
- [ ] Thêm dòng chỉ mục `docs/agent/design/<MÃ>/` vào `docs/agent/CLAUDE.md` §2 khi commit từng nhánh.
- [ ] Tuỳ chọn: xoá nhánh `docs/spec-sync-20261127` (đã merge qua PR #12) khi user yêu cầu.
