import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/db'
import { TaskPriority, TaskCategory } from '../../../generated/prisma'

// GET /api/tasks - Get all tasks for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: session.user.id },
          { createdById: session.user.id }
        ]
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match frontend Quest type
    const quests = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      category: task.category.toLowerCase() as 'school' | 'health' | 'chores' | 'personal',
      dueDate: task.dueDate?.toISOString(),
      xpReward: task.xpReward,
      status: task.completedAt ? 'completed' as const : 'active' as const,
      completedAt: task.completedAt?.toISOString(),
      createdAt: task.createdAt.toISOString(),
      isRecurring: task.isRecurring || false,
      recurrencePattern: task.recurringPattern ? JSON.parse(task.recurringPattern as string) : undefined,
      googleCalendarEventId: task.googleCalendarEventId,
      assignedTo: {
        id: task.assignedTo.id,
        name: task.assignedTo.name || 'Unknown',
        role: task.assignedTo.role
      },
      createdBy: {
        id: task.createdBy.id,
        name: task.createdBy.name || 'Unknown',
        role: task.createdBy.role
      }
    }))

    return NextResponse.json(quests)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, priority, category, dueDate, xpReward, assignedToId } = body

    // Validate required fields
    if (!title || !priority || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority: priority.toUpperCase() as TaskPriority,
        category: category.toUpperCase() as TaskCategory,
        dueDate: dueDate ? new Date(dueDate) : null,
        xpReward: xpReward || 10,
        assignedToId: assignedToId || session.user.id,
        createdById: session.user.id
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    // Transform to match frontend Quest type
    const quest = {
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      category: task.category.toLowerCase() as 'school' | 'health' | 'chores' | 'personal',
      dueDate: task.dueDate?.toISOString(),
      xpReward: task.xpReward,
      status: 'active' as const,
      completedAt: undefined,
      createdAt: task.createdAt.toISOString(),
      assignedTo: {
        id: task.assignedTo.id,
        name: task.assignedTo.name || 'Unknown',
        role: task.assignedTo.role
      },
      createdBy: {
        id: task.createdBy.id,
        name: task.createdBy.name || 'Unknown',
        role: task.createdBy.role
      }
    }

    return NextResponse.json(quest, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}