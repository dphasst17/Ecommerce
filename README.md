# 💻 Laptop & Accessories Store

An eCommerce web application for selling laptops and accessories. Built using modern technologies like React, Express, MySQL, Docker, and TypeScript.

## 🚀 Technologies Used

![React](https://img.shields.io/badge/React-20232a?style=flat-square&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-black?style=flat-square)
![Context API](https://img.shields.io/badge/Context%20API-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## 🛍 Features

### 👥 User
- Browse and search laptops/accessories
- Filter by brand, category, price
- View detailed product info
- Add to cart, update quantity
- Checkout and order history
- Register / login functionality

### 🛠 Admin
- Add / edit / delete products
- Upload product images
- Manage stock and pricing
- View orders and customer info

## 📁 Project Structure

.
├── client-admin/ # React frontend admin
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # App routes
│ │ ├── store/ # Zustand store
│ │ ├── context/ # Auth context
│ │ └── App.tsx
│ └── package.json
│ 
├── client-user/ # React frontend user
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── pages/ # App routes
│ │ ├── store/ # Zustand store
│ │ ├── context/ # Auth context
│ │ └── App.tsx
│ └── package.json
│
├── server/ # Express backend
│ ├── controllers/ # API logic
│ ├── routes/ # API routes
│ ├── models/ # DB models
│ ├── middlewares/ # Auth, errors
│ ├── config/ # DB and env configs
│ ├── server.js # Entry point
│ └── package.json
│ └── docker-compose.yml
│ 
└── README.md # Project description

## 🛍 Main Features

### 👨‍💻 For Customers

- 🔎 **Browse Products**  
  View a wide range of laptops and accessories with clear categorization.

- 🔍 **Filter & Search**  
  Filter by brand, price, type, or search by keyword.

- 📄 **Product Details**  
  See detailed specifications, multiple product images, and available options.

- 🛒 **Shopping Cart**  
  Add items to cart, update quantity, or remove products.

- ✅ **Checkout**  
  Complete order with form validation and confirmation.

- 👤 **User Authentication**  
  Register and login to manage your orders.

- 📦 **Order History**  
  View previous orders and their statuses.

---

### 🛠 For Admins

- ➕ **Manage Products**  
  Add new laptops or accessories, update existing ones, delete outdated items.

- 🖼️ **Image Upload**  
  Upload multiple product images using a secure upload system.

- 📦 **Stock & Pricing**  
  Manage product inventory and pricing dynamically.

- 📊 **Order Management**  
  View incoming orders with customer details and order status.

- 🧾 **Sales Dashboard (optional)**  
  Overview of sales performance and top-selling products.

---

## 🧠 Tech Highlights

- **Frontend**: React, Zustand, Context API, TypeScript  
- **Backend**: Express.js, MySQL, JWT Auth, File Upload  
- **State**: User handled by Zustand, Auth and Cart via Context  
- **Database**: Relational data using MySQL  
- **Image Handling**: Upload via Multer or similar, stored locally or cloud  
- **Admin Features**: Built-in admin panel for product and order control



