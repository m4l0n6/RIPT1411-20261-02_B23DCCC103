// ⚠️ PHIÊN BẢN CỐ Ý CHƯA TỐI ƯU – dùng làm mốc "TRƯỚC" khi đo Lighthouse (route /unoptimise)
// Các vấn đề có chủ đích:
//  1. Render toàn bộ 10.000 dòng vào DOM (không virtualization)
//  2. Mỗi lần gõ phím / chọn checkbox đều re-render 10.000 dòng (không memo, không debounce)
//  3. Lọc + sắp xếp + tính thống kê chạy lại ở MỌI lần render (không useMemo)
//  4. Định dạng tiền bằng toLocaleString trong từng ô (tạo Intl.NumberFormat mới mỗi lần)
//  5. Recharts + dialog được import tĩnh -> nằm trong bundle ban đầu (không code-splitting)
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import FilterBar from '@/components/products/FilterBar'
import ProductFormDialog, { type ProductInput } from '@/components/products/ProductFormDialog'
import RevenueChart from '@/components/products/RevenueChart'
import StatsCards from '@/components/products/StatsCards'
import { CATEGORIES, generateProducts } from '@/lib/data'
import { STOCK_LABEL, stockStatus, summarize } from '@/lib/format'
import type { Product, SortKey, StockFilter } from '@/lib/types'

export default function UnoptimisedProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => generateProducts(10_000))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [stock, setStock] = useState<StockFilter>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  // Chạy lại ở mỗi render
  const q = query.trim().toLowerCase()
  const rows = products
    .filter((p) => (category === 'all' || p.category === category))
    .filter((p) => stock === 'all' || stockStatus(p.stock) === stock)
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    .sort((a, b) =>
      sort === 'price-asc' ? a.price - b.price
      : sort === 'price-desc' ? b.price - a.price
      : sort === 'best-seller' ? b.sold - a.sold
      : b.id - a.id,
    )
  const stats = summarize(products)
  const chartData = CATEGORIES.map((c) => ({
    category: c,
    revenue: products.filter((p) => p.category === c).reduce((s, p) => s + p.price * p.sold, 0),
  }))

  function save(values: ProductInput, id?: number) {
    if (id) setProducts(products.map((p) => (p.id === id ? { ...p, ...values } : p)))
    else {
      const nextId = Math.max(...products.map((p) => p.id)) + 1
      setProducts([{ id: nextId, sku: `SH-${String(nextId).padStart(5, '0')}`, sold: 0, ...values }, ...products])
    }
    setDialogOpen(false)
  }

  function bulkDelete() {
    setProducts(products.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }

  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sản phẩm</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh mục hàng hóa, giá và tồn kho.</p>
        </div>
        <Badge variant="destructive">Chưa tối ưu</Badge>
      </header>

      <StatsCards {...stats} />
      <RevenueChart data={chartData} />

      <section className="flex flex-col gap-3">
        <FilterBar
          query={query} onQuery={setQuery}
          category={category} onCategory={setCategory}
          stock={stock} onStock={setStock}
          sort={sort} onSort={setSort}
          onAdd={() => { setEditing(null); setDialogOpen(true) }}
        />

        <div className="flex h-8 items-center justify-between text-sm text-muted-foreground">
          <span>Hiển thị {rows.length.toLocaleString('vi-VN')} / {products.length.toLocaleString('vi-VN')} sản phẩm</span>
          {selected.size > 0 && (
            <div className="flex items-center gap-3">
              <span>Đã chọn {selected.size}</span>
              <Button variant="outline" size="sm" onClick={bulkDelete}><Trash2 />Xóa đã chọn</Button>
            </div>
          )}
        </div>

        <div className="h-[560px] overflow-auto rounded-xl border bg-card">
          <Table className="min-w-[900px] table-fixed" containerClassName="overflow-visible">
            <TableHeader className="sticky top-0 z-10 bg-card shadow-[0_1px_0_var(--border)]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-11">
                  <Checkbox
                    aria-label="Chọn tất cả"
                    checked={allChecked}
                    onCheckedChange={(c) => setSelected(c ? new Set(rows.map((r) => r.id)) : new Set())}
                  />
                </TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className="w-32">Danh mục</TableHead>
                <TableHead className="w-36 text-right">Giá bán</TableHead>
                <TableHead className="w-24 text-right">Tồn kho</TableHead>
                <TableHead className="w-24 text-right">Đã bán</TableHead>
                <TableHead className="w-28">Trạng thái</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => {
                const s = stockStatus(p.stock)
                return (
                  <TableRow key={p.id} data-state={selected.has(p.id) ? 'selected' : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Chọn ${p.name}`}
                        checked={selected.has(p.id)}
                        onCheckedChange={() => {
                          const next = new Set(selected)
                          if (next.has(p.id)) next.delete(p.id)
                          else next.add(p.id)
                          setSelected(next)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sku}</div>
                    </TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {p.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{p.stock.toLocaleString('vi-VN')}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.sold.toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      <Badge variant={s === 'in' ? 'secondary' : s === 'low' ? 'outline' : 'destructive'}>{STOCK_LABEL[s]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" aria-label="Sửa" onClick={() => { setEditing(p); setDialogOpen(true) }}><Pencil /></Button>
                      <Button variant="ghost" size="icon" aria-label="Xóa" onClick={() => setProducts(products.filter((x) => x.id !== p.id))}><Trash2 /></Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {rows.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">Không có sản phẩm phù hợp. Thử đổi từ khóa hoặc bộ lọc.</p>}
        </div>
      </section>

      <ProductFormDialog open={dialogOpen} product={editing} onOpenChange={setDialogOpen} onSubmit={save} />
    </div>
  )
}
