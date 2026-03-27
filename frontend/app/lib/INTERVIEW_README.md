# TaskHub Interview README

This document is the deep-dive version of the project README. Its goal is simple: if someone studies this file, they should understand how TaskHub works end to end and be able to explain it confidently in an interview.

## 1. Project Summary

TaskHub is a collaborative project management platform where users can:

- register and verify their account
- create workspaces
- invite members to those workspaces
- create projects inside workspaces
- create and manage tasks inside projects
- collaborate using comments, watchers, and subtasks
- view dashboard insights and personal task assignments

At a high level, the system models real team collaboration:

- `Workspace` is the top-level team space
- `Project` belongs to a workspace
- `Task` belongs to a project
- `User` participates across workspaces and projects

## 2. Problem It Solves

Many small teams struggle to track work in a structured way. Messages get lost in chats, responsibilities are unclear, and progress is hard to measure.

TaskHub solves that by introducing:

- clear work hierarchy
- defined members and roles
- project-based planning
- task ownership
- progress visibility
- collaboration history

## 3. Architecture Overview

FlowSync is a full-stack monorepo with two main applications:

### Frontend

- Built with React 19 and React Router 7
- Uses TypeScript for safer UI development
- Uses React Query for server-state management
- Uses Axios for API calls
- Uses local storage to store the JWT token and user data

### Backend

- Built with Express
- Uses MongoDB for persistence
- Uses Mongoose schemas and models
- Uses JWT for authentication
- Uses Zod for request validation
- Uses SendGrid for emails
- Uses Arcjet for request protection and email validation

### Request flow

1. The user interacts with the React UI.
2. The frontend sends HTTP requests to the Express API.
3. Express validates input with Zod.
4. Auth middleware verifies the JWT for protected routes.
5. Controllers execute business logic.
6. Mongoose reads or writes MongoDB documents.
7. The API returns JSON responses.
8. React Query updates the frontend state.

## 4. Folder-by-Folder Explanation

### `backend/controllers`

Contains the business logic for each feature area:

- `auth-controller.js`
- `workspace.js`
- `project.js`
- `task.js`
- `user.js`

This is where the application makes decisions such as:

- who is allowed to access a workspace
- whether a task can be updated
- whether an invite is still valid
- whether a user has verified their email

### `backend/routes`

Defines API endpoints and maps them to controllers.

Example:

- `/api-v1/auth/register` -> registration logic
- `/api-v1/tasks/:taskId/status` -> task status update logic

### `backend/models`

Defines the MongoDB data structure using Mongoose schemas.

Main models:

- `User`
- `Workspace`
- `Project`
- `Task`
- `Comment`
- `Activity`
- `Verification`
- `WorkspaceInvite`

### `backend/middleware`

Contains the authentication middleware that:

- reads the `Authorization` header
- verifies the JWT token
- loads the authenticated user
- attaches the user to `req.user`

### `backend/libs`

Reusable helpers:

- validation schemas
- email sending
- Arcjet protection
- activity recording helpers

### `frontend/app/routes`

Defines UI pages such as:

- home
- sign in
- sign up
- forgot password
- reset password
- verify email
- dashboard
- workspaces
- project details
- task details
- my tasks
- settings

### `frontend/app/hooks`

Custom hooks for frontend data access, usually wrapping React Query logic for:

- auth
- workspaces
- projects
- tasks
- users

### `frontend/app/provider`

Global providers such as:

- authentication context
- React Query provider

## 5. Database Design

This section is especially useful for interviews because interviewers often ask how the data is modeled.

### User

Important fields:

- `email`
- `password`
- `name`
- `profilePicture`
- `isEmailVerified`
- `lastLogin`

Purpose:

- stores authentication identity
- stores profile information
- tracks whether the user can access the system fully

### Workspace

Important fields:

- `name`
- `description`
- `color`
- `owner`
- `members`
- `projects`

Purpose:

- represents a team or collaboration space
- groups projects under one shared context
- stores workspace-level roles

### Project

Important fields:

- `title`
- `description`
- `workspace`
- `status`
- `startDate`
- `dueDate`
- `tasks`
- `members`
- `tags`
- `createdBy`
- `isArchived`

Purpose:

- represents a body of work inside a workspace
- groups tasks and assigned members
- tracks project lifecycle

### Task

Important fields:

- `title`
- `description`
- `project`
- `status`
- `priority`
- `assignees`
- `watchers`
- `dueDate`
- `subtasks`
- `comments`
- `attachments`
- `createdBy`
- `isArchived`

Purpose:

- the main unit of execution
- captures work progress and collaboration

### Verification

Purpose:

- stores email verification tokens
- stores password reset tokens
- stores token expiration timestamps

### WorkspaceInvite

