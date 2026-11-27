# State & API Integration — USER-002 Giải tán đội & quy tắc xoá tài khoản đội trưởng

| Mục | Giá trị |
|---|---|
| Mã chức năng | `USER-002` |
| Phạm vi tầng | frontend (ArenaFlow-fe) — hợp đồng API thuộc BE |
| Nguồn API | `docs/agent/upstream/api/USER-002/API_Spec.md` · `docs/agent/upstream/api/USER-001/API_Spec.md` · `docs/agent/upstream/api/api-convention.md` |
| Căn cứ | `ArenaFlow-spec@53aee11` · API_Spec `v4.0` (USER-001 `v5.3`, USER-003 `v2.0`, SYSTEM-002 `v1.2`) |
| Quy ước áp dụng | `docs/agent/convention-frontend.md` §5, `docs/agent/non-functional-standards.md`, `docs/agent/security-frontend.md` · `docs/agent/design/SHARED/APP-SHELL/State_API_Integration.md` · `docs/agent/design/USER-001/State_API_Integration.md` |
| Tác giả / Ngày / Phiên bản | `solution-architect` (agent) / `2026-11-27` / `v1.2` (lịch sử: `CHANGELOG.md` — mục "Thiết kế kỹ thuật") |

> Số mục `§2.x` dưới đây là mục của USER-002 `API_Spec.md`; `2.x` không có `§` là USER-001. Chỉ ghi phần thêm/sửa so với USER-001. Path tương đối với base `/api/v1`.

## 1. Endpoint dùng theo màn hình

| Màn hình | Thời điểm gọi | Method + path | API_Spec | Số call khi tải |
|---|---|---|---|---|
| S5 | Bấm "Xoá tài khoản" | `DELETE /profile` | §2.5 (USER-001 2.7) | — |
| S8b | Khi tải | `GET /teams/{teamId}` (chung với S8a) + `GET /teams/{teamId}/captain/history?page&pageSize=20` (tab mặc định) | §2.2, §2.8 (2.9, 2.16) | 2 |
| S8b | Tab "Thành viên" | — (luôn rỗng — §2.8) | — | 0 |
| S12 | Bấm "Giải tán đội" | `POST /teams/{teamId}/disband` | §2.1 | — |
| S12 | Lỗi mạng / hết giờ khi giải tán | `GET /teams/{teamId}` (kiểm kết quả) | §2.1 "Không idempotent" | — |
| S13 | Khi tải (USER-001) — thêm `status=DISBANDED`, mặc định `ALL` gồm đội đã giải tán | `GET /admin/teams` | §2.6 | 1 |
| S14 | Khi tải / đổi trang | `GET /teams/{teamId}` (tên + trạng thái đội cho header) + `GET /admin/teams/{teamId}/members?page&pageSize=20` | 2.9, §2.4 | 2 |

