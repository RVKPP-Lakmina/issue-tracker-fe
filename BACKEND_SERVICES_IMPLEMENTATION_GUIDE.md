# Backend Services Implementation Guide

This document is updated to match your exact current backend routing structure.

## 1. Root Router Structure

```ts
rootRouter.use("/auth", authRouter);
rootRouter.use("/issues", issuesRouter);
rootRouter.use("/core", coreRouter);
```

You have 3 service domains:

1. `auth`
2. `issues`
3. `core`

## 2. Exact Route Map

## Auth Routes (`/auth`)

```ts
authRouter.post("/signup", validate(signUpSchema), signUpController);
authRouter.post("/signin", validate(signInSchema), signInController);
authRouter.post("/logout", authGuard, logoutController);
authRouter.get("/me", authGuard, meController);
```

Final endpoints:

1. `POST /auth/signup`
2. `POST /auth/signin`
3. `POST /auth/logout`
4. `GET /auth/me`

Behavior:

1. `signup` and `signin` are public.
2. `logout` and `me` require `authGuard`.
3. Validation is enforced before controller execution.

## Issues Routes (`/issues`)

```ts
issuesRouter.get(
  "/",
  authGuard,
  validate(listIssuesSchema),
  listIssuesController,
);
issuesRouter.post(
  "/",
  authGuard,
  validate(createIssueSchema),
  createIssueController,
);
issuesRouter.put(
  "/:id",
  authGuard,
  validate(updateIssueSchema),
  updateIssueController,
);
issuesRouter.delete(
  "/:id",
  authGuard,
  validate(issueIdParamsSchema),
  deleteIssueController,
);
```

Final endpoints:

1. `GET /issues`
2. `POST /issues`
3. `PUT /issues/:id`
4. `DELETE /issues/:id`

Behavior:

1. All issues endpoints require `authGuard`.
2. All endpoints run request validation.
3. `PUT` and `DELETE` require a valid `:id` path param.

### New API Development Under `/issues` (Projects + Spent Time)

Use the same `issuesRouter` to keep all issue-domain features in one service.

```ts
// Projects
issuesRouter.get(
  "/issues/projects",
  authGuard,
  validate(listProjectsSchema),
  listProjectsController,
);
issuesRouter.post(
  "/issues/projects",
  authGuard,
  validate(createProjectSchema),
  createProjectController,
);
issuesRouter.put(
  "/issues/projects/:id",
  authGuard,
  validate(updateProjectSchema),
  updateProjectController,
);

// Spent time
issuesRouter.get(
  "/issues/time-entries",
  authGuard,
  validate(listTimeEntriesSchema),
  listTimeEntriesController,
);
issuesRouter.post(
  "/issues/time-entries",
  authGuard,
  validate(createTimeEntrySchema),
  createTimeEntryController,
);
issuesRouter.get(
  "/issues/time-entries/report.csv",
  authGuard,
  validate(timeEntriesReportSchema),
  exportTimeEntriesCsvController,
);
```

Final new endpoints:

1. `GET /issues/projects`
2. `POST /issues/projects`
3. `PUT /issues/projects/:id`
4. `GET /issues/time-entries`
5. `POST /issues/time-entries`
6. `GET /issues/time-entries/report.csv`

Behavior:

1. All new endpoints require `authGuard`.
2. Use same validation pipeline before controllers.
3. CSV endpoint returns filtered spent-time report for download.

## Core Routes (`/core`)

```ts
coreRouter.get("/users", listUsersController);
```

Final endpoint:

1. `GET /core/users`

Behavior:

1. Current route is open in your snippet (no `authGuard`).
2. If users list should be protected, add `authGuard` explicitly.

## 3. Middleware and Validation Flow

For each protected route the flow is:

1. `authGuard`
2. `validate(schema)`
3. `controller`

General request lifecycle:

1. Router receives request.
2. Guard checks token and user context.
3. Validator checks payload/query/params.
4. Controller executes business logic.
5. Response is returned in API format.

## 4. Controller Responsibilities

## Auth Controllers

### `signUpController`

1. Create user record.
2. Hash password.
3. Return token + user profile.

### `signInController`

1. Validate credentials.
2. Return token + user profile.

### `logoutController`

1. Invalidate session/token if applicable.
2. Return success message.

### `meController`

1. Read user from auth context.
2. Return authenticated user profile.

## Issues Controllers

### `listIssuesController`

1. Accept filters from query based on `listIssuesSchema`.
2. Return paginated issues.

### `createIssueController`

1. Validate create payload.
2. Set `createdBy` from auth context.
3. Persist issue.

### `updateIssueController`

1. Validate `id` and update payload.
2. Update issue fields.
3. Return updated issue.

### `deleteIssueController`

1. Validate `id` path param.
2. Delete or soft-delete record.
3. Return success response.

### `listProjectsController`

1. Accept optional filters from `listProjectsSchema`.
2. Return paginated project list.

### `createProjectController`

1. Validate create payload.
2. Set creator from auth context.
3. Persist and return project.

### `updateProjectController`

1. Validate `id` and update payload.
2. Update project fields, including status.
3. Return updated project.

### `listTimeEntriesController`

1. Accept filters from `listTimeEntriesSchema`.
2. Return paginated spent-time records.

### `createTimeEntryController`

