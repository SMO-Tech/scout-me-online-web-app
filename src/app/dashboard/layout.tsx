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

  if(!user) router.replace('/auth')

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