export type QuestPriority = 'low' | 'medium' | 'high' | 'critical'
export type QuestStatus = 'active' | 'completed' | 'paused'

export interface Quest {
  id: string
  title: string
  description?: string
  priority: QuestPriority
  status: QuestStatus
  xpReward: number
  createdAt: Date
  completedAt?: Date
  dueDate?: Date
  tags: string[]
  estimatedTime?: number // in minutes
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
  tag?: string
  sortBy?: 'createdAt' | 'priority' | 'dueDate' | 'xpReward'
  sortOrder?: 'asc' | 'desc'
}