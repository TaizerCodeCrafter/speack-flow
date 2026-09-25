import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Eye,
  Key,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  X,
  Save,
  Check,
  Ban,
  RotateCcw,
  Sparkles,
  Download,
  Filter,
  Camera,
  Upload,
} from 'lucide-react';
import { UserProfile, UserAccountStatus, UserRole } from '../../types';
import {
  getStoredUsers,
  saveStoredUsers,
  approveUser,
  rejectOrPendingUser,
  suspendUser,
  updateUserProfile,
  deleteUser,
  approveAllPendingUsers,
  exportUsersToCSV,
} from '../../utils/authStorage';
import { AvatarPickerModal } from '../AvatarPickerModal';

interface UserApprovalManagerProps {
  onNotify?: (message: string) => void;
}

export const UserApprovalManager: React.FC<UserApprovalManagerProps> = ({ onNotify }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => getStoredUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'admin'>('all');

  // Modal States
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Avatar Picker State for Admin modal
  const [pickerTarget, setPickerTarget] = useState<'edit' | 'add' | null>(null);

  // Add User Form States
  const [addFirstName, setAddFirstName] = useState('');
  const [addLastName, setAddLastName] = useState('');
  const [addNic, setAddNic] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('pass1234');
  const [addStatus, setAddStatus] = useState<UserAccountStatus>('approved');
  const [addRole, setAddRole] = useState<UserRole>('student');
  const [addNotes, setAddNotes] = useState('');
  const [addAvatarUrl, setAddAvatarUrl] = useState<string | undefined>();

  // Edit User Form States
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editNic, setEditNic] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNewPassword, setEditNewPassword] = useState('');
  const [editStatus, setEditStatus] = useState<UserAccountStatus>('approved');
  const [editRole, setEditRole] = useState<UserRole>('student');
  const [editNotes, setEditNotes] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | undefined>();

  // Refresh users on mount & storage events
  const refreshUsers = () => {
    setUsers(getStoredUsers());
  };

  useEffect(() => {
    const handleStorageChange = () => refreshUsers();
    window.addEventListener('users-storage-changed', handleStorageChange);
    window.addEventListener('auth-state-changed', handleStorageChange);
    return () => {
      window.removeEventListener('users-storage-changed', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleStorageChange);
    };
  }, []);

  // Counts
  const counts = useMemo(() => {
    const pending = users.filter((u) => u.status === 'pending').length;
    const approved = users.filter((u) => u.status === 'approved').length;
    const suspended = users.filter((u) => u.status === 'suspended').length;
    return { all: users.length, pending, approved, suspended };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      // Role filter
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const nic = (u.nic || '').toLowerCase();
        const phone = (u.phoneNumber || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        return (
          fullName.includes(q) ||
          nic.includes(q) ||
          phone.includes(q) ||
          email.includes(q)
        );
      }
      return true;
    });
  }, [users, statusFilter, roleFilter, searchQuery]);

  // Handle Quick Approve
  const handleApprove = (user: UserProfile) => {
    approveUser(user.id, 'Admin');
    refreshUsers();
    if (onNotify) onNotify(`User ${user.firstName} ${user.lastName} has been approved!`);
  };

  // Handle Quick Pending/Reject
  const handleMakePending = (user: UserProfile) => {
    rejectOrPendingUser(user.id);
    refreshUsers();
    if (onNotify) onNotify(`User ${user.firstName} status set to Pending.`);
  };

  // Handle Quick Suspend / Reactivate
  const handleToggleSuspend = (user: UserProfile) => {
    if (user.status === 'suspended') {
      approveUser(user.id, 'Admin Reactivated');
      refreshUsers();
      if (onNotify) onNotify(`User ${user.firstName} reactivated successfully.`);
    } else {
      suspendUser(user.id);
      refreshUsers();
      if (onNotify) onNotify(`User ${user.firstName} suspended.`);
    }
  };

  // Handle Approve All Pending
  const handleApproveAllPending = () => {
    const count = approveAllPendingUsers();
    refreshUsers();
    if (onNotify) onNotify(`Successfully approved all ${count} pending users!`);
  };

  // Open Edit Modal
  const openEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditNic(user.nic);
    setEditPhone(user.phoneNumber);
    setEditEmail(user.email);
    setEditNewPassword('');
    setEditStatus(user.status);
    setEditRole(user.role);
    setEditNotes(user.adminNotes || '');
    setEditAvatarUrl(user.avatarUrl);
  };

  // Submit Edit User
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updates: Partial<UserProfile> = {
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      nic: editNic.trim(),
      phoneNumber: editPhone.trim(),
      email: editEmail.trim(),
      status: editStatus,
      role: editRole,
      adminNotes: editNotes.trim(),
      avatarUrl: editAvatarUrl,
    };

    if (editNewPassword.trim()) {
      updates.password = editNewPassword.trim();
    }

    if (editStatus === 'approved' && editingUser.status !== 'approved') {
      updates.approvedAt = Date.now();
      updates.approvedBy = 'Admin';
    }

    const res = updateUserProfile(editingUser.id, updates);
    if (!res.success) {
      alert(res.error || 'Failed to update user profile');
      return;
    }

    refreshUsers();
    setEditingUser(null);
    if (onNotify) onNotify(`Profile for ${editFirstName} updated successfully.`);
  };

  // Submit Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!addFirstName.trim() || !addLastName.trim() || !addNic.trim() || !addEmail.trim()) {
      alert('Please fill in First Name, Last Name, NIC, and Email.');
      return;
    }

    const existingUsers = getStoredUsers();
    if (existingUsers.some((u) => u.email.toLowerCase() === addEmail.trim().toLowerCase())) {
      alert('Email already exists. Please use a unique email.');
      return;
    }
    if (existingUsers.some((u) => u.nic.toLowerCase() === addNic.trim().toLowerCase())) {
      alert('NIC already exists. Please use a unique NIC.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      firstName: addFirstName.trim(),
      lastName: addLastName.trim(),
      nic: addNic.trim(),
      phoneNumber: addPhone.trim(),
      email: addEmail.trim(),
      password: addPassword || 'pass1234',
      status: addStatus,
      role: addRole,
      adminNotes: addNotes.trim(),
      registeredAt: Date.now(),
      approvedAt: addStatus === 'approved' ? Date.now() : undefined,
      approvedBy: addStatus === 'approved' ? 'Admin Manual' : undefined,
      avatarUrl: addAvatarUrl,
    };

    saveStoredUsers([newUser, ...existingUsers]);
    refreshUsers();
    setIsAddingUser(false);
    setAddAvatarUrl(undefined);

    // Reset fields
    setAddFirstName('');
    setAddLastName('');
    setAddNic('');
    setAddPhone('');
    setAddEmail('');
    setAddNotes('');
    if (onNotify) onNotify(`New user ${newUser.firstName} created successfully!`);
  };

  // Handle Delete
  const confirmDelete = (userId: string) => {
    deleteUser(userId);
    refreshUsers();
    setDeletingUserId(null);
    if (onNotify) onNotify('User account removed permanently.');
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    const csvContent = exportUsersToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `taizerflow_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onNotify) onNotify('User records exported to CSV!');
  };

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Top Header & Statistics Cards - Ultra Sleek & Compact for Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* Total Users */}
        <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 block uppercase tracking-wider truncate">
              Total Users
            </span>
            <span className="text-base sm:text-xl font-black text-slate-900 leading-none">{counts.all}</span>
          </div>
        </div>

        {/* Pending Approval */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-2xs flex items-center gap-2 sm:gap-3 ${
            statusFilter === 'pending'
              ? 'bg-amber-500/10 border-amber-400/80 ring-2 ring-amber-400/50'
              : 'bg-white border-amber-200/80 hover:bg-amber-50/50'
          }`}
        >
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 relative shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            {counts.pending > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full animate-ping" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[11px] font-bold text-amber-700 block uppercase tracking-wider truncate">
              Pending
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-base sm:text-xl font-black text-amber-900 leading-none">{counts.pending}</span>
              {counts.pending > 0 && (
                <span className="text-[8px] sm:text-[10px] font-extrabold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full bg-amber-200/80 text-amber-800 leading-tight shrink-0">
                  Action
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Approved Active */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-2xs flex items-center gap-2 sm:gap-3 ${
            statusFilter === 'approved'
              ? 'bg-emerald-500/10 border-emerald-400/80 ring-2 ring-emerald-400/50'
              : 'bg-white border-emerald-200/80 hover:bg-emerald-50/50'
          }`}
        >
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <UserCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 block uppercase tracking-wider truncate">
              Approved
            </span>
            <span className="text-base sm:text-xl font-black text-emerald-900 leading-none">{counts.approved}</span>
          </div>
        </div>

        {/* Suspended */}
        <div
          onClick={() => setStatusFilter('suspended')}
          className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer shadow-2xs flex items-center gap-2 sm:gap-3 ${
            statusFilter === 'suspended'
              ? 'bg-rose-500/10 border-rose-400/80 ring-2 ring-rose-400/50'
              : 'bg-white border-rose-200/80 hover:bg-rose-50/50'
          }`}
        >
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <Ban className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[11px] font-bold text-rose-700 block uppercase tracking-wider truncate">
              Suspended
            </span>
            <span className="text-base sm:text-xl font-black text-rose-900 leading-none">{counts.suspended}</span>
          </div>
        </div>
      </div>

      {/* Action Bar: Search, Status Filters, Add User Button & Bulk Approve */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Name, NIC, Phone, Email..."
            className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-slate-800 bg-slate-50 rounded-lg sm:rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs & Action buttons row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Pending ({counts.pending})</span>
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Approved ({counts.approved})</span>
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                statusFilter === 'suspended'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
              }`}
            >
              <Ban className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Suspended ({counts.suspended})</span>
            </button>
          </div>

          {/* Action buttons: Bulk approve, Add user, Export */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {counts.pending > 0 && (
              <button
                onClick={handleApproveAllPending}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[10px] sm:text-xs font-bold shadow-2xs transition-all cursor-pointer"
                title="Approve all currently pending user accounts"
              >
                <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Approve All ({counts.pending})</span>
              </button>
            )}

            <button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add User</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Export User Records to CSV"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users List Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No users found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {searchQuery
                ? 'Try matching another name, NIC, or email.'
                : 'No users matching the active status filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => {
              const isPending = user.status === 'pending';
              const isApproved = user.status === 'approved';
              const isSuspended = user.status === 'suspended';

              return (
                <div
                  key={user.id}
                  className="p-2.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3"
                >
                  {/* Left Column: Avatar & User Identity */}
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm uppercase text-white shadow-2xs shrink-0 overflow-hidden border border-slate-200/60 ${
                        isPending
                          ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                          : isSuspended
                          ? 'bg-gradient-to-tr from-rose-500 to-pink-600'
                          : 'bg-gradient-to-tr from-emerald-500 to-teal-500'
                      }`}
                    >
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{user.firstName.charAt(0)}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                          {user.firstName} {user.lastName}
                        </span>

                        {/* Status Badge - Compact on Mobile */}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending</span>
                            <span className="hidden sm:inline">(අනුමැතිය බලාපොරොත්තුවෙන්)</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Approved</span>
                            <span className="hidden sm:inline">(අනුමතයි)</span>
                          </span>
                        )}
                        {isSuspended && (
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            <Ban className="w-2.5 h-2.5" />
                            <span>Suspended</span>
                            <span className="hidden sm:inline">(අත්හිටුවා ඇත)</span>
                          </span>
                        )}

                        {/* Role Tag */}
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wide">
                          {user.role}
                        </span>
                      </div>

                      {/* Contact & NIC details row - Ultra compact on mobile */}
                      <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                          <span className="font-mono text-slate-700 font-semibold">{user.nic}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                          <span>{user.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px] sm:max-w-none">{user.email}</span>
                        </div>
                        {user.registeredAt && (
                          <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-slate-400">
                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300 shrink-0" />
                            <span>Reg: {new Date(user.registeredAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {user.adminNotes && (
                        <p className="text-[10px] sm:text-[11px] text-indigo-600 bg-indigo-50/70 px-1.5 sm:px-2 py-0.5 rounded-md mt-1 inline-block font-medium">
                          Note: {user.adminNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Interactive Approval & Profile Management Buttons */}
                  <div className="flex items-center gap-1 sm:gap-1.5 self-end md:self-center shrink-0">
                    {/* If Pending: Show Approve / Reject buttons */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(user)}
                          className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] sm:text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                          title="Approve user registration"
                        >
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => handleToggleSuspend(user)}
                          className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] sm:text-xs transition-colors cursor-pointer"
                          title="Reject / Suspend"
                        >
                          <UserX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {/* If Approved: Show Suspend option */}
                    {isApproved && (
                      <button
                        onClick={() => handleToggleSuspend(user)}
                        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold text-[10px] sm:text-xs transition-colors cursor-pointer"
                        title="Suspend account"
                      >
                        <Ban className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Suspend</span>
                      </button>
                    )}

                    {/* If Suspended: Show Reactivate option */}
                    {isSuspended && (
                      <button
                        onClick={() => handleToggleSuspend(user)}
                        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] sm:text-xs transition-colors cursor-pointer"
                        title="Reactivate Account"
                      >
                        <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Reactivate</span>
                      </button>
                    )}

                    {/* View Profile */}
                    <button
                      onClick={() => setViewingUser(user)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                      title="View Full User Profile"
                    >
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>

                    {/* Edit Profile */}
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                      title="Edit User Profile"
                    >
                      <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>

                    {/* Delete User */}
                    <button
                      onClick={() => setDeletingUserId(user.id)}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                      title="Delete User Permanently"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =======================================================================
          MODAL 1: VIEW USER PROFILE ("user profile hama deyakma")
          ======================================================================= */}
      <AnimatePresence>
        {viewingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-500 text-white flex items-center justify-center font-black text-base shadow-xs overflow-hidden border border-indigo-100 shrink-0">
                    {viewingUser.avatarUrl ? (
                      <img
                        src={viewingUser.avatarUrl}
                        alt={viewingUser.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{viewingUser.firstName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      {viewingUser.firstName} {viewingUser.lastName}
                    </h3>
                    <p className="text-xs text-slate-500">Student Account Profile</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Details Grid */}
              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account Status:</span>
                    <span
                      className={`font-black uppercase text-[11px] px-2 py-0.5 rounded-full ${
                        viewingUser.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : viewingUser.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {viewingUser.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Role:</span>
                    <span className="font-bold text-slate-800 uppercase">{viewingUser.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">User ID:</span>
                    <span className="font-mono text-slate-600">{viewingUser.id}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">NIC Number:</span>
                    <span className="font-mono font-bold text-slate-800">{viewingUser.nic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Phone Number:</span>
                    <span className="font-semibold text-slate-800">{viewingUser.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Email Address:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                      {viewingUser.email}
                    </span>
                  </div>
                  {viewingUser.password && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Password:</span>
                      <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {viewingUser.password}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                  <div>
                    Registered:{' '}
                    <span className="font-semibold text-slate-700">
                      {viewingUser.registeredAt
                        ? new Date(viewingUser.registeredAt).toLocaleString()
                        : 'N/A'}
                    </span>
                  </div>
                  {viewingUser.approvedAt && (
                    <div>
                      Approved:{' '}
                      <span className="font-semibold text-emerald-700">
                        {new Date(viewingUser.approvedAt).toLocaleString()} ({viewingUser.approvedBy || 'Admin'})
                      </span>
                    </div>
                  )}
                  {viewingUser.adminNotes && (
                    <div className="pt-1 border-t border-slate-200/60 text-indigo-700 font-medium">
                      Admin Notes: {viewingUser.adminNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="mt-5 flex items-center justify-end gap-2">
                {viewingUser.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleApprove(viewingUser);
                      setViewingUser(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-2xs hover:bg-emerald-700 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve User</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const u = viewingUser;
                    setViewingUser(null);
                    openEditModal(u);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-2xs hover:bg-indigo-700 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          MODAL 2: EDIT USER PROFILE MODAL
          ======================================================================= */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Edit User Profile: {editingUser.firstName} {editingUser.lastName}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5">
                {/* Student Photo Section */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="relative w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-hidden flex items-center justify-center shrink-0">
                    {editAvatarUrl ? (
                      <img src={editAvatarUrl} alt="Student avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-indigo-700 text-lg uppercase">{editFirstName.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">Student Profile Photo</p>
                    <p className="text-[10px] text-slate-500">Upload or select avatar for student (ඡායාරූපය)</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setPickerTarget('edit')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{editAvatarUrl ? 'Change Photo' : 'Add Photo'}</span>
                      </button>
                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setEditAvatarUrl(undefined)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NIC Number</label>
                    <input
                      type="text"
                      value={editNic}
                      onChange={(e) => setEditNic(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password (Leave blank to keep current)
                  </label>
                  <input
                    type="text"
                    value={editNewPassword}
                    onChange={(e) => setEditNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as UserAccountStatus)}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option value="approved">Approved (අනුමතයි)</option>
                      <option value="pending">Pending (අනුමැතිය බලාපොරොත්තුවෙන්)</option>
                      <option value="suspended">Suspended (අත්හිටුවා ඇත)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">User Role</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option value="student">Student (ශිෂ්‍ය)</option>
                      <option value="admin">Administrator (පරිපාලක)</option>
                      <option value="instructor">Instructor (ගුරුභවතුන්)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admin Internal Notes</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Verified NIC, Batch 2026, Special access"
                    className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          MODAL 3: ADD NEW USER DIRECTLY
          ======================================================================= */}
      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">Add New Student / User Account</h3>
                </div>
                <button
                  onClick={() => setIsAddingUser(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
                {/* Optional Student Avatar / Photo */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="relative w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 overflow-hidden flex items-center justify-center shrink-0">
                    {addAvatarUrl ? (
                      <img src={addAvatarUrl} alt="New student avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-indigo-700 text-lg uppercase">{addFirstName.charAt(0) || '+'}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">Student Profile Photo (Optional)</p>
                    <p className="text-[10px] text-slate-500">Upload or choose an avatar for this student</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setPickerTarget('add')}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>{addAvatarUrl ? 'Change Photo' : 'Select Photo'}</span>
                      </button>
                      {addAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAddAvatarUrl(undefined)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={addFirstName}
                      onChange={(e) => setAddFirstName(e.target.value)}
                      placeholder="Kasun"
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={addLastName}
                      onChange={(e) => setAddLastName(e.target.value)}
                      placeholder="Perera"
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">NIC Number *</label>
                    <input
                      type="text"
                      value={addNic}
                      onChange={(e) => setAddNic(e.target.value)}
                      placeholder="200012345678"
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={addPhone}
                      onChange={(e) => setAddPhone(e.target.value)}
                      placeholder="077 123 4567"
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Initial Password *</label>
                    <input
                      type="text"
                      value={addPassword}
                      onChange={(e) => setAddPassword(e.target.value)}
                      placeholder="pass1234"
                      className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                    <select
                      value={addStatus}
                      onChange={(e) => setAddStatus(e.target.value as UserAccountStatus)}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option value="approved">Approved (ස්වයංක්‍රීයව අනුමතයි)</option>
                      <option value="pending">Pending Approval (අනුමැතිය පොරොත්තු)</option>
                      <option value="suspended">Suspended (අත්හිටුවා ඇත)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                    <select
                      value={addRole}
                      onChange={(e) => setAddRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Administrator</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admin Notes</label>
                  <input
                    type="text"
                    value={addNotes}
                    onChange={(e) => setAddNotes(e.target.value)}
                    placeholder="e.g. Manually added student, Batch 2026"
                    className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create User</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =======================================================================
          MODAL 4: CONFIRM DELETE USER
          ======================================================================= */}
      <AnimatePresence>
        {deletingUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 w-full max-w-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-center font-extrabold text-sm text-slate-900 mb-1">
                Delete User Account?
              </h3>
              <p className="text-center text-xs text-slate-500 mb-5">
                මෙම ගිණුම ස්ථිරවම ඉවත් කරනු ලැබේ. This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeletingUserId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deletingUserId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Student Photo Picker Modal for Admin Edit / Add */}
      <AvatarPickerModal
        isOpen={pickerTarget !== null}
        onClose={() => setPickerTarget(null)}
        currentAvatarUrl={pickerTarget === 'edit' ? editAvatarUrl : addAvatarUrl}
        onSelectAvatar={(url) => {
          if (pickerTarget === 'edit') {
            setEditAvatarUrl(url);
          } else if (pickerTarget === 'add') {
            setAddAvatarUrl(url);
          }
          setPickerTarget(null);
        }}
        title="Student Profile Photo (ඡායාරූපය)"
      />
    </div>
  );
};
