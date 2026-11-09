# Kiến thức dự án — ArenaFlow-fe

> Cổng vào ngữ cảnh **đặc thù** của dự án; hub gốc trỏ tới file này. **Khi mâu thuẫn với kiến thức tổ chức, nội dung ở đây ghi đè**.

> [!IMPORTANT]
> `@path` = nạp vào context **mọi phiên** (tốn token, dễ loãng). **Chỉ `@` file cần ở hầu hết mọi phiên**.
> Tài liệu theo tình huống → liệt kê ở §2, KHÔNG `@`. Nghi ngờ → cho vào §2.

## 1. Auto-load (`@`)

_(Chưa có file kiến trúc/thuật ngữ — thêm khi dự án phát triển)_

---

## 2. Tham chiếu — đọc khi cần (KHÔNG `@`)

> Mục lục điều hướng. Mỗi dòng chỉ ghi **đường dẫn + khi nào đọc**; chi tiết nằm trong file được trỏ tới.

| Tình huống | Đọc |
|---|---|
| Viết/sửa code trong `src/` | `docs/agent/convention-frontend.md` |
| Xác thực, token, render dữ liệu người dùng, biến môi trường | `docs/agent/security-frontend.md` |
| Màn hình gọi API / danh sách / thêm thư viện | `docs/agent/non-functional-standards.md` |
| Cần SRS (spec nghiệp vụ) | Mục lục `docs/agent/upstream/README.md` → `docs/agent/upstream/business-spec/<SRS_DIR>/` (submodule `ArenaFlow-spec`, chỉ đọc; `external-knowledge.md` §1.1) |
| Cần hợp đồng API / ADR BE | `docs/agent/external-knowledge.md` → `docs/agent/upstream/api/`, `docs/agent/upstream/decisions/` |
| Thiết kế giao diện (Stitch MCP) | `.claude/agents/ui-designer.md`, `docs/agent/external-knowledge.md` §3 |
| Thiết kế kỹ thuật chức năng FE mới | `docs/agent/design-standards.md`, `docs/agent/design/_template/` |
| Review tài liệu thiết kế | `docs/agent/design-standards.md`, thiết kế đã có trong `docs/agent/design/` |
| Rà quyết định kiến trúc (thư viện, lưu token) | `docs/agent/decisions/` |
| Điều chỉnh cách làm việc agent | `docs/agent/adaptation-rules.md` |
| Cài hook, ownership, kiểm chứng hạ tầng agent | `docs/agent/README.md` |

---

## 3. Bảo trì file này

- Chức năng mới có thiết kế FE → thêm đường dẫn `docs/agent/design/<MÃ>/` ở §2. **KHÔNG `@`**.
- Chỉ thêm `@` ở §1 khi file thực sự cần ở hầu hết mọi phiên.
