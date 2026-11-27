# CHANGELOG — SHARED/APP-SHELL Khung ứng dụng dùng chung

## [v1.2] — 2026-11-27

**Type:** MINOR (chỉ thêm khoá / prop / thành phần **tuỳ chọn** hoặc mới; đổi chữ ký `realtime.subscribe` tham số thứ ba từ `onError?` sang object `{ onError?, onReady? }` khi chưa có code gọi — MATCH-001 C16. Đổi chữ ký API dùng chung theo `design-standards.md` §10 là MAJOR; xếp MINOR là **ngoại lệ có chủ đích** vì `src/` chưa có code gọi `subscribe` nên không phá vỡ gì) · **Tóm tắt:** Áp thay đổi REPUTATION-001 (§6 C1, C2, C4, C5, C9), MERCENARY-001 (§6 C1–C4, C14–C16), MATCH-001 (§6 C1–C7, C16), MATCH-002 (§6 C6, C8).

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow §1.2 | Thêm | Ghi nhận path REPUTATION-001, MERCENARY-001, MATCH-001, MATCH-002; đề xuất `HOME_PATH = matches` | REP C1, MERC C1, MATCH-001 C1, MATCH-002 §1 |
| 2 | Screen_Flow §3 | Sửa / Thêm | `headerActions`: + `MessagesHeaderAction` (mobile, chỉ Main); bảng `order` nav; ranh giới props ↔ slot registry (FE ADR-0010) | MATCH-001 C4, MERC C14, REP C2 |
| 3 | Screen_Flow §6 #1, #4, #5 | Sửa / Thêm | Đề xuất `HOME_PATH`; ADR của mã khác; thứ tự nav còn thiếu | MATCH-001 C1; MERC C14 |
| 4 | Component_Design §1, §2 | Sửa | `MessagesNavLink` → `ConversationUnreadDot` + `MessagesHeaderAction`; `SessionEffects` + `ConversationActivityBridge`; `AppProviders` + `FeatureSlotsProvider` | MATCH-001 C4; REP C2 |
| 5 | Component_Design §3 | Sửa / Thêm | `ConfirmDialog.cancelLabel?`; `StatusBadge` tone `tertiary`; ghi chú `SegmentedRadioGroup`; + `FeatureSlotsProvider`, `SkillLevelTags`, badge kèo / thương lượng, thành phần uy tín / report (trỏ nguồn) | MERC C15, C16; MATCH-001 C6, C9; MATCH-002 C6; REP C4 |
| 6 | Component_Design §5 | Thêm | `formatVnWeekday`, `formatMatchTimeRange`, `formatVnd`, `formatDecimalVi`, key dùng chung, `TeamDetail`, `MyTeam`, `feature-slots.type`, `useFeatureSlot`, `useNowMs`, `isDisputeOpen`, `PLAYER_POSITIONS` / `SKILL_LEVELS`, hằng trạng thái kèo / thương lượng / uy tín | MATCH-001 C5, C6; REP C9; MERC C3, C5, C6; MATCH-002 C6 |
| 7 | State_API_Integration §1 | Sửa | "Chấm Tin nhắn" = 2.20 trang 1 trong `onConnected` | MATCH-001 C2 |
| 8 | State_API_Integration §4 | Sửa / Thêm | `QUERY_ROOTS` gán chủ: `conversation`, `match`, `sport`, `pairing`, `mercenary`, `reputation`; key dùng chung `teamDetailKey`, `teamReputationKey`, `myTeamsKey`, `venuePickerKey` + hợp đồng `queryFn` trả nguyên response | REP C5, MERC C2, MATCH-001 C3, MATCH-002 C8 |
| 9 | State_API_Integration §6 + FE ADR-0007 | Sửa | `subscribe(dest, onFrame, { onError?, onReady? })`, mọi subscriber nhận frame, `getConnectionEpoch()`; kênh cá nhân chỉ bật khi `PERSONAL_CHANNEL_ENABLED` | MERC C4, MATCH-001 C7, C16, C2 |
| 10 | State_API_Integration §7 #1 | Sửa | Request khung thêm "Tin nhắn" | MATCH-001 C2 |
| 11 | Component_Design §3 `FeatureSlotsProvider`, §5 | Sửa | Props slot ở `<mã>-slots.type.ts`; `feature-slots.type.ts` chỉ gom map khoá | Review chéo (REP, MERC) |
| 12 | Component_Design §3, §5 | Thêm | `MatchTypeBadge`, type `MatchStatus` / `MatchRequestStatus` / `MatchType`; `VenueSearchParams`, `VenueType`, `CreatedVenueNavState`; `ProvinceItem`, `WardItem` | Review chéo (MATCH-001 §4, VENUE-001 §7.1, USER-003 State §2) |
| 13 | State_API_Integration §4 `teamReputationKey` | Sửa | "Mã cần" + MATCH-002, MERCENARY-001 | Review chéo |
| 14 | State_API_Integration §1 "Badge chuông" | Sửa | + nhánh `PERSONAL_CHANNEL_ENABLED = false`: gọi 2.2 lúc chuông mount | NOTIFICATION-001 v1.2 §4.2 |

