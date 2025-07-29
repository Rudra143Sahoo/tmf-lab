import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ErrorState } from '../types';

const VerifyOTP: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<ErrorState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setErrors([{ field: 'otp', message: 'Please enter a 6-digit OTP' }]);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const response = await authService.verifyOTP({ email, otp });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error: any) {
      const errorData = error.response?.data;
      
      if (errorData?.errors) {
        setErrors(errorData.errors);
      } else {
        setErrors([{ message: errorData?.message || 'OTP verification failed. Please try again.' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setErrors([]);

    try {
      await authService.resendOTP(email);
      setCountdown(60); // 60 second countdown
      setErrors([{ message: 'OTP sent successfully!' }]);
    } catch (error: any) {
      const errorData = error.response?.data;
      setErrors([{ message: errorData?.message || 'Failed to resend OTP. Please try again.' }]);
    } finally {
      setIsResending(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const getGeneralMessage = () => {
    return errors.find(error => !error.field)?.message;
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {getGeneralMessage() && (
            <div className={`rounded-md p-4 ${
              getGeneralMessage()?.includes('successfully') ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex">
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    getGeneralMessage()?.includes('successfully') ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {getGeneralMessage()}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center">
              Enter 6-digit code
            </label>
            <div className="mt-1">
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                className={`appearance-none relative block w-full px-3 py-3 border ${
                  getFieldError('otp') ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl font-mono tracking-widest sm:text-sm`}
                placeholder="000000"
                value={otp}
                onChange={handleChange}
              />
              {getFieldError('otp') && (
                <p className="mt-1 text-sm text-red-600 text-center">{getFieldError('otp')}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              {countdown > 0 ? (
                <span className="font-medium text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;