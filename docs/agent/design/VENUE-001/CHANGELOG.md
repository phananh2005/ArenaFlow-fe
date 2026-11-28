# CHANGELOG — VENUE-001 thiết kế kỹ thuật FE

## [v1.2] — 2026-11-27
**Type:** MINOR — cập nhật trạng thái phụ thuộc SHARED sau review chốt.

| Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|
| `Component_Design.md` §9 #2, `State_API_Integration.md` §7 #5 | Sửa trạng thái | "chờ SHARED v1.1 được duyệt" → "đã áp ở SHARED v1.2"; chỉ còn chặn ô khu vực S2/S3 bởi merge nhánh SHARED + FE ADR | SHARED v1.2 đã áp `WardPicker`, A1–A10 |
| `State_API_Integration.md` §8 | Sửa trạng thái | "đã áp vào SHARED v1.1 (chờ architect-reviewer)" → "đã áp (SHARED v1.2), còn chờ merge" | Như trên |
| Header 3 tài liệu | Phiên bản | `v1.1` → `v1.2` | `design-standards.md` §10 |

**Ảnh hưởng:** không đổi thiết kế. SHARED sẽ bổ sung `VenueSearchParams`, `VenueType`, `CreatedVenueNavState` (định nghĩa ở VENUE-001 Component_Design §7.1) vào danh mục shared — khi đó VENUE-001 chỉ trỏ, không đổi giá trị.

## [v1.1] — 2026-11-27
**Type:** MINOR — áp các mục §6 "thay đổi cho mã khác" nhắm vào VENUE-001: MATCH-001 C3, C12, C14; MERCENARY-001 C13 (vòng lặp design đợt 2). REPUTATION-001, MATCH-002 §6 không có mục cho VENUE-001.

| Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|
| `Screen_Flow.md` §3 S2, §5 #4 | Chốt `[cần xác nhận]` | `returnTo` chờ chốt, `state: { createdVenueId }` → bảng mã gọi (MATCH-001 S4, MERCENARY-001 S6) + `state: { createdVenue: { venueId, name, address } }` lấy từ response 2.1 | MERCENARY-001 C13, MATCH-001 C14 — màn gọi chọn sẵn sân không gọi 2.3 |
| `Component_Design.md` §2, §7.1 | Thêm | Key bộ chọn sân "vd `[venue,'picker',p]`" trong module → `venuePickerKey` ở `shared/constants` + hợp đồng `queryFn` trả nguyên `Page` 2.2; thêm type `CreatedVenueNavState` | MATCH-001 C3, C12 |
| `State_API_Integration.md` §3.2, §7 #7 | Sửa | Sau 2.12 invalidate gốc `match` (giả định) → `invalidateVenueConsumers`: gốc `match`, `pairing`, `mercenary` (đã đối chiếu key) | BR-V10; response MATCH-001 / MATCH-002 / MERCENARY-001 nhúng thông tin địa điểm |
| Header 3 tài liệu | Phiên bản | `v1.0` → `v1.1` | `design-standards.md` §10 |

**Ảnh hưởng:** không đổi route, props shared đã công bố hay store toàn cục. MATCH-001 / MERCENARY-001 đọc `CreatedVenueNavState` và dùng `venuePickerKey` theo §7.1.
