import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { PlayerStats } from '../../types/quest'
import { calculateLevel, getXPForNextLevel } from '../../lib/utils'
import { Trophy, Target, Zap, Flame } from 'lucide-react'

interface StatsCardProps {
  stats: PlayerStats
}

export function StatsCard({ stats }: StatsCardProps) {
  const currentLevel = calculateLevel(stats.totalXP)
  const nextLevelXP = getXPForNextLevel(currentLevel)
  const currentLevelXP = getXPForNextLevel(currentLevel - 1)
  const progressToNextLevel = ((stats.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  return (
    <Card glowing className="bg-gradient-to-br from-gaming-card to-gaming-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Player Stats
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-gaming font-bold text-primary-400">
                Level {currentLevel}
              </span>
              <span className="text-sm text-text-secondary">
                {stats.totalXP} / {nextLevelXP} XP
              </span>
            </div>
            <div className="w-full bg-gaming-border rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {Math.max(0, nextLevelXP - stats.totalXP)} XP to next level
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-4 w-4 text-green-400" />
                <span className="text-2xl font-bold text-green-400">
                  {stats.questsCompleted}
                </span>
              </div>
              <p className="text-xs text-text-secondary">Quests Completed</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-4 w-4 text-primary-400" />
                <span className="text-2xl font-bold text-primary-400">
                  {stats.totalXP}
                </span>
              </div>
              <p className="text-xs text-text-secondary">Total XP</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-2xl font-bold text-orange-400">
                  {stats.currentStreak}
                </span>
              </div>
              <p className="text-xs text-text-secondary">Current Streak</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">
                  {stats.longestStreak}
                </span>
              </div>
              <p className="text-xs text-text-secondary">Best Streak</p>
            </div>
          </div>

          {/* Achievement Hints */}
          <div className="bg-primary-400/10 border border-primary-400/20 rounded-lg p-3">
            <h4 className="text-sm font-gaming font-semibold text-primary-400 mb-1">
              Next Milestone
            </h4>
            <p className="text-xs text-text-secondary">
              {getNextMilestone(stats)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getNextMilestone(stats: PlayerStats): string {
  if (stats.questsCompleted < 10) {
    return `Complete ${10 - stats.questsCompleted} more quests to unlock the "Getting Started" achievement!`
  } else if (stats.questsCompleted < 50) {
    return `Complete ${50 - stats.questsCompleted} more quests to unlock the "Dedicated Adventurer" achievement!`
  } else if (stats.currentStreak < 7) {
    return `Complete quests for ${7 - stats.currentStreak} more days to unlock the "Week Warrior" achievement!`
  } else if (stats.totalXP < 1000) {
    return `Earn ${1000 - stats.totalXP} more XP to unlock the "XP Master" achievement!`
  } else {
    return "You're doing amazing! Keep completing quests to unlock more achievements!"
  }
}