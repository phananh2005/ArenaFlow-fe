# Blueprint Claude-framework — ArenaFlow-fe (mức `full`)

> Bước 5 của `UNIVERSAL_AGENT_BOOTSTRAP_PROMPT.md`. Nguồn tham số: `project-profile.md`.
> Trạng thái: **đã duyệt 2026-11-03 và đã triển khai**. Thay đổi sau duyệt (`ui-designer` + Stitch MCP, SRS chép tay vào `docs/agent/business-spec/` — nay thay bằng submodule `docs/agent/upstream` theo FE ADR-0001, `.gitattributes`) ghi ở `project-profile.md` §12.

## 1. Mục tiêu & phạm vi

- Dựng hạ tầng agent cho FE tương đương BE, điều chỉnh cho tầng `frontend` (React + TS + Tailwind + Vitest).
- **Không làm:** code tính năng, chọn thư viện routing/data/state (để ADR ở chức năng đầu tiên), tạo GitHub repo, commit/push.

## 2. Routing (`.claude/AGENTS.md`)

```text
Nhận request
├── Phân tích nghiệp vụ / spec            → chuyển sang repo BE (business-analyst ở ArenaFlow-be)
├── Thiết kế màn hình / chức năng FE      → có spec BE? → solution-architect (FE) → architect-reviewer
├── Implement chức năng mới               → có thiết kế FE? → task-state-init → developer
├── Sửa chức năng đã có                   → developer → test PASS → cập nhật design FE nếu ảnh hưởng
├── Debug                                 → skill debug
├── Review thiết kế / code                → architect-reviewer / code-reviewer
├── ADR                                   → skill decisions-relevance
├── Lệch quy ước lặp lại                  → skill workflow-adapt
└── Hỏi đáp                               → trực tiếp
```

## 3. File sẽ tạo

| Path | Mục đích | Nguồn mẫu | Duyệt |
|---|---|---|---|
| `CLAUDE.md` | Hub §1–§9 (precedence, routing, skill, TDD, hook, state, MUST/NEVER) | `samples/rules/hub.md` + BE `CLAUDE.md` | ✅ cần (file gốc) |
| `.claude/AGENTS.md` | Decision tree + cách coordinator thực thi | `samples/rules/routing.md` | |
| `.claude/agents/developer.md` | TDD Vitest/RTL, cổng `npm test` + `npm run lint` + `npm run build` | `samples/agents/developer.md` | |
| `.claude/agents/code-reviewer.md` | 5 chiều + checklist FE (XSS, token, a11y, re-render, bundle) | `samples/agents/code-reviewer.md` | |
| `.claude/agents/solution-architect.md` | Thiết kế FE từ spec + API_Spec BE | `samples/agents/solution-architect.md` (đổi sang FE) | |
| `.claude/agents/architect-reviewer.md` | Review thiết kế FE | `samples/agents/architect-reviewer.md` | |
| `.claude/skills/{task-state-init,progress-tracker,reuse-scan,code-review,debug,decisions-relevance,workflow-adapt}/SKILL.md` | 7 skill | `samples/skills/*` | |
| `.claude/commands/af-handoff.md`, `af-resume.md` | Lưu / mở lại phiên | `samples/commands/*` | |
| `.claude/settings.json` | Hook `PreToolUse` guard · `PostToolUse` logger · `SessionStart` | BE `.claude/settings.json` | ✅ cần (cấu hình hoạt động) |
| `docs/agent/CLAUDE.md` | Kênh tuỳ biến dự án | `samples/rules/project-knowledge.md` | |
| `docs/agent/README.md` | Cài đặt, điều kiện hook, ownership | BE `docs/agent/README.md` | |
| `docs/agent/adaptation-rules.md` | Bản sao bản đồ thích ứng | `adapters/adaptation-rules.md` | |
| `docs/agent/convention-frontend.md` | Cấu trúc `src/`, alias `@/`, đặt tên, test cạnh source `x.component.test.tsx`, Tailwind, env `VITE_*` | Khung hiện tại | |
| `docs/agent/security-frontend.md` | XSS, lưu token, không log PII, env public | Mới | |
| `docs/agent/non-functional-standards.md` | Chuẩn FE (ngưỡng chờ chốt) | `samples/knowledge/non-functional-standards.md` | |
| `docs/agent/external-knowledge.md` | Nguồn BE: API_Spec, api-convention, business-spec; không suy đoán hợp đồng | `samples/knowledge/external-knowledge.md` | |
| `docs/agent/design-standards.md` + `design/README.md` + `design/_template/{Screen_Flow,Component_Design,State_API_Integration}.md` | Chuẩn + template thiết kế FE | `samples/knowledge/design-standards.md` | |
| `docs/agent/decisions/README.md`, `_template.md` | Kho ADR | `samples/knowledge/decisions/` | |
| `docs/agent/state/_template/*.md` (5 file) | State template | `samples/state/*` | |
| `docs/agent/hooks/agent-hooks.cjs`, `fixture-tests.cjs`, `package.json` | Guard/logger/session-start/secret scan (một module luật) | BE `docs/agent/hooks/*` | ✅ cần |
| `.githooks/pre-commit` | Secret scan staged files | BE `.githooks/pre-commit` | ✅ cần |

## 4. File sẽ sửa

| Path | Thay đổi | Duyệt |
|---|---|---|
| `.gitignore` | Thêm `docs/agent/state/*/` + `!docs/agent/state/_template/`, `.claude/logs/`, `.claude/settings.local.json` | ✅ cần |
| `.git/config` | `git config core.hooksPath .githooks` | ✅ cần (cấu hình hoạt động) |

## 5. Quality gates

| Thời điểm | Gate | Lệnh |
|---|---|---|
| Trước sửa | Có thiết kế FE đã duyệt (chức năng mới); kế hoạch trong `current-task.md`; đánh giá chuẩn phi chức năng | — |
| Trong sửa | TDD Red → Green → Refactor | `npx vitest run <file>` |
| Sau sửa | Test + lint + build PASS, dán output | `npm test` · `npm run lint` · `npm run build` |
| Trước commit | Secret scan pre-commit | `.githooks/pre-commit` |
| Trước khi tạo PR | Agent `code-reviewer` (subagent, context độc lập) trên `git diff origin/main` — cổng review duy nhất (`CLAUDE.md` §8) | — |

## 6. Không tạo

- `business-analyst` (spec nghiệp vụ ở BE).
- Chuẩn truy vấn DB, migration checklist (không có DB).
- `.mcp.json` / Neon (FE không truy cập DB).
- Hook format toàn repo, CI (chưa có remote).

## 7. Thứ tự triển khai (sau khi duyệt)

1. Knowledge (`docs/agent/*`) → 2. Agents + skills + commands → 3. Hub `CLAUDE.md` + `.claude/AGENTS.md`
→ 4. Hooks + fixture test → 5. `.claude/settings.json`, `.gitignore`, `core.hooksPath`
→ 6. Bước 9 kiểm tra (JSON parse, fixture, grep placeholder `<[A-Z_]+>`, grep tên nghiệp vụ BE, `git diff --check`) → 7. Báo cáo Bước 10.
