'use client'

import React, { useEffect, useState } from 'react'
import { Zap, Star, Trophy } from 'lucide-react'

interface XPNotificationProps {
  show: boolean
  xpGained: number
  levelUp?: boolean
  newLevel?: number
  achievementUnlocked?: string
  onComplete: () => void
}

export function XPNotification({ 
  show, 
  xpGained, 
  levelUp = false, 
  newLevel,
  achievementUnlocked,
  onComplete 
}: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300) // Allow fade out animation to complete
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className={`transform transition-all duration-500 ${
        isVisible 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-75 opacity-0 translate-y-8'
      }`}>
        {/* XP Gain Notification */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-2xl shadow-2xl border border-primary-400/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <div className="font-gaming text-lg font-bold">+{xpGained} XP</div>
              <div className="text-primary-100 text-sm">Experience Gained!</div>
            </div>
          </div>
        </div>

        {/* Level Up Notification */}
        {levelUp && newLevel && (
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-8 py-6 rounded-2xl shadow-2xl border border-yellow-400/50 mb-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                <Star className="h-8 w-8" />
              </div>
              <div>
                <div className="font-gaming text-xl font-bold">LEVEL UP!</div>
                <div className="text-yellow-100 text-sm">You reached Level {newLevel}!</div>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Notification */}
        {achievementUnlocked && (
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-6 rounded-2xl shadow-2xl border border-purple-400/50 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <div className="font-gaming text-xl font-bold">ACHIEVEMENT!</div>
                <div className="text-purple-100 text-sm">{achievementUnlocked}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background overlay for dramatic effect */}
      <div className={`fixed inset-0 bg-black/20 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  )
}