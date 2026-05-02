# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arshaad** is a full-stack career guidance platform helping students discover learning paths, track progress, find mentorship, and explore job opportunities.

- **Backend**: Django 4+ with Django REST Framework, PostgreSQL, JWT + OAuth2 authentication
- **Frontend**: React 18 + TypeScript + Vite + Redux Toolkit + Tailwind CSS

---

## Commands

### Backend (run from `Backend/`)

```bash
# Start development server
python manage.py runserver

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Run tests
pytest

# Run a single test file
pytest apps/<app>/tests/test_<name>.py

# Create superuser
python manage.py createsuperuser
```

Settings module: `arshaad.settings.dev` (development) or `arshaad.settings.prod` (production).

### Frontend (run from `Frontend/@front/`)

```bash
npm run dev          # Start dev server on localhost:5173
npm run build        # Type-check + production build
npm run lint         # ESLint
npm run typecheck    # TypeScript validation (no emit)
npm run test         # Jest tests
npm run test:coverage # Jest with coverage report
```

---

## Architecture

### Backend

All feature logic lives in `Backend/apps/`, with a separate Django app per domain:

- `users/` — Custom User model (extends `AbstractUser`), `UserSession`, `AuthToken`
- `api/` — Auth views (register, login, token refresh, password reset, OAuth callbacks), onboarding
- `roadmaps/` — Learning paths: `Roadmap`, `RoadmapStage`, `Resource`; service layer in `services/roadmap_service.py`
- `assessments/` — AI-backed recommendation engine in `services.py`; models: `Assessment`, `Recommendation`
- `progress/` — Gamification: `Progress`, `StudySession`, `Achievement`, `LearningStreak`
- `mentorship/` — `Mentor`, `MentoringSession`, `StudyGroup`
- `jobs/` — `Job`, `JobApplication`, `MarketAnalytics`
- `events/` — `Event`, `EventAttendee`
- `notifications/` — Multi-channel: `Notification`, `PushToken`
- `discounts/` — `Discount`, `UserDiscountUsage`
- `ai/` — Shared AI/ML inference services

**Patterns:**
- Business logic goes in `services.py` within each app (never directly in views)
- DRF `ViewSets` with automatic routing via `DefaultRouter`
- JWT access + refresh tokens; frontend sends `Authorization: Bearer <token>`
- Settings are split: `settings/base.py` → `dev.py` / `prod.py`

All API routes are namespaced under `/api/`. See `arshaad/urls.py` for top-level routing and each app's `urls.py` for sub-routes.

### Frontend

Located at `Frontend/@front/src/`:

- `App.tsx` — Root router: public routes + protected routes (guarded by Redux `isAuthenticated`)
- `pages/` — Route-level components: `Landing`, `Auth/` (Login, Register, OAuthCallback), `Onboarding/`, `Dashboard/`
- `components/` — Atomic design: `atoms/` (Button, Input), `molecules/` (composite, mostly empty), `organisms/` (GoogleLogin)
- `services/api/` — All backend calls abstracted here (auth.ts, assessments.ts, oauth.ts)
- `store/slices/authSlice.ts` — Redux auth state (user, tokens, `isAuthenticated`)
- `types/` — Shared TypeScript interfaces (`auth.ts`, `assessment.ts`)

**Patterns:**
- Use `@/` path alias for all `src/` imports (configured in `tsconfig.json` and `vite.config.ts`)
- Vite dev proxy forwards `/api/*` to `http://localhost:8000` — no CORS issues in development
- New API calls belong in `services/api/`, not inline in components
- New UI state belongs in a Redux slice in `store/slices/`
