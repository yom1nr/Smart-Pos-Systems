import { useState } from 'react';
import { Search, User, UserPlus, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Member {
  id: number;
  name: string;
  phone: string;
  points: number;
}

interface MemberSearchProps {
  onSelectMember: (member: Member | null) => void;
}

const MemberSearch = ({ onSelectMember }: MemberSearchProps) => {
  const [phone, setPhone] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newName, setNewName] = useState('');

  // 🔍 ฟังก์ชันค้นหาสมาชิก
  const handleSearch = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await api.get(`/members/search?phone=${phone}`);
      setMember(res.data);
      onSelectMember(res.data); // ส่งข้อมูลกลับไปหน้า POS
      toast.success('พบข้อมูลสมาชิก');
      setIsRegistering(false);
    } catch (error) {
      setMember(null);
      onSelectMember(null);
      // ถ้าไม่เจอ ให้เปิดโหมดสมัครสมาชิก
      setIsRegistering(true);
      toast.error('ไม่พบสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  // 📝 ฟังก์ชันสมัครสมาชิกใหม่
  const handleRegister = async () => {
    if (!newName || !phone) return;
    try {
      const res = await api.post('/members', { name: newName, phone });
      setMember(res.data);
      onSelectMember(res.data);
      setIsRegistering(false);
      toast.success('สมัครสมาชิกเรียบร้อย!');
    } catch (error) {
      toast.error('สมัครสมาชิกไม่สำเร็จ');
    }
  };

  // ❌ ฟังก์ชันยกเลิก/ล้างข้อมูล
  const handleClear = () => {
    setPhone('');
    setMember(null);
    onSelectMember(null);
    setIsRegistering(false);
    setNewName('');
  };

  return (
    <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 mb-4">
      {/* 1. กรณีเลือกสมาชิกแล้ว -> โชว์ข้อมูล */}
      {member ? (
        <div className="flex items-center justify-between bg-indigo-600/20 p-3 rounded-lg border border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-full">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white">{member.name}</p>
              <p className="text-xs text-indigo-300">แต้มสะสม: {member.points} คะแนน</p>
            </div>
          </div>
          <button onClick={handleClear} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
      ) : (
        /* 2. กรณีค้นหา / สมัครสมาชิก */
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="เบอร์โทรศัพท์ลูกค้า..."
              className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
              <Search size={20} />
            </button>
          </div>

          {/* ฟอร์มสมัครสมาชิก (โผล่มาเมื่อค้นไม่เจอ) */}
          {isRegistering && (
            <div className="animate-in fade-in slide-in-from-top-2 pt-2 border-t border-slate-700/50 mt-1">
              <p className="text-xs text-slate-400 mb-2">ไม่พบสมาชิก? สมัครใหม่ได้เลย:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  className="flex-1 bg-[#0f172a] border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button
                  onClick={handleRegister}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1"
                >
                  <UserPlus size={16} /> สมัคร
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberSearch;