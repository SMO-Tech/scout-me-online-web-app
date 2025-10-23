'use client'
import { auth, googleProvider } from '@/lib/firebaseConfig';
import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AuthCard from '@/components/auth/AuthCard';
import AuthForm from '@/components/auth/AuthForm';
import authAPI from '@/lib/api/auth';

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Handle Google Authentication
  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const { displayName, email, photoURL, uid, phoneNumber } = user;
      const info = getAdditionalUserInfo(res);
      const isNewUser = info?.isNewUser;

      if (isNewUser) {
        await authAPI.register({
          user_sub: uid,
          name: displayName || '',
          email: email || '',
          phoneno: phoneNumber || undefined,
          auth_provider: 'google',
          avatar: photoURL || undefined
        });
      }

      router.push('/dashboard');
    } catch (e) {
      setError('Authentication failed. Please try again.');
      console.error('Google Auth Error:', e);
    }
  };

  // Handle Apple Authentication
  const handleAppleAuth = async () => {
    // TODO: Implement Apple authentication
    setError('Apple authentication coming soon!');
  };

  // Handle Form Submission
  const handleFormSubmit = async (data: any) => {
    try {
      if (data.mode === 'signup') {
        setMode('signup');
        return;
      }

      if (mode === 'signup') {
        // Handle signup
        await authAPI.register({
          user_sub: Date.now().toString(), // Temporary ID until backend assigns one
          name: data.name,
          email: data.email,
          auth_provider: 'email',
        });
        setError('');
        router.push('/dashboard');
      } else {
        // Handle login
        await authAPI.login(data.email, data.password);
        
        // Handle remember me
        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', data.email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }
        
        setError('');
        router.push('/dashboard');
      }
    } catch (e) {
      setError('Authentication failed. Please check your credentials and try again.');
      console.error('Form Submit Error:', e);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    setError('Password reset functionality coming soon!');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AuthCard
          mode={mode}
          onGoogleAuth={handleGoogleAuth}
          onAppleAuth={handleAppleAuth}
          onForgotPassword={handleForgotPassword}
          onSubmit={handleFormSubmit}
          error={error}
        />
      </div>
    </div>
  );
}


export default Page;
