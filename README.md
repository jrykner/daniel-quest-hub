# 🎮 Daniel's Quest Hub

> **A Gaming-Themed Family Todo Tracker**

Transform everyday tasks into epic quests! Daniel's Quest Hub is a modern, gaming-inspired task management application designed specifically for the Rykner family, featuring a stunning cyan color scheme that appeals to a 13-year-old gamer while maintaining functionality for the whole family.

![Quest Hub Preview](https://img.shields.io/badge/Status-Ready%20for%20Deployment-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0+-cyan?style=for-the-badge&logo=tailwindcss)

## ✨ Features

### 🎯 **Epic Quest System**
- Transform boring tasks into exciting gaming missions
- XP rewards based on task priority and complexity
- Achievement badges for completed milestones
- Progress tracking with gaming-style statistics

### 👥 **Family Alliance Mode**
- **Jeremie** (Dad) - Quest Master & Task Creator
- **Rachel** (Mom) - Guild Leader & Task Manager  
- **Daniel** (Son) - Hero & Quest Completer
- Collaborative task assignment and tracking

### 🎨 **Gaming-Inspired UI**
- **Cyan Gaming Theme** - Daniel's favorite color
- Neon glowing effects and smooth animations
- Card-based layout with hover effects
- Responsive design for all devices

### 📅 **Smart Integrations**
- Google Calendar synchronization
- Recurring task automation (daily iron pills, weekly chores)
- Smart notifications and reminders
- Cross-platform compatibility

## 🛠 Tech Stack

### Frontend
- **[Next.js 15.4.6](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first styling

### Backend & Database
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless backend functions
- **[Prisma ORM](https://prisma.io/)** - Type-safe database access
- **PostgreSQL** - Robust relational database (Vercel Postgres)
- **[NextAuth.js](https://next-auth.js.org/)** - Secure authentication

### Deployment
- **[Vercel](https://vercel.com/)** - Optimized hosting platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd daniel-quest-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
daniel-quest-hub/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Main dashboard
│   │   └── globals.css        # Gaming theme styles
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Gaming-themed components
│   └── lib/                  # Utility functions
├── public/                   # Static assets
├── PROJECT.md               # Detailed project specs
└── README.md               # This file
```

## 🎮 Gaming Elements

### XP System
- **Low Priority**: 10 XP
- **Medium Priority**: 25 XP  
- **High Priority**: 50 XP
- **Critical Priority**: 100 XP

### Achievements
- 🏆 **First Quest** - Complete your first task
- 🔥 **Streak Master** - Complete tasks 7 days in a row
- ⚡ **Speed Runner** - Complete 5 tasks in one day
- 🎯 **Perfect Week** - Complete all tasks for a week

## 👨‍👩‍👦 Family Workflow

1. **Parents create tasks** for Daniel with appropriate priorities
2. **Daniel views his quest dashboard** with all assigned missions
3. **Tasks sync with Google Calendar** for scheduling
4. **Completing tasks rewards XP** and unlocks achievements
5. **Family tracks progress** together through shared dashboard

## 🛡 Recurring Quests

Perfect for daily and weekly routines:

- **Daily Iron Pills** - Health quest (Medium priority, 25 XP)
- **Weekly Room Cleanup** - Chores quest (High priority, 50 XP)
- **School Homework** - Education quest (Critical priority, 100 XP)

## 🔧 API Endpoints

### Tasks Management
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Recurring Tasks
- `GET /api/tasks/recurring` - Get recurring task templates
- `POST /api/tasks/recurring` - Create recurring task with instances

### User Statistics
- `GET /api/users/stats` - Get user XP and achievement data

### Google Calendar Integration
- `GET /api/auth/google-calendar` - Initiate OAuth flow
- `GET /api/auth/google-calendar/callback` - Handle OAuth callback
- `POST /api/calendar/sync` - Sync tasks with Google Calendar

## ⚙️ Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google Calendar (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🎯 Development Progress

### Phase 1: Foundation ✅
- [x] Project setup with Next.js 15 and TypeScript
- [x] Gaming-themed UI components with Tailwind CSS
- [x] Responsive design system with cyan color scheme
- [x] Basic page layouts and navigation

### Phase 2: Core Features ✅
- [x] NextAuth.js authentication system
- [x] Complete task CRUD operations
- [x] XP rewards and progress tracking
- [x] Family role management (parents/children)

### Phase 3: Advanced Features ✅
- [x] Recurring task automation (daily/weekly/monthly)
- [x] Google Calendar integration with OAuth
- [x] Task priority system and categories
- [x] Progress analytics and statistics

### Phase 4: Gaming Features ✅
- [x] XP system with priority-based rewards
- [x] Achievement system framework
- [x] Gaming-style animations and effects
- [x] Quest-themed UI with neon effects

### Phase 5: Polish & Deployment ✅
- [x] Performance optimization and bundle analysis
- [x] Enhanced UI/UX with advanced animations
- [x] Comprehensive error handling
- [x] Production-ready deployment configuration

---

**Made with ❤️ and ⚡ for the Rykner Family**

*"Turning everyday tasks into epic adventures, one quest at a time!"*
