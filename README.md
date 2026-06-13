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
- **Database**: MongoDB

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- MongoDB (running locally on port 27017, or MongoDB Atlas URI)

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

3. **Configure Environment Variables**
   - Check `.env.example` for reference
   - File is already created at `backend/.env` with defaults

4. **Seed Test Users**
   ```bash
   npm run seed
   ```
   This will create two test accounts in your database!

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Backend will be running at: http://localhost:5000

6. **Set up Frontend (in a NEW terminal)**
   ```bash
   cd frontend
   npm install
   ```

7. **Start Frontend Dev Server**
   ```bash
   npm run dev
   ```
   Frontend will be running at: http://localhost:5173

## 🔑 Test Credentials

You can now test both roles!

**Manager Account:**
- Email: `manager@example.com`
- Password: `password123`

**Agent Account:**
- Email: `agent@example.com`
- Password: `password123`

## 🧪 Testing the Complete Workflow

### Step 1: Manager creates a case
1. Open browser tab 1 and log in as **Manager**
2. Click "New Case"
3. Fill in case details and submit
4. The new case appears with status: **New**

### Step 2: Manager assigns the case
1. On the Case List, click the new case to view details
2. Use the "Assign to Agent" dropdown to select the agent
3. Case status automatically changes to: **Assigned**

### Step 3: Agent starts working on the case
1. Open browser tab 2 and log in as **Agent**
2. You'll see the newly assigned case in your list!
3. Click the case to view details
4. Click "Mark as In Progress" button
5. Status changes to: **In Progress**

### Step 4: Agent works on the case
1. Add a note in the Notes section
2. Upload a supporting document (optional)
3. Add a comment if needed
4. When done, click "Mark as Submitted"

### Step 5: Manager reviews and closes the case
1. Back in the Manager tab, refresh the page
2. Open the case that was just submitted
3. Click "Mark as Cleared" to approve, or "Mark as Discrepant" to send back to Agent
4. Audit log shows full history of all changes!

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
│   ├── uploads/             # Uploaded files storage
│   ├── .env                 # Environment variables
│   ├── .env.example         # Example env file
│   ├── package.json
│   ├── seed.js              # Test data seeder
│   └── server.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios API client
│   │   ├── App.jsx          # Main App component
│   │   ├── App.css          # Global styles
│   │   ├── context/         # React Context (Auth)
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## 🔐 Security Features

- JWT token-based authentication with stateless sessions
- Passwords securely hashed using bcrypt
- Server-side validation on all endpoints
- Protected routes with role-based authorization checks
- Strict status transition enforcement on server-side
- Agents can only access their assigned cases

## 🎨 Design Highlights

- Beautiful gradient background with glass-morphism effect
- Clean, intuitive dark theme
- Responsive design for all screen sizes
- Smooth animations and transitions
- Consistent design language across all pages

## 📝 Assumptions

- MongoDB is running locally on default port 27017
- Documents are stored locally on the server filesystem
- Status transitions are strictly enforced on both client and server
- Agents can only see and access cases assigned to them
- Managers have full access to all cases

## ⏱️ Hours Spent

Approximately 6-7 hours for complete build and design!