# Authentication System Documentation

## Overview
This document explains the authentication system implementation for the Scout Me Online web application. The system supports both social authentication (Google) and email/password authentication.

## File Structure
```
src/
├── components/
│   └── auth/
│       ├── AuthCard.tsx    # Main authentication container component
│       └── AuthForm.tsx    # Form component for email/password auth
├── lib/
│   └── api/
│       └── auth.ts         # API integration utilities
└── app/
    └── auth/
        └── page.tsx        # Main authentication page
```

## Components

### AuthCard.tsx
- Main container for authentication UI
- Handles social authentication buttons
- Supports both login and signup modes
- Features:
  - Modern glassmorphism design
  - Smooth animations using Framer Motion
  - Social authentication buttons (Google, optional GitHub)
  - Error message display

### AuthForm.tsx
- Handles email/password authentication
- Features:
  - Form validation using Yup
  - Real-time error feedback
  - Password strength requirements
  - Responsive design
  - Animated error messages

## API Integration

The `auth.ts` utility provides a clean interface for backend communication:

```typescript
// Example usage:
import authAPI from '@/lib/api/auth';

// Registration
await authAPI.register({
  user_sub: 'user_id',
  name: 'User Name',
  email: 'user@example.com',
  auth_provider: 'email'
});

// Login
await authAPI.login('user@example.com', 'password');
```

## Authentication Flow

1. **Social Authentication (Google)**
   ```
   User clicks Google button
   ↓
   Firebase popup opens
   ↓
   User authenticates
   ↓
   Check if new user
   ↓
   If new: Register in backend
   ↓
   Redirect to dashboard
   ```

2. **Email/Password Authentication**
   ```
   User fills form
   ↓
   Form validation
   ↓
   API call (login/register)
   ↓
   Success: Redirect to dashboard
   Error: Show error message
   ```

## Styling

The UI uses a modern design with:
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations
- Responsive layout
- Dark mode friendly colors

Example of the gradient background:
```css
bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800
```

## Error Handling

Errors are handled at multiple levels:
1. Form validation (client-side)
2. API calls (network/server errors)
3. Authentication provider errors

Error messages are displayed in a user-friendly format with animations.

## Future Improvements

1. Add more social providers (GitHub, Twitter)
2. Implement password reset functionality
3. Add 2FA support
4. Add remember me functionality
5. Implement session management
6. Add rate limiting for security

## Testing

To test the authentication system:

1. **Social Auth Testing**
   - Click the Google sign-in button
   - Test both new user and existing user flows
   - Verify error handling by disconnecting internet

2. **Email/Password Testing**
   - Test form validation
   - Try invalid credentials
   - Test password requirements
   - Verify error messages

## Dependencies

Required packages:
- framer-motion (animations)
- yup (form validation)
- react-hook-form (form handling)
- axios (API calls)
- firebase (social auth)

## Security Notes

1. All API calls use HTTPS
2. Passwords are never stored in frontend
3. Sensitive data is not logged
4. Form validation prevents injection attacks
5. Error messages don't reveal sensitive information
