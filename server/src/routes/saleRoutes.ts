import express from 'express';
import { pool } from '../config/db';

const router = express.Router();

// GET /api/sales : ดึงประวัติการขายทั้งหมด (เรียงจากล่าสุดไปเก่าสุด)
router.get('/', async (req, res) => {
  try {
    // Join ตาราง members เพื่อเอาชื่อลูกค้ามาแสดงหน้ารายการด้วย (ถ้ามี)
    const [rows] = await pool.query(`
      SELECT s.*, m.name as customer_name 
      FROM sales s 
      LEFT JOIN members m ON s.member_id = m.id 
      ORDER BY s.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
  }
});

// GET /api/sales/today : ดึงเฉพาะยอดขายวันนี้
router.get('/today', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM sales WHERE DATE(created_at) = CURDATE() ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
  }
});

// GET /api/sales/bestsellers : ดึง 5 อันดับสินค้าขายดี
router.get('/bestsellers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, SUM(si.qty) as total_sold
      FROM sale_items si
      JOIN products p ON si.product_id = p.id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ดึงข้อมูลไม่สำเร็จ' });
  }
});

// 🔥 [ใหม่] GET /api/sales/:id : ดึงรายละเอียดบิลตาม ID (เจาะจงบิล)
// อันนี้แหละที่ปุ่ม "ดูรายละเอียด" จะเรียกใช้
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // 1. ดึงข้อมูลหัวบิล และ ข้อมูลลูกค้า
    const [saleRows]: any = await pool.query(
      `SELECT s.*, m.name as customer_name, m.phone as customer_phone 
       FROM sales s 
       LEFT JOIN members m ON s.member_id = m.id 
       WHERE s.id = ?`, 
      [id]
    );

    if (saleRows.length === 0) {
       return res.status(404).json({ error: 'Sales not found' });
    }

    const sale = saleRows[0];

    // 2. ดึงรายการสินค้าในบิลนั้น (Join กับ products เพื่อเอาชื่อสินค้า)
    const [itemRows]: any = await pool.query(
      `SELECT si.qty, si.price, p.name 
       FROM sale_items si 
       JOIN products p ON si.product_id = p.id 
       WHERE si.sale_id = ?`, 
      [id]
    );

    // 3. รวมร่างข้อมูลส่งกลับไป
    res.json({
      ...sale,
      items: itemRows // ✅ ส่งรายการสินค้าไปด้วย
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;