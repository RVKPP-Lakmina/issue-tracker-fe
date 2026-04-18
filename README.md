# Issue Tracker - Frontend Application

A **production-ready, integration-ready** Issue Tracker frontend application built with Next.js 16, featuring beautiful authentication pages and complete issue management capabilities. Designed to work seamlessly with any microservice backend—just configure environment variables!

![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Setup Environment Variables](#2-setup-environment-variables)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Run the Application](#4-run-the-application)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 🔐 Authentication

- Beautiful, modern Sign In page with email/password validation
- Beautiful Sign Up page with password strength indicator
- Password visibility toggle
- JWT token-based authentication
- Protected routes with middleware
- Automatic token refresh on 401 errors
- Secure session management

### 📊 Issue Management

- Full CRUD operations (Create, Read, Update, Delete)
- Sortable, paginated data table
- Advanced filtering (search, status, priority)
- Dashboard stats (total, open, in-progress, closed)
- **Gantt Chart view** for timeline visualization
- Color-coded status and priority badges
- User assignment and avatars
- Issue detail modal view
- Bulk selection support
- CSV and JSON export functionality
- Confirmation dialogs for destructive actions

### 🎨 User Experience

- Clean, modern UI with ShadCN/UI components
- Dark mode support built-in
- Responsive design (mobile, tablet, desktop)
- Loading skeletons during data fetch
- Toast notifications for user feedback
- Smooth animations and transitions
- Accessible components with ARIA labels

### 🛠️ Developer Experience

- TypeScript throughout for type safety
- Environment-driven configuration (no hardcoded URLs)
- TanStack Query for server state management
- Zustand for lightweight UI state
- Axios with request/response interceptors
- Custom React hooks for API integration
- React Hook Form + Zod for validation
- Comprehensive error handling
- ESLint with minimum rules configuration

---

## 🚀 Tech Stack

| Layer                | Technology                           |
| -------------------- | ------------------------------------ |
| **Framework**        | Next.js 16 (App Router)              |
| **Language**         | TypeScript 5.7.3                     |
| **UI Library**       | React 19                             |
| **UI Components**    | ShadCN/UI + Radix UI                 |
| **Styling**          | Tailwind CSS 3                       |
| **State Management** | Zustand + TanStack Query 5           |
| **Form Handling**    | React Hook Form + Zod                |
| **HTTP Client**      | Axios 1.15                           |
| **Package Manager**  | pnpm 10.15                           |
| **Linting**          | ESLint 9                             |
| **Deployment**       | Docker + GitHub Actions + EC2/Vercel |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **pnpm** v10 or higher ([Installation guide](https://pnpm.io/installation))
  ```bash
  npm install -g pnpm
  ```
- **Git** ([Download](https://git-scm.com/))
- **Docker** (optional, for deployment)

### Verify Installation

```bash
node --version     # Should be v18+
pnpm --version     # Should be v10+
git --version      # Should be installed
```

---

## 🔧 Installation

### 1. Clone the Repository

```bash
# Clone using HTTPS (most common)
git clone https://github.com/RVKPP-Lakmina/issue-tracker-fe.git

# OR clone using SSH
git clone git@github.com:RVKPP-Lakmina/issue-tracker-fe.git

# Navigate to project directory
cd issue-tracker-fe
```

### 2. Setup Environment Variables

The application requires environment variables to connect to your backend API. Follow these steps:

#### Step 2a: Copy the Example Environment File

```bash
cp .env.example .env.local
```

#### Step 2b: Configure Your Environment File

Open `.env.local` in your text editor and update the values:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_TOKEN_KEY=auth_token

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

**⚠️ Important Environment Variable Details:**

| Variable                   | Required | Description                      | Example                     |
| -------------------------- | -------- | -------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Yes   | Backend API base URL             | `http://localhost:3001/api` |
| `NEXT_PUBLIC_API_TIMEOUT`  | ✅ Yes   | Request timeout in milliseconds  | `30000`                     |
| `NEXT_PUBLIC_TOKEN_KEY`    | ✅ Yes   | Local storage key for auth token | `auth_token`                |
| `NEXT_PUBLIC_ANALYTICS_ID` | ❌ No    | Vercel Analytics ID              | `your_id`                   |

**Example Configurations by Environment:**

```env
# Development (Local Backend)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Staging (Remote Backend)
NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Production (Production Backend)
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
```

### 3. Install Dependencies

```bash
pnpm install
```

This will:

- Install all dependencies listed in `package.json`
- Install peer dependencies automatically
- Create a `pnpm-lock.yaml` file

**If you encounter issues**, try:

```bash
pnpm install --force
```

### 4. Run the Application

#### Development Mode

Start the development server with hot reload:

```bash
pnpm run dev
```

The application will be available at: **http://localhost:3000**

#### Production Build

Build for production:

```bash
pnpm run build
```

Start production server:

```bash
pnpm start
```

#### Lint Check

Run linting to check for code issues:

```bash
pnpm run lint
```

---

## 📚 Usage Guide

### Accessing the Application

1. **Open your browser** and go to `http://localhost:3000`
2. You will be redirected to the **Sign In** page

### Authentication Flow

#### Sign Up (Create New Account)

1. Click **"Sign Up"** on the Sign In page
2. Enter your name, email, and password
3. Password must meet the strength requirements
4. Click **"Create Account"**
5. You'll be redirected to the dashboard upon successful registration

#### Sign In

1. Enter your email and password
2. Click **"Sign In"**
3. You'll be authenticated and redirected to the **Issues Dashboard**

#### Sign Out

1. Click the **user avatar** in the top-right corner
2. Select **"Sign Out"**
3. You'll be redirected to the Sign In page

### Using the Issues Dashboard

#### View All Issues

- The **Issues** page displays all issues in a paginated table
- Default sorting: by creation date (newest first)
- View issue count, status, priority, assignee, and dates

#### Filter Issues

- **Search**: Type keywords to search issue titles
- **Status Filter**: Filter by Open, In Progress, Closed, or All
- **Priority Filter**: Filter by Low, Medium, High, Critical, or All
- Filters work together (AND logic)

#### Sort Issues

- Click column headers to sort:
  - Title (alphabetical)
  - Status (Open → Closed)
  - Priority (Low → Critical)
  - Due Date (earliest first)
  - Assignee (alphabetical)

#### View Issue Details

- Click any issue row or the **View** button to open details
- Modal shows full issue information:
  - Title and description
  - Status and priority badges
  - Assigned user with avatar
  - Dates (created, updated, due)
  - Labels and custom fields

#### Create New Issue

1. Click **"New Issue"** button
2. Fill in the form:
   - **Title** (required): Issue name
   - **Description** (optional): Detailed explanation
   - **Status**: Select from dropdown (Open, In Progress, Closed, etc.)
   - **Priority**: Select from dropdown (Low, Medium, High, Critical)
   - **Assignee**: Select user to assign the issue
   - **Due Date** (optional): Pick a date
3. Click **"Create Issue"** to save

#### Edit Issue

1. Click on an issue row to view details
2. Click **"Edit"** button in the modal
3. Update any fields
4. Click **"Save Changes"** to update
5. A confirmation toast will appear

#### Delete Issue

1. Click on an issue row to view details
2. Click **"Delete"** button in the modal
3. Confirm the deletion in the dialog
4. Issue will be removed from the list

#### View Gantt Chart

1. Navigate to **Issues** → **Gantt Chart** tab (or menu)
2. Timeline view shows:
   - Issue bars positioned by start/end dates
   - Status colors: Red (Open), Yellow (In Progress), Green (Closed)
   - Week navigation buttons to move forward/backward
   - Hover for issue details
3. Click issue bar to open details

#### Dashboard Statistics

- **Total Issues**: All issues in the system
- **Open Issues**: Count of Open status issues
- **In Progress**: Count of In Progress status issues
- **Closed Issues**: Count of Closed status issues

#### Bulk Operations

1. Select multiple issues using checkboxes
2. Use the bulk action toolbar to:
   - Change status (all selected)
   - Change priority (all selected)
   - Delete multiple issues (with confirmation)

#### Export Data

1. Click **"Export"** button
2. Select format:
   - **CSV**: Compatible with Excel, spreadsheets
   - **JSON**: Raw data for integrations

---

## 📁 Project Structure

```
issue-tracker-fe/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Home page (redirects to auth)
│   ├── globals.css                   # Global styles & themes
│   ├── providers.tsx                 # Query client & theme providers
│   ├── signin/
│   │   └── page.tsx                  # Sign in page
│   ├── signup/
│   │   └── page.tsx                  # Sign up page
│   └── issues/
│       ├── layout.tsx                # Protected issues layout
│       ├── page.tsx                  # Main issues dashboard
│       └── gantt/
│           └── page.tsx              # Gantt chart view
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx            # Sign in form component
│   │   └── SignUpForm.tsx            # Sign up form component
│   ├── issues/
│   │   ├── IssueTable.tsx            # Main issues table
│   │   ├── IssueForm.tsx             # Create/edit issue form
│   │   ├── IssueDetail.tsx           # Issue detail modal
│   │   ├── IssueModals.tsx           # Modal container
│   │   ├── FilterBar.tsx             # Search & filter controls
│   │   ├── DashboardStats.tsx        # Statistics cards
│   │   ├── StatusBadge.tsx           # Status display badge
│   │   ├── PriorityBadge.tsx         # Priority display badge
│   │   ├── UserHeader.tsx            # Top user section
│   │   └── gantt/
│   │       └── GanttChart.tsx        # Gantt chart timeline
│   ├── theme-provider.tsx            # Dark mode provider
│   └── ui/                           # ShadCN UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── badge.tsx
│       ├── table.tsx
│       └── ... (40+ UI components)
├── lib/
│   ├── api/
│   │   ├── client.ts                 # Axios instance with interceptors
│   │   └── config.ts                 # API configuration & endpoints
│   ├── hooks/
│   │   ├── useApi.ts                 # TanStack Query hooks for API
│   │   └── useAuthCheck.ts           # Auth utility hooks
│   ├── store/
│   │   ├── authStore.ts              # Zustand auth state
│   │   └── issueStore.ts             # Zustand UI state
│   ├── types.ts                      # TypeScript interfaces
│   └── utils.ts                      # Utility functions
├── middleware.ts                     # Route protection middleware
├── public/                           # Static assets
├── styles/                           # Additional styles
├── .env.example                      # Environment template
├── .env.local                        # Environment variables (local)
├── next.config.mjs                   # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
├── package.json                      # Dependencies & scripts
├── pnpm-lock.yaml                    # Lock file for dependencies
├── INTEGRATION_GUIDE.md              # Backend integration guide
├── BACKEND_ENDPOINTS.md              # API endpoint specification
├── PROJECT_SUMMARY.md                # Project overview
└── README.md                         # This file
```

---

## 🔌 API Integration

The frontend is **fully integration-ready** and works with any backend that provides the required endpoints.

### Required Backend Endpoints

#### Authentication

```
POST   /auth/signin         - Login user
POST   /auth/signup         - Register user
POST   /auth/logout         - Logout user
GET    /auth/me             - Get current user
```

#### Issues

```
GET    /issues              - List issues (with filtering/pagination)
POST   /issues              - Create new issue
GET    /issues/:id          - Get issue details
PUT    /issues/:id          - Update issue
DELETE /issues/:id          - Delete issue
```

### API Request/Response Format

**Example Sign In Request:**

```json
POST /auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Example Get Issues Request:**

```json
GET /issues?status=open&priority=high&search=bug&page=1&limit=10

Response (200 OK):
{
  "data": [
    {
      "id": "issue_1",
      "title": "Bug in login",
      "description": "...",
      "status": "open",
      "priority": "high",
      "assignee": { "id": "user_1", "name": "John", "email": "..." },
      "dueDate": "2026-04-25T00:00:00Z",
      "createdAt": "2026-04-18T10:00:00Z",
      "updatedAt": "2026-04-18T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Customizing API Endpoints

Edit `lib/api/config.ts` to customize API endpoints:

```typescript
export const API_ENDPOINTS = {
  AUTH_SIGNIN: "/auth/signin",
  AUTH_SIGNUP: "/auth/signup",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_ME: "/auth/me",
  ISSUES_LIST: "/issues",
  ISSUES_CREATE: "/issues",
  ISSUES_GET: (id: string) => `/issues/${id}`,
  ISSUES_UPDATE: (id: string) => `/issues/${id}`,
  ISSUES_DELETE: (id: string) => `/issues/${id}`,
};
```

### Making API Calls

The frontend uses custom hooks for all API calls:

```typescript
// In your component
import { useIssues, useCreateIssue } from '@/lib/hooks/useApi';

export default function Component() {
  // Fetch issues
  const { data: issues, isLoading } = useIssues({
    status: 'open',
    search: 'bug'
  });

  // Create issue
  const { mutate: createIssue } = useCreateIssue();

  const handleCreate = (issueData) => {
    createIssue(issueData, {
      onSuccess: () => console.log('Issue created!'),
      onError: (error) => console.error('Error:', error)
    });
  };

  return <>...</>;
}
```

---

## 🚀 Deployment

### Deployment Options

#### Option 1: Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option 2: Docker + EC2

```bash
# Build Docker image
docker build -t issue-tracker-fe .

# Run container
docker run -p 3000:3000 issue-tracker-fe

# Push to registry and deploy to EC2
# See .github/workflows/deploy.yml for GitHub Actions setup
```

#### Option 3: Traditional Hosting

```bash
# Build the app
pnpm run build

# Upload `out/` and `package.json` to hosting
# Install dependencies and run:
pnpm start
```

### Environment Variables for Deployment

Set these environment variables in your hosting platform:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_TOKEN_KEY=auth_token
```

---

## ❓ Troubleshooting

### Issue: "Cannot find module"

```bash
# Solution: Reinstall dependencies
pnpm install --force
pnpm build
```

### Issue: "API calls failing (404 or connection refused)"

```bash
# Check:
1. Backend is running and accessible
2. NEXT_PUBLIC_API_BASE_URL is correct in .env.local
3. Backend endpoints match the expected format
4. CORS is enabled on backend
```

### Issue: "Sign in/Sign up page is blank or errors"

```bash
# Check:
1. Backend /auth/signin and /auth/signup endpoints are working
2. Backend returns token and user object in correct format
3. NEXT_PUBLIC_TOKEN_KEY matches backend expectation
```

### Issue: "Authentication keeps failing"

```bash
# Check:
1. Token is stored in correct localStorage key
2. Backend validates token correctly
3. Token expiration and refresh logic is working
4. CORS headers include credentials: 'include'
```

### Issue: "Styles not loading properly"

```bash
# Solution: Clear Next.js cache
rm -rf .next
pnpm run build
pnpm start
```

### Issue: "Build fails with TypeScript errors"

```bash
# Check:
pnpm exec tsc --noEmit

# Fix errors shown, then rebuild:
pnpm run build
```

### Issue: "Port 3000 already in use"

```bash
# Use different port:
pnpm run dev -- -p 3001
```

---

## 📞 Support

For issues or questions:

- 📧 Email: support@example.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/RVKPP-Lakmina/issue-tracker-fe/issues)
- 💬 Discussions: [Ask a question](https://github.com/RVKPP-Lakmina/issue-tracker-fe/discussions)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **ShadCN/UI** for beautiful, accessible components
- **TanStack Query** for powerful server state management
- **Tailwind CSS** for utility-first styling
- **Next.js** team for the amazing framework

---

**Happy coding! 🚀**
