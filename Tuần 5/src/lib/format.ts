import type { Product } from './types'

const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })
const num = new Intl.NumberFormat('vi-VN')

export const formatVND = (n: number) => vnd.format(n)
export const formatNumber = (n: number) => num.format(n)

export function stockStatus(stock: number): 'in' | 'low' | 'out' {
  return stock === 0 ? 'out' : stock < 20 ? 'low' : 'in'
}

export const STOCK_LABEL = { in: 'Còn hàng', low: 'Sắp hết', out: 'Hết hàng' } as const

export function summarize(products: Product[]) {
  let revenue = 0, low = 0, out = 0
  for (const p of products) {
    revenue += p.price * p.sold
    const s = stockStatus(p.stock)
    if (s === 'low') low++
    else if (s === 'out') out++
  }
  return { total: products.length, revenue, low, out }
}
