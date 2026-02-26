# 💸 Current Capital | Finance Manager

> **A High-Performance Personal Finance Command Center**
> *A full-stack MERN application featuring real-time data visualization and JWT-secured architecture.*

[![Live Demo](https://img.shields.io/badge/Demo-Live_App-00C896?style=for-the-badge&logo=vercel)](https://finance-manager-zeta.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/Source-Code-181717?style=for-the-badge&logo=github)](https://github.com/Rayhan-099/finance-manager)
![Tech Stack](https://img.shields.io/badge/Tech_Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

## 📖 About The Project

**Finance Manager** is a scalable, full-stack expense tracking application designed to streamline personal budgeting and financial planning. Built to move users away from manual spreadsheets, this platform focuses on real-time visual analytics, robust data security, and seamless transaction management through a modern, glassmorphism-inspired interface.

## ✨ Key Features & Technical Achievements

* **Core Financial Workflows:** Engineered seamless CRUD operations for tracking daily expenses, categorizing transactions, and setting dynamic monthly budget guardrails.
* **Real-Time Analytics:** Integrated interactive charting libraries (Recharts/Chart.js) to instantly transform raw JSON transaction data into high-contrast, actionable visualizations.
* **Enterprise-Grade Security:** Implemented stateless JWT (JSON Web Token) authentication combined with bcrypt password hashing to ensure complete user data privacy and secure session management.
* **Optimized Data Aggregation:** Leveraged MongoDB aggregation pipelines to calculate category totals and financial metrics directly on the server, significantly reducing client-side rendering load.
* **Responsive Architecture:** Designed a "Mobile-First" UI using Tailwind CSS, maintaining a fluid user experience and consistent layout integrity across all device sizes.

## 🛠️ Built With

* **Frontend:** React.js, Vite
* **Backend:** Node.js, Express.js
* **Database & ODM:** MongoDB, Mongoose
* **Authentication:** JWT, bcryptjs
* **Styling & Visualization:** Tailwind CSS, Recharts

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* A local or cloud MongoDB connection string (e.g., MongoDB Atlas)

## 🏁 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed locally or a proper Atlas cloud instance cluster setup.

### 1️⃣ Clone and Setup
```bash
git clone https://your-repository-link-here
cd current-capital
```

### 2️⃣ Install Dependencies
```bash
# In the root directory (or install inside backend and frontend individually)
cd backend && npm install
cd ../frontend && npm install
```

### 3️⃣ Configure Environment
Create a `.env` file in the **backend** directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_hyper_secure_jwt_secret_token
```

Create a `.env` file in the **frontend** directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4️⃣ Launch the Application 🚀
Run the backend server:
```bash
cd backend
npm run dev
```

Run the frontend app:
```bash
cd frontend
npm run dev
```

Your app will be automatically served at `http://localhost:5173`.

## 🙏 Acknowledgements
- [Google Gemini](https://deepmind.google/technologies/gemini/) - For powering the AI Financial Advisor.
- [React](https://react.dev/) & [Tailwind CSS](https://tailwindcss.com/) - For the frontend architecture and styling.
- [Recharts](https://recharts.org/) - For beautiful, dynamic data visualizations.
- [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.com/) - For the robust backend infrastructure.
