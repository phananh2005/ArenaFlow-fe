# Component Design — SHARED/APP-SHELL Khung ứng dụng dùng chung

| Mục | Giá trị |
|---|---|
| Mã chức năng | `APP-SHELL` |
| Phạm vi tầng | frontend (ArenaFlow-fe) |
| Repo/stack | ArenaFlow-fe · React 19 + TypeScript + Tailwind CSS 4 · React Hook Form + Zod (FE ADR-0005) |
| Quy ước áp dụng | `docs/agent/convention-frontend.md` §2–§4, §6, §10 · `docs/agent/non-functional-standards.md` §4 |
| Tác giả / Ngày / Phiên bản | `solution-architect` (agent) / `2026-11-27` / `v1.2` (lịch sử: `CHANGELOG.md`) |

> Route, guard, layout: `Screen_Flow.md`. http / session / realtime / query key: `State_API_Integration.md`.
> Mọi thành phần ở đây là **mới** (repo chưa có component nào — `src/shared/components/` rỗng tại `4f92c72`). Mã đầu tiên code (USER-001) tạo phần mình dùng; phần chưa ai dùng (vd `LoadMore`, `realtime`) tạo ở mã đầu tiên cần tới. Trước khi tạo vẫn chạy `reuse-scan` (`CLAUDE.md` §8).

## 1. Cây khung

```mermaid
graph TD
  Main[main.tsx] --> App[app/app.component]
  App --> Prov[app/app.providers: QueryClientProvider · ToastProvider · SessionBootstrap]
  Prov --> Router[RouterProvider ← app/app.routes]
  Router --> Guest[core/guards/GuestOnlyGuard] --> AuthL[layouts/AuthLayout]
  Router --> AG[core/guards/AuthGuard] --> Shell[app/app-shell.component]
  Shell --> ML[layouts/MainLayout]
  Shell --> AL[layouts/AdminLayout]
  ML --> Hdr[layouts/AppHeader]
  Hdr --> Nav[layouts/DesktopNav]
  Hdr --> Drawer[layouts/MobileNavDrawer]
  Hdr -. slot accountMenu .-> Acc[modules/account AccountMenu]
  Hdr -. slot headerActions .-> Bell[modules/notification NotificationHeaderAction — NOTIFICATION-001]
  Prov -. session authenticated .-> SE[app/session-effects.component] -.-> Bridge[modules/notification NotificationRealtimeBridge — NOTIFICATION-001]
  SE -.-> CAB[modules/chat ConversationActivityBridge — MATCH-001]
  Hdr -. slot headerActions, chỉ MainLayout, dưới md .-> Msg[modules/chat MessagesHeaderAction — MATCH-001]
  Nav -. NavItem.badge mục Tin nhắn .-> Dot[modules/chat ConversationUnreadDot — MATCH-001]
  Prov -. bọc .-> FS[shared FeatureSlotsProvider ← app/app-feature-slots.constant — FE ADR-0010]
```

## 2. App & layout

