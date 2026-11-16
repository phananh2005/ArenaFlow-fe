---
task: Đọc SRS / API_Spec / ADR của BE qua submodule ArenaFlow-spec
created: 2026-11-09
status: in_progress
branch: chore/agent-framework-upstream-docs
---

## Mô tả
BE publish tài liệu cần cho FE sang repo chỉ-đọc `phananh2005/ArenaFlow-spec` (GitHub Action ở BE, BE là nguồn duy nhất).
FE gắn repo đó làm git submodule tại `docs/agent/upstream/`, bỏ cơ chế chép SRS tay và bỏ phụ thuộc `../ArenaFlow-be/docs/`.

Cấu trúc `ArenaFlow-spec` (theo prompt đã giao agent BE):
```text
README.md · SOURCE (SHA commit BE)
business-spec/<MÃ>/{Overview,Use_Cases,Business_Rules,Data_Model_Conceptual,Acceptance_Criteria}.md
api/api-convention.md
api/<MÃ>/{API_Spec,CHANGELOG}.md
decisions/*.md
```

## Thiết kế liên quan
không (thay đổi Claude-framework, không có design chức năng)

## Definition of Done
- [x] `.gitmodules` + gitlink `docs/agent/upstream` trỏ `ArenaFlow-spec` nhánh `main`
- [x] Agent không sửa được `docs/agent/upstream/**` bằng Edit/Write (deny trong `.claude/settings.json`)
- [x] SessionStart cảnh báo khi submodule chưa init (có fixture test)
- [x] Mọi tham chiếu `docs/agent/business-spec/<MÃ>/` và `../ArenaFlow-be/docs/agent/...` trong framework đổi sang `docs/agent/upstream/...`
- [x] Bước kiểm tra lệch spec ở đầu `ui-designer`, `solution-architect`, `developer`
- [x] Template design ghi `ArenaFlow-spec@<sha7>` + phiên bản API_Spec làm căn cứ
- [x] ADR FE ghi quyết định
- [x] `node docs/agent/hooks/fixture-tests.cjs`, `node docs/agent/hooks/agent-hooks.cjs test`, `npm test`, `npm run lint`, `npm run build` PASS (dán output)
- [ ] Subagent `code-reviewer` không còn CRITICAL/MAJOR

## Các bước thực hiện (tổng quan)
- [x] 1. Đối chiếu & phân tích ảnh hưởng (đã grep: ~15 file framework tham chiếu BE/business-spec)
- [x] 2. Lập kế hoạch chi tiết — file cần sửa (mục dưới)
- [x] 3. Triển khai: [x] P1 hook (TDD) · [x] P2 cấu hình · [x] P3 tài liệu · [x] P4 thêm submodule @ ac24f0c
- [x] 4. Chạy test & xác nhận PASS (dán output)
- [ ] 5. Review (subagent `code-reviewer`) & chuẩn bị PR

## Lệch thiết kế
| # | Phase | Design | Code thực tế | Lý do | Sửa ở |
|---|---|---|---|---|---|
| 1 | P2 | Không đổi `.oxlintrc.json` / `vite.config.ts` | Thêm `ignorePatterns` + `test.exclude` cho `docs/agent/upstream/**`; bỏ triple-slash `vitest/config` (dư khi đã import) | Review lần 2 (MINOR): phòng khi BE publish file .js/.ts | Kế hoạch P2 (task này) |

## Tái sử dụng
- DÙNG LẠI: `sessionReminder()` + `projectRoot()` trong `docs/agent/hooks/agent-hooks.cjs`; khung fixture trong `fixture-tests.cjs` (spawn hook với `cwd` thư mục tạm).
- VIẾT MỚI: không có thành phần dùng chung mới trong `src/`.

## Kế hoạch chi tiết

### P1 — Hook SessionStart cảnh báo submodule (TDD)
| File | Thay đổi |
|---|---|
| `docs/agent/hooks/fixture-tests.cjs` | **Red:** thêm case: thư mục tạm có `.gitmodules` chứa `docs/agent/upstream` nhưng thiếu `docs/agent/upstream/.git` → stdout `systemMessage` chứa `git submodule update --init`; có `.git` → không nhắc; checkout lệch gitlink (`git submodule status` = `+`) → nhắc `git submodule update` |
| `docs/agent/hooks/agent-hooks.cjs` | **Green:** `sessionReminder` gom nhiều lời nhắc vào **một** `systemMessage`: (a) pre-commit chưa cài (giữ nguyên), (b) submodule `docs/agent/upstream` chưa init. Không gọi mạng (không `fetch`) để giữ trong timeout 5s |

### P2 — Cấu hình
| File | Thay đổi |
|---|---|
| `.claude/settings.json` | Thêm `permissions.deny`: `Edit(docs/agent/upstream/**)`, `Write(docs/agent/upstream/**)` |
| `docs/agent/business-spec/` | **Xoá** thư mục (chỉ có `README.md`); nội dung ownership chuyển sang `external-knowledge.md` |

Không cần đổi `.oxlintrc.json` / `vite.config.ts` / `tsconfig`: repo spec chỉ có `*.md` [cần xác nhận khi repo có nội dung].

