import { RecurrencePattern, Quest } from '../types/quest';
import { addDays, addWeeks, addMonths, isBefore, format } from 'date-fns';

export class RecurringTaskService {
  static generateNextOccurrences(
    baseQuest: Quest, 
    fromDate: Date, 
    maxOccurrences = 10
  ): Array<{ dueDate: Date; instanceNumber: number }> {
    if (!baseQuest.isRecurring || !baseQuest.recurrencePattern) {
      return [];
    }

    const pattern = baseQuest.recurrencePattern;
    const occurrences: Array<{ dueDate: Date; instanceNumber: number }> = [];
    let currentDate = new Date(fromDate);
    let instanceNumber = 1;

    while (
      occurrences.length < maxOccurrences &&
      (!pattern.endDate || isBefore(currentDate, pattern.endDate)) &&
      (!pattern.maxOccurrences || instanceNumber <= pattern.maxOccurrences)
    ) {
      let nextDate: Date;

      switch (pattern.type) {
        case 'daily':
          nextDate = addDays(currentDate, pattern.interval);
          break;
        case 'weekly':
          if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
            nextDate = this.getNextWeeklyOccurrence(currentDate, pattern);
          } else {
            nextDate = addWeeks(currentDate, pattern.interval);
          }
          break;
        case 'monthly':
          nextDate = addMonths(currentDate, pattern.interval);
          break;
        default:
          throw new Error(`Unsupported recurrence type: ${pattern.type}`);
      }

      if (pattern.endDate && !isBefore(nextDate, pattern.endDate)) {
        break;
      }

      occurrences.push({
        dueDate: nextDate,
        instanceNumber: instanceNumber,
      });

      currentDate = nextDate;
      instanceNumber++;
    }

    return occurrences;
  }

  private static getNextWeeklyOccurrence(
    currentDate: Date, 
    pattern: RecurrencePattern
  ): Date {
    if (!pattern.daysOfWeek || pattern.daysOfWeek.length === 0) {
      return addWeeks(currentDate, pattern.interval);
    }

    const currentDayOfWeek = currentDate.getDay();
    const sortedDays = [...pattern.daysOfWeek].sort((a, b) => a - b);
    
    // Find the next day in the current week
    const nextDay = sortedDays.find(day => day > currentDayOfWeek);
    
    if (nextDay !== undefined) {
      // Next occurrence is in the current week
      const daysToAdd = nextDay - currentDayOfWeek;
      return addDays(currentDate, daysToAdd);
    } else {
      // Next occurrence is in a future week
      const weeksToAdd = pattern.interval;
      const firstDayOfNextCycle = sortedDays[0];
      const daysIntoNextWeek = firstDayOfNextCycle;
      const daysToNextWeek = 7 - currentDayOfWeek;
      
      return addDays(
        currentDate, 
        daysToNextWeek + (weeksToAdd - 1) * 7 + daysIntoNextWeek
      );
    }
  }

  static createRecurringQuestInstance(
    baseQuest: Quest,
    dueDate: Date,
    instanceNumber: number
  ): Omit<Quest, 'id'> {
    return {
      title: `${baseQuest.title} (#${instanceNumber})`,
      description: baseQuest.description,
      priority: baseQuest.priority,
      status: 'active',
      category: baseQuest.category,
      xpReward: baseQuest.xpReward,
      createdAt: new Date(),
      dueDate,
      assignedTo: baseQuest.assignedTo,
      createdBy: baseQuest.createdBy,
      isRecurring: false, // Individual instances are not recurring
      syncToCalendar: baseQuest.syncToCalendar,
    };
  }

  static getRecurrenceDescription(pattern: RecurrencePattern): string {
    const { type, interval, daysOfWeek, endDate } = pattern;

    let description = '';
    
    switch (type) {
      case 'daily':
        description = interval === 1 ? 'Daily' : `Every ${interval} days`;
        break;
      case 'weekly':
        if (daysOfWeek && daysOfWeek.length > 0) {
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const selectedDays = daysOfWeek.map(day => dayNames[day]).join(', ');
          description = interval === 1 
            ? `Weekly on ${selectedDays}`
            : `Every ${interval} weeks on ${selectedDays}`;
        } else {
          description = interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
        }
        break;
      case 'monthly':
        description = interval === 1 ? 'Monthly' : `Every ${interval} months`;
        break;
    }

    if (endDate) {
      description += ` until ${format(endDate, 'MMM dd, yyyy')}`;
    }

    return description;
  }

  static validateRecurrencePattern(pattern: RecurrencePattern): string[] {
    const errors: string[] = [];

    if (pattern.interval < 1) {
      errors.push('Interval must be at least 1');
    }

    if (pattern.type === 'weekly' && pattern.daysOfWeek) {
      const invalidDays = pattern.daysOfWeek.filter(day => day < 0 || day > 6);
      if (invalidDays.length > 0) {
        errors.push('Days of week must be between 0 (Sunday) and 6 (Saturday)');
      }
    }

    if (pattern.endDate && isBefore(pattern.endDate, new Date())) {
      errors.push('End date must be in the future');
    }

    if (pattern.maxOccurrences !== undefined && pattern.maxOccurrences < 1) {
      errors.push('Maximum occurrences must be at least 1');
    }

    return errors;
  }
}

export default RecurringTaskService;