# Portfolio Builder

Portfolio Builder is a full-stack Next.js app for creating and publishing personal portfolio sites.

## Current Status

- ✅ Phase 2 complete: authentication, user roles, and route protection.
- ✅ Phase 3 data layer present: Prisma schema, migration, seed data, and query helpers.

## Tech Stack

- Next.js (App Router) + TypeScript
- Prisma ORM + PostgreSQL
- Auth.js (NextAuth)
- Tailwind CSS
- Zod

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Run migration:
   ```bash
   npx prisma migrate dev
   ```
4. Seed starter data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Environment Variables

Required values are listed in `.env.example`.
