# CLAUDE.md — Hub điều phối của ArenaFlow-fe

> Trang điều phối trung tâm. **Chỉ trỏ** đến kiến thức, agent, skill, playbook — không chứa nội dung chi tiết.
>
> Quy tắc **MUST / NEVER** ở §8 có độ ưu tiên CAO NHẤT.

---

## §1 — Kiến thức nền

### Nạp mọi phiên (`@`) — chỉ file nhỏ, ổn định

@docs/agent/CLAUDE.md

### Tham chiếu — đọc khi cần (KHÔNG `@`)

| File | Đọc khi nào |
|---|---|
| `docs/agent/convention-frontend.md` | Khi viết/sửa code trong `src/` |
| `docs/agent/security-frontend.md` | Khi xử lý xác thực, token, render dữ liệu người dùng, biến môi trường |
| `docs/agent/non-functional-standards.md` | Khi màn hình gọi API, hiển thị danh sách, thêm thư viện |
| `docs/agent/upstream/` | Khi cần SRS / API_Spec / ADR của BE (submodule `ArenaFlow-spec`, chỉ đọc) |
| `docs/agent/external-knowledge.md` | Khi tra tài liệu BE, kiểm tra lệch / cập nhật submodule `ArenaFlow-spec`, hoặc dùng Stitch MCP |
| `docs/agent/adaptation-rules.md` | Khi cần điều chỉnh cách làm việc của agent |

---

## §2 — Kiến thức dự án · GHI ĐÈ §1

> Ưu tiên: Dự án > Tổ chức. Dự án không đề cập → áp dụng Tổ chức.

@docs/agent/CLAUDE.md

---

## §3 — Routing

> Repo một tầng (`frontend`) → không cần xác định tầng. SRS, API_Spec, ADR của BE đọc từ submodule `docs/agent/upstream/` (`ArenaFlow-spec`, BE tự publish khi merge `main`).

@.claude/AGENTS.md

| Request | MUST thực thi | NEVER |
|---|---|---|
| Phân tích yêu cầu nghiệp vụ / làm SRS | người dùng làm ở BE, merge `main` để publish sang `ArenaFlow-spec` → cập nhật con trỏ `docs/agent/upstream` | tự viết/sửa SRS trong repo FE |
| Thiết kế giao diện | kiểm tra SRS trong `docs/agent/upstream/` → chưa có → dừng, yêu cầu BE publish; đã có → `ui-designer` (Stitch MCP) → duyệt | vẽ UI khi chưa có SRS |
| Thiết kế kỹ thuật FE | kiểm tra SRS + UI_Design đã duyệt + API_Spec BE → thiếu → làm bước còn thiếu trước; đủ → `solution-architect` → duyệt → `architect-reviewer` | bỏ qua thiết kế, code thẳng |
| Implement chức năng mới | kiểm tra thiết kế FE → chưa có → `ui-designer` / `solution-architect`; đã có → `task-state-init` → `developer` | code chức năng mới khi chưa có thiết kế |
| Sửa chức năng đã triển khai | `developer` → code & test → kiểm tra ảnh hưởng → cập nhật design FE (nếu có) → `architect-reviewer` (nếu sửa design) → (trước khi tạo PR) agent `code-reviewer` | bỏ qua cập nhật tài liệu khi có ảnh hưởng |
| Debug / lỗi | skill `debug` | đoán nguyên nhân khi chưa reproduce |
| Review thiết kế | procedure `architect-reviewer` | tự sửa thiết kế |
| Review code / chuẩn bị PR | agent `code-reviewer` (subagent, chỉ khi diff có code — §8) | tạo PR khi chưa review; review trước từng commit hay sau khi tạo PR |
| Agent lệch quy ước repo (lặp lại) | skill `workflow-adapt` | tự nới guardrail |
| Hỏi đáp / giải thích / tìm kiếm | xử lý trực tiếp | — |

> Decision tree + cách thực thi: `.claude/AGENTS.md`.
> Coordinator **tự đọc procedure và thực thi inline** — không yêu cầu user chuyển agent thủ công.

---

## §4 — Skills

| Skill | Dùng khi |
|---|---|
| `task-state-init` | Bắt đầu implement tính năng mới |
| `progress-tracker` | Sau mỗi bước implement hoàn thành |
| `reuse-scan` | Trước khi tạo thành phần dùng chung mới (component, hook, util, schema, type) |
| `code-review` | Tự kiểm nhanh **trong lúc** code, khi user yêu cầu — **không** thay cổng review trước PR (§8) |
| `debug` | Debug có hệ thống (reproduce → isolate → diagnose → fix) |
| `workflow-adapt` | Điều chỉnh cách làm việc khi agent lệch quy ước repo |
| `decisions-relevance` | Rà kho ADR khi có quyết định kiến trúc |

