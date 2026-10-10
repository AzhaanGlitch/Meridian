# Meridian — Modern Goal & Work Maps Planning Studio

Meridian is a modern, calm, and highly polished productivity web application inspired by contemporary note-taking and planning tools (Docket-style). It enables users to monitor, organize, and visualize their goals, flowcharts, mind maps, and long-term roadmaps.

---

## Color Palette & Design System

Meridian strictly implements a clean, calm, and pastel-accented UI palette:

- **Background Main**: `#F1F5F9`
- **Surface / Cards**: `#FFFFFF`
- **Primary Text**: `#0F172A`
- **Secondary Text**: `#64748B`
- **Border**: `#E2E8F0`
- **Primary Accent Buttons**: Solid dark `#0F172A` with white icons

### Pastel Sticky Note Card Accents:
- **Warm Yellow**: `#FBBF24`
- **Coral Orange**: `#FB923C`
- **Soft Purple**: `#C084FC`
- **Lime Green**: `#A3E635`
- **Mint Green**: `#86EFAC`
- **Sky Cyan**: `#22D3EE`

---

## Tech Stack

### Frontend:
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Visual Tools**: React Flow (Interactive mindmaps & flowcharts)
- **Charts**: Recharts (Analytics area chart)
- **Routing**: React Router DOM v7

### Backend:
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)

---

## Project Structure

```
meridian/
├── client/                 # React Vite frontend
│   ├── src/
│   │   ├── components/     # Header, Sidebar, GoalCard, GoalModal
│   │   ├── context/        # AppContext
│   │   ├── pages/          # Landing, Dashboard, Goals, GoalDetail, Maps, Roadmap, Settings
│   │   ├── App.jsx         # Routes definition
│   │   ├── index.css       # Tailwind CSS v4 import & custom styles
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js      # Proxy configured to http://localhost:5000
│
├── server/                 # Node.js Express backend
│   ├── config/             # DB connection (MongoDB)
│   ├── controllers/        # Goal, Map controllers
│   ├── models/             # Mongoose schemas (Goal, Map)
│   ├── routes/             # Express router endpoints
│   ├── .env                # Port & MongoDB URI
│   └── server.js           # Server entry point
└── README.md
```

---

## Quick Setup & Installation

### Running Frontend:
```bash
cd client
npm install
npm run dev
```

### Running Backend (Optional):
```bash
cd server
npm install
npm start
```
