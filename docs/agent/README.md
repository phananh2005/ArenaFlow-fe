# Hạ tầng Agent — ArenaFlow-fe

> Hướng dẫn sử dụng, ownership và kiểm chứng hạ tầng AI agent.

## Cấu trúc

```text
ArenaFlow-fe/
├── CLAUDE.md
├── .gitattributes                      # Giữ LF cho .githooks, *.cjs, *.md
├── .claude/
│   ├── settings.json                   # Hook Claude Code
│   ├── AGENTS.md                       # Routing
│   ├── agents/
│   │   ├── ui-designer.md              # Thiết kế giao diện bằng Stitch MCP
│   │   ├── solution-architect.md
│   │   ├── architect-reviewer.md
│   │   ├── developer.md
│   │   └── code-reviewer.md
│   ├── skills/
│   │   ├── task-state-init/SKILL.md
│   │   ├── progress-tracker/SKILL.md
│   │   ├── reuse-scan/SKILL.md
│   │   ├── code-review/SKILL.md
│   │   ├── debug/SKILL.md
│   │   ├── workflow-adapt/SKILL.md
│   │   └── decisions-relevance/SKILL.md
│   └── commands/
│       ├── af-handoff.md
│       └── af-resume.md
├── .githooks/pre-commit                # Secret scan staged
├── docs/agent/
│   ├── CLAUDE.md                       # Kiến thức dự án
│   ├── README.md
│   ├── convention-frontend.md
│   ├── security-frontend.md
│   ├── non-functional-standards.md
│   ├── external-knowledge.md           # Tra tài liệu BE (submodule) + Stitch MCP
│   ├── design-standards.md
│   ├── adaptation-rules.md
│   ├── upstream/                       # Submodule ArenaFlow-spec (chỉ đọc): business-spec/, api/, decisions/
│   ├── design/
│   │   ├── README.md
│   │   └── _template/
│   │       ├── UI_Design.md
│   │       ├── Screen_Flow.md
│   │       ├── Component_Design.md
│   │       └── State_API_Integration.md
│   ├── decisions/
│   │   ├── README.md
│   │   └── _template.md
│   ├── state/_template/
│   │   ├── current-task.md
│   │   ├── progress.md
│   │   ├── session-handoff.md
│   │   ├── decisions-log.md
│   │   └── tech-debt.md
│   └── hooks/
│       ├── agent-hooks.cjs
│       └── fixture-tests.cjs
└── .agent-bootstrap/project-profile.md # Hồ sơ dự án
```

## Cách dùng

1. Mở Claude Code tại gốc repo để nạp `CLAUDE.md` và project hooks. Tải tài liệu BE (SRS/API_Spec/ADR) qua submodule:
   ```sh
   git submodule update --init          # cần quyền đọc phananh2005/ArenaFlow-spec; hoặc: git clone --recurse-submodules <url>
   git config submodule.recurse true    # pull/switch tự cập nhật submodule (cấu hình local)
   ```
   Tuỳ chọn: clone `ArenaFlow-be` cạnh repo này (`../ArenaFlow-be`) khi cần đối chiếu code BE.
2. Cấu hình Stitch MCP (scope local, một lần mỗi máy) theo `docs/agent/external-knowledge.md` §3.
3. **Nghiệp vụ / hợp đồng API mới:** làm ở repo BE, merge `main` → workflow BE publish sang `ArenaFlow-spec` → cập nhật con trỏ `docs/agent/upstream` (`docs/agent/external-knowledge.md` §2.2).
4. **Chức năng FE mới:** `ui-designer` (Stitch) → duyệt → `solution-architect` → duyệt → `architect-reviewer` → duyệt → `developer`.
5. **Sửa nhỏ:** thẳng `developer`.
6. Khi implement: skill `task-state-init` → procedure `developer` → `progress-tracker` sau mỗi bước.
7. Kết thúc phiên: `/af-handoff`; tiếp tục phiên: `/af-resume`.
8. Trước commit có thay đổi code: agent `code-reviewer` chạy subagent trên `git diff origin/main` (context độc lập, không tự review trong phiên) — cổng review duy nhất, không review lại sau push / tạo PR; commit thuần tài liệu được miễn (`CLAUDE.md` §8). Git pre-commit quét secret trong staged content.
9. Rà ADR khi cần bằng skill `decisions-relevance`.

## Hooks

Claude Code hooks được cấu hình trong `.claude/settings.json`:

- `PreToolUse` cho `Bash`: chặn force-push vào `main`/`master`, xoá đệ quy target nguy hiểm, `TRUNCATE TABLE`, `DROP` không có `IF EXISTS`.
- `PostToolUse` cho `Bash|Write|Edit`: chỉ ghi thời gian và tên tool vào `.claude/logs/tool-use.jsonl`; không lưu lệnh hoặc nội dung file; log được làm rỗng khi vượt 1 MiB.
- `SessionStart`: nhắc nếu clone chưa cấu hình Git hook, hoặc submodule `docs/agent/upstream` chưa init.

Git pre-commit dùng cùng module secret-scan (gồm file `.env*`). Cấu hình local cho clone hiện tại:

```sh
git config --local core.hooksPath .githooks
```

Gỡ cấu hình local:

```sh
git config --local --unset core.hooksPath
```

`core.hooksPath` không đi theo clone. Cần Node.js trên PATH; thiếu Node thì pre-commit cảnh báo và cho commit. Hooks Claude Code yêu cầu mở phiên ở gốc repo và workspace đã trust. Dùng `/hooks` để xem, chỉnh hoặc tắt.

## Kiểm chứng

```sh
node docs/agent/hooks/fixture-tests.cjs
node docs/agent/hooks/agent-hooks.cjs test
npm test && npm run lint && npm run build
```

Test FE chạy offline (jsdom, mock HTTP) — không cần BE hay DB. Không báo PASS nếu chưa chạy đạt.

## Ownership

| File/thư mục | Chủ sở hữu | Quy tắc |
|---|---|---|
| `CLAUDE.md`, `.claude/` | Dự án | Sửa theo quy trình review; không ghi secret vào settings |
| `docs/agent/CLAUDE.md` | Dự án (kênh tuỳ biến) | Kiến thức dự án, ưu tiên hơn kiến thức tổ chức |
| `docs/agent/non-functional-standards.md` | Dự án | Ngưỡng FE do người dùng chốt 2026-11-03 |
| `docs/agent/adaptation-rules.md` | Dự án | Điều chỉnh sau khi có bằng chứng và được duyệt |
| `docs/agent/upstream/` (submodule) | Repo `ArenaFlow-be` publish sang `ArenaFlow-spec` | Agent chỉ đọc (deny `Edit(...)` — bao cả Write/NotebookEdit; giới hạn: xem `external-knowledge.md` §2); cập nhật con trỏ theo `external-knowledge.md` §2.2 |
| `.gitmodules` | Dự án | Tính là code (review bắt buộc) |
| Cấu hình Stitch MCP | Từng máy dev (scope local) | Không commit; API key không vào repo |
| `package-lock.json` | npm | Chỉ đổi qua `npm install` |
| `.githooks/` | Dự án | Git hooks version-controlled; cần cài `core.hooksPath` riêng mỗi clone |

## Điều kiện sử dụng

- Claude Code mở tại gốc repo, workspace đã trust.
- Node.js có trên PATH để chạy Claude hooks và secret scan.
- Mỗi clone cần cấu hình `core.hooksPath` riêng.
