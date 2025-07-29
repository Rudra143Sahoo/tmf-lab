# Quick Setup Guide

## Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

## Quick Start

1. **Install all dependencies**
   ```bash
   npm run install-deps
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   
   # Frontend  
   cd ../frontend
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

3. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Run the application**
   ```bash
   # From root directory
   npm run dev
   ```

This will start:
- Backend server on http://localhost:5000
- Frontend app on http://localhost:3000

## Features Included

✅ **Authentication**
- Email/Password signup with OTP verification
- Google OAuth integration (configure in .env)
- JWT-based authentication
- Password validation & hashing

✅ **Notes Management**
- Create, read, update, delete notes
- Search functionality
- Pagination
- User-specific notes

✅ **Security**
- Rate limiting
- Input validation
- CORS configuration
- Error handling

✅ **UI/UX**
- Mobile-responsive design
- Loading states
- Error messages
- Clean, modern interface

## Tech Stack
- **Frontend**: React 18, TypeScript, CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: JWT + bcryptjs + Google OAuth

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/verify-otp` - Verify email
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get profile

### Notes
- `GET /api/notes` - List notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Deploy backend** to platforms like Heroku, Railway, or DigitalOcean

4. **Deploy frontend** to Vercel, Netlify, or similar

The application is production-ready with proper error handling, security measures, and optimized builds.