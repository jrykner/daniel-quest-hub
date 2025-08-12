# 🗓️ Google Calendar Setup Guide for Daniel's Quest Hub

## 📋 Summary: Who Creates What?

**ANSWER**: You (as the parent/admin) create the Google Cloud Project and credentials, but Daniel connects his own Google Calendar account for syncing.

### 👨‍💼 Parent (Admin) Setup:
- Create Google Cloud Project
- Generate OAuth credentials
- Set up environment variables
- Manage the application

### 👦 Daniel (User) Setup:  
- Connect his own Google Calendar account
- Authorize the app to access his calendar
- Tasks appear in his personal calendar

---

## 🏗️ Step 1: Parent Creates Google Cloud Project

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Use YOUR parent account** (not Daniel's)
3. Create a new project: "Daniel Quest Hub Calendar"
4. Note the Project ID

### 1.2 Enable Calendar API
1. Go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click "Enable"

### 1.3 Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen:
   - **User Type**: External
   - **App Name**: "Daniel's Quest Hub"
   - **User Support Email**: Your email
   - **Developer Contact**: Your email
   - **Scopes**: Add `https://www.googleapis.com/auth/calendar`

4. Create OAuth 2.0 Client ID:
   - **Application Type**: Web Application
   - **Name**: "Daniel Quest Hub"
   - **Authorized Redirect URIs**: 
     ```
     https://your-vercel-domain.vercel.app/api/auth/google-calendar/callback
     ```

### 1.4 Download Credentials
1. Download the JSON file
2. It contains `client_id` and `client_secret`

---

## 🔧 Step 2: Configure Vercel Environment Variables

Add these to your Vercel project settings:

```bash
# Google Calendar Integration
GOOGLE_CLIENT_ID="your-client-id-from-downloaded-json"
GOOGLE_CLIENT_SECRET="your-client-secret-from-downloaded-json"
GOOGLE_REDIRECT_URI="https://your-vercel-domain.vercel.app/api/auth/google-calendar/callback"
```

---

## 👦 Step 3: Daniel Connects His Calendar

### How It Works:
1. Daniel opens the Quest Hub
2. Goes to "Recurring" tab
3. Clicks "Connect Daniel's Calendar (Optional)"
4. **Logs in with his own Google account**
5. Authorizes the app to access his calendar
6. Tasks now sync to his personal calendar

### User Experience:
- Daniel sees a popup asking to sign in to Google
- He uses his own Google account credentials
- He grants permission for calendar access
- The app stores his tokens securely in the database
- Future tasks automatically appear in his calendar

---

## 🔒 Security & Privacy

### What Data Is Stored:
- Daniel's OAuth tokens (encrypted in database)
- No passwords or personal data
- Only calendar event creation/modification permissions

### Permissions Requested:
- `https://www.googleapis.com/auth/calendar` - Read/write calendar events
- **No access to**: Emails, Drive, Photos, etc.

### Who Has Access:
- Only Daniel can connect his calendar
- Only the app can create/modify events it created
- Parents can create tasks, but calendar connection is per-user

---

## 🎯 Simple Setup Flow

### For Parents:
1. ✅ Create Google Cloud Project (one-time setup)
2. ✅ Add credentials to Vercel
3. ✅ Create recurring quests without calendar requirement

### For Daniel:
1. ✅ Click "Connect Calendar" when he wants sync
2. ✅ Sign in with his Google account
3. ✅ Enjoy automatic calendar sync

---

## 🚨 Important Notes

### Test Users (Development Phase):
- During development, add Daniel's email to "Test Users" in OAuth consent screen
- This allows him to connect even if the app isn't publicly verified

### Production (Later):
- For family-only use, keep as "Testing" status
- For wider use, submit for Google verification

### Multiple Users:
- Each family member connects their own calendar
- Parents create tasks, kids connect their calendars
- Everyone sees tasks in their personal calendar

---

## 🛠️ Troubleshooting

### Common Issues:
1. **"App not verified"** → Add Daniel to test users
2. **"Redirect URI mismatch"** → Check Vercel URL in OAuth settings
3. **"Access blocked"** → Ensure Calendar API is enabled

### Testing:
1. Create a recurring quest
2. Check it appears in Daniel's calendar
3. Verify quest shows 🎯 emoji prefix
4. Confirm recurrence pattern works

---

## ✅ Final Checklist

- [ ] Google Cloud Project created (parent account)
- [ ] Calendar API enabled
- [ ] OAuth credentials generated
- [ ] Vercel environment variables set
- [ ] Daniel added as test user (if needed)
- [ ] Redirect URI matches Vercel domain
- [ ] Test calendar connection working

**Result**: Parents can create recurring tasks easily, and Daniel can optionally sync them to his personal Google Calendar for better organization! 🎮📅