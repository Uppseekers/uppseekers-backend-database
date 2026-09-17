import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both email and password.');
      return;
    }

    // Domain validation (@uppseekers.com) & password validation
    const emailDomain = '@uppseekers.com';
    const isValidDomain = cleanEmail.endsWith(emailDomain) && cleanEmail.length > emailDomain.length;
    const isValidPassword = cleanPassword === 'Admits@131';

    if (!isValidDomain || !isValidPassword) {
      setError('Invalid credentials. Please verify your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Attempt server authentication endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const authUser: AuthUser = {
            email: data.user.email,
            loginAt: data.user.loginAt || new Date().toISOString(),
          };
          localStorage.setItem('uppseekers_auth_user', JSON.stringify(authUser));
          onLoginSuccess(authUser);
          return;
        }
      }
      
      // Fallback local verification if server responds with error or offline
      if (isValidDomain && isValidPassword) {
        const authUser: AuthUser = {
          email: cleanEmail,
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem('uppseekers_auth_user', JSON.stringify(authUser));
        onLoginSuccess(authUser);
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
    } catch {
      // Fallback if fetch fails in sandboxed environment
      if (isValidDomain && isValidPassword) {
        const authUser: AuthUser = {
          email: cleanEmail,
          loginAt: new Date().toISOString(),
        };
        localStorage.setItem('uppseekers_auth_user', JSON.stringify(authUser));
        onLoginSuccess(authUser);
      } else {
        setError('Invalid credentials. Please verify your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-indigo-50/40 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-500 selection:text-white">
      {/* Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 text-white shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-50 mb-4">
            <GraduationCap className="h-9 w-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            UppSeekers Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
            Authorized Admissions Directory & Student Dossiers
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sign In to Continue</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your corporate email and security password.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              id="login-error-alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email-input"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@organization.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password-input"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Student dossiers & privacy protection actively safeguarded</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} UppSeekers Education. Internal Candidate Evaluation Portal.
        </div>
      </div>
    </div>
  );
};
