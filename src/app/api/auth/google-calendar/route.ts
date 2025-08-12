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

    // Get base URL for redirects (Vercel sets VERCEL_URL, fallback to NEXTAUTH_URL or localhost)
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                   'http://localhost:3000';

    if (!baseUrl) {
      return NextResponse.json({ 
        error: 'Unable to determine base URL for OAuth callback.' 
      }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${baseUrl}/api/auth/google-calendar/callback`,
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