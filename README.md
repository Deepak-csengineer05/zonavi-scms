# Student Career Management System v2

A modern, full-stack MERN application for managing student career portfolios with a beautiful Deep Ocean Breeze themed UI.

![SCMS](https://img.shields.io/badge/SCMS-v2.0-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248)

## Features

### For Students
- 📊 **Dashboard** with career score, progress charts, and quick actions
- 👤 **Profile Management** with personal & academic info
- 📁 **Projects** tracking with technologies, GitHub/live links
- 💼 **Internships** management with company, role, duration
- 🎯 **Job Applications** tracking with status progression
- 🛠️ **Skills** showcase with categories and proficiency levels
- 🏆 **Certificates** with credential verification links

### For Admins
- 📈 **Analytics Dashboard** with student statistics
- 👥 **Student Management** with search and filtering
- 🏅 **Rankings** leaderboard by CGPA or Career Score

### Additional Features
- 🌙 **Dark Mode** with localStorage persistence
- 🔐 **JWT Authentication** with secure token handling
- 📧 **Email Verification** on signup
- 🔑 **Password Reset** via email
- 📱 **Fully Responsive** mobile-first design
- 🎨 **Deep Ocean Breeze** theme (Navy Blue, Misty Teal, Soft White)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcrypt |
| Email | Nodemailer |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and setup backend:**
```bash
cd scms-v2/backend
npm install
# Edit .env with your MongoDB URI and email settings
npm run dev
```

2. **Setup frontend:**
```bash
cd scms-v2/frontend
npm install
npm run dev
```

3. **Open browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Default Admin Account
Create an admin by setting `role: 'admin'` in MongoDB, or register normally first.

## Project Structure

```
scms-v2/
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helpers (email, score calc)
│   └── server.js          # Entry point
│
└── frontend/
    └── src/
        ├── components/    # Reusable UI components
        ├── context/       # Auth context
        ├── pages/         # Page components
        └── services/      # API client
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/dashboard/stats | Dashboard stats |
| CRUD | /api/projects | Projects |
| CRUD | /api/internships | Internships |
| CRUD | /api/jobs | Job applications |
| CRUD | /api/skills | Skills |
| CRUD | /api/certificates | Certificates |
| GET | /api/admin/students | All students (admin) |
| GET | /api/admin/rankings | Rankings (admin) |

## Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import to Vercel
3. Set `VITE_API_URL` to your backend URL
4. Deploy

### MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Get connection string
3. Update `MONGODB_URI` in backend .env

## Career Score Calculation

```
Score = (Projects × 10) + (Internships × 20) + 
        (Accepted Jobs × 50) + (Offered × 30) + (Interviewing × 15) + 
        (Applied × 5) + (Certificates × 5) + (Skills × 2) + (CGPA × 10)
```

## License

MIT License - Feel free to use for your own projects!

---

Built with ❤️ using the MERN stack
