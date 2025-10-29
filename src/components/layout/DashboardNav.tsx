'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  FiUpload, FiUser, FiLogOut, FiMenu, FiX, FiHeart,
  FiCreditCard, FiBookOpen, FiChevronDown
} from 'react-icons/fi';
import { auth } from '@/lib/firebaseConfig';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/AuthContext';
import { User } from 'firebase/auth';

export default function DashboardNav() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {user} = useAuth()


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
      await auth.signOut();
      router.replace('/auth');
    } catch (error) {
      toast.error('Something went wrong, please try again!');
    }
  };

  const navItems = [
    { label: 'New Upload', icon: <FiUpload className="w-5 h-5" />, href: '/dashboard' },
    { label: 'Library', icon: <FiBookOpen className="w-5 h-5" />, href: '/library' },
    { label: 'Plans', icon: <FiCreditCard className="w-5 h-5" />, href: '/plans' },
    { label: 'Favorites', icon: <FiHeart className="w-5 h-5" />, href: '/favorites' },
  ];

  // Helper for initials
  const getInitial = (user: User) => user.displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                Scout<span className="text-purple-600">Me</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8 items-center">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* User Menu */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User Avatar'}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">{getInitial(user)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.displayName || 'User'}</span>
                  <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-purple-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-100 mb-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User Avatar'} className="h-10 w-10 rounded-full" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-purple-600">{getInitial(user)}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.displayName || 'User'}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            )}

            {/* Navigation Items - Mobile */}
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-3 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Profile & Logout - Mobile */}
            {user && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 px-3 py-3 rounded-lg transition-colors"
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
