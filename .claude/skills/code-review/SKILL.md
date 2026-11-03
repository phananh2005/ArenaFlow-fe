---
description: >
  Review nhanh code theo 5 chiều (Security, Performance, Correctness, Style,
  Reuse & Duplication) trong phiên, TRƯỚC khi commit. Kích hoạt khi implement xong, hoặc khi nghe
  "review", "check code", "kiểm tra code". Review toàn diện trước PR →
  agent code-reviewer.
---

# Code Review (nhanh, trước commit)

> Tiêu chí cụ thể lấy từ knowledge dự án. Skill chỉ định nghĩa 5 chiều — cùng bộ chiều với
> agent `code-reviewer`, bản rút gọn để chạy trong phiên.

## MUST trigger
- Implement xong thay đổi — **trước khi commit**.

**NEVER** commit khi chưa chạy đủ 5 chiều.

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
- Review trước PR → agent `code-reviewer`