| Component | Đường dẫn | Loại | Props chính | Trách nhiệm |
|---|---|---|---|---|
| `App` | `src/app/app.component.tsx` | page | — | Render `AppProviders` + `RouterProvider` |
| `AppProviders` | `src/app/app.providers.tsx` | layout | `children` | `QueryClientProvider` (client từ `core/services/query-client.service`), `ToastProvider`, `SessionBootstrap`, `FeatureSlotsProvider` (`value` = map `src/app/app-feature-slots.constant.ts` — FE ADR-0010), `SessionEffects` (bên trong `QueryClientProvider`, ngoài router layout) |
| `SessionBootstrap` | `src/core/session/session-bootstrap.component.tsx` | layout | `children` | Gọi `bootstrapSession()` một lần khi mount; lắng nghe `storage` (FE ADR-0002 mục 6) |
| `AppShell` | `src/app/app-shell.component.tsx` | layout | `variant: 'main' \| 'admin'` | Gộp `navItems` của mọi module, lọc theo `role`; cắm slot nghiệp vụ vào layout |
| `SessionEffects` | `src/app/session-effects.component.tsx` | layout | — | Render danh sách component "hiệu ứng theo phiên" (không UI) của các module **chỉ khi** `session.status = authenticated`; mount một lần mỗi phiên, không bị huỷ khi đổi layout; unmount khi kết thúc phiên. Render với `key={session.userId}` → đổi tài khoản (vd đăng nhập tài khoản khác ở tab khác — FE ADR-0002 mục 6) thì remount, hiệu ứng của tài khoản cũ bị huỷ. Danh sách khai ở app (app → modules): hiện `NotificationRealtimeBridge` (NOTIFICATION-001 Component_Design §2), `ConversationActivityBridge` (MATCH-001 Component_Design §3) |
| `AuthLayout` | `src/layouts/auth-layout.component.tsx` | layout | — | Khung chia đôi; `<Outlet/>` |
| `MainLayout` | `src/layouts/main-layout.component.tsx` | layout | `navItems: NavItem[]`, `headerActions?: ReactNode`, `accountMenu: ReactNode` | Header + `<main id="main">` + `<Outlet/>`; link "Bỏ qua tới nội dung" |
| `AdminLayout` | `src/layouts/admin-layout.component.tsx` | layout | như `MainLayout` + `adminNavItems: NavItem[]` | Thêm menu "Quản trị" (sidebar desktop / drawer mobile) |
| `AppHeader` | `src/layouts/app-header.component.tsx` | layout | `navItems`, `headerActions`, `accountMenu`, `onOpenDrawer` | Logo (link `HOME_PATH`), nav desktop `md:` trở lên, nút ☰ mobile |
| `DesktopNav` | `src/layouts/desktop-nav.component.tsx` | layout | `items: NavItem[]` | `<nav aria-label="Điều hướng chính">`, mục đang mở `aria-current="page"` |
| `MobileNavDrawer` | `src/layouts/mobile-nav-drawer.component.tsx` | layout | `open`, `onClose`, `items` | Drawer trái; Esc / bấm nền đóng; giữ focus như `Dialog` |

```ts
/** Một mục điều hướng trên header / drawer. */
interface NavItem {
  /** Nhãn hiển thị. */
  label: string
  /** Đường dẫn đích (ROUTE_PATHS). */
  to: string
  /** Vai trò được thấy; bỏ trống = mọi người đã đăng nhập. */
  roles?: readonly ('USER' | 'ADMIN')[]
  /** Thứ tự hiển thị tăng dần. */
  order: number
  /** Huy hiệu động cạnh nhãn (tự lấy dữ liệu); bỏ trống = không có. */
  badge?: ComponentType
}
```

