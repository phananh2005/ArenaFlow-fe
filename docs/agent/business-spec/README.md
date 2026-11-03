# Thư mục Spec Nghiệp vụ (SRS)

> Chứa SRS từng chức năng. **Người dùng chép từ repo `ArenaFlow-be`** (`docs/agent/business-spec/<MÃ>/`) — FE không có `business-analyst`.

## Bố cục

```text
business-spec/
├── README.md              # file này
└── <MÃ>/                  # một chức năng — giữ nguyên tên file như BE
    ├── Overview.md
    ├── Use_Cases.md
    ├── Business_Rules.md
    ├── Data_Model_Conceptual.md
    └── Acceptance_Criteria.md
```

Khi số chức năng tăng, gom theo domain như BE: `business-spec/<DOMAIN>/<MÃ>/`.

## Quy trình

1. Người dùng chép SRS `<MÃ>` từ BE vào đây.
2. `ui-designer` đọc SRS → thiết kế giao diện (Stitch) → duyệt.
3. `solution-architect` đọc SRS + UI đã duyệt + API_Spec BE → thiết kế kỹ thuật FE.
4. `developer` code theo thiết kế.

## Ownership

- **Agent chỉ đọc**, **NEVER** tự sửa SRS. Cần đổi nghiệp vụ → đề xuất, người dùng sửa ở BE rồi chép lại.
- SRS ở đây lệch bản BE (`../ArenaFlow-be/docs/agent/business-spec/<MÃ>/`) → nêu ra, ghi `[cần xác nhận]`, không tự chọn bản nào.
- SRS thay đổi → cập nhật UI_Design và thiết kế FE tương ứng.
