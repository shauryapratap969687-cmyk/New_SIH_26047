import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  UserPlus,
  FilePlus2,
  FolderOpen,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

export const Navbar: React.FC = () => {
  const { doctor, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Add Patient', path: '/patients/new', icon: UserPlus },
    { name: 'New Case', path: '/cases/new', icon: FilePlus2, highlight: true },
    { name: 'Saved Cases', path: '/cases', icon: FolderOpen },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || (path === '/cases' && location.pathname.startsWith('/cases/') && location.pathname !== '/cases/new');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs no-print">
      {/* Top Ministry Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-slate-200 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-400 tracking-wide">
              🇮🇳 आयुष मंत्रालय | Ministry of Ayush
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Government of India</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.2 text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-700/50 rounded-full">
              <Sparkles className="w-2.5 h-2.5" /> Smart Automation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-amber-300/90 font-medium hidden md:inline">
              ⚠️ Prototype only. Not for real clinical diagnosis.
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] hidden sm:inline">SIH26047 System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 via-teal-700 to-blue-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Stethoscope className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  AYUSH <span className="text-teal-700">CaseFlow</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 uppercase">
                  v1.0 Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                SIH26047 Patient Case-Taking Software
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200 shadow-2xs'
                      : link.highlight
                      ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active
                        ? 'text-teal-700'
                        : link.highlight
                        ? 'text-amber-300'
                        : 'text-slate-500'
                    }`}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 flex items-center justify-center font-bold text-xs border border-teal-300">
                  DR
                </div>
                <div className="hidden lg:block text-xs">
                  <div className="font-semibold text-slate-900 leading-tight">
                    {doctor?.name || 'Dr. Medical Officer'}
                  </div>
                  <div className="text-[10px] text-teal-700 font-medium">
                    {doctor?.registrationNumber || 'AYU-DEL-2024'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{doctor?.name}</p>
                    <p className="text-[11px] text-slate-500">{doctor?.email}</p>
                    <p className="text-[10px] text-teal-700 mt-1 font-medium bg-teal-50 px-2 py-0.5 rounded inline-block">
                      {doctor?.role}
                    </p>
                  </div>
                  <div className="px-4 py-2 text-[11px] text-slate-500 border-b border-slate-100">
                    <span className="font-medium text-slate-700">Institution:</span>
                    <br />
                    {doctor?.institution}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out (Logout)</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <div className="p-3 bg-slate-50 rounded-lg mb-2">
            <div className="text-xs font-semibold text-slate-900">{doctor?.name}</div>
            <div className="text-[11px] text-slate-500">{doctor?.email}</div>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-teal-50 text-teal-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-700" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
