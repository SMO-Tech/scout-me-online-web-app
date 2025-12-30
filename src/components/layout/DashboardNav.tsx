'use client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  FiUpload, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown
} from 'react-icons/fi';
import { auth } from '@/lib/firebaseConfig';
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
      await auth.signOut();
      router.replace('/auth');
    } catch (error) {
      toast.error('Something went wrong, please try again!');
    }
  };

  const navItems = [
    {
      label: 'New Analysis',
      icon: (
       <div className="relative flex items-center justify-center w-8 h-8 before:absolute before:inset-0 before:rounded-full before:bg-purple-500/30 before:blur-md before:z-0">

          <FiUpload color='#00FCFF' size={24} 
 />
        </div>
      ),
      href: '/dashboard/form'
    },
    {
      label: 'Matches',
      icon: (
        <div className="relative w-8 h-8 before:absolute before:inset-0 before:rounded-full before:bg-purple-500/30 before:blur-md before:z-0">

          <Image
            src="/images/nav-field-icon.png"
            alt="Matches"
            width={40}
            height={40}
            className="relative z-10 object-contain w-full h-full"

          />
        </div>
      ),
      href: '/dashboard/matches'
    },
    {
      label: 'Scouting Profiles',
      icon: (
        <div className="relative w-8 h-8 before:absolute before:inset-0 before:rounded-full before:bg-purple-500/30 before:blur-md before:z-0">

          <Image
            src="/images/nav-player-icon.png"
            alt="Scouting"
            width={60}
            height={60}
            className="relative z-10 object-contain w-full h-full"

          />
        </div>
      ),
      href: '/dashboard/scouting-profiles'
    },
    {
      label: 'Clubs',
      icon: (
      <div className="relative w-8 h-8 before:absolute before:inset-0 before:rounded-full before:bg-purple-500/30 before:blur-md before:z-0">

          <Image
            src="/images/nav-club-icon.png"
            alt="Clubs"
            width={60}
            height={60}
            className="relative z-10 object-contain w-full h-full"

          />
        </div>
      ),
      href: '/dashboard/clubs'
    },
  ];


  const getInitial = (user: User) => user.displayName?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="relative z-[999] bg-black backdrop-blur-md h-20 items-center pt-3 shadow-lg border-b border-gray-700/30 ">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image className='mt-2' src={"/images/new-logo.png"} width={80} height={70} alt={'website logo'} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-6 items-center">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-purple-400 hover:bg-white/10 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User Avatar'}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-purple-600/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">{getInitial(user)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">{user.displayName || 'User'}</span>
                  <FiChevronDown className={`w-4 h-4 text-white transition-transform ${isProfileDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[rgba(20,20,25,0.95)] rounded-lg shadow-lg py-1 z-50 border border-gray-700/40 backdrop-blur-sm">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-white hover:text-purple-400 hover:bg-white/10 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => { setIsProfileDropdownOpen(false); handleLogout(); }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-red-600/20 transition-colors w-full rounded-md"
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
              className="text-white hover:text-purple-400 focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX color='#00FCFF' className="h-6 w-6" /> : <FiMenu color='#00FCFF' className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[rgba(20,20,25,0.95)] backdrop-blur-sm border-t border-gray-700/30">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-700/30 mb-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User Avatar'} className="h-10 w-10 rounded-full" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-purple-600/30 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white">{getInitial(user)}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{user.displayName || 'User'}</span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>
              </div>
            )}

            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-white hover:text-purple-400 hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {user && (
              <div className="border-t border-gray-700/30 pt-2 mt-2">
                <Link
                  href="/dashboard/profile/"
                  className="flex items-center space-x-3 text-white hover:text-purple-400 hover:bg-white/10 px-3 py-3 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center space-x-3 text-red-500 hover:bg-red-600/20 px-3 py-3 rounded-lg transition-colors w-full"
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
