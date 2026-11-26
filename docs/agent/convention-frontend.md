# Convention Frontend — ArenaFlow-fe

> Quy ước code cho `src/`. Living document: thêm mục khi đội chốt quy ước mới (qua PR).
> Thư viện routing / data fetching / state / form **chưa cài** — dùng theo ADR khi đã chốt (`docs/agent/decisions/`).

## 1. Stack

| Thành phần | Công cụ | Nguồn |
|---|---|---|
| UI | React 19 + TypeScript | `package.json` |
| Build / dev server | Vite (alias `@/` → `src/`, proxy `/api`) | `vite.config.ts` |
| Style | Tailwind CSS 4 (`@tailwindcss/vite`) | `src/index.css` |
| Test | Vitest (jsdom) + Testing Library + `user-event` + `jest-dom` | `vite.config.ts` → `test`, `src/test/setup.ts` |
| Lint | oxlint | `.oxlintrc.json` |

Lệnh: `npm test` · `npx vitest run <path>` · `npm run lint` · `npm run build` (gồm `tsc -b`).

## 2. Cấu trúc `src/`

> Theo chuẩn Org FE (`app/ core/ modules/ shared/ layouts/ i18n/`), tham chiếu dự án `vdbas_expenditure_service_fe`.

```text
src/
├── main.tsx                 — entry: mount React, nạp index.css + App
├── index.css                — Tailwind + token @theme
├── vite-env.d.ts            — type biến môi trường VITE_*
├── app/                     — gốc ứng dụng: App, providers, route registry, config
├── core/                    — hạ tầng singleton toàn app, không chứa nghiệp vụ
│   ├── auth/                — đăng nhập/đăng xuất, đọc/ghi token
│   ├── guards/              — AuthGuard, RoleGuard bọc route
│   ├── services/            — http.service.ts (wrapper fetch duy nhất), storage…
│   └── session/             — state phiên đăng nhập toàn cục
├── modules/<domain>/        — TOÀN BỘ logic nghiệp vụ theo domain (vd arena, booking, user)
│   ├── api/                 — <domain>.api.ts gọi endpoint BE
│   ├── components/          — component riêng module (gom thư mục con theo màn: list/, view/, form/…)
│   ├── constants/  hooks/  pages/  routes/  store/  types/  utils/
│   └── README.md            — mục đích, use case, business rule của module
├── shared/                  — dùng chung, KHÔNG nghiệp vụ, KHÔNG import từ modules/
│   └── components/  constants/  hooks/  types/  utils/
├── layouts/                 — main-layout, header, sidebar
├── i18n/                    — (dự phòng) config + JSON đa ngôn ngữ; chưa cài thư viện
└── test/                    — setup.ts, fixtures/ dùng chung cho test
```

| Thư mục | Chứa | Không chứa |
|---|---|---|
| `app/` | `app.component.tsx`, `app.providers.tsx`, `app.routes.tsx` (gộp route của mọi module), config | Logic nghiệp vụ |
| `core/` | Hạ tầng load 1 lần: http wrapper, auth, guard, session | Import từ `modules/` |
| `modules/<domain>/` | Page, component, hook, api, type, store riêng của domain | Code dùng ≥ 2 module |
| `modules/<domain>/routes/` | `<domain>.routes.tsx` — khai route của module (lazy), `app.routes.tsx` spread vào | Route của module khác |
| `modules/<domain>/store/` | State client riêng domain | State toàn cục (để ở `core/session/` hoặc `app/`) |
| `shared/` | UI trình bày (Button, Modal…), hook/util/constant/type dùng chung | Gọi endpoint cụ thể, logic nghiệp vụ |
| `layouts/` | Khung trang (header, sidebar, footer) | Logic nghiệp vụ |
| `test/` | Setup + fixture dùng chung | Test của file cụ thể (đặt cạnh source) |

