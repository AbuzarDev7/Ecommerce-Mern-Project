# E-Commerce MERN Stack Project

A full-featured E-Commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This project features a modern, "Quiet Luxury" aesthetic and offers complete workflows for both customers and administrators/sellers.

## 🚀 Features

### Customer Features
- **Modern UI/UX**: Clean, minimalist, editorial design ("Quiet Luxury") with smooth animations using Framer Motion.
- **Product Catalog**: Browse products and view details via centralized Quick View modals.
- **Cart & Checkout**: Secure payments powered by **Stripe**.
- **Order Tracking**: Track order status (e.g., Processing, Delivered) visually with modern Lucide icons.

### Administrator / Seller Features
- **Admin Verification System**: Secure registration requiring ID card verification and phone number. Only verified admins can add and manage products.
- **Product Management**: Create, read, update, and delete products (admins can only delete their own products).
- **Inventory Tracking**: `soldStock` tracking and a Total Stock Dashboard to monitor inventory easily.
- **Order Management**: Manage customer orders, update delivery statuses seamlessly utilizing modern UI feedback (SweetAlert2) without page reloads.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **UI Components**: Lucide React (Icons), SweetAlert2 (Alerts), React Hot Toast
- **HTTP Client**: Axios
- **Auth/Other**: Firebase

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **File Uploads**: Multer & Cloudinary
- **Payments**: Stripe
- **Email Services**: Nodemailer

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   - Create a `.env` file in the `Backend` directory and add your environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, Stripe Secret Key, Cloudinary credentials, Nodemailer config).
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```
   - Create a `.env` file in the `Frontend` directory with the necessary API URLs (e.g., `VITE_API_URL`).
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## 📸 Screenshots
*(Consider adding screenshots of your home page, admin dashboard, and quick view modal here)*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is licensed under the ISC License.
