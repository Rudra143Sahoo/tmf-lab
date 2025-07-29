# Notes App - Full Stack Note-Taking Application

A modern, full-stack note-taking application built with React (TypeScript) and Node.js (TypeScript), featuring secure authentication with email/OTP verification and Google OAuth integration.

## 🚀 Features

### Authentication
- **Email/Password Registration** with OTP verification
- **Google OAuth** login/signup
- **JWT-based** secure authentication
- **Password validation** with strength requirements
- **Rate limiting** for security

### Notes Management
- **Create, Read, Update, Delete** notes
- **Search functionality** across note titles and content
- **Pagination** for better performance
- **Tags support** for note organization
- **Real-time** note creation and deletion

### User Experience
- **Mobile-responsive** design
- **Modern UI** with Tailwind CSS
- **Error handling** with user-friendly messages
- **Loading states** and smooth transitions
- **Protected routes** with authentication guards

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router Dom** for navigation
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Context API** for state management

### Backend
- **Node.js** with Express.js (TypeScript)
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Google Auth Library** for OAuth
- **Express Rate Limit** for security
- **Express Validator** for input validation

### Security Features
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting**
- **Input validation and sanitization**
- **Password hashing**
- **JWT token expiration**

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd note-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

#### Backend Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/notes-app

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas and update MONGODB_URI in backend/.env
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Backend in Production
```bash
cd backend
npm run build
npm start
```

## 📱 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Notes Routes
- `GET /api/notes` - Get all notes (with pagination/search)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/stats/overview` - Get user statistics

## 🔐 Authentication Flow

### Email/Password Registration
1. User fills signup form with email, password, first name, last name
2. Backend validates input and creates user with unverified status
3. OTP is generated and sent to user's email
4. User enters OTP on verification page
5. Backend verifies OTP and activates account
6. JWT token is issued for authenticated session

### Google OAuth
1. User clicks "Sign in with Google"
2. Google OAuth flow initiated
3. Backend verifies Google credential
4. User account created or updated
5. JWT token issued for authenticated session

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interfaces
- Adaptive navigation

### User Feedback
- Loading spinners during operations
- Success/error toast messages
- Form validation with inline errors
- Confirmation dialogs for destructive actions

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## 🔧 Configuration

### Email Setup (for OTP)
1. Create a Gmail app password
2. Update `EMAIL_USER` and `EMAIL_PASSWORD` in backend `.env`
3. Ensure SMTP settings are correct

### Google OAuth Setup
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins: `http://localhost:3000`
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in backend `.env`

## 📁 Project Structure

```
note-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set production environment variables
2. Update CORS settings for production frontend URL
3. Use production MongoDB instance
4. Deploy using your preferred platform

### Frontend Deployment (Vercel/Netlify)
1. Update `REACT_APP_API_URL` to production backend URL
2. Build the application
3. Deploy to static hosting platform

## 🔒 Security Considerations

- All API endpoints are rate-limited
- Passwords are hashed using bcryptjs
- JWT tokens have expiration
- Input validation and sanitization
- CORS properly configured
- Environment variables for sensitive data
- Helmet for security headers

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Email OTP Not Working**
   - Verify email credentials
   - Check spam folder
   - Ensure app password is used for Gmail

3. **Google OAuth Errors**
   - Verify client ID and secret
   - Check authorized origins
   - Ensure Google+ API is enabled

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ using React, Node.js, and MongoDB