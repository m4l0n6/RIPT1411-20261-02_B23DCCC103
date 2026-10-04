import { memo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatNumber, formatVND, STOCK_LABEL, stockStatus } from '@/lib/format'
import type { Product } from '@/lib/types'

interface Props {
  product: Product
  index: number
  selected: boolean
  measureRef: (el: Element | null) => void
  onToggle: (id: number) => void
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

// React.memo: chỉ re-render khi product / selected của CHÍNH dòng này đổi.
// Các callback được cha bọc useCallback nên tham chiếu ổn định.
function ProductRowBase({ product: p, index, selected, measureRef, onToggle, onEdit, onDelete }: Props) {
  const s = stockStatus(p.stock)
  return (
    <TableRow ref={measureRef} data-index={index} data-state={selected ? 'selected' : undefined}>
      <TableCell className="w-11">
        <Checkbox aria-label={`Chọn ${p.name}`} checked={selected} onCheckedChange={() => onToggle(p.id)} />
      </TableCell>
      <TableCell>
        <div className="truncate font-medium">{p.name}</div>
        <div className="text-xs text-muted-foreground">{p.sku}</div>
      </TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell className="text-right tabular-nums">{formatVND(p.price)}</TableCell>
      <TableCell className="text-right tabular-nums">{formatNumber(p.stock)}</TableCell>
      <TableCell className="text-right tabular-nums">{formatNumber(p.sold)}</TableCell>
      <TableCell>
        <Badge variant={s === 'in' ? 'secondary' : s === 'low' ? 'outline' : 'destructive'}>{STOCK_LABEL[s]}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" aria-label="Sửa" onClick={() => onEdit(p)}><Pencil /></Button>
        <Button variant="ghost" size="icon" aria-label="Xóa" onClick={() => onDelete(p.id)}><Trash2 /></Button>
      </TableCell>
    </TableRow>
  )
}

export default memo(ProductRowBase)
