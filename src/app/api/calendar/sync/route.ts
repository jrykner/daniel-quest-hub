import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '../../../../generated/prisma';
import GoogleCalendarService from '@/services/googleCalendar';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, syncToCalendar } = await request.json();

    // Get user and calendar tokens
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { calendarTokens: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (syncToCalendar) {
      // Sync to calendar
      if (!user.calendarTokens) {
        return NextResponse.json(
          { error: 'Google Calendar not connected' }, 
          { status: 400 }
        );
      }

      const calendarService = new GoogleCalendarService(
        user.calendarTokens.accessToken,
        user.calendarTokens.refreshToken || ''
      );

      if (task.dueDate) {
        let eventId: string | undefined;

        if (task.isRecurring && task.recurringPattern) {
          // Create recurring event
          const event = GoogleCalendarService.questToCalendarEvent(task, task.dueDate);
          const pattern = JSON.parse(task.recurringPattern as string);
          event.recurrence = GoogleCalendarService.generateRecurrenceRule(pattern);
          eventId = await calendarService.createEvent(event);
        } else {
          // Create single event
          const event = GoogleCalendarService.questToCalendarEvent(task, task.dueDate);
          eventId = await calendarService.createEvent(event);
        }

        // Update task with calendar event ID
        await prisma.task.update({
          where: { id: taskId },
          data: { 
            googleCalendarEventId: eventId,
          },
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Task synced to calendar',
          eventId 
        });
      } else {
        return NextResponse.json(
          { error: 'Task must have a due date to sync to calendar' }, 
          { status: 400 }
        );
      }
    } else {
      // Remove from calendar
      if (task.googleCalendarEventId && user.calendarTokens) {
        const calendarService = new GoogleCalendarService(
          user.calendarTokens.accessToken,
          user.calendarTokens.refreshToken || ''
        );

        try {
          await calendarService.deleteEvent(task.googleCalendarEventId);
        } catch (error) {
          console.error('Error deleting calendar event:', error);
          // Continue even if delete fails (event might already be deleted)
        }

        // Remove calendar event ID from task
        await prisma.task.update({
          where: { id: taskId },
          data: { 
            googleCalendarEventId: null,
          },
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Task removed from calendar' 
      });
    }
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with calendar' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { calendarTokens: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isConnected = !!user.calendarTokens;
    
    return NextResponse.json({ 
      isConnected,
      provider: user.calendarTokens?.provider || null,
    });
  } catch (error) {
    console.error('Calendar status error:', error);
    return NextResponse.json(
      { error: 'Failed to get calendar status' }, 
      { status: 500 }
    );
  }
}