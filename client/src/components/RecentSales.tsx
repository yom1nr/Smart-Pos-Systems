import { User, Package, TrendingUp, ShoppingCart } from 'lucide-react';

// 1. เพิ่ม onViewReceipt เข้าไปใน Props เพื่อรับฟังก์ชันเปิด Modal
interface Sale {
  id: number;
  customer_name: string;
  total_amount: number;
  payment_method: string;
  item_count: number;
  created_at: string;
  // เพิ่ม field อื่นๆ ที่ API อาจส่งมา (เผื่อไว้)
  sale_date?: string; 
  member_id?: number;
}

interface RecentSalesProps {
  sales: Sale[];
  onViewReceipt?: (sale: Sale) => void; // ✅ รับฟังก์ชันเปิด Modal (ใส่ ? เผื่อไม่ได้ส่งมาจะได้ไม่ Error)
}

const RecentSales = ({ sales, onViewReceipt }: RecentSalesProps) => {

  const formatTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-[#0f172a] p-6 rounded-xl shadow-lg border border-slate-800 h-full w-full"> 
      
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
           <span className="text-white"> <ShoppingCart size={20} /> </span> การขายล่าสุด
        </h2>
      </div>

      <div className="space-y-3 w-full"> 
        {sales.slice(0, 5).map((sale) => (
          <div key={sale.id} className="w-full bg-[#1e293b] p-4 rounded-xl flex justify-between items-center border border-transparent hover:border-slate-600 transition-colors">
            
            {/* --- ฝั่งซ้าย --- */}
            <div className="flex flex-col gap-2 min-w-0 flex-1 mr-4">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg tracking-wide whitespace-nowrap">
                  SAL{String(sale.id).padStart(3, '0')}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${
                  sale.payment_method === 'cash' ? 'bg-white/10 text-white border-white/20' : 
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {sale.payment_method === 'cash' ? 'เงินสด' : 'โอนเงิน'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 whitespace-nowrap overflow-hidden">
                <div className="flex items-center gap-1 min-w-0">
                  <User size={12} className="flex-shrink-0" /> 
                  <span className="truncate">{sale.customer_name}</span>
                </div>
                <div className="hidden xl:flex items-center gap-1 flex-shrink-0">
                  <Package size={12} /> {sale.item_count} รายการ
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <TrendingUp size={12} /> {formatTime(sale.created_at || sale.sale_date || '')}
                </div>
              </div>
            </div>

            {/* --- ฝั่งขวา: ราคาและปุ่ม --- */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-green-400 font-bold text-xl whitespace-nowrap">
                ฿{Number(sale.total_amount).toLocaleString()}
              </span>
              
              <div className="flex gap-2">
                {/* ✅ ปุ่มดูรายละเอียด: ใส่ onClick ให้เรียกฟังก์ชัน */}
                <button 
                  onClick={() => onViewReceipt && onViewReceipt(sale)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-600 text-slate-300 text-xs hover:bg-slate-700 transition whitespace-nowrap"
                >
                  ดูรายละเอียด
                </button>
                
                {/* ✅ ปุ่มพิมพ์ใบเสร็จ: กดแล้วก็เปิด Modal เหมือนกัน (จะได้กดสั่งพิมพ์ได้) */}
                <button 
                  onClick={() => onViewReceipt && onViewReceipt(sale)}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs hover:bg-indigo-500/30 transition whitespace-nowrap"
                >
                  พิมพ์ใบเสร็จ
                </button>
              </div>
            </div>

          </div>
        ))}

        {sales.length === 0 && (
             <p className="text-gray-500 text-center py-4">ยังไม่มีรายการขาย</p>
        )}
      </div>
    </div>
  );
};

export default RecentSales;