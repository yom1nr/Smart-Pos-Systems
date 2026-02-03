CREATE DATABASE IF NOT EXISTS smart_pos;
USE smart_pos;

-- ตารางสินค้า
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active'
);

-- ตารางพนักงาน
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff'
);

-- ตารางสมาชิก
CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตารางยอดขาย
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'transfer') NOT NULL,
  item_count INT NOT NULL,
  sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  member_id INT NULL,
  points_earned INT DEFAULT 0
);

-- ตารางรายการสินค้าในบิล
CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- User เริ่มต้น: admin / 1234
INSERT INTO users (username, password, name, role) VALUES 
('admin', '1234', 'Admin User', 'admin'),
('staff', '1234', 'Staff User', 'staff');