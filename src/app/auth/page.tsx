'use client'
import { auth, googleProvider } from '@/lib/firebaseConfig';
import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AuthCard from '@/components/auth/AuthCard';
import SignupForm from '@/components/auth/SignupForm';
import { Toaster } from 'react-hot-toast';
import authService from '@/services/api/auth.service';
import toast from 'react-hot-toast';

const Page = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Google Authentication
  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const { displayName, email, photoURL, uid, phoneNumber } = user;
      const info = getAdditionalUserInfo(res);
      const isNewUser = info?.isNewUser;

      if (isNewUser) {
        await authService.register({
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
        try {
          setIsLoading(true);
          setError('');
          
          // Register user
          await authService.register({
            username: data.username,
            email: data.email,
            password: data.password,
            password_confirm: data.password_confirm,
            first_name: data.first_name,
            last_name: data.last_name,
            phoneno: data.phoneno || undefined
          });

          // Show success message
          toast.success('Account created successfully! Please sign in.');
          
          // Switch to login mode
          setMode('login');
          return;
        } catch (e: any) {
          setError(e.message || 'Registration failed. Please try again.');
          console.error('Registration Error:', e);
          return;
        } finally {
          setIsLoading(false);
        }
      }

      setIsLoading(true);
      setError('');

      // Handle login
      const response = await authService.login({
        username: data.username,
        password: data.password
      });
      
      // Handle remember me
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', data.username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
      }
      
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Authentication failed. Please check your credentials and try again.');
      console.error('Form Submit Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    setError('Password reset functionality coming soon!');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 flex flex-col items-center justify-center px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4aed88',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ff4b4b',
              color: '#fff',
            },
          },
        }}
      />
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <AuthCard
            mode={mode}
            onGoogleAuth={handleGoogleAuth}
            onAppleAuth={handleAppleAuth}
            onForgotPassword={handleForgotPassword}
            onSubmit={handleFormSubmit}
            error={error}
            isLoading={isLoading}
          />
        ) : (
          <SignupForm
            onSubmit={handleFormSubmit}
            onGoogleAuth={handleGoogleAuth}
            onAppleAuth={handleAppleAuth}
            onFacebookAuth={() => setError('Facebook authentication coming soon!')}
            onSignIn={() => setMode('login')}
            error={error}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}


export default Page;
