# Issue Tracker - Project Summary

## Overview

A **production-ready, integration-ready** Issue Tracker frontend application built with Next.js 16, featuring beautiful authentication pages and complete issue management capabilities. Designed to work seamlessly with any microservice backend—just configure environment variables!

## Key Features

### Authentication
- ✅ Beautiful, modern Sign In page with email/password validation
- ✅ Beautiful Sign Up page with password strength indicator
- ✅ Password visibility toggle
- ✅ JWT token-based authentication
- ✅ Protected routes with middleware
- ✅ Automatic token refresh on 401 errors
- ✅ Secure session management

### Issue Tracker
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Sortable, paginated data table
- ✅ Advanced filtering (search, status, priority)
- ✅ Dashboard stats (total, open, in-progress, closed)
- ✅ Color-coded status and priority badges
- ✅ User assignment and avatars
- ✅ Issue detail modal view
- ✅ Bulk selection support
- ✅ CSV and JSON export functionality
- ✅ Confirmation dialogs for destructive actions

### User Experience
- ✅ Clean, modern UI with ShadCN/UI components
- ✅ Dark mode support built-in
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading skeletons during data fetch
- ✅ Toast notifications for user feedback
- ✅ Smooth animations and transitions
- ✅ Accessible components with ARIA labels

### Developer Experience
- ✅ TypeScript throughout for type safety
- ✅ Environment-driven configuration (no hardcoded URLs)
- ✅ TankStack Query for server state management
- ✅ Zustand for lightweight UI state
- ✅ Axios with request/response interceptors
- ✅ Custom React hooks for API integration
- ✅ React Hook Form + Zod for validation
- ✅ Comprehensive error handling

## Project Structure

```
issue-tracker/
├── app/
│   ├── signin/page.tsx              # Sign in page
│   ├── signup/page.tsx              # Sign up page
│   ├── issues/
│   │   ├── page.tsx                 # Main issues dashboard
│   │   └── layout.tsx               # Protected layout
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Redirect/auth check
│   ├── globals.css                  # Global styles & themes
│   └── providers.tsx                # Query client provider
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── issues/
│   │   ├── IssueTable.tsx
│   │   ├── IssueForm.tsx
│   │   ├── IssueDetail.tsx
│   │   ├── IssueModals.tsx
│   │   ├── FilterBar.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   └── UserHeader.tsx
│   └── ui/                          # ShadCN components
├── lib/
│   ├── api/
│   │   ├── client.ts               # Axios instance with interceptors
│   │   └── config.ts               # API configuration
│   ├── store/
│   │   ├── authStore.ts            # Auth state management
│   │   └── issueStore.ts           # UI state management
│   ├── hooks/
│   │   ├── useApi.ts               # TankStack Query hooks
│   │   └── useAuthCheck.ts         # Auth utilities
│   └── types.ts                    # TypeScript interfaces
├── middleware.ts                    # Route protection
├── .env.example                     # Environment template
├── INTEGRATION_GUIDE.md             # Backend integration guide
├── BACKEND_ENDPOINTS.md            # API specifications
└── PROJECT_SUMMARY.md              # This file
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI Components** | ShadCN/UI (100+ components) |
| **Styling** | Tailwind CSS with semantic tokens |
| **State Management** | Zustand (UI), TankStack Query (Server) |
| **API Client** | Axios with interceptors |
| **Forms** | React Hook Form + Zod validation |
| **Date Formatting** | date-fns |
| **Icons** | Lucide React |
| **Language** | TypeScript |

## Integration Steps

### 1. Clone/Download the Project
```bash
git clone <repo-url>
cd issue-tracker
pnpm install
```

### 2. Configure Backend URL
Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_TOKEN_KEY=auth_token
```

### 3. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` and navigate to Sign In.

### 4. Implement Backend
Refer to `BACKEND_ENDPOINTS.md` for API specifications your backend must implement.

### 5. Deploy
```bash
pnpm build
vercel deploy  # or your preferred hosting
```

## API Integration Points

All API calls are handled through:
- **File**: `/lib/hooks/useApi.ts`
- **Method**: TankStack Query hooks + Axios

