# CHANGELOG — Thiết kế kỹ thuật USER-003 Tra cứu cho người dùng

## [v1.1] — 2026-11-27

**Type:** MAJOR (đổi props component dùng chung `WardPicker` — chuyển lên `shared/`; đổi query key danh mục sang gốc `catalog`) · **Tóm tắt:** Áp findings `architect-reviewer` vòng 1 và các thay đổi chéo mã (SHARED, VENUE-001, MATCH-001, REPUTATION-001) lên baseline v1.0.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | State §1 | Sửa | Ghi "không tính request khung" như đã chốt → bảng (A)/(B)/(C) có huy hiệu + `unread-count`; S15 trang > 1, S16, S6 vượt ở (C) → chặn code | Review MAJOR 1; SHARED State §7 #1 chưa chốt |
| 2 | Component §4, State §3.2, Screen_Flow S9 | Sửa | Khoá 429 trong dialog → store module `candidate-search-lock.store.ts`, phạm vi phiên, chung mọi đội, xoá khi kết thúc phiên | Review MAJOR 2; API §2.3 giới hạn theo người dùng |
| 3 | Screen_Flow §6; Component §6, State §8 | Sửa | Bảng thay đổi rải 3 file → một danh sách C1–C23 (file · mục · cũ → mới), trạng thái "đã áp SHARED / USER-001 v1.1, chờ review"; chặn code tới khi áp | Review MAJOR 3 (một nguồn sự thật) |
| 4 | Screen_Flow §1 | Sửa | Trích sai USER-002 §5 #1 → sửa; thêm lý do chọn `/me/*` | Review MINOR 1 |
| 5 | Component §3.2, State §3.2 | Sửa | Chuỗi không hợp lệ / đang khoá vẫn có thể hiện kết quả cũ → xoá danh sách, bỏ chọn | Review MINOR 2 |
| 6 | Component §3.1, Screen_Flow S4 | Thêm | "Bỏ chọn" ô Tỉnh/thành → về khu vực ban đầu | Review MINOR 3 (UC-U04 2b) |
| 7 | Component §2.2, §5 | Sửa | `disabled` / `aria-disabled` chưa chốt → radio `disabled` native | Review MINOR 4 |
| 8 | Header 3 file | Sửa | Thêm FE ADR-0006, 0008 | Review MINOR 5 |
| 9 | Screen_Flow §7 #9, State §9 #4 | Thêm | Chặn code toàn bộ USER-003 tới khi nhánh `feature/USER-001-user-team` merge + ADR `Accepted` | Review |
| 10 | Component §2.1 → §2.3 | Sửa (MAJOR) | `WardPicker` trong `modules/account` → `shared/components/ward-picker/`; props trỏ SHARED Component_Design §3.1 (`provinceCatalog` / `wardCatalog`, `onClear?`); dữ liệu qua hook `useRegionCatalog` (module `account`) | VENUE-001 cũng dùng; module không import module khác (coordinator chốt) |
| 11 | State §2, §3.1, §3.2, §5 | Sửa (MAJOR) | `accountKeys.provinces()` / `wards(id)` → `catalogKeys.*` (gốc `catalog`, SHARED §4); type `region.type.ts` lên `shared/` | Như #10 — chung cache |
| 12 | State §2, §3.1; Component §2.2 | Sửa | `teamKeys.mineList` = `myTeamsKey(p)` (SHARED); `MyTeam`, `MyTeamsParams` → `src/shared/types/my-team.type.ts`; hợp đồng `queryFn` trả nguyên `Page<MyTeam>` | MATCH-001 §6 C8 |
| 13 | Component (đầu file, cây, `TeamBriefInfo`) | Sửa | `SkillLevelTags` (USER-001) → shared | MATCH-001 §6 C9 |
| 14 | State §3.1 | Ghi nhận | `teamKeys.detail` = `teamDetailKey` (cùng giá trị) | REPUTATION-001 §6 C10 |
| 15 | Screen_Flow §4 | Thêm | Thứ tự nav ghép với MATCH-001; `NavItem.badge` dùng chung | MATCH-001 §1, §6 C4 |
| 16 | Header 3 file | Ghi nhận | v1.0 → v1.1 | Đồng bộ phiên bản |

### Ảnh hưởng
- Route `/me/invitations`, `/me/teams`, endpoint, mã lỗi: không đổi.
- USER-001 / SHARED / VENUE-001 / MATCH-001: theo Screen_Flow §6 (C1–C23) và §6 của các mã đó.
- Code: chưa có; vẫn chặn theo Screen_Flow §7 #9, State §9 #1.