### P3 — Tài liệu framework (đổi đường dẫn + quy trình)
Ánh xạ đường dẫn:
| Cũ | Mới |
|---|---|
| `docs/agent/business-spec/<MÃ>/` | `docs/agent/upstream/business-spec/<MÃ>/` |
| `../ArenaFlow-be/docs/agent/design/<MÃ>/API_Spec.md` | `docs/agent/upstream/api/<MÃ>/API_Spec.md` |
| `../ArenaFlow-be/docs/agent/api-convention.md` | `docs/agent/upstream/api/api-convention.md` |
| `../ArenaFlow-be/docs/agent/decisions/` | `docs/agent/upstream/decisions/` |
| `../ArenaFlow-be/src/` | giữ (tuỳ chọn, chỉ để đối chiếu hành vi khi nghi tài liệu cũ) |

| File | Thay đổi |
|---|---|
| `docs/agent/external-knowledge.md` | Viết lại §1–§2: nguồn = submodule; quy trình kiểm tra lệch + cập nhật con trỏ; dẫn nguồn bằng `ArenaFlow-spec@<sha7>` + path; NEVER sửa trong `docs/agent/upstream/`; cần đổi → đề xuất làm ở BE; chưa init → `git submodule update --init` |
| `CLAUDE.md` | §1, §3 (routing: bỏ "chép SRS"), §8: đường dẫn SRS mới; thêm `docs/agent/upstream` (gitlink) và `.gitmodules` vào nhóm **tính là code**; bảng nhánh: bỏ `business-spec` khỏi `docs/<MÃ>`, cập nhật con trỏ đứng riêng → nhánh `chore/spec-sync-<yyyymmdd>` |
| `.claude/AGENTS.md` | Decision tree + §3: bỏ "chép SRS", "chưa có SRS" → "chưa có trong ArenaFlow-spec → yêu cầu BE publish" |
| `docs/agent/CLAUDE.md` | §2: dòng SRS / hợp đồng API trỏ `docs/agent/upstream/` |
| `.claude/agents/ui-designer.md`, `solution-architect.md`, `developer.md` | Đường dẫn mới + **bước kiểm tra lệch** khi bắt đầu (lệnh dưới); lệch → dừng, báo user, đề xuất cập nhật con trỏ |
| `.claude/agents/architect-reviewer.md` | Đường dẫn mới; check: design ghi `ArenaFlow-spec@<sha7>` khớp con trỏ hiện tại |
| `docs/agent/design/_template/UI_Design.md`, `Screen_Flow.md`, `State_API_Integration.md` | Header "Nguồn": đường dẫn mới + dòng `Căn cứ: ArenaFlow-spec@<sha7> · API_Spec vX.Y` |
| `docs/agent/design-standards.md`, `convention-frontend.md` (dòng 101) | Đường dẫn mới |
| `docs/agent/README.md` | Cây thư mục, bước setup (`git clone --recurse-submodules`, `git submodule update --init`, `git config submodule.recurse true`), bảng ownership (`upstream/` = BE publish, agent chỉ đọc) |
| `README.md` | Bước clone kèm submodule |
| `docs/agent/decisions/0001-be-docs-via-spec-submodule.md` | ADR mới theo `_template.md` |
| `.agent-bootstrap/**` | **Không sửa** (hồ sơ bootstrap lịch sử) |

Lệnh kiểm tra lệch (đưa vào procedure):
```sh
git -C docs/agent/upstream fetch origin
git -C docs/agent/upstream log --oneline HEAD..origin/main -- \
  business-spec/<MÃ> api/<MÃ> api/api-convention.md decisions
# có output → lệch; xem CHANGELOG api/<MÃ>: MAJOR → dừng hỏi user
```
Cập nhật con trỏ:
```sh
git submodule update --remote docs/agent/upstream
git diff --submodule=diff -- docs/agent/upstream
git add docs/agent/upstream && git commit -m "chore(spec): đồng bộ ArenaFlow-spec lên <sha7>"
```

### P4 — Thêm submodule (chờ ArenaFlow-spec có commit publish đầu tiên)
```sh
git submodule add -b main https://github.com/phananh2005/ArenaFlow-spec.git docs/agent/upstream
```
Kiểm tra: `git submodule status`, `cat docs/agent/upstream/SOURCE`, cây thư mục đúng cấu trúc ở Mô tả.

## Quyết định user (2026-11-09)
- Con trỏ `docs/agent/upstream` = tài liệu (miễn `code-reviewer`); `.gitmodules` = code.
- Cập nhật con trỏ đứng riêng → nhánh `docs/spec-sync-<yyyymmdd>`; đang làm chức năng → trên `feature/<MÃ>-…`, commit riêng `docs(spec): ...`.
- Không sửa `.agent-bootstrap/**`.
- Cập nhật con trỏ FE giữ **thủ công** (agent kiểm tra lệch khi bắt đầu việc → user duyệt); không dùng Dependabot / repository_dispatch.

## Blockers / Ghi chú
- 2026-11-09 (sau): ArenaFlow-spec đã có (PRIVATE, main @ ac24f0c = ArenaFlow-be@c03b681); P4 xong. Deny Write vào upstream đã thử: bị chặn.
- `agent-hooks.cjs test` treo khi stdin không đóng (parseInput đọc fd 0 trước khi dispatch) — có từ trước, chạy kèm `</dev/null`.
- 2026-11-09: `gh repo view phananh2005/ArenaFlow-spec` → **not found**. P4 bị chặn tới khi repo được tạo và workflow BE publish lần đầu. P1–P3 làm trước được.
- Đường dẫn trong P3 phụ thuộc cấu trúc ArenaFlow-spec ở prompt BE; BE đổi cấu trúc → cập nhật bảng ánh xạ trước khi làm P3.
- Commit sau review chỉ khi user yêu cầu.
