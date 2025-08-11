#!/usr/bin/env python3
import requests

bot_token = "8358234418:AAGolr1H61F3FMaDh1yUm8mnpQ4uqR8RUuw"

print("Checking for messages...")

response = requests.get(f"https://api.telegram.org/bot{bot_token}/getUpdates")
data = response.json()

if data['result']:
    chat_id = data['result'][-1]['message']['chat']['id']
    print(f"Your chat ID is: {chat_id}")
    
    # Test sending a message
    test_response = requests.get(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        params={'chat_id': chat_id, 'text': 'Hello! Your bot is working!'}
    )
    
    if test_response.status_code == 200:
        print("Test message sent successfully!")
    else:
        print("Failed to send test message")
else:
    print("No messages found. Make sure you've sent a message to the bot.")