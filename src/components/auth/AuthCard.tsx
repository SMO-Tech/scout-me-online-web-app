'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface AuthCardProps {
  mode: 'login' | 'signup';
  onSubmit: (data: any) => void;
  onGoogleAuth: () => void;
  onAppleAuth?: () => void;
  onForgotPassword?: () => void;
  error?: string;
  isLoading?: boolean;
}

const loginSchema = yup.object({
  username: yup.string()
    .required('Username or Email is required')
    .test('isEmailOrUsername', 'Enter a valid email or username', (value) => {
      // Check if it's a valid email
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      // Check if it's a valid username (alphanumeric, underscores, hyphens, 3-30 chars)
      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      
      return emailRegex.test(value) || usernameRegex.test(value);
    }),
  password: yup.string().required('Password is required'),
});

const AuthCard: React.FC<AuthCardProps> = ({
  mode,
  onSubmit,
  onGoogleAuth,
  onAppleAuth,
  onForgotPassword,
  error,
  isLoading = false
}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, rememberMe });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md"
    >
      {/* Logo and Title */}
      <div className="text-center mb-8">
        <h1 className="text-white text-4xl font-extrabold tracking-wide mb-4">
          Scout<span className="text-purple-300">Me</span>
        </h1>
        <p className="text-gray-200 text-base">
          {mode === 'login' 
            ? 'Sign in securely to get started with your player analytics.'
            : 'Create your account to start analyzing players.'}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </motion.div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Email or Username"
            {...register('username')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {errors.username && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.username.message}
            </motion.p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register('password')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-300">Remember me</span>
          </label>
          
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-5 rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 relative ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Sign In</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              'Sign In'
            )}
          </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-white/10"></div>
        <span className="px-4 text-gray-400 text-sm">or connect with</span>
        <div className="flex-1 border-t border-white/10"></div>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onGoogleAuth}
          className="flex items-center justify-center gap-2 bg-white text-gray-800 font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          <FcGoogle size={20} />
          <span className="text-sm">Google</span>
        </button>
        
        {onAppleAuth && (
          <button
            onClick={onAppleAuth}
            className="flex items-center justify-center gap-2 bg-black text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:bg-gray-900 transition-all duration-200"
          >
            <FaApple size={20} />
            <span className="text-sm">Apple</span>
          </button>
        )}
      </div>

      {/* Sign Up Link */}
      <p className="text-center mt-8 text-gray-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => onSubmit({ mode: 'signup' })}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Sign up
        </button>
      </p>
    </motion.div>
  );
};

export default AuthCard;
