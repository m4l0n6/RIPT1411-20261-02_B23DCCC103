import { NavLink, Outlet } from 'react-router-dom'
import { Package, Users, Gauge, Store } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/products', label: 'Sản phẩm', icon: Package },
  { to: '/users', label: 'Người dùng', icon: Users },
]

function Item({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Package }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
          isActive && 'bg-accent font-medium text-accent-foreground',
        )
      }
    >
      <Icon className="size-4" />
      {label}
    </NavLink>
  )
}

export default function AppLayout() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b bg-card p-3 md:sticky md:top-0 md:h-screen md:border-r md:border-b-0 md:p-4">
        <div className="flex items-center gap-2 px-2 pb-3 md:pb-6">
          <div className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Store className="size-4" />
          </div>
          <span className="font-semibold">SalesHub</span>
        </div>
        <nav className="flex gap-1 md:flex-col">
          {NAV.map((n) => <Item key={n.to} {...n} />)}
          <div className="md:mt-6 md:border-t md:pt-4">
            <p className="hidden px-3 pb-1 text-xs text-muted-foreground md:block">Đo hiệu năng</p>
            <NavLink
              to="/unoptimise"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent font-medium text-accent-foreground',
                )
              }
            >
              <Gauge className="size-4" />
              Chưa tối ưu
              <Badge variant="outline" className="ml-auto hidden md:inline-flex">/unoptimise</Badge>
            </NavLink>
          </div>
        </nav>
      </aside>
      <main className="min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
