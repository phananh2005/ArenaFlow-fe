# Thư mục thiết kế Frontend

> Chứa tài liệu thiết kế FE cho từng chức năng: giao diện do `ui-designer` (Stitch MCP) tạo, thiết kế kỹ thuật do `solution-architect` tạo. Mã chức năng trùng mã SRS.

## Bố cục

```text
design/
├── README.md                  # file này
├── _template/                 # mẫu cho chức năng mới
│   ├── UI_Design.md
│   ├── Screen_Flow.md
│   ├── Component_Design.md
│   └── State_API_Integration.md
└── <MÃ>/                      # một chức năng
    ├── UI_Design.md           # giao diện đã duyệt (ui-designer)
    ├── ui/                    # ảnh / HTML xuất từ Stitch
    ├── Screen_Flow.md
    ├── Component_Design.md
    ├── State_API_Integration.md
    └── CHANGELOG.md           # chỉ tạo khi sửa bản đã có baseline
```

**Hiện tại:** thiết kế đặt thẳng trong `design/<MÃ>/`. Khi số chức năng tăng, sẽ gom theo cụm:
- `design/<CỤM>/<MÃ>/` — theo cụm chức năng (vd `booking/`, `arena/`, `user/`)
- `design/SHARED/<MÃ>/` — khung dùng chung nhiều cụm (layout, auth, http)

## Chuẩn viết

Xem `docs/agent/design-standards.md`.

## Ownership

- **Tạo/sửa UI:** qua `ui-designer` → người dùng duyệt → commit.
- **Tạo/sửa thiết kế kỹ thuật:** qua `solution-architect` → `architect-reviewer` → duyệt → commit.
- **Không tự sửa tay** nếu chưa qua review.
- **Liên kết:** khi di chuyển/đổi tên thư mục, grep mọi chỗ trỏ tới (knowledge, ADR) và sửa cùng lúc.
