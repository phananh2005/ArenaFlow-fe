# ADR-0003: Dùng React Router (data router, route lazy theo module) cho định tuyến

| | |
|---|---|
| **Trạng thái** | Accepted |
| **Ngày** | 2026-11-28 |
| **Người quyết định** | Product Owner (đã duyệt 2026-11-28) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/convention-frontend.md` §2 (`app.routes.tsx`, `modules/<domain>/routes/`) · `docs/agent/non-functional-standards.md` §2 (bundle ≤ 250 KB gzip, tách code theo route) · `docs/agent/design/SHARED/APP-SHELL/Screen_Flow.md` |

## Bối cảnh (Context)
- SPA cần URL cho từng màn hình (deep link tới chi tiết đội, kèo, phòng chat…), tham số lọc/phân trang trên URL (`design-standards.md` §7), guard đăng nhập / vai trò.
- Mỗi module tự khai route lazy trong `modules/<domain>/routes/<domain>.routes.tsx`, `app.routes.tsx` gộp lại (`convention-frontend.md` §2).
- Initial bundle ≤ 250 KB gzip → bắt buộc tách code theo route.
- Repo chưa có thư viện routing (`convention-frontend.md` §1).

## Quyết định (Decision)
Chúng tôi dùng **React Router** (gói `react-router`, bản ổn định mới nhất tại lúc cài — chốt số phiên bản trong PR cài đặt), chế độ **data router** (`createBrowserRouter` + `RouterProvider`):
- Route khai dạng object; mỗi page nạp bằng thuộc tính `lazy` của route (tách chunk theo page).
- Guard là component bọc nhóm route (`AuthGuard`, `RoleGuard`, `GuestOnlyGuard` trong `src/core/guards/`) dùng làm `element` của route cha + `<Outlet/>`; không dùng loader để kiểm quyền (quyền thật ở BE).
- Lấy dữ liệu bằng TanStack Query (FE ADR-0004), **không** dùng `loader`/`action` của router — một nguồn cache duy nhất.
- Tham số lọc / phân trang / tab đọc-ghi qua `useSearchParams`.

Phương án đã loại:
- **TanStack Router:** route và search param có type mạnh, nhưng cần plugin sinh code / cấu hình thêm; đội chưa dùng; lợi ích chưa đủ bù chi phí.
- **Wouter / tự viết:** không có data router, lazy route, quản lý search param, `ScrollRestoration` — phải tự làm.
- **Dùng loader/action của React Router:** trùng vai trò với TanStack Query, hai nơi cache.

## Hệ quả (Consequences)

**Tích cực**
- API phổ biến, tài liệu nhiều; lazy route có sẵn → đạt ngưỡng bundle dễ hơn.
- Module thêm route không sửa module khác; `app.routes.tsx` chỉ spread.

**Tiêu cực / đánh đổi**
- Thêm một dependency runtime (tăng bundle ban đầu).
- Search param không có type sẵn → mỗi màn parse/validate bằng hàm riêng (fallback về mặc định khi giá trị sai).

**Cần theo dõi**
- Bản major mới của React Router đổi API `lazy` / data router → rà `app.routes.tsx` và mọi `*.routes.tsx`.
- Bundle ban đầu vượt 250 KB gzip → xem lại phần đặt trong chunk chính.