---

## §5 — Playbooks

> **TDD luôn bật và bắt buộc** cho mọi thay đổi hành vi code; không có cờ bật/tắt. Thực hiện Red → Green → Refactor bằng Vitest + Testing Library theo `.claude/agents/developer.md`. Chỉ thay đổi thuần tài liệu / style thuần được miễn.

---

## §6 — Hook an toàn

> Hook chạy ở tầng harness. Chỉ liệt kê hook **đã cấu hình và kiểm chứng** — không mô tả chỉ dẫn markdown như enforcement.

- **PreToolUse** (`Bash`) → `docs/agent/hooks/agent-hooks.cjs guard` — chặn lệnh phá huỷ đã định nghĩa.
- **PostToolUse** (`Bash|Write|Edit`) → `docs/agent/hooks/agent-hooks.cjs logger` — chỉ log thời gian và tên tool; không lưu nội dung/lệnh.
- **SessionStart** (`startup|resume|clear`) → nhắc khi Git pre-commit chưa cài, hoặc submodule `docs/agent/upstream` chưa init / đang checkout commit khác con trỏ của nhánh.
- **Git pre-commit** (`.githooks/pre-commit`) → quét secret trong staged files (gồm `.env*`) bằng module chung `docs/agent/hooks/agent-hooks.cjs`.
- **Điều kiện hook Claude Code chạy:** mở harness tại gốc repo · Node.js có trên PATH · workspace đã được trust.
- **Lưu ý:** Git `core.hooksPath` là cấu hình local, không tự đi theo clone; xem `docs/agent/README.md`.

---

## §7 — State & bàn giao phiên

- Thư mục state: `docs/agent/state/local-dev/` (copy từ `docs/agent/state/_template/`). **Một giá trị duy nhất** ở mọi file.
- State cá nhân được gitignore bằng `docs/agent/state/*/`; template `_template/` được giữ trong Git.
- `/af-handoff` lưu phiên · `/af-resume` đọc lại và **hỏi trước khi code tiếp**.

---

## §8 — MUST / NEVER (ưu tiên cao nhất)

### MUST
- **Thiết kế trước khi code:**
  - **Chức năng mới** (màn hình mới, route mới, luồng người dùng mới) → **MUST** có SRS trong `docs/agent/upstream/business-spec/<SRS_DIR>/` (`<SRS_DIR>` tra theo mục lục `docs/agent/upstream/README.md` — `docs/agent/external-knowledge.md` §1.1; có thể là mã khác) → `ui-designer` thiết kế giao diện bằng Stitch → duyệt → có API_Spec ở BE → `solution-architect` sinh thiết kế kỹ thuật FE → duyệt → `architect-reviewer` → duyệt → mới cho `developer` code.
    - **Lệch thiết kế khi đang code:** code khác design → **NEVER** sửa design giữa chừng; **MUST** ghi ngay vào bảng "Lệch thiết kế" trong `current-task.md` (phase · design · code thực tế · lý do · file design cần sửa). Sau khi **mọi phase đã code xong + test PASS** → cập nhật design **một lần** theo bảng → `architect-reviewer` review phần sửa. Thay đổi làm đổi hợp đồng API / luồng màn hình / nghiệp vụ so với design đã duyệt → **dừng, hỏi user** trước khi code (không chỉ ghi lệch).
  - **Sửa chức năng đã có** → `developer` code trước → sau khi test PASS → kiểm tra ảnh hưởng:
    - Có ảnh hưởng giao diện (bố cục / thành phần / màn hình mới) → **MUST** cập nhật `UI_Design.md` qua `ui-designer`
    - Có ảnh hưởng design FE (route / cây component / state / mapping API) → **MUST** cập nhật design → `architect-reviewer` review phần sửa
    - Có ảnh hưởng nghiệp vụ hoặc hợp đồng API → **MUST** dừng, đề xuất người dùng cập nhật SRS / API_Spec ở repo BE (merge `main` để publish) rồi cập nhật con trỏ `docs/agent/upstream`
    - Không ảnh hưởng → bỏ qua cập nhật tài liệu
