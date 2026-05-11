# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack real estate management app with a craftsperson coordination module. French-language, mobile-first. Dual-role: property owners (landlords) and artisans (craftspeople).

- **Backend**: Django 5 REST API (`backend/`)
- **Frontend**: React Native + Expo with file-based routing (`frontend/`)

## Commands

### Backend (`backend/`)

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver          # starts on port 8000
python manage.py createsuperuser
```

API docs: `http://localhost:8000/api/docs/` (Swagger)

### Frontend (`frontend/`)

```bash
npm install
npm start                           # Expo dev server
npm run android / ios / web         # platform targets
npm run lint
```

The API base URL is hardcoded in `src/services/api.ts` as `http://192.168.1.136:8000` — update this to match your local network IP.

## Architecture

### Backend Django apps

| App | Purpose |
|-----|---------|
| `accounts` | Custom User model (`display_name`, `bio`) |
| `core` | Request/Message models for internal messaging |
| `properties` | Property listings, metadata, document uploads |
| `work_request` | WorkRequest, ArtisanProfile, WorkOffer, WorkIntervention, WorkMessage |
| `reviews` | Ratings/reviews between users |

Auth: JWT via `djangorestframework_simplejwt`. Routes: `POST /api/auth/token/` and `/api/auth/refresh/`.

Real-time: Django Channels (WebSocket) is installed but setup is preliminary.

### Frontend structure

```
frontend/
  app/                    # Expo Router file-based routes
    (owner)/              # Owner/landlord tab screens
    add-property/         # 7-step wizard (multi-screen flow)
    artisan/              # Artisan interface
    profile/              # User profile
  src/
    components/           # Reusable UI components
    screens/              # Screen containers
    services/             # api.ts (axios), auth, OCR
    context/              # AppModeContext, AddPropertyContext
    theme/                # Design tokens
```

### State & data flow

- **Zustand** for global app state
- **React Hook Form** for all forms
- **AppModeContext** switches between owner and artisan roles at runtime
- **AddPropertyContext** carries multi-step wizard state across the 7 `add-property/` screens

### Theme

Purple brand: `#9471C1`. Dark mode first. Design tokens in `src/theme/index.ts`.
