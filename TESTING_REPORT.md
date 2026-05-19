# Testing Report — Team Project Management Platform

## Summary

| Category | Tests | Framework |
|----------|-------|-----------|
| Backend | 8 test suites / 11+ cases | Jest + Supertest + mongodb-memory-server |
| Frontend | 3 test suites / 6+ cases | Jest + React Testing Library |

---

## Test Cases

### 1. User Model Validation

| Field | Value |
|-------|--------|
| **Test name** | User model validation test |
| **Test type** | Unit (Model) |
| **What it checks** | Required fields `name`, `email`, `passwordHash`; valid user creation; `passwordHash` excluded from `toJSON` |
| **Expected result** | Validation errors for empty user; valid user saved; no password in JSON |
| **Actual result** | _Run `cd backend && npm test` — paste output here_ |
| **Screenshot** | _Attach Jest passing screenshot_ |

---

### 2. Project Model Validation

| Field | Value |
|-------|--------|
| **Test name** | Project model validation test |
| **Test type** | Unit (Model) |
| **What it checks** | `title` and `owner` required; defaults for `status` and `priority` |
| **Expected result** | Validation fails without title/owner; defaults `planning` / `medium` |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 3. Task Model Validation

| Field | Value |
|-------|--------|
| **Test name** | Task model validation test |
| **Test type** | Unit (Model) |
| **What it checks** | `title`, `project`, `createdBy` required; default status `todo` |
| **Expected result** | Validation errors; task created with `todo` status |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 4. Team Model Validation

| Field | Value |
|-------|--------|
| **Test name** | Team model validation test |
| **Test type** | Unit (Model) |
| **What it checks** | `name` and `owner` required; default `visibility` is `private` |
| **Expected result** | Validation errors; team created as private |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 5. Validators & generateToken Utility

| Field | Value |
|-------|--------|
| **Test name** | Validators and generateToken utility test |
| **Test type** | Unit (Utils) |
| **What it checks** | Email/password/ObjectId validation; JWT contains user id |
| **Expected result** | Validators return correct booleans; JWT decodes with correct `id` |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 6. Auth Routes

| Field | Value |
|-------|--------|
| **Test name** | Auth route handler test |
| **Test type** | Integration (API) |
| **What it checks** | Register, login (401 on wrong password), GET `/api/auth/me` with token |
| **Expected result** | 201 on register; 401 on bad login; 200 on `/me` |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 7. Projects API Integration

| Field | Value |
|-------|--------|
| **Test name** | Projects API integration test |
| **Test type** | Integration (Supertest) |
| **What it checks** | POST create, GET list, GET search with status filter |
| **Expected result** | 201, 200 with array, filtered results |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 8. Tasks API Integration

| Field | Value |
|-------|--------|
| **Test name** | Tasks API integration test |
| **Test type** | Integration (Supertest) |
| **What it checks** | Create task in project, list tasks, search by query |
| **Expected result** | 201, list length ≥ 1, search finds task |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 9. ProjectCard Component

| Field | Value |
|-------|--------|
| **Test name** | ProjectCard component test |
| **Test type** | Component (RTL) |
| **What it checks** | Renders title, status, priority; delete callback |
| **Expected result** | Text visible; `onDelete` called with project id |
| **Actual result** | _Run `cd frontend && npm test`_ |
| **Screenshot** | _Placeholder_ |

---

### 10. TaskCard Component

| Field | Value |
|-------|--------|
| **Test name** | TaskCard component test |
| **Test type** | Component (RTL) |
| **What it checks** | Renders title, status, assignee; `data-testid` present |
| **Expected result** | All text and test id found |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

### 11. LoginForm Component

| Field | Value |
|-------|--------|
| **Test name** | LoginForm render and submit test |
| **Test type** | Component (RTL) |
| **What it checks** | Form fields render; submit calls login and redirects to dashboard |
| **Expected result** | Fields present; `login` + `router.push('/dashboard')` |
| **Actual result** | _Placeholder_ |
| **Screenshot** | _Placeholder_ |

---

## How to Generate Actual Results

```bash
cd backend && npm test
cd frontend && npm test
```

Paste terminal output into **Actual result** fields and attach screenshots of passing Jest runs.
