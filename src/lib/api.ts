import { Quest, PlayerStats } from '../types/quest'

export class QuestAPI {
  // Get all tasks/quests for the current user
  static async getQuests(): Promise<Quest[]> {
    try {
      const response = await fetch('/api/tasks', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const quests = await response.json()
      
      // Convert string dates back to Date objects
      return quests.map((quest: Record<string, unknown>) => ({
        ...quest,
        createdAt: new Date(quest.createdAt as string),
        completedAt: quest.completedAt ? new Date(quest.completedAt as string) : undefined,
        dueDate: quest.dueDate ? new Date(quest.dueDate as string) : undefined,
      }))
    } catch (error) {
      console.error('Error fetching quests:', error)
      throw error
    }
  }

  // Create a new task/quest
  static async createQuest(questData: Omit<Quest, 'id' | 'createdAt' | 'assignedTo' | 'createdBy'>): Promise<Quest> {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: questData.title,
          description: questData.description,
          priority: questData.priority,
          category: questData.category,
          dueDate: questData.dueDate?.toISOString(),
          xpReward: questData.xpReward,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const quest = await response.json()
      
      return {
        ...quest,
        createdAt: new Date(quest.createdAt),
        completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined,
        dueDate: quest.dueDate ? new Date(quest.dueDate) : undefined,
      }
    } catch (error) {
      console.error('Error creating quest:', error)
      throw error
    }
  }

  // Update an existing task/quest
  static async updateQuest(id: string, updates: Partial<Quest>): Promise<Quest> {
    try {
      const requestBody: Record<string, unknown> = {}
      
      if (updates.title !== undefined) requestBody.title = updates.title
      if (updates.description !== undefined) requestBody.description = updates.description
      if (updates.priority !== undefined) requestBody.priority = updates.priority
      if (updates.category !== undefined) requestBody.category = updates.category
      if (updates.xpReward !== undefined) requestBody.xpReward = updates.xpReward
      if (updates.status !== undefined) requestBody.status = updates.status
      if (updates.dueDate !== undefined) {
        requestBody.dueDate = updates.dueDate?.toISOString()
      }

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const quest = await response.json()
      
      return {
        ...quest,
        createdAt: new Date(quest.createdAt),
        completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined,
        dueDate: quest.dueDate ? new Date(quest.dueDate) : undefined,
      }
    } catch (error) {
      console.error('Error updating quest:', error)
      throw error
    }
  }

  // Delete a task/quest
  static async deleteQuest(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('Error deleting quest:', error)
      throw error
    }
  }

  // Get user statistics
  static async getStats(): Promise<PlayerStats> {
    try {
      const response = await fetch('/api/users/stats', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }
}