- `DesktopNav`, `MobileNavDrawer` render `<item.badge />` ngay sau nhãn khi có (vd `MyInvitationsCountBadge` — USER-003 Component_Design §2.2; chờ USER-003 `[cần xác nhận]` #6).
- Chỗ cắm của mã khác: NOTIFICATION-001 cung cấp `NotificationHeaderAction` (chuông + badge + vùng toast — NOTIFICATION-001 Component_Design §2) cho slot `headerActions` của **cả** `MainLayout` và `AdminLayout`, và `NotificationRealtimeBridge` cho `SessionEffects`; MATCH-001 cung cấp `ConversationUnreadDot` (`NavItem.badge` của mục "Tin nhắn" desktop), `MessagesHeaderAction` (`headerActions` mobile, chỉ `MainLayout`), `ConversationActivityBridge` (`SessionEffects`) — thay `MessagesNavLink` của v1.1. Các mã đó tự thiết kế nội dung; khung chỉ cấp vị trí `headerActions` (desktop: bên trái avatar; mobile: giữa logo và avatar) — `[cần xác nhận]` #1.

## 3. Shared component (`src/shared/components/`)

> Thuần trình bày, không gọi API, không nghiệp vụ (`convention-frontend.md` §2). Mọi field `Props` có JSDoc (§10.1).

| Component | File | Props chính | Ghi chú a11y / hành vi |
|---|---|---|---|
| `Button` | `button/button.component.tsx` | `variant: 'primary' \| 'secondary' \| 'danger' \| 'ghost'`, `loading?`, `type`, chuẩn `<button>` | `loading` → `disabled` + spinner + `aria-busy`; màu primary `#3d6943`, error `#a73b21` (token `@theme` ở `src/index.css`) |
| `Dialog` | `dialog/dialog.component.tsx` | `open`, `onClose`, `title`, `description?`, `role?: 'dialog' \| 'alertdialog'`, `initialFocusRef?`, `dismissible?` (false khi đang gửi), `footer?`, `children` | Desktop: hộp giữa màn; < `md`: bottom sheet — cùng một component, khác class Tailwind. Portal vào `body`, `aria-modal`, `aria-labelledby`/`describedby`, giữ focus (`useFocusTrap`), Esc / nền đóng khi `dismissible`, trả focus về nút mở khi đóng, khoá cuộn nền |
| `ConfirmDialog` | `dialog/confirm-dialog.component.tsx` | `open`, `title`, `message: ReactNode`, `confirmLabel`, `cancelLabel?` (mặc định "Huỷ" — MERCENARY-001 "Giữ đơn", "Để sau"), `tone: 'primary' \| 'danger'`, `pending`, `error?: ReactNode`, `onConfirm`, `onClose`, `children?` (ô nhập phụ) | `role="alertdialog"`, focus mặc định nút **Huỷ**; `error` hiện `AlertBanner` trong dialog |
| `ToastProvider` + `useToast()` | `toast/toast-provider.component.tsx`, `toast/use-toast.hook.ts` | `toast.success(msg)`, `toast.error(msg)` | Vùng `aria-live="polite"` (lỗi: `assertive`); tự ẩn 4 s; tối đa 3 toast |
| `AlertBanner` | `alert-banner/alert-banner.component.tsx` | `tone: 'error' \| 'warning' \| 'info'`, `title?`, `children`, `action?: ReactNode` | `error` → `role="alert"`; khác → `role="status"`; luôn có icon + chữ (không chỉ màu) |
| `Spinner`, `FullPageSpinner` | `spinner/spinner.component.tsx`, `spinner/full-page-spinner.component.tsx` | `label` | `role="status"` + nhãn ẩn |
| `Skeleton` | `skeleton/skeleton.component.tsx` | `variant: 'text' \| 'card' \| 'table-row' \| 'avatar'`, `count?` | `aria-hidden`; vùng cha đặt `aria-busy` |
| `EmptyState` | `state/empty-state.component.tsx` | `title`, `description?`, `action?`, `icon?: ReactNode` | `icon` hiện trong vòng tròn trên tiêu đề, `aria-hidden` (NOTIFICATION-001 Component_Design §6 #1) |
| `ErrorState` | `state/error-state.component.tsx` | `message`, `onRetry?`, `title?: string`, `icon?: ReactNode` | `role="alert"`; `title` (vd "Không tải được thông báo") trên `message`; `message` lấy từ `ApiError.message` (BE) — không hiện `details`; nút **Thử lại** khi có `onRetry` |
| `QueryStateView` | `state/query-state-view.component.tsx` | `status`, `error`, `isEmpty`, `onRetry`, `loading: ReactNode`, `empty: ReactNode`, `children` | Gom loading / error / empty / thành công cho mọi màn gọi API (`non-functional-standards.md` §2) |
| `Pagination` | `pagination/pagination.component.tsx` | `page`, `totalPages`, `onPageChange` | "Trước \| 1 \| 2 \| … \| Sau"; `<nav aria-label="Phân trang">`; ẩn khi `totalPages ≤ 1` |
| `LoadMoreButton` | `pagination/load-more-button.component.tsx` | `hasMore`, `loading`, `onLoadMore` | Cho danh sách cursor (`api-convention.md` §7.2); ẩn khi `!hasMore` |
| `Tabs` | `tabs/tabs.component.tsx` | `items: { value, label }[]`, `value`, `onChange`, `ariaLabel` | `role="tablist"`/`tab`/`tabpanel`, mũi tên trái/phải đổi tab |
| `Menu` | `menu/menu.component.tsx` | `trigger: ReactNode`, `items: { label, onSelect, tone?, disabled? }[]` | Nút `aria-haspopup="menu"`, `role="menu"`/`menuitem`, mũi tên / Esc / Enter |
| `Avatar` | `avatar/avatar.component.tsx` | `src: string \| null`, `name`, `size` | `src` chỉ nhận `http:`/`https:` (`isSafeHttpUrl`), không thì ảnh mặc định; `alt` = `name` |
| `StatusBadge` | `badge/status-badge.component.tsx` | `label`, `tone: 'success' \| 'warning' \| 'neutral' \| 'danger' \| 'tertiary'` (`tertiary` = token `tertiary-container` — MATCH-001 "Chưa có sân") | Luôn có chữ |
| `DeletedAccountTag` | `badge/deleted-account-tag.component.tsx` | — | Nhãn "Đã xoá tài khoản" (viền xám, icon `person_off`) — dùng ở mọi màn Admin theo cờ `is…Deleted` (USER-001 §1.1); **không** so chuỗi tên |
| `Breadcrumb` | `breadcrumb/breadcrumb.component.tsx` | `items: { label, to? }[]` | `<nav aria-label="Đường dẫn">`, mục cuối `aria-current="page"` |
| `FormField` | `form/form-field.component.tsx` | `label`, `htmlFor`, `required?`, `error?`, `hint?`, `counter?: { value, max }`, `children` | `label` gắn `htmlFor`; lỗi `id` → `aria-describedby` của input; `required` → `*` + `aria-required`; bộ đếm `aria-live="polite"`, đỏ khi vượt |
| `FormErrorBanner` | `form/form-error-banner.component.tsx` | `message?` | Lỗi chung của form (`validationErrors[].field = "body"` / mã nghiệp vụ không gắn ô) |
| `ChoiceChipGroup` | `form/choice-chip-group.component.tsx` | `options`, `value: string[]`, `onChange`, `max?`, `legend` | `<fieldset>` + checkbox ẩn có nhãn; đủ `max` → chip chưa chọn `disabled` |
| `SegmentedRadioGroup` | `form/segmented-radio-group.component.tsx` | `options`, `value`, `onChange`, `legend`, `name` | `role="radiogroup"` qua `<fieldset>` + `<input type="radio">`. Dùng cả cho **bộ lọc chọn một dạng chip** (cuộn ngang trên mobile bằng class Tailwind) — MERCENARY-001; không tạo component lọc riêng |
| `WardPicker` | `ward-picker/ward-picker.component.tsx` | Mục "WardPicker" bên dưới | Thuần trình bày, **không** gọi API; dữ liệu danh mục qua `provinceCatalog` / `wardCatalog`. Hành vi, a11y, nhãn: USER-003 Component_Design §2.3 |
| `FilterableSelect` | `filterable-select/filterable-select.component.tsx` | USER-003 Component_Design §2.3 | Combobox tự lọc (desktop listbox / mobile bottom sheet) — `WardPicker` dùng |
| `Switch` | `switch/switch.component.tsx` | USER-003 Component_Design §2.3 | `role="switch"` |
| `FeatureSlotsProvider` | `feature-slots/feature-slots-provider.component.tsx` | `value: FeatureSlots` | FE ADR-0010: React context giữ map slot; hook `useFeatureSlot` (§5). `src/shared/types/feature-slots.type.ts` chỉ gom interface `FeatureSlots` (map khoá → component); type props slot của mỗi mã chủ slot ở file riêng `src/shared/types/<mã>-slots.type.ts` (vd `reputation-slots.type.ts` — REPUTATION-001, `mercenary-slots.type.ts` — MERCENARY-001), thêm trong PR của module sở hữu |
| `SkillLevelTags` | `skill-level-tags/skill-level-tags.component.tsx` | `levels: string[]` | Chuyển từ module `team` (USER-001) — dùng ở thẻ đội, thẻ kèo (MATCH-001) |
| `MatchStatusBadge`, `MatchRequestStatusBadge`, `MatchTypeBadge`, `PairingStatusBadge` | `match-status/…` | MATCH-001 Component_Design §3; MATCH-002 (`status: string`, giá trị lạ → "Không xác định", tone `neutral`) | Module `match` và `chat` cùng dùng |
| `ReportTypeChip`, `ReportStatusBadge`, `ReportTypeRadioGroup`, `StarRatingInput`, `StarRatingDisplay`, `ReliabilityLevelBadge`, `TeamReputationSummary` | theo REPUTATION-001 Component_Design §3 | REPUTATION-001 Component_Design §3 | REPUTATION-001 tạo; MERCENARY-001, MATCH-001 dùng lại — không định nghĩa lại |
| `Icon` | `icon/icon.component.tsx` | `name`, `label?` | SVG nội tuyến cho tập icon dùng thật; không nạp font icon ngoài — `[cần xác nhận]` #2 |

- Thành phần `shared/` khác do VENUE-001 tạo (`VenueCard`, `VenueSearchBar`, `useGeolocation`, `useVenueSearchState`, `VENUE_TYPE_LABELS`, `formatDistanceKm`): VENUE-001 Component_Design §7 — không chép props ở đây.

### 3.1. `WardPicker` — props chốt (v1.1, một định nghĩa cho USER-003 và VENUE-001)

```ts
/** Dữ liệu một ô danh mục do module cấp cho WardPicker. */
interface CatalogSelectData {
  /** Trạng thái tải, truyền thẳng cho FilterableSelect. */
  status: 'idle' | 'loading' | 'error' | 'success'
  /** Lựa chọn theo thứ tự BE trả. */
  options: readonly { value: string; label: string }[]
  /** Message lỗi đã chuẩn hoá (ApiError.message). */
  errorMessage?: string
  /** Gọi khi người dùng mở ô — module bật query tại đây (0 call khi tải màn). */
  onOpen: () => void
  /** Nút "Thử lại" trong danh sách. */
  onRetry: () => void
}
/** Khu vực đã lưu, để hiện nhãn khi danh mục chưa tải (khớp `ward` của USER-001 §4.2 / VENUE-001 §4.2). */
interface WardSelection { wardId: string; wardName: string; provinceId: string; provinceName: string }
interface WardPickerProps {
  provinceId: string | null
  wardId: string | null
  initialWard: WardSelection | null
  onProvinceChange: (provinceId: string) => void
  onWardChange: (wardId: string) => void
  /** Có → hiện "Bỏ chọn" (USER-003 S4 dùng; VENUE-001 có thể bỏ). */
  onClear?: () => void
  provinceError?: string
  wardError?: string
  disabled?: boolean
  provinceCatalog: CatalogSelectData
  wardCatalog: CatalogSelectData
}
```
- Type ở `src/shared/types/region.type.ts`. Module cấp dữ liệu bằng hook riêng (USER-001/USER-003: `useRegionCatalog` ở `account`; VENUE-001: `useWardCatalog` ở `venue`), cùng key `catalogKeys` (§5) → một cache.
- Đối chiếu nguồn: lấy cách gom dữ liệu `provinceCatalog` / `wardCatalog` (có `onOpen` bên trong) và `onClear?` tuỳ chọn của VENUE-001 §7.3; lấy tên type `WardSelection` + file `region.type.ts` của USER-003 §2.3. **USER-003** đổi `provinces` / `wards` / `onProvinceOpen` / `onWardOpen` → `provinceCatalog` / `wardCatalog`, `CatalogOptions` → `CatalogSelectData`, `onClear` thành tuỳ chọn; **VENUE-001** đổi `InitialWard` → `WardSelection`, `ward-picker.type.ts` → `region.type.ts`.

## 4. Form (FE ADR-0005)

- Mỗi form: schema `<form>.schema.ts` cạnh component; `useForm({ resolver: zodResolver(schema), mode: 'onTouched' })`.
- Helper `applyServerValidationErrors(setError, apiError, fieldMap?)` — `src/shared/utils/form-server-errors.util.ts`:
  - Duyệt `apiError.validationErrors`; `field` có trong form (qua `fieldMap` khi tên khác) → `setError(field, { message: <câu FE theo field> })`.
  - `field = "body"` hoặc không map được → trả về để page hiện `FormErrorBanner` "Dữ liệu gửi lên không hợp lệ, vui lòng kiểm tra lại".
  - Câu lỗi do FE chọn theo field (BE: `message` không cố định — USER-001 §1.2).
- Chống double-submit: nút submit `loading = mutation.isPending`; `handleSubmit` bỏ qua khi `isPending`.
- PATCH: `buildPatchBody(values, dirtyFields)` — `src/shared/utils/patch-body.util.ts` — chỉ gồm field dirty.
- Focus ô lỗi đầu tiên sau submit thất bại (`shouldFocusError`).

## 5. Hook & util dùng chung

| Tên | Đường dẫn | Mục đích |
|---|---|---|
| `useUrlParam` | `src/shared/hooks/use-url-param.hook.ts` | Đọc/ghi một search param có `parse` + mặc định (Screen_Flow §1.3) |
| `useDebouncedValue` | `src/shared/hooks/use-debounced-value.hook.ts` | Debounce 300 ms (`non-functional-standards.md` §2) cho ô tìm kiếm |
| `useFocusTrap` | `src/shared/hooks/use-focus-trap.hook.ts` | Giữ focus trong dialog / drawer |
| `useDocumentTitle` | `src/shared/hooks/use-document-title.hook.ts` | Đặt `document.title` |
| `vn-datetime` | `src/shared/utils/vn-datetime.util.ts` | FE ADR-0008 — danh sách hàm dưới |
| `isSafeHttpUrl` | `src/shared/utils/safe-url.util.ts` | Chỉ cho `http:`/`https:` vào `href`/`src` (`security-frontend.md` §2) |
| `applyServerValidationErrors`, `buildPatchBody` | §4 | |
| `QUERY_ROOTS` | `src/shared/constants/query-roots.constant.ts` | Gốc query key theo domain (State_API_Integration §4) |
| `teamDetailKey`, `teamReputationKey`, `myTeamsKey`, `venuePickerKey` | `src/shared/constants/*-query-key.constant.ts` | Key dùng chung + hợp đồng `queryFn` (State_API_Integration §4) |
| `TeamDetail` | `src/shared/types/team-detail.type.ts` | = USER-001 `TeamResponse` §4.2 (+ field giải tán USER-002 §5.1) — REPUTATION-001 C9 |
| `MyTeam`, `MyTeamsParams` | `src/shared/types/my-team.type.ts` | USER-003 §4.2 `MyTeam` — MATCH-001 C8 |
| `FeatureSlots`, `SlotTeamRef`, `SlotMatchViewer` | `src/shared/types/feature-slots.type.ts` | FE ADR-0010: map khoá + type dùng chung giữa các slot; `SlotMatchViewer` = `CAPTAIN` \| `CAPTAIN_OF_BOTH` \| `NONE` (MERCENARY-001 C6). Props slot riêng: `<mã>-slots.type.ts` (§3 `FeatureSlotsProvider`) |
| `useFeatureSlot(name)` | `src/shared/hooks/use-feature-slot.hook.ts` | FE ADR-0010 |
| `useNowMs` | `src/shared/hooks/use-now-ms.hook.ts` | Đồng hồ cập nhật định kỳ — REPUTATION-001 / MERCENARY-001 / MATCH-001 |
| `isDisputeOpen` | `src/shared/utils/dispute-window.util.ts` | `(r: { canDispute; disputeDeadlineAt }, nowMs)` — MERCENARY-001 C5 |
| `PLAYER_POSITIONS`, `SKILL_LEVELS` | `src/shared/constants/player-options.constant.ts` | 4 nhãn vị trí, 9 nhãn trình độ (USER-001 §4.1) — thay `PREFERRED_POSITIONS` (module `account`), `SKILL_LEVELS` (module `team`) |
| `MATCH_STATUS_LABELS`, `MATCH_REQUEST_STATUS_LABELS`, `MATCH_TYPE_LABELS`, type `MatchStatus`, `MatchRequestStatus`, `MatchType` | `src/shared/constants/match-status.constant.ts` | MATCH-001 §4 |
| `PairingStatus`, `PAIRING_STATUS_LABELS`, `PAIRING_STATUS_ICONS`, `PairingRoleFilter`, `PairingStatusFilter` | `src/shared/constants/pairing-status.constant.ts` | MATCH-002 |
| Nhãn / type uy tín, report (`RELIABILITY_LEVEL_LABELS`, `REPORT_TYPE_LABELS`, `REPORT_STATUS_LABELS`…) | theo REPUTATION-001 Component_Design §3 | REPUTATION-001 |
| `formatDecimalVi(value, digits)` | `src/shared/utils/format-decimal.util.ts` | `4.3, 1` → `"4,3"` — REPUTATION-001 |
| `formatVnd(amount)` | `src/shared/utils/format-money.util.ts` | `600000` → `"600.000 đ"` — MATCH-001, MATCH-002 |
| `catalogKeys` | `src/shared/constants/catalog-query-keys.constant.ts` | Query key danh mục tỉnh/thành, phường/xã dùng chung (State_API_Integration §4) |
| `isSafeInternalPath` | `src/shared/utils/safe-internal-path.util.ts` | Chống open redirect cho `returnTo` / `from` (chỉ path nội bộ bắt đầu bằng một `/`) — VENUE-001 |
| `useMediaQuery` | `src/shared/hooks/use-media-query.hook.ts` | USER-003 Component_Design §2.3 |
| `foldVietnamese` | `src/shared/utils/vn-text.util.ts` | Bỏ dấu để lọc phía client — USER-003 Component_Design §2.3 |
| `WardSelection`, `CatalogSelectData` | `src/shared/types/region.type.ts` | §3.1 |
| `ProvinceItem`, `WardItem` | `src/shared/types/region.type.ts` | Phần tử danh mục USER-003 §4.2 (2.1, 2.2) — USER-003 State_API_Integration §2 trỏ §3.1 này |
| `VenueSearchParams`, `VenueType`, `CreatedVenueNavState` | theo VENUE-001 Component_Design §7.1 | VENUE-001 (`CreatedVenueNavState` = `state.createdVenue` dùng bởi MATCH-001 S4, MERCENARY-001 S6) |
| `DIRECT_UPLOAD_ALLOWED_URL_PREFIXES`, `DIRECT_UPLOAD_TIMEOUT_MS` | `src/core/services/http.constant.ts` | Upload trực tiếp (State_API_Integration §2.1; FE ADR-0016) |
| `ROUTE_PATHS`, `HOME_PATH` | `src/shared/constants/route-paths.constant.ts` | Screen_Flow §1.2 |
| `PAGE_SIZE_DEFAULT = 20`, `PAGE_SIZE_MAX = 100`, `SEARCH_DEBOUNCE_MS = 300`, `REQUEST_TIMEOUT_MS = 15000` | `src/shared/constants/limits.constant.ts` | Ngưỡng `non-functional-standards.md` §2 |
| `Page<T>`, `Pagination`, `CursorPage<T>` | `src/shared/types/pagination.type.ts` | Kiểu envelope danh sách (`api-convention.md` §7) |

**`vn-datetime.util.ts`** (chuỗi BE theo SYSTEM-002 §1.1; không đi qua `Date` khi hiển thị):

| Hàm | Vào → Ra | Ghi chú |
|---|---|---|
| `formatVnDate(s)` | `"2026-11-20T19:00:00.5"` hoặc `"2026-11-20"` → `"20/11/2026"` | Không khớp định dạng → trả `s` |
| `formatVnTime(s)` | datetime → `"19:00"` | |
| `formatVnDateTime(s)` | datetime → `"19:00 20/11/2026"` | |
| `vnDateTimeToEpochMs(s)` | datetime → số ms | Chuẩn hoá phần lẻ giây về 3 chữ số, ghép `+07:00` |
| `isPastVn(s, nowMs = Date.now())` | → boolean | So với bây giờ |
| `todayVnDate(nowMs = Date.now())` | → `"YYYY-MM-DD"` | Ngày hôm nay theo giờ Việt Nam |
| `ageOnVnDate(dob, today)` | `"1995-05-15"`, `"2026-11-27"` → `31` | Tuổi tròn theo ngày lịch |
| `formatVnWeekday(s)` | datetime / date → `"Thứ Bảy"` | Tính thứ từ năm/tháng/ngày (không qua `Date` múi giờ máy) — MATCH-001 |
| `formatMatchTimeRange(startsAt, endsAt)` | → `"18:00 – 20:00 · Thứ Bảy 05/12/2026"`; khác ngày → `"22:00 05/12 – 01:00 06/12/2026"` | MATCH-001; đóng MERCENARY-001 `[cần xác nhận]` #21 |
| `toVnDateTimeString(date, time)` | `"2026-11-20"`, `"19:00"` → `"2026-11-20T19:00:00"` | Dựng chuỗi gửi BE, không offset |

## 6. A11y khung
- Landmark: `<header>`, `<nav>` có `aria-label`, `<main id="main">`; link "Bỏ qua tới nội dung" đầu trang.
- Mỗi page một `<h1>`; focus chuyển tới `<h1>` sau khi đổi route (đọc màn hình biết đã sang trang mới).
- Thao tác chính dùng được bằng Tab / Enter / Esc; focus nhìn thấy (`focus-visible:ring`).
- Theme: font Be Vietnam Pro, primary `#3d6943`, error `#a73b21`, nền `#f8faf3`, bo góc 8px (UI USER-001 §3) — khai token trong `@theme` của `src/index.css`.

## 7. `[cần xác nhận]`
1. **Vị trí chuông thông báo / "Tin nhắn" trên header** chưa vẽ ở UI USER-001 (khung vẽ trước NOTIFICATION-001, MATCH-001). Khung cấp slot `headerActions`; vị trí và dạng chốt ở UI của hai mã đó.
2. **Nguồn icon và font — chặn code** (`src/index.css`, `Icon`): mockup nạp Material Symbols + Be Vietnam Pro từ Google Fonts. Đề xuất icon SVG nội tuyến (không gọi CDN, hợp CSP — `security-frontend.md` §6) và font tự host bằng file trong `public/`. Nếu chọn gói `@fontsource/*` → **cần ADR FE mới** trước khi cài (`CLAUDE.md` §8).
