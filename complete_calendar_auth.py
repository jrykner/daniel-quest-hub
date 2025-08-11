#!/usr/bin/env python3
"""
Complete Google Calendar Authentication with authorization code
"""

from google_auth_oauthlib.flow import InstalledAppFlow
import sys

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
CREDENTIALS_FILE = '/root/gcp-oauth.keys.json'
TOKEN_FILE = '/root/token.json'

def complete_auth(auth_code):
    """Complete authentication with authorization code"""
    try:
        flow = InstalledAppFlow.from_client_secrets_file(
            CREDENTIALS_FILE, SCOPES)
        
        flow.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob'
        
        # Exchange authorization code for credentials
        flow.fetch_token(code=auth_code)
        creds = flow.credentials
        
        # Save the credentials
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
        
        print("✅ Authentication successful!")
        print(f"Credentials saved to {TOKEN_FILE}")
        return True
        
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 complete_calendar_auth.py <authorization_code>")
        sys.exit(1)
    
    auth_code = sys.argv[1]
    success = complete_auth(auth_code)
    sys.exit(0 if success else 1)