'use client'

import React from 'react'
import { Achievement } from '../../types/quest'
import { Card } from '../ui/Card'
import { Trophy, Star, Zap, Target, Calendar, Crown } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked?: boolean
  progress?: number
}

export function AchievementCard({ achievement, isUnlocked = false, progress = 0 }: AchievementCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-8 w-8" />
      case 'star':
        return <Star className="h-8 w-8" />
      case 'zap':
        return <Zap className="h-8 w-8" />
      case 'target':
        return <Target className="h-8 w-8" />
      case 'calendar':
        return <Calendar className="h-8 w-8" />
      case 'crown':
        return <Crown className="h-8 w-8" />
      default:
        return <Trophy className="h-8 w-8" />
    }
  }

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      isUnlocked 
        ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-500/30 shadow-yellow-500/20 shadow-lg' 
        : 'bg-gaming-card border-gaming-border opacity-60 grayscale'
    }`}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex-shrink-0 p-2 rounded-lg ${
            isUnlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700/50 text-gray-500'
          }`}>
            {getIcon(achievement.icon)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-gaming font-semibold text-sm ${
              isUnlocked ? 'text-text-primary' : 'text-text-secondary'
            }`}>
              {achievement.title}
            </h3>
            {isUnlocked && achievement.xpEarned > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <Zap className="h-3 w-3 text-primary-400" />
                <span className="text-primary-400 font-medium">+{achievement.xpEarned} XP</span>
              </div>
            )}
          </div>
        </div>

        <p className={`text-xs mb-3 ${
          isUnlocked ? 'text-text-secondary' : 'text-gray-600'
        }`}>
          {achievement.description}
        </p>

        {/* Progress Bar for locked achievements */}
        {!isUnlocked && progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Progress</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-gaming-bg rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-primary-600 to-primary-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Unlocked date */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="text-xs text-text-secondary">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}

        {/* Glow effect for newly unlocked achievements */}
        {isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse pointer-events-none" />
        )}
      </div>
    </Card>
  )
}