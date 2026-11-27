# CHANGELOG — MATCH-001 Kèo luồng A, vòng đời kèo & chat dùng chung

## [v1.1] — 2026-11-27

**Type:** MAJOR (bỏ slot `conversationPairingPanel` đã khai cho MATCH-002; đổi hợp đồng realtime cần ở SHARED — `subscribe(…, { onReady })`) · **Tóm tắt:** Sửa thiết kế sau các vòng `architect-reviewer` (đồng bộ phòng chat, số call S13) và áp thay đổi do MATCH-002, REPUTATION-001, MERCENARY-001, SHARED v1.2 yêu cầu.

### Thay đổi

| # | Vị trí | Loại | Cũ → Mới | Lý do |
|---|---|---|---|---|
| 1 | State_API_Integration §4.4; Component_Design §6 `useConversationRealtime` | Sửa | Tải 2.17 song song `SUBSCRIBE` + cờ bù tin → thuật toán `runSync` theo `connectionEpoch` (`onReady`, `restCursor`, `startedTarget`, `firstReadyEpoch`, `AbortController`, đệm frame), bảng kịch bản (a)–(f) | Review: lỡ tin khi mở phòng / kết nối lại, bù trùng, vòng lặp vô hạn (API §1.7) |
| 2 | State_API_Integration §3.1 | Sửa | `conversationKeys.messages` con của `detail` → ngang hàng `detail` | Invalidate đầu phòng không tải lại lịch sử |
| 3 | State_API_Integration §1, §4.4; Component_Design §3 | Sửa | 2.18 gọi khi tải → khi người dùng tương tác (nhịp 3 s, có lần cuối); trang 1 của 2.20 bỏ `refetchOnMount: 'always'`, `staleTime: Infinity` chỉ khi `isPersonalChannelEnabled()` và `connected` | Giảm S13 (A); đúng SHARED v1.2 §6 |
| 4 | State_API_Integration §3.2, §4.4, §4.5; Component_Design §6 | Thêm | `openConversationStore` (phòng đang mở, hiển thị, đã tương tác); `patchConversationLists` cho tin trong phòng đang mở | Khung trái desktop đúng tin cuối / thứ tự (BR-N06) |
| 5 | Component_Design §7, §8.4; State_API_Integration §1, #4, #24 | Xoá | Slot `conversationPairingPanel` (+1 call) → badge `pairingStatus` + link "Mở thương lượng" (0 call) | Quyết định coordinator — ngoài UI MATCH-002 đã duyệt |
| 6 | Screen_Flow §1, §3 S8/S10/S11; Component_Design §2, §5.2, §8; State_API_Integration §1, §4.3 | Thêm / Sửa | Áp MATCH-002 Screen_Flow §6 C1–C8, C11: route Pairing, `PairingEntryArea` (+1 call S10), link "Thương lượng" S11, `CostAgreementFields` + `costAgreementFieldsSchema` / `refineCostAgreement`, `getPairingConversationId(queryClient, pairingId)`, kiểu `useMatchViewerTeams`, `PairingStatusBadge` shared, `pairingKeys` | MATCH-002 |
| 7 | Component_Design §7; Screen_Flow §6 C11, C12 | Đối chiếu | Props slot REPUTATION-001 §6.1/§6.2 và MERCENARY-001 §6.1/§6.2 khớp hai phía; `toSlotApplicationStatus` thu hẹp `applicationStatus` | REPUTATION-001 C7, MERCENARY-001 C11 |
| 8 | Screen_Flow §6 C2, C6, C7, C15, C16, C17 | Thêm / Sửa | Điều kiện kênh cá nhân (`PERSONAL_CHANNEL_ENABLED`); `StatusBadge` tone `tertiary`; ADR-0007 nhiều subscriber; C15/C17 việc cho `ui-designer` (S8, S11, S13); C16 `subscribe(…, { onError?, onReady? })` + `getConnectionEpoch()` — đã áp ở SHARED v1.2 | SHARED v1.2; review |
| 9 | State_API_Integration §2, §3.1, §5 | Sửa | Hợp đồng hàm dưới key dùng chung (trả nguyên response); "invalidate danh sách đội của tôi" = tiền tố `[QUERY_ROOTS.team, 'mine']` | Review (MINOR) |
| 10 | State_API_Integration §8 | Thêm / Sửa | #4 thu hẹp; #5 theo `isPersonalChannelEnabled()`; #2 chỉ còn ADR-0010 chặn; thêm #29 (`RECEIPT`), #30 (link thương lượng S8); câu số ADR trống (0011, 0012) | Review |
| 11 | Header 3 tài liệu | Sửa | SHARED v1.1 → v1.2; phiên bản v1.0 → v1.1 | design-standards §10 |

### Ảnh hưởng
- MATCH-002: không còn slot gói thương lượng trong phòng chat; cấp `buildPairingDetailPath`, `buildMatchPairingsPath`, `buildTeamPairingsPath`, `PairingStatusBadge`, `getPairingConversationId` (Component_Design §8).
- SHARED: realtime theo §6 v1.2 (`onReady`, `getConnectionEpoch`, `PERSONAL_CHANNEL_ENABLED`) — đã áp.
- `ui-designer`: cập nhật UI_Design MATCH-001 S8, S11, S13 (Screen_Flow §6 C15, C17).
- Chưa có code → không ảnh hưởng `src/`.
