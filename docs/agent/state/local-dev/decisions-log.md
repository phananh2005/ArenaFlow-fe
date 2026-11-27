---
dev: local-dev
updated: 2026-11-27
---

## Nhật ký quyết định (mức phiên)

> Quyết định kỹ thuật **nhẹ** khi code (chọn A thay B, đặt tên, đánh đổi nhỏ) và điều chỉnh nhỏ do skill
> `workflow-adapt`. KHÁC ADR: ADR là quyết định kiến trúc lớn cấp dự án, đặt ở `docs/agent/decisions/`.

| Ngày | Quyết định | Lý do | Phương án đã loại |
|---|---|---|---|
| 2026-11-27 | MERCENARY-001: một module `src/modules/mercenary/` cho tin, đơn, trận ngoài, đánh giá/report, uy tín cá nhân, tranh chấp Admin | Cùng một hợp đồng API, chung query root `'mercenary'` | Tách `external-match`, `mercenary-admin` thành module riêng (tăng chia sẻ chéo module) |
| 2026-11-27 | MERCENARY-001: S11, S18 là route riêng, link từ S8a / hồ sơ | Thành phần chỉ đọc → không dùng slot (FE ADR-0010 mục 7); giữ ngưỡng call của trang USER-001 | Tab trong hồ sơ đội / hồ sơ cá nhân (USER-001 phải gọi API mercenary) |
| 2026-11-27 | MERCENARY-001: trạng thái "đã đánh giá" và "loại đã report" chỉ tải khi mở dialog | Tránh N+1 trên danh sách (2.19 theo từng đơn) | Gọi 2.19 cho từng thẻ ứng viên / đơn |
| 2026-11-27 | MERCENARY-001: S15 một route theo `applicationId`, đội trưởng tự chuyển sang S3 | Đích thông báo `MERCENARY_APPLICATION` không biết vai trò người nhận | Hai route riêng cho ứng viên / đội trưởng |

## Quy ước
- Quyết định ảnh hưởng cả đội / lâu dài → nâng thành ADR.
