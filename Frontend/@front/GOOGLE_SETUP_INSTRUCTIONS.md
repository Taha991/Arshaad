# 🔐 Google OAuth Setup - Step by Step

## Why you can't see the Google login button

The button is showing but disabled because `VITE_GOOGLE_CLIENT_ID` is not set in your `.env` file.

## Quick Setup (5 minutes)

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create or Select Project:**
   - Click "Select a project" → "New Project"
   - Name it "Arshaad" (or any name)
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" or "People API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: Arshaad
     - User support email: your email
     - Developer contact: your email
     - Click "Save and Continue"
     - Scopes: Keep default, click "Save and Continue"
     - Test users: Add your email, click "Save and Continue"
   
5. **Create OAuth Client:**
   - Application type: **Web application**
   - Name: Arshaad Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:5173/auth/callback
     ```
   - Click "Create"

6. **Copy Client ID:**
   - You'll see a popup with your Client ID
   - It looks like: `123456789-abc123def456.apps.googleusercontent.com`
   - **Copy this ID**

### Step 2: Create .env File

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend/@front
   ```

2. **Create `.env` file:**
   ```bash
   # Windows
   type nul > .env
   
   # Mac/Linux
   touch .env
   ```

3. **Add this content to `.env`:**
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   ```
   
   **Replace `YOUR_CLIENT_ID_HERE` with the Client ID you copied!**

### Step 3: Restart Dev Server

**IMPORTANT:** You MUST restart the Vite dev server for `.env` changes to take effect!

1. Stop the server (press `Ctrl+C`)
2. Start it again:
   ```bash
   npm run dev
   ```

### Step 4: Test

1. Go to `http://localhost:5173/login`
2. You should now see the Google login button (enabled, not grayed out)
3. Click it → Google popup opens → Select account → You're logged in!

## What Happens When User Logs In with Google

✅ **User info is automatically saved:**
- Name (from Google profile)
- Email (from Google account)
- Profile picture URL
- Email verification status
- Last login time

✅ **Next time they login:**
- They click "Login with Google"
- Google remembers them (if they're logged into Google)
- They're instantly logged in
- All their info is already saved in the database

## Troubleshooting

### Button still not showing?
- ✅ Check `.env` file is in `Frontend/@front/` (not `Frontend/`)
- ✅ Check `VITE_GOOGLE_CLIENT_ID` starts with `VITE_` (required!)
- ✅ Restart dev server after creating `.env`
- ✅ Check browser console for errors

### "Redirect URI mismatch" error?
- ✅ Add `http://localhost:5173/auth/callback` to authorized redirect URIs
- ✅ Make sure there are no trailing slashes

### "Invalid client" error?
- ✅ Check Client ID is correct (no extra spaces)
- ✅ Make sure OAuth consent screen is configured
- ✅ Wait a few minutes after creating credentials (Google needs time to propagate)

### Still having issues?
- Check the browser console for detailed error messages
- Make sure backend is running on `http://localhost:8000`
- Verify Google+ API is enabled in Google Cloud Console

## Production Setup

When deploying to production:

1. **Update Google OAuth credentials:**
   - Add production domain to authorized origins
   - Add production callback URL

2. **Update `.env`:**
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_GOOGLE_CLIENT_ID=your-production-client-id
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

