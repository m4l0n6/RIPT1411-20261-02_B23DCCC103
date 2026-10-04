// ✅ PHIÊN BẢN ĐÃ TỐI ƯU (route /products)
//  1. Virtualization  – @tanstack/react-virtual: chỉ render ~20 dòng nhìn thấy thay vì 10.000
//  2. Memoization     – React.memo (dòng), useMemo (lọc/sắp xếp/thống kê), useCallback (handler ổn định)
//  3. Code-splitting  – route lazy, biểu đồ Recharts & dialog tải lười (React.lazy + Suspense)
//  4. Concurrent UI   – useDeferredValue giữ ô tìm kiếm mượt khi lọc 10.000 dòng
import { lazy, Suspense, useCallback, useDeferredValue, useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import FilterBar from '@/components/products/FilterBar'
import type { ProductInput } from '@/components/products/ProductFormDialog'
import StatsCards from '@/components/products/StatsCards'
import { CATEGORIES, generateProducts } from '@/lib/data'
import { formatNumber, stockStatus, summarize } from '@/lib/format'
import type { Product, SortKey, StockFilter } from '@/lib/types'
import ProductRow from './ProductRow'

const RevenueChart = lazy(() => import('@/components/products/RevenueChart'))
const ProductFormDialog = lazy(() => import('@/components/products/ProductFormDialog'))

const COLS = 8
const ROW_HEIGHT = 57

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => generateProducts(10_000))
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [stock, setStock] = useState<StockFilter>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [selected, setSelected] = useState<ReadonlySet<number>>(() => new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const nextId = useRef(10_001)

  const deferredQuery = useDeferredValue(query)

  const rows = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const list = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (stock === 'all' || stockStatus(p.stock) === stock) &&
        (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)),
    )
    return list.sort((a, b) =>
      sort === 'price-asc' ? a.price - b.price
      : sort === 'price-desc' ? b.price - a.price
      : sort === 'best-seller' ? b.sold - a.sold
      : b.id - a.id,
    )
  }, [products, deferredQuery, category, stock, sort])

  const stats = useMemo(() => summarize(products), [products])
  const chartData = useMemo(() => {
    const totals = new Map<string, number>(CATEGORIES.map((c) => [c, 0]))
    for (const p of products) totals.set(p.category, (totals.get(p.category) ?? 0) + p.price * p.sold)
    return [...totals].map(([category, revenue]) => ({ category, revenue }))
  }, [products])

  // Handler ổn định (functional update) -> ProductRow memo không bị re-render thừa
  const toggle = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])
  const edit = useCallback((p: Product) => { setEditing(p); setDialogOpen(true) }, [])
  const remove = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setSelected((prev) => { if (!prev.has(id)) return prev; const n = new Set(prev); n.delete(id); return n })
  }, [])
  const bulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)))
    setSelected(new Set())
  }
  const save = useCallback((values: ProductInput, id?: number) => {
    if (id) setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...values } : p)))
    else {
      const newId = nextId.current++
      setProducts((prev) => [{ id: newId, sku: `SH-${String(newId).padStart(5, '0')}`, sold: 0, ...values }, ...prev])
    }
    setDialogOpen(false)
  }, [])

  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })
  const items = virtualizer.getVirtualItems()
  const padTop = items.length ? items[0].start : 0
  const padBottom = items.length ? virtualizer.getTotalSize() - items[items.length - 1].end : 0
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Sản phẩm</h1>
        <p className="text-sm text-muted-foreground">Quản lý danh mục hàng hóa, giá và tồn kho.</p>
      </header>

      <StatsCards {...stats} />
      <Suspense fallback={<Skeleton className="h-[320px] rounded-xl" />}>
        <RevenueChart data={chartData} />
      </Suspense>

      <section className="flex flex-col gap-3">
        <FilterBar
          query={query} onQuery={setQuery}
          category={category} onCategory={setCategory}
          stock={stock} onStock={setStock}
          sort={sort} onSort={setSort}
          onAdd={() => { setEditing(null); setDialogOpen(true) }}
        />

        <div className="flex h-8 items-center justify-between text-sm text-muted-foreground">
          <span>Hiển thị {formatNumber(rows.length)} / {formatNumber(products.length)} sản phẩm</span>
          {selected.size > 0 && (
            <div className="flex items-center gap-3">
              <span>Đã chọn {selected.size}</span>
              <Button variant="outline" size="sm" onClick={bulkDelete}><Trash2 />Xóa đã chọn</Button>
            </div>
          )}
        </div>

        <div ref={scrollRef} className="h-[560px] overflow-auto rounded-xl border bg-card">
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
              {padTop > 0 && <tr aria-hidden><td colSpan={COLS} style={{ height: padTop }} /></tr>}
              {items.map((v) => {
                const p = rows[v.index]
                return (
                  <ProductRow
                    key={p.id}
                    product={p}
                    index={v.index}
                    selected={selected.has(p.id)}
                    measureRef={virtualizer.measureElement}
                    onToggle={toggle}
                    onEdit={edit}
                    onDelete={remove}
                  />
                )
              })}
              {padBottom > 0 && <tr aria-hidden><td colSpan={COLS} style={{ height: padBottom }} /></tr>}
            </TableBody>
          </Table>
          {rows.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">Không có sản phẩm phù hợp. Thử đổi từ khóa hoặc bộ lọc.</p>}
        </div>
      </section>

      {dialogOpen && (
        <Suspense fallback={null}>
          <ProductFormDialog open={dialogOpen} product={editing} onOpenChange={setDialogOpen} onSubmit={save} />
        </Suspense>
      )}
    </div>
  )
}
