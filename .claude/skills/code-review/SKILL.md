---
description: >
  Tự kiểm nhanh code theo 5 chiều (Security, Performance, Correctness, Style,
  Reuse & Duplication) ngay trong phiên, TRONG LÚC code. Chỉ kích hoạt khi người dùng yêu cầu
  "tự kiểm nhanh", "self-check". KHÔNG phải cổng trước commit — cổng đó là agent
  code-reviewer chạy subagent (context độc lập).
---

# Code Review (tự kiểm nhanh trong phiên)

> Tiêu chí cụ thể lấy từ knowledge dự án. Skill chỉ định nghĩa 5 chiều — cùng bộ chiều với
> agent `code-reviewer`, bản rút gọn để chạy trong phiên.

> [!IMPORTANT]
> Skill chạy trong chính phiên đã viết code ⇒ là **tự review**, không độc lập.
> **NEVER** dùng skill này thay cổng review trước commit — cổng đó là agent `code-reviewer`
> gọi dưới dạng subagent (`CLAUDE.md` §8).

## Khi dùng
- Người dùng yêu cầu tự kiểm nhanh giữa chừng (trước khi chạy cổng chính thức).

## Quy trình
1. **Phạm vi:** diff nào? Người dùng đã chỉ định → bắt đầu luôn.
2. **5 chiều:**
   - **Security** — secret/token trong code hoặc `VITE_*`, XSS (`dangerouslySetInnerHTML`, URL `javascript:`), log lộ token/PII, lưu token theo `docs/agent/security-frontend.md`.
   - **Performance** — ngưỡng `docs/agent/non-functional-standards.md` (số API call/màn hình, phân trang, bundle), re-render thừa, request trong vòng lặp/effect lặp.
   - **Correctness** — null/biên, loading/empty/error state, dependency của hook, race condition khi gọi API, test đã chạy PASS.
   - **Style** — `docs/agent/convention-frontend.md` (cấu trúc `src/`, đặt tên, Tailwind), a11y cơ bản, kiểu TypeScript chặt (không `any`).
   - **Reuse** — Reuse Report có chưa (khi tạo thành phần dùng chung), trùng với thứ đã có, logic lặp.
3. **Phân loại:** CRITICAL (security hole, mất dữ liệu, logic sai) · MAJOR (hiệu năng, bảo trì) · MINOR (style).
4. **Đề xuất sửa:** mỗi CRITICAL/MAJOR kèm đoạn code gợi ý + `file:line`.

## Liên kết
- Cổng trước commit / trước PR → agent `code-reviewer` (subagent)
