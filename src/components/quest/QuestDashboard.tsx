'use client'

import React, { useState, useEffect } from 'react'
import { Quest, QuestFilters, PlayerStats } from '../../types/quest'
import { QuestAPI } from '../../lib/api'
// import { calculateLevel } from '../../lib/utils'
import { QuestCard } from './QuestCard'
import { QuestForm } from './QuestForm'
import { StatsCard } from './StatsCard'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { UserProfile } from '../ui/UserProfile'
import { 
  Plus, 
  Filter, 
  Search, 
  Trophy,
  Target,
  Clock,
  CheckCircle2
} from 'lucide-react'

export function QuestDashboard() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [stats, setStats] = useState<PlayerStats>({
    totalXP: 0,
    level: 1,
    questsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalQuestsCreated: 0,
  })
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuest, setEditingQuest] = useState<Quest | undefined>()
  const [filters, setFilters] = useState<QuestFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadQuests()
    loadStats()
  }, [])

  const loadQuests = async () => {
    try {
      const loadedQuests = await QuestAPI.getQuests()
      setQuests(loadedQuests)
    } catch (error) {
      console.error('Failed to load quests:', error)
    }
  }

  const loadStats = async () => {
    try {
      const loadedStats = await QuestAPI.getStats()
      setStats(loadedStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }


  // const calculateCurrentStreak = (completedQuests: Quest[]): number => {
  //   if (completedQuests.length === 0) return 0
  //   
  //   const today = new Date()
  //   const sortedCompleted = completedQuests
  //     .filter(q => q.completedAt)
  //     .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
  //   
  //   let streak = 0
  //   const checkDate = new Date(today)
  //   checkDate.setHours(0, 0, 0, 0)
  //   
  //   for (let i = 0; i < 30; i++) { // Check last 30 days max
  //     const hasQuestOnDate = sortedCompleted.some(quest => {
  //       const completedDate = new Date(quest.completedAt!)
  //       completedDate.setHours(0, 0, 0, 0)
  //       return completedDate.getTime() === checkDate.getTime()
  //     })
  //     
  //     if (hasQuestOnDate) {
  //       streak++
  //       checkDate.setDate(checkDate.getDate() - 1)
  //     } else if (i === 0 && checkDate.getTime() !== today.setHours(0, 0, 0, 0)) {
  //       // If no quest today but we haven't checked today yet, don't break streak
  //       checkDate.setDate(checkDate.getDate() - 1)
  //     } else {
  //       break
  //     }
  //   }
  //   
  //   return streak
  // }

  const saveQuest = async (quest: Quest) => {
    try {
      if (editingQuest) {
        const updatedQuest = await QuestAPI.updateQuest(quest.id, quest)
        setQuests(quests.map(q => q.id === quest.id ? updatedQuest : q))
      } else {
        const newQuest = await QuestAPI.createQuest(quest)
        setQuests([...quests, newQuest])
      }
      
      // Refresh stats after saving
      loadStats()
      setIsModalOpen(false)
      setEditingQuest(undefined)
    } catch (error) {
      console.error('Failed to save quest:', error)
    }
  }

  const completeQuest = async (questId: string) => {
    try {
      const updatedQuest = await QuestAPI.updateQuest(questId, { status: 'completed' })
      setQuests(quests.map(q => q.id === questId ? updatedQuest : q))
      loadStats() // Refresh stats after completion
    } catch (error) {
      console.error('Failed to complete quest:', error)
    }
  }

  const deleteQuest = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return
    
    try {
      await QuestAPI.deleteQuest(questId)
      setQuests(quests.filter(quest => quest.id !== questId))
      loadStats() // Refresh stats after deletion
    } catch (error) {
      console.error('Failed to delete quest:', error)
    }
  }

  const toggleQuestStatus = async (questId: string) => {
    try {
      const quest = quests.find(q => q.id === questId)
      if (!quest) return
      
      const newStatus = quest.status === 'active' ? 'paused' : 'active'
      const updatedQuest = await QuestAPI.updateQuest(questId, { status: newStatus })
      setQuests(quests.map(q => q.id === questId ? updatedQuest : q))
    } catch (error) {
      console.error('Failed to toggle quest status:', error)
    }
  }

  const editQuest = (quest: Quest) => {
    setEditingQuest(quest)
    setIsModalOpen(true)
  }

  const openNewQuestModal = () => {
    setEditingQuest(undefined)
    setIsModalOpen(true)
  }

  // Filter and sort quests
  const filteredQuests = quests
    .filter(quest => {
      if (filters.status && quest.status !== filters.status) return false
      if (filters.priority && quest.priority !== filters.priority) return false
      if (filters.category && quest.category !== filters.category) return false
      if (searchQuery && !quest.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let aValue: number | Date
      let bValue: number | Date
      
      switch (filters.sortBy) {
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case 'dueDate':
          aValue = a.dueDate?.getTime() || Infinity
          bValue = b.dueDate?.getTime() || Infinity
          break
        case 'xpReward':
          aValue = a.xpReward
          bValue = b.xpReward
          break
        default:
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
      }
      
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

  const activeQuests = quests.filter(q => q.status === 'active').length
  const completedQuests = quests.filter(q => q.status === 'completed').length
  const overdue = quests.filter(q => 
    q.status === 'active' && q.dueDate && q.dueDate < new Date()
  ).length

  return (
    <div className="min-h-screen bg-gradient-gaming">
      <div className="container mx-auto px-4 py-8">
        {/* User Profile */}
        <UserProfile />
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <h1 className="font-gaming text-4xl font-bold mb-2">
              <span className="gaming-gradient bg-clip-text text-transparent">
                Daniel&apos;s Quest Hub
              </span>
            </h1>
            <p className="text-text-secondary text-lg">
              Manage your epic quests and level up your productivity!
            </p>
          </div>
          
          <div className="lg:w-80">
            <StatsCard stats={stats} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary-400" />
              <span className="text-2xl font-bold text-primary-400">{activeQuests}</span>
            </div>
            <p className="text-sm text-text-secondary">Active Quests</p>
          </div>
          
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">{completedQuests}</span>
            </div>
            <p className="text-sm text-text-secondary">Completed</p>
          </div>
          
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-red-400" />
              <span className="text-2xl font-bold text-red-400">{overdue}</span>
            </div>
            <p className="text-sm text-text-secondary">Overdue</p>
          </div>
          
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">{stats.level}</span>
            </div>
            <p className="text-sm text-text-secondary">Current Level</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search quests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="px-3"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={openNewQuestModal}
            variant="gaming"
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Quest
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'paused', label: 'Paused' },
                ]}
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as 'active' | 'completed' | 'paused' | undefined }))}
              />
              
              <Select
                options={[
                  { value: '', label: 'All Priorities' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
                value={filters.priority || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' | undefined }))}
              />
              
              <Select
                options={[
                  { value: 'createdAt', label: 'Sort by Date' },
                  { value: 'priority', label: 'Sort by Priority' },
                  { value: 'dueDate', label: 'Sort by Due Date' },
                  { value: 'xpReward', label: 'Sort by XP' },
                ]}
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as 'createdAt' | 'priority' | 'dueDate' | 'xpReward' }))}
              />
              
              <Select
                options={[
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' },
                ]}
                value={filters.sortOrder || 'desc'}
                onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
              />
            </div>
          </div>
        )}

        {/* Quest Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="font-gaming text-xl font-semibold text-text-primary mb-2">
                {quests.length === 0 ? 'No Quests Yet!' : 'No Matching Quests'}
              </h3>
              <p className="text-text-secondary mb-6">
                {quests.length === 0 
                  ? 'Create your first quest to start your adventure!'
                  : 'Try adjusting your filters or search query.'
                }
              </p>
              {quests.length === 0 && (
                <Button onClick={openNewQuestModal} variant="gaming">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Quest
                </Button>
              )}
            </div>
          ) : (
            filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={completeQuest}
                onEdit={editQuest}
                onDelete={deleteQuest}
                onToggleStatus={toggleQuestStatus}
              />
            ))
          )}
        </div>

        {/* Quest Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingQuest(undefined)
          }}
          title={editingQuest ? 'Edit Quest' : 'Create New Quest'}
          className="max-w-2xl"
        >
          <QuestForm
            quest={editingQuest}
            onSave={saveQuest}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingQuest(undefined)
            }}
          />
        </Modal>
      </div>
    </div>
  )
}