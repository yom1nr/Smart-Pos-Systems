// ลบ api, useEffect, useState ออก เพราะรับค่าจาก Dashboard มาเลย
import { Box } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
}

interface StockStatusProps {
  products?: Product[]; // รับ Props เข้ามา
}

const StockStatus = ({ products = [] }: StockStatusProps) => {
  
  // 🔥 Logic เพิ่มเติม: เรียงสินค้าตามสต็อก (น้อย -> มาก)
  // สินค้าหมด หรือ ใกล้หมด จะเด้งไปอยู่บนสุดให้เห็นชัดๆ
  const sortedProducts = [...products].sort((a, b) => a.stock - b.stock);

  // ฟังก์ชันเลือกสีป้ายสถานะ (Logic เดิมที่สวยงาม)
  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <span className="px-2 py-1 text-xs font-medium rounded bg-red-500/20 text-red-400">หมด</span>;
    if (stock < 10) return <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-500/20 text-yellow-400">น้อย</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400">ปกติ</span>;
  };

  return (
    <div className="bg-[#0f172a] p-6 rounded-xl shadow-lg border border-slate-800 h-full">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
           <span className="text-white"> <Box size={20} /> </span> สถานะสต็อก
        </h2>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {sortedProducts.map((item) => (
          <div key={item.id} className="bg-[#1e293b] p-4 rounded-xl flex justify-between items-center border border-transparent hover:border-slate-600 transition-colors">
            {/* ฝั่งซ้าย: ชื่อสินค้า */}
            <div>
              <h3 className="text-white font-bold text-base">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{item.category}</span>
                <span className="text-xs text-slate-500">• คงเหลือ: {item.stock} ชิ้น</span>
              </div>
            </div>

            {/* ฝั่งขวา: สถานะและราคา */}
            <div className="text-right flex flex-col items-end gap-1">
              {getStatusBadge(item.stock)}
              <span className="text-white font-bold text-lg">฿{item.price}</span>
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
            <p className="text-gray-500 text-center py-4">ยังไม่มีข้อมูลสินค้า</p>
        )}
      </div>
      
      {/* CSS แต่ง Scrollbar ให้สวย ไม่รกตา */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569; 
        }
      `}</style>  
    </div>
  );
};

export default StockStatus;