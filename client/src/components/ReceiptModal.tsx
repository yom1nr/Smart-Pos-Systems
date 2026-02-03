import { X, Printer, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const ReceiptModal = ({ isOpen, onClose, data }: ReceiptModalProps) => {
  if (!isOpen || !data) return null;

  const pointsEarned = data.member ? Math.floor(data.total / 10) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    // 1. ปรับ Wrapper ให้รองรับการ Scroll (แก้ปัญหากดปิดไม่ได้)
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm print:bg-white print:overflow-visible">
      
      {/* จัดกึ่งกลาง และเว้นระยะขอบ */}
      <div className="flex min-h-full items-center justify-center p-4 text-center print:p-0 print:block">
        
        {/* 2. ตัวใบเสร็จ (ใส่ ID ให้แม่นยำ) */}
        <div 
          id="printable-area" 
          className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full max-w-sm print:shadow-none print:w-full print:max-w-none print:transform-none"
        >
          
          {/* ส่วนหัว (ซ่อนตอนปริ้นท์) */}
          <div className="bg-emerald-600 p-4 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle /> บันทึกสำเร็จ
            </div>
            {/* ปุ่มปิด (X) จะอยู่ในหน้าจอเสมอ ไม่หลุดขอบ */}
            <button onClick={onClose} className="text-emerald-100 hover:text-white p-1 hover:bg-emerald-700 rounded transition">
              <X size={24} />
            </button>
          </div>

          {/* เนื้อหาใบเสร็จ */}
          <div className="p-8 text-slate-800 print:p-0">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-slate-100 rounded-full mb-3 print:hidden">
                <Printer className="text-slate-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-widest">Receipt</h2>
              <p className="text-sm text-slate-500 mt-1">Smart POS System</p>
              <p className="text-xs text-slate-400 mt-2">{new Date(data.date).toLocaleString('th-TH')}</p>
            </div>

            <div className="border-t-2 border-slate-100 border-dashed my-4"></div>

            {/* ข้อมูลลูกค้า */}
            {data.member ? (
              <div className="mb-4 bg-emerald-50 p-3 rounded-lg border border-emerald-100 print:border-slate-300 print:bg-transparent">
                <p className="text-xs text-emerald-600 font-bold uppercase print:text-black">สมาชิก (Member)</p>
                <p className="text-lg font-bold text-slate-800">{data.member.name}</p>
                <p className="text-sm text-slate-500">เบอร์: {data.member.phone}</p>
              </div>
            ) : (
               <div className="mb-4 text-center text-sm text-slate-400">
                  ลูกค้าทั่วไป (Guest)
               </div>
            )}

            {/* รายการสินค้า */}
            <div className="space-y-2 mb-6 text-sm">
              {data.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.qty} x {item.name}</span>
                  <span className="font-medium">฿{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-slate-100 border-dashed my-4"></div>

            {/* สรุปยอด */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500">ชำระด้วย</span>
              <span className="font-medium capitalize">{data.paymentMethod === 'cash' ? 'เงินสด' : 'โอน/QR'}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-slate-900 mb-6">
              <span>ยอดรวมสุทธิ</span>
              <span>฿{data.total.toLocaleString()}</span>
            </div>

            {/* แต้มที่ได้ */}
            {data.member && (
              <div className="bg-slate-800 text-white text-center py-3 rounded-lg print:border print:border-black print:text-black print:bg-transparent">
                <p className="text-xs opacity-70 mb-1 print:opacity-100">แต้มที่ได้รับจากบิลนี้</p>
                <div className="text-2xl font-bold flex items-center justify-center gap-2">
                   🪙 +{pointsEarned} แต้ม
                </div>
              </div>
            )}
          </div>

          {/* ปุ่มปริ้นท์ (ซ่อนตอนปริ้นท์) */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 print:hidden">
            <button 
              onClick={handlePrint}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer size={18} /> พิมพ์ใบเสร็จ
            </button>
          </div>
        </div>
      </div>
      
      {/* 3. CSS พลังสูง: บังคับ Layout ตอนพิมพ์ */}
      <style>{`
        @media print {
          /* ซ่อนทุกอย่างบนหน้าเว็บ */
          body * {
            visibility: hidden;
          }
          
          /* แสดงเฉพาะใบเสร็จ */
          #printable-area, #printable-area * {
            visibility: visible;
          }

          /* ย้ายใบเสร็จไปแปะมุมซ้ายบนสุดของกระดาษ */
          #printable-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px; /* เว้นขอบนิดหน่อยให้สวย */
            background: white;
            box-shadow: none !important;
          }

          /* ป้องกันการ Scroll หรือพื้นหลังดำติดมา */
          html, body {
            height: auto;
            overflow: visible;
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiptModal;