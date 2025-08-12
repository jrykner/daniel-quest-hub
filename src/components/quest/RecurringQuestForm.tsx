import React, { useState, useEffect } from 'react'
import { QuestPriority, QuestCategory, RecurrencePattern, RecurrenceType } from '../../types/quest'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { calculateXP } from '../../lib/utils'
import { format, addDays } from 'date-fns'
import { RecurringTaskService } from '../../services/recurringTasks'

interface QuestData {
  title: string
  description: string
  priority: QuestPriority
  category: QuestCategory
  xpReward: number
  dueDate: string
  recurrencePattern: RecurrencePattern
  syncToCalendar: boolean
  assignedToEmail?: string
}

interface RecurringQuestFormProps {
  onSave: (questData: QuestData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function RecurringQuestForm({ onSave, onCancel, isLoading }: RecurringQuestFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as QuestPriority,
    category: 'personal' as QuestCategory,
    dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    syncToCalendar: false,
    assignedToEmail: '', // For future multi-user support
  })

  const [recurrenceData, setRecurrenceData] = useState<RecurrencePattern>({
    type: 'daily',
    interval: 1,
    daysOfWeek: [],
    endDate: undefined,
    maxOccurrences: undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCalendarConnected, setIsCalendarConnected] = useState(false)

  useEffect(() => {
    // Check if calendar is connected
    fetch('/api/calendar/sync')
      .then(res => res.json())
      .then(data => setIsCalendarConnected(data.isConnected))
      .catch(() => setIsCalendarConnected(false))
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required for recurring quests'
    }

    // Validate recurrence pattern
    const patternErrors = RecurringTaskService.validateRecurrencePattern(recurrenceData)
    if (patternErrors.length > 0) {
      newErrors.recurrence = patternErrors.join(', ')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const questData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      xpReward: calculateXP(formData.priority),
      dueDate: formData.dueDate,
      recurrencePattern: recurrenceData,
      syncToCalendar: formData.syncToCalendar && isCalendarConnected,
      assignedToEmail: formData.assignedToEmail || undefined,
    }

    onSave(questData)
  }

  const priorityOptions = [
    { value: 'low', label: '🟢 Low - Easy quest (10 XP)' },
    { value: 'medium', label: '🟡 Medium - Normal quest (25 XP)' },
    { value: 'high', label: '🟠 High - Challenging quest (50 XP)' },
    { value: 'critical', label: '🔴 Critical - Epic quest (100 XP)' },
  ]

  const categoryOptions = [
    { value: 'school', label: '📚 School' },
    { value: 'health', label: '🏥 Health' },
    { value: 'chores', label: '🧹 Chores' },
    { value: 'personal', label: '⭐ Personal' },
  ]

  const recurrenceTypeOptions = [
    { value: 'daily', label: '📅 Daily' },
    { value: 'weekly', label: '📆 Weekly' },
    { value: 'monthly', label: '🗓️ Monthly' },
  ]

  const dayOfWeekOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ]

  const handleDayOfWeekChange = (dayValue: number) => {
    const currentDays = recurrenceData.daysOfWeek || []
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort()
    
    setRecurrenceData(prev => ({ ...prev, daysOfWeek: newDays }))
  }

  const recurrenceDescription = RecurringTaskService.getRecurrenceDescription(recurrenceData)

