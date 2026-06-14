# Mini Case Tracker 📋

A complete MERN stack application for tracking cases with role-based access control and beautiful UI!

## ✨ Features

- **Secure Authentication**: JWT-based login system with stateless authentication
- **Role-Based Access Control**: Two distinct user roles: Manager and Agent
- **Case Management**: Create, assign, and track cases through enforced status transitions
- **Complete Status Flow**: New → Assigned → In Progress → Submitted → Cleared/Discrepant
- **Audit Log**: Comprehensive tracking of every single status change with timestamps and user info
- **Document Upload & Management**: Support for uploading, storing, and downloading files/photos
- **Comments System**: Add and view comments on individual cases
- **Advanced Filtering & Search**: Search cases by client name/subject, filter by status or assigned agent
- **Pagination**: Paginated case list view
- **Beautiful Modern UI**: Dark theme with glass-morphism effects and gradient accents

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Material UI (MUI) 5, React Router 6, Axios
- **Backend**: Node.js, Express.js, Mongoose, JWT, Express Validator, Multer, Morgan
- **Database**: MongoDB Atlas
- **API Docs**: Swagger/OpenAPI (swagger-jsdoc, swagger-ui-express)
- **Hosting**: Vercel (for both frontend and backend)

## 📋 Complete Workflow Guide

### Status Flow Diagram
```
New → Assigned → In Progress → Submitted → [ Cleared | Discrepant ]
```

### Role Permissions

#### 👔 Manager
- ✅ Create new cases (client name, subject, case type, due date)
- ✅ Assign cases to agents
- ✅ Review submitted cases and mark as Cleared or Discrepant
- ✅ View all cases and audit logs
- ✅ Filter and search across all cases

#### 👤 Agent
- ✅ See only cases assigned to them
- ✅ Upload supporting documents and photos
- ✅ Add notes to cases
- ✅ Add comments to cases
- ✅ Update status: Assigned → In Progress → Submitted
- ✅ Download documents from their cases

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js (v16 or later)
- MongoDB (running locally or MongoDB Atlas)

### Installation & Setup

1. **Navigate to the project directory**
   ```bash
   cd f:\Assesment_Project\Verifacts
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables (Backend)**
   Copy `backend/.env.example` to `backend/.env` and update values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mini-case-tracker
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

4. **Seed Test Users**
   ```bash
   npm run seed
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Backend: http://localhost:5000

6. **Set up Frontend (New Terminal)**
   ```bash
   cd frontend
   npm install
   ```

7. **Configure Frontend (Optional)**
   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

8. **Start Frontend Dev Server**
   ```bash
   npm run dev
   ```
   Frontend: http://localhost:5174

9. **Access API Documentation**
   - Local API Docs: http://localhost:5000/api-docs

## 🔑 Test Credentials

**Manager Account**:
- Email: `manager@example.com`
- Password: `password123`

**Agent Accounts**:
- Email: `agent1@example.com` / `agent2@example.com` / `agent3@example.com`
- Password: `password123`

---

## 📦 Deployment to Vercel (Production)

