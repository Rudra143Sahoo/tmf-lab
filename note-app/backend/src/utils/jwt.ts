import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JWTPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: Types.ObjectId, email: string): string => {
  const payload: JWTPayload = {
    userId: userId.toString(),
    email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '7d', // Use a simple string literal
  });
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JWTPayload;
};