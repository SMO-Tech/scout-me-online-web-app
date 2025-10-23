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
      setIsLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const { displayName, email, photoURL } = user;
      const credentials = await user.getIdTokenResult();
      
      if (!email || !displayName) {
        throw new Error('Failed to get required user information from Google');
      }

      // Use the original avatar URL
      const avatarUrl = photoURL || null;

      // Format the expiration date to ISO string
      const expirationDate = new Date(credentials.expirationTime).toISOString();

      // Prepare OAuth data
      const oauthData = {
        oauth_id: `google_${user.uid}`,
        email: email,
        name: displayName,
        auth_provider: 'google' as const,
        avatar: avatarUrl,
        access_token: credentials.token,
        refresh_token: user.refreshToken || null,
        token_expires: expirationDate
      };

      console.log('Sending OAuth data:', oauthData);

      try {
        // Register with our backend
        const response = await authService.registerOAuth(oauthData);
        
        // Show success message
        toast.success('Successfully signed in with Google!');
        
        // Refresh to ensure middleware picks up the new cookie
        router.refresh();
        
        // Redirect to dashboard using replace
        router.replace('/dashboard');
        return;
      } catch (error: any) {
        console.error('OAuth Error:', error);
        // Check if it's a network error
        if (!navigator.onLine || error.message.includes('Network Error')) {
          throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
        }
        throw error;
      }
    } catch (e: any) {
      setError(e.message || 'Authentication failed. Please try again.');
      console.error('Google Auth Error:', e);
    } finally {
      setIsLoading(false);
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

      // Show success message
      toast.success('Successfully logged in!');
      
      // Handle remember me
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', data.username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('username');
      }
      
      // Refresh to ensure middleware picks up the new cookie
      router.refresh();
      
      // Use replace instead of push to prevent back navigation
      router.replace('/dashboard');
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
