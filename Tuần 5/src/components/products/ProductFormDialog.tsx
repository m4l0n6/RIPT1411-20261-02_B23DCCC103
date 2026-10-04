import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/data'
import type { Category, Product } from '@/lib/types'

export type ProductInput = Pick<Product, 'name' | 'category' | 'price' | 'stock'>

interface Props {
  open: boolean
  product: Product | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ProductInput, id?: number) => void
}

function ProductForm({ product, onCancel, onSubmit }: { product: Product | null; onCancel: () => void; onSubmit: Props['onSubmit'] }) {
  const [name, setName] = useState(product?.name ?? '')
  const [category, setCategory] = useState<Category>(product?.category ?? CATEGORIES[0])
  const [price, setPrice] = useState(String(product?.price ?? ''))
  const [stock, setStock] = useState(String(product?.stock ?? ''))
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    const p = Number(price), s = Number(stock)
    if (!name.trim()) return setError('Vui lòng nhập tên sản phẩm.')
    if (!(p > 0)) return setError('Giá bán phải lớn hơn 0.')
    if (!Number.isInteger(s) || s < 0) return setError('Tồn kho phải là số nguyên từ 0 trở lên.')
    onSubmit({ name: name.trim(), category, price: p, stock: s }, product?.id)
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogDescription>{product ? `Mã ${product.sku}` : 'Sản phẩm mới sẽ hiển thị ở đầu danh sách.'}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-2">
        <Label htmlFor="pf-name">Tên sản phẩm</Label>
        <Input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div className="grid gap-2">
        <Label>Danh mục</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pf-price">Giá bán (₫)</Label>
          <Input id="pf-price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pf-stock">Tồn kho</Label>
          <Input id="pf-stock" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
        <Button type="submit">{product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</Button>
      </DialogFooter>
    </form>
  )
}

export default function ProductFormDialog({ open, product, onOpenChange, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ProductForm product={product} onCancel={() => onOpenChange(false)} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