Key hooks:
```typescript
// Auth
useSignIn()           // Login
useSignUp()          // Register
useLogout()          // Logout
useGetCurrentUser()  // Fetch user

// Issues
useIssues()          // List issues
useIssueDetail()     // Get single issue
useCreateIssue()     // Create issue
useUpdateIssue()     // Update issue
useDeleteIssue()     // Delete issue
useBulkDeleteIssues()// Delete multiple
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | - | Backend API base URL |
| `NEXT_PUBLIC_API_TIMEOUT` | No | 30000 | Request timeout in ms |
| `NEXT_PUBLIC_TOKEN_KEY` | No | auth_token | localStorage key for JWT |

## Features by Page

### Sign In Page (`/signin`)
- Email and password fields
- Form validation
- Error messages
- Password visibility toggle
- Link to sign up page
- Auto-redirect if already authenticated

### Sign Up Page (`/signup`)
- Name, email, password fields
- Password strength indicator
- Password confirmation
- Form validation
- Link to sign in page
- Auto-login after successful registration

### Issues Dashboard (`/issues`)
- Dashboard stats (total, open, in-progress, closed)
- Advanced filter bar (search, status, priority)
- Sortable data table with pagination
- Issue detail modal
- Create/edit issue forms
- Delete confirmation dialog
- Bulk selection with actions
- CSV/JSON export
- User header with logout

## Authentication Flow

1. User visits app → redirected to `/signin`
2. User signs in with email/password
3. Backend validates and returns JWT token + user data
4. Token stored in localStorage
5. Frontend redirected to `/issues`
6. All API requests include `Authorization: Bearer {token}`
7. On 401 response → token cleared, redirected to `/signin`

## State Management Flow

### Zustand Stores

**Auth Store** (`authStore.ts`):
- Current user info
- Authentication status
- Login/logout actions
- Token management

**Issue Store** (`issueStore.ts`):
- Modal visibility states
- Search query and filters
- Pagination state
- Selected issues for bulk actions
- Filter values

### TankStack Query

Manages:
- Issue list with caching
- Single issue details
- Create/update/delete mutations
- Automatic refetch on mutation
- Error handling and retries
- Loading states

## Security Features

✅ JWT token-based authentication
✅ HTTP-only cookie option ready
✅ Request/response interceptors for token injection
✅ Automatic logout on 401 errors
✅ Protected routes with middleware
✅ Input validation with Zod
✅ Environment variable driven config (no secrets in code)

## Performance Features

✅ TankStack Query caching (5-minute stale time)
✅ Debounced search (300ms)
✅ Loading skeletons for better UX
✅ Lazy loading of modals
✅ Image optimization
✅ CSS-in-JS with Tailwind (optimized builds)
✅ Code splitting with Next.js

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Checklist

- [ ] Configure `.env.local` with backend URL
- [ ] Implement backend API endpoints (see `BACKEND_ENDPOINTS.md`)
- [ ] Test sign in/sign up flow
- [ ] Test issue CRUD operations
- [ ] Test filters and search
- [ ] Test exports (CSV/JSON)
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Deploy to production

## Customization Guide

### Change Primary Color
Edit `/app/globals.css`:
```css
--primary: oklch(0.5 0.15 260); /* Change from blue */
```

### Add Custom Endpoint
Add to `/lib/hooks/useApi.ts`:
```typescript
export const useMyNewEndpoint = () => {
  return useQuery({
    queryKey: ['my-resource'],
    queryFn: async () => {
      const response = await getApiClient().get('/my-endpoint');
      return response.data;
    },
  });
};
```

### Modify Issue Form Fields
Edit `/components/issues/IssueForm.tsx` and `/lib/types.ts`

## Troubleshooting

### "Cannot POST /api/auth/signin"
- Backend is not running
- `NEXT_PUBLIC_API_BASE_URL` is incorrect
- Backend CORS configuration needed

### JWT token not persisting
- Check localStorage is enabled
- Check `NEXT_PUBLIC_TOKEN_KEY` matches backend

### API calls timing out
- Increase `NEXT_PUBLIC_API_TIMEOUT`
- Check network connectivity
- Verify backend responsiveness

## Documentation Files

1. **INTEGRATION_GUIDE.md** - Complete integration instructions
2. **BACKEND_ENDPOINTS.md** - API endpoint specifications
3. **PROJECT_SUMMARY.md** - This file
4. **.env.example** - Environment variables template

## Getting Help

1. Check the relevant guide (integration, endpoints, project summary)
2. Review component implementations in `/components`
3. Check hook implementations in `/lib/hooks/useApi.ts`
4. Verify backend API responses match specifications

## License

Built with ❤️ using Next.js 16, TankStack Query, Zustand, and ShadCN/UI

---

**Ready to integrate with your backend? Check `BACKEND_ENDPOINTS.md` and `INTEGRATION_GUIDE.md`!**