### Prerequisites
- A Vercel account (https://vercel.com/signup)
- A MongoDB Atlas account with a cluster (https://www.mongodb.com/atlas)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

---

### Step 1: Deploy Backend to Vercel
1. **Go to Vercel Dashboard → New Project**
2. **Import your Git repository**
3. **Configure Project Settings**:
   - **Project Name**: `your-app-name-backend`
   - **Root Directory**: `backend`
4. **Add Environment Variables (in Vercel Settings)**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini-case-tracker?retryWrites=true&w=majority
   JWT_SECRET=your-secure-random-jwt-secret-key
   JWT_EXPIRE=30d
   FRONTEND_URL=https://your-frontend-name.vercel.app
   ```
   - Get your MongoDB Atlas connection string from the Atlas dashboard
   - Replace `your-frontend-name.vercel.app` with your actual deployed frontend URL
5. **Deploy!** (Vercel will auto-detect Node.js and deploy)
6. **Copy your backend URL** (e.g., `https://your-app-name-backend.vercel.app`)
7. **Access API Docs in Production**: https://your-app-name-backend.vercel.app/api-docs

---

### Step 2: Deploy Frontend to Vercel
1. **Create a new Vercel Project** (or use a monorepo setup)
2. **Import the same repository**
3. **Configure Project Settings**:
   - **Project Name**: `your-app-name-frontend`
   - **Root Directory**: `frontend`
4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-app-name-backend.vercel.app/api
   ```
5. **Deploy!** (Vercel auto-detects Vite and deploys)

---

### Step 3: Enable Auto-Deployments (GitHub Integration)
Vercel automatically sets up auto-deployments when you import your GitHub repo! Here's how to confirm/set it up:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Git**
2. **Confirm your repo is connected** (it should be if you imported from GitHub)
3. **Auto-Deployment Settings**:
   - By default, Vercel will auto-deploy:
     - Every time you push to `main` branch
     - Every time you open a pull request
     - Every time you merge a pull request
4. **Production Branch**: Make sure it's set to `main`
5. **Ignored Build Step**: Leave as default (optional)

Now, every time you push code to your GitHub repo, Vercel will automatically build and deploy your changes! 🚀

---

### Step 4: Important Notes on File Uploads
Vercel serverless functions have **ephemeral filesystem** - files uploaded to `/uploads` will NOT persist! For production, consider:
- Using a cloud storage service (AWS S3, Cloudinary, Firebase Storage, etc.)
- Updating `documentController.js` to use cloud storage instead of local filesystem

---

## 📄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user details (protected)

### Cases
- `GET /api/cases` - Get paginated list of cases (protected)
- `POST /api/cases` - Create new case (Manager only)
- `GET /api/cases/:id` - Get single case with documents/comments/audit logs (protected)
- `PUT /api/cases/:id/assign` - Assign case to agent (Manager only)
- `PUT /api/cases/:id/status` - Update case status (protected, role-restricted)
- `PUT /api/cases/:id/note` - Add note to case (protected)
- `GET /api/cases/agents` - Get list of all agents (Manager only)

### Documents
- `POST /api/cases/:id/documents` - Upload document to a case (protected)
- `GET /api/cases/:id/documents` - Get all documents for a case (protected)
- `GET /api/cases/documents/:id/download` - Download a specific document (protected)

### Comments
- `POST /api/cases/:id/comments` - Add comment to a case (protected)
- `GET /api/cases/:id/comments` - Get all comments for a case (protected)

## 📁 Project Structure

```
mini-case-tracker/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth and error handling
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API endpoints
│   ├── uploads/             # Local file storage (dev only)
│   ├── .env                 # Local env vars
│   ├── .env.example         # Env template
│   ├── vercel.json          # Vercel config
│   ├── package.json
│   ├── seed.js              # Test data seeder
│   └── server.js            # Backend entry point
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios client with env var support
│   │   ├── App.jsx          # Main App
│   │   ├── App.css          # Global styles
│   │   ├── context/         # Auth context
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Frontend env template
│   ├── vercel.json          # Vercel config
│   └── package.json
└── README.md
```

## 🔐 Security Features

- JWT authentication with bcrypt password hashing
- Server-side validation on all endpoints
- Strict role-based access control
- Agents cannot see other agents' cases
- Status transitions enforced server-side

## 🎨 Design Library Used

- **Material-UI (MUI)**: Modern, accessible React component library
- **MUI Icons**: Official Material Design icons for React
- **MUI `sx` prop**: Built-in CSS-in-JS for styling

## 📝 Assumptions

- Documents stored locally in dev; use cloud storage for production
- Status transitions strictly enforced
- Role-based access control implemented both client & server-side

## ⏱️ Hours Spent

Approximately 6-7 hours for complete build and design!
