import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  Mic,
  MessageSquare,
  PenTool,
  Globe,
  Sparkles,
  Menu,
  X,
  SlidersHorizontal,
  Zap,
  LogIn,
  UserPlus,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  Award,
  Star,
  Trophy,
} from 'lucide-react';
import { SkillType, UserProfile } from '../types';
import { TaizerFlowLogo } from './TaizerFlowLogo';
import { getLevelProgress } from '../utils/levelUtils';

interface NavbarProps {
  onOpenPractice: (skill: SkillType) => void;
  onOpenAdmin: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPractice,
  onOpenAdmin,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userLevel = currentUser ? getLevelProgress(currentUser.xp || 0) : null;

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-white/75 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Logo */}
        <div id="brand-logo" className="flex items-center gap-2 sm:gap-3 select-none shrink min-w-0">
          <TaizerFlowLogo size="md" />
        </div>

        {/* Desktop Quick Launch Buttons for Skills - Only show when registered and logged in */}
        {currentUser && (
          <div className="hidden lg:flex items-center gap-2">
            <nav className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xs">
              <button
                onClick={() => onOpenPractice('writing')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-teal-700 hover:bg-teal-50/70 transition-all cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-teal-600" />
                <span>Writing</span>
              </button>

              <button
                onClick={() => onOpenPractice('spoken_oral')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>Spoken</span>
              </button>

              <button
                onClick={() => onOpenPractice('grammar')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-700 hover:bg-amber-50/70 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Grammar</span>
              </button>

              <button
                onClick={() => onOpenPractice('simple_sentence')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-700 hover:bg-sky-50/70 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Sentences</span>
              </button>

              <button
                onClick={() => onOpenPractice('essential_verbs')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-700 hover:bg-rose-50/70 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                <span>Essential Verbs</span>
              </button>
            </nav>
          </div>
        )}

        {/* Right Section: Auth Buttons (Log In & Register) + Admin Panel */}
        <div className="hidden sm:flex items-center gap-2">
          {currentUser ? (
            /* User Profile Button with Glass Dropdown */
            <div className="relative">
              <button
                id="navbar-user-btn"
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-[11px] font-black uppercase shadow-2xs overflow-hidden border border-white/60 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.firstName.charAt(0)}</span>
                  )}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.firstName}</span>
                {userLevel && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/70 text-[10px] font-black shrink-0 shadow-2xs">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                    <span>Lv.{userLevel.level}</span>
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-4 space-y-3 z-50 animate-in fade-in zoom-in-95"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-xs overflow-hidden border border-emerald-100 shrink-0">
                        {currentUser.avatarUrl ? (
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{currentUser.firstName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-900 leading-tight truncate">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>Student Verified</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Level & XP Progress Card inside Dropdown */}
                  {userLevel && (
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-sky-50/60 to-purple-50/70 border border-indigo-100/90 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-600" />
                          <span>Level {userLevel.level}: {userLevel.title}</span>
                        </span>
                        <span className="font-mono font-black text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded text-[10px]">
                          {userLevel.totalXp} XP
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                            style={{ width: `${userLevel.progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span>{userLevel.progressPercentage}% to next level</span>
                          <span>{userLevel.xpRemaining} XP needed</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registered Details */}
                  <div className="space-y-1.5 text-[11px] text-slate-600 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-700 font-semibold truncate">
                        NIC: {currentUser.nic}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                  </div>

                  <div className="pt-1 space-y-1.5">
                    {currentUser.role === 'admin' && (
                      <button
                        id="navbar-dropdown-admin-btn"
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Admin Panel (පරිපාලක)</span>
                      </button>
                    )}

                    <button
                      id="navbar-profile-btn"
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>View Profile &amp; Level Milestones</span>
                    </button>

                    <button
                      id="navbar-logout-btn"
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out (ඉවත් වන්න)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Log In & Register Buttons for Guests */
            <div className="flex items-center gap-1.5">
              <button
                id="navbar-login-btn"
                type="button"
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-800 font-bold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-600" />
                <span>Log In</span>
              </button>

              <button
                id="navbar-register-btn"
                type="button"
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register (ලියාපදිංචි වන්න)</span>
              </button>
            </div>
          )}

          {/* Admin Button (Only visible to logged-in Admin) */}
          {currentUser?.role === 'admin' && (
            <button
              id="navbar-admin-btn"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-98 shrink-0 border border-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Panel</span>
            </button>
          )}
        </div>

        {/* Mobile controls (Log In / User + Admin + Hamburger) */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  else onOpenAuth('login');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50/90 hover:bg-emerald-100/80 text-emerald-800 font-bold text-xs border border-emerald-200/90 shadow-2xs cursor-pointer whitespace-nowrap active:scale-95 transition-all"
                title="My Account Profile"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.firstName.charAt(0)}</span>
                  )}
                </div>
                <span className="max-w-[70px] truncate whitespace-nowrap">{currentUser.firstName}</span>
              </button>

              {/* Direct Quick Access Admin Button for Mobile Phone */}
              {currentUser.role === 'admin' && (
                <button
                  id="mobile-navbar-admin-btn"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 active:scale-95 text-white font-black text-[11px] shadow-xs border border-slate-700 cursor-pointer whitespace-nowrap"
                  title="Open Admin Content Studio"
                >
                  <SlidersHorizontal className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/95 hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-bold text-xs shadow-2xs whitespace-nowrap active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="whitespace-nowrap">Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xs shadow-emerald-600/20 active:scale-95 whitespace-nowrap transition-all cursor-pointer shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Join</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-white/95 hover:bg-slate-50 border border-slate-200/90 text-slate-700 shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200/80 bg-white/95 backdrop-blur-2xl px-4 py-3 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          {/* Mobile Auth Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs overflow-hidden border border-emerald-200 shrink-0">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{currentUser.firstName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">NIC: {currentUser.nic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {userLevel && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Lv.{userLevel.level}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </div>
                </div>

                {userLevel && (
                  <div className="p-2 rounded-xl bg-indigo-50/80 border border-indigo-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Level {userLevel.level}: {userLevel.title}</span>
                      <span className="text-amber-700 font-mono">{userLevel.totalXp} XP</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${userLevel.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Admin button for Admin user in mobile menu */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-xs border border-slate-700 transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Studio (පරිපාලක පුවරුව)</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs"
                  >
                    <User className="w-3 h-3" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Free Account (නොමිලේ එක්වන්න)</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Log In to Account (ඇතුල් වන්න)</span>
                </button>
              </div>
            )}
          </div>

          {currentUser && (
            <>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Select Practice Studio
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPractice('writing');
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50/80 text-teal-900 border border-teal-200/60 font-bold text-xs cursor-pointer"
                >
                  <PenTool className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Writing</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPractice('spoken_oral');
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50/80 text-purple-900 border border-purple-200/60 font-bold text-xs cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Spoken</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPractice('grammar');
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 text-amber-900 border border-amber-200/60 font-bold text-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Grammar</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPractice('simple_sentence');
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50/80 text-sky-900 border border-sky-200/60 font-bold text-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Sentences</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPractice('essential_verbs');
                  }}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-rose-50/80 text-rose-900 border border-rose-200/60 font-bold text-xs cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-rose-600 fill-rose-500 shrink-0" />
                  <span>Essential Verbs</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

