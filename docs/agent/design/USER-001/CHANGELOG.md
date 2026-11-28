# CHANGELOG — UI Design USER-001 Tài khoản & đội

## [v1.2] — 2026-11-28 · UI Design (`UI_Design.md`)

**Type:** MINOR · **Tóm tắt:** Bổ sung liên kết sang các tính năng khác ở S3 ("Uy tín mercenary của tôi"), S8a (5 liên kết tính năng đội) và mô tả mục "Tin nhắn" trên header ứng dụng dùng chung theo thiết kế kỹ thuật v1.2.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Header `UI_Design.md` | Sửa | Phiên bản `v1.1` → `v1.2` (`2026-11-28`) | `design-standards.md` §10 |
| 2 | §2 S3 — Hồ sơ cá nhân | Thêm | Bổ sung link "Uy tín mercenary của tôi" → S18 `MERCENARY-001` | `MERCENARY-001` Screen_Flow §6 C10; `USER-001` Screen_Flow §3 S3 |
| 3 | §2 S8a — Chi tiết đội | Thêm | Bổ sung thanh 5 liên kết tính năng đội ("Kèo của đội", "Uy tín đội", "Report của đội", "Tuyển mercenary", "Mercenary đánh giá") kèm điều kiện hiển thị theo vai trò & trạng thái đội | `MATCH-001` C10; `REPUTATION-001` C3; `MERCENARY-001` C9; `USER-001` Screen_Flow §3 S8a |
| 4 | §3 Header ứng dụng | Sửa | Ghi rõ các mục điều hướng khi ghép vào khung chung (`SHARED/APP-SHELL` v1.2), gồm mục "Tin nhắn" kèm chấm đỏ chưa đọc (desktop nav + mobile header icon) và chuông thông báo | `MATCH-001` C4; `SHARED/APP-SHELL` v1.2 |
| 5 | §4 `[cần xác nhận]` #9, #10, #11 | Sửa / Thêm | Chốt #9 (nhãn "mercenary"), #10 (đích link S5 `/me/teams?role=CAPTAIN`); thêm #11 ghi nhận S3/S8a giữ nguyên mockup v1.0 | Đồng bộ `USER-003` và `MERCENARY-001` |

### Ảnh hưởng
- Không đổi mockup trong `ui/`; khớp với `Screen_Flow.md` v1.2.

## [v1.2] — 2026-11-27 · Thiết kế kỹ thuật (Screen_Flow, Component_Design, State_API_Integration)

**Type:** MINOR · **Tóm tắt:** Áp REPUTATION-001 §6 C3, C10; MERCENARY-001 §6 C3, C9, C10; MATCH-001 §6 C9, C10; khung SHARED v1.2 (chấm "Tin nhắn" vào cột (C)).

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow S3, S8a, §4, §5 #9 | Thêm | Link "Uy tín mercenary của tôi" (S3); 5 link S8a ("Kèo của đội", "Uy tín đội", "Report của đội", "Tuyển mercenary", "Mercenary đánh giá"); nav Admin "Quản lý đội" `order 10`; `[cần xác nhận]` UI chưa vẽ | MERC C9, C10; REP C3; MATCH-001 C10 |
| 2 | Component_Design §2 (bảng + ghi chú cuối §2.2), §4 | Sửa | `SkillLevelTags` → `shared/`; `PREFERRED_POSITIONS`, `SKILL_LEVELS` → `PLAYER_POSITIONS`, `SKILL_LEVELS` shared | MATCH-001 C9; MERC C3 |
| 3 | State_API_Integration §2, §3.1, §3.2 | Sửa | `Team` → `TeamDetail` shared, `queryFn` trả nguyên; `teamKeys.detail = teamDetailKey`; bước 4 dùng `myTeamsKey` | REP C10; MATCH-001 C3 |
| 4 | State_API_Integration §1, §7 #3 | Sửa | Cột (C) + "Tin nhắn": thêm S3, S4, S7 vào danh sách chặn | MATCH-001 C2 |

### Ảnh hưởng
- Cần `architect-reviewer` phần sửa; `ui-designer` cập nhật S3, S8a (link mới).

## [v1.1] — 2026-11-27 · Thiết kế kỹ thuật (Screen_Flow, Component_Design, State_API_Integration)

> Phiên bản của ba tài liệu kỹ thuật tách khỏi phiên bản `UI_Design.md` (các entry "UI Design" bên dưới). Baseline kỹ thuật `v1.0` — 2026-11-27.

