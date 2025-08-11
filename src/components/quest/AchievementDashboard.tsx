'use client'

import React, { useState } from 'react'
import { Achievement, PlayerStats } from '../../types/quest'
import { AchievementCard } from './AchievementCard'
import { Button } from '../ui/Button'
import { Award, Star, Trophy, Lock } from 'lucide-react'

// Pre-defined achievements for the Daniel Quest Hub
const AVAILABLE_ACHIEVEMENTS = [
  {
    id: 'first-quest',
    title: 'Quest Beginner',
    description: 'Complete your first quest',
    icon: 'target',
    xpReward: 50,
    condition: { type: 'quests_completed', threshold: 1 }
  },
  {
    id: 'streak-3',
    title: '3-Day Warrior',
    description: 'Complete quests for 3 days in a row',
    icon: 'star',
    xpReward: 100,
    condition: { type: 'current_streak', threshold: 3 }
  },
  {
    id: 'streak-7',
    title: 'Weekly Champion',
    description: 'Complete quests for 7 days in a row',
    icon: 'crown',
    xpReward: 250,
    condition: { type: 'current_streak', threshold: 7 }
  },
  {
    id: 'xp-100',
    title: 'XP Collector',
    description: 'Earn 100 total XP points',
    icon: 'zap',
    xpReward: 50,
    condition: { type: 'total_xp', threshold: 100 }
  },
  {
    id: 'xp-500',
    title: 'XP Master',
    description: 'Earn 500 total XP points',
    icon: 'trophy',
    xpReward: 100,
    condition: { type: 'total_xp', threshold: 500 }
  },
  {
    id: 'level-5',
    title: 'Leveling Up',
    description: 'Reach level 5',
    icon: 'star',
    xpReward: 150,
    condition: { type: 'level', threshold: 5 }
  },
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete 5 quests before their due date',
    icon: 'calendar',
    xpReward: 100,
    condition: { type: 'early_completions', threshold: 5 }
  },
  {
    id: 'quest-master',
    title: 'Quest Master',
    description: 'Complete 50 total quests',
    icon: 'crown',
    xpReward: 300,
    condition: { type: 'quests_completed', threshold: 50 }
  }
]

interface AchievementDashboardProps {
  stats: PlayerStats
  userAchievements: Achievement[]
}

export function AchievementDashboard({ stats, userAchievements }: AchievementDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  const calculateProgress = (achievement: { condition: { type: string; threshold: number } }): number => {
    const { condition } = achievement
    
    switch (condition.type) {
      case 'quests_completed':
        return Math.min(stats.questsCompleted / condition.threshold, 1)
      case 'current_streak':
        return Math.min(stats.currentStreak / condition.threshold, 1)
      case 'total_xp':
        return Math.min(stats.totalXP / condition.threshold, 1)
      case 'level':
        return Math.min(stats.level / condition.threshold, 1)
      case 'early_completions':
        // This would need to be tracked separately in stats
        return 0
      default:
        return 0
    }
  }

  const isUnlocked = (achievementId: string): boolean => {
    return userAchievements.some(a => a.id === achievementId)
  }

  const achievementsWithProgress = AVAILABLE_ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    isUnlocked: isUnlocked(achievement.id),
    progress: calculateProgress(achievement)
  }))

  const filteredAchievements = achievementsWithProgress.filter(achievement => {
    if (filter === 'unlocked') return achievement.isUnlocked
    if (filter === 'locked') return !achievement.isUnlocked
    return true
  })

  const unlockedCount = achievementsWithProgress.filter(a => a.isUnlocked).length
  const totalCount = AVAILABLE_ACHIEVEMENTS.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming text-2xl font-bold text-text-primary flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Achievements
          </h2>
          <p className="text-text-secondary">
            {unlockedCount} of {totalCount} achievements unlocked
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'gaming' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unlocked' ? 'gaming' : 'outline'}
            size="sm"
            onClick={() => setFilter('unlocked')}
          >
            <Award className="h-4 w-4 mr-1" />
            Unlocked
          </Button>
          <Button
            variant={filter === 'locked' ? 'gaming' : 'outline'}
            size="sm"
            onClick={() => setFilter('locked')}
          >
            <Lock className="h-4 w-4 mr-1" />
            Locked
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Overall Progress</span>
          <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gaming-bg rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2 rounded-full transition-all duration-700"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="text-4xl mb-2">
              {filter === 'unlocked' ? '🏆' : filter === 'locked' ? '🔒' : '🎯'}
            </div>
            <p className="text-text-secondary">
              {filter === 'unlocked' 
                ? 'No achievements unlocked yet. Start completing quests!'
                : filter === 'locked'
                ? 'All achievements unlocked! You\'re amazing!'
                : 'No achievements found.'
              }
            </p>
          </div>
        ) : (
          filteredAchievements.map((achievement) => {
            const userAchievement = userAchievements.find(a => a.id === achievement.id)
            return (
              <AchievementCard
                key={achievement.id}
                achievement={{
                  id: achievement.id,
                  title: achievement.title,
                  description: achievement.description,
                  icon: achievement.icon,
                  xpEarned: achievement.xpReward,
                  unlockedAt: userAchievement?.unlockedAt || new Date(),
                  userId: stats.totalXP.toString() // placeholder
                }}
                isUnlocked={achievement.isUnlocked}
                progress={achievement.progress}
              />
            )
          })
        )}
      </div>

      {/* Recent Unlocks */}
      {userAchievements.length > 0 && (
        <div className="bg-gaming-card border border-gaming-border rounded-lg p-4">
          <h3 className="font-gaming font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Recent Unlocks
          </h3>
          <div className="space-y-2">
            {userAchievements
              .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
              .slice(0, 3)
              .map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gaming-bg rounded">
                  <div className="text-yellow-400">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{achievement.title}</p>
                    <p className="text-xs text-text-secondary">
                      +{achievement.xpEarned} XP • {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}