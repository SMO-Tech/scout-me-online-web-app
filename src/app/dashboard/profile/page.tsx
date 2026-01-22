"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);


  // Senior Engineer Tip: Use a "Skeleton" loader instead of text for better perceived performance
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        No active session found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* UI Enhancement: Card container 
        Added a subtle border and shadow to lift the content off the white page 
      */}
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* HERO SECTION */}
        <div className="flex flex-col items-center pt-10 pb-6 px-6 border-b border-gray-200">
          <div className="relative group">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Avatar"
                width={100}
                height={100}
                // Applied the Orange Ring here for brand consistency
                className="rounded-full object-cover ring-4 ring-orange-500/20 group-hover:ring-orange-500 transition-all duration-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold ring-4 ring-orange-500/20">
                {user.displayName?.[0] ?? "?"}
              </div>
            )}
            <span className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mt-4 text-center">
            {user.displayName ?? "Anonymous User"}
          </h1>
          <p className="text-sm text-gray-500 font-medium">{user.email}</p>
        </div>

        {/* INFO SECTION */}
        <div className="px-6 py-6 space-y-5">
          <InfoRow 
            label="Provider" 
            value={user.providerData[0]?.providerId ?? "Email"} 
          />
          <InfoRow 
            label="Verified" 
            value={user.emailVerified ? "Yes" : "No"} 
            highlight={user.emailVerified}
          />
          <InfoRow 
            label="Member Since" 
            value={user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"} 
          />
        </div>
      </div>
    </div>
  );
};

// Extracted Component for cleaner code
type InfoRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

const InfoRow = ({ label, value, highlight }: InfoRowProps) => {
  return (
    <div className="flex justify-between items-center text-sm group">
      <span className="text-gray-500 group-hover:text-gray-900 transition-colors duration-200">
        {label}
      </span>
      <span className={`font-medium ${highlight ? "text-green-600" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
};

export default ProfilePage;