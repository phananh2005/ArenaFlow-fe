# Hồ sơ dự án — ArenaFlow-fe

> **Cách dùng:** đây là **nguồn duy nhất** cho mọi `<PLACEHOLDER>` khi dùng mẫu trong `samples/`.
>
> - Mỗi giá trị **MUST** có cột "Bằng chứng" (path/section trong repo, hoặc "người dùng xác nhận").
> - Không xác định được → ghi `[cần xác nhận]`, KHÔNG đoán.
> - KHÔNG ghi secret, email, URL nội bộ, giá trị `.env`.

## 1. Dự án

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Tên | `ArenaFlow-fe` | `package.json` → `"name": "arenaflow-fe"`, tên thư mục repo |
| Mô tả | Frontend của nền tảng Đặt lịch Sân thể thao & Ghép kèo Thời gian thực; gọi REST API của `ArenaFlow-be` | Người dùng xác nhận (2026-11-03); BE `docs/agent/design/USER-001/API_Spec.md` |
| Loại | `web-app` (SPA) | `index.html`, `src/main.tsx`, `vite.config.ts` |
| Quy mô đội | 1 người | Người dùng xác nhận ở BE (`ArenaFlow-be/.agent-bootstrap/project-profile.md` §1) — `[cần xác nhận]` cho FE |
| Kho lưu mã nguồn | Git local, `main` có 1 commit (`87d3112`), framework trên `chore/agent-framework-bootstrap`; chưa có remote — sẽ tạo GitHub `phananh2005/ArenaFlow-fe` (PUBLIC) | `git log`; người dùng xác nhận 2026-11-03 |
| Ngôn ngữ tài liệu sinh ra | `vi` | Quy tắc ngôn ngữ của prompt |

## 2. Harness (AI agent đang dùng)

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Harness chính | Claude Code | Phiên hiện tại |
| Harness phụ | không có | |
| File hub chỉ dẫn | `CLAUDE.md` | `adapters/harness-matrix.md` |
| Hỗ trợ agent/sub-agent | có | `.claude/agents/*.md` (đã dùng ở BE) |
| Hỗ trợ skill | có | `.claude/skills/<tên>/SKILL.md` |
| Hỗ trợ command do user gọi | có | `.claude/commands/*.md` |
| Hỗ trợ hook | có | `.claude/settings.json → hooks` |
| Điều kiện nạp cấu hình | Mở Claude Code **tại gốc `ArenaFlow-fe`** + workspace đã trust + `node` trên PATH | Phiên bootstrap đang mở tại `ArenaFlow-be` → hook FE chưa chạy trong phiên này |

## 3. Mức áp dụng

| Mục | Giá trị | Lý do |
|---|---|---|
| Mức | `full` | Người dùng chọn (2026-11-03); đồng bộ với BE (`full`) |

## 4. Tầng (layer) — mỗi tầng một dòng

| `id` | Thư mục | Ngôn ngữ | Lệnh build | Lệnh test | Lệnh lint | Tài liệu convention | Bằng chứng |
|---|---|---|---|---|---|---|---|
| `frontend` | `src/` | TypeScript 7.0 + React 19.3 + Tailwind CSS 4.3 (Vite 8.3) | `npm run build` (`tsc -b && vite build`) | `npm test` (`vitest run`, jsdom, Testing Library) | `npm run lint` (`oxlint`) | `docs/agent/convention-frontend.md` (sẽ tạo) | `package.json` → `scripts`; đã chạy 2026-11-03: test 1/1 PASS, build PASS, lint exit 0, `tsc -b` exit 0 |

> Một tầng duy nhất. Test chạy offline, không cần BE/DB. Chạy một file: `npx vitest run <path>`.

## 5. Đường dẫn

| Placeholder | Giá trị | Bằng chứng |
|---|---|---|
| `<AGENT_DIR>` | `.claude` | Harness Claude Code |
| `<KNOWLEDGE_DIR>` | `docs/agent` | Tạo mới — đồng bộ bố cục BE |
| `<STATE_DIR>` | `docs/agent/state` (namespace `local-dev`) | Tạo mới — đồng bộ BE |
| `<HOOKS_DIR>` | `docs/agent/hooks` | Tạo mới — port từ BE |

## 6. Quyền sở hữu & đồng bộ

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| File do generator quản lý (KHÔNG sửa trực tiếp) | `package-lock.json` (chỉ đổi qua `npm install`) | npm |
| File scaffold (được sửa) | `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json`, `index.html` | `create-vite@9.3.3` sinh ra, đã chỉnh trong bước dựng khung |
| Kênh tuỳ biến của dự án | `docs/agent/CLAUDE.md` | Tạo mới — hub gốc trỏ tới |
| Submodule | không có | `git submodule status` rỗng |

