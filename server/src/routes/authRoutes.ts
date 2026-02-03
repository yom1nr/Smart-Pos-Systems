import express from 'express';
import { pool } from '../config/db';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // เช็ค User ในฐานข้อมูล
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = ?', 
      [username, password]
    );

    if (rows.length > 0) {
      // เจอ User -> ส่งข้อมูลกลับไป (ไม่ส่ง password กลับนะ)
      const user = rows[0];
      res.json({ 
        success: true, 
        user: { id: user.id, name: user.name, role: user.role } 
      });
    } else {
      res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;