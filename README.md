# Campaign Scheduler Demo

A demo project showcasing a full-stack campaign scheduler with authentication, scheduling, and background processing. The stack includes FastAPI, MySQL, Redis, Celery, and a Next.js (React + TypeScript) frontend. Everything runs through Docker Compose for an easy, one-command spin-up that is perfect for walkthroughs or Loom demos.

## Features
- User registration and login with JWT-based authentication.
- Create, list, and view email-style campaigns.
- Schedule campaigns for future execution via a Celery worker and Redis queue.
- Worker simulates campaign execution and updates status (scheduled -> running -> success/failed).
- Frontend dashboard with Tailwind styling that shows campaign statuses in real time (auto-refresh every 5s).
- Swagger API docs at `http://localhost:8000/docs`.

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, Alembic, Celery, Redis
- **Database:** MySQL 8
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Axios
- **Authentication:** JWT tokens issued via `python-jose`, passwords hashed with bcrypt
- **Containerization:** Docker & docker-compose

## Project Structure
```
backend/
  app/
    api/         # FastAPI route handlers
    core/        # Settings + configuration
    db/          # Session and base model helpers
    models/      # SQLAlchemy models
    schemas/     # Pydantic schemas
    services/    # Auth helpers
    tasks/       # Celery app and task definitions
    main.py      # FastAPI entrypoint
  alembic/       # Alembic migration scripts
  requirements.txt
  Dockerfile
  start.sh       # Runs migrations + uvicorn
  worker.sh      # Runs migrations + Celery worker
frontend/
  components/    # Reusable UI components
  hooks/         # React hooks (auth)
  lib/           # Axios client helper
  pages/         # Next.js routes (/login, /register, /dashboard)
  Dockerfile
  package.json
```

## Prerequisites
- Docker + Docker Compose installed
- No other services bound to ports `3000`, `8000`, `6379`, or `3306`

## Quick Start
1. **Clone this repository** (or copy the files into your project root).
2. **Boot the stack:**
   ```bash
   docker-compose up --build
   ```
3. Wait for the containers to finish installing dependencies and applying migrations. The relevant endpoints:
   - Backend API: http://localhost:8000
   - Swagger docs: http://localhost:8000/docs
   - Next.js frontend: http://localhost:3000
4. **Demo flow:**
   - Register a new account at `http://localhost:3000/register`
   - Log in and visit the dashboard
   - Schedule a campaign for a time a few minutes in the future
   - Watch the dashboard auto-refresh and show the campaign status as the Celery worker processes it

## Environment Configuration
- `backend/.env` provides default values for local development (MySQL, Redis, JWT settings). Update as needed.
- `frontend/.env.local` exposes `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`).
- Alembic uses `backend/alembic.ini` and the migration in `backend/alembic/versions/` to manage schema.

## Useful Commands
- Rebuild a single service: `docker-compose build backend`
- Inspect backend logs: `docker-compose logs -f backend`
- Run Alembic migration manually inside the backend container:
  ```bash
  docker-compose run --rm backend alembic upgrade head
  ```
- Launch only worker logs: `docker-compose logs -f worker`

## Development Notes
- The backend mounts the local `backend/` folder, so edits reload automatically via Uvicorn's `--reload` flag.
- The Celery worker also mounts local code for instant task updates.
- The frontend runs `npm run dev`, enabling hot-reloads for React components.

Enjoy the demo!
