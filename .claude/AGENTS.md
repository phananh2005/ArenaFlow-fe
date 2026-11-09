# AGENTS.md — Routing & cách coordinator thực thi procedure

> Phiên mặc định = **coordinator**: nhận request → chọn procedure → **tự đọc và thực thi inline**,
> không bắt người dùng chuyển agent thủ công.

## §1 — Decision tree

> Repo một tầng (`frontend`) → bỏ bước xác định tầng, bỏ hậu tố tầng.
> SRS, API_Spec, ADR của BE đọc từ submodule `docs/agent/upstream/` (repo `ArenaFlow-spec`, BE tự publish khi merge `main`) — xem `docs/agent/external-knowledge.md`.
> Luồng chức năng mới: **SRS → ui-designer (Stitch) → solution-architect → architect-reviewer → developer**.

```text
Nhận request
├── Phân tích yêu cầu / làm SRS               → người dùng làm ở BE, merge main để publish → cập nhật con trỏ docs/agent/upstream
├── Thiết kế giao diện / mockup / Stitch      → kiểm tra SRS:
│   ├── Chưa có SRS trong docs/agent/upstream → dừng, yêu cầu BE publish
│   └── Đã có SRS                             → ui-designer → người dùng duyệt
├── Thiết kế kỹ thuật FE                      → kiểm tra đầu vào:
│   ├── Thiếu SRS / UI_Design đã duyệt        → làm bước còn thiếu trước
│   ├── Thiếu API_Spec ở BE                   → dừng, đề xuất làm ở BE
│   └── Đủ                                    → solution-architect → architect-reviewer
├── Implement chức năng mới                   → kiểm tra thiết kế FE:
│   ├── Chưa có UI_Design / thiết kế kỹ thuật → ui-designer / solution-architect trước → duyệt → developer
│   └── Đã có đủ                              → task-state-init → developer
├── Sửa chức năng đã triển khai               → developer → sau khi code & test PASS:
│   ├── Ảnh hưởng giao diện                   → cập nhật UI_Design qua ui-designer
│   ├── Ảnh hưởng design FE (route/component/state/mapping API)
│   │   └── CÓ ảnh hưởng                      → cập nhật design → architect-reviewer (chỉ review phần sửa)
│   └── Ảnh hưởng nghiệp vụ / hợp đồng API
│       └── CÓ ảnh hưởng                      → dừng, đề xuất cập nhật SRS / API_Spec ở repo BE
├── Debug / lỗi / không chạy                  → skill debug
├── Review thiết kế                            → procedure architect-reviewer
├── Review code / chuẩn bị PR                 → agent code-reviewer (subagent, chỉ khi diff có code)
├── Rà ADR / quyết định kiến trúc              → skill decisions-relevance
├── Agent làm lệch quy ước repo (lặp lại)     → skill workflow-adapt
└── Hỏi đáp / giải thích / tìm kiếm           → xử lý trực tiếp
```

### Phân biệt "chức năng mới" vs "sửa chức năng đã có"

| Loại | Đặc điểm | Ví dụ |
|---|---|---|
| **Chức năng mới** | Màn hình mới, route mới, luồng người dùng mới | Màn hình đăng nhập, trang danh sách sân |
| **Sửa chức năng đã có** | Thay đổi hành vi/hiển thị/gọi API của màn hình hiện có | Thêm cột vào bảng, đổi validation form, sửa bug hiển thị |

### Tiêu chí "ảnh hưởng design FE"

**CÓ ảnh hưởng** (cần cập nhật design):
- Route: thêm/xoá/đổi path, guard quyền, điều hướng giữa màn hình
- Cây component: thêm/xoá component chính, đổi props public của component dùng chung
- State: thêm/đổi store toàn cục, query key, chiến lược cache/invalidate
- Mapping API: dùng endpoint mới, đổi field hiển thị/gửi đi, đổi cách xử lý mã lỗi

**KHÔNG ảnh hưởng**:
- Bugfix bên trong component (không đổi props/route/state)
- Refactor nội bộ, đổi style Tailwind, sửa text
- Tối ưu render không đổi hành vi

### Tiêu chí "ảnh hưởng nghiệp vụ / hợp đồng API" (thuộc repo BE)

