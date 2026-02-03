import express from 'express';
import { pool } from '../config/db';

const router = express.Router();

// 1. ค้นหาสมาชิกด้วยเบอร์โทร
router.get('/search', async (req, res) => {
  const { phone } = req.query;
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM members WHERE phone = ?', 
      [phone]
    );
    
    if (rows.length > 0) {
      res.json(rows[0]); // เจอสมาชิก ส่งข้อมูลกลับไป
    } else {
      res.status(404).json({ message: 'ไม่พบสมาชิก' });
    }
  } catch (error) {
    res.status(500).json({ error: 'ค้นหาสมาชิกผิดพลาด' });
  }
});

// 2. สมัครสมาชิกใหม่
router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  try {
    const [result]: any = await pool.query(
      'INSERT INTO members (name, phone, points) VALUES (?, ?, 0)',
      [name, phone]
    );
    res.json({ id: result.insertId, name, phone, points: 0 });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'เบอร์โทรนี้เป็นสมาชิกอยู่แล้ว' });
    } else {
      res.status(500).json({ error: 'สมัครสมาชิกไม่สำเร็จ' });
    }
  }
});

export default router;