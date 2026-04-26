# ElectionIQ Troubleshooting Guide

## Current Status

✅ **Backend Server**: Running successfully on port 5000
✅ **Frontend Server**: Running successfully on port 5173
✅ **Error Boundary**: Added to catch and display JavaScript errors
✅ **Enhanced Logging**: Added console logging to help diagnose issues

## Recent Changes

1. **Added Error Boundary Component** (`frontend/src/components/ErrorBoundary.jsx`)
   - Catches React errors and displays them in a user-friendly way
   - Shows error details for debugging

2. **Enhanced MapPage Logging** (`frontend/src/pages/MapPage.jsx`)
   - Added detailed console logging for Google Maps initialization
   - Improved error messages for API key issues

3. **Added App-level Logging** (`frontend/src/App.jsx`)
   - Logs when the App component renders

## How to Diagnose the Blank Page Issue

### Step 1: Open Browser Developer Console
1. Open your browser (Chrome, Firefox, Edge, etc.)
2. Navigate to `http://localhost:5173`
3. Press `F12` or `Ctrl+Shift+I` (Windows) to open Developer Tools
4. Click on the "Console" tab

### Step 2: Check for Errors
Look for any red error messages in the console. Common errors include:

#### Firebase Errors
```
Firebase: Error (auth/...)
```
**Solution**: Firebase is configured but may have issues. The app should still work with limited functionality.

#### Google Maps Errors
```
Google Maps JavaScript API error: ...
```
**Solutions**:
- Verify the API key is correct in `frontend/.env`
- Enable "Maps JavaScript API" in Google Cloud Console
- Enable "Places API" in Google Cloud Console
- Check API key restrictions (should allow localhost)

#### Module Not Found Errors
```
Failed to resolve module...
```
**Solution**: Run `npm install` in the frontend directory

### Step 3: Check Console Logs
You should see logs like:
```
App: Rendering
MapPage: Initializing, API Key present: true
MapPage: Loading Google Maps script
```

If you don't see these logs, there's a JavaScript error preventing React from rendering.

### Step 4: Navigate to Different Pages
Try navigating to different pages to see if the issue is specific to one page:
- Home: `http://localhost:5173/`
- Chat: `http://localhost:5173/chat`
- Timeline: `http://localhost:5173/timeline`
- Map: `http://localhost:5173/map`

## Common Issues and Solutions

### Issue 1: Blank Page on All Routes
**Cause**: JavaScript error preventing React from rendering
**Solution**: 
1. Check browser console for errors
2. If you see an error boundary message, read the error details
3. Check that all dependencies are installed: `npm install` in both `backend` and `frontend` directories

### Issue 2: Map Page is Blank
**Cause**: Google Maps API key issue
**Solution**:
1. Verify `VITE_GOOGLE_MAPS_API_KEY` is set in `frontend/.env`
2. Enable required APIs in Google Cloud Console:
   - Maps JavaScript API
   - Places API
3. Check API key restrictions:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Click on your API key
   - Under "Application restrictions", select "None" or add `http://localhost:5173` to allowed referrers
4. If the API key is invalid, the page will show a message: "Map Configuration Required"

### Issue 3: Firebase Authentication Not Working
**Cause**: Firebase configuration issue
**Solution**:
1. Verify all Firebase environment variables are set in `frontend/.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
2. The app will fall back to demo mode if Firebase is not configured

### Issue 4: Backend API Errors
**Cause**: Backend service issues
**Solution**:
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check backend logs in the terminal where you ran `npm run dev`
3. Verify environment variables in `backend/.env`

## Environment Variables Checklist

### Backend (`backend/.env`)
- [x] `PORT=5000`
- [x] `NODE_ENV=development`
- [x] `CORS_ORIGIN=http://localhost:5173`
- [x] `GOOGLE_CLOUD_PROJECT_ID` (set)
- [x] `VERTEX_AI_LOCATION` (set)
- [x] `GEMINI_MODEL` (set)
- [x] `GEMINI_API_KEY` (set)

### Frontend (`frontend/.env`)
- [x] `VITE_API_BASE_URL=http://localhost:5000`
- [x] `VITE_FIREBASE_API_KEY` (set)
- [x] `VITE_FIREBASE_AUTH_DOMAIN` (set)
- [x] `VITE_FIREBASE_PROJECT_ID` (set)
- [x] `VITE_FIREBASE_STORAGE_BUCKET` (set)
- [x] `VITE_FIREBASE_MESSAGING_SENDER_ID` (set)
- [x] `VITE_FIREBASE_APP_ID` (set)
- [x] `VITE_FIREBASE_MEASUREMENT_ID` (set)
- [x] `VITE_GOOGLE_MAPS_API_KEY` (set)
- [ ] `VITE_GOOGLE_CLIENT_ID` (empty - optional)
- [x] `VITE_GOOGLE_CALENDAR_API_KEY` (set)

## Next Steps

1. **Open the browser and check the console** - This is the most important step
2. **Navigate to the home page** (`http://localhost:5173/`) to see if it loads
3. **Check the console logs** to see what's happening
4. **Report any errors** you see in the console

## Testing the Application

### Test Backend
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{"status":"healthy","service":"ElectionIQ API","version":"1.0.0","timestamp":"..."}
```

### Test Frontend
1. Open `http://localhost:5173/` in your browser
2. You should see the ElectionIQ home page with:
   - Navigation bar at the top
   - Hero section with "Democracy, Simplified"
   - Feature cards
   - Call-to-action section

## Getting Help

If you're still experiencing issues:
1. Copy the error message from the browser console
2. Copy the error message from the terminal (if any)
3. Note which page you're trying to access
4. Share this information for further assistance

## Additional Notes

- The application uses Vite for the frontend, which provides hot module replacement (HMR)
- Changes to frontend code should automatically reload in the browser
- Changes to backend code will restart the server automatically (nodemon)
- If you make changes to `.env` files, you need to restart the respective server
