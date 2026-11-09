# Tra cứu tri thức ngoài repo — ArenaFlow-be & Stitch MCP

> SRS, hợp đồng API và ADR của BE đến FE qua repo chỉ-đọc **`ArenaFlow-spec`**, gắn làm git submodule tại
> `docs/agent/upstream/`. Nguồn sự thật vẫn là `ArenaFlow-be`: workflow `publish-spec` của BE tự đẩy tài liệu sang
> `ArenaFlow-spec` khi merge vào `main`. Không ghi URL nội bộ, token, API key vào file này.

## 1. Nguồn có sẵn

| Nguồn | Đường dẫn / tên | Dùng cho |
|---|---|---|
| **Mục lục** | `docs/agent/upstream/README.md` | **Tra đầu tiên** — mã → thư mục SRS, API_Spec, phiên bản, CHANGELOG (§1.1) |
| SRS | `docs/agent/upstream/business-spec/<SRS_DIR>/` | Use case, business rule, quyền, acceptance criteria |
| Hợp đồng API | `docs/agent/upstream/api/<MÃ>/API_Spec.md` | Endpoint, request/response, mã lỗi của chức năng |
| Lịch sử hợp đồng API | `docs/agent/upstream/api/<MÃ>/CHANGELOG.md` (có thể chưa có) | Thay đổi MAJOR/MINOR giữa các phiên bản API_Spec |
| Quy ước API chung | `docs/agent/upstream/api/api-convention.md` | Base URL, envelope, mã lỗi, phân trang, sort, header auth |
| ADR BE | `docs/agent/upstream/decisions/` | Quyết định ảnh hưởng FE (vd JWT, 409, upload ảnh) |
| Commit BE nguồn | `docs/agent/upstream/SOURCE` | SHA commit `ArenaFlow-be` của lần publish đang gắn |
| Code BE (tuỳ chọn) | `../ArenaFlow-be/src/` | Xác nhận hành vi thực tế khi nghi tài liệu đã cũ — cần clone BE cạnh FE |
| Stitch MCP | server `stitch` (cấu hình local) | Thiết kế giao diện — chỉ dùng trong `ui-designer` |

### 1.1 Tra theo mã chức năng

1. Mở mục lục `docs/agent/upstream/README.md`, tìm dòng `<MÃ>`.
2. Cột **SRS** cho `<SRS_DIR>` — **có thể là mã khác** (ghi "SRS trong X" → `<SRS_DIR>` = `X`). Vd tại `ArenaFlow-spec@ac24f0c`: `USER-001`, `VENUE-001` → `SYSTEM-001`; `USER-002` → `USER-002`.
3. Cột **API_Spec / CHANGELOG** có thể là `—` (chưa có). Không có `<MÃ>` trong mục lục, hoặc thiếu SRS/API_Spec cần dùng → dừng, đề xuất làm ở BE (§2).
4. **NEVER** ghép cứng `business-spec/<MÃ>/` khi chưa tra mục lục.

### 1.2 Đường dẫn bên trong tài liệu BE

Tài liệu trong `upstream/` giữ nguyên đường dẫn theo bố cục repo BE. Khi gặp, đổi như sau — **không** đọc nhầm sang thư mục cùng tên của FE:

| Đường dẫn ghi trong tài liệu BE | Đọc ở FE |
|---|---|
| `docs/agent/business-spec/<X>/` | `docs/agent/upstream/business-spec/<X>/` |
| `docs/agent/design/<X>/API_Spec.md`, `CHANGELOG.md` | `docs/agent/upstream/api/<X>/…` |
| `docs/agent/api-convention.md` | `docs/agent/upstream/api/api-convention.md` |
| `docs/agent/decisions/NNNN-…` | `docs/agent/upstream/decisions/NNNN-…` |
| `docs/agent/design/<X>/` khác (Processing_Flow, Component_Class_Design), `src/`, `docs/database/` | Không publish — nội bộ BE; cần thì đọc `../ArenaFlow-be` (tuỳ chọn) |

ADR BE và ADR FE trùng dải số → dẫn rõ: **`BE ADR-NNNN`** (`docs/agent/upstream/decisions/`) và **`FE ADR-NNNN`** (`docs/agent/decisions/`).

## 2. Quy tắc tra tài liệu BE

