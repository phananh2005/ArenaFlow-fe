# Chuẩn viết tài liệu thiết kế Frontend

> Dùng cho `solution-architect` (sinh) + `architect-reviewer` (soi).
> File này **chỉ trỏ** tới quy ước gốc — KHÔNG chép giá trị quy tắc vào đây (tránh trôi lệch).

## 1. Phạm vi theo tầng
- Thiết kế **chỉ tầng frontend** (SPA React) — repo ArenaFlow-fe phụ trách.
- Backend (API, DB, business logic) → một dòng "Ngoài phạm vi repo này", trỏ API_Spec BE.

## 2. Một chức năng = UI + tối đa 3 tài liệu kỹ thuật (+ changelog khi sửa)

Thư mục `docs/agent/design/<MÃ>/` (mã trùng mã SRS), copy từ `docs/agent/design/_template/`:

| Tài liệu | Trả lời | Bám nguồn | Do ai sinh |
|---|---|---|---|
| `UI_Design.md` + `ui/` | Giao diện từng màn hình (ảnh/HTML xuất từ Stitch), trạng thái, map tới SRS | SRS `docs/agent/business-spec/<MÃ>/` | `ui-designer` |
| `Screen_Flow.md` | Màn hình nào, route nào, ai vào được, điều hướng ra sao | SRS, `UI_Design.md`, `docs/agent/security-frontend.md` §5 | `solution-architect` |
| `Component_Design.md` | Cây component, props, component dùng chung tái dùng/tạo mới, form & validation | `UI_Design.md`, `docs/agent/convention-frontend.md` | `solution-architect` |
| `State_API_Integration.md` | State (client/server), query key, endpoint mỗi màn hình, mapping field, xử lý lỗi, số API call | API_Spec BE, `api-convention.md` BE, `docs/agent/non-functional-standards.md` | `solution-architect` |
| `CHANGELOG.md` | Lịch sử sửa — **chỉ tạo ở lần sửa đầu tiên sau baseline** | §10 | agent sửa |

- Tên màn hình `S<n>` thống nhất giữa `UI_Design.md` và 3 tài liệu kỹ thuật.
- `UI_Design.md` phải **được người dùng duyệt** trước khi `solution-architect` bắt đầu.

**Gom thư mục khi số chức năng tăng:** `design/<CỤM>/<MÃ>/`, và `design/SHARED/<MÃ>/` cho khung dùng chung (layout, auth, http).
Bố cục đang dùng ghi ở `design/README.md` — đọc file đó, không đoán.

**Tham chiếu chịu được di chuyển thư mục:**
- **NEVER** ghi đường dẫn tài liệu thiết kế vào comment code.
- Di chuyển/đổi tên thư mục thiết kế → grep mọi chỗ trỏ tới và sửa trong cùng thay đổi.

## 3. Header chuẩn
Bảng: **Mã chức năng · Phạm vi tầng · Repo/stack · Nguồn SRS/API · Quy ước áp dụng · Tác giả/Ngày/Phiên bản** (`UI_Design.md` dùng header riêng trong template).

## 4. Cổng tuân thủ (bắt buộc trước khi trình)
- **Mở lại file nguồn bản hiện hành** (API_Spec BE, `api-convention.md`, `convention-frontend.md`) và soi **từng** route/field/mã lỗi — không dựa trí nhớ.
- Tối thiểu: tên field (casing) · envelope/phân trang/mã lỗi · cấu trúc thư mục & đặt tên component · thư viện đúng ADR.
- Còn 1 điểm lệch → sửa ngay, chưa trình. Tra không thấy → `[cần xác nhận]`.

## 5. Sơ đồ
- Mặc định **Mermaid** (`flowchart` cho luồng màn hình, `sequenceDiagram` cho tương tác UI ↔ API, `graph TD` cho cây component); không thì ASCII.

## 6. `[cần xác nhận]` (bắt buộc)
- Mọi điểm chưa map 1-1 (field, mã lỗi, quyền, hành vi khi lỗi) → đánh dấu inline **và** gom danh sách đánh số cuối mỗi tài liệu.
- **Không đoán cho xong.**

## 7. Bất biến cho màn hình
- Mỗi màn hình gọi API: số API call khi tải (≤ ngưỡng `non-functional-standards.md`) · loading/empty/error · thử lại.
- Thao tác ghi: chống double-submit · cập nhật/invalidate dữ liệu liên quan sau khi thành công · hiển thị lỗi field từ BE.
- Danh sách: phân trang + sort theo BE · debounce tìm kiếm · giữ tham số lọc trên URL khi hợp lý.

## 8. Súc tích — tối ưu cho AI đọc
- **Một thông tin = một nơi**; tài liệu khác chỉ trỏ (dùng tiêu đề mục làm mỏ neo). **Không chép** bảng field/JSON của API_Spec BE — trỏ tới mục.
- Bỏ diễn giải dài, boilerplate chưa điền. Ưu tiên bảng / danh sách / code-fence.

## 9. Nhất quán chéo
- Trước khi thiết kế, quét thiết kế FE đã có (cùng module / dùng chung component, store). Trùng → trỏ/tái dùng.
- Xung đột không tự hoà giải → `[cần xác nhận]`, không đè thiết kế cũ.

## 10. Changelog thiết kế
- Bản sinh lần đầu = **baseline vX.Y**, không có changelog.
- Mỗi lần **sửa** sau baseline: thêm 1 entry **lên đầu** `CHANGELOG.md`: `## [vX.Y] — YYYY-MM-DD`, type (MAJOR/MINOR), tóm tắt 1 câu, danh sách thay đổi (vị trí · loại · cũ → mới · lý do), ảnh hưởng.
- **MAJOR** = đổi route public, xoá màn hình, đổi props component dùng chung, đổi store toàn cục. **MINOR** = thêm / sửa không phá vỡ / chốt `[cần xác nhận]`.
- Version entry mới nhất **khớp** header các tài liệu. Không sửa/xoá entry cũ.
