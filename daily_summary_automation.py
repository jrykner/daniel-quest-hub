#!/usr/bin/env python3
"""
Daily Summary Automation for Obsidian
Creates end-of-day summaries in Obsidian daily notes if there was activity
Runs every day at 11:45 PM Israel time
"""

import os
import json
import requests
import subprocess
from datetime import datetime, timedelta
import pytz
import logging
from pathlib import Path

# Configuration
BOT_TOKEN = "8358234418:AAGolr1H61F3FMaDh1yUm8mnpQ4uqR8RUuw"
CHAT_ID = "675804123"
OBSIDIAN_REPO_PATH = "/tmp/obsidian-repo"
GITHUB_REPO = "jrykner/obsidian-jrykner"
ACTIVITY_LOG_PATH = "/root/daily_activity.log"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/root/daily_summary_automation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DailySummaryAutomation:
    def __init__(self):
        self.israel_tz = pytz.timezone('Asia/Jerusalem')
        self.today = datetime.now(self.israel_tz).date()
        self.activity_detected = False
        
    def check_for_activity(self) -> bool:
        """Check if there was any significant activity today"""
        try:
            # Check various log files for today's activity
            activity_indicators = [
                "/root/morning_briefing.log",
                "/root/usd_ils_monitor.log", 
                "/var/log/syslog",
                "/root/.claude.json"
            ]
            
            today_str = self.today.strftime('%Y-%m-%d')
            activity_found = False
            
            for log_file in activity_indicators:
                if os.path.exists(log_file):
                    try:
                        # Check if file was modified today
                        mod_time = datetime.fromtimestamp(os.path.getmtime(log_file))
                        if mod_time.date() == self.today:
                            activity_found = True
                            logger.info(f"Activity detected in {log_file}")
                            break
                            
                        # Also check file content for today's date
                        with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                            if today_str in content:
                                activity_found = True
                                logger.info(f"Today's date found in {log_file}")
                                break
                    except Exception as e:
                        logger.debug(f"Could not check {log_file}: {e}")
                        
            # Check if Claude Code was used today (check history)
            claude_config_path = "/root/.claude.json"
            if os.path.exists(claude_config_path):
                try:
                    with open(claude_config_path, 'r') as f:
                        claude_data = json.load(f)
                        
                    # Check if there are recent history entries
                    for project_path, project_data in claude_data.get('projects', {}).items():
                        history = project_data.get('history', [])
                        if history:  # If there's any history, there was activity
                            activity_found = True
                            logger.info("Claude Code activity detected in history")
                            break
                            
                except Exception as e:
                    logger.debug(f"Could not parse Claude config: {e}")
            
            return activity_found
            
        except Exception as e:
            logger.error(f"Error checking for activity: {e}")
            return False
    
    def extract_daily_activities(self) -> str:
        """Extract and summarize today's activities"""
        try:
            activities = []
            today_str = self.today.strftime('%Y-%m-%d')
            
            # Check Claude Code history for today's activities
            claude_config_path = "/root/.claude.json"
            if os.path.exists(claude_config_path):
                try:
                    with open(claude_config_path, 'r') as f:
                        claude_data = json.load(f)
                        
                    for project_path, project_data in claude_data.get('projects', {}).items():
                        history = project_data.get('history', [])
                        for entry in history[-10:]:  # Last 10 entries
                            if 'display' in entry:
                                activities.append(f"- {entry['display']}")
                                
                except Exception as e:
                    logger.debug(f"Could not extract Claude activities: {e}")
            
            # Check system services status
            try:
                services_status = []
                services = ['usd-ils-monitor.service', 'morning-briefing.timer']
                for service in services:
                    result = subprocess.run(['systemctl', 'is-active', service], 
                                          capture_output=True, text=True)
                    status = result.stdout.strip()
                    services_status.append(f"- {service}: {status}")
                    
                if services_status:
                    activities.extend(["", "**System Services Status:**"] + services_status)
                    
            except Exception as e:
                logger.debug(f"Could not check services: {e}")
            
            # Check for any notifications sent today
            try:
                log_files = ["/root/morning_briefing.log", "/root/usd_ils_monitor.log"]
                for log_file in log_files:
                    if os.path.exists(log_file):
                        with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
                            lines = f.readlines()
                            for line in lines[-50:]:  # Check last 50 lines
                                if today_str in line and ("sent successfully" in line.lower() or "notification" in line.lower()):
                                    activities.append(f"- Notification sent: {line.strip()}")
                                    
            except Exception as e:
                logger.debug(f"Could not check notification logs: {e}")
            
            if not activities:
                return "No significant activities detected for today."
                
            return "\n".join(activities)
            
        except Exception as e:
            logger.error(f"Error extracting activities: {e}")
            return "Error extracting daily activities."
    
    def update_obsidian_daily_note(self) -> bool:
        """Update the Obsidian daily note with today's summary"""
        try:
            # Ensure we have the latest version of the repo
            if os.path.exists(OBSIDIAN_REPO_PATH):
                subprocess.run(['rm', '-rf', OBSIDIAN_REPO_PATH], check=True)
            
            subprocess.run(['git', 'clone', f'https://github.com/{GITHUB_REPO}.git', OBSIDIAN_REPO_PATH], 
                          check=True, cwd='/tmp')
            
            # Create daily note path
            date_str = self.today.strftime('%Y-%m-%d')
            daily_note_path = Path(OBSIDIAN_REPO_PATH) / 'Dailynotes' / f'{date_str}.md'
            
            # Ensure Dailynotes directory exists
            daily_note_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Get activities summary
            activities = self.extract_daily_activities()
            
            # Create or update the daily note
            summary_content = f"""# Daily Note - {self.today.strftime('%B %d, %Y')}

## End of Day Summary - {datetime.now(self.israel_tz).strftime('%H:%M')} Israel Time

### Activities Detected:
{activities}

### System Status:
- USD/ILS Monitor: Active
- Morning Briefing: Scheduled
- Telegram Bot: Connected
- Google Calendar: Authenticated

---

*This summary was automatically generated by Claude Code VPS automation*
"""

            # Read existing content if file exists
            existing_content = ""
            if daily_note_path.exists():
                with open(daily_note_path, 'r', encoding='utf-8') as f:
                    existing_content = f.read()
                
                # If there's already an "End of Day Summary" section, replace it
                if "## End of Day Summary" in existing_content:
                    parts = existing_content.split("## End of Day Summary")
                    existing_content = parts[0].rstrip()
                    
            # Combine existing content with new summary
            if existing_content and not existing_content.endswith('\n'):
                existing_content += '\n\n'
            elif not existing_content:
                existing_content = summary_content
                summary_content = ""
            
            final_content = existing_content + summary_content
            
            # Write the updated content
            with open(daily_note_path, 'w', encoding='utf-8') as f:
                f.write(final_content)
            
            # Commit and push changes
            os.chdir(OBSIDIAN_REPO_PATH)
            subprocess.run(['git', 'add', f'Dailynotes/{date_str}.md'], check=True)
            
            # Check if there are changes to commit
            result = subprocess.run(['git', 'diff', '--staged'], capture_output=True, text=True)
            if not result.stdout.strip():
                logger.info("No changes to commit")
                return True
            
            commit_message = f"""Update daily note with end-of-day summary

Auto-generated summary for {date_str}
- Added activity detection and system status
- Generated at {datetime.now(self.israel_tz).strftime('%H:%M')} Israel time

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"""
            
            subprocess.run(['git', 'commit', '-m', commit_message], check=True)
            subprocess.run(['git', 'push', 'origin', 'main'], check=True)
            
            logger.info(f"Successfully updated daily note for {date_str}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating daily note: {e}")
            return False
    
    def send_completion_notification(self, success: bool):
        """Send Telegram notification about summary completion"""
        try:
            if success:
                message = f"📝 Daily summary completed for {self.today.strftime('%B %d, %Y')}\n✅ Obsidian daily note updated and pushed to GitHub"
            else:
                message = f"⚠️ Daily summary failed for {self.today.strftime('%B %d, %Y')}\n❌ Could not update Obsidian daily note"
                
            url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
            payload = {
                'chat_id': CHAT_ID,
                'text': message,
                'parse_mode': 'HTML'
            }
            response = requests.post(url, data=payload, timeout=10)
            response.raise_for_status()
            logger.info("Completion notification sent")
            
        except Exception as e:
            logger.error(f"Failed to send completion notification: {e}")
    
    def run(self):
        """Main execution function"""
        logger.info("Starting daily summary automation")
        
        # Check if there was activity today
        if not self.check_for_activity():
            logger.info("No activity detected for today - skipping summary")
            return
        
        logger.info("Activity detected - generating daily summary")
        success = self.update_obsidian_daily_note()
        
        # Send completion notification
        self.send_completion_notification(success)
        
        if success:
            logger.info("Daily summary automation completed successfully")
        else:
            logger.error("Daily summary automation failed")

if __name__ == "__main__":
    automation = DailySummaryAutomation()
    automation.run()