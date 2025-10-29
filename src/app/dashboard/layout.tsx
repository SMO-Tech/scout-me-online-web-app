'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import React from "react";
import MyNavbar from "@/components/layout/MyNavbar";
import { useAuth } from '@/lib/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()

  const { user } = useAuth()

  useEffect(() => {
    if (user === undefined) return; // Firebase still loading session
    if (user === null) router.replace("/auth");
  }, [user, router]);

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