import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Login from './pages/Login'; // ✅ ต้อง Import มา

// 👮‍♂️ ยามเฝ้าประตู: เช็คว่ามีบัตรผ่าน (user) หรือยัง?
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = localStorage.getItem('user'); // เช็คในกระเป๋าว่ามีบัตรไหม
  if (!user) {
    return <Navigate to="/login" replace />; // ❌ ไม่มีบัตร -> ดีดไปหน้า Login เดี๋ยวนี้!
  }
  return children; // ✅ มีบัตร -> เชิญเข้าครับ
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        
        {/* 1. หน้า Login (ใครก็เข้าได้) */}
        <Route path="/login" element={<Login />} />

        {/* 2. โซนหวงห้าม (ต้องผ่านยาม ProtectedRoute ก่อน) */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="products" element={<Products />} />
        </Route>

        {/* พิมพ์มั่ว -> ดีดกลับไปหน้าแรก (แล้วเดี๋ยวยามจะเช็คต่อเอง) */}
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;