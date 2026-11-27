# ADR-0010: Nhúng thành phần nghiệp vụ của module này vào page của module khác qua slot do `app/` đăng ký

| | |
|---|---|
| **Trạng thái** | Proposed |
| **Ngày** | 2026-11-27 |
| **Người quyết định** | Product Owner (duyệt qua PR) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/convention-frontend.md` §2 (hướng phụ thuộc, module không import module khác) · `docs/agent/design/REPUTATION-001/Component_Design.md` §6 · **chưa merge vào `main`:** FE ADR-0003, 0004 và `docs/agent/design/SHARED/APP-SHELL/` v1.2 (Screen_Flow §3; Component_Design §2 — `headerActions`, `NavItem.badge`, `SessionEffects`, `FeatureSlotsProvider` / `useFeatureSlot`; props slot theo file `<mã>-slots.type.ts` của từng mã) ở nhánh `feature/USER-001-user-team`; VENUE-001 `Component_Design.md` §7.1 + §9 #3 ở nhánh `feature/VENUE-001-venue` |

## Bối cảnh (Context)
- `convention-frontend.md` §2: hướng phụ thuộc `app → layouts / modules → shared / core`; **module không import module khác**; `shared/` không gọi endpoint, không nghiệp vụ.
- Hai mẫu đã có (cả hai chưa merge):
  - **UI thuần trình bày ở `shared/`, mỗi module tự gọi API** (VENUE-001 §7.1, USER-003 `WardPicker`) — hợp với thành phần chỉ đọc.
  - **`app/` truyền component qua props** (SHARED v1.2: `MainLayout` / `AdminLayout` nhận `headerActions`; `NavItem.badge: ComponentType`; `AppProviders` render `SessionEffects`). Người nhận là **layout / thành phần của `app/`**, do `app/` dựng trực tiếp. Chưa có trường hợp một **page của module** nhận component của module khác.
- REPUTATION-001 có thành phần **có nghiệp vụ và ghi dữ liệu** phải hiện bên trong page của module khác:
  - Khối "Đánh giá & report" (S3) trong chi tiết kèo — MATCH-001; mở form đánh giá (2.1), report (2.3), xử lý ~15 mã lỗi.
  - Dialog report "giao tiếp tệ" (S5) trong phòng chat hai đội — MATCH-001.
  - Dialog tranh chấp report bùng (S7) — MERCENARY-001 tái dùng cho report do mercenary gửi.
- Theo mẫu "UI ở `shared/`, module tự gọi API", MATCH-001 / MERCENARY-001 phải tự viết lại mutation, schema, bảng lỗi của REPUTATION-001 → hai bản logic nghiệp vụ, dễ lệch.
- Phải quyết trước khi MATCH-001 / MERCENARY-001 viết thiết kế kỹ thuật (đang làm song song).

## Quyết định (Decision)
Chúng tôi dùng **slot đăng ký ở `app/`** cho thành phần nghiệp vụ cần hiện bên trong page của module khác:

1. **Hợp đồng ở `shared/`** — `src/shared/types/feature-slots.type.ts`: interface `FeatureSlots`, mỗi khoá là `ComponentType<XxxSlotProps>`. Khoá chỉ được thêm vào interface trong PR của **module sở hữu** (cùng lúc với component). Type props (`XxxSlotProps`) cũng ở `src/shared/types/` — chỉ id, nhãn, callback; không logic.
2. **Provider + hook ở `shared/`** (thư mục và hậu tố đã có trong `convention-frontend.md` §2–§3) — `src/shared/components/feature-slots/feature-slots-provider.component.tsx` (`FeatureSlotsProvider`, `value: FeatureSlots`, giữ React context) và `src/shared/hooks/use-feature-slot.hook.ts` (`useFeatureSlot(name)` trả component, hoặc `null` khi không có provider).
3. **Đăng ký ở `app/`** — `src/app/app-feature-slots.constant.ts` import component từ module sở hữu (hướng `app → modules` hợp lệ), bọc `lazy()` để không kéo code của module sở hữu vào chunk của module chủ. `AppProviders` bọc `FeatureSlotsProvider`.
4. **Kiểm đủ khoá:** map khai `satisfies Required<FeatureSlots>` (thiếu khoá → lỗi `tsc`); test `src/app/app-feature-slots.constant.test.ts` kiểm mọi khoá của map có component. Trong app thật, slot thiếu là lỗi build / test — **không** bị ẩn im lặng. `null` chỉ xảy ra trong test của host không cấp provider.
5. **Module chủ (host)** gọi `useFeatureSlot('…')`; bọc `<Suspense>` với skeleton của mình. Host code trước module sở hữu → chưa có khoá trong `FeatureSlots` → host chưa gọi slot đó (thêm khi module sở hữu merge).
6. Module sở hữu tự gọi API, tự invalidate key của mình; dữ liệu của host đổi theo → báo qua callback trong props (vd `onMatchChanged`), host tự invalidate key của host.
7. Chỉ dùng slot khi thành phần có **ghi dữ liệu / nghiệp vụ**. Thành phần chỉ trình bày vẫn theo mẫu `shared/` của VENUE-001.
8. **Ranh giới hai cơ chế** (không dùng chồng):
   - Người nhận là **layout hoặc thành phần `app/` dựng trực tiếp** (header, nav, `SessionEffects`) → `app/` truyền **props** (mẫu SHARED v1.2, giữ nguyên).
   - Người nhận là **page / component bên trong một module** (React Router dựng qua `lazy`) → **slot registry** của ADR này.

Phương án đã loại:
- **Page / route factory nhận component từ `app/` qua props** (mở rộng mẫu `headerActions` xuống page): module xuất vd `createMatchRoutes({ ReputationSection, ConversationReportDialog })`, `app.routes.tsx` truyền vào. Loại vì: (1) phải truyền tay qua mọi tầng từ route xuống component sâu (page → thẻ → menu phòng chat), hoặc mỗi module tự dựng context riêng → thành N cơ chế; (2) `AppRouteGroups` đang là object tĩnh — đổi thành hàm làm khác mọi module đã thiết kế (USER-001/003, VENUE-001, NOTIFICATION-001); (3) một thành phần cần ở nhiều module (S7: REPUTATION-001, MERCENARY-001) → mỗi factory lặp tham số.
- **UI ở `shared/`, host tự gọi API:** trùng mutation + bảng lỗi ở 2–3 module, lệch khi API đổi.
- **Host import thẳng module sở hữu:** vi phạm `convention-frontend.md` §2.
- **Gộp page host vào `app/`:** `app/` thành nơi chứa nghiệp vụ; route của module không còn tự khai trong `<domain>.routes.tsx`.
- **Event bus / store toàn cục mở dialog:** khó lần theo, không có type props, mất `Suspense` theo vị trí.

## Hệ quả (Consequences)

**Tích cực**
- Một nguồn logic cho đánh giá / report / tranh chấp; host chỉ cấp ngữ cảnh.
- Giữ nguyên quy tắc không import chéo module; type props và đủ khoá kiểm ở compile time.
- Code của module sở hữu tách chunk (`lazy`), đúng ngưỡng bundle (`non-functional-standards.md` §2).

**Tiêu cực / đánh đổi**
- Repo có hai cơ chế cắm thành phần (props cho layout, slot cho page) — ranh giới ở mục 8; reviewer kiểm theo đó.
- `shared/` chứa type mang tên nghiệp vụ (tên slot, props) — chấp nhận vì chỉ là hợp đồng, không logic; `convention-frontend.md` §2 nên thêm một dòng nêu ngoại lệ này (PR framework riêng khi ADR được `Accepted`).
- Test host phải cấp `FeatureSlotsProvider` giả.
- Đổi props slot = đổi hợp đồng giữa hai mã → MAJOR ở thiết kế cả hai (`design-standards.md` §10).

**Cần theo dõi**
- Số slot > ~10 hoặc slot cần trả giá trị (không chỉ render) → xem lại (vd plugin registry có kiểu theo route).
- Nếu React Router có cơ chế chuẩn thay thế (vd outlet có tên) → ADR mới.
