'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  FiUpload, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown, FiFilePlus, FiList
} from 'react-icons/fi';
import { auth } from "@/lib/firebaseConfig";
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/AuthContext';
import { User } from 'firebase/auth';
import Image from 'next/image';

export default function DashboardNav() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) router.replace('/auth');
  }, [user, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) await auth.signOut();
      router.replace("/auth");
    } catch (error) {
      toast.error("Something went wrong, please try again!");
    }
  };

  const navItems = [
    {
      label: 'New Analysis',
      // Replaced with React Icon, removed hardcoded color/div wrapper
      icon: <FiFilePlus className="w-5 h-5" />, 
      href: '/dashboard/form'
    },
    {
      label: 'Matches',
      // Replaced Image with suitable React Icon
      icon: <FiList className="w-5 h-5" />,
      href: '/dashboard/matches'
    },
  ];


  const getInitial = (user: User) => user.displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="relative z-[999] bg-white backdrop-blur-md h-20 items-center pt-3 shadow-sm border-b border-gray-200 ">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              {/* Ensure you swap this image for a dark version if your logo is white-only */}
              <Image className='mt-2' src={"/images/new-logo.png"} width={80} height={70} alt={'website logo'} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-6 items-center">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-orange-600 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}


            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                >
                  {isProfileDropdownOpen ? <FiX className="h-6 w-6 text-gray-900" /> : <FiMenu className="h-6 w-6 text-gray-900" />}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 backdrop-blur-sm">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 hover:text-orange-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full rounded-md"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-orange-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX className="h-6 w-6 text-gray-900" /> : <FiMenu className="h-6 w-6 text-gray-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white backdrop-blur-sm border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-200 mb-2">
                {user.photoURL ? (
                  <div className="p-[2px] rounded-full bg-gradient-to-r from-orange-500 to-orange-700">
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User Avatar'}
                      className="h-10 w-10 rounded-full bg-white"
                    />
                  </div>

                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-900">{getInitial(user)}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            )}

            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-900 hover:text-orange-600 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {user && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/dashboard/profile/"
                  className="flex items-center space-x-3 text-gray-900 hover:text-orange-600 hover:bg-gray-100 px-3 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center space-x-3 text-red-600 hover:bg-red-50 px-3 py-3 rounded-lg transition-colors w-full"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}