# Arshaad Frontend

React + TypeScript + Vite frontend for the Arshaad career guidance platform.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── atoms/        # Basic UI elements (Button, Input, etc.)
│   ├── molecules/    # Composite components
│   └── organisms/    # Complex components
├── pages/            # Page components
│   ├── Auth/         # Authentication pages
│   ├── Dashboard/    # Dashboard pages
│   └── Landing.tsx   # Landing page
├── services/         # API services
│   └── api/          # API clients
├── store/            # Redux store
│   └── slices/       # Redux slices
└── types/            # TypeScript types
```

## Features Implemented

- ✅ Authentication (Login/Register)
- ✅ Redux state management
- ✅ API integration with backend
- ✅ Protected routes
- ✅ JWT token management
- ✅ Responsive UI with Tailwind CSS

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## Available Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Student dashboard (protected)

## API Integration

The frontend connects to the Django backend API. Make sure the backend is running on `http://localhost:8000`.

## Tech Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios

