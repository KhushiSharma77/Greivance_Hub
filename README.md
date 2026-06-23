# Problem Statement

Public governance bodies receive thousands of citizen grievances every day, covering issues such as civic infrastructure, sanitation, public safety, utilities, healthcare, education, and administrative delays. These complaints are typically:

- **Unstructured** (free-text, voice notes, mixed languages)
- **Manually reviewed and routed**
- **Slow to resolve**, leading to backlogs, citizen dissatisfaction, and lack of accountability

The absence of intelligent prioritization and analysis causes critical grievances to be delayed, while authorities struggle to gain actionable insights from large volumes of complaint data.

There is a pressing need for an **AI-powered grievance redressal system** that can intelligently understand, categorize, and prioritize citizen complaints to enable faster, fairer, and more transparent governance.

---

# GrievanceHUB 


**AI-Powered Public Governance & Grievance Redressal**

GrievanceHUB is an intelligent automation platform designed to bridge the gap between citizens and public governance. By leveraging LLMs (Google Gemini) and an event-driven architecture, we transform unstructured citizen complaints into actionable, prioritized, and routed tasks for government officials.

---

## The Workflow: Lifecycle of a Grievance

Understanding how a complaint moves from a citizen's phone to an officer's dashboard is core to GrievanceHUB.

### 1. Submission Phase (Citizen)

- **Input**: Citizens submit grievances via text, voice notes, or images.
- **Multilingual Processing**: The system accepts input in regional languages.
- **Immediate Feedback**: Users receive a tracking ID and an initial "Processing" status.

### 2. Intelligent Processing Phase (AI Engine)

Once submitted, the grievance enters a high-speed asynchronous pipeline powered by **BullMQ** and **Google Gemini**:

- **Translation & Normalization**: Non-English text is translated; slang or "noisy" text is cleaned for analysis.
- **Categorization**: AI identifies the department (e.g., Sanitation, Road Works, Utilities).
- **Entity Extraction**: Automatically pulls locations, dates, and specific landmarks from the text.
- **Priority Scoring**:
  - **Severity**: High-risk issues (e.g., "Live wire on street") are flagged immediately.
  - **Sentiment**: Distress levels are measured to identify urgent citizen needs.
  - **Impact**: Detects if the issue affects a single person or a whole community.

### 3. Routing & Assignment Phase (System)

- **Smart Routing**: Based on the category, the grievance is pushed to the specific **Officer Dashboard** for that department.
- **Duplicate Detection**: The system checks for similar complaints in the same location to group them, preventing redundant work.

### 4. Resolution & Accountability Phase (Officer/Admin)

- **Officer Action**: Officers view their queue ordered by AI-priority. They can update status (In-Progress, Resolved, Rejected).
- **Explainable AI**: Officers can see *why* a grievance was marked high priority (e.g., "High distress detected + potential public safety hazard").
- **Citizen Tracking**: Citizens receive real-time updates as the status changes.

## AI Engine Deep-Dive

We use **Google Gemini-2.5-Flash** as our primary reasoning engine. Unlike simple keyword matching, our NLP pipeline performs complex cognitive tasks:

| **Feature**           | **Logic**                                                    |
| --------------------- | ------------------------------------------------------------ |
| **Semantic Routing**  | Maps "The drain is overflowing" to *Sanitation* and "Street lights are off" to *Electricity*. |
| **Urgency Detection** | Differentiates between a "Planned outage" (Medium) and "Explosion in transformer" (Critical). |
| **Summarization**     | Converts long, rambling complaints into 1-sentence "Subject Lines" for quick officer review. |
| **Distress Analysis** | Uses sentiment analysis to prioritize citizens who are in immediate danger or extreme frustration. |

## Technical Architecture

```mermaid
graph TD
    A[Citizen UI - Next.js] -->|Submit| B[Express API]
    B -->|Store Raw Data| C[(PostgreSQL)]
    B -->|Add to Queue| D[Redis / BullMQ]
    D -->|Worker Process| E[Gemini AI Engine]
    E -->|Analyze & Score| D
    D -->|Update Result| C
    C -->|Push Update| F[Officer Dashboard]
    C -->|Push Update| A
```

---

## Technical Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS

### Backend (`apps/server`)
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Authentication**: JWT-based
- **Storage**: Supabase Storage
- **Queue System**: Redis + BullMQ
- **AI Integration**: Google Gemini API

### Infrastructure
- **Monorepo**: Turborepo for optimized builds
- **Package Manager**: Bun
- **Logging**: Pino for structured logging
- **Validation**: Zod schemas (shared between frontend and backend)

---

 Landing Page
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-30-39.png" width="800" /> </p>
 Citizen Dashboard
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-31-29.png" width="400" /> <img src="Screenshots/screenshot-2026-01-04_13-31-46.png" width="400" /> </p>
 Officer Dashboard
<p align="center"> <img src="Screenshots/officer.png" width="400" /> <img src="Screenshots/officer1.png" width="400" /> </p>
 <b>Admin Dashboard</b>
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-34-06.png" width="400" /> <img src="Screenshots/screenshot-2026-01-04_13-34-17.png" width="400" /> </p>

## Setup and Installation

### Prerequisites

- Node.js 20+ or Bun runtime
- PostgreSQL 15+
- Redis (local reids setup) (for queue management)
- Supabase account (for storage)
- Google Gemini API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/GFGBQ-Team-call-of-code.git
   cd GFGBQ-Team-call-of-code
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**

   Create `.env` files in the following locations:

   **`apps/server/.env`**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/grievancehub"
   JWT_SECRET="your-jwt-secret"
   REDIS_URL="redis://localhost:6379"
   GEMINI_API_KEY="your-gemini-api-key"
   SUPABASE_URL="your-supabase-url"
   PORT=3000
   SUPABASE_SERVICE_ROLE_KEY=""
   NODE_ENV='development'
   CORS_ORIGIN='http://localhost:3001'
   ```

   **`apps/web/.env.local`**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   bun run db:push
   ```

5. **Start the development servers**
   ```bash
   bun run dev
   ```

   This will start:
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend API: [http://localhost:3000](http://localhost:3000)

6. **Start the background workers**
   ```bash
   cd apps/server/src/worker
   bun run index.ts
   ```

---

## Project Structure

```
GFGBQ-Team-call-of-code/
├── apps/
│   ├── web/                    # Frontend application (Next.js)
│   │   ├── src/
│   │   │   ├── app/           # Next.js app directory
│   │   │   │   ├── (auth)/    # Authentication routes
│   │   │   │   ├── (platform)/ # Platform routes
│   │   │   │   │   ├── admin/
│   │   │   │   │   ├── officer/
│   │   │   │   │   └── grievances/
│   │   │   │   └── globals.css
│   │   │   ├── components/     # React components
│   │   │   ├── lib/           # Utilities and hooks
│   │   │   └── types/         # TypeScript types
│   │   └── public/
│   │
│   └── server/                # Backend application (Express)
│       ├── src/
│       │   ├── controllers/   # Request handlers
│       │   ├── services/      # Business logic
│       │   ├── routes/        # API routes
│       │   ├── middleware/    # Express middleware
│       │   ├── lib/          # Core utilities
│       │   ├── worker/       # Background workers
│       │   │   ├── queues/
│       │   │   ├── workers/
│       │   │   ├── processors/
│       │   │   ├── services/
│       │   │   └── prompts/
│       │   └── index.ts
│       └── tsconfig.json
│
├── packages/
│   ├── api/         # API layer / business logic
```




## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
