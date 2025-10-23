'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

// Phone number regex for basic validation
const phoneRegExp = /^\+?[1-9]\d{1,14}$/;

const signupSchema = yup.object({
  first_name: yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  last_name: yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  password_confirm: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  phoneno: yup.string()
    .matches(phoneRegExp, 'Please enter a valid phone number')
    .nullable()
});

interface SignupFormProps {
  onSubmit: (data: any) => void;
  onGoogleAuth: () => void;
  onFacebookAuth?: () => void;
  onAppleAuth?: () => void;
  onSignIn: () => void;
  error?: string;
  isLoading?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onGoogleAuth,
  onFacebookAuth,
  onAppleAuth,
  onSignIn,
  error,
  isLoading = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema)
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-white text-4xl font-extrabold tracking-wide mb-4">
          Create Account
        </h1>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={onGoogleAuth}
          className="flex items-center justify-center p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FcGoogle size={24} />
        </button>
        {onFacebookAuth && (
          <button
            onClick={onFacebookAuth}
            className="flex items-center justify-center p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1865F2] transition-colors"
          >
            <FaFacebookF size={24} />
          </button>
        )}
        {onAppleAuth && (
          <button
            onClick={onAppleAuth}
            className="flex items-center justify-center p-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <FaApple size={24} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-white/10"></div>
        <span className="px-4 text-gray-400 text-sm">Or sign up with email</span>
        <div className="flex-1 border-t border-white/10"></div>
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

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              {...register('first_name')}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {errors.first_name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.first_name.message}
              </motion.p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              {...register('last_name')}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            {errors.last_name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-1"
              >
                {errors.last_name.message}
              </motion.p>
            )}
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
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

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number (Optional)"
            {...register('phoneno')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {errors.phoneno && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.phoneno.message}
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

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register('password_confirm')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
          {errors.password_confirm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.password_confirm.message}
            </motion.p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-5 rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 relative ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Create Account</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <p className="text-center mt-8 text-gray-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSignIn}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </motion.div>
  );
};

export default SignupForm;
