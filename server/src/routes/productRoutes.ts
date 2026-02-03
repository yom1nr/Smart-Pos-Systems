import express from 'express';
import { pool } from '../config/db';

const router = express.Router();

// 1. ดึงสินค้าทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// 2. เพิ่มสินค้าใหม่ (POST)
router.post('/', async (req, res) => {
  const { name, category, price, stock } = req.body;
  try {
    const [result]: any = await pool.query(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)',
      [name, category, price, stock]
    );
    res.json({ id: result.insertId, name, category, price, stock });
  } catch (error) {
    res.status(500).json({ error: 'เพิ่มสินค้าไม่สำเร็จ' });
  }
});

// 3. แก้ไขสินค้า (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  try {
    await pool.query(
      'UPDATE products SET name = ?, category = ?, price = ?, stock = ? WHERE id = ?',
      [name, category, price, stock, id]
    );
    res.json({ message: 'แก้ไขสำเร็จ' });
  } catch (error) {
    res.status(500).json({ error: 'แก้ไขสินค้าไม่สำเร็จ' });
  }
});

// 4. ลบสินค้า (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'ลบสำเร็จ' });
  } catch (error) {
    res.status(500).json({ error: 'ลบสินค้าไม่สำเร็จ (อาจมีการขายไปแล้ว)' });
  }
});

export default router;