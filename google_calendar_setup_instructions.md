# Google Calendar MCP Setup Instructions

## Step 1: Create Google Cloud Project & Credentials

### 1.1 Enable Calendar API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Library"
4. Search for "Google Calendar API" and enable it

### 1.2 Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Desktop application" as application type
4. Name it "Claude Calendar MCP" 
5. Download the JSON file

### 1.3 Add Test User (Required for testing)
1. Go to "APIs & Services" > "OAuth consent screen"
2. Add your email address under "Test users"

## Step 2: Save Credentials File

Save the downloaded JSON file as `/root/gcp-oauth.keys.json`

The file should look like this:
```json
{
  "installed": {
    "client_id": "your-client-id.googleusercontent.com",
    "client_secret": "your-client-secret",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
  }
}
```

## Step 3: Update MCP Configuration

I'll update the Claude MCP configuration automatically once you provide the credentials file.

## Step 4: Test the Setup

After setup, the morning briefing script will be able to:
- Read your calendar events for today
- Display meeting times and titles
- Show your daily schedule in the morning brief

## Next Steps

1. Complete steps 1-2 above
2. Let me know when you have the credentials file ready
3. I'll configure the MCP server and test it
4. Update the morning briefing script to use real calendar data