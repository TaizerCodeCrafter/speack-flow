import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Key,
  Edit2,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  Award,
  Trophy,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';
import { updateUserProfile, logoutUser } from '../utils/authStorage';
import { getLevelProgress, LEVEL_MILESTONES } from '../utils/levelUtils';
import { AvatarPickerModal } from './AvatarPickerModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUserUpdated?: (updatedUser: UserProfile) => void;
  onLogout?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phoneNumber);
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);

  // Lock background body scroll while Profile Modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const levelProgress = getLevelProgress(user.xp || 0);

  const handleAvatarChange = (newAvatarUrl: string | undefined) => {
    const res = updateUserProfile(user.id, { avatarUrl: newAvatarUrl });
    if (res.success && res.user) {
      if (onUserUpdated) onUserUpdated(res.user);
      setSuccessMsg('Profile photo updated successfully!');
      setTimeout(() => setSuccessMsg(null), 2500);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First Name and Last Name are required.');
      return;
    }

    const updates: Partial<UserProfile> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phone.trim(),
    };

    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      updates.password = newPassword.trim();
    }

    const res = updateUserProfile(user.id, updates);
    if (!res.success || !res.user) {
      setErrorMsg(res.error || 'Failed to update profile.');
      return;
    }

    setSuccessMsg('Profile updated successfully!');
    if (onUserUpdated) onUserUpdated(res.user);
    setIsEditing(false);
    setNewPassword('');

    setTimeout(() => {
      setSuccessMsg(null);
    }, 2500);
  };

  const handleLogoutClick = () => {
    logoutUser();
    if (onLogout) onLogout();
    onClose();
  };

  const isApproved = user.status === 'approved';

  return (
    <>
      <div
        id="user-profile-modal-backdrop"
        className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overscroll-contain"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with avatar banner - Pinned at top */}
          <div className="relative shrink-0 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-sky-600 p-4 sm:p-5 text-white">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Profile Photo with Camera Trigger */}
              <div className="relative group shrink-0">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 overflow-hidden flex items-center justify-center font-black text-xl sm:text-2xl uppercase shadow-md text-white">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName}'s photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.firstName.charAt(0)}</span>
                  )}
                </div>

                {/* Camera Overlay Icon */}
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-white text-indigo-700 shadow-md hover:bg-indigo-50 hover:scale-105 transition-all cursor-pointer border border-indigo-100"
                  title="Change Profile Photo (ඡායාරූපය මාරු කරන්න)"
                >
                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-300" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200">
                      <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                      <span>Pending</span>
                    </span>
                  )}
                  <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-white/20 uppercase tracking-wide text-white">
                    {user.role}
                  </span>
                  {/* Student Level Tag on Header */}
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-slate-900" />
                    <span>Lv.{levelProgress.level} • {levelProgress.totalXp} XP</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-white/90 hover:text-white underline underline-offset-2 mt-1 cursor-pointer"
                >
                  <Upload className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{user.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
              </div>
            </div>
          </div>

        {/* Content Body - Smooth internal scroll */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 sm:p-6 space-y-3 sm:space-y-4 touch-pan-y">
          {successMsg && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] sm:text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isEditing ? (
            /* View Mode */
            <div className="space-y-2.5 sm:space-y-3.5 text-xs">
              {/* User Level & XP Progress Card */}
              <div
                id="user-level-card"
                className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-purple-50/80 border border-indigo-100/90 shadow-sm space-y-2.5 sm:space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shadow-sm border ${levelProgress.milestone.badgeBg} ${levelProgress.milestone.badgeTextColor} ${levelProgress.milestone.ringColor} ring-2 shrink-0`}
                    >
                      <Award className={`w-5 h-5 sm:w-6 sm:h-6 ${levelProgress.milestone.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-indigo-600 text-white font-black text-[10px] sm:text-[11px] tracking-wide uppercase shadow-2xs">
                          Level {levelProgress.level}
                        </span>
                        <span className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                          {levelProgress.title}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] font-semibold text-indigo-700/90 mt-0.5 truncate">
                        {levelProgress.sinhalaTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-amber-100/90 border border-amber-300/80 text-amber-900 font-black text-[11px] sm:text-xs shadow-2xs">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                      <span>{levelProgress.totalXp} XP</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold mt-0.5 sm:mt-1">
                      {user.completedCardsCount || 0} Cards Done
                    </p>
                  </div>
                </div>

                {/* Progress Bar towards Next Level */}
                <div className="space-y-1 pt-0.5">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
                    <span className="text-slate-600 flex items-center gap-1 truncate mr-2">
                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      <span className="truncate">
                        {levelProgress.nextMilestone
                          ? `Next: Lv.${levelProgress.nextMilestone.level} - ${levelProgress.nextMilestone.title}`
                          : 'Max Rank Achieved'}
                      </span>
                    </span>
                    <span className="text-indigo-700 font-extrabold shrink-0">
                      {levelProgress.progressPercentage}%
                    </span>
                  </div>

                  {/* Animated Progress Bar Track */}
                  <div className="relative w-full h-2 sm:h-3 rounded-full bg-slate-200/90 overflow-hidden shadow-inner p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress.progressPercentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 shadow-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 font-medium">
                    <span>
                      {levelProgress.currentLevelXp} / {levelProgress.xpRequiredForNextLevel} XP
                    </span>
                    <span>
                      {levelProgress.isMaxLevel
                        ? '🏆 Highest Rank!'
                        : `${levelProgress.xpRemaining} XP needed`}
                    </span>
                  </div>
                </div>

                {/* Milestones / Perks Drawer Toggle */}
                <div className="pt-1 border-t border-indigo-100/70">
                  <button
                    type="button"
                    onClick={() => setShowRoadmap(!showRoadmap)}
                    className="w-full flex items-center justify-between text-[11px] sm:text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors py-0.5 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
                      <span>Level Milestones (මට්ටම් විස්තර)</span>
                    </span>
                    {showRoadmap ? (
                      <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>

                  {showRoadmap && (
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1 pt-1 overscroll-contain touch-pan-y">
                      {LEVEL_MILESTONES.map((m) => {
                        const isUnlocked = levelProgress.totalXp >= m.minXp;
                        const isCurrent = levelProgress.milestone.level === m.level;

                        return (
                          <div
                            key={m.level}
                            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs flex items-center justify-between gap-2 transition-all ${
                              isCurrent
                                ? 'bg-white border-indigo-400 ring-2 ring-indigo-200 shadow-xs'
                                : isUnlocked
                                ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                                : 'bg-slate-50/80 border-slate-200/70 text-slate-400 opacity-75'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              <span
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center font-black text-[9px] sm:text-[10px] shrink-0 ${
                                  isCurrent
                                    ? 'bg-indigo-600 text-white'
                                    : isUnlocked
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {m.level}
                              </span>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate leading-tight">
                                  {m.title}
                                </p>
                              </div>
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-mono font-bold shrink-0">
                              {m.minXp} XP
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Student Details Card */}
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 space-y-2 sm:space-y-2.5 text-[11px] sm:text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    <span>NIC:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">{user.nic}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    <span>Phone:</span>
                  </span>
                  <span className="font-semibold text-slate-800">{user.phoneNumber}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                    <span>Email:</span>
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px] sm:max-w-[220px]">{user.email}</span>
                </div>

                {user.registeredAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      <span>Registered:</span>
                    </span>
                    <span className="text-slate-700">{new Date(user.registeredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {user.adminNotes && (
                <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-800 text-[10px] sm:text-[11px] font-medium">
                  Note: {user.adminNotes}
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-1 sm:pt-2 flex items-center justify-between gap-2 sm:gap-3">
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-[11px] sm:text-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Log Out (ඉවත්වන්න)</span>
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs shadow-2xs transition-all cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Change Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (optional)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono text-slate-800"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>

    {/* Avatar Picker / Photo Upload Modal */}
    <AvatarPickerModal
      isOpen={isAvatarPickerOpen}
      onClose={() => setIsAvatarPickerOpen(false)}
      currentAvatarUrl={user.avatarUrl}
      onSelectAvatar={handleAvatarChange}
      title={`${user.firstName}'s Profile Photo`}
    />
  </>
  );
};
