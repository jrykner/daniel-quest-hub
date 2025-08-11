# Fix Google OAuth Setup - Access Blocked Error

## The Problem
Your app "mcp-calendar" hasn't completed Google's verification process, so it can only be used by test users.

## Solution Options

### Option 1: Add Yourself as Test User (Quick Fix)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project "mcp-calendar-452614"
3. Go to "APIs & Services" → "OAuth consent screen"
4. Under "Test users", click "Add Users"
5. Add your email address as a test user
6. Save changes

### Option 2: Set to Internal (If using Google Workspace)
1. In "OAuth consent screen"
2. Change "User Type" from "External" to "Internal"
3. This only works if you have a Google Workspace account

### Option 3: Update OAuth Consent Screen (Recommended)
1. Go to "OAuth consent screen"
2. Fill in required fields:
   - App name: "Morning Briefing Bot"
   - User support email: your email
   - App logo: (optional)
   - App domain: (optional)
   - Developer contact: your email
3. Add scopes: `../auth/calendar.readonly`
4. Add your email under "Test users"
5. Save and continue

## After Fixing
Once you've added yourself as a test user or configured the consent screen, try the authorization URL again.

## Current Status
- Google Calendar API: ✅ Enabled
- OAuth Credentials: ✅ Created
- Issue: ❌ Need to add test user or configure consent screen