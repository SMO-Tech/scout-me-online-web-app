import { STORAGE_KEYS } from '@/services/config'

export const protectedPaths = ['/dashboard', '/profile', '/library', '/plans', '/favorites']
export const authPaths = ['/auth']

export function isAuthenticated(): boolean {
  // Only check authentication on the client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)

    return !!token && !!userId && !!userData
  }
  return false
}

export function redirectToAuth(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth'
  }
}

export function redirectToDashboard(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard'
  }
}

export function checkAuthAndRedirect(currentPath: string): void {
  if (typeof window !== 'undefined') {
    const isLoggedIn = isAuthenticated()

    // Check if user is trying to access protected routes without auth
    if (protectedPaths.some(pp => currentPath.startsWith(pp)) && !isLoggedIn) {
      redirectToAuth()
    }

    // Prevent authenticated users from accessing auth pages
    if (authPaths.some(ap => currentPath.startsWith(ap)) && isLoggedIn) {
      redirectToDashboard()
    }
  }
}

export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_ID)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
  }
}