- TDD **luôn bật và bắt buộc** cho mọi thay đổi làm đổi hành vi code: viết test trước (Red), xác nhận fail đúng lý do, viết code tối thiểu (Green), rồi refactor và chạy lại test.
- Nhận yêu cầu implement **chức năng mới** → **MUST** chạy `task-state-init` trước khi viết code (sau khi thiết kế đã duyệt).
- **MUST** ghi kế hoạch chi tiết vào `current-task.md` và chờ user duyệt — một cổng duyệt duy nhất.
- Màn hình gọi API / hiển thị danh sách / thêm thư viện → **MUST** đọc `docs/agent/non-functional-standards.md` **trước** khi lập kế hoạch; không đạt ngưỡng → dừng, chờ xác nhận.
- Sau khi viết/sửa code → **MUST** chạy `npm test`, `npm run lint`, `npm run build`, dán output, xác nhận PASS. Chạy một file khi TDD: `npx vitest run <path>`. Test chạy offline — mock ở ranh giới HTTP, không cần BE.
- Sau mỗi bước implement → **MUST** chạy `progress-tracker`.
- Trước khi tạo PR (trước lần push đầu để tạo PR; nhánh đã push trước đó, vd để backup → trước `gh pr create`) → **MUST** gọi agent `code-reviewer` dưới dạng **subagent** (context độc lập — ngoại lệ của quy tắc "thực thi inline" ở §3) trên `git diff origin/main` (sau rebase; gồm cả file mới chưa track): chỉ truyền phạm vi diff + đường dẫn `current-task.md`, **không** truyền kết luận/đánh giá của phiên đã viết code. CRITICAL/MAJOR → sửa → commit → gọi lại subagent cho phần sửa; chỉ tạo PR (và lần push đầu để tạo PR) khi không còn CRITICAL/MAJOR (hoặc user chấp nhận rõ). Đây là cổng review **duy nhất**: commit trên nhánh **không** review từng lần; code commit / push thêm sau khi PR đã mở (vd sửa theo comment trên PR) **không** được review lại — rủi ro người dùng đã chấp nhận (2026-11-10). **NEVER** dùng skill `code-review` (tự review trong phiên) thay cho cổng này.
  - **Miễn cổng khi diff không có code:** `git diff origin/main` chỉ gồm tài liệu (`*.md`, `docs/agent/design/`, con trỏ submodule `docs/agent/upstream`, ảnh/HTML mockup trong `ui/`) → **không** cần gọi `code-reviewer`; nêu rõ "miễn review: không có thay đổi code" kèm danh sách file (`git diff --name-only origin/main`).
  - **Tính là code** (vẫn bắt buộc review): `src/**`, `index.html`, `package.json`, `package-lock.json`, `tsconfig*.json`, `vite.config.ts`, `.oxlintrc.json`, `.env.example`, `.gitmodules`, `.claude/settings*.json`, `docs/agent/hooks/**`, `.githooks/**`, mọi file script (`*.js|*.cjs|*.mjs|*.ts|*.tsx|*.sh`). Diff lẫn code + tài liệu → review cả diff. Không chắc file thuộc nhóm nào → coi là code.
- **Đồng bộ `main`** (chỉ khi đã có remote `origin`): trên **mọi nhánh khác `main`**, agent **MUST tự** chạy `git fetch origin && git rebase --autostash origin/main` tại 3 thời điểm: (1) trước khi bắt đầu triển khai một chức năng, (2) trước mỗi commit, (3) trước mỗi push.
  - Conflict khi rebase → `git rebase --abort`, **dừng**, báo danh sách file conflict; **NEVER** tự resolve. Conflict khi áp lại autostash → dừng, báo (stash vẫn còn trong `git stash list`).
  - `fetch` lỗi (mạng/quyền) → báo, **không** khẳng định đã đồng bộ.
  - Rebase kéo về commit mới → chạy lại test liên quan trước khi commit/push.
  - Nhánh đã push trước đó → push sau rebase dùng `git push --force-with-lease` (vẫn chỉ push khi user yêu cầu); **NEVER** `--force`; **NEVER** force-push `main`.
