import { useEffect, useState } from 'react';
import api from '../services/api'; 
import { 
  DollarSign, ShoppingCart, Package, TrendingUp, 
  Users, AlertTriangle // ✅ เพิ่ม icon ที่ขาด
} from 'lucide-react';

// Import Components
import StockStatus from '../components/StockStatus';
import BestSellers from '../components/BestSellers';
import RecentSales from '../components/RecentSales'; 
import QuickActions from '../components/QuickActions';
import ReceiptModal from '../components/ReceiptModal'; // ✅ ต้องมีอันนี้ เพื่อแสดงใบเสร็จ

const Dashboard = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State สำหรับเปิดใบเสร็จ
  const [selectedSale, setSelectedSale] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          api.get('/sales'),
          api.get('/products')
        ]);
        setSales(salesRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 // 🔥 ฟังก์ชันเปิดใบเสร็จ (ฉบับอัปเกรด: ดึงข้อมูลจริง!)
 const handleViewReceipt = async (sale: any) => {
  try {
    // 1. เรียก API ไปดึงไส้ในของบิลนี้
    const res = await api.get(`/sales/${sale.id}`);
    const fullData = res.data;

    // 2. จัดรูปแบบข้อมูลให้เข้ากับ Modal
    setSelectedSale({
        saleId: fullData.id,
        date: fullData.created_at || fullData.sale_date,
        
        // ✅ ตรงนี้แหละ! เอารายการสินค้าจริงใส่เข้าไป
        items: fullData.items.map((item: any) => ({
          name: item.name, 
          qty: item.qty, 
          price: item.price
        })),
        
        total: fullData.total_amount,
        paymentMethod: fullData.payment_method,
        // เช็คว่ามีสมาชิกไหม
        member: fullData.customer_name ? { 
          name: fullData.customer_name, 
          phone: fullData.customer_phone 
        } : null
    });

    // 3. เปิด Modal
    setIsReceiptOpen(true);

  } catch (error) {
    console.error("Error fetching sale details:", error);
    // alert('ไม่สามารถดึงรายละเอียดบิลได้');
  }
};

  // คำนวณ Stats
  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalOrders = sales.length;
  const lowStockCount = products.filter(p => p.stock < 5).length;

  const dashboardStats = [
    { label: "ยอดขายรวม", value: `฿${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: "จำนวนออเดอร์", value: totalOrders.toLocaleString(), icon: ShoppingCart },
    { label: "ลูกค้าทั้งหมด", value: "ทั่วไป", icon: Users },
    { label: "สินค้าใกล้หมด", value: `${lowStockCount} รายการ`, icon: AlertTriangle },
  ];

  // ไอคอนสำหรับ Stats
  const statIcons = {
    "dollar-sign": DollarSign,
    "shopping-cart": ShoppingCart,
    users: Users,
    "alert-triangle": AlertTriangle,
  };

  return (
    <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-white pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">แดชบอร์ด</h1>
          <p className="text-slate-400">ภาพรวมของร้านค้าวันนี้</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-lg font-mono text-emerald-400">
            {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-5 shadow-lg border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{loading ? "..." : stat.value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* ✅ จุดสำคัญ: ส่งฟังก์ชัน handleViewReceipt ไปให้ RecentSales ใช้งาน */}
          <RecentSales sales={sales} onViewReceipt={handleViewReceipt} /> 
        </div>
        <div>
          <StockStatus products={products} />
        </div>
      </section>

      <BestSellers />

      {/* ✅ Modal สำหรับแสดงใบเสร็จ (ต้องวางไว้ท้ายสุด) */}
      <ReceiptModal 
        isOpen={isReceiptOpen} 
        onClose={() => setIsReceiptOpen(false)} 
        data={selectedSale} 
      />
    </div>
  );
};

export default Dashboard;