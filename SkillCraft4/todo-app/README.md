# To-Do Web App — Task 04

Full-stack to-do app: Spring Boot REST API (backend/) + React with Vite (frontend/).

## What it does
- Add tasks with a title, optional description, due date, and due time
- Organize tasks into named lists (or leave them "Unsorted")
- Mark tasks complete/incomplete
- Edit any task in place
- Delete tasks and lists

## Backend — Spring Boot

Requires Java 17+ and Maven (or use the included `mvnw` if you generate one via Spring Initializr — this project assumes you have `mvn` on your PATH).

```
cd backend
mvn spring-boot:run
```

This starts the API on **http://localhost:8080**. It uses an in-memory H2 database,
so all data resets when you stop the server — that's expected for now. You can
browse the database directly at http://localhost:8080/h2-console
(JDBC URL: `jdbc:h2:mem:tododb`, username: `sa`, no password).

### API endpoints
| Method | Path                  | Purpose                          |
|--------|------------------------|----------------------------------|
| GET    | /api/lists             | Get all lists                    |
| POST   | /api/lists              | Create a list `{ "name": "..." }`|
| PUT    | /api/lists/{id}         | Rename a list                    |
| DELETE | /api/lists/{id}         | Delete a list                    |
| GET    | /api/tasks              | Get all tasks                    |
| GET    | /api/tasks?listId={id}  | Get tasks in one list            |
| GET    | /api/tasks?listId=none  | Get unsorted tasks               |
| POST   | /api/tasks               | Create a task                    |
| PUT    | /api/tasks/{id}          | Edit a task                      |
| PATCH  | /api/tasks/{id}/toggle   | Toggle completed                 |
| DELETE | /api/tasks/{id}          | Delete a task                    |

## Frontend — React (Vite)

If you don't already have a Vite React project scaffolded, create one first (same
as you did for the tic-tac-toe task):

```
npm create vite@latest todo-frontend -- --template react
cd todo-frontend
npm install
```

Then copy everything from this project's `frontend/src/` folder into your new
project's `src/` folder, overwriting `App.jsx` and `main.jsx`. Delete the default
`App.css`/`index.css` if you don't need them, since `App.css` here already
covers all the styling.

Run it:

```
npm run dev
```

Open **http://localhost:5173**. Make sure the backend is running first — the
frontend calls `http://localhost:8080/api` directly.

## Notes
- CORS is already configured on the backend to allow requests from
  `http://localhost:5173` (Vite's default port). If your frontend runs on a
  different port, update `CorsConfig.java`.
- To swap H2 for a real PostgreSQL database later (recommended before treating
  this as a portfolio piece), you'd only need to change the `spring.datasource.*`
  properties in `application.properties` and add the PostgreSQL driver dependency
  to `pom.xml` — the entity/repository/service/controller code stays the same.
