import { Link } from 'react-router-dom'; // ✅ ใช้ Link แทน button
import { Tag, ShoppingCart, Box, UserPlus, BarChart } from "lucide-react";
import toast from 'react-hot-toast'; // ✅ เพิ่มลูกเล่นแจ้งเตือน

export default function QuickActions() {
  return (
    <section className="mt-6 w-full rounded-xl bg-[#0f172a] p-6 shadow-lg border border-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <Tag className="h-5 w-5 text-slate-400" />
        การทำงานด่วน
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* 1. ปุ่มขายสินค้า (สีม่วง) -> ไปหน้า POS */}
        <Link
          to="/pos"
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-4 font-medium text-white transition hover:bg-indigo-500 shadow-lg hover:scale-105 transform duration-200"
        >
          <ShoppingCart className="h-6 w-6" />
          ขายสินค้า
        </Link>

        {/* 2. ปุ่มเพิ่มสต็อก -> ไปหน้า Products */}
        <Link
          to="/products"
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#020617] px-6 py-4 font-medium text-gray-300 transition hover:text-white hover:bg-slate-800 border border-slate-700 hover:scale-105 transform duration-200"
        >
          <Box className="h-6 w-6" />
          เพิ่มสต็อก
        </Link>

        {/* 3. ปุ่มสมัครสมาชิก -> ไปหน้า POS (เพราะเราทำฟอร์มไว้ที่นั่น) */}
        <Link
          to="/pos"
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#020617] px-6 py-4 font-medium text-gray-300 transition hover:text-white hover:bg-slate-800 border border-slate-700 hover:scale-105 transform duration-200"
        >
          <UserPlus className="h-6 w-6" />
          สมัครสมาชิก
        </Link>

        {/* 4. ปุ่มรายงาน -> แจ้งเตือนว่าเร็วๆ นี้ (กดเล่นแก้เหงา) */}
        <button
          type="button"
          onClick={() => toast('📊 ฟีเจอร์รายงานละเอียด กำลังมาเร็วๆ นี้ครับ!', { icon: '⏳' })}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#020617] px-6 py-4 font-medium text-gray-300 transition hover:text-white hover:bg-slate-800 border border-slate-700 active:scale-95"
        >
          <BarChart className="h-6 w-6" />
          รายงานยอดขาย
        </button>

      </div>
    </section>
  );
}