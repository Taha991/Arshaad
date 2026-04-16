# 🚀 Quick Setup - Google OAuth

## Fix the "Missing client_id" Error

The error occurs because the Google OAuth Client ID is not configured. Follow these steps:

### Step 1: Create `.env` file

Create a file named `.env` in the `Frontend/@front/` directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

### Step 2: Get Google Client ID (Quick Method)

**Option A: Use a test/demo Client ID (for development only)**
- You can temporarily use any valid Google Client ID format
- For production, you MUST create your own

**Option B: Create your own (Recommended)**

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add these:
   - **Authorized JavaScript origins:** `http://localhost:5173`
   - **Authorized redirect URIs:** `http://localhost:5173/auth/callback`
7. Copy the **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

### Step 3: Add to `.env` file

Replace `your-google-client-id-here.apps.googleusercontent.com` with your actual Client ID.

### Step 4: Restart Dev Server

**IMPORTANT:** After creating/updating `.env`, you MUST restart the Vite dev server:

1. Stop the server (Ctrl+C)
2. Run again: `npm run dev`

Vite only reads `.env` files on startup!

### Step 5: Verify

- The error should be gone
- The Google login button should appear on login/register pages
- Clicking it should open Google OAuth popup

## Temporary Workaround

If you don't want to set up Google OAuth right now, the app will work fine without it:
- The Google login button won't appear (this is intentional)
- Regular email/password login will still work
- You can add Google OAuth later

## Troubleshooting

**Still seeing the error?**
- Make sure `.env` file is in `Frontend/@front/` (not in `Frontend/`)
- Make sure you restarted the dev server after creating `.env`
- Check that `VITE_GOOGLE_CLIENT_ID` starts with `VITE_` (required for Vite)
- Verify the Client ID format is correct

**Button not showing?**
- This is normal if Client ID is not set - the component hides itself gracefully
- Once you add the Client ID and restart, it will appear