- **MUST** tra `docs/agent/upstream/` (bắt đầu từ mục lục §1.1) khi cần: field/DTO, mã lỗi, phân trang, quyền ở mức API, business rule.
- **NEVER** suy đoán hợp đồng API ("chắc BE trả field này") — không tra được → `[cần xác nhận]`.
- **NEVER** sửa file trong `docs/agent/upstream/` hay trong `../ArenaFlow-be` — bằng **bất kỳ** cách nào (tool, Bash, PowerShell, script). **Ngoại lệ duy nhất:** đổi bản checkout bằng `git submodule update` theo §2.1/§2.2 khi người dùng đồng ý — không sửa nội dung file. Cần đổi SRS/hợp đồng → đề xuất, người dùng làm ở repo BE. Lớp chặn ở harness chỉ là một phần:
  - `.claude/settings.json` có deny `Edit(/docs/agent/upstream/**)`. `/` đầu = neo theo **primary working directory** (thư mục khởi động phiên, hoặc thư mục đích sau khi chạy lệnh `/cd` của Claude Code), không theo thư mục hiện tại sau `cd` trong shell; chỉ trùng gốc repo khi phiên đang ở gốc repo (`CLAUDE.md` §6) → **không** `/cd` sang thư mục con. Trong worktree → neo theo gốc worktree.
  - `../ArenaFlow-be`: **không** có rule deny nào ở harness — chỉ có quy tắc NEVER này.
  - Rule chặn: tool sửa file built-in (Edit/Write/NotebookEdit) và lệnh Bash Claude Code nhận diện (vd `sed`, redirect `>`; `tee` cần Claude Code ≥ v2.1.269).
  - **Không được đảm bảo** chặn: lệnh Bash khác (`cp`, `mv`, `rm`, `git` trong submodule), script tự ghi file (`node`, `python`), PowerShell (`Set-Content`, `Out-File`, `>`).
- Kết luận từ tài liệu BE **MUST** dẫn `ArenaFlow-spec@<sha7>` + `path` (+ mục/dòng khi có). Lấy `<sha7>`: `git -C docs/agent/upstream rev-parse --short HEAD` — chỉ sau khi `git submodule status -- docs/agent/upstream` không có `+`/`-` (`external-knowledge.md` §2.1 bước 0).
- Tài liệu và code BE lệch nhau → nêu rõ, ghi `[cần xác nhận]`, không tự chọn.
- Chức năng chưa có trong `docs/agent/upstream/` (thiếu SRS hoặc API_Spec) → dừng, đề xuất người dùng làm ở BE và merge vào `main` để publish.
- Thư mục `docs/agent/upstream/` rỗng → submodule chưa init: báo người dùng chạy `git submodule update --init` (cần quyền đọc `phananh2005/ArenaFlow-spec`); làm tiếp phần không phụ thuộc, ghi rõ phần **chưa kiểm chứng**.

### 2.1 Kiểm tra lệch (MUST khi bắt đầu `ui-designer`, `solution-architect`, `developer`)

```sh
git submodule status -- docs/agent/upstream    # bước 0: bản đang checkout = con trỏ của nhánh?
git -C docs/agent/upstream fetch origin
git -C docs/agent/upstream log --oneline HEAD..origin/main -- \
  README.md business-spec/<SRS_DIR> api/<MÃ> api/api-convention.md decisions
```

- **Bước 0:** dòng bắt đầu bằng `+` → thư mục submodule đang ở commit khác con trỏ của nhánh (vd sau `git pull`/`git switch` khi chưa bật `submodule.recurse`) → **dừng**, báo người dùng chạy `git submodule update`; bắt đầu bằng `-` → chưa init. Chỉ khi không có `+`/`-` thì `git -C docs/agent/upstream rev-parse --short HEAD` mới đúng là `<sha7>` để ghi `Căn cứ`.
- `<SRS_DIR>` tra theo §1.1 (từ mục lục của **cả** bản đang gắn và `origin/main` — nếu khác nhau, đưa cả hai vào lệnh).
- Không có output → khớp bản mới nhất, làm tiếp.
- Có output → **dừng, báo người dùng** danh sách commit + đề xuất cập nhật con trỏ (§2.2). Đánh giá mức thay đổi API:
  - Có `api/<MÃ>/CHANGELOG.md` → xem mục mới; có **MAJOR** → nêu rõ, thiết kế/code FE của `<MÃ>` phải rà lại.
  - Không có CHANGELOG → so trực tiếp: `git -C docs/agent/upstream diff HEAD origin/main -- api/<MÃ>`; tự phân loại không được → coi như MAJOR, hỏi người dùng.
- `fetch` lỗi (mạng/quyền) → báo, **không** khẳng định đã khớp.

