import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '../../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  // const state = searchParams.get('state'); // This should be the user email
  
  if (!code) {
    // Get base URL for redirects (Vercel sets VERCEL_URL, fallback to NEXTAUTH_URL or localhost)
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                   'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // Get base URL for redirects (Vercel sets VERCEL_URL, fallback to NEXTAUTH_URL or localhost)
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                   'http://localhost:3000';

    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${baseUrl}/api/auth/google-calendar/callback`,
    });

    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain tokens');
    }

    // Store tokens in database associated with user
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new Error('No user session found');
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Store or update calendar tokens
    await prisma.calendarTokens.upsert({
      where: { userId: user.id },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope,
        tokenType: tokens.token_type,
      },
      create: {
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope,
        tokenType: tokens.token_type,
      },
    });
    
    return NextResponse.redirect(
      `${baseUrl}/?calendar_connected=true`
    );
  } catch (error) {
    console.error('Error in Google Calendar callback:', error);
    // Get base URL for error redirect
    const errorBaseUrl = process.env.NEXTAUTH_URL || 
                        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                        'http://localhost:3000';
    return NextResponse.redirect(
      `${errorBaseUrl}/?error=calendar_auth_failed`
    );
  }
}