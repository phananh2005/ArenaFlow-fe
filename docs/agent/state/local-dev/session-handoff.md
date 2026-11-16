---
dev: local-dev
saved: 2026-11-11 23:34
task: Thiết kế USER-001 + USER-002 — Bước 5 solution-architect (sau ui-designer đã duyệt)
status: in_progress — solution-architect Bước 1 (kiểm tra lệch) đang DỪNG chờ user chọn
---

> Lưu ý: `current-task.md` / `progress.md` vẫn là của task cũ "Đọc SRS/API_Spec/ADR qua submodule ArenaFlow-spec"
> (đã merge qua PR #6/#7). Việc đang làm là thiết kế, chưa implement → chưa chạy `task-state-init`;
> snapshot này là nguồn đúng.

## Đang làm dở
- Task: procedure `solution-architect` cho USER-001 + USER-002.
  - Bước 0 (chọn nhánh) xong: `feature/USER-001-user-team`, đã rebase `origin/main` @ 316038d (không có commit mới), chưa push.
  - Bước 1: kiểm tra lệch tài liệu BE → **CÓ LỆCH** → đã dừng, hỏi user (chưa trả lời).
- Commit trên nhánh feature: `f94fe39 docs(USER-001): UI_Design + mockup …`, `489a726 docs(USER-002): UI_Design + mockup …`.
- Việc phụ đã xong phiên này: nhánh `chore/agent-framework-design-index` (từ `origin/main` @ 316038d), commit
  `f3d6303 chore(agent-framework): thêm đường dẫn design USER-001/USER-002 vào mục lục` (`docs/agent/CLAUDE.md` §2). Chưa push.

## File đang sửa (git status lúc handoff)
- _không có_ (working tree sạch, trên `feature/USER-001-user-team`)

## Quyết định / context quan trọng
- Kết quả kiểm tra lệch: con trỏ `docs/agent/upstream` @ `267af5e`; `origin/main` của ArenaFlow-spec có thêm `5ed5334` (BE@c3f705c), `da0a8c3` (BE@ddff4bd).
  - `api/USER-001` (v3.7), `api/USER-002` (v1.8): **không đổi**.
  - SRS `SYSTEM-001`: chỉ sửa UC-M02, M05–M09, UC-C01, UC-N01/N03, thêm BR-M19/M21, BR-C05, BR-N03 (luồng B, chat, cọc) — không đụng UC-U/T/A, BR-U/T.
  - `api-convention.md`: thêm mã lỗi `PAIRING_*`, `CHAT_001`, `MATCH_016`; thêm §7.2 phân trang cursor (chỉ chat); danh sách USER vẫn offset §7.1.
  - ADR 0003/0011 sửa, ADR 0014 mới (`Proposed`, chat STOMP) — đều thuộc Match.
  - MATCH-001 v2.1, MATCH-002 v1.1 (mới), VENUE-001 v1.3.
  - [Inference] lọc diff theo mã UC/BR + từ khoá → không ảnh hưởng USER-001/002.
- Đề xuất đã trình (chờ user chọn):
  1. (đề xuất) Cập nhật con trỏ lên `da0a8c3` — commit riêng `docs(spec): đồng bộ ArenaFlow-spec lên da0a8c3` trên nhánh feature; thiết kế FE ghi `Căn cứ: ArenaFlow-spec@da0a8c3`.
  2. Giữ `267af5e`, thiết kế trên bản cũ.
- Thứ tự merge: PR `chore/agent-framework-design-index` trỏ tới `docs/agent/design/USER-00{1,2}/` chỉ có trên nhánh feature → nên merge PR feature trước (hoặc cùng lúc).
- Tài liệu UI đã duyệt: `docs/agent/design/USER-001/UI_Design.md` (S1–S11, S13, `ui/` 52 file), `docs/agent/design/USER-002/UI_Design.md` (S5, S8b, S12–S14, `ui/` 12 file); cả hai ghi căn cứ `ArenaFlow-spec@267af5e`.
- Stitch project `ArenaFlow` (`2789586751825382546`); 4 màn thừa đang ẩn (chưa xoá): `00f30e5e`, `f6132c50`, `810f22fb`, `2435c20d`.

## Blockers
- Chờ user chọn phương án lệch spec (1 hoặc 2) trước khi đọc tiếp context Bước 1.
- `[cần xác nhận]` để chốt trong solution-architect (gom ở §4 hai UI_Design):
  - USER-001: (1) nguồn lời mời — chưa có API "lời mời của tôi"; (2) mời bằng ID/username nhưng API nhận `userId`; (3) chưa có API phường/xã; (4) upload avatar/logo (API chỉ nhận URL; lưu ý ADR BE 0009 Cloudinary signed upload); (5) "Đội của tôi" vs API 2.10 trả mọi đội; (6) OTP gửi lại/đếm ngược; (7) màn sửa thông tin đội (dự kiến dùng lại S7).
  - USER-002: (1) kèo/trận khi giải tán; (2) thứ tự sắp xếp lịch sử.

## Việc tiếp theo
- [ ] Nhận lựa chọn của user về lệch spec; nếu (1): `git submodule update --remote docs/agent/upstream` → commit riêng `docs(spec): …`.
- [ ] `solution-architect` Bước 1 (tiếp): đọc SRS SYSTEM-001 (phần USER) + USER-002, API_Spec USER-001/002 + CHANGELOG, api-convention, ADR BE, design-standards, convention/security/non-functional FE, ADR FE, `docs/agent/design/_template/`.
- [ ] Bước 2: chốt phạm vi + danh sách màn + endpoint → cổng duyệt phạm vi với user.
- [ ] Bước 3–4: sinh Screen_Flow / Component_Design / State_API_Integration → tự kiểm → gợi ý `architect-reviewer`.
- [ ] Push / tạo PR (2 nhánh) khi user yêu cầu — diff chỉ tài liệu → miễn `code-reviewer`.