## 7. State & bàn giao phiên

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Dùng state task | có | Mức `full` |
| `<DEV_ID>` | `local-dev` | Đồng bộ BE |
| State commit hay gitignore | gitignore (`docs/agent/state/*/`, giữ `_template/`) | Đồng bộ BE |
| Command lưu / mở lại phiên | `af-handoff` / `af-resume` | Tránh trùng `/handoff`, `/resume` built-in; đồng bộ BE |

## 8. Git & review

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Nhánh mặc định | `main` | `git init -b main` |
| Nhánh được bảo vệ | `main` như BE: PR bắt buộc, 0 approval, `enforce_admins`, cấm force-push/xoá — bật khi tạo GitHub repo | Người dùng xác nhận 2026-11-03 |
| Đồng bộ nhánh | Như BE: nhánh khác `main` → `git fetch origin && git rebase --autostash origin/main` (chỉ áp dụng khi đã có `origin`) | BE `CLAUDE.md` §8; người dùng xác nhận 2026-11-03 → `CLAUDE.md` §8 |
| Quy ước tên nhánh | Như BE: `feature/<MÃ>-<mô-tả>` · `docs/<MÃ>-<chủ-đề>` · `chore/agent-framework-<chủ-đề>` | BE `CLAUDE.md` §8; người dùng xác nhận 2026-11-03 |
| Quy ước commit | Conventional-like `type(scope): ...` | `[suy luận]` từ `git log` BE (`docs(USER-001): ...`, `chore(agent-framework): ...`) |
| Cách merge vào `main` | Như BE: `code-reviewer` trước commit khi diff có code (`git diff origin/main`) → push → PR (`gh pr create --base main`), không review lại sau PR; user tự merge hoặc yêu cầu agent `gh pr merge <số> --squash` | BE `CLAUDE.md` §8; người dùng xác nhận 2026-11-03, đổi 2026-11-10 (§12) |
| Nền tảng review | GitHub | Người dùng xác nhận 2026-11-03 |

## 9. Playbook & hook

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Playbook đang bật | TDD bắt buộc (Red → Green → Refactor), không có runtime hook ép thứ tự | Người dùng chọn 2026-11-03 |
| Runtime cho hook | `node` v24.18.0 | `node -v`; `package.json` có sẵn |
| Lưu ý ESM | `package.json` gốc `"type": "module"` → hook viết `.cjs` (Node luôn coi `.cjs` là CommonJS, không cần `docs/agent/hooks/package.json`) | `package.json`; `node docs/agent/hooks/agent-hooks.cjs test` PASS |

## 10. CI

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Có CI trong repo | không | Không có `.github/workflows/` |
| File CI | không có | |

## 11. Thiết kế, ADR, phi chức năng, tra cứu ngoài

| Mục | Giá trị | Bằng chứng |
|---|---|---|
| Có quy trình thiết kế trước khi code | có — `ui-designer` (Stitch MCP) → `solution-architect` (FE) → `architect-reviewer` → `developer` | Người dùng chọn 2026-11-03 |
| Spec nghiệp vụ (SRS) | `docs/agent/business-spec/<MÃ>/` — người dùng tự chép từ BE; FE không có `business-analyst`; agent chỉ đọc | Người dùng chọn 2026-11-03 |
| Thư mục thiết kế FE | `docs/agent/design/<MÃ>/` | Tạo mới |
| `<design-standards>` | `docs/agent/design-standards.md` (bản FE: route, component, state, mapping API) | Tạo mới |
| `<thư mục ADR>` | `docs/agent/decisions/` | Tạo mới |
| Tầng có DB/ORM | không | `package.json` |
| `<non-functional-standards>` | `docs/agent/non-functional-standards.md`: ≤ 3 API call/màn hình · phân trang theo BE (20/100) · timeout 15s + thử lại · debounce 300ms · JS initial ≤ 250 KB gzip · loading/empty/error · a11y cơ bản | Người dùng duyệt 2026-11-03 |
| Nguồn tra cứu ngoài repo | Repo anh em `../ArenaFlow-be`: `docs/agent/design/<MÃ>/API_Spec.md`, `docs/agent/api-convention.md` · Stitch MCP (server `stitch`, HTTP, scope local, key qua header — không commit) | BE tồn tại cạnh FE; người dùng chọn Stitch 2026-11-03 |
| `<external-knowledge>` | `docs/agent/external-knowledge.md` | Tạo mới |

## 12. Quyết định thích ứng

