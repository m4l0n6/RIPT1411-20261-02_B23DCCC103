import type { Category, Product, User, UserRole } from './types'

// PRNG có seed -> dữ liệu giống nhau giữa các lần đo Lighthouse
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const CATEGORIES: Category[] = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Gia dụng', 'Thời trang', 'Mỹ phẩm']

const CATALOG: Record<Category, { brands: string[]; items: string[]; price: [number, number] }> = {
  'Điện thoại': { brands: ['Samsung', 'Xiaomi', 'OPPO', 'Realme', 'Vivo'], items: ['Galaxy A', 'Redmi Note', 'Reno', 'Narzo', 'Y Series'], price: [2_500_000, 28_000_000] },
  Laptop: { brands: ['Dell', 'Asus', 'Lenovo', 'HP', 'Acer'], items: ['Inspiron', 'Vivobook', 'IdeaPad', 'Pavilion', 'Aspire'], price: [9_000_000, 45_000_000] },
  'Phụ kiện': { brands: ['Anker', 'Baseus', 'Logitech', 'Ugreen', 'JBL'], items: ['Sạc nhanh', 'Cáp USB-C', 'Chuột không dây', 'Tai nghe', 'Loa Bluetooth'], price: [90_000, 2_400_000] },
  'Gia dụng': { brands: ['Philips', 'Sunhouse', 'Panasonic', 'Sharp', 'Kangaroo'], items: ['Nồi chiên không dầu', 'Máy xay', 'Bình đun', 'Quạt đứng', 'Máy lọc không khí'], price: [250_000, 6_500_000] },
  'Thời trang': { brands: ['Routine', 'Coolmate', 'Owen', 'Yame', 'Canifa'], items: ['Áo thun', 'Quần jeans', 'Áo sơ mi', 'Áo khoác', 'Quần short'], price: [120_000, 1_500_000] },
  'Mỹ phẩm': { brands: ['Cocoon', 'Innisfree', 'La Roche-Posay', 'Cetaphil', 'Klairs'], items: ['Sữa rửa mặt', 'Kem chống nắng', 'Serum', 'Toner', 'Kem dưỡng'], price: [90_000, 1_200_000] },
}

export function generateProducts(count = 10_000): Product[] {
  const rnd = mulberry32(2026)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]
  return Array.from({ length: count }, (_, i) => {
    const category = pick(CATEGORIES)
    const c = CATALOG[category]
    const price = Math.round((c.price[0] + rnd() * (c.price[1] - c.price[0])) / 1000) * 1000
    const r = rnd()
    return {
      id: i + 1,
      sku: `SH-${String(i + 1).padStart(5, '0')}`,
      name: `${pick(c.items)} ${pick(c.brands)} ${Math.floor(rnd() * 900 + 100)}`,
      category,
      price,
      stock: r < 0.08 ? 0 : r < 0.25 ? Math.floor(rnd() * 20) : Math.floor(20 + rnd() * 480),
      sold: Math.floor(rnd() * 2000),
    }
  })
}

const LAST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi']
const MID = ['Văn', 'Thị', 'Minh', 'Ngọc', 'Quốc', 'Thu', 'Gia', 'Hải']
const FIRST = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa', 'Linh', 'Nam', 'Phúc', 'Trang']
const ROLES: UserRole[] = ['Khách hàng', 'Khách hàng', 'Khách hàng', 'Nhân viên', 'Quản trị']

export function generateUsers(count = 1_000): User[] {
  const rnd = mulberry32(7)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST)
    return {
      id: i + 1,
      name: `${pick(LAST)} ${pick(MID)} ${first}`,
      email: `${first.toLowerCase()}${i + 1}@saleshub.vn`,
      role: pick(ROLES),
      orders: Math.floor(rnd() * 60),
      spent: Math.round(rnd() * 80_000) * 1000,
      active: rnd() > 0.15,
    }
  })
}
