# MERN Stack Assignment - Task Management System

A full-stack application built with Next.js that provides admin user login, agent management, and CSV file upload with task distribution functionality.

## Features

### 1. Multi-User Workspace System
- **User Registration**: Anyone can create their own account
- **Isolated Workspaces**: Each user has their own separate data space
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Dashboard access only for authenticated users

### 2. Agent Management (Per User)
- **Add Agents**: Create agents with name, email, mobile number, and password
- **View Agents**: List all agents in your workspace
- **Delete Agents**: Remove agents from your workspace
- **User Isolation**: Agents are specific to each user account

### 3. CSV Upload and Task Distribution (Per User)
- **File Upload**: Support for CSV, XLS, and XLSX files
- **File Validation**: Ensures correct file format and required columns
- **Data Parsing**: Extracts FirstName, Phone, and Notes from uploaded files
- **Equal Distribution**: Distributes tasks equally among your 5 agents
- **Remainder Handling**: Distributes remaining tasks sequentially
- **Task Visualization**: View distributed tasks for each agent

### 4. Task Management (Per User)
- **Edit Tasks**: Modify task details (FirstName, Phone, Notes)
- **Delete Tasks**: Remove individual tasks from distributions
- **Real-time Updates**: Changes reflect immediately in the interface
- **User Isolation**: Tasks are specific to each user's workspace

### 5. Agent Portal System
- **Agent Login**: Agents can log in with email/password provided by admin
- **Task Viewing**: Agents see only their assigned tasks
- **Task History**: Complete history of all tasks assigned to the agent
- **Admin Context**: Agents can see which admin assigned their tasks
- **Pagination**: Navigate through task history efficiently

## Technical Stack

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Processing**: XLSX library for CSV/Excel parsing
- **Password Security**: bcryptjs for password hashing

## Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Setup Instructions

### 1. Navigate to Project Directory
```bash
cd mern-assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/mern-assignment
JWT_SECRET=your_secure_jwt_secret_key_here
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

**Important**: Replace `your_secure_jwt_secret_key_here` with a strong, random secret key.

### 4. Database Setup
Make sure MongoDB is running on your system:

**For Local MongoDB:**
- Install MongoDB Community Edition
- Start the MongoDB service
- The application will automatically create the database and collections

**For MongoDB Atlas:**
- Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com/)
- Get your connection string
- Replace the MONGODB_URI in .env.local with your Atlas connection string

### 5. Run the Application
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage Instructions

### 1. Admin Login/Registration
1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to the login page
3. Enter email and password, then:
   - Click "Sign in" if you have an account
   - Click "Create Account" to register a new admin user

### 2. Agent Management
1. After login, you'll see the dashboard with the "Agents" tab active
2. **Add New Agent**:
   - Fill in the form with agent details
   - Name, Email, Mobile Number (with country code), and Password
   - Click "Add Agent"
3. **View Agents**: All agents are listed with their information
4. **Delete Agent**: Click the "Delete" button next to any agent

### 3. CSV Upload and Task Distribution
1. Click the "Upload CSV" tab in the dashboard
2. **Requirements**:
   - You need at least 5 agents for task distribution
   - CSV/Excel file should contain: FirstName, Phone, and optionally Notes columns
3. **Upload Process**:
   - Select a CSV, XLS, or XLSX file
   - Click "Upload and Distribute"
   - Tasks will be automatically distributed equally among agents
4. **View Distribution**:
   - Click the "Task Distribution" tab
   - See how tasks are distributed among agents
   - View individual task details for each agent

## CSV File Format

Your CSV file should have the following columns (column names are case-insensitive):

| FirstName | Phone        | Notes                    |
|-----------|--------------|--------------------------|
| John      | +1234567890  | Follow up required       |
| Jane      | +1987654321  | VIP customer            |
| Bob       | +1122334455  | New prospect            |

**Required Columns:**
- FirstName (or First Name)
- Phone (or Mobile)

**Optional Columns:**
- Notes (or Note)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin/User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/agent-login` - Agent login

### Agent Management
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get agent by ID
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent

