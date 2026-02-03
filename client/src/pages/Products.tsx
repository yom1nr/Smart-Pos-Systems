import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductModal from '../components/ProductModal'; // ✅ Import Modal ที่เพิ่งสร้าง

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State สำหรับ Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // 🔥 ฟังก์ชันบันทึกข้อมูล (ใช้ร่วมกันทั้ง เพิ่ม และ แก้ไข)
  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        // กรณีแก้ไข
        await api.put(`/products/${editingProduct.id}`, productData);
        toast.success('แก้ไขสินค้าเรียบร้อย');
      } else {
        // กรณีเพิ่มใหม่
        await api.post('/products', productData);
        toast.success('เพิ่มสินค้าใหม่เรียบร้อย');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts(); // โหลดข้อมูลใหม่
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  // 🔥 ฟังก์ชันลบสินค้า
  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) return;
    
    try {
      await api.delete(`/products/${id}`);
      toast.success('ลบสินค้าเรียบร้อย');
      fetchProducts();
    } catch (error) {
      toast.error('ไม่สามารถลบได้ (สินค้าอาจมีในรายการขาย)');
    }
  };

  // เปิด Modal เพิ่มสินค้า
  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // เปิด Modal แก้ไขสินค้า
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/20">สินค้าหมด</span>;
    if (stock < 10) return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">ใกล้หมด</span>;
    return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">ปกติ</span>;
  };

  return (
    <div className="p-6 space-y-6 bg-[#0f172a] min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-indigo-400" /> รายการสินค้าทั้งหมด
          </h1>
          <p className="text-slate-400 text-sm mt-1">จัดการข้อมูลสินค้า ราคา และจำนวนในสต็อก</p>
        </div>
        
        {/* ปุ่มเพิ่มสินค้า (ใส่ onClick แล้ว) */}
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          เพิ่มสินค้าใหม่
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="ค้นหาชื่อสินค้า หรือหมวดหมู่..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1e293b] border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
        />
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a]/50 text-slate-400 text-sm uppercase tracking-wider border-b border-slate-700">
                <th className="p-4 font-medium">รหัส</th>
                <th className="p-4 font-medium">ชื่อสินค้า</th>
                <th className="p-4 font-medium">หมวดหมู่</th>
                <th className="p-4 font-medium text-right">ราคา</th>
                <th className="p-4 font-medium text-center">คงเหลือ</th>
                <th className="p-4 font-medium text-center">สถานะ</th>
                <th className="p-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 text-slate-400 font-mono text-sm">#{String(product.id).padStart(4, '0')}</td>
                  <td className="p-4 font-medium text-white">{product.name}</td>
                  <td className="p-4">
                    <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded text-xs border border-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-emerald-400">฿{product.price.toLocaleString()}</td>
                  <td className="p-4 text-center text-slate-300">{product.stock}</td>
                  <td className="p-4 text-center">{getStatusBadge(product.stock)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      
                      {/* ปุ่มแก้ไข (ใส่ onClick) */}
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" 
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </button>

                      {/* ปุ่มลบ (ใส่ onClick) */}
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" 
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    ไม่พบสินค้าที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* เรียกใช้ Modal ตรงนี้ */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
};

export default Products;