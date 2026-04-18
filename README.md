# Genderize API — Stage 1

A TypeScript + Express + Prisma + PostgreSQL backend that integrates with Genderize, Agify, and Nationalize APIs.

## Features Implemented
- POST `/api/profiles` – Create profile with idempotency (same name returns existing record)
- GET `/api/profiles/:id` – Get single profile
- GET `/api/profiles` – Get all profiles with optional filters (`?gender=male&country_id=NG&age_group=adult`) – case-insensitive
- DELETE `/api/profiles/:id` – Delete profile (204 No Content)
- Exact response structure as specified
- Proper error handling (400, 404, 502, etc.)
- UUID v7 IDs
- CORS enabled (`Access-Control-Allow-Origin: *`)
- All timestamps in UTC ISO 8601

## Tech Stack
- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Axios (for external APIs)

## Setup & Run Locally

1. Clone the repo
2. Install dependencies:
   npm install

Set up PostgreSQL database (recommended: Neon.tech or Supabase free tier)
Copy .env.example to .env and update DATABASE_URL

Generate Prisma Client and push schema:
npx prisma generate
npx prisma db push

Start the development server:
npm run dev