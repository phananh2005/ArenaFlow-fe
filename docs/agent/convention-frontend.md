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

| Thư mục | Chứa | Không chứa |
|---|---|---|
| `api/` | Hàm gọi endpoint BE theo resource (`users.ts`, `arenas.ts`), type request/response | Logic UI, state |
| `lib/` | Hạ tầng dùng chung không gắn nghiệp vụ (`http.ts`, format, utils) | Gọi endpoint cụ thể |
| `components/ui/` | Component trình bày dùng chung (Button, Input, Modal…) — không gọi API | Logic nghiệp vụ |
| `features/<tên>/` | Theo chức năng: component, hook, schema riêng của feature | Code dùng chung nhiều feature |
| `pages/` | Component cấp route, ghép feature + layout | Logic tái dùng |
| `layouts/` | Khung trang (header, sidebar) | |
| `routes/` | Khai báo router, guard | |
| `hooks/` | Hook dùng chung nhiều feature | Hook riêng 1 feature |
| `stores/` | State toàn cục client (phiên đăng nhập, UI toàn cục) | Dữ liệu server (để cho lớp data fetching) |
| `types/` | Type dùng chung toàn app | Type riêng 1 resource API (để ở `api/`) |
| `test/` | Setup + helper test | |

- Thành phần chỉ dùng trong 1 feature → để trong `features/<tên>/`; dùng ≥ 2 feature → chuyển lên thư mục chung (qua `reuse-scan`).
- Import nội bộ dùng alias `@/…`; chỉ dùng đường dẫn tương đối trong cùng thư mục.

## 3. Đặt tên

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | `PascalCase.tsx`, 1 component export chính/file | `LoginForm.tsx` |
| Hook | `useXxx.ts` | `useDebounce.ts` |
| Module khác | `camelCase.ts` | `http.ts`, `formatDate.ts` |
| Test | Cạnh source: `<tên>.test.ts(x)` | `LoginForm.test.tsx` |
| Type/interface | `PascalCase`; DTO giữ tên field camelCase như BE | `UserResponse` |
| Hằng | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |

## 4. Component

- Function component + hook; không class component.
- Props có type tường minh; không `any`. Hạn chế `as` — chỉ dùng khi đã kiểm dữ liệu.
- Tách phần lấy dữ liệu (hook/container) khỏi phần hiển thị khi component > ~150 dòng hoặc có thể tái dùng.
- Semantic HTML trước (`button`, `nav`, `main`, `form`, `label`); `div` có `onClick` là lỗi a11y.

## 5. Gọi API

- Mọi request đi qua wrapper `src/lib/http.ts` (một chỗ gắn `Authorization`, timeout, parse envelope, chuẩn hoá lỗi). **NEVER** gọi `fetch` trực tiếp trong component.
- Base path lấy từ `import.meta.env.VITE_API_BASE_URL` (mặc định `/api/v1`, dev đi qua Vite proxy).
- Envelope, mã lỗi, phân trang, sort, header auth: theo `../ArenaFlow-be/docs/agent/api-convention.md` §4.3–§4.4, §6–§9. Không chép lại quy tắc vào đây.
- Type request/response bám `API_Spec.md` của chức năng ở BE; field mới chưa có trong spec → `[cần xác nhận]`.

## 6. Style (Tailwind)

- Utility class trực tiếp trong JSX; class lặp lại nhiều nơi → tách component, không tạo CSS global mới.
- Token màu/spacing dùng chung khai báo ở `src/index.css` (`@theme`) khi cần.

## 7. Test

- Truy vấn theo cách người dùng thấy: `getByRole` > `getByLabelText` > `getByText`; `getByTestId` là phương án cuối.
- Tương tác bằng `userEvent.setup()`; kiểm kết quả hiển thị, không kiểm state nội bộ.
- Mock ở ranh giới HTTP (`src/lib/http.ts` hoặc `fetch`), fixture theo envelope BE; không gọi BE thật.
- Mỗi màn hình gọi API: test tối thiểu loading · thành công · empty (nếu là danh sách) · lỗi.

## 8. Biến môi trường

- Chỉ biến tiền tố `VITE_*` được đưa vào bundle → **công khai**; xem `docs/agent/security-frontend.md`.
- Thêm biến mới → cập nhật `.env.example` + khai báo type trong `src/vite-env.d.ts`.

## 9. File không sửa tay

- `package-lock.json` — chỉ đổi qua `npm install` / `npm uninstall`.
