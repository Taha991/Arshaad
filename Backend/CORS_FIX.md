# 🔧 CORS Fix Instructions

## Problem
You're getting CORS errors when trying to use Google OAuth because the backend isn't allowing requests from the frontend.

## Solution Applied
I've added CORS configuration to your Django settings. Now you need to:

### Step 1: Install django-cors-headers

```bash
cd Backend
pip install django-cors-headers
```

Or if using virtual environment:
```bash
cd Backend
.\venv\Scripts\activate
pip install django-cors-headers
```

### Step 2: Restart Django Server

After installing, restart your Django development server:

```bash
python manage.py runserver
```

### Step 3: Test Again

1. Go to `http://localhost:5173/login`
2. Click "تسجيل الدخول بـ Google"
3. The CORS error should be gone!

## What Was Changed

✅ Added `django-cors-headers` to `requirements/base.txt`
✅ Added `corsheaders` to `INSTALLED_APPS`
✅ Added CORS middleware to `MIDDLEWARE`
✅ Configured CORS to allow `http://localhost:5173`

## If Still Getting CORS Errors

1. Make sure you installed the package: `pip install django-cors-headers`
2. Make sure you restarted the Django server
3. Check that both servers are running:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8000`
4. Clear browser cache and try again

