import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart, User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { username, password });
      
      if (res.data.success) {
        // บันทึก User ลงเครื่อง
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`ยินดีต้อนรับคุณ ${res.data.user.name}`);
        
        // ดีดไปหน้าแรก (Dashboard)
        navigate('/');
        window.location.reload(); // รีโหลดเพื่อให้ App รู้ว่าล็อคอินแล้ว
      }
    } catch (error) {
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-300">
        
        {/* โลโก้ & หัวข้อ */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-500/30">
            <ShoppingCart size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">เข้าสู่ระบบ</h1>
          <p className="text-slate-400 mt-1">Smart POS System</p>
        </div>

        {/* ฟอร์ม Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* ช่อง Username */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">ชื่อผู้ใช้งาน</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text" 
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="เช่น admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ช่อง Password */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">รหัสผ่าน</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="password" 
                className="w-full bg-[#0f172a] border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ปุ่ม Login */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        

      </div>
    </div>
  );
};

export default Login;