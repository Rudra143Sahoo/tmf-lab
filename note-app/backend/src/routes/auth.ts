import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { generateOTP, sendOTPEmail } from '../utils/email';
import { 
  validateSignup, 
  validateLogin, 
  validateOTP, 
  handleValidationErrors 
} from '../middleware/validation';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup with email
router.post('/signup', authLimiter, validateSignup, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user with unverified status
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      otp,
      otpExpires,
      isEmailVerified: false,
      authProvider: 'email',
    });

    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the registration, but log the error
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email for OTP verification.',
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Verify OTP
router.post('/verify-otp', authLimiter, validateOTP, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email,
      otp,
      otpExpires: { $gt: new Date() }
    }).select('+otp +otpExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Update user as verified and clear OTP
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id as Types.ObjectId, user.email);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          authProvider: user.authProvider,
        },
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Resend OTP
router.post('/resend-otp', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isEmailVerified: false });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found or already verified',
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email',
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Login with email and password
router.post('/login', authLimiter, validateLogin, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address first',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id as Types.ObjectId, user.email);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          authProvider: user.authProvider,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Google OAuth Login/Signup
router.post('/google', authLimiter, async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential',
      });
    }

    const { sub: googleId, email, given_name: firstName, family_name: lastName, picture: avatar } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not available from Google account',
      });
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        user.isEmailVerified = true;
        if (avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        email,
        firstName: firstName || 'User',
        lastName: lastName || '',
        googleId,
        authProvider: 'google',
        isEmailVerified: true,
        avatar,
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id as Types.ObjectId, user.email);

    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          authProvider: user.authProvider,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          authProvider: user.authProvider,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;