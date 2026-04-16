# 🔐 Google OAuth Setup Guide

## Backend Setup

The backend is already configured with django-allauth. The custom OAuth view is created at `apps/api/views/oauth.py`.

### Required Environment Variables

No additional backend configuration needed. The OAuth endpoint is available at:
- `POST /api/auth/oauth/google/`

## Frontend Setup

### 1. Install Dependencies

The `@react-oauth/google` package is already added to `package.json`. Install it:

```bash
cd Frontend/@front
npm install
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production domain (for production)
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for development)
     - Your production callback URL (for production)
5. Copy the **Client ID**

### 3. Configure Environment Variables

Create a `.env` file in `Frontend/@front/`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Replace `your-client-id.apps.googleusercontent.com` with your actual Google Client ID.

### 4. Restart Development Server

After adding the environment variable, restart your Vite dev server:

```bash
npm run dev
```

## How It Works

1. User clicks "تسجيل الدخول بـ Google" button
2. Google OAuth popup opens
3. User authorizes the application
4. Frontend receives Google access token
5. Frontend sends token to backend: `POST /api/auth/oauth/google/`
6. Backend verifies token with Google and gets user info
7. Backend creates/updates user and returns JWT tokens
8. Frontend stores JWT tokens and redirects to dashboard

## Testing

1. Make sure backend is running on `http://localhost:8000`
2. Make sure frontend is running on `http://localhost:5173`
3. Go to `/login` page
4. Click "تسجيل الدخول بـ Google"
5. Complete Google authentication
6. You should be redirected to dashboard

## Troubleshooting

### "Invalid Client ID" error
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Make sure the Client ID is for a "Web application" type
- Verify authorized origins include `http://localhost:5173`

### "Redirect URI mismatch" error
- Add `http://localhost:5173/auth/callback` to authorized redirect URIs in Google Console

### Backend returns 400 error
- Check that Google+ API is enabled in Google Cloud Console
- Verify the access token is valid
- Check backend logs for detailed error messages

## Production Setup

1. Update Google OAuth credentials:
   - Add production domain to authorized origins
   - Add production callback URL to authorized redirect URIs

2. Update environment variables:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   VITE_GOOGLE_CLIENT_ID=your-production-client-id
   ```

3. Rebuild frontend:
   ```bash
   npm run build
   ```

