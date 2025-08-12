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
      const response = await fetch(`/api/tasks/recurring?id=${questId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRecurringQuests(prev => prev.filter(q => q.id !== questId))
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        setError(`Failed to delete recurring quest: ${errorData.error || 'Unknown error'}`)
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gaming-card/40 border border-gaming-border rounded-xl p-6 backdrop-blur-sm slide-in-left">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 border border-primary-400/30 shadow-lg">
              <Repeat className="h-6 w-6 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-gaming text-text-primary title-gradient">
                Recurring Quests
              </h1>
              <p className="text-sm text-text-secondary mt-1 max-w-md">
                Create and manage repeating tasks - calendar sync optional for automated scheduling
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
            {!isCalendarConnected && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectCalendar}
                className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10 hover:border-blue-400/50 transition-all duration-200 whitespace-nowrap"
              >
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Connect Calendar</span>
                <span className="sm:hidden">Connect Cal</span>
              </Button>
            )}
            
            <Button
              variant="gaming"
              onClick={() => setIsFormOpen(true)}
              className="neon-glow hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
              New Quest
            </Button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {isCalendarConnected && (
        <div className="bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 border border-green-500/30 rounded-xl p-4 shadow-lg slide-in-right">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-400/20 border border-green-400/30">
              <Calendar className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <span className="text-sm font-medium text-green-400 block">
                ✅ Google Calendar Connected
              </span>
              <p className="text-xs text-green-300 mt-1">
                New recurring quests will automatically sync to calendar
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10 border border-red-500/30 rounded-xl p-4 shadow-lg slide-in-right">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-400/20 border border-red-400/30 mt-0.5">
                <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-red-400 font-medium">Error</p>
                <p className="text-xs text-red-300 mt-1">{error}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-red-400 hover:bg-red-400/10 border border-red-400/20 hover:border-red-400/40 transition-all duration-200 flex-shrink-0"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gaming-card/50 to-gaming-card/30 border border-gaming-border rounded-xl p-6 backdrop-blur-sm hover:border-blue-400/30 transition-all duration-300 group slide-in-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/10 border border-blue-400/30 group-hover:border-blue-400/50 transition-all duration-300">
                <Repeat className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-gaming text-text-primary group-hover:text-blue-400 transition-colors duration-300">
                  {recurringQuests.length}
                </p>
                <p className="text-sm text-text-secondary">
                  Active Quests
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gaming-card/50 to-gaming-card/30 border border-gaming-border rounded-xl p-6 backdrop-blur-sm hover:border-green-400/30 transition-all duration-300 group slide-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/10 border border-green-400/30 group-hover:border-green-400/50 transition-all duration-300">
                <Calendar className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-gaming text-text-primary group-hover:text-green-400 transition-colors duration-300">
                  {recurringQuests.filter(q => q.googleCalendarEventId).length}
                </p>
                <p className="text-sm text-text-secondary">
                  Calendar Synced
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gaming-card/50 to-gaming-card/30 border border-gaming-border rounded-xl p-6 backdrop-blur-sm hover:border-yellow-400/30 transition-all duration-300 group slide-in-right sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 group-hover:border-yellow-400/50 transition-all duration-300">
                <Settings className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-gaming text-text-primary group-hover:text-yellow-400 transition-colors duration-300">
                  {recurringQuests.filter(q => q.status === 'paused').length}
                </p>
                <p className="text-sm text-text-secondary">
                  Paused Quests
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Quests List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-gaming text-text-primary">
            Your Recurring Quests
          </h2>
          {recurringQuests.length > 0 && (
            <p className="text-sm text-text-secondary">
              {recurringQuests.length} quest{recurringQuests.length !== 1 ? 's' : ''} total
            </p>
          )}
        </div>

        {recurringQuests.length === 0 ? (
          <div className="text-center py-16 fade-in-up">
            <div className="relative">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gaming-card/40 to-gaming-card/20 border border-gaming-border inline-block mb-6 backdrop-blur-sm">
                <Repeat className="h-12 w-12 text-primary-400/60 mx-auto" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-400/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary-400/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
            <h3 className="text-2xl font-gaming text-text-primary mb-3 title-gradient">
              No Recurring Quests Yet
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Create your first recurring quest to build consistent habits and routines. 
              Perfect for daily, weekly, or monthly tasks!
            </p>
            <Button
              variant="gaming"
              onClick={() => setIsFormOpen(true)}
              className="neon-glow hover:scale-105 transition-all duration-300 px-8 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Recurring Quest
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {recurringQuests.map((quest, index) => (
              <div 
                key={quest.id} 
                className="slide-in-up" 
                style={{animationDelay: `${index * 100}ms`}}
              >
                <RecurringQuestCard
                  quest={quest}
                  onDelete={handleDeleteQuest}
                  onToggleActive={handleToggleActive}
                />
              </div>
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