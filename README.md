# 🛒 Smart POS System

A comprehensive, full-stack **Point of Sale (POS)** solution designed for modern retail management. This application streamlines daily operations including sales processing, real-time inventory tracking, membership management, and sales analytics. Built with high-performance modern web technologies.

![Dashboard Preview](./screenshots/dashboard.png)

## ✨ Key Features

- **🔐 Secure Authentication:** Role-based access control (RBAC) separating **Admin** (Manager) and **Staff** (Cashier) privileges.
- **💻 Real-time POS Interface:** User-friendly checkout interface with instant product search, barcode support, and automatic total calculation.
- **👥 Customer Loyalty Program:** Integrated membership system with automatic point accumulation (e.g., 10 THB = 1 Point).
- **📊 Analytics Dashboard:** Visual insights into daily sales, total orders, and low-stock alerts.
- **🧾 Digital Receipts:** Generates professional receipts with detailed transaction data, ready for printing.
- **📦 Inventory Management:** Complete CRUD operations for product management, including cost/price tracking and stock adjustments.

---

## 📸 System Screenshots

### 1. Login Interface

Secure, dark-themed login screen ensuring authorized access only.
![Login Screen](./screenshots/login.png)

### 2. Point of Sale (POS)

The core checkout interface designed for speed and efficiency.
![POS Screen](./screenshots/pos.png)

### 3. Digital Receipt

Sample of a generated receipt featuring transaction details and member points.
![Receipt](./screenshots/receipt.png)

### 4. Inventory Management

Centralized hub for tracking stock levels and managing product details.
![Inventory](./screenshots/inventory.png)

---

## 🛠️ Tech Stack

- **Frontend:** React (TypeScript), Vite
- **UI/UX:** Tailwind CSS, Lucide React (Icons)
- **Backend:** Node.js, Express.js
- **Database:** MySQL (Relational Database)

---

## ⚙️ Installation & Setup Guide

Follow these steps to set up the project locally.

### 1. Database Configuration

1.  Ensure **MySQL** is installed and running on your machine.
2.  Create a new database named `smart_pos` (or `retail_db`).
3.  Import the provided SQL schema or run the scripts from `database.sql`.

### 2. Backend Setup (Server)

Navigate to the server directory and install dependencies.

````bash
cd server
npm install
# Note: Create a .env file and configure DB_HOST, DB_USER, DB_PASSWORD
npm run dev

### 3. Frontend Setup (Client)
Navigate to the client directory and install dependencies.

```bash
cd client
npm install
npm run dev
````

The frontend will be available at `http://localhost:5173`.

### 4. Default Test Credentials

Use the following credentials to access the system:

| Role    | Username | Password | Access Level                            |
| ------- | -------- | -------- | --------------------------------------- |
| Manager | admin    | 1234     | Full Access (Dashboard, Inventory, POS) |
| Cashier | staff    | 1234     | Restricted Access (POS Only)            |

> **⚠️ Security Note:** Change default credentials immediately in production environments.

# Smart-Retail

A retail management solution developed by Yom1nr.

## Overview

This project provides tools and systems for managing retail operations efficiently.

## Features

- Inventory management
- Sales tracking
- Customer management
- Reporting and analytics

## Getting Started

See the documentation files in this repository for setup and usage instructions.

## License

Please refer to the LICENSE file for licensing information.

## Author

Developed by Yom1nr

---

## 🚀 Usage

1. **Login:** Access the system with your credentials (Admin or Staff role).
2. **Process Sales:** Use the POS interface to scan products, add items to cart, and complete transactions.
3. **Manage Inventory:** Add, update, or remove products from the inventory dashboard.
4. **View Analytics:** Monitor daily sales performance and stock levels from the analytics dashboard.
5. **Membership:** Customers earn points automatically; redeem points for discounts.

---

## 📁 Project Structure

```
Smart-Retail/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── package.json
├── database.sql            # SQL schema
└── README.md
```

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 👨‍💻 Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request.

---

## 📧 Support

For issues or questions, please open an issue on the repository or contact the development team.
