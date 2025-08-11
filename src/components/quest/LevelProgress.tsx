'use client'

import React from 'react'
import { PlayerStats } from '../../types/quest'
import { Card } from '../ui/Card'
import { Star, Zap, TrendingUp } from 'lucide-react'

interface LevelProgressProps {
  stats: PlayerStats
}

export function LevelProgress({ stats }: LevelProgressProps) {
  const xpForCurrentLevel = (stats.level - 1) * 100
  const xpForNextLevel = stats.level * 100
  const xpInCurrentLevel = stats.totalXP - xpForCurrentLevel
  const xpNeededForNextLevel = xpForNextLevel - stats.totalXP
  const progressPercentage = (xpInCurrentLevel / 100) * 100

  const getMotivationalMessage = (): string => {
    if (progressPercentage >= 90) return "Almost there! One more push to level up!"
    if (progressPercentage >= 75) return "You're so close to the next level!"
    if (progressPercentage >= 50) return "Halfway to your next level!"
    if (progressPercentage >= 25) return "Making great progress!"
    return "Every quest brings you closer to leveling up!"
  }

  const getLevelTitle = (level: number): string => {
    if (level >= 50) return "Legendary Quest Master"
    if (level >= 25) return "Epic Quest Hero" 
    if (level >= 15) return "Advanced Questor"
    if (level >= 10) return "Experienced Adventurer"
    if (level >= 5) return "Rising Hero"
    return "Quest Apprentice"
  }

  return (
    <Card className="bg-gradient-to-br from-primary-900/20 to-primary-800/10 border-primary-500/30">
      <div className="p-4 space-y-4">
        {/* Level Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-gaming text-xl font-bold text-text-primary">
                  Level {stats.level}
                </h3>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <p className="text-sm text-text-secondary">{getLevelTitle(stats.level)}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary-400 font-bold">
              <Zap className="h-4 w-4" />
              <span>{stats.totalXP} XP</span>
            </div>
            <p className="text-xs text-text-secondary">Total Experience</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Progress to Level {stats.level + 1}</span>
            <span className="text-primary-400 font-medium">
              {xpInCurrentLevel}/100 XP
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gaming-bg rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Level markers */}
            <div className="absolute -top-1 -bottom-1 left-0 right-0 flex justify-between pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-0.5 bg-gaming-border" 
                  style={{ opacity: i * 25 <= progressPercentage ? 0.7 : 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Next Level Info */}
        <div className="bg-gaming-bg rounded-lg p-3 space-y-2">
          <p className="text-sm text-text-primary font-medium">
            {getMotivationalMessage()}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">XP needed for next level:</span>
            <div className="flex items-center gap-1 text-primary-400 font-medium">
              <Zap className="h-3 w-3" />
              <span>{xpNeededForNextLevel} XP</span>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gaming-border">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{stats.questsCompleted}</div>
            <div className="text-xs text-text-secondary">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{stats.currentStreak}</div>
            <div className="text-xs text-text-secondary">Day Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{stats.longestStreak}</div>
            <div className="text-xs text-text-secondary">Best Streak</div>
          </div>
        </div>
      </div>
    </Card>
  )
}