### Task Management
- `GET /api/tasks` - Get tasks (with optional filters, user-filtered)
- `POST /api/tasks/upload` - Upload CSV and distribute tasks (user-specific)
- `GET /api/tasks/[id]` - Get specific task (user-filtered)
- `PUT /api/tasks/[id]` - Update task (user-filtered)
- `DELETE /api/tasks/[id]` - Delete task (user-filtered)

### Agent Portal
- `GET /api/agent/tasks` - Get tasks assigned to authenticated agent (with pagination)

## Testing the Application

### Pre-created Test Users

**Admin Users:**
- **admin@test.com** (password: admin123)
- **user1@test.com** (password: user123)
- **user2@test.com** (password: user123)

**Test Agents (for admin@test.com):**
- **john@agent.com** (password: agent123)
- **jane@agent.com** (password: agent123)
- **bob@agent.com** (password: agent123)
- **alice@agent.com** (password: agent123)
- **charlie@agent.com** (password: agent123)

You can also create additional users using the registration feature.

### Test Data
You can create a sample CSV file with this data:
```csv
FirstName,Phone,Notes
John Doe,+1234567890,Follow up in 1 week
Jane Smith,+1987654321,VIP customer
Bob Johnson,+1122334455,New prospect
Alice Brown,+1555666777,Existing customer
Charlie Wilson,+1999888777,Referral
David Lee,+1444333222,Hot lead
Emma Davis,+1777888999,Demo scheduled
Frank Miller,+1666555444,Price inquiry
Grace Taylor,+1333222111,Contract renewal
Henry Clark,+1888777666,Support request
```

### Testing Steps for Multi-User Functionality
1. **Test User Isolation:**
   - Login as admin@test.com
   - Add 5 agents with different details
   - Upload the test CSV file
   - Note the task distribution

2. **Test Separate Workspaces:**
   - Logout and login as user1@test.com
   - Notice the workspace is empty (no agents from admin user)
   - Add different agents (can use same emails as they're isolated)
   - Upload the same CSV file
   - Verify completely separate task distribution

3. **Test Task Management:**
   - In any user account, go to "Task Distribution" tab
   - Click the edit button (pencil icon) on any task
   - Modify the task details and save
   - Click the delete button (trash icon) to remove tasks
   - Verify changes persist and only affect the current user

4. **Test Account Registration:**
   - Logout from all accounts
   - Use "Create Account" to make a new user
   - Verify the new user starts with a completely empty workspace

5. **Test Agent Login System:**
   - Go to http://localhost:3000/agent-login
   - Login as john@agent.com (password: agent123)
   - View only tasks assigned to John Agent
   - Login as different agents to see their individual task assignments
   - Notice agents can see which admin assigned their tasks

### Key Features to Test
- **Data Isolation**: Each user sees only their own agents and tasks
- **Task Editing**: Click pencil icons to edit tasks
- **Task Deletion**: Click trash icons to delete tasks
- **Separate Workspaces**: Different users have completely separate data
- **Agent Portal**: Agents can login and view only their assigned tasks
- **Task History**: Agents can see complete history with pagination

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth with expiration
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication required for sensitive operations
- **File Validation**: Ensures only allowed file types are uploaded

## Production Deployment

For production deployment:

1. **Environment Variables**: Set production values for all environment variables
2. **Database**: Use MongoDB Atlas or a production MongoDB instance
3. **Security**: Use a strong JWT secret and enable HTTPS
4. **Build**: Run `npm run build` for optimized production build

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env.local
   - Verify network connectivity

2. **JWT Secret Error**:
   - Ensure JWT_SECRET is set in .env.local
   - Use a strong, random secret key

3. **File Upload Issues**:
   - Check file format (CSV, XLS, XLSX only)
   - Ensure required columns are present
   - Verify at least 5 agents exist

## Demo Video

Create a demo video showing:
1. Admin login/registration
2. Adding multiple agents
3. Uploading a CSV file
4. Viewing task distribution
5. Demonstrating all key features

Upload the video to Google Drive and share the link as requested in the assignment requirements.
