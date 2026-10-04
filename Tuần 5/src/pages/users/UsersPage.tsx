import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { generateUsers } from '@/lib/data'
import { formatNumber, formatVND } from '@/lib/format'

export default function UsersPage() {
  const [users] = useState(() => generateUsers(1_000))
  const [query, setQuery] = useState('')
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (q ? users.filter((u) => u.name.toLowerCase().includes(q) || u.email.includes(q)) : users).slice(0, 100)
  }, [users, query])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Người dùng</h1>
        <p className="text-sm text-muted-foreground">Nhân viên và khách hàng của cửa hàng. Hiển thị tối đa 100 kết quả.</p>
      </header>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Tìm theo tên hoặc email" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Tìm người dùng" />
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Người dùng</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Đơn hàng</TableHead>
              <TableHead className="text-right">Chi tiêu</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNumber(u.orders)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatVND(u.spent)}</TableCell>
                <TableCell><Badge variant={u.active ? 'secondary' : 'outline'}>{u.active ? 'Hoạt động' : 'Tạm khóa'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">Không tìm thấy người dùng phù hợp.</p>}
      </div>
    </div>
  )
}
