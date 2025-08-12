import React from 'react'
import { format } from 'date-fns'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card'
import { Button } from '../ui/Button'
import { Quest } from '../../types/quest'
import { 
  getPriorityColor, 
  getPriorityEmoji, 
  getTimeUntilDue 
} from '../../lib/utils'
import { 
  Calendar, 
  Star, 
  CheckCircle2, 
  PlayCircle, 
  PauseCircle,
  Edit,
  Trash2,
  Repeat
} from 'lucide-react'

interface QuestCardProps {
  quest: Quest
  onComplete: (questId: string) => void
  onEdit: (quest: Quest) => void
  onDelete: (questId: string) => void
  onToggleStatus: (questId: string) => void
}

export function QuestCard({ 
  quest, 
  onComplete, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: QuestCardProps) {
  const isOverdue = quest.dueDate && quest.dueDate < new Date() && quest.status === 'active'
  const isCompleted = quest.status === 'completed'
  
  return (
    <Card 
      className={`gaming-card-enhanced transition-all duration-300 hover:scale-[1.02] fade-in-up ${
        isCompleted ? 'opacity-75' : ''
      } ${
        isOverdue ? 'border-red-400/50 shadow-red-400/20 neon-glow' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {getPriorityEmoji(quest.priority)}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPriorityColor(quest.priority)}`}>
                {quest.priority.toUpperCase()}
              </span>
            </div>
            <h3 className={`font-gaming text-lg font-semibold leading-tight transition-all duration-300 ${
              isCompleted ? 'line-through text-text-secondary' : 'text-text-primary text-glow'
            } ${isOverdue ? 'text-red-400' : ''}`}>
              {quest.title}
            </h3>
            {quest.description && (
              <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                {quest.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(quest)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(quest.id)}
              className="h-8 w-8 text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          {quest.dueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`}>
              <Calendar className="h-4 w-4" />
              <span>
                {isOverdue ? 'Overdue' : getTimeUntilDue(quest.dueDate)}
              </span>
            </div>
          )}
          
          
          <div className="flex items-center gap-1 text-primary-400 float-animation">
            <Star className="h-4 w-4 text-glow" />
            <span className="font-medium text-glow">{quest.xpReward} XP</span>
          </div>
          
          {(quest.isRecurring || quest.title.includes('#')) && (
            <div className="flex items-center gap-1 text-blue-400 neon-glow">
              <Repeat className="h-4 w-4" />
              <span className="font-medium text-xs bg-blue-400/10 px-2 py-1 rounded-full border border-blue-400/30">RECURRING</span>
            </div>
          )}
        </div>

      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
          <div className="text-xs text-text-secondary">
            Created {format(quest.createdAt, 'MMM d')}
            {quest.completedAt && (
              <span className="text-green-400 ml-2">
                ✓ Completed {format(quest.completedAt, 'MMM d')}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            {!isCompleted && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(quest.id)}
                  className="h-8 text-xs px-3 button-glow transition-all duration-300 hover:scale-105"
                >
                  {quest.status === 'active' ? (
                    <>
                      <PauseCircle className="h-3 w-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Resume
                    </>
                  )}
                </Button>
                
                <Button
                  variant="gaming"
                  size="sm"
                  onClick={() => onComplete(quest.id)}
                  className="h-8 text-xs px-3 button-glow neon-glow transition-all duration-300 hover:scale-105"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Complete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}