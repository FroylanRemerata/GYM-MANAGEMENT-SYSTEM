# Authentication System Setup Guide

## Overview

The Astral Gym Management System now includes a complete authentication system using Supabase Auth. This guide covers:

1. Setting up Supabase Auth
2. Creating staff/admin accounts
3. How to use the login system
4. Testing authentication locally

---

## Prerequisites

- Supabase project created (see `DATABASE_SETUP.md`)
- Supabase API keys configured in `.env.local`
- Next.js app running locally or deployed

---

## Step 1: Enable Supabase Auth

### 1.1 Go to Supabase Dashboard

1. Visit [app.supabase.com](https://app.supabase.com)
2. Open your `astral-gym` project
3. Click **Authentication** in the left sidebar
4. Click **Providers**

### 1.2 Enable Email Provider

1. Click **Email** in the providers list
2. Toggle **Enable Email** to ON
3. Keep "Confirm email" ON for additional security
4. Click **Save**

### 1.3 Configure Email Settings (Optional)

- Go to **Email Templates** to customize confirmation emails
- Default templates work fine for development

---

## Step 2: Create Staff/Admin Accounts

### Method 1: Create Directly in Supabase (Recommended for Testing)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - **Email**: `admin@astral-gym.com`
   - **Password**: Create a strong password (e.g., `SecurePassword123!`)
4. Toggle **Auto confirm user** to ON
5. Click **Create user**
6. Repeat for other staff members

### Example Test Accounts

```
Email: admin@astral-gym.com
Password: SecurePassword123!

Email: manager@astral-gym.com
Password: SecurePassword123!

Email: staff@astral-gym.com
Password: SecurePassword123!
```

### Method 2: Programmatic Signup (For Production)

Use the Supabase Admin API:

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/auth/v1/admin/users" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@astral-gym.com",
    "password": "SecurePassword123!",
    "email_confirm": true,
    "user_metadata": {
      "role": "admin"
    }
  }'
```

---

## Step 3: Test Login Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
   - You'll be redirected to login if not authenticated
   - Or go directly to `http://localhost:3000/login`

3. Enter test credentials:
   - **Email**: `admin@astral-gym.com`
   - **Password**: `SecurePassword123!`

4. Click **Sign In**

5. You should be redirected to `/dashboard`

---

## Step 4: Authentication Flow

### Login Flow
```
User visits root (/) 
  → Home page checks auth status
  → If logged in → redirect to /dashboard
  → If not logged in → redirect to /login
  → Login page displays form
  → User enters credentials
  → Supabase Auth verifies
  → If valid → create session → redirect to /dashboard
  → If invalid → show error message
```

### Protected Routes
All these routes require authentication:
- `/dashboard`
- `/members`
- `/attendance`
- `/sales`
- `/reports`
- `/reminders`

If unauthenticated user tries to access → redirected to `/login`

### Logout
Click the user menu (top-right) → Click **Logout**
- Session is cleared
- User is redirected to `/login`

---

## Step 5: Code Structure

### Key Files

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Core authentication functions (signIn, signOut, getSession) |
| `lib/auth-context.tsx` | React context for auth state management |
| `app/login/page.tsx` | Login page UI |
| `app/layout-wrapper.tsx` | Wraps app with AuthProvider |
| `app/layout.tsx` | Root layout with LayoutWrapper |
| `components/Topbar.tsx` | User menu with logout button |

### Using Auth in Components

```typescript
import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not logged in</div>;

  return <div>Hello {user?.email}</div>;
}
```

### Protecting Pages

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function ProtectedPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

---

## Step 6: Deploy to Vercel

### 1. Add Environment Variables to Vercel

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Add these variables (same as `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

### 2. Configure Supabase Redirect URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   https://YOUR_VERCEL_APP.vercel.app/auth/callback
   https://YOUR_VERCEL_APP.vercel.app
   ```
3. Click **Save**

### 3. Deploy

Push to GitHub and Vercel will automatically deploy:

```bash
git add .
git commit -m "feat: add authentication system"
git push origin main
```

---

## Troubleshooting

### Issue: "Invalid credentials" on login

- **Solution**: Verify the user exists in Supabase (Authentication → Users)
- **Solution**: Check email/password are correct
- **Solution**: Ensure "Auto confirm user" was enabled when creating account

### Issue: Redirects to login even when authenticated

- **Solution**: Check `.env.local` has correct Supabase credentials
- **Solution**: Check browser cookies are not blocked
- **Solution**: Hard refresh page (Ctrl+Shift+R)

### Issue: "useAuth must be used within AuthProvider"

- **Solution**: Ensure page is wrapped with `<AuthProvider>` (done in `app/layout-wrapper.tsx`)
- **Solution**: Check component is marked with `'use client'`

### Issue: CORS errors

- **Solution**: Verify Supabase API keys are correct
- **Solution**: Check NEXT_PUBLIC_ variables are set (not SUPABASE_)

---

## Security Best Practices

1. **Never commit `.env.local`** to GitHub - it's in `.gitignore`
2. **Use strong passwords** for staff accounts
3. **Enable email confirmation** for production
4. **Use HTTPS only** in production
5. **Rotate API keys** periodically
6. **Use service role key only server-side**
7. **Implement Row Level Security (RLS)** policies in Supabase (optional)

---

## Next Steps

- [Set up database tables](DATABASE_SETUP.md)
- [Deploy to Vercel](DEPLOYMENT.md)
- [Complete project structure guide](PROJECT_STRUCTURE.md)

---

## Support

For issues or questions:
1. Check [Supabase Auth docs](https://supabase.com/docs/guides/auth)
2. Check [Next.js auth best practices](https://nextjs.org/docs/authentication)
3. Review error messages in browser console (F12)
