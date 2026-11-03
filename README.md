# ArenaFlow-fe

Frontend của ArenaFlow — nền tảng Đặt lịch Sân thể thao & Ghép kèo Thời gian thực. Gọi REST API của [ArenaFlow-be](https://github.com/phananh2005/ArenaFlow-be).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Vitest + Testing Library · oxlint

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # chỉnh VITE_DEV_PROXY_TARGET nếu BE không chạy ở localhost:8080
npm run dev                  # http://localhost:5173, /api được proxy sang BE
```

## Lệnh

| Lệnh | Mục đích |
|---|---|
| `npm run dev` | Dev server |
| `npm test` | Chạy test một lần (`vitest run`) |
| `npm run test:watch` | Test watch mode |
| `npm run lint` | Lint (`oxlint`) |
| `npm run build` | Type-check + build production |
