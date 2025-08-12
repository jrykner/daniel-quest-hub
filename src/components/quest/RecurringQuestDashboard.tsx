import React, { useState, useEffect } from 'react'
import { Quest } from '../../types/quest'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { RecurringQuestForm } from './RecurringQuestForm'
import { RecurringQuestCard } from './RecurringQuestCard'
import { Plus, Repeat, Calendar, Settings } from 'lucide-react'

export function RecurringQuestDashboard() {
  const [recurringQuests, setRecurringQuests] = useState<Quest[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCalendarConnected, setIsCalendarConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecurringQuests()
    checkCalendarStatus()
  }, [])

  const fetchRecurringQuests = async () => {
    try {
      const response = await fetch('/api/tasks/recurring')
      if (response.ok) {
        const data = await response.json()
        setRecurringQuests(data.recurringTasks)
      }
    } catch (error) {
      console.error('Error fetching recurring quests:', error)
      setError('Failed to load recurring quests')
    }
  }

  const checkCalendarStatus = async () => {
    try {
      const response = await fetch('/api/calendar/sync')
      if (response.ok) {
        const data = await response.json()
        setIsCalendarConnected(data.isConnected)
      }
    } catch (error) {
      console.error('Error checking calendar status:', error)
    }
  }

  const handleCreateQuest = async (questData: {
    title: string
    description: string
    priority: string
    category: string
    xpReward: number
    dueDate: string
    recurrencePattern: unknown
    syncToCalendar: boolean
    assignedToEmail?: string
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/tasks/recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questData),
      })

      if (response.ok) {
        const data = await response.json()
        setRecurringQuests(prev => [data.baseTask, ...prev])
        setIsFormOpen(false)
        
        // Show success message
        alert(`✅ Recurring quest created! ${(data.instances || []).length} upcoming instances scheduled.`)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create recurring quest')
      }
    } catch (error) {
      console.error('Error creating recurring quest:', error)
      setError('Failed to create recurring quest')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this recurring quest? This will also delete all future instances.')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/recurring/${questId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRecurringQuests(prev => prev.filter(q => q.id !== questId))
      } else {
        setError('Failed to delete recurring quest')
      }
    } catch (error) {
      console.error('Error deleting recurring quest:', error)
      setError('Failed to delete recurring quest')
    }
  }

  const handleToggleActive = async (questId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/tasks/recurring/${questId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: isActive ? 'paused' : 'active'
        }),
      })

      if (response.ok) {
        setRecurringQuests(prev => prev.map(q => 
          q.id === questId 
            ? { ...q, status: (isActive ? 'paused' : 'active') as Quest['status'] }
            : q
        ))
      } else {
        setError('Failed to update quest status')
      }
    } catch (error) {
      console.error('Error toggling quest status:', error)
      setError('Failed to update quest status')
    }
  }

  const handleConnectCalendar = async () => {
    try {
      const response = await fetch('/api/auth/google-calendar')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Temporary debug logging
      console.log('OAuth Response:', data)
      
      if (!data.authUrl) {
        throw new Error('No authorization URL received')
      }
      
      window.open(data.authUrl, '_blank')
    } catch (error) {
      console.error('Error connecting to calendar:', error)
      setError(`Failed to connect to calendar: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-400/10 border border-primary-400/20">
              <Repeat className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-gaming text-text-primary">
                Recurring Quests
              </h1>
              <p className="text-sm text-text-secondary">
                Create and manage repeating tasks for Daniel - calendar sync optional
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isCalendarConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleConnectCalendar}
              className="text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Connect Daniel&apos;s Calendar (Optional)
            </Button>
          )}
          
          <Button
            variant="gaming"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Recurring Quest
          </Button>
        </div>
      </div>

      {/* Calendar Status */}
      {isCalendarConnected && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-green-400" />
            <span className="text-xs font-medium text-green-400">
              ✅ Daniel&apos;s Google Calendar Connected
            </span>
          </div>
          <p className="text-xs text-green-300 mt-1">
            Recurring quests will sync to Daniel&apos;s calendar automatically
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-sm text-red-400">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2 text-red-400 hover:bg-red-400/10"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gaming-card/30 border border-gaming-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-400/10">
              <Repeat className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-gaming text-text-primary">
                {recurringQuests.length}
              </p>
              <p className="text-xs text-text-secondary">
                Active Recurring Quests
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gaming-card/30 border border-gaming-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-400/10">
              <Calendar className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-gaming text-text-primary">
                {recurringQuests.filter(q => q.googleCalendarEventId).length}
              </p>
              <p className="text-xs text-text-secondary">
                Synced to Calendar
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gaming-card/30 border border-gaming-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-400/10">
              <Settings className="h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-lg font-gaming text-text-primary">
                {recurringQuests.filter(q => q.status === 'paused').length}
              </p>
              <p className="text-xs text-text-secondary">
                Paused Quests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Quests List */}
      <div className="space-y-4">
        {recurringQuests.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 rounded-lg bg-gaming-card/30 border border-gaming-border inline-block mb-4">
              <Repeat className="h-8 w-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-gaming text-text-primary mb-2">
              No Recurring Quests Yet
            </h3>
            <p className="text-text-secondary mb-4">
              Create your first recurring quest to build consistent habits and routines
            </p>
            <Button
              variant="gaming"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Recurring Quest
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {recurringQuests.map(quest => (
              <RecurringQuestCard
                key={quest.id}
                quest={quest}
                onDelete={handleDeleteQuest}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Quest Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Create Recurring Quest"
        className="max-w-4xl"
      >
        <RecurringQuestForm
          onSave={handleCreateQuest}
          onCancel={() => setIsFormOpen(false)}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  )
}