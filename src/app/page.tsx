'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { QuestDashboard } from '../components/quest/QuestDashboard'
import { AchievementDashboard } from '../components/quest/AchievementDashboard'
import { LevelProgress } from '../components/quest/LevelProgress'
import { RecurringQuestDashboard } from '../components/quest/RecurringQuestDashboard'
import { Button } from '../components/ui/Button'
import { Home as HomeIcon, Trophy, BarChart3, Repeat } from 'lucide-react'
import { PlayerStats, Achievement } from '../types/quest'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeView, setActiveView] = useState<'quests' | 'achievements' | 'progress' | 'recurring'>('quests')
  const [stats] = useState<PlayerStats>({
    totalXP: 0,
    level: 1,
    questsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalQuestsCreated: 0,
  })
  const [achievements] = useState<Achievement[]>([])

  useEffect(() => {
    if (status === 'loading') return // Still loading
    
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-gaming flex items-center justify-center">
        <div className="text-center fade-in-up">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary-400 mx-auto mb-6 neon-glow"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-4 border-primary-400/20 mx-auto"></div>
          </div>
          <h2 className="text-primary-400 text-2xl font-gaming mb-2 title-gradient">Loading Quest Hub...</h2>
          <p className="text-text-secondary text-sm">Preparing your epic adventure</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gradient-gaming">
      {/* Navigation Header */}
      <div className="border-b border-gaming-border bg-gaming-card/50 backdrop-blur-sm sticky top-0 z-40 slide-in-left">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-gaming text-2xl font-bold float-animation">
              <span className="title-gradient text-glow">
                Daniel&apos;s Quest Hub
              </span>
            </h1>
            
            <div className="flex gap-3 slide-in-right">
              <Button
                variant={activeView === 'quests' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('quests')}
                className={`button-glow transition-all duration-300 ${activeView === 'quests' ? 'neon-glow' : ''}`}
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Quests
              </Button>
              
              <Button
                variant={activeView === 'recurring' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('recurring')}
                className={`button-glow transition-all duration-300 ${activeView === 'recurring' ? 'neon-glow' : ''}`}
              >
                <Repeat className="h-4 w-4 mr-2" />
                Recurring
              </Button>
              
              <Button
                variant={activeView === 'achievements' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('achievements')}
                className={`button-glow transition-all duration-300 ${activeView === 'achievements' ? 'neon-glow' : ''}`}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Achievements
              </Button>
              
              <Button
                variant={activeView === 'progress' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('progress')}
                className={`button-glow transition-all duration-300 ${activeView === 'progress' ? 'neon-glow' : ''}`}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="fade-in-up">
          {activeView === 'quests' && <QuestDashboard />}
          {activeView === 'recurring' && <RecurringQuestDashboard />}
          {activeView === 'achievements' && (
            <AchievementDashboard stats={stats} userAchievements={achievements} />
          )}
          {activeView === 'progress' && <LevelProgress stats={stats} />}
        </div>
      </div>
    </div>
  )
}