- Use case, business rule, quyền truy cập, trạng thái quy trình thay đổi
- Cần endpoint mới hoặc đổi request/response/mã lỗi của BE

## §2 — Bảng procedure

| Procedure / skill | Trigger | Output | Không làm |
|---|---|---|---|
| `ui-designer` | "thiết kế giao diện [X]", "design UI", "mockup", "dùng Stitch" | `docs/agent/design/<MÃ>/UI_Design.md` + `ui/` đã duyệt | Code; thiết kế route/state/API; thêm dữ liệu ngoài SRS |
| `solution-architect` | "thiết kế màn hình [X]", "design FE/luồng/component" | Tài liệu thiết kế trong `docs/agent/design/<MÃ>/` | Viết code production; đặt hợp đồng API |
| `architect-reviewer` | "review thiết kế", "soi design" | CRITICAL/MAJOR/MINOR cho tài liệu thiết kế | Tự sửa thiết kế |
| `developer` | "implement/viết/tạo/build/thêm/sửa [X]" | Code + test PASS + lint/build PASS + state cập nhật | Code khi chưa duyệt kế hoạch; code chức năng mới khi chưa có thiết kế |
| `code-reviewer` | "review code", "chuẩn bị PR", "tạo PR"; **bắt buộc trước khi push để tạo PR** khi diff có code (`git diff origin/main`) — cổng duy nhất | CRITICAL/MAJOR/MINOR có `file:line` | Tự sửa / commit; chạy inline trong phiên đã viết code; chạy trước từng commit hay sau khi tạo PR |
| `debug` | "lỗi", "bug", "không hiển thị", "console error" | Root cause + fix + test | Đoán khi chưa reproduce |
| `workflow-adapt` | Người dùng sửa cùng hành vi ≥ 2 lần; lệnh/quy tắc lệch repo | Đề xuất điều chỉnh có bằng chứng | Nới guardrail, sửa file org-owned |

## §3 — Khi nào xử lý trực tiếp

| Loại request | Trực tiếp? |
|---|---|
| Giải thích code, tra cứu, tóm tắt, so sánh | ✅ |
| Đọc log / console error | ✅ — nhưng sửa lỗi phải qua `debug` |
| Phân tích yêu cầu nghiệp vụ | ✗ → người dùng làm ở BE, publish sang `ArenaFlow-spec` |
| Thiết kế giao diện | ✗ → `ui-designer` |
| Thiết kế kỹ thuật chức năng FE mới | ✗ → `solution-architect` |
| Viết / sửa code production | ✗ → `developer` (chức năng mới phải có thiết kế trước) |
| Review thiết kế | ✗ → `architect-reviewer` |
| Review code trước PR | ✗ → `code-reviewer` (subagent) |

## §4 — Cách thực thi một procedure

1. Báo ngắn: "Bắt đầu `<procedure>` — Bước 1: đọc context…".
2. Đọc file procedure **khi cần** (không nạp sẵn mọi procedure vào context).
3. Thực thi tuần tự, không bỏ bước; gặp tín hiệu dừng → dừng và hỏi.
4. Mọi thay đổi hành vi code MUST theo TDD **Red → Green → Refactor** (`npx vitest run <file>`); chỉ thay đổi thuần tài liệu / style thuần được miễn. Test chạy offline, mock ở ranh giới HTTP.
5. Sau mỗi bước implement → `progress-tracker`.
6. **Ngoại lệ — `code-reviewer`:** không thực thi inline. Coordinator gọi Agent tool với `subagent_type: code-reviewer`, prompt chỉ gồm phạm vi diff (`git diff origin/main`, gồm file chưa track; review lại → chỉ phần sửa) + đường dẫn `current-task.md`; không kèm nhận định "đã ổn" của phiên viết code. Relay findings cho user. Cổng duy nhất, trước khi push để tạo PR — không gọi trước từng commit, không gọi lại sau khi tạo PR. Diff chỉ có tài liệu → miễn gọi, theo tiêu chí "tính là code" ở `CLAUDE.md` §8.

**NEVER** yêu cầu người dùng chuyển agent trong UI; **NEVER** bỏ bước vì "nhanh hơn".
