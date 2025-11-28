import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      await login(email, password);
      setInfo('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      
      // Check for email confirmation needed
      if (errorMsg.includes('Email not confirmed') || errorMsg.includes('not verified')) {
        setError('Your email has not been confirmed yet. Please check your email for the confirmation link.');
        setInfo('Didn\'t receive an email? Try signing up again.');
      } else if (errorMsg.includes('Invalid login credentials')) {
        setError('Email or password is incorrect. Please try again.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 rounded-2xl border border-white/10 p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-600 mb-2">
              SCENEFLIX
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                  {info && <p className="text-red-300 text-xs mt-2">{info}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          {info && !error && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-400 text-sm">{info}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900 text-gray-500">or</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-pink-500 hover:text-pink-400 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
            <p>
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
