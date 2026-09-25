import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  UserCheck,
  Bell,
  Download,
  RotateCcw,
  Save,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Users,
  Info,
} from 'lucide-react';
import { AdminSettings } from '../../types';
import {
  getAdminSettings,
  saveAdminSettings,
  getStoredUsers,
  resetUsersToDemo,
  exportUsersToCSV,
} from '../../utils/authStorage';

interface AdminSettingsManagerProps {
  onNotify?: (message: string) => void;
}

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({ onNotify }) => {
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setSettings(getAdminSettings());
  }, []);

  const handleToggle = (key: keyof AdminSettings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(updated);
    saveAdminSettings(updated);
    showSaveIndicator();
  };

  const handleChange = (key: keyof AdminSettings, value: any) => {
    const updated = {
      ...settings,
      [key]: value,
    };
    setSettings(updated);
  };

  const handleSaveAll = () => {
    saveAdminSettings(settings);
    showSaveIndicator();
    if (onNotify) onNotify('Admin settings saved successfully!');
  };

  const showSaveIndicator = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Export JSON
  const handleExportJSON = () => {
    const users = getStoredUsers();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taizerflow_users_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (onNotify) onNotify('Exported users database to JSON!');
  };

  // Export CSV
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
    if (onNotify) onNotify('Exported users database to CSV!');
  };

  // Reset demo users
  const handleResetDemo = () => {
    resetUsersToDemo();
    setShowResetConfirm(false);
    if (onNotify) onNotify('Reset user accounts to initial demo data (Kasun, Nimal, Dilani, Sunil)!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Settings Header Alert */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
          <Settings className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="font-extrabold text-xs text-indigo-950">
            Admin System Configuration &amp; User Approval Policies
          </h4>
          <p className="text-xs text-indigo-700/90 mt-0.5 leading-relaxed">
            Configure how new student registrations are handled, customize pending approval notifications, and manage platform data.
          </p>
        </div>
        {isSaved && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full animate-fade-in shrink-0">
            <Check className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      {/* 1. User Approval & Registration Policies */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h3 className="font-extrabold text-sm text-slate-900">
            User Approval &amp; Registration Policies (පරිශීලක අනුමැතිය සහ ලියාපදිංචි නීති)
          </h3>
        </div>

        <div className="space-y-4">
          {/* Policy 1: Require Admin Approval */}
          <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-50/90 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">
                  Require Admin Approval for New Users
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    settings.requireApproval
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {settings.requireApproval ? 'Enabled' : 'Auto-Approve'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                නව සිසුන් ලියාපදිංචි වූ විට, Admin Panel මඟින් අනුමත (Approve) කරන තුරු Login වීම වළක්වයි. සක්‍රීය කර ඇති විට සියලුම නව ගිණුම් "Pending" තත්ත්වයේ පවතී.
              </p>
            </div>

            <button
              onClick={() => handleToggle('requireApproval')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.requireApproval ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.requireApproval ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Policy 2: Allow Public Registration */}
          <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-50/90 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">
                  Allow Public Registration
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    settings.allowPublicRegistration
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {settings.allowPublicRegistration ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                නව සිසුන්ට වෙබ් අඩවියෙන් ලියාපදිංචි වීමට ඉඩ දෙන්න. මෙය අක්‍රීය කළ විට Admin ට පමණක් නව සිසුන් ඇතුළත් කළ හැක.
              </p>
            </div>

            <button
              onClick={() => handleToggle('allowPublicRegistration')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.allowPublicRegistration ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.allowPublicRegistration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Policy 3: Require NIC Validation */}
          <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-50/90 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-slate-900">
                  Require National Identity Card (NIC)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ලියාපදිංචි වීමේදී ශ්‍රී ලාංකික ජාතික හැඳුනුම්පත් අංකය (NIC) ඇතුළත් කිරීම අනිවාර්ය කරන්න.
              </p>
            </div>

            <button
              onClick={() => handleToggle('requireNicValidation')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.requireNicValidation ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  settings.requireNicValidation ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Policy 4: Custom Message for Pending Users */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-extrabold text-xs text-slate-900">
                Pending Approval Notice Message (අනුමැතිය බලාපොරොත්තුවෙන් සිටින සිසුන්ට පෙන්වන පණිවිඩය)
              </label>
            </div>
            <p className="text-[11px] text-slate-500">
              This message appears in the login form when a pending user tries to log in.
            </p>
            <textarea
              rows={2}
              value={settings.pendingUserNotice}
              onChange={(e) => handleChange('pendingUserNotice', e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Platform Announcement Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Student Platform Announcement Banner
            </h3>
          </div>
          <button
            onClick={() => handleToggle('showAnnouncement')}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              settings.showAnnouncement ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.showAnnouncement ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Announcement Text (Sinhala or English)
          </label>
          <input
            type="text"
            value={settings.announcementText}
            onChange={(e) => handleChange('announcementText', e.target.value)}
            placeholder="e.g. විශේෂ නිවේදනයයි: නව පන්ති ආරම්භය ලබන සෙනසුරාදා දින පැවැත්වේ..."
            className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* 3. Data Backup & System Utilities */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Download className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-slate-900">
            Data Backup &amp; Account Management (දත්ත බාගත කිරීම සහ පද්ධති පාලනය)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CSV Export */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">Export Users (CSV)</span>
              <span className="text-[11px] text-slate-500">Excel / Google Sheets format</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* JSON Export */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between gap-3">
            <div>
              <span className="font-extrabold text-xs text-slate-900 block">Backup Database (JSON)</span>
              <span className="text-[11px] text-slate-500">Raw JSON user records</span>
            </div>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold shadow-2xs cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Reset Demo Users button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Reset users to sample records (includes pending &amp; approved students for testing)</span>
          </div>

          {showResetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-600">Are you sure?</span>
              <button
                onClick={handleResetDemo}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Users</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
        >
          <Save className="w-4 h-4" />
          <span>Save All Admin Settings</span>
        </button>
      </div>
    </div>
  );
};
