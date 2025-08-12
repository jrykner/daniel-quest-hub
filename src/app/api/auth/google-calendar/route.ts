import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Google Calendar credentials are configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ 
        error: 'Google Calendar integration is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' 
      }, { status: 400 });
    }

    if (!process.env.NEXTAUTH_URL) {
      return NextResponse.json({ 
        error: 'NEXTAUTH_URL environment variable is not set.' 
      }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/google-calendar/callback`,
    });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: session.user?.email || undefined, // Include user identifier in state
    });

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating Google Calendar auth URL:', error);
    return NextResponse.json({ 
      error: 'Failed to generate authorization URL' 
    }, { status: 500 });
  }
}