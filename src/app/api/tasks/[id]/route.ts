import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/db'
import { TaskPriority, TaskCategory } from '../../../../generated/prisma'

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if task exists and user has permission
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { assignedTo: true, createdBy: true }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check permission: user must be creator or assignee
    if (existingTask.createdById !== session.user.id && existingTask.assignedToId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, description, priority, category, dueDate, xpReward, status } = body

    // Handle completion
    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (priority !== undefined) updateData.priority = priority.toUpperCase() as TaskPriority
    if (category !== undefined) updateData.category = category.toUpperCase() as TaskCategory
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (xpReward !== undefined) updateData.xpReward = xpReward

    // Handle status change (completion)
    if (status === 'completed' && !existingTask.completedAt) {
      updateData.completedAt = new Date()
      
      // Award XP to the assigned user
      await prisma.user.update({
        where: { id: existingTask.assignedToId },
        data: {
          xpPoints: {
            increment: existingTask.xpReward
          }
        }
      })
    } else if (status === 'active' && existingTask.completedAt) {
      updateData.completedAt = null
      
      // Remove XP from the assigned user (if they haven't spent it)
      const user = await prisma.user.findUnique({ where: { id: existingTask.assignedToId } })
      if (user && user.xpPoints >= existingTask.xpReward) {
        await prisma.user.update({
          where: { id: existingTask.assignedToId },
          data: {
            xpPoints: {
              decrement: existingTask.xpReward
            }
          }
        })
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
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
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description || '',
      priority: updatedTask.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      category: updatedTask.category.toLowerCase() as 'school' | 'health' | 'chores' | 'personal',
      dueDate: updatedTask.dueDate?.toISOString(),
      xpReward: updatedTask.xpReward,
      status: updatedTask.completedAt ? 'completed' as const : 'active' as const,
      completedAt: updatedTask.completedAt?.toISOString(),
      createdAt: updatedTask.createdAt.toISOString(),
      assignedTo: {
        id: updatedTask.assignedTo.id,
        name: updatedTask.assignedTo.name || 'Unknown',
        role: updatedTask.assignedTo.role
      },
      createdBy: {
        id: updatedTask.createdBy.id,
        name: updatedTask.createdBy.name || 'Unknown',
        role: updatedTask.createdBy.role
      }
    }

    return NextResponse.json(quest)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if task exists and user has permission
    const existingTask = await prisma.task.findUnique({
      where: { id }
    })

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Only creator can delete tasks
    if (existingTask.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.task.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}