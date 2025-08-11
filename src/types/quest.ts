export type QuestPriority = 'low' | 'medium' | 'high' | 'critical'
export type QuestStatus = 'active' | 'completed' | 'paused'
export type QuestCategory = 'school' | 'health' | 'chores' | 'personal'

export interface QuestUser {
  id: string
  name: string
  role: string
}

export interface Quest {
  id: string
  title: string
  description: string
  priority: QuestPriority
  status: QuestStatus
  category: QuestCategory
  xpReward: number
  createdAt: Date
  completedAt?: Date
  dueDate?: Date
  assignedTo: QuestUser
  createdBy: QuestUser
}

export interface PlayerStats {
  totalXP: number
  level: number
  questsCompleted: number
  currentStreak: number
  longestStreak: number
  totalQuestsCreated: number
}

export interface QuestFilters {
  status?: QuestStatus
  priority?: QuestPriority
  category?: QuestCategory
  sortBy?: 'createdAt' | 'priority' | 'dueDate' | 'xpReward'
  sortOrder?: 'asc' | 'desc'
}