- Hướng phụ thuộc: `app → layouts / modules → shared / core`. **NEVER** `shared/` hay `core/` import `modules/`; **NEVER** module này import module khác — phần dùng chung đưa lên `shared/` (qua `reuse-scan`).
- Thành phần chỉ dùng trong 1 module → để trong `modules/<domain>/`; dùng ≥ 2 module → chuyển lên `shared/`.
- Server state (dữ liệu BE) → lớp data fetching trong `modules/<domain>/hooks/`; **không** đưa vào store.
- Import nội bộ dùng alias `@/…`; chỉ dùng đường dẫn tương đối trong cùng thư mục.

## 3. Đặt tên

**File/thư mục:** pattern `[feature].[type].ts(x)`, kebab-case, tiếng Anh. Ngoại lệ giữ tên do công cụ yêu cầu: `main.tsx`, `index.css`, `vite-env.d.ts`, `test/setup.ts`.

| `[type]` | Ý nghĩa | Ví dụ |
|---|---|---|
| `.page` | Component cấp route | `arena-list.page.tsx` |
| `.component` | UI component (1 component/file) | `login-form.component.tsx` |
| `.hook` | Custom hook | `use-arena-list.hook.ts` |
| `.api` | Gọi endpoint BE | `arena.api.ts` |
| `.service` | Hạ tầng / logic xử lý | `http.service.ts` |
| `.store` | State client | `session.store.ts` |
| `.routes` | Khai báo route | `arena.routes.tsx` |
| `.type` | Định nghĩa type | `arena.type.ts` |
| `.constant` | Hằng | `arena-status.constant.ts` |
| `.util` | Hàm thuần | `format-date.util.ts` |
| `.schema` | Schema validate form | `login.schema.ts` |
| `.test` | Test cạnh source | `login-form.component.test.tsx` |

**Định danh trong code:**

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | `PascalCase` | `LoginForm`, `ArenaListPage` |
| Hook | `useXxx` | `useArenaList` |
| Biến / hàm | `camelCase` | `fetchArenaList` |
| Type/interface | `PascalCase`; DTO giữ tên field camelCase như BE | `UserResponse` |
| Hằng | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |

## 4. Component

- Function component + hook; không class component.
- Props có type tường minh; không `any`. Hạn chế `as` — chỉ dùng khi đã kiểm dữ liệu.
- Tách phần lấy dữ liệu (hook/container) khỏi phần hiển thị khi component > ~150 dòng hoặc có thể tái dùng.
- Semantic HTML trước (`button`, `nav`, `main`, `form`, `label`); `div` có `onClick` là lỗi a11y.

## 5. Gọi API

- Mọi request đi qua wrapper `src/core/services/http.service.ts` (một chỗ gắn `Authorization`, timeout, parse envelope, chuẩn hoá lỗi). **NEVER** gọi `fetch` trực tiếp trong component.
- Base path lấy từ `import.meta.env.VITE_API_BASE_URL` (mặc định `/api/v1`, dev đi qua Vite proxy).
- Envelope, mã lỗi, phân trang, sort, header auth: theo `docs/agent/upstream/api/api-convention.md` §4.3–§4.4, §6–§9. Không chép lại quy tắc vào đây.
- Type request/response bám `API_Spec.md` của chức năng ở BE; field mới chưa có trong spec → `[cần xác nhận]`.

## 6. Style (Tailwind)

- Utility class trực tiếp trong JSX; class lặp lại nhiều nơi → tách component, không tạo CSS global mới.
- Token màu/spacing dùng chung khai báo ở `src/index.css` (`@theme`) khi cần.

## 7. Test

- Truy vấn theo cách người dùng thấy: `getByRole` > `getByLabelText` > `getByText`; `getByTestId` là phương án cuối.
- Tương tác bằng `userEvent.setup()`; kiểm kết quả hiển thị, không kiểm state nội bộ.
- Mock ở ranh giới HTTP (`src/core/services/http.service.ts` hoặc `fetch`), fixture theo envelope BE; không gọi BE thật.
- Mỗi màn hình gọi API: test tối thiểu loading · thành công · empty (nếu là danh sách) · lỗi.

## 8. Biến môi trường

- Chỉ biến tiền tố `VITE_*` được đưa vào bundle → **công khai**; xem `docs/agent/security-frontend.md`.
- Thêm biến mới → cập nhật `.env.example` (kèm comment theo §10.2) + khai báo type trong `src/vite-env.d.ts`.

