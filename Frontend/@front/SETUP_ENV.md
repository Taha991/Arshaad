# ✅ Quick Setup - Add Your Google Client ID

## Your Google Client ID:
```
20682794106-m5e7i2p5eaqishdf14ftr47ks7cimrik.apps.googleusercontent.com
```

## Steps:

### 1. Create `.env` file

**In Windows PowerShell:**
```powershell
cd Frontend\@front
New-Item -Path .env -ItemType File
```

**Or manually:**
1. Go to `Frontend/@front/` folder
2. Create a new file named `.env` (with the dot at the beginning)
3. Copy the content below into it

### 2. Add this content to `.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=20682794106-m5e7i2p5eaqishdf14ftr47ks7cimrik.apps.googleusercontent.com
```

### 3. Restart your dev server

**IMPORTANT:** You MUST restart the Vite dev server for the `.env` file to be read!

1. Stop the current server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 4. Test Google Login

1. Go to `http://localhost:5173/login`
2. You should see the Google login button (enabled, not grayed out)
3. Click it → Google popup opens → Select your account → You're logged in! 🎉

## Verify it's working:

- The Google button should be clickable (not disabled)
- Clicking it should open Google OAuth popup
- After selecting account, you should be logged in and redirected to dashboard

## Troubleshooting:

**Button still disabled?**
- Make sure `.env` file is in `Frontend/@front/` (not `Frontend/`)
- Make sure you restarted the dev server
- Check that `VITE_GOOGLE_CLIENT_ID` starts with `VITE_`

**Getting errors?**
- Make sure you added `http://localhost:5173` to authorized origins in Google Console
- Make sure backend is running on `http://localhost:8000`

