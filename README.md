# 🚀 TaskFlow Pro - Enterprise Task Management System

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A comprehensive full-stack task management system built with modern technologies, featuring admin dashboards, agent management, CSV task distribution, real-time analytics, and mobile-responsive design.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [📱 User Interface](#-user-interface)
- [🔧 Installation & Setup](#-installation--setup)
- [📚 Usage Guide](#-usage-guide)
- [🔌 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🔒 Security Features](#-security-features)
- [📊 Analytics & Reporting](#-analytics--reporting)
- [🌐 Production Deployment](#-production-deployment)
- [🎓 Tutorial](#-tutorial)
- [🤝 Contributing](#-contributing)

## 🎯 Overview

TaskFlow Pro is an enterprise-grade task management and distribution system designed for organizations that need to efficiently manage agents and distribute tasks at scale. The platform provides a comprehensive solution for admin users to manage their workforce, upload task data via CSV files, and track performance through advanced analytics.

### 🌟 What Makes TaskFlow Pro Special?

- **Multi-Tenant Architecture**: Complete workspace isolation for different organizations
- **Intelligent Task Distribution**: Advanced algorithms for optimal task assignment
- **Real-Time Analytics**: Comprehensive dashboards with charts and performance metrics
- **Mobile-First Design**: Fully responsive interface optimized for all devices
- **Enterprise Security**: JWT authentication, bcrypt encryption, and secure API endpoints
- **Interactive Tutorial**: Built-in guided tour accessible without login

## ✨ Key Features

### 🔐 Authentication & User Management
- **Multi-Role Authentication**: Admin and Agent login systems
- **Secure Registration**: Account creation with workspace isolation
- **JWT Token Management**: Secure session handling with automatic refresh
- **Password Security**: bcrypt hashing with salt rounds
- **Protected Routes**: Role-based access control

### 👥 Agent Management System
- **Agent Creation**: Add agents with comprehensive details
- **Bulk Operations**: Import multiple agents via CSV
- **Agent Dashboard**: Dedicated interface for agents to view tasks
- **Performance Tracking**: Monitor agent productivity and completion rates
- **Workspace Isolation**: Agents belong to specific admin workspaces

### 📊 CSV Upload & Task Distribution
- **Smart File Processing**: Support for CSV, XLS, and XLSX formats
- **Intelligent Distribution**: Equal distribution with remainder handling
- **Column Mapping**: Flexible mapping for FirstName, Phone, and Notes
- **Validation Engine**: Comprehensive file and data validation
- **Real-Time Processing**: Instant task assignment upon upload

### 📈 Advanced Analytics Dashboard
- **Interactive Charts**: Task completion trends and performance metrics
- **Agent Performance**: Individual and comparative analytics
- **Progress Tracking**: Real-time completion status monitoring
- **Export Capabilities**: Generate reports in multiple formats
- **Mobile Analytics**: Responsive chart design for mobile devices

### 🎨 Modern User Interface
- **ShadCN UI Components**: Professional, accessible design system
- **Toast Notifications**: Beautiful feedback for all user actions
- **Mobile Responsive**: Optimized for phones, tablets, and desktops
- **Dark Mode Support**: Coming in future updates
- **Accessibility**: WCAG 2.1 AA compliant interface

## 🏗️ System Architecture

### 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (Next.js)                 │
├─────────────────────────────────────────────────────────────┤
│  Components    │  Pages      │  Contexts   │  Utils         │
│  - UI Library  │  - Landing  │  - Auth     │  - API Client  │
│  - Charts      │  - Auth     │  - Theme    │  - Validators  │
│  - Forms       │  - Dashboard│             │  - Helpers     │
│  - Analytics   │  - Agent    │             │                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js API)                   │
├─────────────────────────────────────────────────────────────┤
│  Authentication │  Agents     │  Tasks      │  Analytics    │
│  - Login        │  - CRUD     │  - Upload   │  - Reports    │
│  - Register     │  - List     │  - Distrib. │  - Metrics    │
│  - JWT          │  - Delete   │  - Edit     │  - Charts     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Services       │  Utilities  │  Middleware │  Validation   │
│  - AuthService  │  - CSV      │  - Auth     │  - Schemas    │
│  - TaskService  │  - Parser   │  - CORS     │  - Rules      │
│  - Analytics    │  - Crypto   │  - Logger   │  - Sanitizer  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (MongoDB)                      │
├─────────────────────────────────────────────────────────────┤
│  Collections    │  Indexes    │  Relations  │  Aggregations │
│  - Users        │  - User     │  - 1:N      │  - Analytics  │
│  - Agents       │  - Agent    │  - M:N      │  - Reports    │
│  - Tasks        │  - Task     │  - Refs     │  - Metrics    │
│  - Analytics    │  - Compound │             │               │
└─────────────────────────────────────────────────────────────┘
```

### 🗄️ Database Schema

#### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: "admin",
  createdAt: Date,
  updatedAt: Date,
  workspace: {
    name: String,
    settings: Object
  }
}
```

#### Agent Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  mobileNumber: String,
  password: String (hashed),
  userId: ObjectId (ref: User),
  role: "agent",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  stats: {
    totalTasks: Number,
    completedTasks: Number,
    pendingTasks: Number
  }
}
```

#### Task Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  phone: String,
  notes: String,
  agentId: ObjectId (ref: Agent),
  userId: ObjectId (ref: User),
  uploadId: String,
  status: "pending" | "completed",
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date,
  metadata: {
    source: "csv",
    row: Number,
    priority: String
  }
}
```

### 🔄 Data Flow Architecture

1. **Authentication Flow**
   ```
   Login Request → JWT Validation → Route Protection → Data Access
   ```

2. **Task Distribution Flow**
   ```
   CSV Upload → File Validation → Data Parsing → Distribution Algorithm → Database Storage → UI Update
   ```

3. **Analytics Flow**
   ```
   Data Aggregation → Chart Generation → Real-time Updates → Performance Metrics
   ```

## 🛠️ Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.4
- **UI Components**: ShadCN UI Library
- **Charts**: Recharts for analytics visualization
- **Notifications**: Sonner for toast messages
- **Icons**: Lucide React icon library
- **State Management**: React Context API

### Backend Technologies
- **Runtime**: Node.js 18+
- **API Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Processing**: XLSX library
- **Validation**: Custom validation middleware

### Development Tools
- **Build Tool**: Next.js built-in bundler
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler
- **Testing**: Jest (planned)
- **Package Manager**: npm/yarn

### Infrastructure & Deployment
- **Hosting**: Vercel (recommended)
- **Database**: MongoDB Atlas
- **CDN**: Next.js automatic optimization
- **Analytics**: Built-in performance monitoring
- **Security**: HTTPS, CORS protection

## 📱 User Interface

### 🎨 Design System

**Color Palette**
- Primary: Indigo (600, 700)
- Success: Green (500, 600)
- Warning: Yellow (500, 600)
- Error: Red (500, 600)
- Neutral: Gray (50-900)

**Typography**
- Headlines: Inter font family
- Body: Inter font family
- Code: JetBrains Mono

**Responsive Breakpoints**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### 📱 Mobile Responsiveness Features

- **Adaptive Navigation**: Collapsible menu for mobile devices
- **Touch-Friendly**: Optimized button sizes and touch targets
- **Responsive Tables**: Horizontal scrolling and stacked layouts
- **Mobile Charts**: Touch-enabled chart interactions
- **Progressive Enhancement**: Core functionality works on all devices

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB 6.0 or higher (local or Atlas)
- npm 9.0.0 or higher

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd mern-assignment
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env.local` file:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/taskflow-pro
   
   # Authentication
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_EXPIRES_IN=7d
   
   # Application Settings
   NEXTAUTH_URL=http://localhost:3000
   NODE_ENV=development
   
   # File Upload Settings
   MAX_FILE_SIZE=10485760
   ALLOWED_FILE_TYPES=.csv,.xlsx,.xls
   ```

4. **Database Setup**
   
   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB Community Edition
   # Start MongoDB service
   sudo systemctl start mongod  # Linux
   brew services start mongodb-community  # macOS
   ```
   
   **Option B: MongoDB Atlas**
   - Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create new cluster
   - Get connection string
   - Update MONGODB_URI in .env.local

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
   - Open http://localhost:3000
   - View tutorial without login
   - Register new account or use test credentials

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## 📚 Usage Guide

### 🎯 Getting Started

1. **Tutorial Experience**
   - Visit the landing page
   - Click "Tutorial" to see interactive demo
   - Learn all features without creating account

2. **Account Creation**
   - Click "Get Started" or "Register"
   - Enter email and password
   - Automatic workspace creation

3. **Agent Management**
   - Navigate to "Agents" tab
   - Add at least 5 agents for task distribution
   - Provide name, email, phone, and password

### 📊 Task Management Workflow

1. **Prepare CSV File**
   ```csv
   FirstName,Phone,Notes
   John Doe,+1234567890,Follow up required
   Jane Smith,+1987654321,VIP customer
   Bob Johnson,+1122334455,New prospect
   ```

2. **Upload and Distribute**
   - Go to "Upload CSV" tab
   - Select your CSV/Excel file
   - Click "Upload and Distribute"
   - Tasks automatically assigned to agents

3. **Monitor Progress**
   - View "Task Distribution" for overview
   - Check "Analytics" for performance metrics
   - Edit or delete tasks as needed

### 👨‍💼 Agent Portal Usage

1. **Agent Login**
   - Agents receive credentials from admin
   - Login at main auth page using "Agent" tab
   - Access personalized dashboard

2. **Task Management**
   - View assigned tasks with contact details
   - Mark tasks as completed
   - Access task history with pagination

### 📈 Analytics Dashboard

1. **Overview Metrics**
   - Total tasks across all uploads
   - Completion rates and pending tasks
   - Agent performance comparisons

2. **Visual Charts**
   - Task completion timeline
   - Agent performance bar charts
   - Status distribution pie charts

3. **Detailed Reports**
   - Recent completions table
   - Agent performance metrics
   - Upload session analytics

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Create new admin account
```javascript
Request Body:
{
  "email": "admin@company.com",
  "password": "securePassword"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "admin@company.com",
    "role": "admin"
  }
}
```

#### POST `/api/auth/login`
Admin user login
```javascript
Request Body:
{
  "email": "admin@company.com",
  "password": "securePassword"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "user": { /* user object */ }
}
```

#### POST `/api/auth/agent-login`
Agent login
```javascript
Request Body:
{
  "email": "agent@company.com",
  "password": "agentPassword"
}

Response:
{
  "success": true,
  "token": "jwt-token",
  "agent": { /* agent object */ }
}
```

### Agent Management Endpoints

#### GET `/api/agents`
Get all agents for authenticated user
```javascript
Headers: { "Authorization": "Bearer jwt-token" }

Response:
{
  "success": true,
  "agents": [
    {
      "id": "agent-id",
      "name": "Agent Name",
      "email": "agent@email.com",
      "mobileNumber": "+1234567890",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/agents`
Create new agent
```javascript
Headers: { 
  "Authorization": "Bearer jwt-token",
  "Content-Type": "application/json"
}

Request Body:
{
  "name": "Agent Name",
  "email": "agent@email.com",
  "mobileNumber": "+1234567890",
  "password": "agentPassword"
}

Response:
{
  "success": true,
  "agent": { /* created agent object */ }
}
```

#### DELETE `/api/agents/[id]`
Delete agent and associated tasks
```javascript
Headers: { "Authorization": "Bearer jwt-token" }

Response:
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

### Task Management Endpoints

#### POST `/api/tasks/upload`
Upload CSV and distribute tasks
```javascript
Headers: { "Authorization": "Bearer jwt-token" }

Request Body: FormData with file

Response:
{
  "success": true,
  "uploadId": "upload-id",
  "totalTasks": 100,
  "distribution": [
    {
      "agent": { /* agent info */ },
      "tasks": [ /* task array */ ],
      "taskCount": 20
    }
  ]
}
```

#### GET `/api/tasks`
Get all tasks for authenticated user
```javascript
Headers: { "Authorization": "Bearer jwt-token" }

Query Parameters:
- agentId: Filter by agent
- uploadId: Filter by upload session
- status: Filter by completion status

Response:
{
  "success": true,
  "tasks": [ /* task array */ ]
}
```

#### PUT `/api/tasks/[id]`
Update task details
```javascript
Headers: { 
  "Authorization": "Bearer jwt-token",
  "Content-Type": "application/json"
}

Request Body:
{
  "firstName": "Updated Name",
  "phone": "+1987654321",
  "notes": "Updated notes"
}

Response:
{
  "success": true,
  "task": { /* updated task object */ }
}
```

#### POST `/api/tasks/[id]/complete`
Mark task as completed (Agent only)
```javascript
Headers: { "Authorization": "Bearer jwt-token" }

Response:
{
  "success": true,
  "task": { /* updated task with completed status */ }
}
```

### Analytics Endpoints

#### GET `/api/analytics/tasks`
Get comprehensive analytics data
```javascript
Headers: { "Authorization": "Bearer jwt-token" }

Response:
{
  "success": true,
  "analytics": {
    "overview": {
      "totalTasks": 500,
      "completedTasks": 350,
      "pendingTasks": 150,
      "completionRate": 70
    },
    "agentPerformance": [ /* agent stats */ ],
    "uploadSessions": [ /* upload stats */ ],
    "completionTimeline": [ /* timeline data */ ],
    "recentCompletions": [ /* recent completions */ ]
  }
}
```

## 🧪 Testing

### Test Accounts

**Admin Accounts**
- Email: `admin@test.com`, Password: `admin123`
- Email: `user1@test.com`, Password: `user123`
- Email: `user2@test.com`, Password: `user123`

**Agent Accounts** (for admin@test.com)
- Email: `john@agent.com`, Password: `agent123`
- Email: `jane@agent.com`, Password: `agent123`
- Email: `bob@agent.com`, Password: `agent123`
- Email: `alice@agent.com`, Password: `agent123`
- Email: `charlie@agent.com`, Password: `agent123`

### Sample Test Data

Create `test-data.csv`:
```csv
FirstName,Phone,Notes
John Doe,+1234567890,Follow up in 1 week
Jane Smith,+1987654321,VIP customer - high priority
Bob Johnson,+1122334455,New prospect from website
Alice Brown,+1555666777,Existing customer renewal
Charlie Wilson,+1999888777,Referral from partner
David Lee,+1444333222,Hot lead - demo scheduled
Emma Davis,+1777888999,Price inquiry for enterprise
Frank Miller,+1666555444,Support ticket escalation
Grace Taylor,+1333222111,Contract negotiation
Henry Clark,+1888777666,Product demo completed
```

### Testing Scenarios

1. **Multi-User Isolation Testing**
   ```bash
   # Test workspace separation
   1. Login as admin@test.com
   2. Add 5 agents and upload CSV
   3. Note task distribution
   4. Logout and login as user1@test.com
   5. Verify empty workspace
   6. Add different agents with same emails
   7. Upload same CSV
   8. Verify separate distributions
   ```

2. **Mobile Responsiveness Testing**
   ```bash
   # Test on different screen sizes
   1. Desktop: 1920x1080
   2. Tablet: 768x1024
   3. Mobile: 375x667
   4. Test all features on each size
   5. Verify touch interactions
   ```

3. **Performance Testing**
   ```bash
   # Test with large datasets
   1. Create CSV with 1000+ rows
   2. Upload and measure processing time
   3. Test analytics with large datasets
   4. Verify pagination performance
   ```

### Automated Testing (Coming Soon)

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🔒 Security Features

### Authentication Security
- **JWT Tokens**: Secure, stateless authentication
- **Token Expiration**: Automatic session timeout
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API endpoint protection
- **CORS Protection**: Cross-origin request security

### Data Security
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: MongoDB parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **File Upload Security**: Type validation and size limits
- **Workspace Isolation**: Complete data separation between users

### API Security
- **Authorization Middleware**: Route-level protection
- **Request Validation**: Schema-based validation
- **Error Handling**: Secure error messages
- **Audit Logging**: Request tracking and monitoring
- **HTTPS Enforcement**: SSL/TLS encryption in production

## 📊 Analytics & Reporting

### Key Metrics Tracked
- **Task Completion Rates**: Overall and per-agent
- **Performance Trends**: Time-based analysis
- **Agent Productivity**: Individual and comparative
- **Upload Session Analytics**: Batch processing insights
- **System Usage**: Activity patterns and peaks

### Chart Types Available
- **Line Charts**: Completion trends over time
- **Bar Charts**: Agent performance comparison
- **Pie Charts**: Task status distribution
- **Progress Bars**: Individual completion rates
- **Heatmaps**: Activity patterns (planned)

### Export Options (Planned)
- PDF reports
- Excel spreadsheets
- CSV data export
- Scheduled email reports
- API data access

## 🌐 Production Deployment

### Vercel Deployment (Recommended)

1. **Prepare for Deployment**
   ```bash
   # Build and test locally
   npm run build
   npm start
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXTAUTH_URL`

### Alternative Deployment Options

**Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**AWS/Azure/GCP**
- Use container services
- Set up MongoDB Atlas
- Configure environment variables
- Enable HTTPS

### Performance Optimization

- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic by Next.js App Router
- **Caching**: MongoDB query optimization
- **CDN**: Vercel Edge Network
- **Bundle Analysis**: Use `npm run analyze`

## 🎓 Tutorial

### Interactive Landing Page Tutorial

The landing page includes a comprehensive tutorial section that visitors can access without login:

1. **Tutorial Overview**
   - Step-by-step visual guide
   - Interactive cards showing each feature
   - Mobile-responsive design
   - No registration required

2. **Tutorial Content**
   - Admin Dashboard Overview
   - Agent Management Process
   - CSV Upload and Distribution
   - Agent Portal Experience
   - Analytics Dashboard Tour

3. **Visual Elements**
   - Feature demonstrations
   - Process flow diagrams
   - Interactive hover effects
   - Call-to-action buttons

### Accessing the Tutorial

1. Visit the landing page
2. Click "Tutorial" in the navigation
3. Scroll through interactive sections
4. Try "Start Free Trial" when ready

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Follow TypeScript strict mode
   - Use ESLint and Prettier
   - Write descriptive commit messages
   - Add comments for complex logic

2. **Component Structure**
   ```
   src/
   ├── app/                 # Next.js app router pages
   ├── components/          # Reusable UI components
   ├── context/            # React context providers
   ├── lib/                # Utility functions
   ├── models/             # MongoDB schemas
   └── types/              # TypeScript type definitions
   ```

3. **Naming Conventions**
   - Components: PascalCase
   - Functions: camelCase
   - Files: kebab-case
   - Constants: UPPER_SNAKE_CASE

### Feature Development

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and test**
4. **Submit pull request**

### Bug Reports

Use GitHub issues with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **ShadCN** for the beautiful UI components
- **Vercel** for hosting and deployment tools
- **MongoDB** for the robust database solution
- **Open Source Community** for inspiration and tools

---

## 📞 Support

For support and questions:
- Create a GitHub issue
- Check the troubleshooting section
- Review the API documentation
- Test with provided sample data

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

*TaskFlow Pro - Streamlining task management for the modern workplace*