# CHANGELOG — MATCH-002 Thương lượng ghép kèo luồng B (thiết kế FE)

## [v1.1] — 2026-11-27

**Type:** MINOR (không đổi route public, màn hình, props component dùng chung, store toàn cục) · **Tóm tắt:** Sửa theo `architect-reviewer` (2 MAJOR, 7 MINOR) và review chốt: invalidate hội thoại theo tiền tố, dialog chụp nguyên gói lúc mở, realtime S4 theo `onReady(epoch)` của SHARED v1.2.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | State §3.4 (2.1, 2.7 `CONFIRMED`), §4.3, §5.3 `ended` | Sửa | Invalidate gốc `[QUERY_ROOTS.conversation]` → `CONVERSATION_PREFIXES` (`[conversation,'mine']`, `[conversation,'detail']`) | MAJOR 1 — hợp đồng MATCH-001 Component §8.3, State §3.1 (không đụng `messages`) |
| 2 | State §3.2, §4.2, §6.1, §6.2, §5.3 `busy`; Component §2 (S5–S7), §3.1, §3.2; Screen_Flow §3 S5–S7 | Sửa | Dialog chỉ chụp `revision` → chụp `{ kind, baseRevision, basePairing }`; dialog hiển thị `basePairing`; cache đổi `revision` khi đang mở → cảnh báo + khoá nút; `conflict.previous = basePairing` | MAJOR 2 — API §1.4, UI S7 "xác nhận đúng gói đang thấy"; diff S4e không rỗng |
| 3 | State §4.1 | Sửa | Đội của tôi tải sau 2.4 → song song 2.4 ngay khi mount | MINOR 1 — bỏ waterfall |
| 4 | State §3.4; Component §5 | Thêm | `mergePairingResult` chỉ ghép khi `result.revision ≥ cache.revision`, ngược lại invalidate | MINOR 2 |
| 5 | Screen_Flow §6 C4; Component §5 | Sửa | `getPairingConversationId`: `fetchQuery` với `staleTime: Infinity` | MINOR 3 — `conversationId` không đổi |
| 6 | State §3.2, §3.3, §9 #1; Component §2, §5 | Sửa | Tự lọc `useMyTeams` → `useMatchViewerTeams()` (MATCH-001 §8.1, §8.5) | MINOR 4 |
| 7 | State §3.2, §3.4 (2.1) | Sửa | `usePairingDetail` `staleTime` 0 + `refetchOnMount: 'always'` → `staleTime` 5 s + `refetchOnMount: true`; sau 201 hiển thị ngay từ `setQueryData` | MINOR 5 |
| 8 | Screen_Flow §6 C5 | Ghi nhận | "MATCH-001 đang sửa" → "Đã áp" (MATCH-001 đã bỏ slot `conversationPairingPanel`) | MINOR 6 |
| 9 | Header Screen_Flow, State; State §9 | Sửa | Dải ADR "0003…0008" / liệt kê lẻ → "FE ADR-0002…0008"; bỏ câu số ADR chưa dùng | MINOR 7 |
| 10 | Header 3 tài liệu; State §9 #1 | Sửa | SHARED/APP-SHELL v1.1 → v1.2 | Review chốt |
| 11 | State §1, §4.1, §6.3, §9 #14; Component §5 `usePairingRealtime`; Screen_Flow §1, §3 S1, S4, §6 C12, §7 | Sửa | `onReconnected` + chấp nhận lỡ frame lần kết nối đầu → `subscribe(…, { onError, onReady })`; `onReady(epoch)` tải lại 2.4 khi dữ liệu có trước `SUBSCRIBE` của epoch; link nội bộ truyền `state.conversationId` để đăng ký trước khi tải 2.4. #14 đổi nội dung: còn deep link tải 2.4 hai lần (tối đa 4 call ở (A)) — chặn riêng lần tải lại đó | Review chốt — SHARED v1.2 §6 |

### Ảnh hưởng
- Thiết kế mã khác: thêm Screen_Flow §6 C12 (MATCH-001 link "Mở thương lượng" truyền `state`, không chặn). Các mục C1–C11 không đổi nội dung.
- Không đổi hợp đồng API; căn cứ vẫn `ArenaFlow-spec@53aee11` · API_Spec `v3.1`.
