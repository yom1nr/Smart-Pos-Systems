import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // รหัสผ่าน MySQL ของคุณ (XAMPP ปกติจะว่างไว้)
  database: 'retail_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});