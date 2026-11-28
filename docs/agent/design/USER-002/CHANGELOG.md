# CHANGELOG — UI Design USER-002 Giải tán đội & quy tắc xoá tài khoản đội trưởng

## [v1.2] — 2026-11-28 · UI Design (`UI_Design.md`)

**Type:** MINOR · **Tóm tắt:** Ghi rõ thanh liên kết tính năng chỉ xem ("Kèo của đội", "Uy tín đội", "Mercenary đánh giá") trên màn S8b (chi tiết đội đã giải tán).

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Header `UI_Design.md` | Sửa | Phiên bản `v1.1` → `v1.2` (`2026-11-28`) | `design-standards.md` §10 |
| 2 | §2 S8b — Chi tiết đội đã giải tán | Thêm | Giữ 3 liên kết chỉ xem ("Kèo của đội", "Uy tín đội", "Mercenary đánh giá"); ẩn "Report của đội" và "Tuyển mercenary" | `USER-001` Screen_Flow §3 S8a, §5 #9; BR-T11 |

### Ảnh hưởng
- Không đổi mockup trong `ui/`; đồng bộ với `USER-001/UI_Design.md` v1.2.

## [v1.2] — 2026-11-27 · Thiết kế kỹ thuật (Screen_Flow, Component_Design, State_API_Integration)

**Type:** MINOR · **Tóm tắt:** Type `Team` → `TeamDetail` shared (REPUTATION-001 C10); cột (C) ngưỡng + chấm "Tin nhắn" (MATCH-001 C2).

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | State_API_Integration §1 | Sửa | (C): S8b 5→6, S13 4→5, S14 5→6 | MATCH-001 C2 |
| 2 | State_API_Integration §2, Component_Design §2 | Sửa | `Team` → `TeamDetail` (`src/shared/types/team-detail.type.ts`) | REP C10 |
| 2b | State_API_Integration §2 | Sửa | Field giải tán của `TeamDetail` khai ở file shared, không ở `team.type.ts` | Review chéo |
| 3 | Screen_Flow | Chỉ tăng phiên bản | — | Giữ phiên bản ba tài liệu đồng bộ |

## [v1.1] — 2026-11-27 · Thiết kế kỹ thuật (Screen_Flow, Component_Design, State_API_Integration)

> Phiên bản của ba tài liệu kỹ thuật tách khỏi phiên bản `UI_Design.md` (các entry "UI Design" bên dưới). Baseline kỹ thuật `v1.0` — 2026-11-27.

**Type:** MINOR · **Tóm tắt:** Áp USER-003 `Screen_Flow.md` §6 C20, C21 và cách tính ngưỡng có huy hiệu lời mời.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow S5 "Link", §5 #1 | Sửa / Đóng | Path chờ USER-003 → `buildMyTeamsPath({ role: 'CAPTAIN' })` | USER-003 C20 |
| 2 | State_API_Integration §3 bước 3, §7 #2 | Sửa / Đóng | Key "Đội của tôi" chờ USER-003 → `teamKeys.mine()` | USER-003 C21 |
| 3 | State_API_Integration §1 | Sửa | Cột (B)/(C) cộng huy hiệu lời mời: S8b 4/5, S13 3/4, S14 4/5 | USER-003 C4 |
| 4 | Component_Design | Chỉ tăng phiên bản | — | Giữ phiên bản ba tài liệu đồng bộ |

### Ảnh hưởng
- Cần `architect-reviewer` cho phần sửa.

## [v1.1] — 2026-11-27

**Type:** MINOR (không đổi route, không xoá màn hình, không đổi khung app) · **Tóm tắt:** Rà UI theo `ArenaFlow-spec@53aee11` (từ `@267af5e`): vẽ lại S14 cho người dùng đã xoá ở màn Admin, cập nhật S5 dùng chung, ghi quy ước giờ Việt Nam và lỗi field từ BE.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Header `UI_Design.md` | Sửa | Căn cứ `@267af5e` → `@53aee11`; v1.0 → v1.1; trạng thái duyệt 2026-11-27 (user duyệt trước) | Spec tăng phiên bản |
| 2 | S14 (desktop + mobile) — vẽ lại | Sửa | Thành viên đã xoá tài khoản: "Người dùng đã xóa" + avatar mặc định → tên thật + ảnh thật + nhãn "Đã xoá tài khoản" theo `isUserDeleted`. Desktop: screen id `f58f397a…` → `a11aac01…`. Mobile: giữ id `871dff6c…`, file `ui/` sửa cục bộ (xem `UI_Design.md` §4 mục 3) | API USER-002 v2.0, v3.0; BC-U02 SYSTEM-001 v1.7; USER-002 AC §5 mục 5 (sửa) |
| 3 | S5 (dùng chung với USER-001) | Sửa | Banner bị chặn thêm link "Xem các đội bạn đang làm đội trưởng →"; thêm câu đơn ứng tuyển mercenary tự rút. Screen id mới: xem `USER-001/CHANGELOG.md` v1.1 | API USER-002 v3.1 (`USER_003` → USER-003 §2.5); BR-ME18 |
| 4 | S13 (chỉ tài liệu) | Thêm | Người giải tán / đội trưởng đã xoá: tên thật + nhãn theo cờ | API USER-002 v3.0 §2.6 |
| 5 | S8b | Ghi nhận | Giữ "Người dùng đã xóa" — màn người dùng thường (endpoint thường vẫn che) | USER-002 AC §5 mục 5 (sửa) |
| 6 | S12, S14 | Thêm | Lỗi `reason` sai kiểu gắn vào ô lý do; ngày giờ hiển thị nguyên giá trị giờ Việt Nam | API USER-002 v4.0; SYSTEM-002 |
| 7 | §4 `[cần xác nhận]` | Thêm | Mục 3: S14 mobile trên Stitch chưa đồng bộ | Stitch timeout |

### Ảnh hưởng
- Giữ nguyên: S8b, S12, S13 (ảnh/HTML không đổi).
- Khung app không đổi.
