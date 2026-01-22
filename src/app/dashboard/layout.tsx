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
    if (user === undefined) return;
    if (user === null) router.replace("/auth");
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 selection:bg-orange-100 selection:text-orange-900">
      {memoNav}
      <main className="w-full flex-grow animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        {children}
      </main>
      {memoFooter}
    </div>
  );
}