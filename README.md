# 🎮 Daniel's Quest Hub

> **A Gaming-Themed Family Todo Tracker**

Transform everyday tasks into epic quests! Daniel's Quest Hub is a modern, gaming-inspired task management application designed specifically for the Rykner family, featuring a stunning cyan color scheme that appeals to a 13-year-old gamer while maintaining functionality for the whole family.

![Quest Hub Preview](https://img.shields.io/badge/Status-In%20Development-cyan?style=for-the-badge)
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
- **Next.js API Routes** - Serverless backend functions
- **PostgreSQL** - Robust relational database (Vercel Postgres)

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

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and structure
- [x] Gaming-themed UI components
- [x] Responsive design system
- [x] Basic page layouts

### Phase 2: Core Features 🔄
- [ ] User authentication system
- [ ] Task CRUD operations
- [ ] XP and achievement system
- [ ] Family role management

### Phase 3: Advanced Features ⏳
- [ ] Recurring task automation
- [ ] Google Calendar integration
- [ ] Real-time notifications
- [ ] Progress analytics

### Phase 4: Polish & Launch ⏳
- [ ] Performance optimization
- [ ] Testing and bug fixes
- [ ] Final deployment
- [ ] Family onboarding

---

**Made with ❤️ and ⚡ for the Rykner Family**

*"Turning everyday tasks into epic adventures, one quest at a time!"*
