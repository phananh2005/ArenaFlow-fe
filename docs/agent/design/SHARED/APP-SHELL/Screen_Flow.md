# Screen Flow — SHARED/APP-SHELL Khung ứng dụng dùng chung

| Mục | Giá trị |
|---|---|
| Mã chức năng | `APP-SHELL` (thiết kế nền dùng chung, không có SRS riêng) |
| Phạm vi tầng | frontend (ArenaFlow-fe) — backend: ngoài phạm vi repo này |
| Repo/stack | ArenaFlow-fe · React 19 + TypeScript + Vite · React Router (FE ADR-0003) |
| Nguồn SRS/UI/API | Khung app theo `docs/agent/design/USER-001/UI_Design.md` §3 · `docs/agent/upstream/api/api-convention.md` · USER-001 `API_Spec.md` §1.1–§1.2 · MATCH-001 `API_Spec.md` §1.7 · NOTIFICATION-001 `API_Spec.md` §1.4 |
| Căn cứ | `ArenaFlow-spec@53aee11` · USER-001 API_Spec `v5.3` · NOTIFICATION-001 `v2.0` · MATCH-001 `v3.2` · SYSTEM-002 `v1.2` |
| Quy ước áp dụng | `docs/agent/design-standards.md`, `docs/agent/convention-frontend.md`, `docs/agent/security-frontend.md` |
| Tác giả / Ngày / Phiên bản | `solution-architect` (agent) / `2026-11-27` / `v1.2` (lịch sử: `CHANGELOG.md`) |

> Vị trí `design/SHARED/APP-SHELL/` theo `design-standards.md` §2 ("`design/SHARED/<MÃ>/` cho khung dùng chung"). Mọi mã chức năng **trỏ** tới 3 file ở đây, không định nghĩa lại route registry, guard, layout, http, session, realtime, query key, util ngày giờ.
> **Trước khi code:** FE ADR-0002…0008 đang `Proposed` — phải chốt (`Accepted` qua PR) các ADR mà phần code dùng tới **trước khi** cài thư viện / viết code; ADR-0007 (realtime) chốt được muộn hơn, khi tới mã realtime đầu tiên (MATCH-001 / NOTIFICATION-001). Xem §6 #4.
> Ba file: `Screen_Flow.md` (file này — route, guard, layout, điều hướng) · `Component_Design.md` (layout, shared component, hook/util, form) · `State_API_Integration.md` (http, auth/session, query key, realtime, ngưỡng API call của khung).

## 1. Route registry

### 1.1. Cách module khai route
- Mỗi module xuất từ `src/modules/<domain>/routes/<domain>.routes.tsx` một object `AppRouteGroups` (type ở `src/shared/types/app-route-groups.type.ts`):

```ts
/** Nhóm route của một module; app gộp theo nhóm để bọc guard + layout. */
interface AppRouteGroups {
  /** Ai cũng vào được (hiện chưa dùng). */
  public?: RouteObject[]
  /** Chỉ khi chưa đăng nhập (màn đăng nhập) — đã đăng nhập thì chuyển về màn chính. */
  guestOnly?: RouteObject[]
  /** Cần đăng nhập, khung `MainLayout`. */
  authenticated?: RouteObject[]
  /** Cần `role = ADMIN`, khung `AdminLayout`. */
  admin?: RouteObject[]
}
```

- Mỗi `RouteObject` nạp page bằng `lazy` (FE ADR-0003); path lấy từ `ROUTE_PATHS` (§1.2), không gõ chuỗi tay.
- File khung: `src/app/root-error-boundary.component.tsx` (`RootErrorBoundary`), `src/app/not-found.page.tsx` (`NotFoundPage`), `src/core/realtime/` (State_API_Integration §6). `convention-frontend.md` §2 chưa có `core/realtime/` → **đề xuất** bổ sung vào convention (PR framework riêng; không sửa ở đây).
- `src/app/app.routes.tsx` spread nhóm của mọi module vào cây cố định:

