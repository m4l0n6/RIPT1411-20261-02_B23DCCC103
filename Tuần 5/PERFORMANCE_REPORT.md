# Báo cáo hiệu năng đã đo – SalesHub (10.000 sản phẩm)

## Môi trường đo

| Mục | Giá trị |
|---|---|
| Ngày đo | 04/10/2026 |
| Công cụ | Lighthouse 13.5.0 (CLI/Node), chỉ hạng mục Performance |
| Trình duyệt | Headless Chromium 153 trên Linux (môi trường sandbox, không phải máy cá nhân) |
| Cấu hình | Mặc định của Lighthouse: Mobile, giả lập throttling (4G chậm + CPU chậm 4x) |
| Bản build | `npm run build` + `vite preview` (127.0.0.1:4173) |
| Số lần đo | 3 lần mỗi trang, lấy median |

## Kết quả tổng hợp (median của 3 lần)

| Chỉ số | Trước (`/unoptimise`) | Sau (`/products`) | Chênh lệch | Ngưỡng "Tốt" |
|---|---|---|---|---|
| **Performance score** | 90 | 97 | +7 điểm | ≥ 90 |
| **FCP** | 1,53 s | 1,74 s | +0,21 s (chậm hơn 14%) | ≤ 1,8 s |
| **LCP** | 2,44 s | 2,43 s | gần như không đổi | ≤ 2,5 s |
| **TBT** | 0 ms | 0 ms | không đổi | ≤ 200 ms |
| **CLS** | 0 | 0 | không đổi | ≤ 0,1 |
| Speed Index | 6,88 s | 1,74 s | −75% | ≤ 3,4 s |
| Số node DOM | 240.203 | 659 | −99,7% | |
| Main-thread work | 49,8 s | 10,6 s | −79% | |
| Dung lượng tải ban đầu | 240 KB | 244 KB | +2% | |
| Số request | 9 | 8 | −1 | |

## Chi tiết từng lần đo

### Trước – `/unoptimise`

| Lần | Score | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| 1 | 92 | 1,45 s | 2,44 s | 0 ms | 0 | 5,78 s |
| 2 | 88 | 1,53 s | 2,45 s | 0 ms | 0 | 10,03 s |
| 3 | 90 | 1,67 s | 2,43 s | 0 ms | 0 | 6,88 s |
| **Median** | **90** | **1,53 s** | **2,44 s** | **0 ms** | **0** | **6,88 s** |

### Sau – `/products`

| Lần | Score | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| 1 | 97 | 1,74 s | 2,43 s | 0 ms | 0 | 1,74 s |
| 2 | 97 | 1,74 s | 2,43 s | 0 ms | 0 | 1,74 s |
| 3 | 97 | 1,75 s | 2,43 s | 0 ms | 0 | 1,75 s |
| **Median** | **97** | **1,74 s** | **2,43 s** | **0 ms** | **0** | **1,74 s** |

## Giải pháp đã áp dụng và bằng chứng

| # | Vấn đề ở `/unoptimise` | Bằng chứng đo được | Giải pháp ở `/products` |
|---|---|---|---|
| 1 | Render cả 10.000 dòng vào DOM | DOM 240.203 node → 659 node; main-thread 49,8 s → 10,6 s; Speed Index 6,88 s → 1,74 s | Virtualization (`@tanstack/react-virtual`) |
| 2 | Gõ phím / tick checkbox re-render 10.000 dòng | **Chưa đo** (Lighthouse chỉ đo lúc tải trang; cần Performance panel khi tương tác) | `React.memo`, `useCallback`, truyền `selected` dạng boolean |
| 3 | Lọc/sắp xếp/thống kê chạy lại mỗi lần render | **Chưa đo** riêng | `useMemo`, `useDeferredValue` |
| 4 | Recharts và dialog nằm trong bundle ban đầu | Dung lượng tải ban đầu gần như không đổi (240 → 244 KB) vì biểu đồ vẫn hiển thị ngay khi mở trang | Code-splitting: `React.lazy` + `Suspense` theo route, biểu đồ, dialog |
| 5 | `Intl.NumberFormat` tạo mới trong từng ô | **Chưa đo** riêng | Tạo formatter một lần ở module scope |
| 6 | Biểu đồ tải muộn có thể gây nhảy layout | CLS = 0 ở cả hai trang | `Skeleton` giữ chỗ |

## Nhận xét

- **Cải thiện rõ nhất** là Speed Index (−75%), số node DOM (−99,7%) và main-thread work (−79%). Đây đều là hệ quả trực tiếp của virtualization. Score tăng từ 90 lên 97 và ổn định hơn: trước tối ưu Speed Index dao động từ 5,8 đến 10,0 s giữa các lần đo, sau tối ưu gần như không đổi.
- **TBT và CLS bằng 0 ở cả hai trang**, nên hai chỉ số này không chứng minh được gì. Với `/unoptimise`, công việc nặng (dựng 10.000 dòng) có vẻ xảy ra trước FCP nên không được tính vào TBT; đây là suy đoán của mình, chưa kiểm chứng bằng trace.
- **LCP không cải thiện** (~2,43 s ở cả hai), gần ngưỡng 2,5 s. Mình chưa xác định phần tử LCP là gì.
- **FCP chậm hơn khoảng 0,2 s** ở trang đã tối ưu. Có thể do tách chunk theo route làm trang phải tải thêm một lượt file trước khi vẽ. Mình chưa kiểm chứng nguyên nhân.
- **Code-splitting ở đây chưa giảm dung lượng ban đầu** vì biểu đồ nằm ngay trên màn hình đầu. Nó sẽ có ích hơn nếu biểu đồ nằm dưới fold hoặc trong tab riêng.
- **Hạn chế của số đo**: đo trong sandbox với Chromium headless, không phải Chrome thật trên máy bạn; độ trễ khi gõ phím và tick checkbox chưa được đo. Hãy đo lại bằng `PERFORMANCE_REPORT.md` trên máy bạn để có số liệu cho bài nộp.
