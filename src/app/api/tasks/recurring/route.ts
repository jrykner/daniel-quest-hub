import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { PrismaClient, TaskPriority, TaskCategory } from '../../../../generated/prisma';
import { RecurringTaskService } from '@/services/recurringTasks';
import GoogleCalendarService from '@/services/googleCalendar';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      title,
      description,
      priority,
      category,
      xpReward,
      dueDate,
      recurrencePattern,
      syncToCalendar,
      assignedToEmail
    } = await request.json();

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { calendarTokens: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get assigned user (for Daniel's case, it's likely Daniel)
    const assignedUser = assignedToEmail 
      ? await prisma.user.findUnique({ where: { email: assignedToEmail } })
      : user;

    if (!assignedUser) {
      return NextResponse.json({ error: 'Assigned user not found' }, { status: 404 });
    }

    // Validate recurrence pattern
    const validationErrors = RecurringTaskService.validateRecurrencePattern(recurrencePattern);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Invalid recurrence pattern', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Create the base recurring task
    const baseTask = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority.toUpperCase() as TaskPriority,
        category: category.toUpperCase() as TaskCategory,
        xpReward,
        dueDate: new Date(dueDate),
        isRecurring: true,
        recurringPattern: JSON.stringify(recurrencePattern),
        assignedToId: assignedUser.id,
        createdById: user.id,
      },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    // Generate next few occurrences and create individual task instances
    const questForGeneration = {
      ...baseTask,
      status: 'active' as const,
      priority: baseTask.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      category: baseTask.category.toLowerCase() as 'school' | 'health' | 'chores' | 'personal',
      assignedTo: {
        id: baseTask.assignedTo.id,
        name: baseTask.assignedTo.name || '',
        role: baseTask.assignedTo.role,
      },
      createdBy: {
        id: baseTask.createdBy.id,
        name: baseTask.createdBy.name || '',
        role: baseTask.createdBy.role,
      },
      recurrencePattern,
    };
    
    const nextOccurrences = RecurringTaskService.generateNextOccurrences(
      questForGeneration,
      new Date(dueDate),
      5 // Create next 5 occurrences
    );

    const createdInstances = [];

    for (const occurrence of nextOccurrences) {
      const instanceData = RecurringTaskService.createRecurringQuestInstance(
        questForGeneration,
        occurrence.dueDate,
        occurrence.instanceNumber
      );

      const instance = await prisma.task.create({
        data: {
          title: instanceData.title,
          description: instanceData.description,
          assignedToId: assignedUser.id,
          createdById: user.id,
          dueDate: instanceData.dueDate,
          completedAt: instanceData.completedAt,
          priority: instanceData.priority.toUpperCase() as TaskPriority,
          category: instanceData.category.toUpperCase() as TaskCategory,
          xpReward: instanceData.xpReward,
          isRecurring: instanceData.isRecurring,
        },
      });

      // Sync to calendar if requested and tokens available
      if (syncToCalendar && user.calendarTokens) {
        try {
          const calendarService = new GoogleCalendarService(
            user.calendarTokens.accessToken,
            user.calendarTokens.refreshToken || ''
          );

          const event = GoogleCalendarService.questToCalendarEvent(instance, occurrence.dueDate);
          const eventId = await calendarService.createEvent(event);

          await prisma.task.update({
            where: { id: instance.id },
            data: { googleCalendarEventId: eventId },
          });

          createdInstances.push({ ...instance, googleCalendarEventId: eventId });
        } catch (calendarError) {
          console.error('Calendar sync error for instance:', calendarError);
          createdInstances.push(instance);
        }
      } else {
        createdInstances.push(instance);
      }
    }

    return NextResponse.json({
      success: true,
      baseTask,
      instances: createdInstances,
      message: `Created recurring task with ${createdInstances.length} upcoming instances`,
    });

  } catch (error) {
    console.error('Create recurring task error:', error);
    return NextResponse.json(
      { error: 'Failed to create recurring task' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all recurring base tasks created by or assigned to the user
    const recurringTasks = await prisma.task.findMany({
      where: {
        isRecurring: true,
        OR: [
          { createdById: user.id },
          { assignedToId: user.id },
        ],
      },
      include: {
        assignedTo: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ recurringTasks });

  } catch (error) {
    console.error('Get recurring tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to get recurring tasks' }, 
      { status: 500 }
    );
  }
}