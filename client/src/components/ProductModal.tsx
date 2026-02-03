import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: any) => void;
  initialData?: any;
}

const ProductModal = ({ isOpen, onClose, onSubmit, initialData }: ProductModalProps) => {
  // 🔥 เปลี่ยน state: เก็บราคาและสต็อกเป็น String (ข้อความ) เพื่อให้ลบเลข 0 ได้ง่ายๆ
  const [formData, setFormData] = useState({
    name: '', 
    category: '', 
    price: '', // เก็บเป็น string
    stock: ''  // เก็บเป็น string
  });

  // โหลดข้อมูลเก่ามาใส่ฟอร์ม
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(), // แปลงตัวเลขเป็นข้อความให้แก้ไขง่าย
        stock: initialData.stock.toString()
      });
    } else {
      // ค่าเริ่มต้นให้เป็นค่าว่าง '' (ไม่ใช่ 0) จะได้ไม่มีเลข 0 กวนใจ
      setFormData({ name: '', category: '', price: '', stock: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    // 🛡️ ก่อนส่งกลับ แปลงข้อความเป็นตัวเลข (ถ้าว่างให้เป็น 0)
    onSubmit({
      ...formData,
      price: formData.price === '' ? 0 : Number(formData.price),
      stock: formData.stock === '' ? 0 : Number(formData.stock)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] w-full max-w-md rounded-xl shadow-2xl border border-slate-700 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {initialData ? '✏️ แก้ไขสินค้า' : '📦 เพิ่มสินค้าใหม่'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">ชื่อสินค้า</label>
            <input 
              type="text" 
              className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="เช่น นมจืด, ปากกา"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm text-slate-400 mb-1">หมวดหมู่</label>
            <select 
              className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              <option value="เครื่องดื่ม">เครื่องดื่ม</option>
              <option value="ขนมขบเคี้ยว">ขนมขบเคี้ยว</option>
              <option value="ของใช้">ของใช้</option>
              <option value="อุปกรณ์การเรียน">อุปกรณ์การเรียน</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">ราคา (บาท)</label>
              <input 
                type="number" 
                className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white"
                value={formData.price}
                // 🔥 เอา Number() ออก เพื่อให้พิมพ์ทศนิยม หรือลบจนว่างได้
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">จำนวนสต็อก</label>
              <input 
                type="number" 
                className="w-full bg-[#0f172a] border border-slate-600 rounded p-2 text-white"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white">ยกเลิก</button>
          <button 
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={18} /> บันทึกข้อมูล
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;