# Issue Tracker - Backend Integration Guide

This is a **fully integration-ready** Issue Tracker frontend application built with Next.js 16, ShadCN/UI, TankStack Query, and Zustand. It's designed to work seamlessly with any microservice backend without requiring code changes—just configure environment variables!

## Quick Start

### 1. Setup Your Backend

Your backend should provide these API endpoints:

```
POST   /api/auth/signin        - Login user (returns token + user)
POST   /api/auth/signup        - Register user (returns token + user)
POST   /api/auth/logout        - Logout user
GET    /api/auth/me            - Get current user
GET    /api/issues             - List issues (with filters)
POST   /api/issues             - Create issue
PUT    /api/issues/:id         - Update issue
DELETE /api/issues/:id         - Delete issue
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the variables with your backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-domain.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_TOKEN_KEY=auth_token
```

That's it! The frontend is now connected to your backend.

## API Contract Specifications

### Authentication Endpoints

#### Sign In
```
POST /api/auth/signin
Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://..." (optional)
  }
}
```

#### Sign Up
```
POST /api/auth/signup
Request Body:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Headers:
  Authorization: Bearer {token}

Response (200 OK):
{
  "id": "user_id",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://..." (optional)
}
```

#### Logout
```
POST /api/auth/logout
Headers:
  Authorization: Bearer {token}

Response (200 OK):
{
  "success": true
}
```

### Issue Endpoints

#### List Issues
```
GET /api/issues?search=...&status=...&priority=...&page=...&pageSize=...
Headers:
  Authorization: Bearer {token}

Query Parameters (all optional):
  - search: string (search in title/description)
  - status: string[] (comma-separated: open,in-progress,closed,on-hold)
  - priority: string (low,medium,high,critical)
  - page: number (default: 1)
  - pageSize: number (default: 10)

Response (200 OK):
{
  "data": [
    {
      "id": "issue_id",
      "title": "Issue Title",
      "description": "Issue description",
      "status": "open",
      "priority": "high",
      "assignedTo": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "https://..." (optional)
      },
      "createdBy": {
        "id": "user_id",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

#### Create Issue
```
POST /api/issues
Headers:
  Authorization: Bearer {token}

Request Body:
{
  "title": "New Issue",
  "description": "Issue description",
  "status": "open",
  "priority": "medium",
  "assignedToId": "user_id" (optional)
}

Response (201 Created):
{
  "id": "issue_id",
  "title": "New Issue",
  "description": "Issue description",
  "status": "open",
  "priority": "medium",
  "assignedTo": null,
  "createdBy": {
    "id": "current_user_id",
    "name": "Current User",
    "email": "user@example.com"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Update Issue
```
PUT /api/issues/:id
Headers:
  Authorization: Bearer {token}

Request Body:
{
  "title": "Updated Title" (optional),
  "description": "Updated description" (optional),
  "status": "in-progress" (optional),
  "priority": "high" (optional),
  "assignedToId": "new_user_id" (optional)
}

Response (200 OK):
{
  "id": "issue_id",
  "title": "Updated Title",
  ...
}
```

#### Delete Issue
```
DELETE /api/issues/:id
Headers:
  Authorization: Bearer {token}

Response (204 No Content):
```

## Architecture Overview

### Frontend Structure

```
├── app/
│   ├── (auth routes)
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── issues/
│   │   ├── page.tsx (main issues page)
│   │   └── layout.tsx (protected layout)
│   ├── layout.tsx (root layout)
│   ├── page.tsx (redirect logic)
│   └── globals.css (styling)
├── components/
│   ├── auth/
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── issues/
│   │   ├── IssueTable.tsx
│   │   ├── IssueForm.tsx
│   │   ├── FilterBar.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── UserHeader.tsx
│   │   └── ... (more components)
│   └── ui/ (ShadCN components)
├── lib/
│   ├── api/
│   │   ├── client.ts (axios instance with interceptors)
│   │   ├── config.ts (environment configuration)
│   ├── hooks/
│   │   ├── useApi.ts (TankStack Query hooks)
│   │   └── useAuthCheck.ts (auth utilities)
│   ├── store/
│   │   ├── authStore.ts (Zustand auth state)
│   │   └── issueStore.ts (Zustand UI state)
│   └── types.ts (TypeScript interfaces)
├── middleware.ts (route protection)
└── .env.example (configuration template)
```

### State Management

- **Zustand**: Manages auth state and UI state (modals, filters, selections)
- **TankStack Query**: Handles server state and API caching with automatic refetching and invalidation
- **localStorage**: Persists JWT token for session continuity

### Authentication Flow

1. User visits `/` → redirected to `/signin` if no token
2. User signs in → API returns JWT token
3. Token stored in localStorage and Zustand store
4. Axios interceptor automatically adds token to all requests
5. Protected `/issues` route checks for token via middleware
6. On logout → token cleared from storage and localStorage
7. User redirected to `/signin`

## Error Handling

The frontend automatically handles:
- **401 Unauthorized**: Clears token and redirects to signin
- **Network errors**: Retries with exponential backoff (configurable)
- **Validation errors**: Shows validation messages from backend
- **Timeout errors**: Respects `NEXT_PUBLIC_API_TIMEOUT` setting

## Development Tips

### Testing Locally

```bash
# Start the frontend
npm run dev

# In another terminal, start your backend
# (replace with your actual backend command)
npm run dev --prefix ../backend
```

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api` in `.env.local`.

### Making API Changes

All API calls use TankStack Query hooks in `/lib/hooks/useApi.ts`. To add new endpoints:

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

### Customizing the UI

All components use ShadCN/UI. Customize colors in `/app/globals.css` by modifying CSS variables:

```css
--primary: oklch(0.5 0.15 260); /* Change blue primary color */
```

## Production Deployment

1. Set environment variables on your hosting platform:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   ```

2. Deploy with your preferred platform (Vercel recommended):
   ```bash
   vercel deploy
   ```

3. Ensure your backend is accessible from your frontend domain (configure CORS if needed)

## Troubleshooting

### "Failed to sign in" error
- Check backend is running and accessible at `NEXT_PUBLIC_API_BASE_URL`
- Verify email/password are correct
- Check backend response matches the required schema

### Token not persisting
- Ensure localStorage is enabled in browser
- Check browser cookies settings if using secure cookies

### API calls failing with 401
- Verify JWT token format in your backend
- Check token expiration time
- Ensure `Authorization: Bearer {token}` header format

## Support & Questions

For issues with the frontend, check the component implementations in `/components` and `/lib`. For backend integration help, ensure your API responses match the specifications above.

---

Built with ❤️ using Next.js 16, TankStack Query, Zustand, and ShadCN/UI.
