import { Quest, PlayerStats } from '@/types/quest'

const QUESTS_KEY = 'daniel-quest-hub-quests'
const STATS_KEY = 'daniel-quest-hub-stats'

export class QuestStorage {
  static getQuests(): Quest[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(QUESTS_KEY)
      if (!stored) return []
      
      const quests = JSON.parse(stored)
      // Convert date strings back to Date objects
      return quests.map((quest: Quest & { createdAt: string; completedAt?: string; dueDate?: string }) => ({
        ...quest,
        createdAt: new Date(quest.createdAt),
        completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined,
        dueDate: quest.dueDate ? new Date(quest.dueDate) : undefined,
      }))
    } catch (error) {
      console.error('Error loading quests:', error)
      return []
    }
  }

  static saveQuests(quests: Quest[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(QUESTS_KEY, JSON.stringify(quests))
    } catch (error) {
      console.error('Error saving quests:', error)
    }
  }

  static getStats(): PlayerStats {
    if (typeof window === 'undefined') {
      return {
        totalXP: 0,
        level: 1,
        questsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalQuestsCreated: 0,
      }
    }
    
    try {
      const stored = localStorage.getItem(STATS_KEY)
      if (!stored) {
        return {
          totalXP: 0,
          level: 1,
          questsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalQuestsCreated: 0,
        }
      }
      
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error loading stats:', error)
      return {
        totalXP: 0,
        level: 1,
        questsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalQuestsCreated: 0,
      }
    }
  }

  static saveStats(stats: PlayerStats): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats))
    } catch (error) {
      console.error('Error saving stats:', error)
    }
  }

  static clearAll(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(QUESTS_KEY)
    localStorage.removeItem(STATS_KEY)
  }
}