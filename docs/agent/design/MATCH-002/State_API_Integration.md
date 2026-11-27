# State & API Integration — MATCH-002 Thương lượng ghép kèo luồng B (Pairing)

| Mục | Giá trị |
|---|---|
| Mã chức năng | `MATCH-002` |
| Phạm vi tầng | frontend (ArenaFlow-fe) — hợp đồng API thuộc BE |
| Nguồn API | `docs/agent/upstream/api/MATCH-002/API_Spec.md` (+ `CHANGELOG.md`) · `docs/agent/upstream/api/api-convention.md` · MATCH-001 `API_Spec.md` 2.3, §1.6, §1.7, 2.19, §4.1 · USER-003 `API_Spec.md` 2.5 · SYSTEM-002 `API_Spec.md` §1.1 · BE ADR-0003 (CAS `revision`), ADR-0014 (STOMP), ADR-0017 (giờ Việt Nam) |
| Căn cứ | `ArenaFlow-spec@53aee11` · API_Spec `v3.1` (MATCH-001 `v3.2`, USER-003 `v2.0`, SYSTEM-002 `v1.2`) |
| Quy ước áp dụng | `docs/agent/convention-frontend.md` §5, `docs/agent/non-functional-standards.md`, `docs/agent/security-frontend.md` · SHARED/APP-SHELL `State_API_Integration.md` v1.2 (http, query key, realtime) · MATCH-001 `State_API_Integration.md` v1.0 · FE ADR-0002…0008 (`Proposed`; dùng trực tiếp 0004, 0005, 0007, 0008) |
| Tác giả / Ngày / Phiên bản | `solution-architect` (agent) / `2026-11-27` / `v1.1` (lịch sử: `CHANGELOG.md`) |

> Mọi request qua `http.service` (SHARED §2). Field của type **trỏ** API_Spec — không chép bảng field. "2.x" không ghi mã = MATCH-002 `API_Spec.md`.

## 1. Endpoint dùng theo màn hình

| Màn | Thời điểm gọi | Method + path | API_Spec | Số call khi tải |
|---|---|---|---|---|
| S10 vùng (đội khác) | Khi biết vai trò + đội đang chọn; đổi đội | `GET /teams/{teamId}/pairings?role=INTERESTED&status=ALL&page=1&pageSize=100` → lọc `matchId` | 2.3 | 0–1 (+ 2.3 MATCH-001, đội của tôi: MATCH-001) |
| S10 vùng (đội tạo kèo) | — | — | — | 0 |
| S1 | Mở dialog | — (dữ liệu kèo + đội đã có) | — | 0 |
| S1 | "Nhận kèo" | `POST /matches/{matchId}/pairings` | 2.1 | — |
| S2 | Tải | `GET /matches/{matchId}` (cache với S10) | MATCH-001 2.3 | 0–1 |
| S2 | Tải / đổi tab / trang | `GET /matches/{matchId}/pairings?status&page&pageSize=20` | 2.2 | 1 |
| S3 | Tải (cache 5 phút, chung MATCH-001) | `GET /profile/teams?page=1&pageSize=100` | USER-003 2.5 | 0–1 |
| S3 | Tải / đổi lọc / trang | `GET /teams/{teamId}/pairings?role&status&page&pageSize=20` | 2.3 | 1 |
| S4 | Tải — có `state.conversationId`: sau `onReady` đầu (§6.3); không có: ngay khi mount | `GET /pairings/{pairingId}` | 2.4 | 1 |
| S4 | `onReady(epoch)` khi dữ liệu 2.4 có trước `SUBSCRIBE` của epoch (deep link; sau 201 S1; mọi lần kết nối lại) | `GET /pairings/{pairingId}` | 2.4 | 0–1 (§6.3) |
| S4 | Sau 2.4 (cần `matchId`) ‖ song song với đội của tôi | `GET /matches/{matchId}` · `GET /profile/teams?page=1&pageSize=100` | MATCH-001 2.3 · USER-003 2.5 | 0–1 · 0–1 |
| S4 | Frame `PAIRING_UPDATED` đổi trạng thái gói; vừa quá `matchExpiresAt`; sau lỗi ghi cần tải lại | `GET /pairings/{pairingId}` | 2.4 | — (sau tải) |
| S5 / S6 / S7 | Mở dialog | — | — | 0 |
| S5 | "Chốt phương án" (khác phương án đang có) | `PUT /pairings/{id}/proposal` | 2.5 | — |
| S6 | "Lưu chi phí" | `PUT /pairings/{id}/cost-agreement` | 2.6 | — |
| S7 | "Xác nhận" | `POST /pairings/{id}/confirm` | 2.7 | — |
| MATCH-001 S8 kèo B | "Nhắn tin với <đội kia>" | `GET /pairings/{confirmedPairingId}` (bỏ khi có cache) | 2.4 | — (thao tác) |
| MATCH-001 S13 luồng B | — | — (link `buildPairingDetailPath`, badge từ 2.19) | — | 0 |

