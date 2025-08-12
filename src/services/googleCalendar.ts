import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence?: string[];
}

export class GoogleCalendarService {
  private calendar;
  private auth: OAuth2Client;

  constructor(accessToken: string, refreshToken: string) {
    this.auth = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });

    this.auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  async createEvent(event: CalendarEvent): Promise<string | undefined> {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      return response.data.id || undefined;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<void> {
    try {
      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: event,
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  async getEvents(timeMin: Date, timeMax: Date): Promise<unknown[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  // Convert quest/task to Google Calendar event
  static questToCalendarEvent(quest: { title: string; description?: string | null; category: string; priority: string; xpReward: number }, dueDate: Date): CalendarEvent {
    const startTime = new Date(dueDate);
    const endTime = new Date(dueDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    return {
      summary: `🎯 ${quest.title}`,
      description: `${quest.description || ''}\n\nCategory: ${quest.category}\nPriority: ${quest.priority}\nXP Reward: ${quest.xpReward}\n\nFrom Daniel's Quest Hub`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Asia/Jerusalem',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Asia/Jerusalem',
      },
    };
  }

  // Generate recurrence rules for recurring tasks
  static generateRecurrenceRule(pattern: {
    type: 'daily' | 'weekly' | 'monthly';
    interval?: number;
    daysOfWeek?: number[];
    endDate?: Date;
  }): string[] {
    let rule = 'RRULE:';
    
    switch (pattern.type) {
      case 'daily':
        rule += `FREQ=DAILY;INTERVAL=${pattern.interval || 1}`;
        break;
      case 'weekly':
        rule += `FREQ=WEEKLY;INTERVAL=${pattern.interval || 1}`;
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          const days = pattern.daysOfWeek.map(day => ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'][day]).join(',');
          rule += `;BYDAY=${days}`;
        }
        break;
      case 'monthly':
        rule += `FREQ=MONTHLY;INTERVAL=${pattern.interval || 1}`;
        break;
    }

    if (pattern.endDate) {
      const endDateStr = pattern.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      rule += `;UNTIL=${endDateStr}`;
    }

    return [rule];
  }
}

export default GoogleCalendarService;