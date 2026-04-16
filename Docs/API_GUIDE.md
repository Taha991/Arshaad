# 🚀 Arshaad API Guide

## Starting the Development Server

To run the API server, use the Django development server:

```bash
cd Backend
python manage.py runserver
```

By default, the server runs on `http://127.0.0.1:8000/`

To run on a specific port:
```bash
python manage.py runserver 8000
```

To run on all interfaces (accessible from network):
```bash
python manage.py runserver 0.0.0.0:8000
```

---

## 📍 API Endpoints

All API endpoints are prefixed with `/api/`

### Authentication Endpoints
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/logout/` - Logout user
- `POST /api/auth/verify-email/` - Verify email
- `POST /api/auth/reset-password/` - Request password reset
- `POST /api/auth/reset-password/confirm/` - Confirm password reset
- `GET /api/auth/user/` - Get current user info

### Roadmaps
- `GET /api/roadmaps/` - List all roadmaps
- `GET /api/roadmaps/{id}/` - Get roadmap details
- `POST /api/roadmaps/` - Create roadmap (authenticated)
- `PUT /api/roadmaps/{id}/` - Update roadmap
- `DELETE /api/roadmaps/{id}/` - Delete roadmap
- `GET /api/roadmaps/{id}/stages/` - Get roadmap stages
- `GET /api/resources/` - List resources
- `GET /api/stages/` - List stages

### Assessments
- `GET /api/assessments/` - List user assessments
- `POST /api/assessments/` - Create assessment
- `GET /api/assessments/{id}/` - Get assessment details
- `POST /api/assessments/{id}/generate_recommendation/` - Generate AI recommendation
- `GET /api/recommendations/` - List user recommendations

### Progress Tracking
- `GET /api/progress/` - List user progress
- `POST /api/progress/` - Create progress entry
- `GET /api/sessions/` - List study sessions
- `POST /api/sessions/` - Log study session
- `GET /api/achievements/` - List achievements
- `GET /api/user-achievements/` - List user achievements
- `GET /api/streaks/` - Get learning streak

### Mentorship
- `GET /api/mentors/` - List available mentors
- `GET /api/mentors/{id}/` - Get mentor details
- `GET /api/sessions/` - List mentoring sessions (mentor/mentee)
- `POST /api/sessions/` - Create mentoring session
- `GET /api/study-groups/` - List study groups
- `POST /api/study-groups/` - Create study group
- `GET /api/group-members/` - List group memberships

### Jobs
- `GET /api/jobs/` - List jobs (filterable)
  - Query params: `country`, `city`, `experience_level`, `employment_type`, `remote_ok`, `hybrid_ok`
- `GET /api/jobs/{id}/` - Get job details
- `GET /api/applications/` - List user job applications
- `POST /api/applications/` - Create job application
- `GET /api/market-analytics/` - Get market analytics

### Events
- `GET /api/events/` - List events (filterable)
  - Query params: `country`, `city`, `is_online`, `is_free`, `category`, `language`
- `GET /api/events/{id}/` - Get event details
- `GET /api/attendees/` - List user event attendances
- `POST /api/attendees/` - Register for event

### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/mark_read/` - Mark notification as read
- `POST /api/notifications/mark_all_read/` - Mark all as read
- `GET /api/push-tokens/` - List push tokens
- `POST /api/push-tokens/` - Register push token

### Discounts
- `GET /api/discounts/` - List active discounts
- `GET /api/discounts/{id}/` - Get discount details
- `GET /api/usage/` - List user discount usage
- `POST /api/usage/` - Use discount

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. **Register/Login:**
```bash
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

2. **Use Token in Requests:**
```bash
GET /api/roadmaps/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Refreshing Token

```bash
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## 📝 Example Requests

### Get Public Roadmaps (No Auth Required)
```bash
curl http://127.0.0.1:8000/api/roadmaps/
```

### Create Assessment (Auth Required)
```bash
curl -X POST http://127.0.0.1:8000/api/assessments/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "answers_json": {
      "skill_level": "beginner",
      "interests": ["web", "frontend"],
      "weekly_study_hours": 10,
      "learning_style": "visual"
    }
  }'
```

### Get Jobs with Filters
```bash
curl "http://127.0.0.1:8000/api/jobs/?country=EG&remote_ok=true&experience_level=entry"
```

---

## 🧪 Testing the API

### Using Django REST Framework Browsable API

Once the server is running, visit:
- `http://127.0.0.1:8000/api/` - API root
- `http://127.0.0.1:8000/api/roadmaps/` - Roadmaps endpoint
- `http://127.0.0.1:8000/api/jobs/` - Jobs endpoint

The browsable API provides an interactive interface to test endpoints.

### Using Postman/Insomnia

1. Import the endpoints
2. Set up authentication:
   - Type: Bearer Token
   - Token: Your access token from login
3. Make requests

### Using cURL

See examples above.

---

## 🔧 Admin Panel

Access the Django admin panel at:
- `http://127.0.0.1:8000/admin/`

First, create a superuser:
```bash
python manage.py createsuperuser
```

Then login and manage all models through the admin interface.

---

## 📊 API Response Format

All responses follow REST conventions:

### Success Response
```json
{
  "id": 1,
  "title": "Web Development Roadmap",
  "description": "...",
  ...
}
```

### List Response
```json
[
  {
    "id": 1,
    "title": "...",
    ...
  },
  {
    "id": 2,
    "title": "...",
    ...
  }
]
```

### Error Response
```json
{
  "detail": "Error message here"
}
```

### Validation Error
```json
{
  "field_name": ["Error message"],
  "another_field": ["Another error"]
}
```

---

## 🚨 Common Issues

### 401 Unauthorized
- Token expired or missing
- Solution: Login again to get a new token

### 403 Forbidden
- User doesn't have permission
- Solution: Check user role and permissions

### 404 Not Found
- Endpoint doesn't exist
- Solution: Check URL spelling and API version

### 500 Internal Server Error
- Server-side error
- Solution: Check server logs and database connection

---

## 📚 Additional Resources

- Django REST Framework Docs: https://www.django-rest-framework.org/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/
- Django Admin: https://docs.djangoproject.com/en/stable/ref/contrib/admin/

