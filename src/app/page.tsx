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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-400 mx-auto mb-4"></div>
          <p className="text-primary-400 text-lg font-gaming">Loading Quest Hub...</p>
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
      <div className="border-b border-gaming-border bg-gaming-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="font-gaming text-xl font-bold">
              <span className="gaming-gradient bg-clip-text text-transparent">
                Daniel&apos;s Quest Hub
              </span>
            </h1>
            
            <div className="flex gap-2">
              <Button
                variant={activeView === 'quests' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('quests')}
              >
                <HomeIcon className="h-4 w-4 mr-1" />
                Quests
              </Button>
              
              <Button
                variant={activeView === 'recurring' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('recurring')}
              >
                <Repeat className="h-4 w-4 mr-1" />
                Recurring
              </Button>
              
              <Button
                variant={activeView === 'achievements' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('achievements')}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Achievements
              </Button>
              
              <Button
                variant={activeView === 'progress' ? 'gaming' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('progress')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Progress
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {activeView === 'quests' && <QuestDashboard />}
        {activeView === 'recurring' && <RecurringQuestDashboard />}
        {activeView === 'achievements' && (
          <AchievementDashboard stats={stats} userAchievements={achievements} />
        )}
        {activeView === 'progress' && <LevelProgress stats={stats} />}
      </div>
    </div>
  )
}
