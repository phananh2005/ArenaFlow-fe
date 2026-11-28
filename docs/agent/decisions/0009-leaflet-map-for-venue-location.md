# ADR-0009: Dùng Leaflet (nạp động) cho bản đồ chọn / hiển thị vị trí sân

| | |
|---|---|
| **Trạng thái** | Accepted |
| **Ngày** | 2026-11-28 |
| **Người quyết định** | Product Owner (đã duyệt 2026-11-28) · solution-architect (đề xuất) |
| **Liên quan** | `docs/agent/design/VENUE-001/` (Component_Design §2 `VenueMapPicker`, `VenueStaticMap`, §9 #1) · `docs/agent/design/VENUE-001/UI_Design.md` §4 #1, #2 · SRS SYSTEM-001 `Overview.md` §5 ("chỉ hiển thị bản đồ/chỉ đường") · `docs/agent/non-functional-standards.md` §2 · `docs/agent/security-frontend.md` §2, §6 |

## Bối cảnh (Context)
- VENUE-001 cần: (1) chọn toạ độ sân khi thêm / sửa (S2, S3) — UI đã duyệt vẽ bản đồ có ghim + "Dùng vị trí hiện tại" + dòng toạ độ chỉ đọc; (2) bản đồ tĩnh có ghim ở chi tiết (S4) + nút "Chỉ đường".
- SRS chỉ cho phép mức "hiển thị bản đồ / chỉ đường"; tích hợp Maps chi tiết ngoài phạm vi.
- API nhận `latitude`/`longitude` tối đa 7 chữ số thập phân (API_Spec VENUE-001 2.1, 2.12).
- Bundle ban đầu ≤ 250 KB gzip; thư viện mới phải có ADR. Repo chưa có thư viện bản đồ.
- Mọi biến `VITE_*` là công khai — dịch vụ cần API key sẽ lộ key (phải giới hạn theo domain ở phía nhà cung cấp).

## Quyết định (Decision)
Chúng tôi dùng **Leaflet** (gói `leaflet`, bản ổn định mới nhất lúc cài — chốt số phiên bản trong PR cài đặt), bọc trực tiếp bằng `ref` + `useEffect` trong 2 component của `modules/venue/components/map/`:
- **Nạp động** (`import()` trong `React.lazy`) — chỉ tải khi S2/S3/S4 render bản đồ; CSS của Leaflet import trong chunk đó. Không vào bundle ban đầu.
- Ghim dùng `divIcon` SVG nội tuyến (không dựa đường dẫn ảnh marker mặc định của Leaflet — hay hỏng khi đóng gói bằng Vite) và không nạp font/icon ngoài.
- Chọn vị trí: bấm bản đồ đặt ghim, kéo ghim; "Dùng vị trí hiện tại" qua `navigator.geolocation`; giá trị làm tròn 7 chữ số thập phân.
- **Tile:** URL tile cấu hình qua biến `VITE_MAP_TILE_URL` + `VITE_MAP_ATTRIBUTION` (công khai, vào bundle). PR cài đặt **phải** thêm hai biến vào `.env.example` (comment `#` tiếng Việt: mục đích, định dạng URL mẫu `{z}/{x}/{y}`, mặc định dev, nhắc công khai) và khai type trong `src/vite-env.d.ts` (`convention-frontend.md` §8, §10.2). Dev dùng tile OpenStreetMap kèm ghi công bắt buộc. Nhà cung cấp tile production **chưa chốt** (chính sách tile OSM không dành cho tải lớn) — `[cần xác nhận]`, **chặn phát hành production**, không chặn code. Nhà cung cấp cần key → chỉ dùng **key công khai giới hạn theo domain** (referrer) ở phía nhà cung cấp, đặt trong `VITE_MAP_TILE_URL`; **NEVER** dùng key bí mật / key không giới hạn (`security-frontend.md` §3).
- **"Chỉ đường":** link ngoài `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>` (Google Maps URLs, không cần khoá), tab mới `rel="noopener noreferrer"`; không nhúng SDK.

Phương án đã loại:
- **Google Maps JavaScript API:** cần API key (lộ trong bundle, phải giới hạn referrer) và tài khoản thanh toán; SDK nạp script từ CDN Google → nới CSP `script-src`; vượt mức "chỉ hiển thị".
- **MapLibre GL:** bản đồ vector đẹp hơn nhưng gói nặng hơn đáng kể so với Leaflet `[Unverified — cần đo khi cài]` và vẫn cần nguồn tile/style; thừa cho nhu cầu một ghim.
- **`react-leaflet`:** thêm một dependency + ràng buộc phiên bản React; hai component đơn giản tự bọc được.
- **Không dùng bản đồ (chỉ 2 ô nhập lat/lng):** lệch UI đã duyệt; người dùng khó biết toạ độ sân.
- **Ảnh bản đồ tĩnh từ dịch vụ (static map API):** đa số cần API key; không dùng cho chọn ghim.

## Hệ quả (Consequences)

**Tích cực**
- Không cần API key / thanh toán ở dev; bản đồ chỉ tải ở màn cần.
- Đổi nhà cung cấp tile chỉ đổi biến môi trường.

**Tiêu cực / đánh đổi**
- Thêm một dependency runtime (trong chunk lazy). Kích thước gzip phải đo trong `npm run build` của PR cài đặt.
- Trình duyệt người dùng gửi request tile tới bên thứ ba → nhà cung cấp tile biết vùng bản đồ đang xem (vị trí xấp xỉ của sân / người dùng). Cần nêu trong chính sách quyền riêng tư khi phát hành.
- CSP khi deploy phải cho `img-src` tới máy chủ tile.
- Bản đồ tương tác không đặt ghim được bằng bàn phím mà toạ độ là trường bắt buộc → thiết kế **bắt buộc** thêm nút "Nhập toạ độ" (2 ô vĩ độ / kinh độ, validate −90..90 / −180..180, làm tròn 7 chữ số thập phân) cạnh "Dùng vị trí hiện tại" và dòng toạ độ dạng chữ (`non-functional-standards.md` §4; VENUE-001 Component_Design §4.3). Bản đồ chỉ là cách nhập thuận tiện, không phải cách duy nhất.

**Cần theo dõi**
- Nhà cung cấp tile production và hạn mức / chi phí của nó.
- Mã khác (MATCH-001, MERCENARY-001) cần bản đồ → chuyển component bản đồ lên `src/shared/components/map/` (qua `reuse-scan`), không tạo bản thứ hai.
- Leaflet ra bản major đổi API → rà 2 component bọc.
