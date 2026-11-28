# ADR-0006: State client toàn cục (phiên đăng nhập) bằng store tự viết + `useSyncExternalStore`, không thêm thư viện state

| | |
|---|---|
| **Trạng thái** | Accepted |
| **Ngày** | 2026-11-28 |
| **Người quyết định** | Product Owner (đã duyệt 2026-11-28) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/convention-frontend.md` §2 (`core/session/`, `modules/<domain>/store/`) · FE ADR-0002 · FE ADR-0004 · `docs/agent/design/SHARED/APP-SHELL/State_API_Integration.md` §3 |

## Bối cảnh (Context)
- State client toàn cục hiện chỉ có **phiên**: `status` (`unknown` / `authenticated` / `anonymous`), `userId`, `role`, lý do kết thúc phiên, đích điều hướng sau đăng nhập. Dữ liệu BE đã do TanStack Query giữ (FE ADR-0004).
- Phiên phải đọc/ghi được **ngoài React** (`http.service`, `realtime.service`) và trong React (guard, header).
- Trạng thái realtime (đang kết nối / mất kết nối) cũng là state client nhỏ, đọc ngoài React.

## Quyết định (Decision)
Chúng tôi **không** thêm thư viện state. Mỗi store toàn cục là một module nhỏ (`*.store.ts`) gồm: giá trị hiện tại, `getSnapshot()`, `subscribe(listener)`, các action; hook React đọc bằng `useSyncExternalStore` (`use-session.hook.ts`). Áp cho:
- `src/core/session/session.store.ts` — phiên.
- `src/core/realtime/` — trạng thái kết nối (FE ADR-0007).
- `modules/<domain>/store/` khi một module cần state client riêng — cùng mẫu.

Snapshot là object bất biến (thay object khi đổi) để `useSyncExternalStore` so sánh tham chiếu. **Không** đặt token vào store (FE ADR-0002).

Phương án đã loại:
- **Zustand:** gọn, dùng được ngoài React, nhưng với 1–2 store nhỏ thì lợi ích không bù một dependency.
- **Redux Toolkit:** nặng, boilerplate nhiều cho phạm vi hiện tại.
- **React Context:** không đọc được ngoài React; đổi giá trị re-render cả cây con.

## Hệ quả (Consequences)

**Tích cực**
- Không thêm bundle; mẫu đơn giản, test được không cần render.

**Tiêu cực / đánh đổi**
- Không có selector / middleware / devtools có sẵn; store lớn lên sẽ phải tự viết thêm.

**Cần theo dõi**
- Có ≥ 3 store client phức tạp (selector, state dẫn xuất, persist) ở nhiều module → ADR mới cân nhắc Zustand.
