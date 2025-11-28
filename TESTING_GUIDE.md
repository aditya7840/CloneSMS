# Quick Testing Guide - Login/Signup Flow

## Step 1: Configure Supabase for Testing

### Fastest Way (Disable Email Confirmation)

1. Open your **Supabase Dashboard**
2. Go to **Authentication** → **Providers** → **Email**
3. **Toggle OFF** the "Confirm email" option
4. Click **Save**

✅ **This allows instant testing without checking emails**

---

## Step 2: Start Your Application

```powershell
cd d:\CloneSMS
npm run dev
```

This starts the development server (usually at `http://localhost:5173`)

---

## Step 3: Test the Signup Flow

### Test Case 1: Create New Account
1. Click **"Sign up"** link (or go to `/signup`)
2. Fill in:
   - **Full Name:** `Test User`
   - **Email:** `test@example.com`
   - **Password:** `password123`
   - **Confirm Password:** `password123`
3. Click **"Sign Up"** button

**Expected Result:**
- ✅ If email confirmation is **disabled**: Should auto-login and redirect to home
- ✅ If email confirmation is **enabled**: Shows message "Check your email to confirm"

---

## Step 4: Test the Login Flow

### Test Case 2: Login with Created Account
1. Go to **Login** page (click login or visit `/login`)
2. Enter credentials:
   - **Email:** `test@example.com`
   - **Password:** `password123`
3. Click **"Sign In"** button

**Expected Results:**
- ✅ If email confirmed: "Login successful!" → Redirected to home page
- ⚠️ If email NOT confirmed: Error message with instructions to check email

---

## Step 5: Verify Session Persistence

### Test Case 3: Refresh and Session Check
1. After successful login, refresh the page (`F5`)
2. Should remain logged in (session persisted)
3. Check navbar shows user is logged in

**Expected Result:**
- ✅ User session persists after page refresh
- ✅ Protected pages (Profile, My List, Checkout) are accessible

---

## Step 6: Test Logout

### Test Case 4: Logout
1. Click user menu/profile button in navbar
2. Click **"Logout"**
3. Verify redirected to home page

**Expected Result:**
- ✅ User is logged out
- ✅ Session is cleared
- ✅ Cannot access protected pages

---

## Step 7: Test Error Cases

### Test Case 5: Wrong Password
1. Go to **Login**
2. Enter:
   - Email: `test@example.com`
   - Password: `wrongpassword`
3. Click **"Sign In"**

**Expected Result:**
- ✅ Error: "Email or password is incorrect"

### Test Case 6: Non-existent Email
1. Go to **Login**
2. Enter:
   - Email: `nonexistent@example.com`
   - Password: `password123`
3. Click **"Sign In"**

**Expected Result:**
- ✅ Error: "Email or password is incorrect"

### Test Case 7: Missing Fields
1. Go to **Login**
2. Leave email and password empty
3. Click **"Sign In"**

**Expected Result:**
- ✅ Error: "Please fill in all fields"

---

## Complete Testing Checklist

- [ ] Signup creates new account
- [ ] Signup success message appears
- [ ] Can login immediately after signup (if email confirmation disabled)
- [ ] Login with correct credentials works
- [ ] Login redirects to home page
- [ ] Session persists after page refresh
- [ ] Wrong password shows error
- [ ] Non-existent email shows error
- [ ] Logout works and clears session
- [ ] Protected pages are accessible when logged in
- [ ] Cannot access protected pages when logged out
- [ ] Navbar shows login/profile button based on auth state

---

## Troubleshooting During Testing

### Issue: "Cannot find user_profiles table"
**Solution:**
- Run the schema file in Supabase SQL Editor
- Run: `SUPABASE_SCHEMA_V2.sql`

### Issue: "Invalid Supabase credentials"
**Solution:**
- Check `.env` file has correct values:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Get these from Supabase Dashboard → Project Settings

### Issue: "Email confirmation required" appears during login
**Solution:**
- Disable email confirmation in Supabase (see Step 1)
- OR check your email inbox and click confirmation link

### Issue: Session not persisting after refresh
**Solution:**
- Check browser DevTools → Application → Cookies/Storage
- Supabase auth token should be stored
- Clear cache and try again
- Check browser console for errors

### Issue: Still showing old error after code changes
**Solution:**
- Clear browser cache (`Ctrl+Shift+Delete`)
- Hard refresh (`Ctrl+Shift+F5`)
- Restart development server (`npm run dev`)

---

## Testing Different Email Confirmation Settings

### Testing with Email Confirmation DISABLED (Recommended for Dev)

```
Signup Email → Account Created → Auto Login → Home Page
                                (instant, no email check)
```

### Testing with Email Confirmation ENABLED (Production)

```
Signup Email → Account Created → Check Email → Click Link → Email Confirmed → Login Works
                                (requires email access)
```

---

## Files Ready for Testing

✅ `src/services/AuthService.ts` - Auth logic with email confirmation handling
✅ `src/pages/Signup.tsx` - Signup UI with confirmation feedback
✅ `src/pages/Login.tsx` - Login UI with error messages
✅ `src/context/AuthContext.tsx` - Auth state management
✅ `src/hooks/useAuth.ts` - Custom hook for using auth
✅ `EMAIL_CONFIRMATION_SETUP.md` - Detailed setup guide

---

## Next: Test Booking Flow

After verifying login/signup works:
1. Browse events on home page
2. Click an event to view details
3. Add to favorites (bookmark)
4. Click "Book Now"
5. Go through checkout process
6. View booking confirmation

---

**Status:** ✅ All auth components updated and ready for testing!

Check the `EMAIL_CONFIRMATION_SETUP.md` file for detailed configuration instructions.
