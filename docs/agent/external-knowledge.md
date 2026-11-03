# Tra cứu tri thức ngoài repo — ArenaFlow-be & Stitch MCP

> SRS đã được người dùng chép vào FE (`docs/agent/business-spec/<MÃ>/`). Hợp đồng API vẫn là **một nguồn sự thật**
> ở repo anh em `ArenaFlow-be`, đặt cạnh repo này (`../ArenaFlow-be`). Không ghi URL nội bộ, token, API key vào file này.

## 1. Nguồn có sẵn

| Nguồn | Đường dẫn / tên | Dùng cho |
|---|---|---|
| SRS (trong FE) | `docs/agent/business-spec/<MÃ>/` | Use case, business rule, quyền, acceptance criteria |
| Hợp đồng API | `../ArenaFlow-be/docs/agent/design/<MÃ>/API_Spec.md` | Endpoint, request/response, mã lỗi của chức năng |
| Quy ước API chung | `../ArenaFlow-be/docs/agent/api-convention.md` | Base URL, envelope, mã lỗi, phân trang, sort, header auth |
| ADR BE | `../ArenaFlow-be/docs/agent/decisions/` | Quyết định ảnh hưởng FE (vd JWT) |
| Code BE | `../ArenaFlow-be/src/` | Xác nhận hành vi thực tế khi tài liệu nghi đã cũ |
| SRS gốc (BE) | `../ArenaFlow-be/docs/agent/business-spec/<MÃ>/` | Đối chiếu khi nghi SRS trong FE đã cũ |
| Stitch MCP | server `stitch` (cấu hình local) | Thiết kế giao diện — chỉ dùng trong `ui-designer` |

## 2. Quy tắc tra BE

- **MUST** tra BE khi cần: field/DTO, mã lỗi, phân trang, quyền ở mức API.
- **NEVER** suy đoán hợp đồng API ("chắc BE trả field này") — không tra được → `[cần xác nhận]`.
- **NEVER** sửa file trong `../ArenaFlow-be` từ phiên FE. Cần đổi SRS/hợp đồng → đề xuất, người dùng làm ở repo BE.
- Kết luận từ BE **MUST** dẫn `ArenaFlow-be` + `path` (+ mục/dòng khi có); ghi commit BE khi kết luận phụ thuộc phiên bản (`git -C ../ArenaFlow-be log -1 --oneline`).
- Tài liệu và code BE lệch nhau, hoặc SRS FE lệch SRS BE → nêu rõ, ghi `[cần xác nhận]`, không tự chọn.
- Không có `../ArenaFlow-be` → báo người dùng (clone BE cạnh FE), làm tiếp phần không phụ thuộc, ghi rõ phần **chưa kiểm chứng**.

## 3. Stitch MCP (thiết kế giao diện)

### Cài đặt (mỗi máy dev, scope local — KHÔNG commit)

Người dùng tự chạy tại gốc repo, thay `<api-key>` bằng key của mình:

```sh
claude mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: <api-key>"
```

- Scope mặc định `local`: cấu hình lưu ngoài repo, chỉ áp dụng cho máy này. Repo **không** có `.mcp.json`.
- Kiểm tra: `claude mcp list` hoặc `/mcp` trong phiên. Gỡ: `claude mcp remove stitch`.

### Quy tắc dùng

- Chỉ `ui-designer` dùng Stitch; agent khác chỉ đọc kết quả đã lưu trong `docs/agent/design/<MÃ>/`.
- **NEVER** ghi API key vào file trong repo, prompt, log, tài liệu; **NEVER** hỏi người dùng dán key vào chat.
- **NEVER** gửi secret, dữ liệu cá nhân thật, URL nội bộ vào prompt Stitch — chỉ mô tả nghiệp vụ.
- Server chưa cấu hình / lỗi xác thực → dừng bước thiết kế UI, báo người dùng cài theo mục trên; không chuyển sang cách khác để vượt qua.
- Kết quả Stitch chỉ có giá trị khi đã lưu vào `UI_Design.md` + `ui/` và được người dùng duyệt.