| Ngày | Tín hiệu | Bằng chứng | Điều chỉnh | Lý do | Đảo ngược bằng |
|---|---|---|---|---|---|
| 2026-11-03 | Một tầng duy nhất (`frontend`) | `src/` chỉ có React; không có server code | Bỏ hậu tố tầng (`developer`, `code-reviewer`…); bỏ bước xác định tầng | Repo một tầng | Thêm hậu tố khi có tầng mới |
| 2026-11-03 | Không có test framework sau scaffold | `create-vite` không kèm test | Người dùng duyệt thêm Vitest + Testing Library + jsdom; bật TDD bắt buộc | Đồng bộ BE; cổng test cần lệnh thật | Bỏ TDD qua `workflow-adapt` |
| 2026-11-03 | Không có DB | `package.json` | Chuẩn phi chức năng bỏ phần truy vấn DB; thay bằng chuẩn FE (request, phân trang UI, timeout, bundle, a11y) | Tầng FE không truy vấn DB | — |
| 2026-11-03 | Spec nghiệp vụ + API contract nằm ở repo BE | BE `docs/agent/business-spec/`, `docs/agent/design/*/API_Spec.md` | Không tạo `business-analyst` ở FE; `external-knowledge.md` quy định nguồn BE; hợp đồng API chưa có trong BE → `[cần xác nhận]` | Một nguồn sự thật cho nghiệp vụ/API | Tạo BA ở FE nếu tách spec |
| 2026-11-03 | Thiết kế trước code được bật | Người dùng chọn | Tạo `solution-architect` + `architect-reviewer` bản FE, template thiết kế FE (Screen_Flow, Component_Design, State_API_Integration) | Mẫu gốc thiết kế cho backend | Bỏ tầng thiết kế qua `workflow-adapt` |
| 2026-11-03 | Repo `"type": "module"` | `package.json` | Hook viết CommonJS `.cjs` + `docs/agent/hooks/package.json` `{"type":"commonjs"}` | Tránh vỡ khi Node coi `.js` là ESM | — |
| 2026-11-03 | Chưa có CI, chưa có remote | `git remote -v` rỗng | Có Claude guard + Git pre-commit secret scan; quy tắc fetch/rebase/PR chỉ kích hoạt khi có `origin` | Không lặp CI chưa tồn tại | Cập nhật khi có remote/CI |
| 2026-11-03 | `core.autocrlf=true` trên máy dev Windows | `git config core.autocrlf` | Thêm `.gitattributes` giữ LF cho `.githooks/*`, `*.sh`, `*.cjs`, `*.md` | `pre-commit` CRLF làm `sh` lỗi | Xoá `.gitattributes` |
| 2026-11-03 | FE có file `.env*` (`VITE_*` vào bundle) | `.env.example`, `vite.config.ts` | Secret scan coi `.env*` là `config`; thêm fixture `.env.local` | Chặn commit secret qua biến `VITE_*` | — |
| 2026-11-03 | Repo dùng GitHub | Người dùng xác nhận | Đổi thuật ngữ MR → PR trong skill/template dự án | Khớp nền tảng review | — |
| 2026-11-03 | Người dùng tự chép SRS từ BE sang FE | Người dùng xác nhận | Tạo `docs/agent/business-spec/README.md`; agent đọc SRS local, API_Spec vẫn ở BE | Không cần BA ở FE | Đọc SRS từ BE như cũ |
| 2026-11-03 | Thiết kế giao diện trước khi code bằng Stitch MCP | Người dùng xác nhận | Thêm agent `ui-designer` + template `UI_Design.md` + `ui/`; Stitch cấu hình **local** (không có `.mcp.json`), hướng dẫn ở `external-knowledge.md` §3 | Giữ API key ngoài repo | Bỏ `ui-designer` qua `workflow-adapt` |
| 2026-11-03 | Secret scan bỏ sót key trong khoá có ngoặc kép (`"X-Goog-Api-Key": "…"`) | Kiểm tra luật `sensitive-assignment` khi cân nhắc `.mcp.json` | Thêm luật `quoted-key-assignment` + 4 fixture (bắt key thật, bỏ qua `${VAR}` và nhãn có khoảng trắng) | Chặn commit key dạng JSON/header | — |
| 2026-11-09 | Cổng review trước commit là tự review (skill `code-review` chạy trong phiên viết code) | Người dùng: "dùng agent code-reviewer để review, ko dùng skill vì tránh việc tự làm rồi tự review"; `CLAUDE.md` §8 cũ | Cổng trước commit = agent `code-reviewer` chạy **subagent** (context độc lập, chỉ nhận phạm vi diff); skill `code-review` giữ cho tự kiểm nhanh khi user yêu cầu. Sửa `CLAUDE.md` §3/§4/§8, `.claude/AGENTS.md` §2/§4, agent `code-reviewer`/`developer`, skill `code-review`, `docs/agent/README.md` | Review độc lập, tránh thiên kiến xác nhận; guardrail chặt hơn | Trả §8 về skill `code-review` qua `workflow-adapt` |
| 2026-11-09 | Gọi subagent review cho commit thuần tài liệu là thừa | Người dùng: "nếu không sửa code thì không cần gọi code-reviewer" | Miễn cổng `code-reviewer` khi diff chỉ có tài liệu; liệt kê nhóm file "tính là code" ở `CLAUDE.md` §8, không chắc → coi là code | Tương đồng ngoại lệ "thuần tài liệu" của TDD; giữ cổng cho mọi file ảnh hưởng runtime/build/hook | Bỏ dòng miễn trong `CLAUDE.md` §8 |
| 2026-11-10 | FE review code 2 lần (trước commit + ở bước PR); hai file ghi thời điểm cổng PR mâu thuẫn | PR #6 review 2 lần; người dùng: "Sao chưa review xong đã tạo pr rồi", "thế là trong workflow phải review 2 lần à"; `CLAUDE.md:140` (sau `gh pr create`) ≠ `code-reviewer.md:4` (trước khi tạo PR); BE đã đổi cùng lý do (BE `project-profile.md` §12, 2026-11-05) | Như BE: một cổng `code-reviewer` (subagent) trước commit trên `git diff origin/main` (gồm file chưa track), review lại chỉ phần sửa; bỏ review sau `gh pr create`. Sửa `CLAUDE.md` §3/§8, `.claude/AGENTS.md` §1/§2/§3/§4, agent `code-reviewer`/`developer`, skill `code-review`, `docs/agent/README.md` | Diff so với `origin/main` đã bao mọi commit trên nhánh → commit lọt cổng được review ở commit sau; bớt review trùng. Giữ khác BE: `.claude/settings*.json` vẫn tính là code | Revert commit; đưa lại `code-reviewer` sau `gh pr create` |
| 2026-11-03 | Cân nhắc `.mcp.json` + biến môi trường cho Stitch | Người dùng thử rồi chọn lại scope local (không muốn biến môi trường mức user) | Giữ Stitch ở `~/.claude.json` (scope local); không có `.mcp.json` | Key không vào repo, không vào biến môi trường | `.mcp.json` + `${STITCH_API_KEY}` |
| 2026-11-03 | BE chưa cấu hình CORS | BE `config/WebMvcConfig.java` không có CORS | Dev gọi API qua Vite proxy `/api` → `VITE_DEV_PROXY_TARGET` | Không sửa BE trong phạm vi FE | Bỏ proxy khi BE bật CORS |
| 2026-11-03 | Cần một project Stitch dùng chung cho mọi chức năng | Stitch đã có project `ArenaFlow`; người dùng chọn dùng project này + duyệt design system (LIGHT, `#16A34A`, Be Vietnam Pro, bo 8px) | Ghi project ID + design system ở `external-knowledge.md` §3; `ui-designer` không tạo project mới khi chưa được yêu cầu | Giữ giao diện nhất quán giữa các chức năng | Xoá mục "Project Stitch dùng chung" ở §3 và dòng điều kiện trong `ui-designer.md` |

## 13. Còn chờ xác nhận

- [x] Tạo GitHub repo `phananh2005/ArenaFlow-fe` PUBLIC + protection `main` như BE — đã duyệt 2026-11-03; **chưa thực hiện** (auto mode chặn `gh repo create --public`).
- [x] Áp dụng quy tắc nhánh / rebase / PR-only của BE — đã duyệt 2026-11-03 (`CLAUDE.md` §8).
- [x] Ngưỡng phi chức năng FE — đã duyệt 2026-11-03 (`docs/agent/non-functional-standards.md`).
- [x] Thư viện đã duyệt hướng: `react-router` v7 · `@tanstack/react-query` v5 · `zustand` · `react-hook-form` + `zod` · wrapper `src/core/services/http.service.ts` — ghi ADR-0001 và cài ở chức năng đầu tiên.
- [x] Lưu JWT: access trong bộ nhớ, refresh trong `localStorage` — ghi ADR-0002 ở chức năng đầu tiên (`docs/agent/security-frontend.md` §1).
- [x] Commit khởi tạo `main` (`87d3112`).
- [ ] Commit framework trên `chore/agent-framework-bootstrap` → push → PR — chờ có `origin` và người dùng yêu cầu.
