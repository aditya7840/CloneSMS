# Email Confirmation Setup Guide

## Overview

The SceneFlix authentication system requires email confirmation by default in Supabase. This guide explains the flow and how to fix the login issue.

## Current Issue

After signup, users receive an email confirmation requirement. The login fails until the email is confirmed.

**Error Message:**
```
"Please confirm your email before logging in. Check your email for the confirmation link."
```

## The Login/Signup Flow

### Step 1: Signup Process
1. User enters: Full Name, Email, Password
2. Validation checks password strength and format
3. Account is created in Supabase Auth
4. User profile is created in the `user_profiles` table
5. **Email confirmation link is sent** to the user's email

**What happens next:**
- If email confirmation is required: User sees success message with instructions
- If email confirmation is disabled: User is auto-logged in

### Step 2: Email Confirmation (if required)
1. User receives confirmation email at their registered email address
2. User clicks the confirmation link in the email
3. Their email is marked as confirmed in Supabase
4. User can now proceed to login

### Step 3: Login Process
1. User enters Email and Password
2. System checks if email is confirmed
3. If not confirmed: Login fails with instruction to check email
4. If confirmed: User is logged in and redirected to home page

## Two Options to Fix

### Option 1: Disable Email Confirmation (For Development/Testing)

This is the quickest way to test locally. In your **Supabase Dashboard**:

1. Go to **Authentication** → **Providers**
2. Click on **Email**
3. Disable **Confirm email**
4. Click **Save**

After this:
- New signups will be auto-confirmed
- Users can login immediately after signup
- No confirmation emails will be sent

**Status:** ✅ Login will work immediately after signup

### Option 2: Use Email Confirmation (Production-Ready)

Keep email confirmation enabled for security:

1. **User receives confirmation email** after signup
2. User clicks link in email to confirm
3. After confirmation, user can login
4. This is more secure but requires access to emails

**Status:** ⚠️ Users must confirm email before login (requires checking email inbox)

## Testing the Flow Locally

### For Quick Testing (Option 1):
```
1. Signup: Enter email, password, name
2. See success message (auto-confirmed)
3. Go to Login page
4. Use same email and password
5. Login successful - redirected to home
```

### For Production Setup (Option 2):
```
1. Signup: Enter email, password, name
2. See message: "Check your email to confirm"
3. Check your email inbox (and spam folder)
4. Click confirmation link in email
5. Go to Login page
6. Use same email and password
7. Login successful - redirected to home
```

## Current Implementation Details

### AuthService Methods

**signup()** - Returns:
```typescript
{
  user: AuthUser,
  session: Session | null,
  error: any,
  needsConfirmation: boolean  // true if email confirmation required
}
```

**login()** - Enhanced to detect unconfirmed emails and provide helpful error messages

### UI Feedback

**Signup Page:**
- Shows success message when account is created
- Displays clear instructions if email confirmation is needed
- Link to navigate to login page

**Login Page:**
- Shows helpful error if email is not confirmed
- Suggests user check their email
- Provides link to signup again if needed

## Recommended Settings

For **Development:**
- Disable email confirmation
- Allows rapid testing

For **Staging:**
- Enable email confirmation
- Use test emails (Gmail, Outlook)
- Check spam folder for confirmation emails

For **Production:**
- Enable email confirmation
- Use proper email service (SendGrid, Mailgun)
- Ensure emails are delivered reliably

## Troubleshooting

### Problem: "Login failed" - Can't see specific error
**Solution:** 
- Check browser console for detailed error messages
- Verify email and password are correct
- Try the signup process again

### Problem: Confirmation email not received
**Solution:**
- Check spam/junk folder
- If using test email, enable disk email sending in Supabase
- Try a different email address
- Check Supabase email logs in dashboard

### Problem: Confirmation link expired
**Solution:**
- Signup again
- Confirmation links expire after a certain period
- Each new signup generates a new link

### Problem: User created but can't find profile
**Solution:**
- Profile is created automatically after signup
- If missing, check database logs
- May need to manually create profile via Supabase dashboard

## Environment Configuration

Make sure your `.env` file has:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Get these values from:
- Supabase Dashboard → Project Settings → API

## Files Modified

- `src/services/AuthService.ts` - Enhanced signup/login with email confirmation handling
- `src/pages/Signup.tsx` - Shows confirmation message after signup
- `src/pages/Login.tsx` - Shows helpful error for unconfirmed emails
- `src/context/AuthContext.tsx` - Updated to handle confirmation status

## Next Steps

1. Choose Option 1 or Option 2 based on your use case
2. Follow the steps to configure Supabase
3. Test the signup → login flow
4. If issues persist, check console logs for detailed error messages
