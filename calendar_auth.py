#!/usr/bin/env python3
"""
Google Calendar Authentication Helper
Run this script to authenticate your Google Calendar access
"""

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
import os.path
import json

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
CREDENTIALS_FILE = '/root/gcp-oauth.keys.json'
TOKEN_FILE = '/root/token.json'

def authenticate():
    """Authenticate and save token"""
    creds = None
    
    # Load existing token
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        print("Existing credentials found!")
    
    # If there are no valid credentials, get new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired credentials...")
            creds.refresh(Request())
        else:
            print("Starting OAuth flow...")
            print("Please visit the URL that will be displayed and authorize the application.")
            
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES)
            
            # Set redirect URI for installed app
            flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
            
            # Generate authorization URL
            auth_url, _ = flow.authorization_url(prompt='consent')
            print(f"\nPlease visit this URL to authorize the application:")
            print(f"{auth_url}")
            print(f"\nAfter authorization, Google will show you an authorization code.")
            print(f"Copy that code and provide it to Claude.")
            
            return None  # Return None to indicate manual intervention needed
        
        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
        
        print(f"Credentials saved to {TOKEN_FILE}")
    else:
        print("Valid credentials already exist!")
    
    return creds

if __name__ == "__main__":
    print("Google Calendar Authentication Helper")
    print("=" * 40)
    
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"Error: Credentials file not found at {CREDENTIALS_FILE}")
        print("Please ensure you've downloaded your OAuth credentials from Google Cloud Console")
        exit(1)
    
    try:
        creds = authenticate()
        print("✅ Authentication successful!")
        print("The morning briefing script can now access your Google Calendar.")
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        exit(1)