Purpose:

- stores workspace invitation tokens
- links a user to a workspace and role
- supports expiring invites

### Comment and Activity

Purpose:

- `Comment` stores task discussion
- `Activity` stores action history for audit-style timelines

## 6. Authentication Flow

This is one of the strongest interview topics in the project.

### Registration

1. User submits `name`, `email`, and `password`
2. Request is validated with Zod
3. Arcjet checks the request and email quality
4. Backend checks whether the user already exists
5. Password is hashed with bcrypt
6. User is saved in MongoDB
7. A verification token is created with JWT
8. Token and expiry are stored in the `Verification` collection
9. Email is sent through SendGrid

### Email verification

1. User opens the verification link
2. Frontend sends the token to `/auth/verify-email`
3. Backend verifies the JWT
4. Backend checks the token in the `Verification` collection
5. If valid, `isEmailVerified` becomes `true`
6. Verification record is deleted

### Login

1. User submits email and password
2. Backend finds the user and loads the password field
3. If email is not verified, login is blocked
4. Password is checked with bcrypt
5. JWT token is created with 7-day expiry
6. Frontend stores token and user in local storage

### Forgot password

1. User requests password reset with email
2. Backend confirms the user exists and is verified
3. Reset token is created with JWT
4. Token is stored in the `Verification` collection
5. Reset email is sent
6. User submits new password with token
7. Backend validates token and updates password

## 7. Authorization Strategy

The app uses both authentication and authorization.

### Authentication

Authentication answers:

- Who is the user?

It is handled by JWT and auth middleware.

### Authorization

Authorization answers:

- Is this user allowed to perform this action?

Examples from the code:

- only workspace members can access workspace data
- only workspace owners or admins can invite members
- only project members can update project tasks
- only authenticated users can access protected APIs

This is a strong design choice because it prevents simple token ownership from becoming full access to every resource.

## 8. Workspace Flow

### Create workspace

When a workspace is created:

- the authenticated user becomes the `owner`
- the same user is added to the `members` array
- the member role is set to `owner`

### Invite member

When inviting someone:

- the inviter must be `owner` or `admin`
- the target email must belong to an existing user
- duplicate membership is prevented
- duplicate active invites are prevented
- a JWT invite token is generated
- the token is saved in `WorkspaceInvite`
- an email link is sent to the invited user

### Accept invite

The app supports token-based acceptance:

- the token is verified
- the workspace is loaded
- membership is checked again
- the member is added with the invited role
- the invite record is deleted
- activity is recorded

## 9. Project Flow

### Create project

The controller:

- verifies the workspace exists
- checks that the current user belongs to the workspace
- converts comma-separated tags into an array
- creates the project
- pushes the project ID into the workspace

### Fetch project details

The controller:

- loads the project
- checks membership
- returns project data

### Fetch project tasks

The controller:

- loads the project with populated members
- checks membership
- loads non-archived tasks
- populates assignee names and profile pictures

## 10. Task Flow

The task system is the heart of the application.

### Create task

The controller:

- verifies the project exists
- loads the related workspace
- checks workspace membership
- creates the task
- pushes the task ID into the project

### Update task fields

Supported updates:

- title
- description
- status
- assignees
- priority

Each update:

- loads the task
- checks project membership
- updates the field
- records activity

### Subtasks

Subtasks are stored as embedded objects inside the task document. This is a good choice because subtasks are tightly coupled to the task and do not need their own top-level collection in the current design.

### Comments

Comments are stored in a separate collection and referenced by the task. This makes sense because comments can grow independently and are useful to query separately.

### Watchers

Users can watch and unwatch tasks. This creates a lightweight collaboration feature and can be extended later into notifications.

### Archived tasks

The `achievedTask` controller toggles `isArchived`, which acts like an archive or completed-history behavior instead of hard deleting tasks.

That is a good interview talking point:

- the project prefers soft state transitions over destructive deletion

## 11. Dashboard and Analytics

The workspace stats endpoint computes:

- total projects
- total tasks
- tasks by status
- projects in progress
- upcoming tasks in the next 7 days
- project status distribution
- task priority distribution
- productivity data by project
- recent projects

This is useful in interviews because it shows that the app is not just CRUD. It includes aggregation, visualization-ready responses, and management insights.

## 12. Frontend Design Approach

The frontend uses a route-based structure with dedicated pages and reusable components.

Important patterns:

- React Query manages API fetching and cache
- Axios interceptor injects the JWT token
- a global `401` handler dispatches a logout event
- auth state is stored in context
- public and protected routes are separated

Main frontend pages:

- landing page
- sign in / sign up
- forgot password / reset password
- verify email
- dashboard
- workspaces list
- workspace details
- project details
- task details
- my tasks
- profile and settings

