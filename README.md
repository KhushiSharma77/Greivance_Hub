# Problem Statement

Public governance bodies receive thousands of citizen grievances every day, covering issues such as civic infrastructure, sanitation, public safety, utilities, healthcare, education, and administrative delays. These complaints are typically:

- **Unstructured** (free-text, voice notes, mixed languages)
- **Manually reviewed and routed**
- **Slow to resolve**, leading to backlogs, citizen dissatisfaction, and lack of accountability

The absence of intelligent prioritization and analysis causes critical grievances to be delayed, while authorities struggle to gain actionable insights from large volumes of complaint data.

There is a pressing need for an **AI-powered grievance redressal system** that can intelligently understand, categorize, and prioritize citizen complaints to enable faster, fairer, and more transparent governance.

---

# GrievanceHUB

An AI-driven grievance redressal platform using Natural Language Processing (NLP) and intelligent automation to automatically analyze, classify, prioritize, and route citizen complaints to appropriate departments.

---

# Team Name

**CallOfCode**

---

# 2-Minute Demonstration Video

🎥 *Coming Soon*

---

# PPT Link

📊 [PPT](https://drive.google.com/file/d/1-NxC65gvIRDQNBoWMKHW2jdRmZmQ4YWY/view?usp=sharing)

---

## 📋 Project Overview

**GrievanceHUB** is a comprehensive grievance management platform designed to revolutionize how citizens in India report and track grievances with government departments and public sector services. The platform combines intelligent AI-powered analysis with a user-friendly interface to create a transparent, efficient, and accountable grievance redressal system.

### Key Objectives

- **Automatically analyze and classify** citizen complaints using NLP
- **Prioritize grievances** based on urgency, severity, and impact
- **Route complaints** to the appropriate department or authority
- **Assist government bodies** in resolving issues efficiently and transparently

### Core Capabilities

#### 🧑‍💼 For Citizens
- **Simple Grievance Submission**: Submit complaints through free-text input with optional image or voice attachments
- **Multilingual Support**: Automatic language translation for regional languages
- **Real-time Tracking**: Monitor the status and progress of your grievances
- **Unified Interface**: Single platform for all types of grievances

#### 👨‍💼 For Officers
- **Role-based Dashboards**: Access department-specific grievances and analytics
- **Priority Insights**: View grievance inflow, priority distribution, and severity scores
- **Explainable AI**: Understand AI-driven prioritization decisions
- **Efficient Management**: Streamlined workflow for grievance resolution

#### 👑 For Admins
- **Department Management**: Create and manage multiple departments
- **Officer Assignment**: Assign officers to specific departments
- **System Analytics**: Comprehensive insights across all departments
- **Authorization Control**: Manage user roles and permissions

---

## 🤖 AI-Powered Features

### Intelligent Grievance Understanding (NLP Engine)

The system leverages Google's Gemini API for advanced NLP capabilities:

- **Text Normalization**: Cleans and normalizes noisy user input
- **Language Detection**: Automatically detects and translates regional languages
- **Smart Classification**: Categorizes grievances (water, roads, healthcare, etc.)
- **Entity Extraction**: Identifies key details such as location and duration
- **Sentiment Analysis**: Detects distress and urgency indicators

### Priority Scoring System

Each grievance receives an intelligent priority score based on:

- **Duration of Issue**: How long the problem has persisted
- **Affected Citizens**: Number of people impacted (duplicate detection)
- **Distress Indicators**: Sentiment analysis and urgency signals

### Event-Driven Architecture

- **Asynchronous Processing**: BullMQ + Redis for scalable background jobs
- **Independent Workers**: Separate workers for NLP analysis, duplicate detection, and routing
- **Fault Tolerance**: Built-in retry mechanisms and failure isolation

---

## 🛠️ Technical Stack

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

🌐 Landing Page
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-30-39.png" width="800" /> </p>
👤 Citizen Dashboard
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-31-29.png" width="400" /> <img src="Screenshots/screenshot-2026-01-04_13-31-46.png" width="400" /> </p>
🧑‍💼 Officer Dashboard
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-32-11.png" width="800" /> </p>
🛠️ Admin Dashboard
<p align="center"> <img src="Screenshots/screenshot-2026-01-04_13-34-06.png" width="400" /> <img src="Screenshots/screenshot-2026-01-04_13-34-17.png" width="400" /> </p>

## 🚀 Setup and Installation

### Prerequisites

- Node.js 20+ or Bun runtime
- PostgreSQL 15+
- Redis (for queue management)
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
   ```

   **`apps/web/.env.local`**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   API_BASE_URL="http://localhost:3001"
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

## 💡 Usage Instructions

### For Citizens

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Submit Grievance**: 
   - Fill out the grievance form with details
   - Optionally attach images or voice notes or video-recordings
   - Submit the complaint
3. **Track Status**: Monitor your grievance progress in real-time
4. **View Updates**: Receive notifications on status changes

### For Officers

1. **Login**: Access the officer dashboard with your credentials
2. **View Assigned Grievances**: See all grievances assigned to your department
3. **Review Priority**: Check AI-generated priority scores and classifications
4. **Take Action**: Update grievance status and add resolution notes
5. **Analytics**: View department performance metrics

### For Admins

1. **Login**: Access the admin panel
2. **Manage Departments**: Create new departments and configure settings
3. **Assign Officers**: Add officers and assign them to specific departments
4. **Monitor System**: View system-wide analytics and insights
5. **User Management**: Manage user roles and permissions

---

## 📁 Project Structure

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