### Ảnh hưởng
- Mã phải chỉnh theo bản chốt: xem báo cáo coordinator (chữ ký `subscribe`, cờ kênh cá nhân, tên component "Tin nhắn").
- Cột (C) ngưỡng của mọi mã +1 (chấm "Tin nhắn").

## [v1.1] — 2026-11-27

**Type:** MINOR (chỉ thêm prop / field / API **tuỳ chọn** — `NavItem.badge?`, `EmptyState.icon?`, `ErrorState.title?`/`icon?`, `realtime.onConnected`; không đổi / bỏ prop có sẵn) · **Tóm tắt:** Áp thay đổi do USER-003 (Screen_Flow §6 C1–C4, C22, C23), VENUE-001 (State_API_Integration §8 A1–A10) và NOTIFICATION-001 (Component_Design §6 #1, #4; State_API_Integration §7 #3) yêu cầu sau vòng `architect-reviewer` của các mã đó.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | Screen_Flow §1.2 | Thêm | — → ghi nhận path đã đăng ký: USER-003 `myInvitations`, `myTeams`, `buildMyTeamsPath`; NOTIFICATION-001 `notifications` | USER-003 C1; NOTIFICATION-001 Screen_Flow §1 |
| 2 | Screen_Flow §3 slot `headerActions` | Sửa | Chuông → `NotificationHeaderAction` (chuông + toast), cắm cả `main` và `admin`; thứ sống suốt phiên đặt ở `SessionEffects` | NOTIFICATION-001 Component_Design §6 #4 |
| 3 | Screen_Flow §6 #3 | Đóng | Nav "Đội của tôi" tạm `/teams` → theo USER-003 Screen_Flow §4 | USER-003 C2 |
| 4 | Component_Design §2 | Thêm | `SessionEffects` (`src/app/session-effects.component.tsx`), `AppProviders` render nó | NOTIFICATION-001 §6 #4 |
| 5 | Component_Design §2 `NavItem` | Sửa | + `badge?: ComponentType`; `DesktopNav` / `MobileNavDrawer` render | USER-003 C3 |
| 6 | Component_Design §3 `EmptyState`, `ErrorState` | Sửa | + `icon?` (cả hai), `title?` (`ErrorState`) | NOTIFICATION-001 §6 #1 |
| 7 | Component_Design §3, §3.1 | Thêm | `WardPicker` (props chốt §3.1), `FilterableSelect`, `Switch`; trỏ thành phần shared của VENUE-001 | USER-003 C23; VENUE-001 A9 |
| 8 | Component_Design §5 | Thêm | `catalogKeys`, `isSafeInternalPath`, `useMediaQuery`, `foldVietnamese`, `region.type.ts`, hằng upload | USER-003 C22, C23; VENUE-001 A10 |
| 9 | State_API_Integration header, §2.1, §2.2 | Thêm | `http.uploadFileDirect` + `DirectUploadOptions`; mã `INVALID_REQUEST`, `UPLOAD_REJECTED`; timeout upload 120 s | VENUE-001 A1–A6, FE ADR-0016 |
| 10 | State_API_Integration §1 | Thêm | Request khung "Huy hiệu Lời mời của tôi" | USER-003 C4 |
| 11 | State_API_Integration §4 | Sửa | `'account'` chỉ USER-001; + `'catalog'`, `'admin-venue'`, `'admin-venue-report'`; quy tắc key dùng chung ở `shared/constants` + `catalogKeys` | USER-003 C22; VENUE-001 A7, A8. Dòng `'account'` theo C22 (chỉ USER-001), không theo A7 ("USER-001, USER-003"): danh mục khu vực của USER-003 đã chuyển sang gốc `'catalog'`, USER-003 không còn key dưới `'account'` |
| 12 | State_API_Integration §6 | Thêm | `onConnected` (mọi lần kết nối, gồm lần đầu; đăng ký khi đã kết nối → gọi ngay); `onReconnected` chỉ lần kết nối lại; ADR-0007 bổ sung tương ứng | NOTIFICATION-001 State §7 #3 |
| 13 | State_API_Integration §1 "Badge chuông" | Sửa | Một lần mỗi phiên + sau kết nối lại → chỉ trong `onConnected` + foreground (1 call khi tải màn) | Quyết định coordinator 2026-11-27 |
| 14 | State_API_Integration header, §2.1, §7 #4 | Sửa / Thêm | Ghi rõ FE ADR-0016 + `uploadFileDirect` thuộc PR VENUE-001; `[cần xác nhận]` timeout 120 s chặn code upload | Review v1.1 |
| 15 | Component_Design §2 `SessionEffects` | Sửa | + `key={userId}` | Review v1.1 |

### Ảnh hưởng
- Mã đã trỏ SHARED (USER-001, USER-002, USER-003, VENUE-001, NOTIFICATION-001): đối chiếu props `WardPicker` §3.1 — USER-003 và VENUE-001 phải đổi tên prop / type theo Component_Design §3.1.
- Chưa có code → không ảnh hưởng `src/`.
