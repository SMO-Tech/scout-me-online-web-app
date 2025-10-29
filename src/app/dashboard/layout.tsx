'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/api/auth.service';
import React from "react";
import MyNavbar from "@/components/layout/MyNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <MyNavbar />
      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}