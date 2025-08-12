export type QuestPriority = 'low' | 'medium' | 'high' | 'critical'
export type QuestStatus = 'active' | 'completed' | 'paused'
export type QuestCategory = 'school' | 'health' | 'chores' | 'personal'
export type RecurrenceType = 'daily' | 'weekly' | 'monthly'

export interface QuestUser {
  id: string
  name: string
  role: string
}

export interface RecurrencePattern {
  type: RecurrenceType
  interval: number // Every X days/weeks/months
  daysOfWeek?: number[] // For weekly: 0=Sunday, 1=Monday, etc.
  endDate?: Date
  maxOccurrences?: number
}

export interface Quest {
  id: string
  title: string
  description: string | null
  priority: QuestPriority
  status: QuestStatus
  category: QuestCategory
  xpReward: number
  createdAt: Date
  completedAt?: Date | null
  dueDate?: Date | null
  assignedTo: QuestUser
  createdBy: QuestUser
  isRecurring?: boolean
  recurrencePattern?: RecurrencePattern
  googleCalendarEventId?: string | null
  syncToCalendar?: boolean
}

export interface PlayerStats {
  totalXP: number
  level: number
  questsCompleted: number
  currentStreak: number
  longestStreak: number
  totalQuestsCreated: number
}

export interface Achievement {
  id: string
  userId: string
  title: string
  description: string
  icon: string
  xpEarned: number
  unlockedAt: Date
}

export interface QuestFilters {
  status?: QuestStatus
  priority?: QuestPriority
  category?: QuestCategory
  sortBy?: 'createdAt' | 'priority' | 'dueDate' | 'xpReward'
  sortOrder?: 'asc' | 'desc'
}