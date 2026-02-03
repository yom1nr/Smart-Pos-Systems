import { useState } from 'react'; // ✅ เพิ่ม useState
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, LogOut, X, AlertCircle } from 'lucide-react'; // ✅ เพิ่ม Icon
import toast from 'react-hot-toast';

const Layout = () => {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false); // ✅ State ควบคุม Modal

  // ดึงชื่อ User มาโชว์แบบปลอดภัย
  let user = { name: 'Admin User', role: 'admin' };
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    localStorage.removeItem('user');
  }

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  // 🔥 ฟังก์ชันยืนยันการออก (ทำงานจริง)
  const confirmLogout = () => {
    localStorage.removeItem('user');
    toast.success('ออกจากระบบเรียบร้อย');
    setIsLogoutOpen(false); // ปิด Modal
    navigate('/login'); // ดีดไปหน้า Login
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white">
      {/* --- Navbar ด้านบน --- */}
      <header className="h-16 border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
        
        {/* โลโก้ */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Smart POS
          </span>
        </Link>

        {/* เมนูตรงกลาง */}
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={getLinkClass}>
            <LayoutDashboard size={18} /> แดชบอร์ด
          </NavLink>
          <NavLink to="/pos" className={getLinkClass}>
            <ShoppingCart size={18} /> ขายหน้าร้าน
          </NavLink>
          <NavLink to="/products" className={getLinkClass}>
            <Package size={18} /> คลังสินค้า
          </NavLink>
        </nav>

        {/* โปรไฟล์มุมขวา */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">{user.name}</p>
            <p className="text-xs text-slate-400">
              {user.role === 'admin' ? 'ผู้จัดการร้าน' : 'พนักงานขาย'}
            </p>
          </div>
          
          {/* ✅ เปลี่ยนปุ่ม Logout ให้เปิด Modal แทน Alert */}
          <button 
            onClick={() => setIsLogoutOpen(true)}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 rounded-lg" 
            title="ออกจากระบบ"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* --- เนื้อหาที่จะเปลี่ยนไปตามหน้า --- */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
           <Outlet /> 
        </div>
      </main>

      {/* 🔥 Modal ยืนยันการออกจากระบบ (ดีไซน์ใหม่) */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl shadow-2xl border border-slate-700 p-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-500/10 p-3 rounded-full">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <button onClick={() => setIsLogoutOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">ยืนยันการออกจากระบบ?</h3>
            <p className="text-slate-400 mb-6">คุณต้องการออกจากระบบและกลับไปที่หน้า Login ใช่หรือไม่?</p>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsLogoutOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 font-medium transition"
              >
                ยกเลิก
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium shadow-lg shadow-red-500/20 transition"
              >
                ออกจากระบบ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Layout;