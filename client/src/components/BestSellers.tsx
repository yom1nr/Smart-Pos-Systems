import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from "lucide-react";
import api from '../services/api';

// กำหนดหน้าตาข้อมูลที่ API ส่งมา
interface BestSeller {
  id: number;
  name: string;
  total_sold: number; // ยอดขายรวม (ชิ้น)
}

export default function BestSellers() {
  const [data, setData] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // เรียก API ที่เราสร้างไว้ (server/routes/saleRoutes.ts)
        const response = await api.get('/sales/bestsellers');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // ฟังก์ชันสลับสีตัวเลข (ใช้ Logic เดิมของคุณ)
  const getRankColor = (index: number) => {
    const colors = ["text-blue-400", "text-green-400", "text-purple-400", "text-orange-400", "text-pink-400"];
    return colors[index % colors.length];
  };

  return (
    <section className="rounded-xl bg-[#0f172a] p-6 shadow-lg h-full">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <BarChart3 className="h-5 w-5 text-slate-400" />
        สินค้าขายดี 5 อันดับแรก
      </h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
           <p className="text-slate-500 col-span-full text-center py-8">กำลังคำนวณยอดขาย...</p>
        ) : data.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-6 text-slate-500 opacity-70">
              <TrendingUp size={48} className="mb-2 opacity-50"/>
              <p>ยังไม่มีข้อมูลสินค้าขายดี</p>
           </div>
        ) : (
          data.map((item, index) => (
            <div
              key={item.id}
              className="rounded-lg bg-slate-800/50 p-4 transition hover:bg-slate-700/50 flex flex-col justify-between"
            >
              <div>
                {/* แสดงอันดับ (Rank) ตัวใหญ่ๆ */}
                <p className={`text-3xl font-bold ${getRankColor(index)}`}>
                  #{index + 1}
                </p>
                <p className="mt-2 font-medium text-white truncate" title={item.name}>
                  {item.name}
                </p>
              </div>
              {/* แสดงยอดขายจริง */}
              <p className="mt-1 text-sm text-slate-400">
                ขายไปแล้ว {item.total_sold} ชิ้น
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}