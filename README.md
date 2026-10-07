# NovaWorks CRM - AI Meeting to Project CRM

> AI-powered Project Management CRM for NovaWorks Technologies: Convert meeting transcripts directly into projects, tasks, assignees, deadlines, and effort estimations with strict Role-Based Access Control (RBAC).

## Team
- **Team Name**: [Team Name]
- **Members and Responsibilities**:
  - [Member 1]: Frontend Architecture & RBAC Views (Admin, Manager, Developer)
  - [Member 2]: Backend API, Express Server & Authentication
  - [Member 3]: Database Schema, Migrations & SQLite/PostgreSQL Seeder
  - [Member 4]: AI Prompt Engineering, Structured JSON Extraction & Validation
- **Repository**: [GitHub URL]

---

## What Works
- **Authentication & Demo Accounts**: Instant login for all 10 pre-configured accounts (1 Admin, 3 Managers, 6 Developer Agents) with demo password `Demo123!`.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full visibility over all projects, team directory, and exclusive access to the AI Transcript Conversion engine.
  - **Manager**: Filtered view showing only projects they manage and the tasks within those projects.
  - **Agent / Developer**: Filtered "My Tasks" view showing only tasks assigned to them across projects. Direct API requests enforce backend authorization checks.
- **AI Transcript Automation**: Administrator pastes meeting transcripts, and the AI converts them into structured projects and tasks matching the exact team directory without inventing fictional employees.
- **Data Validation & Persistence**: All-or-nothing transactional saving. Projects and tasks remain saved across page refreshes.

---

## Technology Stack
- **Frontend**: **React 18 / Vite** with **Tailwind CSS** & **Lucide React** icons (Ultra-fast, modular role-based architecture).
- **Backend**: **Node.js (v24.x) / Express.js** (Lightweight, robust REST API with native JSON handling).
- **Database**: **SQLite (via Prisma or better-sqlite3)** for instant zero-config local testing, easily switchable to **PostgreSQL (Aiven free tier)** for cloud deployment.
- **AI**: **Google Gemini API (`gemini-1.5-flash` or `gemini-2.0-flash`)** / Structured JSON Output mode (Fast, highly accurate extraction with strict schema enforcement).
- **Authentication/Session Approach**: **JWT (JSON Web Tokens)** + role verification middleware (`authenticateToken`, `authorizeRoles`).

---

## Links
- **Live Application**: [Live URL or Not deployed]
- **Demo Video**: [Accessible recording URL]

---

## Requirements
- **Node.js**: v18.x or v20+ (Verified on Node v24.12.0)
- **NPM**: v10+ (Verified on npm 11.6.2)
- **Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)

---

## Run Locally

### 1. Clone Repository
```sh
git clone [YOUR_REPOSITORY_URL]
cd Inifinity
```

### 2. Backend Setup
```sh
cd backend
npm install
cp .env.example .env
```
*Configure your `GEMINI_API_KEY` and `JWT_SECRET` in `backend/.env`.*

Run database setup & seed:
```sh
npm run db:seed
```

Start backend server (Port 5000):
```sh
npm run dev
```

### 3. Frontend Setup (in a separate terminal)
```sh
cd ../frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## Environment Variables

| Variable | Purpose | Where configured |
| --- | --- | --- |
| `PORT` | Backend server port (default: 5000) | `backend/.env` |
| `DATABASE_URL` | Local SQLite / Hosted PostgreSQL database connection | `backend/.env` |
| `JWT_SECRET` | Signing secret for role-based authentication tokens | `backend/.env` |
| `GEMINI_API_KEY` | Google Gemini API key for meeting transcript extraction | `backend/.env` (backend only) |
| `GEMINI_MODEL` | Target Gemini model (e.g. `gemini-1.5-flash`) | `backend/.env` |
| `VITE_API_BASE_URL` | Frontend API connection target | `frontend/.env` |

---

## Demo Login Accounts

All accounts use the password: **`Demo123!`**

| Reference | Role | Name | Demo Email | Specialization | Skills |
| --- | --- | --- | --- | --- | --- |
| **ADMIN** | Admin | Admin | `admin@novaworks.example` | Administrator | Company overview, transcript creation |
| **PM01** | Manager | Ayesha Khan | `ayesha@novaworks.example` | Web PM | Web projects, client coordination |
| **PM02** | Manager | Bilal Ahmed | `bilal@novaworks.example` | Mobile PM | Mobile projects, delivery planning |
| **PM03** | Manager | Hina Malik | `hina@novaworks.example` | AI PM | AI projects, requirement review |
| **DEV01** | Agent | Ali Raza | `ali@novaworks.example` | Full-Stack | React, frontend integration |
| **DEV02** | Agent | Hamza Shah | `hamza@novaworks.example` | Full-Stack | Node.js, databases, APIs |
| **DEV03** | Agent | Sara Noor | `sara@novaworks.example` | App Developer | Flutter, mobile UI |
| **DEV04** | Agent | Usman Tariq | `usman@novaworks.example` | App Developer | Flutter, integration, testing |
| **DEV05** | Agent | Zain Abbas | `zain@novaworks.example` | AI Developer | LLMs, extraction, prompts |
| **DEV06** | Agent | Maryam Asif | `maryam@novaworks.example` | AI Developer | Retrieval, document processing |

---

## How Judges Can Test

1. **Admin Login**: Sign in as `admin@novaworks.example` with password `Demo123!`.
2. **Transcript Conversion**:
   - Navigate to **Create from Transcript**.
   - Paste the meeting transcript from the challenge pack.
   - Click **Create from Transcript**.
   - Verify that **3 projects** and **12 tasks** are generated and saved.
3. **Verify Project 1 (UrbanCart Website)**:
   - Client: `UrbanCart Clothing` | Manager: `Ayesha Khan` | Deadline: `2026-10-20`
   - 4 tasks:
     - *Product catalog UI* (Ali, 12h, 2026-10-12)
     - *Demo cart UI* (Ali, 8h, 2026-10-15)
     - *Product and cart APIs* (Hamza, 14h, 2026-10-14)
     - *Website integration and testing* (Ali, 6h, 2026-10-19)
4. **Test Role Filtering - Manager**:
   - Log out, then log in as `ayesha@novaworks.example`.
   - Verify **only** UrbanCart Website is visible.
5. **Test Role Filtering - Developer**:
   - Log out, then log in as `ali@novaworks.example`.
   - Verify only his 3 assigned tasks appear in **My Tasks**.
   - Log out, then log in as `hamza@novaworks.example`.
   - Verify his 2 backend tasks appear spanning UrbanCart and QuickServe.
6. **Backend RBAC Verification**: Direct API calls to unpermitted endpoints return `403 Forbidden`.
7. **Persistence**: Refresh browser; all saved data remains intact.

---

## Deployment Details
- **Deployment Status**: [Live / Local only]
- **Frontend Host**: [e.g. Vercel / Render]
- **Backend Host**: [e.g. Render / Railway]
- **Database**: [Aiven PostgreSQL / Local SQLite]

---

## Known Limitations
- The current challenge focuses on meeting-to-project extraction and RBAC; progress tracking and cost/budget calculators are excluded by challenge design.
