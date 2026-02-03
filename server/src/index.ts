import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import saleRoutes from './routes/saleRoutes';
import memberRoutes from './routes/memberRoutes'; // ✅ Import route สมาชิก
import { pool } from './config/db';
import { ResultSetHeader } from 'mysql2';
import authRoutes from './routes/authRoutes'; 

const app = express();
app.use(cors());
app.use(express.json());

// เช็คว่า Server รันโค้ดใหม่จริงไหม
console.log("---------------------------------------------------");
console.log("🚀 SERVER RESTARTED: Member System Ready!");
console.log("---------------------------------------------------");

// API Checkout
app.post('/api/sales', async (req, res) => {
  // ✅ รับ member_id เพิ่มเข้ามา
  const { items, total_amount, payment_method, member_id } = req.body;
  
  console.log('📦 RECEIVED CHECKOUT:', { 
    items: items?.length, 
    amount: total_amount, 
    method: payment_method,
    member: member_id ? `Member ID: ${member_id}` : 'Guest'
  });

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. สร้างบิล (บันทึก member_id ด้วยถ้ามี)
    const [saleResult] = await connection.query(
      'INSERT INTO sales (customer_name, total_amount, payment_method, item_count, member_id) VALUES (?, ?, ?, ?, ?)',
      [
        member_id ? 'สมาชิก' : 'ลูกค้าทั่วไป', // ถ้ามีสมาชิก ให้ชื่อบิลว่า "สมาชิก"
        total_amount, 
        payment_method, 
        items.length,
        member_id || null // ถ้าไม่มีสมาชิกให้ใส่ NULL
      ]
    );
    const saleId = (saleResult as unknown as ResultSetHeader).insertId;

    // 2. วนลูปสินค้า
    for (const item of items) {
      await connection.query(
        'INSERT INTO sale_items (sale_id, product_id, qty, price) VALUES (?, ?, ?, ?)',
        [saleId, item.id, item.qty, item.price]
      );

      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.qty, item.id]
      );
    }

    // 3. 🔥 คำนวณแต้ม (ถ้าเป็นสมาชิก)
    if (member_id) {
      const pointsEarned = Math.floor(total_amount / 10); // 10 บาท ได้ 1 แต้ม
      if (pointsEarned > 0) {
        await connection.query(
          'UPDATE members SET points = points + ? WHERE id = ?',
          [pointsEarned, member_id]
        );
        console.log(`🎁 POINTS ADDED: +${pointsEarned} points to Member ${member_id}`);
      }
    }

    await connection.commit();
    console.log(`✅ SALE SUCCESS: ID ${saleId}`);
    res.json({ success: true, message: 'Sale completed!', saleId });

  } catch (error: any) {
    await connection.rollback();
    console.error('❌ DATABASE ERROR:', error.sqlMessage || error.message);
    res.status(500).json({ success: false, error: error.sqlMessage || 'Database Error' });
  } finally {
    connection.release();
  }
});

app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes); 
app.use('/api/members', memberRoutes); // ✅ ใช้งาน route สมาชิก
app.use('/api/auth', authRoutes); // ✅ ใช้งาน route สมาชิก
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});