- **Quy ước tên nhánh:** mọi nhánh tạo từ `origin/main` (sau `git fetch origin`); `<MÃ>` viết hoa trùng mã SRS, phần mô tả kebab-case chữ thường.

  | Nhánh | Chứa | Ví dụ |
  |---|---|---|
  | `feature/<MÃ>-<mô-tả>` | Code chức năng mới / sửa chức năng + design FE của chính chức năng đó (commit riêng `docs(<MÃ>): ...`) | `feature/USER-001-login-screen` |
  | `docs/<MÃ>-<chủ-đề>` | Chỉ tài liệu không kèm code: `docs/agent/design/<MÃ>/`, `docs/agent/decisions/` | `docs/USER-001-update-screen-flow` |
  | `docs/spec-sync-<yyyymmdd>` | Chỉ cập nhật con trỏ `docs/agent/upstream` khi không gắn với chức năng đang làm (đang làm chức năng → cập nhật trên `feature/<MÃ>-…`, commit riêng `docs(spec): ...`) — `external-knowledge.md` §2.2 | `docs/spec-sync-20261109` |
  | `chore/agent-framework-<chủ-đề>` | Claude-framework: `CLAUDE.md`, `.claude/`, `.agent-bootstrap/`, `.githooks/`, `docs/agent/hooks/`, `docs/agent/*.md`, các `_template/` | `chore/agent-framework-bootstrap` |

  - **Tự chọn nhánh trước khi bắt đầu việc mới** (Design, code, framework) — **MUST**:
    1. Xác định nhánh đích: Design của chức năng sẽ code → `feature/<MÃ>-<mô-tả>` (code sau làm tiếp trên chính nhánh này); tài liệu không gắn code → `docs/<MÃ>-<chủ-đề>`; framework → `chore/agent-framework-<chủ-đề>`. Chưa rõ `<MÃ>`/nhóm → hỏi user.
    2. Working tree còn thay đổi chưa commit **của việc khác** → **dừng**, hỏi user (commit hay stash); **NEVER** mang sang nhánh mới.
    3. `git fetch origin` → nhánh hiện tại **là** nhánh đích → `git rebase --autostash origin/main`; nhánh đích đã tồn tại → checkout rồi rebase; chưa có → `git switch -c <nhánh-đích> origin/main`.
  - Trước commit: thay đổi thuộc nhóm khác nhánh hiện tại (vd framework trên nhánh `feature/`) → **NEVER** commit lẫn; tách sang nhánh đúng nhóm, không rõ nhóm → hỏi user.
- **Merge vào `main` chỉ qua GitHub Pull Request:** commit → `code-reviewer` trên `git diff origin/main` (diff có code — quy tắc ở trên) → push nhánh → `gh pr create --base main` → user tự merge trên GitHub **hoặc** yêu cầu agent merge bằng `gh pr merge <số> --squash` (chỉ khi user yêu cầu rõ PR nào; mặc định squash). **NEVER** `git merge` / `git rebase` / `git commit` / `git push` trực tiếp lên `main` local hay `origin/main`. Tạo PR vẫn chỉ khi user yêu cầu.
- Debug → **MUST** reproduce trước khi nêu nguyên nhân.

### NEVER
- **NEVER** code chức năng mới khi chưa có thiết kế FE được duyệt.
- **NEVER** báo xong / tick DoD khi test/lint/build chưa chạy hoặc còn fail.
- **NEVER** tạo thành phần dùng chung mới khi chưa có Reuse Report.
- **NEVER** suy đoán hợp đồng API của BE khi chưa tra API_Spec — không tra được → `[cần xác nhận]`.
- **NEVER** sửa code/tài liệu của repo `ArenaFlow-be` hay `ArenaFlow-spec` từ phiên FE — chỉ đọc; cần đổi → đề xuất làm ở repo BE.
- **NEVER** sửa file trong `docs/agent/upstream/` (SRS / API_Spec / ADR do BE publish) — chỉ đọc.
- **NEVER** ghi API key Stitch (hay secret MCP nào) vào file trong repo; Stitch chỉ cấu hình scope local.
- **NEVER** cài thư viện chưa được duyệt (ADR); **NEVER** sửa tay `package-lock.json` (chỉ đổi qua `npm install`).
- **NEVER** đặt secret vào biến `VITE_*` hay commit `.env` / `.env.local`.
- **NEVER** tự commit / push / tạo PR khi chưa được yêu cầu.
- **NEVER** tự sửa tài liệu thiết kế khi đang review (`architect-reviewer`); chỉ ghi findings.
- **NEVER** `@` mọi tài liệu — chỉ `@` file cần ở hầu hết mọi phiên.

---

## §9 — Tự điều chỉnh cách làm việc

- Hạ tầng agent phải khớp repo. Khi agent lệch quy ước repo lặp lại, lệnh trong hub hết đúng, hoặc quy tắc mâu thuẫn code → skill `workflow-adapt`.
- Điều chỉnh đi vào **kênh tuỳ biến** (`docs/agent/`), có bằng chứng, được duyệt, ghi dấu vết. Không nới guardrail ở §8.
