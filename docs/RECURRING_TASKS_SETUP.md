# 🔄 Recurring Tasks & Google Calendar Integration

## Overview
Daniel's Quest Hub now supports recurring tasks that automatically repeat on daily, weekly, or monthly schedules, with seamless Google Calendar integration for frictionless task management.

## Features Implemented

### ✅ Phase 4: Recurring Tasks & Calendar Integration

#### 🔄 Recurring Task System
- **Flexible Patterns**: Daily, weekly, and monthly recurrence with custom intervals
- **Advanced Weekly Options**: Specify exact days of the week (e.g., Monday & Wednesday)
- **Smart Scheduling**: Automatic generation of future task instances
- **End Conditions**: Set end dates or maximum occurrences
- **Pause/Resume**: Toggle recurring tasks without losing settings

#### 📅 Google Calendar Integration
- **OAuth Authentication**: Secure Google Calendar connection
- **Automatic Sync**: Recurring tasks appear in Daniel's Google Calendar
- **Event Management**: Create, update, and delete calendar events
- **Recurrence Rules**: Full support for Google Calendar recurrence patterns
- **Visual Indicators**: Clear sync status in the UI

#### 🎮 Gaming Features Enhanced
- **XP Rewards**: Each completed recurring task instance earns XP
- **Achievement Tracking**: Progress tracking for consistency streaks
- **Gaming UI**: Consistent theme with quest-style presentation

## Setup Instructions

### 1. Environment Variables
Add the following to your `.env` file:

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="https://your-domain.com/api/auth/google-calendar/callback"
```

### 2. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized redirect URIs

### 3. Database Migration
The new schema includes:
- `CalendarTokens` table for storing Google OAuth tokens
- Enhanced `Task` model with recurring fields
- `isRecurring`, `recurringPattern`, `googleCalendarEventId` fields

Run migration:
```bash
npm run db:migrate
```

## Usage Guide

### Creating Recurring Tasks

1. **Navigate to Recurring Tab**: Click "Recurring" in the main navigation
2. **Create New**: Click "New Recurring Quest"
3. **Fill Details**: 
   - Title and description
   - Priority level (affects XP reward)
   - Category for organization
   - First due date

4. **Set Recurrence**:
   - **Daily**: Every X days
   - **Weekly**: Every X weeks, optionally on specific days
   - **Monthly**: Every X months

5. **Optional Settings**:
   - End date
   - Maximum occurrences
   - Google Calendar sync

### Google Calendar Connection

1. **Connect**: Click "Connect Calendar" button
2. **Authorize**: Complete Google OAuth flow
3. **Auto-Sync**: Future recurring tasks automatically sync to calendar
4. **Management**: View sync status and manage from recurring dashboard

### Managing Recurring Tasks

- **View All**: Recurring dashboard shows all active patterns
- **Pause/Resume**: Temporarily stop task generation
- **Edit**: Modify patterns (affects future instances only)
- **Delete**: Remove pattern and all future instances
- **Calendar Sync**: Toggle sync on/off per task

## Technical Implementation

### Core Components

#### Services
- `GoogleCalendarService`: Handles all Google Calendar API interactions
- `RecurringTaskService`: Manages recurrence pattern logic and task generation

#### API Endpoints
- `/api/auth/google-calendar`: Initiates OAuth flow
- `/api/auth/google-calendar/callback`: Handles OAuth callback
- `/api/calendar/sync`: Manages calendar synchronization
- `/api/tasks/recurring`: CRUD operations for recurring tasks

#### UI Components
- `RecurringQuestForm`: Create/edit recurring tasks
- `RecurringQuestCard`: Display individual recurring task
- `RecurringQuestDashboard`: Main management interface

### Database Schema

#### CalendarTokens
- Stores OAuth tokens securely
- Associated with user accounts
- Supports token refresh

#### Enhanced Task Model
- `isRecurring`: Boolean flag
- `recurringPattern`: JSON pattern specification
- `googleCalendarEventId`: Link to calendar event

## Security Considerations

- **OAuth Tokens**: Stored encrypted in database
- **Scopes**: Minimal Google Calendar permissions
- **User Isolation**: Tokens tied to specific user accounts
- **Error Handling**: Graceful degradation if calendar unavailable

## Future Enhancements

### Planned Features
- **Smart Notifications**: Calendar-based reminders
- **Progress Analytics**: Recurring task completion tracking
- **Template System**: Predefined recurring task templates
- **Team Sharing**: Share recurring patterns with family members

### Integration Opportunities
- **Apple Calendar**: iCloud calendar sync
- **Notion**: Export tasks to Notion databases
- **Slack**: Daily/weekly task summaries
- **Habit Tracking**: Integration with habit tracking apps

## Troubleshooting

### Common Issues

#### Calendar Not Connecting
- Verify Google Client credentials
- Check authorized redirect URIs
- Ensure Calendar API is enabled

#### Tasks Not Syncing
- Check calendar token validity
- Verify user permissions
- Review error logs in browser console

#### Recurrence Not Working
- Validate recurrence pattern
- Check due date is in future
- Verify task is marked as active

### Support
For technical support, check:
1. Browser console for JavaScript errors
2. Server logs for API errors
3. Database connection status
4. Environment variable configuration

---

## Summary

The recurring tasks and Google Calendar integration transforms Daniel's Quest Hub into a comprehensive task management system. The seamless synchronization ensures Daniel can manage his tasks from either the gaming interface or his familiar Google Calendar, making task management truly frictionless.

Key benefits:
- ⚡ **Effortless**: Tasks automatically appear in calendar
- 🔄 **Consistent**: Recurring patterns ensure routine building
- 🎮 **Engaging**: Gaming elements maintain motivation
- 📱 **Accessible**: Calendar access from any device
- 🔒 **Secure**: OAuth ensures data protection