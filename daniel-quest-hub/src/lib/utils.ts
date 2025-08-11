import { type ClassValue, clsx } from 'clsx'
import { QuestPriority } from '@/types/quest'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function getTimeUntilDue(dueDate: Date): string {
  const now = new Date()
  const diffMs = dueDate.getTime() - now.getTime()
  
  if (diffMs < 0) {
    return 'Overdue'
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h left`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m left`
  } else {
    return `${diffMinutes}m left`
  }
}

export function calculateXP(priority: QuestPriority): number {
  const xpMap: Record<QuestPriority, number> = {
    low: 10,
    medium: 25,
    high: 50,
    critical: 100,
  }
  return xpMap[priority]
}

export function calculateLevel(totalXP: number): number {
  // Level formula: level = floor(sqrt(totalXP / 50))
  return Math.floor(Math.sqrt(totalXP / 50)) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 50
}

export function getPriorityColor(priority: QuestPriority): string {
  const colorMap: Record<QuestPriority, string> = {
    low: 'text-green-400 border-green-400/50 bg-green-400/10',
    medium: 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10',
    high: 'text-orange-400 border-orange-400/50 bg-orange-400/10',
    critical: 'text-red-400 border-red-400/50 bg-red-400/10',
  }
  return colorMap[priority]
}

export function getPriorityEmoji(priority: QuestPriority): string {
  const emojiMap: Record<QuestPriority, string> = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴',
  }
  return emojiMap[priority]
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}