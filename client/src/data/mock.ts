export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
}

export interface RecentSale {
  id: string;
  billId: string;
  paymentMethod: "Cash" | "Transfer";
  amount: number;
  customerName: string;
  itemCount: number;
  time: string;
}

export type StockStatusType = "normal" | "low" | "critical";

export interface StockItem {
  name: string;
  category: string;
  quantityRemaining: number;
  price: number;
  status: StockStatusType;
}

export const statsData: StatCard[] = [
  { label: "ยอดขายรวม", value: "฿ 2,450,000", icon: "dollar-sign" },
  { label: "คำสั่งซื้อ", value: "128", icon: "shopping-cart" },
  { label: "ลูกค้า", value: "89", icon: "users" },
  { label: "สต็อกต่ำ", value: "5", icon: "alert-triangle" },
];

export const recentSalesData: RecentSale[] = [
  {
    id: "1",
    billId: "SAL001",
    paymentMethod: "Cash",
    amount: 1250,
    customerName: "สมชาย ใจดี",
    itemCount: 5,
    time: "14:30",
  },
  {
    id: "2",
    billId: "SAL002",
    paymentMethod: "Transfer",
    amount: 3200,
    customerName: "สมหญิง สุขใจ",
    itemCount: 3,
    time: "14:25",
  },
  {
    id: "3",
    billId: "SAL003",
    paymentMethod: "Cash",
    amount: 890,
    customerName: "มานี มีใจ",
    itemCount: 8,
    time: "14:18",
  },
  {
    id: "4",
    billId: "SAL004",
    paymentMethod: "Transfer",
    amount: 4500,
    customerName: "วิชัย มีสุข",
    itemCount: 2,
    time: "14:10",
  },
  {
    id: "5",
    billId: "SAL005",
    paymentMethod: "Cash",
    amount: 2100,
    customerName: "ประเสริฐ สุขใจ",
    itemCount: 4,
    time: "14:02",
  },
];

export const stockData: StockItem[] = [
  { name: "น้ำดื่ม 600ml", category: "เครื่องดื่ม", quantityRemaining: 120, price: 15, status: "normal" },
  { name: "ขนมปัง", category: "อาหาร", quantityRemaining: 45, price: 25, status: "normal" },
  { name: "สบู่", category: "ของใช้", quantityRemaining: 8, price: 35, status: "low" },
  { name: "นม 1 ลิตร", category: "เครื่องดื่ม", quantityRemaining: 22, price: 42, status: "normal" },
  { name: "ไข่ (ถาด)", category: "อาหาร", quantityRemaining: 3, price: 55, status: "critical" },
];