```text
/                         → RootErrorBoundary
├── [GuestOnlyGuard] → AuthLayout      ← guestOnly của mọi module
├── [AuthGuard]      → AppShell(MainLayout)   ← authenticated của mọi module
│   └── index "/"    → <Navigate to={HOME_PATH}/>
├── [AuthGuard → RoleGuard('ADMIN')] → AppShell(AdminLayout) ← admin của mọi module
└── "*"              → NotFoundPage (trong MainLayout nếu đã đăng nhập, không thì AuthLayout)
```

- Thứ tự spread không mang nghĩa; trùng path giữa hai module → lỗi review.

### 1.2. Hằng đường dẫn
- `src/shared/constants/route-paths.constant.ts`: `ROUTE_PATHS` (mẫu path cho router) + hàm dựng URL có tham số (vd `buildTeamDetailPath(teamId)`). Module **dùng hằng này** khi điều hướng sang màn của module khác (không import module đó).
- Mỗi mã chức năng thêm path của mình vào file này trong PR của mã đó; tên + giá trị ghi ở `Screen_Flow.md` §1 của mã. Đã đăng ký (v1.1): USER-001 (USER-001 Screen_Flow §1); USER-003 `myInvitations: '/me/invitations'`, `myTeams: '/me/teams'`, `buildMyTeamsPath({ role?: 'CAPTAIN' })` (USER-003 Screen_Flow §1); NOTIFICATION-001 `notifications: '/notifications'` (NOTIFICATION-001 Screen_Flow §1); VENUE-001 theo VENUE-001 Screen_Flow §1; REPUTATION-001 4 khoá (`teamReports`, `teamReputation`, `adminDisputes`, `adminDisputeDetail` + hàm dựng — REPUTATION-001 Screen_Flow §1); MERCENARY-001 13 khoá + hàm dựng (MERCENARY-001 Screen_Flow §1); MATCH-001 9 khoá + 5 hàm dựng (MATCH-001 Screen_Flow §1); MATCH-002 `pairingDetail`, `teamPairings`, `matchPairings` + 3 hàm dựng (MATCH-002 Screen_Flow §1). Không chép bảng ở đây — mỗi mã là nguồn của khoá mình.
- `HOME_PATH` = màn chính sau đăng nhập. Tạm = `/teams` (S6 USER-001) `[cần xác nhận]` #1 — MATCH-001 đề xuất `ROUTE_PATHS.matches` ("Tìm kèo").

### 1.3. Tham số URL dùng chung
| Tham số | Ý nghĩa | Parse |
|---|---|---|
| `page` | Trang (offset) | Số nguyên ≥ 1; sai → 1 |
| `status`, `tab`, `role`… | Bộ lọc / tab theo từng màn | Giá trị ngoài tập cho phép → mặc định của màn |

- Hook `useUrlParam` (Component_Design §5) đọc/ghi một tham số có parse + mặc định; ghi bằng `replace` khi đổi bộ lọc (không đẩy lịch sử), `push` khi đổi trang.
- Đổi bộ lọc → reset `page` về 1.
- **NEVER** đặt token, PII vào URL (`security-frontend.md` §1, §4).

## 2. Guard & phân quyền

| Guard | File | Điều kiện | Không đạt |
|---|---|---|---|
| `AuthGuard` | `src/core/guards/auth-guard.component.tsx` | `session.status = authenticated` | `unknown` → `FullPageSpinner`; `anonymous` → `<Navigate to={ROUTE_PATHS.login} state={{ from }} replace>` (lý do kết thúc phiên đọc từ `session.endReason`) |
| `RoleGuard` | `src/core/guards/role-guard.component.tsx` | `session.role` thuộc `roles` (prop) | Trang 403 "Bạn không có quyền truy cập trang này" + link về `HOME_PATH` (không redirect im lặng) |
| `GuestOnlyGuard` | `src/core/guards/guest-only-guard.component.tsx` | `status = anonymous` | `authenticated` → `Navigate` (replace) tới `session.afterLoginPath` nếu có (rồi `consumeAfterLoginPath()`), không thì `state.from`, không thì `HOME_PATH`; `unknown` → `FullPageSpinner` |