## 9. File không sửa tay

- `package-lock.json` — chỉ đổi qua `npm install` / `npm uninstall`.

## 10. Comment & JSDoc

> Comment **không** qua `code-reviewer` (`CLAUDE.md` §8) — người viết code tự chịu trách nhiệm đạt mục này.

### 10.1. Comment trong `src/`

- **Mọi** comment — JSDoc `/** */`, khối `/* */`, dòng `//`, `{/* */}` trong JSX — viết **tiếng Việt có dấu**, cả code lẫn test. Giữ nguyên định danh kỹ thuật (tên component/hàm/type, HTTP, `{@link …}`) và chỉ thị công cụ (`@ts-expect-error`, `oxlint-disable-next-line`, `allow-secret`). Chuỗi hiển thị trên UI không thuộc quy tắc này.
- JSDoc giải thích **tại sao / hợp đồng**, không lặp lại code.
- **Bắt buộc JSDoc** (trừ file `*.test.ts(x)`) để người đọc nắm được code mà không phải dò thân hàm:
  - **Mọi component**, **hook**, **hàm** (kể cả không export), hàm gọi API trong `*.api.ts`, action của store — 1 câu nói vai trò (vd "Form đăng nhập bằng email và mật khẩu").
  - **Mọi type / interface** — 1 câu; field có ý nghĩa không hiển nhiên từ tên (đơn vị, định dạng, `null` nghĩa là gì, giờ Việt Nam…) có JSDoc riêng trên field. Mọi field của `Props` component dùng chung (`shared/`) có JSDoc.
  - **Hằng export** — 1 câu (vd "Số bản ghi mỗi trang mặc định").
  - Hàm / hook có hợp đồng không hiển nhiên ghi thêm: endpoint gọi, mã lỗi xử lý và cách hiển thị, query key / invalidate, timeout / thử lại, huỷ request khi unmount hoặc đổi tham số; hàm hiển nhiên chỉ cần 1 câu.
- **Miễn**: handler / callback ẩn danh ngắn trong JSX hoặc truyền cho `map` / `filter`; giá trị union / enum tự đủ nghĩa (`'ACTIVE'`); file chỉ re-export.
- **Test**: bắt buộc 1 comment trên `describe` ngoài cùng (hoặc đầu file) nói test kiểm cái gì; `it` / `test` không bắt buộc — tên mô tả hành vi.
- **Phạm vi áp dụng**: code **mới hoặc bị sửa** trong diff phải đạt; file cũ được chạm tới → bổ sung JSDoc còn thiếu cho phần export của file đó.
- **NEVER** trỏ sang bất kỳ tài liệu nào trong comment: ADR (`ADR-0001`), đường dẫn / mục tài liệu thiết kế / spec (`USER-002 API_Spec §2.4`, `Screen_Flow`), mã neo nghiệp vụ / thiết kế (`BR-T12`, `W6`). Viết mô tả tự đủ nghĩa thay thế — người đọc (dev / AI) không phải mở tài liệu khác. Mã lỗi BE (`TEAM_014`) được dùng vì xuất hiện trong code.

### 10.2. Comment trong file cấu hình

- `.env.example` (và mọi file `.env*`): **mọi biến** có comment `#` tiếng Việt ngay phía trên, nói **mục đích**; **định dạng** (URL, đường dẫn…); **giá trị mặc định / khi nào bắt buộc**; biến `VITE_*` nhắc là **công khai** (vào bundle). Nhiều biến cùng nhóm dùng chung một comment đầu nhóm.
- `vite.config.ts`: option không hiển nhiên (proxy, alias, cấu hình test) có comment.
- File JSON thuần (`package.json`, `.oxlintrc.json`) không comment được → miễn.
- **NEVER** ghi giá trị secret trong comment; ví dụ chỉ dùng chuỗi giả (`<khoá>`). `.env`, `.env.local` không vào Git: agent chỉ thêm / sửa **dòng comment**, không đọc ra hay in giá trị biến.
- Không trỏ tài liệu trong comment (như §10.1).
