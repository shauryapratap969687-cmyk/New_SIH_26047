import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Stethoscope,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [autofilled, setAutofilled] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Invalid credentials');
        setLoading(false);
      }
    }, 300);
  };

  const handleFillDemo = () => {
    setEmail('doctor@ayush.demo');
    setPassword('Ayush@123');
    setError(null);
    setAutofilled(true);
    setTimeout(() => setAutofilled(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-xs font-semibold backdrop-blur-md mb-3 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SIH26047 Prototype • Ministry of Ayush</span>
        </div>
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-blue-600 p-0.5 shadow-xl shadow-teal-950/50">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-teal-400" />
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          AYUSH <span className="text-teal-400">CaseFlow</span>
        </h2>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Digitalized AYUSH Clinical Case-Taking & Decision Support System
        </p>
      </div>

      {/* Main Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-200/80 sm:rounded-2xl">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Doctor Portal Login</h3>
            <p className="text-xs text-slate-500">Sign in to access patient records & case-taking</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Authentication Failed: </span>
                {error}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                Official Doctor Email ID
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@ayush.demo"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-slate-50/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 bg-slate-50/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to AYUSH CaseFlow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper Box */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <KeyRound className="w-3.5 h-3.5 text-teal-700" />
                  <span>Demo Doctor Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                >
                  {autofilled ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Filled!</span>
                    </>
                  ) : (
                    <span>Auto-Fill Demo</span>
                  )}
                </button>
              </div>

              <div className="text-xs space-y-1 font-mono text-slate-600 bg-white p-2 rounded border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-bold text-slate-800">doctor@ayush.demo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Password:</span>
                  <span className="font-bold text-slate-800">Ayush@123</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Prototype only. Not for real clinical diagnosis.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
