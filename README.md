# Mini Case Tracker

A MERN stack application for tracking cases with role-based access control.

## Features

- **Authentication**: JWT-based login system
- **Role-Based Access Control**: Manager and Agent roles
- **Case Management**: Create, assign, and track cases through status transitions
- **Status Flow**: New → Assigned → In Progress → Submitted → Cleared/Discrepant
- **Audit Log**: Tracks all status changes
- **Document Upload**: Support for uploading and downloading files
- **Comments**: Add comments to cases
- **Search & Filtering**: Search cases and filter by status or assigned agent
- **Pagination**: Paginated case list

## Tech Stack

- **Frontend**: React, Vite, Material UI (MUI), React Router, Axios
- **Backend**: Node.js, Express, Mongoose, JWT, Express Validator, Multer
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd mini-case-tracker
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
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

5. **Start Backend**
   ```bash
   npm run dev
   ```

6. **Set up Frontend**
   Open a new terminal:
   ```bash
   cd frontend
   npm install
   ```

7. **Start Frontend**
   ```bash
   npm run dev
   ```

## Test Credentials

- **Manager**:
  - Email: `manager@example.com`
  - Password: `password123`

- **Agent**:
  - Email: `agent@example.com`
  - Password: `password123`

## Usage

### Manager
- Create new cases
- Assign cases to agents
- Review submitted cases and mark as Cleared or Discrepant
- View all cases and audit logs

### Agent
- View only cases assigned to them
- Upload supporting documents
- Add notes and comments
- Update case status (In Progress → Submitted)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Cases
- `GET /api/cases` - Get all cases (protected)
- `POST /api/cases` - Create new case (Manager only)
- `GET /api/cases/:id` - Get single case (protected)
- `PUT /api/cases/:id/assign` - Assign case to agent (Manager only)
- `PUT /api/cases/:id/status` - Update case status (protected)
- `PUT /api/cases/:id/note` - Add note (protected)
- `GET /api/cases/agents` - Get list of agents (Manager only)

### Documents
- `POST /api/cases/:id/documents` - Upload document (protected)
- `GET /api/cases/:id/documents` - Get documents (protected)
- `GET /api/cases/documents/:id/download` - Download document (protected)

### Comments
- `POST /api/cases/:id/comments` - Add comment (protected)
- `GET /api/cases/:id/comments` - Get comments (protected)

## Project Structure

```
mini-case-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── context/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Assumptions

- MongoDB is running locally on default port 27017
- Documents are stored locally on the server
- Status transitions are strictly enforced
- Agents can only see cases assigned to them

## Hours Spent

Approximately 4-5 hours
