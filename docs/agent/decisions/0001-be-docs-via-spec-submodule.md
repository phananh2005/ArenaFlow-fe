# ADR-0001: Đọc tài liệu BE qua submodule `ArenaFlow-spec` thay vì chép tay

| | |
|---|---|
| **Trạng thái** | Proposed |
| **Ngày** | 2026-11-09 |
| **Người quyết định** | Product Owner (chọn mô hình BE là nguồn, repo spec là bản phản chiếu) |
| **Liên quan** | `docs/agent/external-knowledge.md` §1–§2 · workflow `publish-spec` ở repo `ArenaFlow-be` |

## Bối cảnh (Context)
- FE cần SRS, API_Spec, `api-convention.md` và ADR của BE để thiết kế và code.
- Trước đây SRS được người dùng chép tay vào `docs/agent/business-spec/<MÃ>/`; API_Spec đọc từ bản clone `../ArenaFlow-be` trên máy.
- Rủi ro: bản chép tay không ghi phiên bản nguồn và dễ lệch BE; bản clone BE trên máy có thể cũ hoặc đang ở nhánh khác; thiết kế FE không ghi đã căn cứ bản tài liệu nào.

## Quyết định (Decision)
Chúng tôi dùng repo chỉ-đọc `phananh2005/ArenaFlow-spec`, gắn vào FE làm git submodule tại `docs/agent/upstream/`:
- BE là nguồn duy nhất; workflow ở BE tự publish `business-spec/`, `api/<MÃ>/{API_Spec,CHANGELOG}.md`, `api/api-convention.md`, `decisions/` sang `ArenaFlow-spec` khi merge `main`.
- FE ghim phiên bản bằng con trỏ submodule; cập nhật con trỏ là thao tác có chủ đích (`external-knowledge.md` §2.2), và thiết kế FE ghi `Căn cứ: ArenaFlow-spec@<sha7>`.
- Con trỏ submodule tính là tài liệu (miễn `code-reviewer`); `.gitmodules` tính là code.

Phương án đã loại:
- **Script chép + manifest** (đọc `origin/main` của `../ArenaFlow-be`): vẫn cần clone cả BE; tài liệu không hiện trong diff PR FE.
- **Submodule trỏ thẳng `ArenaFlow-be`**: kéo cả code BE vào FE; oxlint/Vitest phải loại trừ; dễ sửa nhầm code BE.
- **BE CI xuất `openapi.json` + sinh type TS**: cần thư viện mới (ADR riêng) và chưa bật springdoc; có thể bổ sung sau.
- **Monorepo**: đổi cấu trúc lớn, ngoài phạm vi.

## Hệ quả (Consequences)

**Tích cực**
- Phiên bản tài liệu FE dùng được ghim và hiện trong diff PR (`git diff --submodule=diff`).
- Không còn chép tay SRS; không cần clone code BE để làm FE.
- Agent kiểm tra lệch được bằng `git log HEAD..origin/main` trong submodule.

**Tiêu cực / đánh đổi**
- Ghim một phiên bản chung cho mọi chức năng: cập nhật con trỏ phải rà ảnh hưởng tới mọi thiết kế FE.
- Mỗi bản clone phải `git submodule update --init` (SessionStart nhắc khi thiếu).
- Phụ thuộc workflow publish ở BE và token ghi `ArenaFlow-spec` còn hạn.
- Rebase có thể conflict ở con trỏ submodule.

**Cần theo dõi**
- Workflow publish BE lỗi hoặc token hết hạn → FE đọc bản cũ mà không biết; xem lại nếu xảy ra lặp lại.
- BE đổi cấu trúc `ArenaFlow-spec` → cập nhật đường dẫn trong `external-knowledge.md` và procedure.
- Khi có nhu cầu type TS sinh tự động → cân nhắc publish thêm `openapi.json` (ADR riêng).
