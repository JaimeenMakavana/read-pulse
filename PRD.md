# Project Name: ReadPulse (Backend)

## 1. Project Overview

ReadPulse is a "Bio-Rhythm" reading tracker backend. Unlike standard trackers that only log "Books Read", ReadPulse logs individual **Reading Sessions** to calculate granular analytics like reading speed (pages/hour) based on the time of day and "Reading Velocity" predictions.

**Phase 1 Goal:** Build the core backend infrastructure to manage Users, Books, and Reading Sessions with strict data validation and automatic metric calculation.

## 2. Tech Stack & Standards

- **Runtime:** Node.js v20+ (LTS)
- **Framework:** Fastify v5 (Latest)
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL (Local Docker or Native)
- **ORM:** Prisma
- **Validation:** Zod (via `fastify-type-provider-zod`)
- **Architecture:** Controller-Service-Repository Pattern
- **Documentation:** Swagger / OpenAPI (via `@fastify/swagger`)

## 3. Core Features (Phase 1)

### 3.1 Authentication (MVP)

- Simple Email/Password signup and login.
- Use `bcrypt` for password hashing.
- Issue JWT tokens for session management (`@fastify/jwt`).
- **Critical:** Store User Timezone (default 'Asia/Kolkata') during signup.

### 3.2 Book Management (The Inventory)

- **Create Book:** Input Title, Author, Total Pages, ISBN (optional).
- **Status:** Enum (`READING`, `COMPLETED`, `PAUSED`, `DROPPED`, `WISHLIST`).
- **Validation:** `total_pages` must be > 0.

### 3.3 Session Logger (The Core Innovation)

- **Input:** User provides `bookId`, `startPage`, `endPage`, `startTime`, `endTime`.
- **Auto-Calculation (Business Logic):**
  - The backend MUST calculate `pagesRead = endPage - startPage`.
  - The backend MUST calculate `durationSeconds = endTime - startTime`.
- **Validation Rules:**
  - `endPage` must be > `startPage`.
  - `endTime` must be > `startTime`.
  - `endPage` cannot exceed `Book.totalPages`.

## 4. Database Schema (Prisma)

Use this exact schema for Phase 1.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum BookStatus {
  READING
  COMPLETED
  PAUSED
  DROPPED
  WISHLIST
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  timezone      String   @default("Asia/Kolkata")
  createdAt     DateTime @default(now())
  books         Book[]
}

model Book {
  id          String   @id @default(uuid())
  title       String
  author      String
  totalPages  Int
  status      BookStatus @default(READING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  sessions    ReadingSession[]

  @@index([userId])
}

model ReadingSession {
  id              String   @id @default(uuid())
  startTime       DateTime
  endTime         DateTime
  startPage       Int
  endPage         Int
  durationSeconds Int      // Calculated field
  pagesRead       Int      // Calculated field
  bookId          String
  book            Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)
  createdAt       DateTime @default(now())

  @@index([bookId, startTime])
}

5. API Endpoint Specifications
All endpoints must follow strict Zod Schema validation.

POST /api/v1/sessions
Description: Log a new reading session.

Request Body (Zod):

TypeScript

{
  bookId: string (UUID),
  startPage: number,
  endPage: number,
  startTime: string (ISO Date),
  endTime: string (ISO Date)
}
Response:

JSON

{
  "id": "uuid",
  "pagesRead": 25,
  "durationSeconds": 3600,
  "speed": "25 pages/hour" // Optional derived field
}
6. Folder Structure (Strict)

readpulse-backend/
├── .env                    # Environment variables (DB_URL, JWT_SECRET, PORT)
├── .gitignore
├── package.json
├── tsconfig.json           # TypeScript configuration (Strict mode)
├── PRD.md                  # Your Product Requirements Document
│
├── prisma/
│   ├── schema.prisma       # Database Schema (Users, Books, Sessions)
│   └── migrations/         # SQL migration history files (Auto-generated)
│
├── src/
│   │
│   ├── config/             # Configuration & Environment setup
│   │   └── env.ts          # Zod-validated env variables (Fail fast if keys missing)
│   │
│   ├── plugins/            # Fastify ecosystem plugins
│   │   ├── prisma.ts       # Database connection instance (Singleton)
│   │   └── swagger.ts      # API Documentation setup
│   │
│   ├── modules/            # Grouping by FEATURE (Recommended for Senior Devs)
│   │   │
│   │   ├── sessions/       # Feature: Reading Sessions
│   │   │   ├── session.controller.ts  # Handles HTTP Request/Response
│   │   │   ├── session.service.ts     # Business Logic (Auto-calc duration/pages)
│   │   │   ├── session.schema.ts      # Zod Validation Schemas
│   │   │   └── session.routes.ts      # URL definitions (POST /sessions)
│   │   │
│   │   ├── books/          # Feature: Book Inventory
│   │   │   ├── book.controller.ts
│   │   │   ├── book.service.ts
│   │   │   ├── book.schema.ts
│   │   │   └── book.routes.ts
│   │   │
│   │   └── analytics/      # Feature: Bio-Rhythm Stats
│   │       ├── analytics.controller.ts
│   │       ├── analytics.service.ts   # Complex SQL/Raw Queries for Bio-Rhythm
│   │       └── analytics.routes.ts
│   │
│   ├── shared/             # Reusable utilities across modules
│   │   ├── errors.ts       # Custom Error Classes (AppError, NotFoundError)
│   │   └── utils.ts        # Helper functions (e.g., Date formatters)
│   │
│   ├── app.ts              # App Factory (Registers plugins & routes)
│   └── server.ts           # Entry Point (Starts the server)
│
└── tests/                  # Integration & Unit Tests
    ├── integration/
    │   └── session.test.ts # "POST /sessions" test
    └── unit/
        └── calculator.test.ts

```
