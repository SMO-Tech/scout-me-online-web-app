'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

// Form validation schemas
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

const signupSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit }) => {
  const schema = mode === 'login' ? loginSchema : signupSchema;
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {mode === 'signup' && (
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register('name')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>
      )}

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
          type="password"
          placeholder="Password"
          {...register('password')}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
        />
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

      {mode === 'signup' && (
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-5 rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
      >
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
};

export default AuthForm;
