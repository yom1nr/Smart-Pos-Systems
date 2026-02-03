import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, ShoppingCart, Plus, Minus, CreditCard, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import ReceiptModal from '../components/ReceiptModal'; 
import MemberSearch from '../components/MemberSearch';     

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  qty: number;
}

const POS = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleData, setLastSaleData] = useState<any>(null);
  
  // ✅ State สำหรับเก็บสมาชิกที่เลือก
  const [currentMember, setCurrentMember] = useState<any>(null);  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('โหลดข้อมูลสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.qty >= product.stock) {
           toast.error('สินค้าในสต็อกมีไม่พอครับ');
           return currentCart;
        }
        return currentCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return null; 
          const product = products.find(p => p.id === id);
          if (product && newQty > product.stock) {
             toast.error('สินค้ามีไม่พอครับ');
             return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleCheckout = async (method: 'cash' | 'transfer') => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    const loadingToast = toast.loading('กำลังบันทึกรายการ...'); 

    try {
      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      const response = await api.post('/sales', {
        items: cart,
        total_amount: totalAmount,
        payment_method: method,
        member_id: currentMember?.id || null // ✅ ส่ง id สมาชิกไปด้วย (ถ้ามี)
      });

      toast.dismiss(loadingToast);
      toast.success(currentMember ? 'บันทึกยอด + สะสมแต้มแล้ว!' : 'บันทึกรายการสำเร็จ!');
      
      // เตรียมข้อมูลใบเสร็จ
      setLastSaleData({
        saleId: response.data.saleId, 
        date: new Date().toISOString(),
        items: [...cart], 
        total: totalAmount,
        paymentMethod: method,
        member: currentMember
        
      });
      setShowReceipt(true); 
      
      setCart([]); 
      fetchProducts(); 
      // ❌ ไม่ต้องเคลียร์สมาชิก (เผื่อเขาซื้อต่อ) หรือจะเคลียร์ก็ได้แล้วแต่ชอบ
      // setCurrentMember(null); 

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.dismiss(loadingToast);
      const serverMessage = error.response?.data?.error || error.message;
      toast.error(`บันทึกไม่ได้: ${serverMessage}`);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-[#0f172a] text-white gap-4 p-4 overflow-hidden">
      {/* ฝั่งซ้าย: รายการสินค้า */}
      <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-lg flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาชื่อสินค้า หรือรหัส..."
              className="w-full bg-[#0f172a] border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pb-20 md:pb-0">
            {loading ? <p className="text-center col-span-full py-10">กำลังโหลดข้อมูล...</p> : filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between h-[140px] shadow-sm relative overflow-hidden group
                  ${product.stock === 0 ? 'bg-slate-800/50 border-slate-700 opacity-50 cursor-not-allowed' : 'bg-[#1e293b] border-slate-700 hover:border-indigo-500 hover:shadow-indigo-500/20 active:scale-95'}`}
              >
                <div>
                  <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{product.category}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-lg font-bold text-emerald-400">฿{product.price}</span>
                  <span className={`text-xs px-2 py-1 rounded ${product.stock < 5 ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>เหลือ {product.stock}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ฝั่งขวา: ตะกร้าสินค้า */}
      <div className="w-full md:w-[350px] bg-[#1e293b] rounded-xl border border-slate-700 flex flex-col shadow-2xl overflow-hidden flex-shrink-0 h-[40vh] md:h-full">
        <div className="p-4 bg-[#1e293b] border-b border-slate-700 flex justify-between items-center shadow-md z-10">
          <h2 className="text-lg font-bold flex items-center gap-2"><ShoppingCart className="text-indigo-400" /> ตะกร้าสินค้า</h2>
          <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">{cart.reduce((s, i) => s + i.qty, 0)} ชิ้น</span>
        </div>

        {/* ✅ ใส่ช่องค้นหาสมาชิก ตรงนี้! */}
        <div className="px-4 pt-4">
           <MemberSearch onSelectMember={setCurrentMember} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50"><ShoppingCart size={48} /><p>ยังไม่มีสินค้าในตะกร้า</p></div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-[#0f172a] p-3 rounded-lg border border-slate-700 flex justify-between items-center group animate-in slide-in-from-right duration-300">
                <div className="flex-1 min-w-0 pr-2"><p className="font-medium text-sm truncate">{item.name}</p><p className="text-xs text-indigo-400">฿{item.price} x {item.qty} = ฿{(item.price * item.qty).toLocaleString()}</p></div>
                <div className="flex items-center gap-2 bg-[#1e293b] rounded-lg p-1 border border-slate-600">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-red-400 transition"><Minus size={14} /></button>
                  <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-green-400 transition"><Plus size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-[#0f172a] border-t border-slate-700 space-y-3">
          <div className="flex justify-between items-center text-slate-400 text-sm"><span>รวมเป็นเงินทั้งสิ้น</span><span className="text-white font-bold text-2xl">฿{totalAmount.toLocaleString()}</span></div>
          <div className="grid grid-cols-2 gap-2">
             <button onClick={() => handleCheckout('cash')} disabled={cart.length === 0 || isCheckingOut} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95">{isCheckingOut ? '...' : <><Banknote size={18} /> เงินสด</>}</button>
             <button onClick={() => handleCheckout('transfer')} disabled={cart.length === 0 || isCheckingOut} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95">{isCheckingOut ? '...' : <><CreditCard size={18} /> โอน/QR</>}</button>
          </div>
        </div>
      </div>
      
      <ReceiptModal 
        isOpen={showReceipt} 
        onClose={() => setShowReceipt(false)} 
        data={lastSaleData} 
      />  
    </div>
  );
};

export default POS;