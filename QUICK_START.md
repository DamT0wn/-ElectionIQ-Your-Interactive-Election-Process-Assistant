# ElectionIQ - Quick Start Guide

## 🚀 Running the Application

The application is currently running! Both servers are active:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### If You Need to Restart

#### Backend Server
```bash
cd backend
npm run dev
```

#### Frontend Server
```bash
cd frontend
npm run dev
```

## 🌐 Accessing the Application

Open your browser and navigate to: **http://localhost:5173**

### Available Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | http://localhost:5173/ | Landing page with features overview |
| AI Chat | http://localhost:5173/chat | Interactive AI assistant for election questions |
| Timeline | http://localhost:5173/timeline | Step-by-step election process guide |
| Map | http://localhost:5173/map | Find polling places near you |
| Calendar | http://localhost:5173/calendar | Important election dates |
| Quiz | http://localhost:5173/quiz | Test your civics knowledge |
| Progress | http://localhost:5173/progress | Track your voter journey |

## 🔧 Recent Fixes Applied

✅ Fixed MapPage component error that caused blank page
✅ Added error boundary for better error handling
✅ Enhanced logging for debugging
✅ Improved error messages

## 📋 What to Check

1. **Open http://localhost:5173 in your browser**
2. **Press F12 to open Developer Tools**
3. **Check the Console tab** for any errors
4. **Navigate through different pages** to test functionality

## ⚠️ Known Configuration Requirements

### Google Maps (for Map page)
- API key is set in `frontend/.env`
- Requires these APIs enabled in Google Cloud Console:
  - Maps JavaScript API
  - Places API
- May need to adjust API key restrictions for localhost

### Firebase (for Authentication)
- Configuration is set in `frontend/.env`
- Should work for Google Sign-In
- Falls back to demo mode if issues occur

### Vertex AI / Gemini (for AI Chat)
- API key is set in `backend/.env`
- Should work for chat functionality

## 🐛 Troubleshooting

If you see a blank page:
1. Check browser console (F12) for errors
2. Verify both servers are running
3. Try refreshing the page (Ctrl+R or Cmd+R)
4. Navigate to home page: http://localhost:5173/

For detailed troubleshooting, see: **TROUBLESHOOTING.md**

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLOUD_PROJECT_ID=electioniq-494413
VERTEX_AI_LOCATION=us-central1
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=<your-key>
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=<your-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-domain>
VITE_FIREBASE_PROJECT_ID=<your-project>
VITE_FIREBASE_STORAGE_BUCKET=<your-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-id>
VITE_FIREBASE_APP_ID=<your-app-id>
VITE_FIREBASE_MEASUREMENT_ID=<your-measurement-id>
VITE_GOOGLE_MAPS_API_KEY=<your-key>
VITE_GOOGLE_CALENDAR_API_KEY=<your-key>
```

## 🎯 Testing the Application

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"healthy","service":"ElectionIQ API","version":"1.0.0"}
```

### 2. Test Frontend
- Open http://localhost:5173/
- You should see the ElectionIQ home page
- Navigation bar should be visible at the top
- Hero section with "Democracy, Simplified"

### 3. Test Features
- Click "AI Chat" to test the chatbot
- Click "Timeline" to see the election process
- Click "Map" to test the polling place finder
- Try signing in with Google (if Firebase is configured)

## 📚 Additional Documentation

- **README.md** - Project overview and setup instructions
- **TROUBLESHOOTING.md** - Detailed troubleshooting guide
- **FIXES_APPLIED.md** - Recent fixes and improvements

## 💡 Tips

- Use **Ctrl+Shift+I** (Windows) or **Cmd+Option+I** (Mac) to open Developer Tools
- Check the **Console tab** for helpful debug logs
- The app uses **hot module replacement** - changes to code will auto-reload
- If you change `.env` files, restart the respective server

## 🎨 Features to Try

1. **Dark/Light Mode**: Click the sun/moon icon in the navbar
2. **AI Chat**: Ask questions about the election process
3. **Interactive Timeline**: See the step-by-step voting journey
4. **Polling Place Finder**: Find nearby voting locations (requires Google Maps API)
5. **Election Quiz**: Test your civics knowledge with AI-generated questions
6. **Progress Tracker**: Track your voter registration and preparation

## 🔄 Stopping the Servers

To stop the servers, press **Ctrl+C** in each terminal window where they're running.

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Home page loads with hero section and feature cards
- ✅ Navigation bar is visible and clickable
- ✅ You can navigate between pages
- ✅ No errors in the browser console
- ✅ Backend responds to health check

---

**Need Help?** Check the browser console (F12) for error messages and refer to TROUBLESHOOTING.md for solutions.
