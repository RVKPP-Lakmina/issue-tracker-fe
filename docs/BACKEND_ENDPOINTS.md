# Backend API Endpoints Reference

This document outlines all the API endpoints your microservice backend must implement for the Issue Tracker frontend to work correctly.

## Base URL

```
http://your-backend-domain/api
```

Configure this in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Authentication Endpoints

### POST /auth/signin
**Sign in a user**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
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

### POST /auth/signup
**Register a new user**

Request:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### GET /auth/me
**Get current authenticated user**

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

### POST /auth/logout
**Logout user**

Headers:
```
Authorization: Bearer {token}
```

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

---

## Issue Management Endpoints

### GET /issues
**List all issues for the current user**

Headers:
```
Authorization: Bearer {token}
```

Query Parameters (all optional):
- `search` - Search term for title/description
- `status` - Comma-separated status values (open, in-progress, closed, on-hold)
- `priority` - Priority level (low, medium, high, critical)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)

Response (200):
```json
{
  "data": [
    {
      "id": "issue_1",
      "title": "Bug: Login page crashes",
      "description": "The login page crashes when using special characters in email",
      "status": "open",
      "priority": "high",
      "assignedTo": {
        "id": "user_456",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://example.com/jane.jpg"
      },
      "createdBy": {
        "id": "user_123",
        "name": "John Doe",
        "email": "user@example.com",
        "avatar": "https://example.com/john.jpg"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-16T14:20:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

### POST /issues
**Create a new issue**

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "title": "New Feature Request",
  "description": "Add dark mode support to the application",
  "status": "open",
  "priority": "medium",
  "assignedToId": "user_456"
}
```

Response (201):
```json
{
  "id": "issue_2",
  "title": "New Feature Request",
  "description": "Add dark mode support to the application",
  "status": "open",
  "priority": "medium",
  "assignedTo": {
    "id": "user_456",
    "name": "Jane Smith",
    "email": "jane@example.com"
  },
  "createdBy": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "createdAt": "2024-01-17T09:15:00Z",
  "updatedAt": "2024-01-17T09:15:00Z"
}
```

### PUT /issues/:id
**Update an issue**

Headers:
```
Authorization: Bearer {token}
```

URL Parameters:
- `id` - Issue ID

Request (any field is optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high",
  "assignedToId": "user_789"
}
```

Response (200):
```json
{
  "id": "issue_1",
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "high",
  "assignedTo": {
    "id": "user_789",
    "name": "Bob Johnson",
    "email": "bob@example.com"
  },
  "createdBy": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-17T10:00:00Z"
}
```

### DELETE /issues/:id
**Delete an issue**

Headers:
```
Authorization: Bearer {token}
```

URL Parameters:
- `id` - Issue ID

Response (204 No Content):
```
(empty response body)
```

---

## Status Values

- `open` - Issue is open and needs attention
- `in-progress` - Someone is actively working on the issue
- `closed` - Issue has been resolved
- `on-hold` - Issue is temporarily paused

## Priority Values

- `low` - Low priority, can be done later
- `medium` - Medium priority, should be done soon
- `high` - High priority, should be done ASAP
- `critical` - Critical priority, needs immediate attention

## Error Responses

All endpoints should return appropriate HTTP status codes:

- `400 Bad Request` - Invalid input
  ```json
  {
    "message": "Validation error: email is required"
  }
  ```

- `401 Unauthorized` - Invalid or missing token
  ```json
  {
    "message": "Invalid token"
  }
  ```

- `403 Forbidden` - User doesn't have permission
  ```json
  {
    "message": "You do not have permission to access this resource"
  }
  ```

- `404 Not Found` - Resource not found
  ```json
  {
    "message": "Issue not found"
  }
  ```

- `500 Internal Server Error` - Server error
  ```json
  {
    "message": "Internal server error"
  }
  ```

---

## Authentication

All protected endpoints require the `Authorization` header with a valid JWT token:

```
Authorization: Bearer {token}
```

The token should be returned from the signin/signup endpoints and stored by the frontend in localStorage.

## Pagination

List endpoints support pagination via query parameters:
- `page` - Page number (1-indexed, default: 1)
- `pageSize` - Number of items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

## Filtering & Search

List endpoints support filtering via query parameters:
- `search` - Search in title and description
- `status` - Filter by status (comma-separated values)
- `priority` - Filter by priority
- `assignedToId` - Filter by assigned user

Example:
```
GET /issues?search=bug&status=open,in-progress&priority=high&page=1&pageSize=20
```

---

## Implementation Notes

1. **JWT Tokens**: Use a strong secret key and set appropriate expiration time
2. **CORS**: Ensure your backend allows requests from your frontend domain
3. **Password Hashing**: Use bcrypt or similar for password hashing (never store plain passwords)
4. **Data Validation**: Validate all input data on the backend
5. **Timestamps**: Use ISO 8601 format for all dates (e.g., "2024-01-15T10:30:00Z")
6. **User Ownership**: Ensure users can only access their own issues