**Type:** MINOR (không đổi route, không đổi store toàn cục, không đổi props component dùng chung của mã này) · **Tóm tắt:** Áp thay đổi USER-003 `Screen_Flow.md` §6 C5–C19 và cách tính ngưỡng có huy hiệu lời mời.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow S4, S6, S9, §5 #8 | Sửa | Chỗ cắm USER-003 "chặn code" → trỏ thiết kế USER-003 v1.0 (C5–C8); còn chặn tới khi v1.1 qua review | USER-003 C5–C8 |
| 2 | Component_Design ghi chú đầu, cây §1, §2.1, §2.2 `InviteMemberDialog`, §3.2, §5 breadcrumb | Sửa | `WardPicker` chuyển lên `shared/`; S9 giữ `selectedUserId`, lỗi dưới danh sách; form có `provinceId` (chỉ UI); breadcrumb → `ROUTE_PATHS.myTeams` | USER-003 C9–C12 |
| 3 | State_API_Integration §1 | Sửa | S4 ≤ 3 → 0–1 (danh mục tải khi mở ô); bảng (A)/(B)/(C) tính thêm huy hiệu lời mời | USER-003 C13, C4 |
| 4 | State_API_Integration §3.1, §3.2 | Sửa | Key USER-003 chốt; thêm 2.11 vào invalidate `mine`; bước 4 vai trò dùng `useMyTeams` | USER-003 C14, C15 |
| 5 | State_API_Integration §5 (2.6 `USER_002`, 2.12 `USER_001` / `TEAM_003`, 2.13–2.14 `TEAM_015`) | Sửa | Hành vi lỗi theo USER-003 | USER-003 C16–C19 |
| 6 | State_API_Integration §7 #2 | Đóng | Ngưỡng S4 | USER-003 C13 |

### Ảnh hưởng
- Cần `architect-reviewer` cho phần sửa; các phần phụ thuộc USER-003 còn chặn code tới khi review xong.

## [v1.1] — 2026-11-27

**Type:** MINOR (không đổi route, không xoá màn hình, không đổi khung app) · **Tóm tắt:** Rà UI theo `ArenaFlow-spec@53aee11` (từ `@267af5e`): vẽ lại S5, ghi quy tắc hiển thị người dùng đã xoá ở màn Admin, quy ước giờ Việt Nam, và trỏ các phần đã chuyển sang USER-003.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Header `UI_Design.md` | Sửa | Căn cứ `@267af5e` → `@53aee11`; v1.0 → v1.1; trạng thái duyệt 2026-11-27 (user duyệt trước) | Spec tăng phiên bản |
| 2 | S5 (desktop + mobile) — vẽ lại | Sửa | Thêm câu "Các đơn ứng tuyển mercenary đang chờ hoặc đã được duyệt của trận chưa bắt đầu sẽ tự rút, không bị trừ điểm uy tín"; banner bị chặn thêm link "Xem các đội bạn đang làm đội trưởng →". Screen id `6205afa1…`/`58ae9dea…` → `bdf6f001…`/`f211b8df…` | SRS UC-U03 post + BR-ME18 (API USER-001 v4.1); API USER-002 v3.1 `USER_003` → "Đội của tôi" (USER-003 UC-T08 1a) |
| 3 | S13 (chỉ tài liệu) | Thêm | Đội trưởng / người giải tán đã xoá tài khoản: tên thật + nhãn "Đã xoá tài khoản" theo cờ `isCaptainDeleted` / `isDisbandedByDeleted`. Mockup không vẽ lại | BC-U02 SYSTEM-001 v1.7; API USER-001 v4.0 (`AdminTeamResponse`, `AdminTeamSummaryResponse`) |
| 4 | §3 Thành phần dùng chung | Sửa | "Hiển thị người dùng đã xoá" tách màn thường / màn Admin; thêm quy ước ngày giờ Việt Nam | BC-U02 v1.7; SYSTEM-002 v1.2 (API USER-001 v5.0) |
| 5 | S4 | Sửa | Ghi lỗi field từ BE trả đúng tên field; ô "Khu vực" trỏ sang USER-003 | API USER-001 v5.0 §1.2; SRS UC-U02 bước 3 (UC-U04) |
| 6 | S6, S9 | Sửa | Khối lời mời và ô mời theo ID/username trỏ sang USER-003 (mockup giữ nguyên) | SRS UC-T02, UC-T03 (v1.12) |
| 7 | S10, S13 | Ghi nhận | Thông báo: chuyển quyền chỉ báo đội trưởng mới; khoá / kích hoạt lại báo đội trưởng, không kèm lý do. Không đổi mockup | SRS UC-T04 bước 6, UC-T05 bước 6 + A1 |
| 8 | §4 `[cần xác nhận]` | Sửa | Mục 1, 2, 3, 5 chuyển sang USER-003; thêm mục 8 (câu "Người dùng đã xóa" ở S5), 9 (nhãn "mercenary"), 10 (nhãn / đích link ở S5) | Như trên |

### Ảnh hưởng
- Giữ nguyên: S1, S2a, S2b, S3, S4, S6, S7, S8a, S9, S10, S11, S13 (ảnh/HTML không đổi).
- Khung app (header, điều hướng, layout desktop + mobile 390px) không đổi.
- Thiết kế kỹ thuật FE (chưa có) cần theo: cờ `is…Deleted` ở màn Admin, định dạng thời gian SYSTEM-002, lỗi `validationErrors[].field` mới.
