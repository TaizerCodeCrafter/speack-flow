import React, { useState, useEffect } from 'react';
import { SkillType, LearningCard, UserProfile, AdminSettings } from './types';
import { Navbar } from './components/Navbar';
import { HomeCards } from './components/HomeCards';
import { GuestLandingPage } from './components/GuestLandingPage';
import { PracticeModal } from './components/PracticeModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallAppButton } from './components/InstallAppButton';
import { TaizerFlowLogo } from './components/TaizerFlowLogo';
import { XpNotificationToast } from './components/XpNotificationToast';
import { SideMediaDrawer } from './components/SideMediaDrawer';
import { getStoredCards, saveStoredCards } from './data/defaultCards';
import { getCurrentUser, logoutUser, getAdminSettings } from './utils/authStorage';
import { Bell } from 'lucide-react';

export default function App() {
  const [activeSkill, setActiveSkill] = useState<SkillType | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialHub, setAdminInitialHub] = useState<
    'writing' | 'spoken_oral' | 'grammar' | 'simple_sentence' | 'essential_verbs'
  >('writing');
  const [cards, setCards] = useState<LearningCard[]>(() => getStoredCards());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getAdminSettings());

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getCurrentUser());
    };
    const handleSettingsChange = () => {
      setAdminSettings(getAdminSettings());
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    window.addEventListener('admin-settings-changed', handleSettingsChange);
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      window.removeEventListener('admin-settings-changed', handleSettingsChange);
    };
  }, []);

  const handleSelectSkill = (skill: SkillType) => {
    if (!currentUser) {
      handleOpenAuth('register');
      return;
    }
    setActiveSkill(skill);
  };

  const handleUpdateCards = (newCards: LearningCard[]) => {
    setCards(newCards);
    saveStoredCards(newCards);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden flex flex-col justify-between pb-18 md:pb-0">
      {/* Ambient Glass Color Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft top emerald glow */}
        <div className="absolute -top-32 left-1/4 w-[500px] sm:w-[650px] h-[400px] rounded-full bg-emerald-100/45 blur-[120px]" />
        {/* Top right sky blue glow */}
        <div className="absolute top-10 right-[-10%] w-[450px] sm:w-[550px] h-[450px] rounded-full bg-sky-100/40 blur-[120px]" />
        {/* Center amber-indigo ambient glow */}
        <div className="absolute top-[40%] left-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-100/30 blur-[130px]" />
        {/* Bottom warm glow */}
        <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[400px] rounded-full bg-amber-100/30 blur-[120px]" />
      </div>

      {/* Global Admin Announcement Banner */}
      {adminSettings?.showAnnouncement && adminSettings?.announcementText && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-xs font-medium py-2 px-4 shadow-sm z-45 relative">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-center">
            <Bell className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-bounce" />
            <span className="font-semibold tracking-wide">{adminSettings.announcementText}</span>
          </div>
        </div>
      )}

      {/* Sticky Frosted Glass Header */}
      <Navbar
        onOpenPractice={handleSelectSkill}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Home Screen: Show learning HomeCards if logged in, otherwise show GuestLandingPage */}
      <main className="relative z-10 flex-1 flex flex-col justify-between">
        {currentUser ? (
          <HomeCards
            cards={cards}
            onSelectSkill={handleSelectSkill}
            onOpenAdmin={() => setIsAdminOpen(true)}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
        ) : (
          <GuestLandingPage
            onOpenAuth={handleOpenAuth}
            onPreviewSkill={handleSelectSkill}
          />
        )}

        {/* Download App for Phone & Laptop */}
        <InstallAppButton />
      </main>

      {/* Footer with exact user-requested copyright notice */}
      <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-md py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <TaizerFlowLogo size="sm" />

          <p className="text-xs font-semibold text-slate-700">
            © 2026 Taizer Code Crafter. • Active English Learning & Fluency
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Ready for Mobile &amp; Desktop</span>
          </div>
        </div>
      </footer>

      {/* Interactive Practice Studio Fullscreen Modal */}
      <PracticeModal
        activeSkill={activeSkill}
        onClose={() => setActiveSkill(null)}
        onSwitchSkill={(sk) => setActiveSkill(sk)}
        currentUser={currentUser}
        onOpenAdmin={(hub) => {
          if (currentUser?.role !== 'admin') {
            handleOpenAuth('login');
            return;
          }
          setActiveSkill(null);
          if (hub) setAdminInitialHub(hub);
          setIsAdminOpen(true);
        }}
      />

      {/* Admin Panel for Adding, Editing and Deleting Cards, Users, and Settings */}
      <AdminPanel
        isOpen={isAdminOpen && currentUser?.role === 'admin'}
        onClose={() => setIsAdminOpen(false)}
        cards={cards}
        onUpdateCards={handleUpdateCards}
        initialHub={adminInitialHub}
        currentUser={currentUser}
      />

      {/* Glass Morphism Auth Modal with Smooth Sliding Transition */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
        onAdminLoginSuccess={(adminUser) => {
          setCurrentUser(adminUser);
          setIsAdminOpen(true);
        }}
      />

      {/* Side Media Hub Drawer (Videos, Websites, News, Ads) */}
      {!isAdminOpen && !activeSkill && (
        <SideMediaDrawer
          currentUser={currentUser}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* Student / User Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onUserUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
          }}
          onLogout={handleLogout}
        />
      )}

      {/* Global XP & Level Up Celebration Toast */}
      <XpNotificationToast />

      {/* Mobile Bottom Navigation Bar (Phone App Style) */}
      {!isAdminOpen && !activeSkill && !isAuthOpen && !isProfileOpen && (
        <MobileBottomNav
          activeSkill={activeSkill}
          onSelectSkill={handleSelectSkill}
          onGoHome={() => setActiveSkill(null)}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
        />
      )}
    </div>
  );
}
