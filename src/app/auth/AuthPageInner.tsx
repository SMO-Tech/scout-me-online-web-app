"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, facebookProvider, googleProvider } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAdditionalUserInfo,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification, // Added for verification
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

  // refresh latest email flag and chagne UI state
  useEffect(() => {
    if (auth.currentUser) {
      auth.currentUser.reload();
    }
  }, []);

  // handle email verification
  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (mode === "verifyEmail" && oobCode) {
        try {
          await applyActionCode(auth, oobCode);
          await auth.currentUser?.reload();
          toast.success("Email verified successfully.");
          router.replace("/auth"); // triggers redirect to dashboard
        } catch {
          toast.error("Verification link invalid or expired.");
        }
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

  const handleSocialAuth = async (provider: any) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await signInWithPopup(auth, provider);
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
    try {
      // Pass actionCodeSettings here to return to your site
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      toast.success("Reset link sent to your inbox");
      setShowResetModal(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
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

  // RENDER RESET PASSWORD UI
  if (isResettingPassword) {
    return (
      <div className="min-h-screen bg-[#05060B] flex flex-col items-center justify-center px-4 text-white">
        <div className="bg-[#0B0D19] border border-cyan-500/30 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
          <h1 className="text-white text-3xl font-black italic uppercase mb-2 tracking-tighter">
            New Password
          </h1>

          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">
            Enter your new security credentials below.
          </p>
          <form onSubmit={handleConfirmPasswordReset} className="space-y-6">
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="NEW PASSWORD"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 pr-12 text-sm text-white-400 focus:border-cyan-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black italic py-4 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all uppercase text-xs tracking-widest"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05060B] flex flex-col items-center justify-center px-4 text-white">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-[#0B0D19]/90 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md relative z-10">
        <div className="text-center items-center justify-center flex flex-col mb-10">

          <Image onClick={() => router.push('/')} src={"/images/new-logo.png"} alt={"scout me logo"} width={200} height={80} />
          <p className="text-gray-200 text-[20px] font-bold uppercase tracking-[0.4em]  ">
            {isLogin ? "Login" : "Register"}
          </p>
        </div>

        {error && (
          <div className="bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold p-4 rounded-xl mb-6 text-center uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,0,0.6)]">
            {error}
          </div>

        )}

        {/* resend email for email verification */}
        {showVerifyNotice && (
          <div className="bg-yellow-600/10 border border-yellow-500/30 text-yellow-300 text-[10px] font-bold p-4 rounded-xl mb-6 text-center uppercase tracking-widest">
            Email not verified.
            <button
              onClick={async () => {
                if (!auth.currentUser) return;
                await sendEmailVerification(
                  auth.currentUser,
                  actionCodeSettings
                );
                toast.success("Verification email sent.");
              }}
              className="ml-2 underline text-cyan-300"
            >
              Resend link
            </button>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-cyan-400 text-[10px] font-black uppercase tracking-widest ml-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/50 rounded-xl py-4 px-5 text-sm text-green-400 focus:border-cyan-500 outline-none transition-all placeholder:text-green-700"
                placeholder="FULL NAME"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-cyan-400 text-[10px] font-black uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/50 rounded-xl py-4 px-5 text-sm text-white-400 focus:border-cyan-500 outline-none transition-all placeholder:text=grey-800"
              placeholder="USER@ACADEMY.COM"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center pr-1">
              <label className="text-cyan-400 text-[10px] font-black uppercase tracking-widest ml-1">
                Password
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-gray-300 hover:text-cyan-400 text-[9px] font-bold uppercase transition-colors"
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
                className="w-full bg-black/40 border border-white/50 rounded-xl py-4 px-5 pr-12 text-sm text-white-400 focus:border-cyan-500 outline-none transition-all placeholder:text-grey-700"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black italic py-4 rounded-xl shadow-[0_4px_20px_rgba(34,211,238,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 text-xs tracking-widest uppercase mt-4"
          >
            {isLoading ? "Executing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-white/20 w-full"></div>
          <span className="bg-[#0B0D19] px-2 text-[9px] text-gray-200 font-bold uppercase absolute tracking-[0.3em]">
            or continue with
          </span>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleSocialAuth(googleProvider)}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/5 py-2 rounded-xl hover:bg-white/10 transition-all"
          >
            <FcGoogle size={18} />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
              Google
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth(facebookProvider)}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/5 py-3 rounded-xl hover:bg-white/10 transition-all"
          >
            <FaFacebook size={18} className="text-[#1877F2]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
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
            className="text-[10px] font-bold text-gray-200 hover:text-cyan-400 uppercase tracking-widest transition-colors"
          >
            {isLogin
              ? "Create a new account!"
              : "Existing Member? Return to SignIn"}
          </button>
        </p>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B0D19] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
            <h3 className="text-white text-xl font-black italic uppercase tracking-tighter mb-2">
              Reset Passowrd
            </h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6 leading-relaxed">
              Enter your email to receive recovery instructions.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/50 rounded-xl py-4 px-5 text-sm text-green-400 placeholder:text-green-700 focus:border-cyan-500/50 outline-none"
                placeholder="USER@EMAIL.COM"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Send link
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