1. Validate time log payload.
2. Set user from auth context (ignore client userId).
3. Persist and return created time entry.

### `exportTimeEntriesCsvController`

1. Apply same filters used by list endpoint.
2. Stream CSV output.
3. Set `Content-Type` and `Content-Disposition` headers.

## Core Controller

### `listUsersController`

1. Return user list for assignee dropdown and user mapping.
2. Support paging/search if needed.

## 5. Suggested Validation Schema Coverage

## `signUpSchema`

1. `name`: required, min length.
2. `email`: required, valid email.
3. `password`: required, min strength.

## `signInSchema`

1. `email`: required, valid email.
2. `password`: required.

## `listIssuesSchema`

1. Optional `search`.
2. Optional `status`.
3. Optional `priority`.
4. Optional `page`, `pageSize`.

## `createIssueSchema`

1. `title`: required.
2. `description`: optional.
3. `status`: enum.
4. `priority`: enum.
5. Optional assignment/project fields if supported in DB.

## `updateIssueSchema`

1. `params.id`: required UUID/string format.
2. Body fields optional but validated by type.

## `issueIdParamsSchema`

1. `params.id`: required UUID/string format.

## `listProjectsSchema`

1. Optional `search`.
2. Optional `status`: `planning | active | on-hold | closed`.
3. Optional `page`, `pageSize`.

## `createProjectSchema`

1. `name`: required.
2. `code`: optional.
3. `description`: optional.
4. `status`: optional enum, default `active`.

## `updateProjectSchema`

1. `params.id`: required UUID/string format.
2. Body fields optional and validated by enum/type.

## `listTimeEntriesSchema`

1. Optional `userId`.
2. Optional `issueId`.
3. Optional `projectId`.
4. Optional `activity` enum.
5. Optional `fromDate`, `toDate`.
6. Optional `page`, `pageSize`.

## `createTimeEntrySchema`

1. `issueId`: required.
2. `date`: required date.
3. `hours`: required, numeric, must be `> 0`.
4. `activity`: required enum.
5. `comment`: required.

## `timeEntriesReportSchema`

1. Same filters as `listTimeEntriesSchema`.
2. Additional export-specific validation if needed.

## 6. Standard Response Shapes

Recommended success shape:

```json
{
  "success": true,
  "message": "optional",
  "data": {}
}
```

Recommended list shape:

```json
{
  "success": true,
  "data": [],
  "total": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
```

Recommended error shape:

```json
{
  "message": "Validation failed",
  "fieldErrors": {
    "field": ["Error message"]
  },
  "formErrors": []
}
```

## 7. Security Notes

1. Keep JWT secret/config consistent across all services using `authGuard`.
2. Never trust client-provided `createdBy` values.
3. Apply role/permission checks inside controllers where needed.
4. If `GET /core/users` should be private, protect it with `authGuard`.
5. Enforce business rule: if project is closed, block new ticket creation under it.
6. Enforce business rule: if parent ticket is closed, block sub-ticket creation.

## 8. Environment Variables

Recommended baseline:

1. `PORT`
2. `DB_URL`
3. `JWT_SECRET`
4. `JWT_EXPIRES_IN`

Optional:

1. `REFRESH_TOKEN_SECRET`
2. `REFRESH_TOKEN_EXPIRES_IN`
3. `CORS_ORIGIN`

## 9. Test Checklist

1. `POST /auth/signup` accepts valid payload and rejects invalid payload.
2. `POST /auth/signin` returns token for valid credentials.
3. `POST /auth/logout` rejects when token missing.
4. `GET /auth/me` returns user for valid token.
5. `GET /issues` requires auth and validates query.
6. `POST /issues` requires auth and validates body.
7. `PUT /issues/:id` requires auth and validates params/body.
8. `DELETE /issues/:id` requires auth and validates id.
9. `GET /core/users` returns expected list format.
10. `GET /issues/projects` requires auth and validates query.
11. `POST /issues/projects` creates project with valid payload.
12. `PUT /issues/projects/:id` updates project and status.
13. `GET /issues/time-entries` returns filtered records.
14. `POST /issues/time-entries` stores valid spent-time log.
15. `GET /issues/time-entries/report.csv` downloads CSV with active filters.
16. Creating issue under closed project returns business-rule error.
17. Creating sub-ticket under closed parent returns business-rule error.

## 10. Current Scope vs Future Extensions

Current documented scope is only the routes you shared:

1. Auth
2. Issue CRUD
3. Core users list
4. Project APIs under `/issues/projects`
5. Spent-time APIs under `/issues/time-entries`

## 11. Request/Response Examples for New APIs

### `POST /issues/projects`

Request:

```json
{
  "name": "Sprint-asith",
  "code": "SPR-ASITH",
  "description": "Release preparation work",
  "status": "active"
}
```

### `POST /issues/time-entries`

Request:

```json
{
  "issueId": "issue_11252",
  "date": "2026-04-19",
  "hours": 2,
  "activity": "implementation",
  "comment": "Prepared PRs and resolved merge conflicts"
}
```

### `GET /issues/time-entries/report.csv`

Sample query:

```txt
/issues/time-entries/report.csv?fromDate=2026-04-01&toDate=2026-04-30&projectId=proj_1
```

Expected response headers:

1. `Content-Type: text/csv`
2. `Content-Disposition: attachment; filename="spent-time-YYYY-MM-DD.csv"`
