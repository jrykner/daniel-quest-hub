import React, { useState } from 'react'
import { Quest } from '../../types/quest'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { format } from 'date-fns'
import { RecurringTaskService } from '../../services/recurringTasks'
import { Repeat, Calendar, Settings, Trash2, Play, Pause } from 'lucide-react'

interface RecurringQuestCardProps {
  quest: Quest
  onEdit?: (quest: Quest) => void
  onDelete?: (questId: string) => void
  onToggleActive?: (questId: string, isActive: boolean) => void
}

export function RecurringQuestCard({ 
  quest, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: RecurringQuestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'text-green-400 border-green-400/20 bg-green-400/10'
      case 'medium': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10'
      case 'high': return 'text-orange-400 border-orange-400/20 bg-orange-400/10'
      case 'critical': return 'text-red-400 border-red-400/20 bg-red-400/10'
      default: return 'text-text-secondary border-gaming-border bg-gaming-card'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'school': return '📚'
      case 'health': return '🏥'
      case 'chores': return '🧹'
      case 'personal': return '⭐'
      default: return '📝'
    }
  }

  const recurrencePattern = quest.recurrencePattern ? 
    (typeof quest.recurrencePattern === 'string' ? 
      JSON.parse(quest.recurrencePattern) : quest.recurrencePattern) : null

  const recurrenceDescription = recurrencePattern ? 
    RecurringTaskService.getRecurrenceDescription(recurrencePattern) : 'Invalid pattern'

  const nextOccurrences = recurrencePattern && quest.dueDate ? 
    RecurringTaskService.generateNextOccurrences(quest, quest.dueDate, 3) : []

  return (
    <Card className="gaming-card border-gaming-border hover:border-primary-400/50 transition-all duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getCategoryIcon(quest.category)}</span>
              <h3 className="font-gaming text-text-primary font-semibold truncate">
                {quest.title}
              </h3>
              <div className="flex items-center gap-1">
                <Repeat className="h-3 w-3 text-primary-400" />
                <span className="text-xs text-primary-400 font-medium">RECURRING</span>
              </div>
            </div>
            
            {quest.description && (
              <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                {quest.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs">
              <span className={`px-2 py-1 rounded-full border font-medium ${getPriorityColor(quest.priority)}`}>
                {quest.priority.toUpperCase()}
              </span>
              <span className="text-primary-400 font-medium">
                {quest.xpReward} XP
              </span>
              {quest.googleCalendarEventId && (
                <div className="flex items-center gap-1 text-green-400">
                  <Calendar className="h-3 w-3" />
                  <span>Synced</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Recurrence Info */}
        <div className="mt-3 bg-gaming-card/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Repeat className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-medium text-text-primary">Pattern</span>
          </div>
          <p className="text-sm text-text-secondary">{recurrenceDescription}</p>
          
          {quest.dueDate && (
            <p className="text-xs text-text-secondary mt-1">
              Started: {format(quest.dueDate, 'MMM dd, yyyy')}
            </p>
          )}
        </div>

        {/* Expanded Section */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gaming-border">
            {/* Next Occurrences */}
            {nextOccurrences.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Next Occurrences
                </h4>
                <div className="space-y-1">
                  {nextOccurrences.map((occurrence, index) => (
                    <div key={index} className="text-xs text-text-secondary flex justify-between">
                      <span>#{occurrence.instanceNumber}</span>
                      <span>{format(occurrence.dueDate, 'MMM dd, yyyy')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(quest)}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleActive?.(quest.id, quest.status === 'active')}
                  className={quest.status === 'paused' ? 'text-green-400 border-green-400/20' : 'text-yellow-400 border-yellow-400/20'}
                >
                  {quest.status === 'paused' ? (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(quest.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>

            {/* Creator Info */}
            <div className="mt-3 pt-3 border-t border-gaming-border/50">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>Created: {format(quest.createdAt, 'MMM dd, yyyy')}</span>
                <span>By: {quest.createdBy.name || 'System'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}