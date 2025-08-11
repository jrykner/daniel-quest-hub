#!/usr/bin/env python3
"""
USD/ILS Currency Monitor
Sends Telegram notifications when USD/ILS rate moves 0.4% or more intraday
Runs during Israel trading hours: Monday 9am - Friday 2pm Israel time
"""

import requests
import time
import json
import logging
from datetime import datetime
import pytz
from typing import Optional, Dict

# Configuration
BOT_TOKEN = "8358234418:AAGolr1H61F3FMaDh1yUm8mnpQ4uqR8RUuw"
CHAT_ID = "675804123"
THRESHOLD_PERCENT = 0.4  # 0.4% movement threshold
CHECK_INTERVAL = 3600  # Check every hour
DATA_FILE = "/root/usd_ils_data.json"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/root/usd_ils_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class CurrencyMonitor:
    def __init__(self):
        self.israel_tz = pytz.timezone('Asia/Jerusalem')
        self.last_rate = None
        self.daily_open = None
        self.last_alert_rate = None  # Track the rate when last alert was sent
        self.last_notification_time = None
        self.load_data()
    
    def load_data(self):
        """Load persistent data from file"""
        try:
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                self.last_rate = data.get('last_rate')
                self.daily_open = data.get('daily_open')
                self.last_alert_rate = data.get('last_alert_rate')
                self.last_notification_time = data.get('last_notification_time')
        except FileNotFoundError:
            logger.info("No data file found, starting fresh")
        except Exception as e:
            logger.error(f"Error loading data: {e}")
    
    def save_data(self):
        """Save persistent data to file"""
        try:
            data = {
                'last_rate': self.last_rate,
                'daily_open': self.daily_open,
                'last_alert_rate': self.last_alert_rate,
                'last_notification_time': self.last_notification_time
            }
            with open(DATA_FILE, 'w') as f:
                json.dump(data, f)
        except Exception as e:
            logger.error(f"Error saving data: {e}")
    
    def is_trading_hours(self) -> bool:
        """Check if current time is within trading hours (Mon 9am - Fri 2pm Israel time)"""
        now_israel = datetime.now(self.israel_tz)
        weekday = now_israel.weekday()  # Monday = 0, Sunday = 6
        hour = now_israel.hour
        
        # Monday (0) to Friday (4)
        if weekday > 4:  # Saturday (5) or Sunday (6)
            return False
            
        # Monday 9am to Friday 2pm
        if weekday == 0 and hour < 9:  # Monday before 9am
            return False
        if weekday == 4 and hour >= 14:  # Friday after 2pm
            return False
            
        return True
    
    def get_usd_ils_rate(self) -> Optional[float]:
        """Fetch current USD/ILS rate from multiple sources"""
        apis = [
            "https://api.exchangerate-api.com/v4/latest/USD",
            "https://api.exchangerate.host/latest?base=USD&symbols=ILS",
            "https://api.fixer.io/latest?access_key=YOUR_KEY&base=USD&symbols=ILS"  # Needs free API key
        ]
        
        for api_url in apis:
            try:
                if "fixer.io" in api_url:
                    continue  # Skip fixer.io for now as it needs API key
                    
                response = requests.get(api_url, timeout=10)
                response.raise_for_status()
                data = response.json()
                
                if "exchangerate-api.com" in api_url:
                    rate = data.get('rates', {}).get('ILS')
                elif "exchangerate.host" in api_url:
                    rate = data.get('rates', {}).get('ILS')
                
                if rate:
                    logger.info(f"Got rate {rate} from {api_url}")
                    return float(rate)
                    
            except Exception as e:
                logger.warning(f"Failed to get rate from {api_url}: {e}")
                continue
        
        logger.error("Failed to get rate from all APIs")
        return None
    
    def send_telegram_message(self, message: str):
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
            logger.info("Telegram message sent successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to send Telegram message: {e}")
            return False
    
    def check_rate_change(self, current_rate: float) -> bool:
        """Check if rate has changed by threshold amount from last alert or daily open"""
        if not self.daily_open:
            self.daily_open = current_rate
            logger.info(f"Set daily open rate: {self.daily_open}")
            return False
        
        # Determine reference rate: use last alert rate if available, otherwise daily open
        reference_rate = self.last_alert_rate if self.last_alert_rate else self.daily_open
        
        # Calculate percentage change from reference rate
        change_percent = abs((current_rate - reference_rate) / reference_rate * 100)
        
        # Only alert if change is >= threshold from the reference rate
        if change_percent >= THRESHOLD_PERCENT:
            # Calculate change from daily open for display
            daily_change_percent = abs((current_rate - self.daily_open) / self.daily_open * 100)
            direction = "↗️" if current_rate > self.daily_open else "↘️"
            
            message = (
                f"🚨 <b>USD/ILS Alert</b>\n\n"
                f"{direction} Current Rate: <b>{current_rate:.4f}</b>\n"
                f"📊 Daily Open: {self.daily_open:.4f}\n"
                f"📈 Daily Change: <b>{daily_change_percent:.2f}%</b>\n"
                f"🔄 Change from last alert: <b>{change_percent:.2f}%</b>\n"
                f"⏰ Time: {datetime.now(self.israel_tz).strftime('%H:%M:%S Israel')}"
            )
            
            if self.send_telegram_message(message):
                self.last_alert_rate = current_rate  # Update last alert rate
                self.last_notification_time = datetime.now().timestamp()
                logger.info(f"Alert sent - new reference rate set to {current_rate}")
                return True
                    
        return False
    
    def reset_daily_data(self):
        """Reset daily data at start of trading day"""
        now_israel = datetime.now(self.israel_tz)
        
        # Reset on Monday at 9am or if no daily_open is set
        if ((now_israel.weekday() == 0 and now_israel.hour == 9) or 
            not self.daily_open):
            self.daily_open = None
            self.last_alert_rate = None  # Reset alert rate for new trading day
            self.last_notification_time = None
            logger.info("Reset daily data for new trading session")
    
    def run(self):
        """Main monitoring loop"""
        logger.info("USD/ILS Currency Monitor started")
        
        # Send startup notification
        self.send_telegram_message("🤖 USD/ILS Monitor started successfully!")
        
        while True:
            try:
                if not self.is_trading_hours():
                    logger.info("Outside trading hours, sleeping...")
                    time.sleep(3600)  # Sleep for 1 hour
                    continue
                
                self.reset_daily_data()
                
                current_rate = self.get_usd_ils_rate()
                if current_rate:
                    logger.info(f"Current USD/ILS rate: {current_rate}")
                    
                    if self.check_rate_change(current_rate):
                        logger.info("Alert sent for rate change")
                    
                    self.last_rate = current_rate
                    self.save_data()
                else:
                    logger.warning("Could not fetch current rate")
                
                time.sleep(CHECK_INTERVAL)
                
            except KeyboardInterrupt:
                logger.info("Monitor stopped by user")
                break
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    monitor = CurrencyMonitor()
    monitor.run()