# Chuẩn phi chức năng — Frontend

> Áp dụng cho mọi màn hình trong `src/`. Ngưỡng do người dùng duyệt ngày 2026-11-03; thay đổi cần được duyệt qua PR.
> Living document: thêm mục khi đội gặp nhu cầu thật.

## 1. Nguyên tắc
- **Số request quan trọng hơn kích thước một request** — số API call khi tải màn hình phải là **hằng số**, không tăng theo số phần tử hiển thị.
- **Lọc / sắp xếp / phân trang ở BE** — FE không tải toàn bộ rồi lọc.
- **Người dùng luôn biết trạng thái** — không có màn hình "trắng" khi đang tải hoặc lỗi.
- **Đo trước khi tối ưu** — `memo`/cache không thay việc sửa luồng gọi API sai.

## 2. Ngưỡng

| Mục | Ngưỡng | Ghi chú |
|---|---|---|
| API call khi tải 1 màn hình | ≤ 3 | Không tính call refresh token |
| Phân trang danh sách | Luôn theo BE: `pageSize` mặc định 20, tối đa 100 | Tham số theo `api-convention.md` §7 của BE |
| Timeout request | 15 giây | Hết giờ → hiển thị lỗi + nút **Thử lại** |
| Debounce ô tìm kiếm | 300 ms | Áp dụng mọi input kích hoạt gọi API khi gõ |
| JS initial bundle | ≤ 250 KB gzip | Tách code theo route (lazy) |
| Trạng thái màn hình gọi API | Bắt buộc có loading · empty (nếu danh sách) · error | Error có thông báo từ BE + thử lại khi hợp lý |

- **MUST** bám ngưỡng **khi thiết kế và trước khi viết code**. Không đạt → **DỪNG tại thời điểm đó**, nêu: nghiệp vụ buộc vượt · cách gộp đã thử · số dự kiến — **chờ xác nhận**.
- **NEVER** vượt ngưỡng rồi giải trình sau khi code xong.
- **NEVER** gọi API trong vòng lặp render / cho từng phần tử danh sách (N+1 phía client) — cần dữ liệu gộp → đề xuất endpoint ở BE.
- **NEVER** gọi lại dữ liệu đã có trong cache cùng phiên khi chưa cần làm mới.

## 3. Kiểm chứng
- Số API call: đếm trong test (mock HTTP) hoặc tab Network khi chạy `npm run dev`.
- Bundle: xem kích thước gzip trong output `npm run build`; vượt → tách route/thư viện, hoặc dừng hỏi.

## 4. Accessibility cơ bản
- Semantic HTML; mọi input có `label`; ảnh có `alt`.
- Thao tác chính dùng được bằng bàn phím (Tab/Enter/Esc), focus nhìn thấy được.
- Không truyền đạt thông tin chỉ bằng màu.
