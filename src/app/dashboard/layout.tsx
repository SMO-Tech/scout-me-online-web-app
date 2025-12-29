'use client'
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import React from "react";
import { useAuth } from '@/lib/AuthContext';
import DashboardNav from '@/components/layout/DashboardNav';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()

  const { user } = useAuth()

  const memoNav = useMemo(()=><DashboardNav />,[])
  const memoFooter = useMemo(()=><Footer />,[])

  useEffect(() => {
    if (user === undefined) return; // Firebase still loading session
    if (user === null) router.replace("/auth");
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* memoised nav for dashboard */}
      {memoNav}
      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
      {memoFooter}
    </div>
  );
}