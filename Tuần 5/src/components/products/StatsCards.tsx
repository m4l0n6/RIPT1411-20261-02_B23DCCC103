import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card'
import { formatNumber, formatVND } from '@/lib/format'

interface Props { total: number; revenue: number; low: number; out: number }

export default function StatsCards({ total, revenue, low, out }: Props) {
  const items = [
    { label: 'Tổng sản phẩm', value: formatNumber(total), hint: 'Đang quản lý' },
    { label: 'Doanh thu lũy kế', value: formatVND(revenue), hint: 'Giá × số lượng đã bán' },
    { label: 'Sắp hết hàng', value: formatNumber(low), hint: 'Tồn kho dưới 20' },
    { label: 'Hết hàng', value: formatNumber(out), hint: 'Cần nhập thêm' },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => (
        <Card key={s.label} className="gap-2">
          <CardHeader><CardDescription>{s.label}</CardDescription></CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-semibold tracking-tight">{s.value}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
