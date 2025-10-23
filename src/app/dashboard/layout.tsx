'use client'
import React from "react";
import MyNavbar from "@/components/layout/MyNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen flex flex-col min-h-screen bg-white/95">
      <MyNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