### 2.2 Cập nhật con trỏ submodule

```sh
git submodule update --remote docs/agent/upstream
git diff --submodule=diff -- docs/agent/upstream   # xem toàn bộ thay đổi tài liệu
git add docs/agent/upstream
git commit -m "docs(spec): đồng bộ ArenaFlow-spec lên <sha7>"
```

- Chỉ cập nhật khi người dùng đồng ý; commit vẫn theo `CLAUDE.md` §8 (chỉ khi được yêu cầu).
- Nhánh: đang làm chức năng → ngay trên `feature/<MÃ>-…`, commit riêng; cập nhật đứng riêng → `docs/spec-sync-<yyyymmdd>`.
- Con trỏ là **tài liệu** (miễn `code-reviewer`); `.gitmodules` là **code**.
- Một lần cập nhật kéo theo tài liệu của **mọi** chức năng → rà ảnh hưởng tới mọi `docs/agent/design/<MÃ>/` đã có (so `Căn cứ: ArenaFlow-spec@<sha7>` ở header từng design).
- Rebase gặp conflict ở con trỏ submodule → `git rebase --abort`, dừng, báo (như §8).

## 3. Stitch MCP (thiết kế giao diện)

### Cài đặt (mỗi máy dev, scope local — KHÔNG commit)

Người dùng tự chạy tại gốc repo, thay `<api-key>` bằng key của mình:

```sh
claude mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: <api-key>"
```

- Scope mặc định `local`: lưu trong `~/.claude.json` (mục của project này), ngoài repo, chỉ áp dụng cho repo này trên máy này. Repo **không** có `.mcp.json`.
- **Chạy lệnh trong terminal riêng, ngoài Claude Code** — chạy bằng `!` trong phiên thì key nằm lại trong lịch sử phiên.
- Kiểm tra: `claude mcp list` hoặc `/mcp` trong phiên mới. Gỡ: `claude mcp remove stitch -s local`.
- Đổi key / key bị lộ (dán vào chat, log, commit): thu hồi key trên trang quản lý key → `claude mcp remove stitch -s local` → `claude mcp add …` với key mới.

### Project Stitch dùng chung

| Thuộc tính | Giá trị |
|---|---|
| Tên project | `ArenaFlow` |
| Project ID | `2789586751825382546` (dạng tài nguyên: `projects/2789586751825382546`) |
| Design system | `ArenaFlow` — `assets/17011466837528823159` |

Theme đã duyệt (2026-11-03):

| Token | Giá trị |
|---|---|
| Chế độ màu | `LIGHT` |
| Màu gốc (seed) | `#16A34A` — xanh lá sân cỏ, `colorVariant: TONAL_SPOT`. **Không** dùng trực tiếp làm token màu trong code: Stitch phối ra bảng màu từ màu gốc, nên lấy màu thực tế từ HTML đã xuất ở `docs/agent/design/<MÃ>/ui/` |
| Font tiêu đề / nội dung / nhãn | `BE_VIETNAM_PRO` |
| Bo góc | `ROUND_EIGHT` (8px) |

- Mọi màn hình của mọi chức năng **MUST** sinh trong project này; **NEVER** tạo project Stitch mới (`create_project`) khi chưa được người dùng yêu cầu.
- Design system của project áp cho mọi màn hình — đổi design system → hỏi người dùng trước (ảnh hưởng mọi `UI_Design.md` đã duyệt); đổi xong → cập nhật bảng theme ở trên trong cùng thay đổi. Nguồn chuẩn là Stitch; bảng là bản chụp tại ngày duyệt.
- Không truy cập được project (bị xoá / mất quyền) → **dừng**, báo người dùng; không tự tạo project thay thế.

### Quy tắc dùng

- Chỉ `ui-designer` dùng Stitch; agent khác chỉ đọc kết quả đã lưu trong `docs/agent/design/<MÃ>/`.
- **NEVER** ghi API key vào file trong repo, prompt, log, tài liệu; **NEVER** hỏi người dùng dán key vào chat.
- **NEVER** gửi secret, dữ liệu cá nhân thật, URL nội bộ vào prompt Stitch — chỉ mô tả nghiệp vụ.
- Server chưa cấu hình / lỗi xác thực → dừng bước thiết kế UI, báo người dùng cài theo mục trên; không chuyển sang cách khác để vượt qua.
- Kết quả Stitch chỉ có giá trị khi đã lưu vào `UI_Design.md` + `ui/` và được người dùng duyệt.