- Guard chỉ là trải nghiệm; quyền thật ở BE (`security-frontend.md` §5). 401 / 403 từ API xử lý ở `http.service` + từng màn (State_API_Integration §2).
- `403 AUTH_004` khi đang ở màn admin (vd vai trò bị hạ giữa phiên) → `ErrorState` "Bạn không có quyền truy cập trang này"; không tự đăng xuất.
- **Điều hướng sau đăng nhập — một nguồn duy nhất:** màn đăng nhập **không** tự `navigate`. Nó tính đích (vd tài khoản mới → S4 `?onboarding=1` — USER-001) rồi gọi `startSession(auth, afterLoginPath)`; store đặt `status = authenticated` **và** `afterLoginPath` trong **cùng một** lần cập nhật snapshot → `GuestOnlyGuard` render lại và điều hướng tới đích đó. Không có thời điểm nào guard thấy `authenticated` mà chưa có đích.
- Phiên kết thúc giữa chừng (refresh thất bại, tài khoản đã xoá) → session `anonymous` → `AuthGuard` đưa về `/login`; màn đăng nhập đọc `endReason` để hiện banner (USER-001 Screen_Flow S1).

## 3. Layout

| Layout | File | Dùng cho | Thành phần |
|---|---|---|---|
| `AuthLayout` | `src/layouts/auth-layout.component.tsx` | Màn đăng nhập (USER-001 S1, S2a, S2b) | Desktop chia đôi (cột thương hiệu + thẻ), mobile xếp dọc — UI USER-001 §3 "Layout xác thực chia đôi" |
| `MainLayout` | `src/layouts/main-layout.component.tsx` | Mọi màn đã đăng nhập không phải admin | Header (logo, nav desktop, slot hành động, slot menu tài khoản); mobile: nút ☰ mở `MobileNavDrawer`, logo giữa, avatar phải; `<main>` chứa `<Outlet/>` |
| `AdminLayout` | `src/layouts/admin-layout.component.tsx` | Màn quản trị (USER-001 S13, USER-002 S14, các mã admin sau) | Header như `MainLayout` + menu "Quản trị" (sidebar desktop, drawer mobile) |

- Layout **không** import `modules/`. Phần nghiệp vụ trên header đi vào qua **slot** do `src/app/app-shell.component.tsx` cắm (Component_Design §2):
- **Ranh giới hai cơ chế nhúng** (FE ADR-0010, nhánh `feature/REPUTATION-001-…`, `Proposed`): người nhận là layout / thành phần `app/` dựng trực tiếp (header, nav, `SessionEffects`) → `app/` truyền **props** (mục này). Người nhận là page / component **bên trong một module** cần thành phần có ghi dữ liệu của module khác → **slot registry** (`FeatureSlotsProvider` + `useFeatureSlot` — Component_Design §2, §3). Không dùng chồng.
  - `accountMenu` — avatar + menu "Hồ sơ cá nhân" / "Đăng xuất" (USER-001).
  - `headerActions` — `NotificationHeaderAction` (NOTIFICATION-001: chuông + vùng toast; cắm **cả** `main` và `admin`); `MessagesHeaderAction` (MATCH-001: icon "Tin nhắn" + chấm, chỉ dưới `md`, **chỉ** `MainLayout`). Mã chưa có code → không cắm. Slot nằm trong layout nên **remount** khi đổi `MainLayout` ↔ `AdminLayout` — thứ sống suốt phiên (kênh realtime, store) đặt ở `SessionEffects` (Component_Design §2), không đặt trong slot.
  - `navItems` — mục điều hướng (`NavItem[]`), mỗi module khai qua `modules/<domain>/constants/<domain>-nav.constant.ts`, app gộp, lọc theo `role`, sắp theo `order`. Desktop có mục "Tin nhắn" với `badge = ConversationUnreadDot` (MATCH-001). Bảng `order` đã đăng ký (khoảng cách 5 để chèn):

    | `order` | Mục (người dùng) | Mã | | `order` | Mục (Admin, `AdminLayout`) | Mã |
    |---|---|---|---|---|---|---|
    | 5 | Tìm kèo | MATCH-001 | | 10 | Quản lý đội | USER-001 |
    | 10 | Đội bóng | USER-003 | | 35 | Bộ môn | MATCH-001 |
    | 15 | Kèo của đội | MATCH-001 | | 40 | Tranh chấp report bùng | REPUTATION-001 |
    | 20 | Đội của tôi | USER-003 | | 41 | Tranh chấp mercenary | MERCENARY-001 |
    | 30 | Lời mời của tôi | USER-003 | | — | Mục Admin của VENUE-001 | `[cần xác nhận]` #5 |
    | 90 | Tin nhắn | MATCH-001 | | | | |
    | — | "Địa điểm" (VENUE-001), "Tìm kèo mercenary", "Kèo mercenary của tôi" (MERCENARY-001) | `[cần xác nhận]` #5 | | | | |

