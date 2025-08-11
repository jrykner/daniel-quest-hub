#!/usr/bin/env python3
"""
Morning Briefing Script
Sends daily morning brief with:
- Google Calendar events for today
- Weather forecast for Jerusalem, Israel
Runs Sunday-Thursday at 9am Israel time
"""

import requests
import json
import logging
from datetime import datetime, timedelta
import pytz
from typing import List, Dict, Optional

# Configuration
BOT_TOKEN = "8358234418:AAGolr1H61F3FMaDh1yUm8mnpQ4uqR8RUuw"
CHAT_ID = "675804123"

# Weather API (OpenWeatherMap free tier)
WEATHER_API_KEY = "your_openweather_api_key"  # Get from https://openweathermap.org/api
JERUSALEM_LAT = "31.7683"
JERUSALEM_LON = "35.2137"

# Google Calendar credentials
CALENDAR_CREDENTIALS_FILE = "/root/gcp-oauth.keys.json"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/root/morning_briefing.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MorningBriefing:
    def __init__(self):
        self.israel_tz = pytz.timezone('Asia/Jerusalem')
    
    def escape_html(self, text: str) -> str:
        """Escape HTML characters to prevent Telegram parsing errors"""
        if not text:
            return text
        
        # Replace HTML special characters
        text = text.replace('&', '&amp;')
        text = text.replace('<', '&lt;')
        text = text.replace('>', '&gt;')
        # Remove or replace problematic characters that might break HTML parsing
        text = text.replace('"', "'")
        
        return text
    
    def should_run_today(self) -> bool:
        """Check if we should run today (Sunday-Thursday)"""
        now_israel = datetime.now(self.israel_tz)
        weekday = now_israel.weekday()  # Monday=0, Sunday=6
        
        # Run Sunday (6) through Thursday (3)
        return weekday in [6, 0, 1, 2, 3]  # Sunday, Monday, Tuesday, Wednesday, Thursday
    
    def get_weather_forecast(self) -> str:
        """Get weather forecast for Jerusalem"""
        try:
            # Using OpenWeatherMap free API
            if WEATHER_API_KEY == "your_openweather_api_key":
                # Fallback to wttr.in (no API key needed)
                url = f"https://wttr.in/Jerusalem?format=j1"
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                current = data['current_condition'][0]
                today = data['weather'][0]
                
                temp_c = current['temp_C']
                feels_like = current['FeelsLikeC']
                desc = current['weatherDesc'][0]['value']
                max_temp = today['maxtempC']
                min_temp = today['mintempC']
                
                weather_text = (
                    f"🌤️ <b>Jerusalem Weather</b>\n"
                    f"Current: {temp_c}°C (feels like {feels_like}°C)\n"
                    f"Today: {min_temp}°C - {max_temp}°C\n"
                    f"Conditions: {desc}"
                )
            else:
                # OpenWeatherMap API
                url = f"https://api.openweathermap.org/data/2.5/weather"
                params = {
                    'lat': JERUSALEM_LAT,
                    'lon': JERUSALEM_LON,
                    'appid': WEATHER_API_KEY,
                    'units': 'metric'
                }
                
                response = requests.get(url, params=params, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                temp = data['main']['temp']
                feels_like = data['main']['feels_like']
                temp_max = data['main']['temp_max']
                temp_min = data['main']['temp_min']
                desc = data['weather'][0]['description'].title()
                
                weather_text = (
                    f"🌤️ <b>Jerusalem Weather</b>\n"
                    f"Current: {temp:.1f}°C (feels like {feels_like:.1f}°C)\n"
                    f"Today: {temp_min:.1f}°C - {temp_max:.1f}°C\n"
                    f"Conditions: {desc}"
                )
                
            return weather_text
            
        except Exception as e:
            logger.error(f"Failed to get weather: {e}")
            return "🌤️ <b>Jerusalem Weather</b>\nUnable to fetch weather data"
    
    def get_calendar_events(self) -> str:
        """Get today's calendar events from Google Calendar"""
        try:
            from google.auth.transport.requests import Request
            from google.oauth2.credentials import Credentials
            from google_auth_oauthlib.flow import InstalledAppFlow
            from googleapiclient.discovery import build
            import os.path
            
            SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
            TOKEN_FILE = '/root/token.json'
            
            creds = None
            # Load existing token
            if os.path.exists(TOKEN_FILE):
                creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
            
            # If there are no valid credentials, get new ones
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    # Skip authentication in automated runs - token must exist
                    logger.warning("No valid credentials and cannot authenticate in automated mode")
                    return "📅 <b>Today's Schedule</b>\n⚠️ Calendar authentication required\nRun: python3 /root/calendar_auth.py"
                
                # Save the credentials for the next run
                with open(TOKEN_FILE, 'w') as token:
                    token.write(creds.to_json())
            
            service = build('calendar', 'v3', credentials=creds)
            
            # Get today's events
            now_israel = datetime.now(self.israel_tz)
            start_of_day = now_israel.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = now_israel.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            events_result = service.events().list(
                calendarId='primary',
                timeMin=start_of_day.isoformat(),
                timeMax=end_of_day.isoformat(),
                maxResults=20,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            if not events:
                return "📅 <b>Today's Schedule</b>\n🆓 No meetings scheduled for today"
            
            calendar_text = "📅 <b>Today's Schedule</b>\n"
            for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                
                # Parse start time
                if 'T' in start:  # Has time
                    event_time = datetime.fromisoformat(start.replace('Z', '+00:00'))
                    if event_time.tzinfo is None:
                        event_time = self.israel_tz.localize(event_time)
                    else:
                        event_time = event_time.astimezone(self.israel_tz)
                    time_str = event_time.strftime('%H:%M')
                else:  # All-day event
                    time_str = "All day"
                
                title = event.get('summary', 'No title')
                location = event.get('location', '')
                
                # Escape HTML characters to prevent parsing errors
                title = self.escape_html(title)
                location = self.escape_html(location)
                
                if location:
                    calendar_text += f"• {time_str} - {title} ({location})\n"
                else:
                    calendar_text += f"• {time_str} - {title}\n"
            
            return calendar_text
            
        except ImportError:
            logger.error("Google Calendar libraries not installed")
            return "📅 <b>Today's Schedule</b>\n⚠️ Google Calendar libraries not available"
        except FileNotFoundError:
            logger.error(f"Credentials file not found: {CALENDAR_CREDENTIALS_FILE}")
            return "📅 <b>Today's Schedule</b>\n⚠️ Google Calendar credentials not found"
        except Exception as e:
            logger.error(f"Failed to get calendar events: {e}")
            return "📅 <b>Today's Schedule</b>\n⚠️ Unable to fetch calendar events"
    
    def send_telegram_message(self, message: str) -> bool:
        """Send message via Telegram bot"""
        try:
            url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
            payload = {
                'chat_id': CHAT_ID,
                'text': message,
                'parse_mode': 'HTML'
            }
            response = requests.post(url, data=payload, timeout=10)
            response.raise_for_status()
            logger.info("Morning briefing sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return False
    
    def generate_briefing(self) -> str:
        """Generate complete morning briefing"""
        now_israel = datetime.now(self.israel_tz)
        date_str = now_israel.strftime('%A, %B %d, %Y')
        
        weather = self.get_weather_forecast()
        calendar = self.get_calendar_events()
        
        briefing = (
            f"🌅 <b>Good Morning!</b>\n"
            f"📆 {date_str}\n\n"
            f"{weather}\n\n"
            f"{calendar}\n\n"
            f"Have a great day! 😊"
        )
        
        return briefing
    
    def run(self):
        """Main execution function"""
        if not self.should_run_today():
            logger.info("Not running today (Friday or Saturday)")
            return
        
        logger.info("Generating morning briefing...")
        briefing = self.generate_briefing()
        
        if self.send_telegram_message(briefing):
            logger.info("Morning briefing completed successfully")
        else:
            logger.error("Failed to send morning briefing")

if __name__ == "__main__":
    briefing = MorningBriefing()
    briefing.run()