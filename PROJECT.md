# Daniel's Quest Hub - Family Todo Tracker

## 🎮 Project Overview

A gaming-themed family todo application designed specifically for Daniel (13) and his family (Jeremie, Rachel). The app allows family members to create, assign, and track tasks with a cool gaming aesthetic that appeals to a teenage gamer.

## 👥 Users
- **Daniel** (13) - Primary user, gamer, loves cyan color
- **Jeremie** (Dad) - Task creator and manager
- **Rachel** (Mom) - Task creator and manager

## ✨ Core Features

### 🎯 Task Management
- Create tasks with due dates
- Assign tasks to Daniel
- Mark tasks as complete (with XP rewards system)
- Task categories (School, Health, Chores, Personal)
- Priority levels (Low, Medium, High, Critical)

### 🔄 Recurring Tasks
- Daily tasks (e.g., "Take iron pills")
- Weekly tasks (e.g., "Clean room")
- Custom recurring patterns
- Automatic task generation

### 🎮 Gaming Elements
- XP system for completed tasks
- Achievement badges
- Quest-style task descriptions
- Progress bars and stats
- Cyan color scheme throughout

### 📅 Google Calendar Integration
- Optional sync with Daniel's Google Calendar
- Two-way sync for due dates and reminders
- Calendar events for important tasks

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom cyan theme
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form handling
- **Zustand** - State management

### Backend & Database
- **Next.js API Routes** - Backend endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Database (via Vercel Postgres)
- **NextAuth.js** - Authentication

### External APIs
- **Google Calendar API** - Calendar integration
- **Vercel** - Deployment platform

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks

## 🗄 Database Schema

### Users Table
```sql
- id (uuid, primary key)
- name (string)
- email (string, unique)
- role (enum: 'parent', 'child')
- avatar_url (string, optional)
- xp_points (integer, default: 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### Tasks Table
```sql
- id (uuid, primary key)
- title (string)
- description (text, optional)
- assigned_to (uuid, foreign key to users.id)
- created_by (uuid, foreign key to users.id)
- due_date (timestamp, optional)
- completed_at (timestamp, optional)
- priority ('low', 'medium', 'high', 'critical')
- category ('school', 'health', 'chores', 'personal')
- xp_reward (integer, default: 10)
- is_recurring (boolean, default: false)
- recurring_pattern (json, optional)
- google_calendar_event_id (string, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

### Achievements Table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to users.id)
- title (string)
- description (text)
- icon (string)
- unlocked_at (timestamp)
- xp_earned (integer)
```

## 🎨 Design System

### Color Palette (Cyan Gaming Theme)
- **Primary Cyan**: #00FFFF
- **Dark Cyan**: #008B8B
- **Light Cyan**: #E0FFFF
- **Accent Blue**: #1E90FF
- **Dark Background**: #0A0A0A
- **Card Background**: #1A1A1A
- **Text Primary**: #FFFFFF
- **Text Secondary**: #CCCCCC

### Typography
- **Headings**: Space Grotesk (futuristic feel)
- **Body**: Inter (readable)
- **Monospace**: JetBrains Mono (code/gaming aesthetic)

### UI Components
- Neon glowing buttons
- Card-based layout with subtle shadows
- Progress bars with cyan gradients
- Gaming-style icons and badges
- Smooth hover animations
- Mobile-first responsive design

## 📁 Project Structure

```
daniel-quest-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── tasks/             # Task management pages
│   │   └── profile/           # User profile
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Basic UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Authentication config
│   │   ├── db.ts             # Database connection
│   │   └── google-calendar.ts # Google Calendar API
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Global styles
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
├── docs/                     # Documentation
└── PROJECT.md               # This file
```

## 🚀 Development Phases

### Phase 1: Foundation
1. Set up Next.js project with TypeScript
2. Configure Tailwind CSS with custom theme
3. Set up Prisma with PostgreSQL
4. Implement basic authentication
5. Create core UI components

### Phase 2: Core Functionality
1. Build task CRUD operations
2. Implement user roles and permissions
3. Create dashboard interface
4. Add task assignment functionality
5. Build mobile-responsive UI

### Phase 3: Gaming Features
1. Implement XP system
2. Create achievement system
3. Add progress tracking
4. Build gaming-style animations
5. Create user profiles with stats

### Phase 4: Advanced Features
1. Add recurring task functionality
2. Implement Google Calendar integration
3. Add notifications and reminders
4. Create task statistics and analytics
5. Add data export features

### Phase 5: Polish & Deploy
1. Performance optimization
2. Comprehensive testing
3. Documentation completion
4. Vercel deployment
5. User acceptance testing

## 🎯 Success Metrics

- Daily active usage by Daniel
- Task completion rate improvement
- Family engagement with the platform
- Positive user feedback
- Successful Google Calendar sync

## 🔧 Development Setup

```bash
# Clone and setup
git clone [repository]
cd daniel-quest-hub
npm install

# Environment setup
cp .env.example .env.local
# Add your environment variables

# Database setup
npx prisma migrate dev
npx prisma generate

# Development server
npm run dev
```

## 🚀 Deployment

- **Platform**: Vercel
- **Database**: Vercel Postgres
- **Domain**: Custom domain (if desired)
- **Environment**: Production environment variables

---

*Last Updated: August 11, 2025*
*Created by: Claude for the Rykner Family*