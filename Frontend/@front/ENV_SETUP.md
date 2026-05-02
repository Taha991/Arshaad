# Environment Variables Setup

Create a `.env` file in `Frontend/@front/` with the following:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Google OAuth Configuration
# Get your Client ID from: https://console.cloud.google.com/apis/credentials
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

Replace `your-google-client-id-here.apps.googleusercontent.com` with your actual Google OAuth Client ID.

## Getting Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application type)
5. Add authorized origins: `http://localhost:5173`
6. Copy the Client ID

