import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/data'
import type { SortKey, StockFilter } from '@/lib/types'

interface Props {
  query: string
  onQuery: (v: string) => void
  category: string
  onCategory: (v: string) => void
  stock: StockFilter
  onStock: (v: StockFilter) => void
  sort: SortKey
  onSort: (v: SortKey) => void
  onAdd: () => void
}

export default function FilterBar(p: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Tìm theo tên hoặc mã SKU" value={p.query} onChange={(e) => p.onQuery(e.target.value)} aria-label="Tìm sản phẩm" />
      </div>
      <Select value={p.category} onValueChange={p.onCategory}>
        <SelectTrigger aria-label="Danh mục"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={p.stock} onValueChange={(v) => p.onStock(v as StockFilter)}>
        <SelectTrigger aria-label="Tồn kho"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Mọi trạng thái</SelectItem>
          <SelectItem value="in">Còn hàng</SelectItem>
          <SelectItem value="low">Sắp hết</SelectItem>
          <SelectItem value="out">Hết hàng</SelectItem>
        </SelectContent>
      </Select>
      <Select value={p.sort} onValueChange={(v) => p.onSort(v as SortKey)}>
        <SelectTrigger aria-label="Sắp xếp"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="best-seller">Bán chạy</SelectItem>
          <SelectItem value="price-asc">Giá tăng dần</SelectItem>
          <SelectItem value="price-desc">Giá giảm dần</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={p.onAdd} className="ml-auto"><Plus />Thêm sản phẩm</Button>
    </div>
  )
}