## 13. Validation and Error Handling

### Validation

The backend validates request bodies with Zod:

- registration
- login
- verification token
- reset password
- workspace creation
- invite member
- project creation
- task creation

Why this matters:

- prevents malformed payloads
- gives predictable API contracts
- reduces controller complexity

### Error handling

Common error cases handled by the app:

- invalid credentials
- missing resources
- unauthorized access
- expired tokens
- duplicate invites
- duplicate users
- unverified email login attempts

## 14. Security Decisions

Important security features:

- passwords are hashed with bcrypt
- JWT is used for stateless authentication
- email verification is required
- request bodies are validated
- resource membership is checked before access
- Arcjet adds rate limiting, bot detection, and email screening

Strong interview line:

"I combined authentication with resource-level authorization so a valid token alone is not enough. The backend still checks workspace or project membership before returning or mutating protected data."

## 15. Good Technical Decisions in This Project

These are strong points to mention in an interview:

- clear separation between routes, controllers, models, and helpers
- token-based email verification and password reset
- soft-archive pattern for tasks
- role-based membership in workspaces and projects
- activity logging for traceability
- analytics endpoint for dashboards
- schema validation with Zod
- React Query for frontend server state

## 16. Limitations and Honest Improvement Areas

You should be ready to speak honestly about what can be improved.

### Current gaps

- no automated test suite
- no pagination on list endpoints
- no refresh-token strategy
- no file upload implementation despite attachment fields in the task model
- some model capabilities are present but not fully exposed in UI flows
- no centralized logger beyond console output

### Good future improvements

- add unit and integration tests
- add refresh tokens and secure cookie auth
- add real-time updates with WebSockets
- add notifications for watchers and mentions
- implement file uploads for task attachments
- add pagination, filtering, and search
- improve analytics query efficiency with MongoDB aggregation pipelines

## 17. Interview Questions You Can Expect

### "Tell me about this project."

Suggested answer:

"TaskHub is a full-stack project management platform I built using React, Express, and MongoDB. It supports workspace-based collaboration, project planning, task assignment, comments, subtasks, email verification, and dashboard analytics. I focused on structuring the backend cleanly with separate controllers, models, routes, and middleware, and I implemented role-based access checks so users can only access workspaces and projects they belong to."

### "Why did you choose MongoDB?"

Suggested answer:

"MongoDB was a good fit because the system has document-oriented entities like workspaces, projects, and tasks, and some nested structures like members and subtasks. Mongoose also helped with schema definition and relationships while keeping development fast."

### "How is authentication handled?"

Suggested answer:

"I used JWT for authentication. After login, the frontend stores the token and sends it in the `Authorization` header. The backend middleware verifies the token, loads the user, and protected controllers then apply resource-level membership checks."

### "How do you handle authorization?"

Suggested answer:

"I check access at the resource level. For example, a user must belong to a workspace to see its projects, and must belong to a project to update its tasks. For workspace invites, only owners and admins can invite members."

### "What was the most interesting part technically?"

Suggested answer:

"The most interesting part was combining collaboration features with secure access control. I also liked building the analytics endpoint because it moved the project beyond simple CRUD into reporting and productivity insights."

### "What would you improve next?"

Suggested answer:

"I would add automated tests, refresh tokens, pagination, real-time collaboration, and file uploads. I would also optimize some stats logic using aggregation pipelines and strengthen production-grade observability."

## 18. Short Interview Pitch

If you only have 30 to 45 seconds, say this:

"TaskHub is a collaborative project management application built with React, Express, and MongoDB. Users can register, verify email, create workspaces, invite members, build projects, assign tasks, comment, track progress, and view dashboard analytics. I implemented JWT authentication, Zod validation, role-based access checks, and a modular backend structure to keep the system maintainable and secure."

## 19. Key Files to Review Before an Interview

If someone wants to prepare fast, these are the most important files to read:

- `backend/index.js`
- `backend/routes/index.js`
- `backend/controllers/auth-controller.js`
- `backend/controllers/workspace.js`
- `backend/controllers/project.js`
- `backend/controllers/task.js`
- `backend/models/user.js`
- `backend/models/workspace.js`
- `backend/models/project.js`
- `backend/models/task.js`
- `frontend/app/routes.ts`
- `frontend/app/provider/auth-context.tsx`
- `frontend/app/lib/fetch-util.ts`

## 20. Final Takeaway

TaskHub is a strong portfolio project because it demonstrates:

- full-stack development
- authentication and authorization
- REST API design
- schema validation
- MongoDB data modeling
- team collaboration workflows
- dashboard analytics
- clean code organization

If someone understands this file well, they should be able to explain both the business value and the technical implementation of the project with confidence.
