# ADR-0004: Dùng TanStack Query cho server state (cache, query key, invalidate)

| | |
|---|---|
| **Trạng thái** | Proposed |
| **Ngày** | 2026-11-27 |
| **Người quyết định** | Product Owner (duyệt qua PR) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/convention-frontend.md` §2 ("Server state → lớp data fetching trong `modules/<domain>/hooks/`; không đưa vào store") · `docs/agent/non-functional-standards.md` §1–§2 · FE ADR-0002 · `docs/agent/design/SHARED/APP-SHELL/State_API_Integration.md` §4 |

## Bối cảnh (Context)
- Mọi màn hình đọc dữ liệu BE, cần loading / error / thử lại, phân trang offset (`page`/`pageSize`) và cursor (`before`/`after`/`limit` — chat, thông báo — `api-convention.md` §7.2).
- Thao tác ghi phải chống double-submit và làm mới dữ liệu liên quan (`design-standards.md` §7).
- NFR cấm gọi lại dữ liệu đã có trong cache cùng phiên khi chưa cần (`non-functional-standards.md` §2).
- Frame realtime (FE ADR-0007) cần chèn / cập nhật dữ liệu đang hiển thị mà không tải lại.
- Đăng xuất phải xoá toàn bộ cache dữ liệu người dùng (`security-frontend.md` §1).

## Quyết định (Decision)
Chúng tôi dùng **TanStack Query** (gói `@tanstack/react-query`, bản major ổn định mới nhất tại lúc cài):
- Một `QueryClient` duy nhất tạo ở `src/core/services/query-client.service.ts`, cấp qua `app.providers.tsx`; `endSession` gọi `queryClient.clear()`.
- Mặc định: `retry: false` (người dùng bấm **Thử lại**), `refetchOnWindowFocus: false`, `staleTime` 30 giây; từng query được ghi đè khi thiết kế màn hình nói rõ.
- **Query key** theo factory của từng module, phần tử đầu là gốc domain lấy từ `src/shared/constants/query-roots.constant.ts`; module khác invalidate theo gốc mà không import module (quy ước chi tiết: thiết kế SHARED §4).
- Danh sách offset dùng `useQuery` + `placeholderData` giữ trang cũ khi đổi trang; danh sách cursor / "Tải thêm" dùng `useInfiniteQuery`.
- Thao tác ghi dùng `useMutation`; nút disable theo `isPending`; sau thành công `setQueryData` khi response là bản đầy đủ (B4 — `api-convention.md` §5), còn lại `invalidateQueries`.
- Không cài devtools vào bundle production.

Phương án đã loại:
- **SWR:** gọn hơn nhưng mutation / invalidate theo key phân cấp / infinite query yếu hơn; phải tự viết nhiều.
- **RTK Query:** kéo theo Redux Toolkit (FE ADR-0006 không dùng Redux).
- **Tự viết hook fetch + cache:** tái tạo dedupe, cache, huỷ request, infinite — rủi ro lỗi, tốn công.

## Hệ quả (Consequences)

**Tích cực**
- Loading / error / refetch / huỷ request khi unmount có sẵn; số request đếm được trong test bằng mock HTTP.
- Dedupe tự nhiên: header và màn hồ sơ dùng chung key → một request.

**Tiêu cực / đánh đổi**
- Thêm dependency runtime (khoảng chục KB gzip — `[Unverified]` số đo thật xem ở output `npm run build`).
- Đội phải tuân quy ước query key; key lệch → invalidate trượt (architect-reviewer / code-reviewer soi).

**Cần theo dõi**
- Bản major mới đổi API (`useQuery` options, `placeholderData`) → rà hook ở mọi module.
- Cần cache bền qua tải lại trang (offline) → ADR riêng; hiện không lưu cache ra storage.
