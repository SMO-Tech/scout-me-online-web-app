"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, facebookProvider, googleProvider, isFirebaseConfigured } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAdditionalUserInfo,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  applyActionCode,
} from "firebase/auth";
import { getClient } from "@/lib/api/client";
import { useAuth } from "@/lib/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";

// ============================================================================
// AUTH PAGE COMPONENT
// ============================================================================
const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();

  // View State
  const [isLogin, setIsLogin] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Get the oobCode from URL
  const mode = searchParams.get("mode");

  const oobCode = searchParams.get("oobCode");
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const actionCodeSettings = {
    url: `${url}/auth`,
    handleCodeInApp: true,
  };


  // Protect Route & Check for Reset Code
  useEffect(() => {
    // If user is logged in AND verified, send to dashboard
    // If logged in but NOT verified, we stay here or show a prompt
    if (currentUser && currentUser.emailVerified && !oobCode) {
      router.replace("/dashboard");
    }
    if (mode === "resetPassword" && oobCode) {
      setIsResettingPassword(true);
    }
  }, [currentUser, router, oobCode]);

  // refresh latest email flag and change UI state
  useEffect(() => {
    if (auth?.currentUser) auth.currentUser.reload();
  }, []);

  // handle email verification
  useEffect(() => {
    if (!auth || mode !== "verifyEmail" || !oobCode) return;
    const authInstance = auth;
    const handleVerifyEmail = async () => {
      try {
        await applyActionCode(authInstance, oobCode);
        await authInstance.currentUser?.reload();
        toast.success("Email verified successfully.");
        router.replace("/auth");
      } catch {
        toast.error("Verification link invalid or expired.");
      }
    };
    handleVerifyEmail();
  }, [mode, oobCode]);

  // --------------------------------------------------------------------------
  // LOGIC: BACKEND SYNCHRONIZATION
  // --------------------------------------------------------------------------
  const syncWithBackend = async (user: any, name?: string) => {
    try {
      const client = await getClient();
      await client.post("/user/register", {
        name: name || user.displayName,
        email: user.email,
        phone: user.phoneNumber || "",
        photoUrl: user.photoURL || "",
        UID: user.uid,
      });
    } catch (e: any) {
      console.error("Database Sync Error:", e.response?.data || e.message);
    }
  };

  // --------------------------------------------------------------------------
  // LOGIC: AUTH HANDLERS
  // --------------------------------------------------------------------------
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, email, password);

        await res.user.reload(); // refresh status

        if (!res.user.emailVerified) {
          setShowVerifyNotice(true);
          toast.error("Please verify your email before logging in.");
          return; // 🚨 STOP HERE
        }

        toast.success("Welcome back");
        router.push("/dashboard");
        return; // 🚨 END LOGIN FLOW
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        // 1. Set Firebase Display Name
        await updateProfile(res.user, { displayName: username });

        // 2. Send Verification Email
        await sendEmailVerification(res.user, actionCodeSettings);

        // 3. Create Record in Backend
        await syncWithBackend(res.user, username);

        toast.success(
          "User Registration completed! Check your email for verification."
        );
        setIsLogin(true); // Switch to login mode so they can sign in after verifying
        setEmail("");
        setPassword("");
        setUsername("");
      }

      // if (isLogin) router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: unknown) => {
    if (!auth) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await signInWithPopup(auth, provider as import("firebase/auth").AuthProvider);
      const isNewUser = getAdditionalUserInfo(res)?.isNewUser;

      if (isNewUser) {
        await syncWithBackend(res.user);
      }

      toast.success("Identity Verified");
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    try {
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      toast.success("Reset link sent to your inbox");
      setShowResetModal(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode || !auth) return;
    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password updated! Please login.");
      setIsResettingPassword(false);
      router.replace("/auth");
    } catch (err: any) {
      toast.error("Link expired or invalid. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase not configured — show instructions instead of auth UI
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-gray-900">
        <div className="bg-white border border-gray-200 p-10 rounded-[2rem] w-full max-w-md shadow-2xl shadow-gray-200/50 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Authentication not configured</h1>
          <p className="text-gray-500 text-sm mb-6">
            Add <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_FIREBASE_API_KEY</code> and other
            Firebase env vars to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-900 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // RENDER RESET PASSWORD UI
  if (isResettingPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-gray-900">
        <div className="bg-white border border-gray-200 p-10 rounded-[2rem] w-full max-w-md shadow-2xl shadow-gray-200/50">
          <h1 className="text-gray-900 text-3xl font-bold tracking-tight mb-2">
            New Password
          </h1>

          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-8">
            Enter your new security credentials below.
          </p>
          <form onSubmit={handleConfirmPasswordReset} className="space-y-6">
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-5 pr-12 text-sm text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 transition-all uppercase text-xs tracking-widest"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-gray-900">
      {/* Ambient Background - Adjusted for Light Theme */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/50 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Card */}
      <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 w-full max-w-md relative z-10">
        <div className="text-center items-center justify-center flex flex-col mb-10">
          {/* Ensure your logo works on white background */}
          <Image 
            onClick={() => router.push('/')} 
            src={"/images/new-logo.png"} 
            alt={"scout me logo"} 
            width={200} 
            height={80} 
            className="cursor-pointer mb-2"
          />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">
            {isLogin ? "Welcome Back" : "Create Account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl mb-6 text-center uppercase tracking-wide">
            {error}
          </div>
        )}

        {/* resend email for email verification */}
        {showVerifyNotice && (
          <div className="bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold p-4 rounded-xl mb-6 text-center uppercase tracking-wide">
            Email not verified.
            <button
              onClick={async () => {
                if (!auth?.currentUser) return;
                await sendEmailVerification(auth.currentUser, actionCodeSettings);
                toast.success("Verification email sent.");
              }}
              className="ml-2 underline text-gray-900 hover:text-orange-600"
            >
              Resend link
            </button>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-5 text-sm text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300"
                placeholder="Full Name"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-4 px-5 text-sm text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300"
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center pr-1">
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-gray-400 hover:text-orange-600 text-[10px] font-bold uppercase transition-colors"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-5 pr-12 text-sm text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-200 hover:shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-50 text-xs tracking-widest uppercase mt-4"
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-8">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-2 text-[10px] text-gray-400 font-bold uppercase absolute tracking-[0.2em]">
            or continue with
          </span>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleSocialAuth(googleProvider)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <FcGoogle size={18} />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              Google
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth(facebookProvider)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <FaFacebook size={18} className="text-[#1877F2]" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              Facebook
            </span>
          </button>
        </div>

        <p className="mt-10 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </p>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-gray-900 text-xl font-bold tracking-tight mb-2">
              Reset Password
            </h3>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-6 leading-relaxed">
              Enter your email to receive recovery instructions.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="user@example.com"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 text-[10px] font-bold uppercase text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 hover:bg-orange-600 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;