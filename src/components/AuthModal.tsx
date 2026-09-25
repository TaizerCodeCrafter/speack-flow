import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  LogIn,
  UserPlus,
  Camera,
  Upload,
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginUser,
  registerUser,
  setCurrentUser,
  getRememberedCredentials,
  saveRememberedCredentials,
} from '../utils/authStorage';
import { AvatarPickerModal } from './AvatarPickerModal';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: (user: UserProfile) => void;
  onAdminLoginSuccess?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
  onAdminLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRememberMe, setLoginRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States (First Name, Last Name, NIC, Phone Number, Email, Password, Re-enter Password, Remember Me)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nic, setNic] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [registerRememberMe, setRegisterRememberMe] = useState(true);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  // Lock background body scroll while AuthModal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Reset errors and sync mode when opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Populate remembered credentials for login
      const remembered = getRememberedCredentials();
      if (remembered && remembered.identifier) {
        setLoginIdentifier(remembered.identifier);
        setLoginRememberMe(remembered.rememberMe);
      }
    }
  }, [isOpen, initialMode]);

  // Clear messages on mode switch
  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('කරුණාකර ඔබගේ Email, NIC හෝ Phone අංකය ඇතුළත් කරන්න.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('කරුණාකර ඔබගේ Password එක ඇතුළත් කරන්න.');
      return;
    }

    const res = loginUser(loginIdentifier, loginPassword);
    if (!res.success) {
      if (res.isPending) {
        setErrorMessage(
          '⏳ ඔබගේ ගිණුම තවමත් පරිපාලක (Admin) අනුමැතිය බලාපොරොත්තුවෙන් පවතී. අනුමැතිය ලැබුණු පසු Log In විය හැක.'
        );
      } else if (res.isSuspended) {
        setErrorMessage('⛔ මෙම ගිණුම අත්හිටුවා ඇත. කරුණාකර Admin අමතන්න.');
      } else {
        setErrorMessage(res.error || 'Login failed. Please check your credentials.');
      }
      return;
    }

    if (!res.user) {
      setErrorMessage('Login failed. User profile error.');
      return;
    }

    const authenticatedUser = res.user;

    // Save remembered credentials if checked
    saveRememberedCredentials(loginIdentifier, loginRememberMe);

    // Set active user
    setCurrentUser(authenticatedUser);

    if (authenticatedUser.role === 'admin') {
      setSuccessMessage(`Welcome Admin ${authenticatedUser.firstName}! Opening Admin Panel...`);
      setTimeout(() => {
        if (onAdminLoginSuccess) {
          onAdminLoginSuccess(authenticatedUser);
        } else if (onSuccess) {
          onSuccess(authenticatedUser);
        }
        onClose();
      }, 500);
      return;
    }

    setSuccessMessage(`Welcome back, ${authenticatedUser.firstName}! Logged in successfully.`);

    setTimeout(() => {
      if (onSuccess) onSuccess(authenticatedUser);
      onClose();
    }, 1000);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate fields
    if (!firstName.trim()) {
      setErrorMessage('First Name ඇතුළත් කිරීම අනිවාර්යයි.');
      return;
    }
    if (!lastName.trim()) {
      setErrorMessage('Last Name ඇතුළත් කිරීම අනිවාර්යයි.');
      return;
    }
    if (!nic.trim()) {
      setErrorMessage('NIC (ජාතික හැඳුනුම්පත් අංකය) ඇතුළත් කිරීම අනිවාර්යයි.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Phone Number ඇතුළත් කිරීම අනිවාර්යයි.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('වලංගු Email ලිපිනයක් ඇතුළත් කරන්න.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password එක සඳහා අවම වශයෙන් අකුරු 6ක් අවශ්‍ය වේ.');
      return;
    }
    if (password !== reEnterPassword) {
      setErrorMessage('Passwords do not match! මුරපද දෙක එකිනෙකට නොගැලපේ.');
      return;
    }

    const res = registerUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nic: nic.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      password,
      rememberMe: registerRememberMe,
      avatarUrl,
    });

    if (!res.success || !res.user) {
      setErrorMessage(res.error || 'Registration failed.');
      return;
    }

    const newCreatedUser = res.user;

    // Remember if checked
    saveRememberedCredentials(email, registerRememberMe);

    if (res.isPending) {
      setSuccessMessage(
        '🎉 ලියාපදිංචිය සාර්ථකයි! ඔබගේ ගිණුම Admin අනුමැතිය (Approval) සඳහා යොමු කරන ලදී. අනුමැතියෙන් පසු ඔබට Log In විය හැක.'
      );
      setTimeout(() => {
        setMode('login');
        setLoginIdentifier(email);
      }, 2500);
    } else {
      // Auto login registered user if approved
      setCurrentUser(newCreatedUser);
      setSuccessMessage(`ගිණුම සාර්ථකව නිර්මාණය විය! Welcome, ${newCreatedUser.firstName}.`);

      setTimeout(() => {
        if (onSuccess) onSuccess(newCreatedUser);
        onClose();
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-slate-950/65 backdrop-blur-md overscroll-y-contain flex items-center justify-center p-2.5 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Centering Wrapper: Prevents flex clipping & ensures smooth vertical bounds */}
      <div className="min-h-full w-full flex items-center justify-center py-2 sm:py-6 text-center relative overflow-x-hidden">
        {/* Ambient background glows inside safe overflow-hidden container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-sky-300/30 rounded-full blur-3xl -top-16 -left-16" />
          <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-blue-300/25 rounded-full blur-3xl -bottom-16 -right-16" />
        </div>

        {/* Main Soft 3D Neumorphic Card: Constrained to viewport and internally scrollable */}
        <motion.div
          id="auth-neumorphic-card"
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-[430px] max-h-[calc(100vh-1.5rem)] max-h-[calc(100dvh-1.5rem)] rounded-[24px] sm:rounded-[36px] bg-[#f0f3f8] border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:shadow-[14px_18px_40px_#cbd5e1,-14px_-14px_40px_#ffffff] text-left mx-auto my-auto flex flex-col overflow-hidden box-border z-10"
        >
          {/* Top Floating Close Button - Stays fixed on top right */}
          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-[#f0f3f8] shadow-[3px_3px_7px_#cbd5e1,-3px_-3px_7px_#ffffff] text-slate-400 hover:text-slate-700 active:shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center transition-all cursor-pointer z-30"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Smooth Scrollable Body: Allows full vertical touch/wheel scroll up and down */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 sm:px-7 space-y-3 sm:space-y-3.5">
            {/* Top 3D Extruded Circular Disc with Padlock / User Icon */}
            <div className="flex justify-center pt-0.5 pb-2 sm:pb-3">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, type: 'spring' }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f0f3f8] shadow-[5px_5px_12px_#cbd5e1,-5px_-5px_12px_#ffffff] flex items-center justify-center relative border border-white/80 shrink-0"
              >
                {/* Soft inner socket well */}
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#edf2f7] shadow-[inset_2.5px_2.5px_5px_#cbd5e1,inset_-2.5px_-2.5px_5px_#ffffff] flex items-center justify-center">
                  {mode === 'login' ? (
                    <span className="text-xl sm:text-2xl filter drop-shadow-md select-none transform hover:scale-110 transition-transform">
                      🔒
                    </span>
                  ) : (
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 drop-shadow-sm" />
                  )}
                </div>
              </motion.div>
            </div>

          {/* 2-Tab Switcher: Fits all mobile viewports without overflowing */}
          <div className="mb-3.5 sm:mb-4 w-full">
            <div className="p-1 rounded-2xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] grid grid-cols-2 gap-1 relative w-full box-border">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => handleSwitchMode('login')}
                className={`relative py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 z-10 cursor-pointer min-w-0 ${
                  mode === 'login' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode === 'login' && (
                  <motion.div
                    layoutId="active-neumorphic-pill"
                    className="absolute inset-0 bg-[#f0f3f8] rounded-xl shadow-[3px_3px_7px_#cbd5e1,-3px_-3px_7px_#ffffff] border border-white"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 relative z-10" />
                <span className="relative z-10 truncate">Log In</span>
              </button>

              <button
                type="button"
                id="auth-tab-register"
                onClick={() => handleSwitchMode('register')}
                className={`relative py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 z-10 cursor-pointer min-w-0 ${
                  mode === 'register' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode === 'register' && (
                  <motion.div
                    layoutId="active-neumorphic-pill"
                    className="absolute inset-0 bg-[#f0f3f8] rounded-xl shadow-[3px_3px_7px_#cbd5e1,-3px_-3px_7px_#ffffff] border border-white"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 relative z-10" />
                <span className="relative z-10 truncate">Register</span>
              </button>
            </div>
          </div>

          {/* Error / Success Toast Messages */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-3 p-2.5 sm:p-3 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="break-words min-w-0">{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                className="mb-3 p-2.5 sm:p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="break-words min-w-0">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Form Panels */}
          <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {mode === 'login' ? (
                /* =========================================================================
                   MODE 1: LOGIN FORM (Neumorphic Inset Wells, Mobile Friendly)
                   ========================================================================= */
                <motion.form
                  key="login-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-3.5 sm:space-y-4 w-full"
                >
                  <div className="text-center mb-1 sm:mb-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                      Welcome Back
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      Log in with Email, NIC, or Phone (ඇතුල් වන්න)
                    </p>
                  </div>

                  {/* Email / NIC / Phone Inset Well */}
                  <div className="space-y-1 w-full">
                    <label className="block text-xs font-bold text-slate-700">
                      Email, NIC or Phone Number
                    </label>
                    <div className="relative rounded-2xl bg-[#edf2f7] shadow-[inset_3.5px_3.5px_7px_#cbd5e1,inset_-3.5px_-3.5px_7px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 focus-within:shadow-[inset_2px_2px_4px_#cbd5e1,0_0_12px_rgba(56,189,248,0.4)] transition-all">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
                      <input
                        type="text"
                        id="login-identifier-input"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="kasun@gmail.com or 0771234567"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 box-border"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Inset Well */}
                  <div className="space-y-1 w-full">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <div className="relative rounded-2xl bg-[#edf2f7] shadow-[inset_3.5px_3.5px_7px_#cbd5e1,inset_-3.5px_-3.5px_7px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 focus-within:shadow-[inset_2px_2px_4px_#cbd5e1,0_0_12px_rgba(56,189,248,0.4)] transition-all">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        id="login-password-input"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 box-border"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={loginRememberMe}
                        onChange={(e) => setLoginRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer shrink-0"
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        Remember Me (මතක තබාගන්න)
                      </span>
                    </label>
                  </div>

                  {/* Neumorphic Gradient Submit Button */}
                  <div className="pt-1.5">
                    <button
                      id="login-submit-btn"
                      type="submit"
                      className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_25px_rgba(14,165,233,0.42)] hover:shadow-[0_14px_30px_rgba(14,165,233,0.55)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>LOG IN</span>
                      <span className="text-base">→</span>
                    </button>
                  </div>

                  {/* Switch to Register */}
                  <div className="text-center pt-1.5">
                    <p className="text-xs text-slate-500">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('register')}
                        className="font-bold text-sky-600 hover:text-sky-700 cursor-pointer transition-colors"
                      >
                        Register here (ලියාපදිංචි වන්න) →
                      </button>
                    </p>
                  </div>
                </motion.form>
              ) : (
                /* =========================================================================
                   MODE 2: REGISTRATION FORM (Clean Responsive Fields, No Mobile Cut-Off)
                   ========================================================================= */
                <motion.form
                  key="register-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-3 w-full"
                >
                  <div className="text-center mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                      Create Account
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500 font-medium">
                      Register with your details (ලියාපදිංචි වන්න)
                    </p>
                  </div>

                  {/* Student Profile Photo Picker (Optional) */}
                  <div className="p-2.5 rounded-2xl bg-[#edf2f7] shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shadow-2xs border border-sky-200 flex items-center justify-center shrink-0">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Student avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">
                          {avatarUrl ? 'Photo Added' : 'Profile Photo (Optional)'}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {avatarUrl ? 'Photo ready for your student account' : 'Upload or choose avatar (ඡායාරූපය)'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAvatarPickerOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 font-bold text-xs shadow-2xs border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5 text-sky-600" />
                      <span>{avatarUrl ? 'Change' : 'Add Photo'}</span>
                    </button>
                  </div>

                  {/* First Name & Last Name (Responsive 1 or 2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-bold text-slate-700 truncate">
                        First Name *
                      </label>
                      <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                        <input
                          type="text"
                          id="reg-firstname-input"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Kasun"
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-bold text-slate-700 truncate">
                        Last Name *
                      </label>
                      <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                        <input
                          type="text"
                          id="reg-lastname-input"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Perera"
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* NIC & Phone (Responsive 1 or 2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-bold text-slate-700 truncate">
                        NIC Number *
                      </label>
                      <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                        <input
                          type="text"
                          id="reg-nic-input"
                          value={nic}
                          onChange={(e) => setNic(e.target.value)}
                          placeholder="200012345678"
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-bold text-slate-700 truncate">
                        Phone Number *
                      </label>
                      <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                        <input
                          type="tel"
                          id="reg-phone-input"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="077 123 4567"
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1 w-full min-w-0">
                    <label className="block text-xs font-bold text-slate-700 truncate">
                      Email Address *
                    </label>
                    <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                      <input
                        type="email"
                        id="reg-email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@gmail.com"
                        className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                        required
                      />
                    </div>
                  </div>

                  {/* Password & Re-enter Password (Responsive 1 or 2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-bold text-slate-700 truncate">
                        Password *
                      </label>
                      <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          id="reg-password-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 chars"
                          className="w-full pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="p-1 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                          aria-label="Toggle password visibility"
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-bold text-slate-700 truncate">
                        Re-enter Password *
                      </label>
                      <div className="relative rounded-xl bg-[#edf2f7] shadow-[inset_3px_3px_6px_#cbd5e1,inset_-3px_-3px_6px_#ffffff] focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                        <input
                          type={showRePassword ? 'text' : 'password'}
                          id="reg-reenter-password-input"
                          value={reEnterPassword}
                          onChange={(e) => setReEnterPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full pl-3 pr-8 py-2 text-xs font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 box-border"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRePassword(!showRePassword)}
                          className="p-1 text-slate-400 hover:text-slate-600 absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                          aria-label="Toggle password confirmation visibility"
                        >
                          {showRePassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        id="register-remember-me"
                        checked={registerRememberMe}
                        onChange={(e) => setRegisterRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer shrink-0"
                      />
                      <span className="text-xs font-semibold text-slate-600">
                        Remember me on this device (මතක තබා ගන්න)
                      </span>
                    </label>
                  </div>

                  {/* Submit Register Button with Arrow */}
                  <div className="pt-1">
                    <button
                      id="register-submit-btn"
                      type="submit"
                      className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_25px_rgba(14,165,233,0.42)] hover:shadow-[0_14px_30px_rgba(14,165,233,0.55)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>REGISTER NOW</span>
                      <span className="text-base">→</span>
                    </button>
                  </div>

                  {/* Switch back to Login */}
                  <div className="text-center pt-1">
                    <p className="text-xs text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('login')}
                        className="font-bold text-sky-600 hover:text-sky-700 cursor-pointer transition-colors"
                      >
                        Log In here (Login වන්න) →
                      </button>
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer info */}
          <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Encrypted Student Auth</span>
            </div>
            <span className="font-semibold text-slate-500">SpeakFlow</span>
          </div>
        </div>
      </motion.div>
    </div>

      {/* Student Profile Photo Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatarUrl={avatarUrl}
        onSelectAvatar={(url) => setAvatarUrl(url)}
        title="Student Profile Photo (ඡායාරූපය)"
      />
    </div>
  );
};
