import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'

// GET /api/users/stats - Get user statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user with XP points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xpPoints: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get task statistics
    const [completedTasks, totalTasksCreated, recentCompletions] = await Promise.all([
      // Count completed tasks assigned to user
      prisma.task.count({
        where: {
          assignedToId: userId,
          completedAt: { not: null }
        }
      }),
      
      // Count total tasks created by user
      prisma.task.count({
        where: {
          createdById: userId
        }
      }),
      
      // Get recent completions for streak calculation
      prisma.task.findMany({
        where: {
          assignedToId: userId,
          completedAt: { not: null }
        },
        select: {
          completedAt: true
        },
        orderBy: {
          completedAt: 'desc'
        },
        take: 30 // Get last 30 completions for streak analysis
      })
    ])

    // Calculate level (every 100 XP = 1 level)
    const level = Math.floor(user.xpPoints / 100) + 1

    // Calculate streaks
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    if (recentCompletions.length > 0) {
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      
      const completionDates = recentCompletions.map(task => {
        const date = new Date(task.completedAt!)
        date.setHours(23, 59, 59, 999)
        return date
      })

      // Calculate current streak (consecutive days from today backwards)
      const checkDate = new Date(today)
      for (let i = 0; i < 30; i++) {
        const hasCompletionOnDay = completionDates.some(date => 
          date.toDateString() === checkDate.toDateString()
        )
        
        if (hasCompletionOnDay) {
          currentStreak++
        } else {
          break
        }
        
        checkDate.setDate(checkDate.getDate() - 1)
      }

      // Calculate longest streak
      const uniqueDates = [...new Set(completionDates.map(date => date.toDateString()))]
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

      tempStreak = 1
      longestStreak = 1

      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1])
        const currDate = new Date(uniqueDates[i])
        const diffInDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffInDays === 1) {
          tempStreak++
          longestStreak = Math.max(longestStreak, tempStreak)
        } else {
          tempStreak = 1
        }
      }
    }

    const stats = {
      totalXP: user.xpPoints,
      level,
      questsCompleted: completedTasks,
      currentStreak,
      longestStreak,
      totalQuestsCreated: totalTasksCreated
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}