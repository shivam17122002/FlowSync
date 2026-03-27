# FlowSync

TaskHub is a full-stack project management application built for collaborative work across workspaces, projects, and tasks. It supports authentication, email verification, workspace invitations, project planning, task tracking, comments, watchers, and dashboard analytics.

## Why This Project

This project is designed to solve a common team workflow:

- Create a workspace for a team
- Invite members with role-based access
- Organize work into projects
- Break projects into tasks and subtasks
- Track status, priority, assignees, activity, and progress

It combines a React frontend with an Express and MongoDB backend in a clean client-server architecture.

## Tech Stack

### Frontend

- React 19
- React Router 7
- TypeScript
- Tailwind CSS 4
- TanStack React Query
- Axios
- React Hook Form + Zod
- Radix UI
- Recharts

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Zod request validation
- bcrypt password hashing
- SendGrid email delivery
- Arcjet bot protection, email validation, and rate limiting

## Core Features

- User registration and login
- Email verification before login
- Forgot password and reset password flow
- Protected routes with JWT-based authentication
- User profile update and password change
- Workspace creation and member management
- Invite users into workspaces with token-based acceptance
- Project creation inside a workspace
- Task creation inside a project
- Task updates for title, description, status, assignees, and priority
- Subtasks, comments, watchers, and archived tasks
- Personal "My Tasks" view
- Dashboard analytics for projects and tasks

## Project Structure

```text
project-manager/
|-- backend/
|   |-- controllers/
|   |-- libs/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   |-- index.js
|
|-- frontend/
|   |-- app/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- lib/
|   |   |-- provider/
|   |   |-- routes/
|   |   |-- types/
|   |-- public/
|   |-- package.json
|
|-- README.md
|-- INTERVIEW_README.md
```

## Main User Flow

1. A user signs up with name, email, and password.
2. The backend creates the account and sends an email verification link.
3. After verification, the user logs in and receives a JWT token.
4. The user creates a workspace and becomes its owner.
5. The owner can invite other users into the workspace.
6. Members create projects inside that workspace.
7. Projects contain tasks with assignees, status, priority, comments, watchers, and subtasks.
8. Dashboard pages show workspace stats, upcoming tasks, and productivity charts.

## API Overview

Base URL:

```bash
http://localhost:5000/api-v1
```

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email`
- `POST /auth/reset-password-request`
- `POST /auth/reset-password`

### Users

- `GET /users/profile`
- `PUT /users/profile`
- `PUT /users/change-password`

### Workspaces

- `POST /workspaces`
- `GET /workspaces`
- `GET /workspaces/:workspaceId`
- `GET /workspaces/:workspaceId/projects`
- `GET /workspaces/:workspaceId/stats`
- `POST /workspaces/:workspaceId/invite-member`
- `POST /workspaces/:workspaceId/accept-generate-invite`
- `POST /workspaces/accept-invite-token`

### Projects

- `POST /projects/:workspaceId/create-project`
- `GET /projects/:projectId`
- `GET /projects/:projectId/tasks`

### Tasks

- `POST /tasks/:projectId/create-task`
- `GET /tasks/my-tasks`
- `GET /tasks/:taskId`
- `PUT /tasks/:taskId/title`
- `PUT /tasks/:taskId/description`
- `PUT /tasks/:taskId/status`
- `PUT /tasks/:taskId/priority`
- `PUT /tasks/:taskId/assignees`
- `POST /tasks/:taskId/add-subtask`
- `PUT /tasks/:taskId/update-subtask/:subTaskId`
- `POST /tasks/:taskId/add-comment`
- `GET /tasks/:taskId/comments`
- `POST /tasks/:taskId/watch`
- `POST /tasks/:taskId/achieved`
- `GET /tasks/:resourceId/activity`

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Backend variables used by the code:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
SEND_GRID_API=your_sendgrid_api_key
FROM_EMAIL=your_verified_sender_email
ARCJET_KEY=your_arcjet_key
NODE_ENV=development
```

Frontend variables:

```env
VITE_API_URL=http://localhost:5000/api-v1
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

Backend:

```bash
http://localhost:5000
```

## Security Notes

- Passwords are hashed with `bcrypt`
- Authentication uses JWT
- Protected routes use auth middleware
- Request payloads are validated with Zod
- Arcjet is used for bot protection, email validation, and rate limiting
- Email verification is required before successful login

## Development Notes

- In local development, if SendGrid is not configured, the backend returns verification and reset links directly in the API response.
- Axios interceptors on the frontend attach the JWT token automatically and force logout on `401 Unauthorized`.
- Workspace and project access is checked by membership before sensitive actions are allowed.

## Interview Prep

The project also includes a dedicated interview guide:

- See `INTERVIEW_README.md`

That file explains the architecture, database schema, feature flows, and common interview questions in a much deeper way.

## Current Gaps

- No automated test suite is configured yet
- No root-level Docker Compose setup is included
- Some advanced model fields exist but are not fully exposed in the current UI or API

## License

This project is available for learning, portfolio, and demonstration use.