  return (
    <div className="space-y-6">
      <div className="border-b border-gaming-border pb-4">
        <h3 className="text-lg font-gaming text-primary-400 flex items-center gap-2">
          <span>🔄</span> Create Recurring Quest
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Set up a quest that repeats automatically. Perfect for daily habits and regular tasks!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Quest Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-text-primary">Quest Details</h4>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
              Quest Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your recurring quest title..."
              className={errors.title ? 'border-red-400' : ''}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your recurring quest... (optional)"
              rows={3}
              className="flex w-full rounded-lg border border-gaming-border bg-gaming-card px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gaming-bg disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-1">
                Priority Level
              </label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as QuestPriority }))}
                options={priorityOptions}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1">
                Category
              </label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as QuestCategory }))}
                options={categoryOptions}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-text-primary mb-1">
              First Due Date *
            </label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              min={format(new Date(), 'yyyy-MM-dd')}
              className={errors.dueDate ? 'border-red-400' : ''}
            />
            {errors.dueDate && (
              <p className="text-red-400 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Recurrence Settings */}
        <div className="space-y-4 border-t border-gaming-border pt-4">
          <h4 className="font-medium text-text-primary">Recurrence Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="recurrenceType" className="block text-sm font-medium text-text-primary mb-1">
                Repeat Type
              </label>
              <Select
                id="recurrenceType"
                value={recurrenceData.type}
                onChange={(e) => setRecurrenceData(prev => ({ 
                  ...prev, 
                  type: e.target.value as RecurrenceType,
                  daysOfWeek: e.target.value === 'weekly' ? prev.daysOfWeek : []
                }))}
                options={recurrenceTypeOptions}
              />
            </div>

            <div>
              <label htmlFor="interval" className="block text-sm font-medium text-text-primary mb-1">
                Repeat Every
              </label>
              <Input
                id="interval"
                type="number"
                min="1"
                max="30"
                value={recurrenceData.interval}
                onChange={(e) => setRecurrenceData(prev => ({ ...prev, interval: parseInt(e.target.value) || 1 }))}
                placeholder="1"
              />
              <p className="text-xs text-text-secondary mt-1">
                {recurrenceData.type === 'daily' && 'day(s)'}
                {recurrenceData.type === 'weekly' && 'week(s)'}
                {recurrenceData.type === 'monthly' && 'month(s)'}
              </p>
            </div>
          </div>

          {recurrenceData.type === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {dayOfWeekOptions.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayOfWeekChange(day.value)}
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                      (recurrenceData.daysOfWeek || []).includes(day.value)
                        ? 'bg-primary-400 text-gaming-bg border-primary-400'
                        : 'bg-gaming-card text-text-secondary border-gaming-border hover:border-primary-400'
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-text-primary mb-1">
                End Date (Optional)
              </label>
              <Input
                id="endDate"
                type="date"
                value={recurrenceData.endDate ? format(recurrenceData.endDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setRecurrenceData(prev => ({ 
                  ...prev, 
                  endDate: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                min={formData.dueDate}
              />
            </div>

            <div>
              <label htmlFor="maxOccurrences" className="block text-sm font-medium text-text-primary mb-1">
                Max Occurrences (Optional)
              </label>
              <Input
                id="maxOccurrences"
                type="number"
                min="1"
                max="100"
                value={recurrenceData.maxOccurrences || ''}
                onChange={(e) => setRecurrenceData(prev => ({ 
                  ...prev, 
                  maxOccurrences: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="bg-gaming-card/30 border border-gaming-border rounded-lg p-3">
            <p className="text-sm text-text-primary">
              <span className="font-medium">Pattern: </span>
              {recurrenceDescription}
            </p>
          </div>

          {errors.recurrence && (
            <p className="text-red-400 text-xs">{errors.recurrence}</p>
          )}
        </div>

        {/* Calendar Integration - Optional */}
        <div className="space-y-4 border-t border-gaming-border pt-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-text-primary flex items-center gap-2">
              📅 Calendar Integration
              <span className="text-xs text-text-secondary font-normal">(Optional)</span>
            </h4>
          </div>
          
          <div className="bg-gaming-card/20 border border-gaming-border/50 rounded-lg p-3">
            <p className="text-xs text-text-secondary mb-3">
              💡 You can create recurring quests without connecting a calendar. Calendar sync is optional and helps Daniel see tasks in his Google Calendar.
            </p>
            
            {isCalendarConnected ? (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="syncToCalendar"
                  checked={formData.syncToCalendar}
                  onChange={(e) => setFormData(prev => ({ ...prev, syncToCalendar: e.target.checked }))}
                  className="rounded border-gaming-border text-primary-400 focus:ring-primary-400 focus:ring-offset-0"
                />
                <label htmlFor="syncToCalendar" className="text-sm text-text-primary">
                  ✅ Sync to Daniel&apos;s Google Calendar
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">
                  🔗 No calendar connected. Tasks will be created without calendar sync.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    fetch('/api/auth/google-calendar')
                      .then(res => res.json())
                      .then(data => window.open(data.authUrl, '_blank'))
                      .catch(console.error)
                  }}
                  className="text-xs"
                >
                  Connect Daniel&apos;s Google Calendar (Optional)
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gaming"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Recurring Quest'}
          </Button>
        </div>
      </form>
    </div>
  )
}