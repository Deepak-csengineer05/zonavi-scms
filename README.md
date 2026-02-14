# This is a Student Career Management System named Zonavi.
> The name Zonavi came from "**Zone** of Opportunities & **Navi**gation of **Vi**sion".

![Zonavi SCMS](https://img.shields.io/badge/ZONAVI-v2.0-teal?style=for-the-badge&logo=react)
![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🚀 About The Project
**Zonavi** is an advanced, industrial-grade Career Management System designed to bridge the gap between Students, Colleges, and Employers. It is not just a tracker; it's a comprehensive ecosystem that automates placement cells.

It helps students build their profile, generate professional resumes, applied for jobs, and tracks their career growth with analytics—all in one "Zone".

---

## 🌟 Key Features

### 🎓 For Students (The Zone)
*   **Resume Architect 📄**: Built-in resume builder with **3 Professional Templates** (Classic, Modern Teal, Academic/LaTeX). Generates PDFs instantly based on profile data.
*   **Profile Strength Meter 💪**: Gamified profile completion to encourage better data quality.
*   **Opportunity Hub 💼**: A smart job board that separates "New Opportunities" from "Applied Jobs".
*   **Real-Time Notifications 🔔**: Instant alerts when an employer shortlists, rejects, or offers a job.
*   **Career Analytics 📈**: Visual charts for skill proficiency, application status, and career score growth.

### 🏢 For Employers (The Recruiters)
*   **Company Branding**: Customizable company profile with logo and details.
*   **Job Management**: Post, edit, and close job openings with salary ranges (₹) and requirements.
*   **Kanban Applicant Tracking**: Drag-and-drop board to move students from "Applied" -> "Shortlisted" -> "Interviewing" -> "Offered".

### 🏛️ For Admins (The College)
*   **Bulk Student Import ⚡**: Upload 1000s of students via CSV files in seconds.
*   **Placement Radar**: Advanced analytics on placement rates, branch-wise distribution, and top skills.
*   **Announcements**: Broadcast messages to all students instantly.

---

## 🛠️ Technology Stack
*   **Frontend**: React.js 18, Vite, Tailwind CSS, Recharts, Lucide Icons, React-PDF.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (with Mongoose).
*   **Authentication**: JWT (JSON Web Tokens) with secure cookie/header handling.
*   **State Management**: React Context API.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/zonavi-scms.git
cd zonavi-scms
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create a .env file with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App
*   **Frontend**: `http://localhost:5173`
*   **Backend**: `http://localhost:5000`

---

## 📸 Deployment
This project is deployment-ready for **Vercel** (Frontend) and **Render** (Backend).
See `DEPLOYMENT_GUIDE.md` in the repo for detailed instructions on setting environment variables (`VITE_API_URL`).

---

## 💡 Recent Updates (v2.0)
*   [New] **Notification System**: Event-driven alerts for application status changes.
*   [New] **Resume Architect**: Added "Professional" LaTeX-style template.
*   [New] **Admin Import**: CSV Bulk processing for student data.
*   [Fix] **PWA Support**: Installable on mobile devices.

---
Built with ❤️ by Deepak Saravanakumar.
