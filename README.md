<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NodeJS-Dark.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/MongoDB.svg" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" height="40" alt="tailwindcss logo"  />
  <br/>
  <h1>✨ Current Capital | Finance Manager ✨</h1>
  <p>A completely secure, intelligent, and highly aesthetic subjective finance tracking platform.</p>
</div>

---

## 🚀 Executive Summary

**Current Capital** provides a secure and intuitive platform designed to help users monitor their spending habits, set and manage monthly budgets, and gain deep, clear insights into their financial health through automated, dynamic data visualization. Moving away from manual spreadsheets, Current Capital represents an automated, beautifully crafted financial command center.

## 🎨 Design Philosophy: The "Dark-Centric Professional" Theme
The Interface is driven by a deep space background (#010103) with floating glassmorphism "cards" that are overlaid with an energetic primary electric violet/indigo gradient (#3A41B2). It minimizes borders, emphasizes typography, and features highly intentional micro-interactions to create a sleek, dynamic, and premium atmosphere. 

See the detailed **[Design Document](./design%20doc)** for typography guidelines, full color palettes, and interaction design states.

## 🛠 Features & Functionality

### 🔐 Secure User Onboarding
- **Personalized Access**: Securely create and manage your personal financial account.
- **Session Protection**: JWT-based session management ensuring high security during user operations.

### 💰 Transaction & Expense Logging
- **Instant Logging**: Easily log expenses by amount, date, and description.
- **Categorization**: Auto-categorize entries (Groceries, Utilities, Event, etc.) and visually manage them.
- **Historical Feed**: A seamless "Activity Feed" style view with unique masked icons for filtering, searching, and maintaining previous expense entries.

### 📊 The Dashboard & "Intelligent Command Center"
- **The "Hero Stat"**: A beautifully highlighted snapshot of "Total Monthly Spend" immediately available upon login.
- **The Moneta Chart**: Custom-styled Recharts transforming JSON metrics into vivid, high-contrast doughnut graphs.
- **Real-Time Data**: Adds and changes reflect on your insight cards with smooth, 0.3s visual transitions.

### 📉 Budget Guardrails
- **Goal Setting**: Dictate exact target maximums for monthly spending.
- **Progression Bars**: Visual flags and status rings alerting you if you approach or exceed predetermined limits.

## 💻 Tech Stack Overview

Built with modern scalability and high customizability in mind:

### **Frontend (SPA)**
- **React.js**: Context API managed application architecture.
- **React Router**: Fast, seamless client-side page routing protecting explicit backend states.
- **Tailwind CSS**: Implementing the glassmorphism dark-center styling explicitly.
- **Chart.js / Recharts**: High performance analytical graphs.
- **Axios**: Intelligent HTTP interception enforcing token headers automatically.

### **Backend (REST API)**
- **Node.js + Express.js**: Asynchronous event-driven architecture to rapidly resolve client requests.
- **Security Middlewares**: Helmet.js for API header security and extensive parameter validation.
- **JWT & bcrypt.js**: Password hashing and stateless tokenization for maximal security profiles.

### **Database (NoSQL)**
- **MongoDB + Mongoose ODM**: Dynamic document storing perfect for tracking wide-varrying individual spending and strict validation arrays preventing errors.

*(For detailed architectural paths and API details, please see the **[Tech Stack Document](./tech%20stack)**).*

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

## 📈 Success Metrics
- Fully built out logging structure avoiding manual input latency.
- Strict 0-margin discrepancy from logged items translating natively to dashboard.

---
> *Developed keeping in mind maximum User Experience fluidity.*