**Tổng API call khi tải** (ngưỡng ≤ 3) — cùng ba cách tính với USER-001 State_API_Integration §1: (A) chỉ call của màn: S8b = 2 · S13 = 1 · S14 = 2; (B) vào thẳng, cộng hồ sơ + huy hiệu "Lời mời của tôi" (nếu chốt): S8b = **4** · S13 = 3 · S14 = **4**; (C) thêm 2 call trong `onConnected` (`unread-count` + "Tin nhắn" 2.20 — SHARED §1): S8b = **6** · S13 = **5** · S14 = **6**. `[cần xác nhận]` chặn code S8b, S13, S14 tới khi chốt cách tính (SHARED State_API_Integration §7 #1). Phương án giảm nếu phải tính (C): S14 lấy tên đội từ `location.state` khi đi từ S13, chỉ gọi 2.9 khi vào thẳng.

- S14 dùng `GET /teams/{teamId}` (endpoint thường) chỉ để lấy `teamName`, `status` — không hiển thị tên người từ response này (endpoint thường che tên người đã xoá — USER-001 §1.1).

## 2. Hàm API & type

| Hàm | Đường dẫn | Request type | Response type | Ghi chú |
|---|---|---|---|---|
| `disbandTeam` | `src/modules/team/api/team.api.ts` | `teamId`, `DisbandTeamRequest \| undefined` (§2.1) | `TeamDetail` (§5.1) | Không gửi body khi lý do rỗng |
| `getAdminTeamMemberHistory` | `src/modules/team/api/admin-team.api.ts` | `teamId`, `{ status?: 'ACTIVE' \| 'LEFT' \| 'ALL', page, pageSize }` | `Page<MemberHistoryEntry>` (§5.3) | `status` không gửi = `ALL` |

- Field giải tán (§5.1) của `TeamDetail` khai trong `src/shared/types/team-detail.type.ts` (type đủ field, một nơi — SHARED Component_Design §5, REPUTATION-001 C10). Thêm vào `src/modules/team/types/team.type.ts`: field giải tán của `TeamSummary` / `AdminTeam*` (§5.1, §5.2), `MemberHistoryEntry` (§5.3). Trạng thái đội `'ACTIVE' | 'INACTIVE' | 'DISBANDED'`.

## 3. State

| State | Loại | Nơi giữ | Key / tên | Làm mới khi |
|---|---|---|---|---|
| Chi tiết đội (S8a/S8b) | server | TanStack Query | `teamKeys.detail(teamId)` (USER-001) | `setQueryData` bằng response §2.1; invalidate tiền tố sau `TEAM_016` ở mọi thao tác ghi |
| Lịch sử thành viên (S14) | server | ″ | `adminTeamKeys.memberHistory(teamId, { status: 'ALL', page, pageSize: 20 })` | Không có thao tác ghi trên màn; cache theo mặc định |
| Đội — tên cho header S14 | server | ″ | `teamKeys.detail(teamId)` | Dùng chung cache S8 |
| Tab / trang S8b, S14 | URL | search param | `tab`, `page` | Người dùng đổi |

**Sau giải tán thành công (§2.1 `200`):**
1. `setQueryData(teamKeys.detail(teamId), team)` → `TeamDetailPage` chuyển sang S8b.
2. `removeQueries` `teamKeys.members(teamId, …)`, `teamKeys.memberPicker(teamId)` (không còn thành viên); invalidate `teamKeys.captainHistory(teamId, …)`.
3. Invalidate `teamKeys.lists()`, `adminTeamKeys.lists()`, `teamKeys.mine()` (USER-003 State_API_Integration §3.1; C21).

## 4. Luồng tương tác — giải tán đội

```mermaid
sequenceDiagram
  actor U as Đội trưởng
  participant D as S12
  participant Q as QueryClient
  participant API as ArenaFlow-be
  U->>D: nhập lý do (tuỳ chọn), "Giải tán đội"
  D->>API: POST /teams/{id}/disband
  alt 200
    API-->>D: Team (DISBANDED)
    D->>Q: setQueryData(detail) · invalidate lists, mine, admin-team
    D-->>U: đóng dialog, toast, hiện S8b
  else NETWORK_ERROR / TIMEOUT
    D->>API: GET /teams/{id}
    API-->>D: Team
    D-->>U: DISBANDED → như 200; khác → lỗi trong dialog, bấm lại được
  else 422 TEAM_016
    D->>Q: invalidate detail
    D-->>U: đóng dialog, toast "Đội đã giải tán", hiện S8b
  end
```

## 5. Xử lý lỗi

> Lỗi chung: SHARED State_API_Integration §2.3. Thứ tự BE kiểm: §2.1a.

| Endpoint | HTTP / mã | Hiển thị / hành động |
|---|---|---|
| §2.1 giải tán | `400 VALIDATION_ERROR` field `reason` | Lỗi dưới ô lý do, giữ dialog |
| §2.1 | `400 VALIDATION_ERROR` field `body` | `FormErrorBanner` trong dialog |
| §2.1 | `404 TEAM_001` | Đóng dialog, toast "Không tìm thấy đội" → S6 |
| §2.1 | `422 TEAM_016` | Đóng dialog, toast message, invalidate chi tiết → S8b |
| §2.1 | `403 TEAM_002` | Đóng dialog, toast message, invalidate chi tiết (nút giải tán ẩn) |
| §2.1 | `409 TEAM_014` | Lỗi trong dialog (message BE), invalidate chi tiết, giữ dialog để bấm lại |
| §2.1 | `NETWORK_ERROR` / `TIMEOUT` | Kiểm bằng `GET /teams/{id}` (§4) — **không** gửi lại `POST` |
| §2.5 xoá tài khoản | `422 USER_003` | `DeleteAccountBlockedBanner` với message BE; không đăng xuất |
| §2.5 | `409 TEAM_014` | Như USER-001 (banner, bấm lại) |
| §2.4 lịch sử thành viên | `404 TEAM_001` | Toast "Không tìm thấy đội" → S13 |
| §2.4 | `403 AUTH_004` | `ErrorState` không đủ quyền (SHARED Screen_Flow §2) |
| §2.4, §2.6 | `400 VALIDATION_ERROR` (tham số) | Đưa `page` về 1, `status` về mặc định |
| §2.7 mọi thao tác ghi USER-001 | `422 TEAM_016`, `409 TEAM_014` | Xem bảng USER-001 State_API_Integration §5 (không lặp lại). Chi tiết đội tải lại có `status = DISBANDED` → trang tự chuyển S8b |

## 6. Phân trang / tìm kiếm / sort
- S8b lịch sử đội trưởng: offset `pageSize = 20`, BE sắp mới nhất trước (2.16). S14: offset `pageSize = 20`, BE sắp `joinedAt` tăng dần (§2.4). Khớp mockup — mục UI USER-002 §4 #2 (thứ tự) đã do API_Spec chốt.
- Không có tìm kiếm / sort ở mã này.

## 7. `[cần xác nhận]`
1. Cách tính ngưỡng có gồm call của khung — chặn code S8b, S13 (ở (C)), S14 (§1).
2. ~~Key "Đội của tôi" của USER-003~~ — **Đóng (v1.1):** `teamKeys.mine()` (C21). Các mục khác: Screen_Flow §5.