## 4. Luồng điều hướng khung

```mermaid
flowchart LR
  Start([Mở app]) --> Boot{Có refresh token?}
  Boot -->|không| Anon[anonymous]
  Boot -->|có| Refresh[POST /auth/refresh]
  Refresh -->|200| Auth[authenticated]
  Refresh -->|lỗi| Anon
  Anon -->|route cần đăng nhập| Login[/login]
  Login -->|đăng nhập OK| From[from hoặc HOME_PATH]
  Auth -->|route guestOnly| Home[HOME_PATH]
  Auth -->|Đăng xuất / phiên hết| Login
```

## 5. Trạng thái chung

| Tình huống | Hiển thị |
|---|---|
| Session `unknown` (đang refresh lúc khởi động) | `FullPageSpinner` |
| Chunk lazy lỗi tải (mạng) | `RootErrorBoundary` → "Không tải được trang" + nút **Tải lại** |
| Lỗi render ngoài dự kiến | `RootErrorBoundary` → "Đã xảy ra lỗi" + nút về `HOME_PATH`; không hiện stack (`security-frontend.md` §4) |
| Path không khớp | `NotFoundPage` "Không tìm thấy trang" |

- Mỗi page tự đặt `document.title` = "<tên màn> · ArenaFlow" (hook `useDocumentTitle`).
- Đổi route → cuộn lên đầu (`ScrollRestoration` của React Router).

## 6. `[cần xác nhận]`
1. **Màn chính (`HOME_PATH`)** sau đăng nhập: UI USER-001 chỉ ghi "màn chính", SRS không nêu. Tạm `/teams` (S6) tới khi có màn chính của MATCH-001 / VENUE-001.
2. **Lối vào khu quản trị:** UI chưa vẽ. Đề xuất mục "Quản trị" trong menu tài khoản, chỉ hiện khi `role = ADMIN`, mở `/admin/teams`.
3. ~~**Mục điều hướng trên header**~~ — **Đóng (v1.1):** nav của module `team` theo bảng USER-003 `Screen_Flow.md` §4 ("Đội bóng" → S6, "Đội của tôi" → `/me/teams`, "Lời mời của tôi" → `/me/invitations`); huy hiệu số qua `NavItem.badge` (Component_Design §2) — còn chờ USER-003 `[cần xác nhận]` #6 (ngưỡng request khung).
4. **ADR `Proposed` — chặn code:** FE ADR-0002 (token), 0003 (router), 0004 (TanStack Query), 0005 (form), 0006 (session store), 0008 (ngày giờ) phải `Accepted` trước khi code USER-001 (mã đầu tiên dựng khung); 0007 (realtime) chốt trước khi code mã realtime đầu tiên. ADR của mã khác dùng khung: FE ADR-0009 (bản đồ), 0016 (upload) — VENUE-001; 0010 (slot) — REPUTATION-001, chặn code phần slot của REPUTATION-001 / MATCH-001 / MERCENARY-001. Agent không tự đổi trạng thái ADR.
5. **Thứ tự nav còn thiếu:** VENUE-001 ("Địa điểm" — đề xuất sau "Đội của tôi"), MERCENARY-001 (2 mục người dùng — MERCENARY-001 `[cần xác nhận]` #15), mục Admin của VENUE-001 chưa có `order`; chốt cùng `HOME_PATH` (#1). Đề xuất: "Địa điểm" 25, "Tìm kèo mercenary" 50, "Kèo mercenary của tôi" 55.
