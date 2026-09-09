# 🎓 Acadin — Academia Industry Collaboration Portal

A centralized platform connecting **Students**, **Industry**, **Academicians**, and **Institutions** for skill mapping, internships, and placement.

> **Problem Statement ID26044** — Smart India Hackathon

---

## 🚀 Features

### 👨‍🎓 Student Portal
- Skill Assessment with real-time scoring & radar chart
- Personalized internship & job recommendations
- One-click job application with status tracking
- Digital Portfolio builder (projects, certifications, achievements)
- Learning Programs discovery

### 🏭 Industry Portal
- Post internships & full-time job openings
- Manage and filter applicants with skill-match scores
- Shortlist / Select / Reject candidates
- Post FDPs, workshops, and training programs

### 👩‍🏫 Academician Portal
- Browse FDPs, webinars, and workshops
- Apply to research collaborations and guest lectures
- Track application status

### 🏛️ Institution Portal
- Monitor student placement analytics
- View skill demand trends vs. student proficiency
- Department-wise placement breakdown charts

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS      |
| Charts    | Recharts                          |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB with Mongoose             |
| Auth      | JWT (JSON Web Tokens)             |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/acadin.git
cd acadin
```

### 2. Setup the Backend
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/acadin
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Seed the database with mock data:
```bash
node utils/seedData.js
```

Start the backend:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

### 4. Open the App
Go to **http://localhost:5173** in your browser.

---

## 🔑 Test Credentials

| Role     | Email                    | Password      |
|----------|--------------------------|---------------|
| Industry | `company1@example.com`  | `password123` |
| Industry | `company2@example.com`  | `password123` |

*Register a new account for Student, Academician, or Institution roles.*

---

## 📁 Project Structure

```
acadin/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/   # Student, Industry, Academician, Institution pages
│       ├── components/
│       └── api/
└── server/          # Node.js backend
    ├── models/      # Mongoose schemas
    ├── controllers/ # Business logic
    ├── routes/      # API endpoints
    └── utils/       # Seed data
```

---

## 📄 License
MIT