**Tổng API call khi tải** — ngưỡng ≤ 3 (`non-functional-standards.md` §2); ba cách tính theo MATCH-001 State §1 (chờ SHARED State §7 #1):
- **(A)** chỉ call của màn · **(B)** = (A) tối đa + hồ sơ header (USER-001) + huy hiệu "Lời mời của tôi" (USER-003) · **(C)** = (B) + `unread-count` (NOTIFICATION-001) + chấm "Tin nhắn" (MATCH-001 2.20).

| Màn | (A) | (B) | (C) | Kết luận |
|---|---|---|---|---|
| S10 + vùng, người xem là đội khác | 1–3 (2.3 MATCH-001 + đội + 2.3) | 5 | 7 | Đạt (A); vượt (B)/(C) — #2 (như MATCH-001 S5) |
| S10 + vùng, người xem là đội tạo kèo | 1–2 | 4 | 6 | Như trên |
| S2 | 1–2 (2.3 MATCH-001 + 2.2) | 4 | 6 | Như trên |
| S3 | 1–2 (2.3 + đội) | 4 | 6 | Như trên |
| S4 — link nội bộ (có `state.conversationId`) | 1–3 (2.4 + 2.3 MATCH-001 + đội) | 5 | 7 | Như trên |
| S4 — deep link (URL, thông báo, chat) | 2–4 (+ 2.4 lần hai ở `onReady` đầu) | 6 | 8 | **Vượt ở (A)** khi cả 2.3 MATCH-001 và đội của tôi chưa có cache — #14 |
| S5–S7 | 0 | — | — | Đạt |

- Không gọi API theo từng phần tử: dòng S2/S3 dùng dữ liệu §4.3 (uy tín `interestedTeamReliabilityScore`, tên phương án tra từ `venueOptions`/`timeOptions` của 2.3 đã tải — không gọi REPUTATION-001 2.9 hay VENUE-001).
- Vùng S10 chỉ tra **một** đội (đội đang chọn) — không lặp theo số đội (tránh N+1).

## 2. Hàm API & type

| Hàm | Đường dẫn | Request | Response | `http` |
|---|---|---|---|---|
| `createPairing(matchId, body)` | `src/modules/match/api/pairing.api.ts` | `{ teamId }` (2.1) | `PairingDetail` (§4.2) | `post` |
| `getMatchPairings(matchId, params, signal)` | ″ | `MatchPairingListParams` `{ status, page, pageSize }` | `Page<PairingSummary>` (§4.3) | `getPage` |
| `getTeamPairings(teamId, params, signal)` | ″ | `TeamPairingListParams` `{ role, status, page, pageSize }` | `Page<PairingSummary>` | `getPage` |
| `getPairing(pairingId, signal)` | ″ | — | `PairingDetail` | `get` |
| `savePairingProposal(pairingId, body)` | ″ | `SaveProposalRequest` (2.5) | `SaveProposalResult` (2.5 Response) | `put` |
| `savePairingCost(pairingId, body)` | ″ | `SavePairingCostRequest` (2.6: `CostAgreementRequest` MATCH-001 + `teamId`, `revision`, `depositAmount`, `depositHolder`) | `SavePairingCostResult` (2.6 Response) | `put` |
| `confirmPairing(pairingId, body)` | ″ | `{ teamId, revision }` (2.7) | `ConfirmPairingResult` (2.7 Response) | `post` |

- Type: `src/modules/match/types/pairing.type.ts` — `PairingDetail`, `PairingTeam`, `PairingProposal` (§4.2), `PairingSummary` (§4.3), 3 kết quả 2.5–2.7, body request, `PairingUpdatedFrame` (§1.6), `PairingSide = 'AUTHOR' | 'INTERESTED'`. `costAgreement` dùng type `CostAgreement` của MATCH-001 (cùng 7 field). `PairingStatus` từ `shared/constants/pairing-status.constant.ts`.
- `status` / `change` / `venueStatus` khai union đã biết; `PairingStatusBadge` nhận `string` (giá trị lạ không làm vỡ UI).
- Thời gian là `string` giờ Việt Nam không offset (JSDoc field — `convention-frontend.md` §10.1); không `new Date(chuoi)` (FE ADR-0008).
- MATCH-002 không có endpoint dùng `USER_001` nghĩa "tài khoản đang đăng nhập đã xoá" → không khai `accountGoneCodes`.

## 3. State

### 3.1. Query key (FE ADR-0004)

```ts
// src/modules/match/constants/pairing-query-keys.constant.ts
export const pairingKeys = {
  all: [QUERY_ROOTS.pairing] as const,
  detail: (pairingId: string) => [...pairingKeys.all, 'detail', pairingId] as const,
  lists: () => [...pairingKeys.all, 'list'] as const,
  matchLists: (matchId: string) => [...pairingKeys.lists(), 'match', matchId] as const,
  matchList: (matchId: string, p: MatchPairingListParams) => [...pairingKeys.matchLists(matchId), p] as const,
  teamLists: (teamId: string) => [...pairingKeys.lists(), 'team', teamId] as const,
  teamList: (teamId: string, p: TeamPairingListParams) => [...pairingKeys.teamLists(teamId), p] as const,
}
```
- Params chuẩn hoá đủ field (`status: 'ALL'`, `role: 'ALL'`, `page: 1`, `pageSize: 20` điền sẵn) — SHARED §4.
- Tra vùng S10 = `teamList(teamId, { role: 'INTERESTED', status: 'ALL', page: 1, pageSize: 100 })` — key riêng với trang S3 (`pageSize` khác), `queryFn` trả nguyên `Page`, lọc bằng `select`.

### 3.2. Bảng state

| State | Loại | Hook | Key | Tuỳ chọn / ghi chú |
|---|---|---|---|---|
| Chi tiết thương lượng (S4) | server | `usePairingDetail(pairingId)` | `pairingKeys.detail` | `staleTime` 5 s, `refetchOnMount: true` — mở lại S4 sau 5 s luôn lấy gói mới; sau 201 nhận kèo (`setQueryData`) hiển thị ngay, `onReady` đầu tải lại một lần (§6.3); `enabled` theo cổng `onReady` (§6.3); `isFetching` → `refreshing` |
| Thương lượng của kèo (S2) | server | `useMatchPairings(matchId, p)` | `pairingKeys.matchList` | `placeholderData` giữ trang cũ |
| Thương lượng của đội (S3) | server | `useTeamPairings(teamId, p)` | `pairingKeys.teamList` | `placeholderData` |
| Thương lượng của đội đang chọn cho kèo (vùng S10) | server | `useTeamPairingForMatch(teamId, matchId)` | `pairingKeys.teamList(teamId, { role: 'INTERESTED', status: 'ALL', page: 1, pageSize: 100 })` | `enabled: teamId ≠ null`; `select` → phần tử có `matchId` hoặc `null` `[cần xác nhận]` #8 |
| Chi tiết kèo (S2, S4) | server | `useMatchDetail(matchId)` (MATCH-001) | `matchKeys.detail` | Mặc định (30 s) |
| Đội tôi làm đội trưởng (kèm `status`) | server | `useMatchViewerTeams()` (MATCH-001 §8.1, §8.5 — trên `useMyTeams`) | `myTeamsKey({ role: null, page: 1, pageSize: 100 })` | `staleTime` 5 phút; dùng ở `usePairingViewer` (S4) và ô chọn đội S3 — không tự lọc `useMyTeams` lại |
| Bộ lọc S2/S3, trang | URL | `useUrlParam` | Screen_Flow §3 | — |
| Đội đang chọn ở vùng S10 | client cục bộ | `useState` trong `PairingEntryArea` | — | Mặc định đội `ACTIVE` đầu tiên của `viewer.sendableTeams` |
| Bên thao tác (BR-M18) | client cục bộ | `usePairingViewer` (`useState`) | — | Chỉ khi đội trưởng cả hai đội |
| Dialog đang mở + gói lúc mở | client cục bộ | `useState` trong `PairingDetailPage` | — | `{ kind: 'proposal' \| 'cost' \| 'confirm'; baseRevision: number; basePairing: PairingDetail } \| null` — `basePairing` = ảnh chụp gói lúc mở (§6.1) |
| Xung đột S4e | client cục bộ | `useState<PairingConflict \| null>` | — | `{ previous: PairingDetail }` = `basePairing` của dialog vừa nhận `PAIRING_006` → `diffPairingPackage(previous, next)`; xoá khi thao tác ghi kế tiếp thành công hoặc người dùng đóng banner |
| Thông báo realtime | client cục bộ | `useState<string \| null>` | — | Câu theo `change` (UI S4 "Realtime"); thay bằng câu mới khi có frame mới |

### 3.3. Dữ liệu dẫn xuất (không gọi API)
- `displayStatus = getPairingDisplayStatus(pairing, useNowMs(60_000))`; dòng S2/S3 dùng cùng hàm.
- `PairingViewer` (`usePairingViewer`): đội của `useMatchViewerTeams()` ∩ hai đội của thương lượng; `actingTeamStatus` = `status` của đội đó; `ready = false` khi đội của tôi đang tải → ẩn nút ghi, hiện skeleton vùng xác nhận.
- `permissions = getPairingPermissions(...)` (Component_Design §6).

### 3.4. Sau mutation thành công

| Mutation | Cập nhật cache | Khác |
|---|---|---|
| 2.1 nhận kèo | `setQueryData(pairingKeys.detail(id), response)` (S4 hiển thị ngay; `onReady` đầu tải lại một lần — §6.3); invalidate `pairingKeys.teamLists(teamId)`, `pairingKeys.matchLists(matchId)`, `CONVERSATION_PREFIXES` (cuộc trò chuyện mới trong "Tin nhắn") | toast; điều hướng S4 |
| 2.5 chốt phương án | `setQueryData(detail, mergePairingResult)` (`revision`, `proposal`, hai `…ConfirmedAt`, `updatedAt`); invalidate `pairingKeys.lists()` | toast; xoá `conflict` |
| 2.6 lưu chi phí | `setQueryData(detail, mergePairingResult)` (`revision`, `costAgreement`, hai `…ConfirmedAt`, `updatedAt`); invalidate `pairingKeys.lists()` | toast; xoá `conflict` |
| 2.7 xác nhận — `NEGOTIATING` | `setQueryData(detail, mergePairingResult)` (`status`, `revision`, ba mốc xác nhận); invalidate `pairingKeys.lists()` | toast "Đã xác nhận gói" |
| 2.7 xác nhận — `CONFIRMED` | Như trên; invalidate `pairingKeys.all` (thương lượng khác → `SUPERSEDED`), `matchKeys.detail(matchId)`, `matchKeys.searches()`, `matchKeys.teamMatchLists()`, `CONVERSATION_PREFIXES` (đổi `canSend` của phòng khác) — MATCH-001 Component_Design §8.3 | toast "Đã ghép kèo"; view S4c |

- **`CONVERSATION_PREFIXES`** = hai tiền tố `[QUERY_ROOTS.conversation, 'mine']` ("Tin nhắn của tôi" 2.20) và `[QUERY_ROOTS.conversation, 'detail']` (đầu phòng 2.19 — `canSend`). **NEVER** invalidate cả gốc `[QUERY_ROOTS.conversation]` (= `conversationKeys.all`) và không đụng `messages` (MATCH-001 Component_Design §8.3, State §3.1). Khai mảng hằng trong `constants/pairing-query-keys.constant.ts`; không import `conversationKeys` của module `chat` (SHARED §4).
- **`mergePairingResult(cache, result)`** chỉ ghép khi `result.revision ≥ cache.revision`; ngược lại (frame / lần tải khác đã đưa cache đi trước) → `invalidateQueries(detail)`, không ghép.
- 2.5 chọn lại đúng phương án đang có: **không gọi** (đóng dialog). Nếu vẫn nhận `200` không đổi `revision` (vd hai tab) → ghép như thường, không toast.

## 4. Luồng tương tác

### 4.1. S4 — chuỗi tải

```mermaid
sequenceDiagram
  participant P as PairingDetailPage
  participant RT as core/realtime
  participant API as ArenaFlow-be
  par ngay khi mount
    P->>API: GET /profile/teams?page=1&pageSize=100 (useMatchViewerTeams, có cache → bỏ)
  and có state.conversationId (link nội bộ)
    P->>RT: subscribe(topic, onFrame, { onError, onReady })
    RT-->>P: onReady(epoch) (SUBSCRIBE đã gửi)
    P->>API: GET /pairings/{id} (2.4) — bắt đầu sau SUBSCRIBE → không tải lại
  and không có state (deep link)
    P->>API: GET /pairings/{id} (2.4)
    API-->>P: conversationId
    P->>RT: subscribe(topic, onFrame, { onError, onReady })
    RT-->>P: onReady(epoch) → 2.4 có trước SUBSCRIBE → tải lại 2.4 (+1)
  end
  P->>API: GET /matches/{matchId} (MATCH-001 2.3, sau khi có matchId; có cache → bỏ)
  P->>P: displayStatus · PairingViewer · permissions → view S4a–S4d
```
- 2.3 MATCH-001 lỗi → S4 vẫn hiển thị gói (bỏ dòng "Bộ môn · định dạng"); S5 hiện `ErrorState` + **Thử lại** trong dialog (cần `venueOptions`/`timeOptions`).
- Đội của tôi lỗi → chỉ xem + `AlertBanner` "Không tải được đội của bạn" + **Thử lại**.

### 4.2. Thao tác ghi có `revision` (S5 / S6 / S7)

```mermaid
sequenceDiagram
  actor U as Đội trưởng
  participant D as Dialog S5/S6/S7
  participant P as PairingDetailPage
  participant API as ArenaFlow-be
  U->>P: mở dialog → basePairing = gói đang hiển thị, baseRevision = basePairing.revision
  Note over D: Dialog hiển thị basePairing; cache.revision ≠ baseRevision khi đang mở → cảnh báo + khoá nút (§6.1)
  U->>D: Chốt / Lưu / Xác nhận
  D->>API: PUT|POST … { teamId: actingTeamId, revision: baseRevision, … }
  alt 200
    API-->>D: kết quả (revision mới / status)
    D->>P: mergePairingResult → cache; đóng; toast
  else 409 PAIRING_006
    API-->>D: Phương án đã thay đổi
    D->>P: onConflict → conflict = { previous: basePairing }; đóng (S6 bỏ bản nháp)
    P->>API: GET /pairings/{id} (2.4)
    P-->>U: S4e — banner + "Vừa thay đổi"; KHÔNG tự gửi lại
  else 409 PAIRING_005 / MATCH_004
    D->>P: onEnded → đóng; tải lại 2.4 (+ invalidate matchKeys.detail) → S4c / S4d
  end
```

### 4.3. Race "thương lượng hoàn tất trước thắng" (API §1.5, AC-M05, UC-M07 5a)
- Thương lượng X của đội mình, kèo có thương lượng Y khác. Y hoàn tất trước → X `SUPERSEDED` ở BE; **không có frame** cho X (API §1.6, `[cần xác nhận]` #12).
- Người dùng ở S4 của X bấm xác nhận → `409 PAIRING_005` → đóng S7, message BE "Thương lượng đã kết thúc", tải lại 2.4 → S4d `SUPERSEDED`; invalidate `matchKeys.detail(matchId)`, `pairingKeys.lists()`, `CONVERSATION_PREFIXES` (§3.4 — phòng X chỉ xem).
- Hai bên của **cùng** thương lượng bấm gần như cùng lúc: một bên nhận `NEGOTIATING`, bên kia `CONFIRMED` (API 2.7) — FE xử lý theo `status` của response; frame `PAIRING_UPDATED` (`CONFIRMATION`, `status = CONFIRMED`) đưa bên còn lại sang S4c.
- Gọi xác nhận lặp lại khi bên mình đã xác nhận đúng `revision` → `200` không đổi (API §1.5) — không coi là lỗi.

### 4.4. S1 — nhận kèo
- Bấm "Nhận kèo" → kiểm `displayStatus` lúc bấm → `POST /matches/{matchId}/pairings { teamId }` → 201 → §3.4 → S4 (S4a). Lỗi: §5.2.

## 5. Xử lý lỗi

### 5.1. Chung
- Theo SHARED State §2.3: 401 → refresh 1 lần; mạng / timeout 15 s / 5xx → `ErrorState` + **Thử lại** (tải) hoặc lỗi trong dialog / toast (thao tác); message hiển thị = `error.message` BE (không `details`).
- `400 VALIDATION_ERROR` id sai định dạng ở path (2.2–2.7) → như "không tìm thấy" của màn.

### 5.2. 2.1 Nhận kèo (S1 — lỗi hiện trong dialog qua `ConfirmDialog.error`)

| Mã | Hiển thị / hành động |
|---|---|
| `409 MATCH_003`, `409 MATCH_004`, `409 MATCH_005`, `422 MATCH_013`, `422 SPORT_002` | Banner message BE + nút "Quay lại" (đóng); gọi `onMatchChanged` (host tải lại 2.3 → S8) và invalidate `matchKeys.searches()` |
| `409 PAIRING_003` | Banner + link "Mở thương lượng đã có": invalidate rồi `fetchQuery` key tra của vùng (§3.1) → có → `navigate(buildPairingDetailPath)`; không thấy (ngoài 100 dòng) → link `buildTeamPairingsPath(teamId, { role: 'INTERESTED' })` |
| `409 MATCH_014` | Banner message BE; giữ dialog, cho bấm lại |
| `403 TEAM_002`, `404 TEAM_001`, `422 TEAM_015`, `422 TEAM_016` | Banner message BE; invalidate `myTeamsKey(...)` (vùng tự cập nhật danh sách đội) |
| `404 MATCH_001` | Đóng; `onMatchChanged` (host hiện "Không tìm thấy kèo") |
| `422 MATCH_016`, `422 PAIRING_004` | Không xảy ra theo điều kiện hiển thị; nếu có → đóng, toast message BE, `onMatchChanged` |

### 5.3. Nhóm lỗi ghi 2.5–2.7 (`classifyPairingWriteError`)

| Nhóm | Mã | Hành động chung |
|---|---|---|
| `conflict` | `409 PAIRING_006` | §4.2: đóng dialog (S6 bỏ bản nháp — API 2.6), `conflict`, tải lại 2.4 → S4e. Thông điệp banner = message BE |
| `ended` | `409 PAIRING_005` | Đóng, toast message BE, tải lại 2.4 + invalidate `matchKeys.detail(matchId)`, `pairingKeys.lists()`, `CONVERSATION_PREFIXES` (§3.4) → S4c / S4d |
| `expired` | `409 MATCH_004` | Như `ended` → S4d `EXPIRED` |
| `busy` | `409 MATCH_014` | Tải lại 2.4; **giữ** dialog + dữ liệu đã nhập, lỗi trong dialog (message BE), cho bấm lại với `baseRevision`; tải lại thấy `revision` đổi → khoá nút theo §6.1 |
| `team` | `422 TEAM_015`, `422 TEAM_016`, `403 TEAM_002`, `403 PAIRING_002` | Đóng, toast message BE; invalidate `myTeamsKey(...)` + tải lại 2.4 (nút tự ẩn / banner đội tạm ngưng) |
| `gone` | `404 PAIRING_001` | Đóng; S4 `ErrorState` (Screen_Flow §3 S4) |
| `validation` | `400 VALIDATION_ERROR` | Lỗi tại field (Component_Design §3); không map → `FormErrorBanner` |
| khác | §5.4–§5.6 | Theo endpoint |

### 5.4. 2.5 Chốt phương án (S5)

| Mã | Hiển thị / hành động |
|---|---|
| `422 VENUE_002` | Giữ dialog; lỗi dưới nhóm "Địa điểm" (message BE); bỏ chọn địa điểm đó; invalidate `matchKeys.detail(matchId)` (cập nhật `venueStatus` của lựa chọn) — UC-M06 4a |
| `422 PAIRING_008` | Giữ dialog; `FormErrorBanner` message BE; invalidate `matchKeys.detail(matchId)` (tải lại lựa chọn) |

### 5.5. 2.6 Lưu chi phí (S6)
- Chỉ các nhóm §5.3; `400` theo field (`depositHolder` có nội dung khi không có cọc → lỗi dưới ô "Người giữ cọc").

### 5.6. 2.7 Xác nhận (S7 — `ConfirmDialog.error` khi giữ dialog)

| Mã | Hiển thị / hành động |
|---|---|
| `422 PAIRING_007` | Đóng; toast "Chưa chốt địa điểm và giờ" (message BE); tải lại 2.4 → S4a (UC-M07 2a) |
| `422 VENUE_002` | Đóng; toast message BE; tải lại 2.4 → banner "Địa điểm đã ngừng hoạt động — chốt lại địa điểm khác", ẩn xác nhận (UC-M07 2c) |
| `422 MATCH_013`, `422 SPORT_002` | Giữ dialog, lỗi message BE; người dùng đóng (không tự thử lại) |

## 6. Đồng thời, `revision`, realtime, hết hạn

### 6.1. `revision` (API §1.4, BR-M19, BE ADR-0003)
- Mở dialog → chụp **`basePairing`** (gói đang hiển thị) và `baseRevision = basePairing.revision`. Dialog **hiển thị và lấy giá trị đầu từ `basePairing`** (S5 phương án đang chốt, S6 chi phí, S7 `PairingPackageSummary`), không đọc cache đang cập nhật → gói người dùng thấy = gói được gửi (API §1.4, §1.6; UI S7 "xác nhận đúng gói đang thấy"). **NEVER** lấy `revision` mới từ cache rồi tự gửi lại.
- Dialog đang mở mà cache `detail.revision ≠ baseRevision` (frame / tải lại): **không** tự đổi nội dung dialog; hiện `AlertBanner warning` "Gói vừa được thay đổi. Đóng để xem gói mới rồi thao tác lại." và **khoá** nút chính (S5 / S6 / S7). Gói đổi ở BE mà FE chưa biết → gửi nhận `PAIRING_006` → S4e.
- Đang tải lại 2.4 (`refreshing`) → nút "Xác nhận gói này" trên S4 `disabled` (UI S4 Realtime).

### 6.2. S4e — gói đã thay đổi
- Ghi `previous` = `basePairing` của dialog (không lấy cache — cache có thể đã là bản mới, diff sẽ rỗng) → `invalidateQueries(detail)` → khi có dữ liệu mới: `changed = diffPairingPackage(previous, next)` → nhãn "Vừa thay đổi", hai dòng xác nhận hiển thị theo dữ liệu mới (thường "Chưa xác nhận").
- Tải lại thất bại → banner xung đột + `ErrorState` nhỏ + **Thử lại**; nút ghi ẩn tới khi tải được.

### 6.3. Realtime (API §1.6; MATCH-001 §1.7; SHARED §6)
- `usePairingRealtime` đăng ký topic `/topic/conversations/{conversationId}` (UUID chữ thường) khi S4 mount và có 2.4; frame khác `PAIRING_UPDATED` hoặc `pairingId` khác → bỏ qua.
- Nhận frame (so với cache `detail`):

| Điều kiện | Hành động |
|---|---|
| `revision` < cache, hoặc mọi field (`status`, `revision`, 3 mốc xác nhận) bằng cache | Bỏ qua (frame cũ / của chính mình đã ghép từ response) |
| Khác | `invalidateQueries(detail)`; sau khi có dữ liệu mới: đặt `realtimeNotice` theo `change` (UI S4); `status = CONFIRMED` → S4c + invalidate như §3.4 dòng `CONFIRMED`; invalidate `pairingKeys.lists()` |

  - Tên đội trong câu: `CONFIRMATION` → bên có `…ConfirmedAt` chuyển `null` → có giá trị; bên đó là bên mình → không hiện câu. `PROPOSAL` / `COST` → tên **đội kia** (frame không có người thao tác) `[cần xác nhận]` #13.
- **`onReady(epoch)`** (SHARED v1.2 §6 — thay `onReconnected`; MATCH-001 / MERCENARY-001 dùng cùng cách): page giữ `lastFetchStartedAt` (ghi trong `queryFn` của `usePairingDetail`). Mỗi `onReady(epoch)` mới: dữ liệu / request 2.4 hiện có **bắt đầu trước** lúc `onReady` → `invalidateQueries(detail)`; bắt đầu sau → bỏ qua. Áp cho mọi epoch: lần đầu (deep link, sau 201 S1) và mọi lần kết nối lại (MATCH-001 §1.7 bước 2 "màn hình thương lượng gọi thêm 2.4") → không lỡ frame giữa REST và `SUBSCRIBE`.
- **Cổng tải 2.4** khi có `state.conversationId` (UUID hợp lệ): `enabled` sau `onReady` đầu → 1 call. Không chờ khi `useRealtimeStatus()` = `reconnecting`, khi subscription báo `onError`, hoặc quá 2 s chưa có `onReady` → tải ngay (lần `onReady` sau tự tải lại theo quy tắc trên). 2.4 trả `conversationId` khác `state` → đăng ký lại theo giá trị 2.4.
- Deep link (không có `state`): 2.4 → `subscribe` → `onReady` đầu tải lại 2.4 (+1 call) `[cần xác nhận]` #14.
- Banner "Đang kết nối lại…" theo `useRealtimeStatus()` (`role="status"`).
- `onError` (`CHAT_002` / `CHAT_003`): bỏ realtime, S4 vẫn dùng REST; không hiện lỗi riêng.
- Rời S4 → huỷ subscription (đếm tham chiếu ở service — SHARED §6).

### 6.4. Hết hạn & trạng thái không có frame (API §1.3, §1.6, BR-M17, UC-M09)
- `displayStatus` tính lại mỗi 60 s và lúc bấm. Lần đầu chuyển `NEGOTIATING` → `EXPIRED` phía FE khi đang ở S4 → khoá nút ngay + `invalidateQueries(detail)` **một lần** (BE trả `EXPIRED`) → S4d.
- `SUPERSEDED` (kèo ghép đội khác / bị huỷ): FE biết khi thao tác (`PAIRING_005`), khi mở lại S4 (`refetchOnMount: 'always'`), hoặc khi kết nối lại `[cần xác nhận]` #12.
- Kèo `CONFIRMED` → `ARCHIVED` sau trận: hiển thị theo MATCH-001.

### 6.5. Double-submit
- Nút ghi `loading = isPending`; dialog `dismissible = false` khi đang gửi; API không có `Idempotency-Key` — lặp 2.7 đã được BE coi là không đổi (API §1.5).

## 7. Phân trang / sort
- S2, S3: offset `page` / `pageSize = PAGE_SIZE_DEFAULT` (20) (`api-convention.md` §7, API §1.1). Thứ tự do BE (2.2 `createdAt` ↑; 2.3 `updatedAt` ↓) — FE không sắp xếp.
- Tra vùng S10: trang 1, `pageSize = PAGE_SIZE_MAX` (100).
- Không có ô tìm kiếm (không cần debounce).

## 8. Đối chiếu nhanh mã lỗi ↔ endpoint (từ API §5)

| Endpoint | Mã được xử lý ở | 
|---|---|
| 2.1 | §5.2 |
| 2.2 | Screen_Flow §3 S2 (`TEAM_002`, `TEAM_016`, `MATCH_001`, `MATCH_016`, `VALIDATION_ERROR`) |
| 2.3 | Screen_Flow §3 S3 (`TEAM_002`, `TEAM_001`, `TEAM_016`, `VALIDATION_ERROR`); tra vùng S10: lỗi → ẩn trạng thái, vẫn hiện "Nhận kèo" (BE chặn `PAIRING_003`) |
| 2.4 | Screen_Flow §3 S4 (`PAIRING_001`, `PAIRING_002`) |
| 2.5 | §5.3, §5.4 |
| 2.6 | §5.3, §5.5 |
| 2.7 | §5.3, §5.6 |

## 9. `[cần xác nhận]`
> **Chặn code?** *Có* = developer không code phần nêu tới khi chốt · *Không* = code theo phương án đề xuất, đổi sau nếu user chọn khác. Đánh số chung 3 tài liệu.

| # | Nội dung | Chặn code? |
|---|---|---|
| 1 | **Nền chưa có:** SHARED/APP-SHELL v1.2 + thiết kế MATCH-001 (đang review) chưa merge; FE ADR-0002…0008 `Proposed` (ADR-0007 cho realtime S4). MATCH-002 dùng trực tiếp code module `match` của MATCH-001 (`matchKeys`, `useMatchDetail`, `useMatchViewerTeams`, `MatchViewer`, `CostAgreementCard`, `MoneyInput`, `TeamPicker`) | **Có** — toàn bộ; code sau khi MATCH-001 (phần trên) đã có |
| 2 | **Ngưỡng (B)/(C)** (§1): S2, S3, S4, vùng S10 vượt 3 khi tính request khung (SHARED State §7 #1, MATCH-001 #3) | **Có** — tới khi user chốt cách tính; chốt "không tính khung" → **Không** |
| 3 | **Chọn đội nhận kèo ở vùng S10** (mẫu MATCH-001 S5) thay radio list trong dialog S1 (UI S1): tra 2.3 chỉ cho một đội → không N+1 | Không |
| 4 | **"Uy tín n/100" của đội mình ở S1:** USER-003 2.5 không có điểm; gọi REPUTATION-001 2.9 cho từng đội là N+1 → bỏ. Đề xuất BE thêm `reliabilityScore` vào USER-003 2.5 (repo BE) | Không |
| 5 | **S2 là trang riêng** `/matches/:matchId/pairings`, vào từ "Xem thương lượng" trên S10 (MATCH-001 UI S10) — UI_Design §4 #2 | Không |
| 6 | **Lối vào S3:** link trên S11 MATCH-001 (Screen_Flow §6 C3, cần cập nhật UI MATCH-001), breadcrumb "Kèo của đội › Thương lượng ghép kèo"; không thêm mục nav | Không |
| 7 | **Breadcrumb S4** "Kèo của đội › Thương lượng ghép kèo › <đội kia>" thay "Đội của tôi › <đội> › Thương lượng" (UI S4) — theo MATCH-001 | Không |
| 8 | **Tra thương lượng của đội cho kèo** (vùng S10): 2.3 không lọc `matchId` → trang 1 `pageSize = 100` rồi lọc; quá 100 thương lượng gần nhất có thể không thấy (BE vẫn chặn `PAIRING_003`, có link S3). Đề xuất BE: lọc `matchId` ở 2.3 hoặc thêm thương lượng của người xem vào MATCH-001 2.3 (repo BE) | Không |
| 9 | **Đội trưởng cả hai đội (BR-M18):** `ActingTeamSwitch` "Thao tác với tư cách" trên S4 (UI §4 #4); chat cố định vai trò đội tạo kèo (MATCH-001 §1.6) | Không |
| 10 | **"Đội chủ nhà" ở luồng B** (`SEVENTY_THIRTY_HOME`): hiển thị nguyên nhãn (UI §4 #5) | Không |
| 11 | **S3 thiếu tên sân / bộ môn** (§4.3): chỉ hiện dòng tiến độ; không gọi chi tiết kèo từng dòng (N+1). Đề xuất BE thêm `venueName`, `sportName` vào §4.3 (UI §4 #6) | Không |
| 12 | **Không có frame khi `SUPERSEDED` / `EXPIRED` / kèo huỷ** (API #15): FE biết qua lỗi thao tác, khi mở lại S4, khi kết nối lại; riêng hết hạn tự khoá + tải lại 2.4 một lần (§6.4) | Không |
| 13 | **Câu banner realtime** `PROPOSAL` / `COST` gán cho "đội kia" (frame không có người thao tác); cùng người ở hai tab / đội trưởng cả hai đội có thể thấy câu không chính xác | Không |
| 14 | **Lỡ frame lần kết nối đầu — đã đóng** bằng `onReady(epoch)` (§6.3). Còn lại: **deep link S4** (URL, thông báo, link từ chat) tải 2.4 hai lần → (A) tối đa 4 khi 2.3 MATCH-001 và đội của tôi đều chưa có cache (§1). Phương án: (i) chấp nhận vượt cho deep link; (ii) bỏ lần tải lại ở `onReady` đầu cho deep link (lỡ frame hiếm, `revision` vẫn chặn ghi sai); (iii) MATCH-001 truyền `state.conversationId` ở link "Mở thương lượng" trong phòng chat để giảm số trường hợp deep link | **Có** — chỉ lần tải lại ở `onReady` đầu khi deep link; trước khi chốt code theo (ii). Link nội bộ: **Không** |
| 15 | **Câu chữ chưa có trong SRS:** validation S6, toast, banner (UI §4 #8) | Không |
| 16 | **Định dạng khung giờ** dùng `formatMatchTimeRange` của SHARED (MATCH-001 C5: "18:00 – 20:00 · Thứ Bảy 05/12/2026") thay "Thứ, dd/MM/yyyy HH:mm – HH:mm" của UI S5 — một định dạng toàn app | Không |
| 17 | **Lối vào thương lượng từ kèo B đã ghép** (Screen_Flow §6 C11) — đề xuất MATCH-001 S8 | Không |
| 18 | **Mockup thiếu** (UI §4 #1): chỉ S4b mobile; đặc tả chữ UI_Design là nguồn chuẩn (user 2026-11-27) | Không |

**ADR mới:** không có (không thêm thư viện; trong dải FE ADR-0002…0008 dùng trực tiếp 0004 query, 0005 form, 0007 realtime, 0008 ngày giờ). Không dùng slot (FE ADR-0010).
