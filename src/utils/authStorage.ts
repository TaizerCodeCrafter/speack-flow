import { UserProfile, AdminSettings, UserAccountStatus, UserRole } from '../types';

export const USERS_STORAGE_KEY = 'taizerflow_registered_users_v2';
export const CURRENT_USER_KEY = 'taizerflow_current_user_v2';
export const REMEMBERED_CREDS_KEY = 'taizerflow_remembered_creds_v2';
export const ADMIN_SETTINGS_KEY = 'taizerflow_admin_settings_v1';

// Default Admin Settings
export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  requireApproval: true, // Requires admin approval for new signups
  allowPublicRegistration: true, // Allow students to register
  requireNicValidation: true,
  pendingUserNotice: 'ඔබගේ ගිණුම සාර්ථකව නිර්මාණය විය. පරිපාලක (Admin) අනුමැතියෙන් පසු ඔබට ලොග් විය හැක.',
  announcementText: 'Welcome to SpeakFlow English Learning Platform! Master Spoken English and Grammar.',
  showAnnouncement: false,
  autoApproveStaff: true,
};

// Initial sample users with both approved and pending statuses for realistic testing
export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'admin-supun-dilshan',
    firstName: 'Supun',
    lastName: 'Dilshan',
    nic: '199535800000',
    phoneNumber: '0773580000',
    email: 'supundilshan358@gmail.com',
    password: 'addi',
    status: 'approved',
    role: 'admin',
    rememberMe: true,
    registeredAt: Date.now() - 86400000 * 30,
    approvedAt: Date.now() - 86400000 * 30,
    approvedBy: 'System Super Admin',
    adminNotes: 'Super Administrator Account',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SupunAdmin&backgroundColor=ffd5dc',
    xp: 5000,
    level: 9,
  },
  {
    id: 'user-demo-1',
    firstName: 'Kasun',
    lastName: 'Perera',
    nic: '199512345678',
    phoneNumber: '0771234567',
    email: 'kasun@gmail.com',
    password: 'password123',
    status: 'approved',
    role: 'student',
    rememberMe: true,
    registeredAt: Date.now() - 86400000 * 5,
    approvedAt: Date.now() - 86400000 * 4,
    approvedBy: 'Admin',
    adminNotes: 'Verified Sri Lankan Student - Batch A',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kasun&backgroundColor=b6e3f4',
  },
  {
    id: 'user-demo-2',
    firstName: 'Nimal',
    lastName: 'Bandara',
    nic: '200198765432',
    phoneNumber: '0719876543',
    email: 'nimal.bandara@gmail.com',
    password: 'password123',
    status: 'pending',
    role: 'student',
    rememberMe: false,
    registeredAt: Date.now() - 3600000 * 4,
    adminNotes: 'Awaiting NIC copy check',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nimal&backgroundColor=c0aede',
  },
  {
    id: 'user-demo-3',
    firstName: 'Dilani',
    lastName: 'Fernando',
    nic: '199856712345',
    phoneNumber: '0765544332',
    email: 'dilani.f@yahoo.com',
    password: 'password123',
    status: 'pending',
    role: 'student',
    rememberMe: false,
    registeredAt: Date.now() - 3600000 * 2,
    adminNotes: 'New registration from mobile app',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dilani&backgroundColor=ffdfbf',
  },
  {
    id: 'user-demo-4',
    firstName: 'Sunil',
    lastName: 'Silva',
    nic: '199011223344',
    phoneNumber: '0751122334',
    email: 'sunil.silva@outlook.com',
    password: 'password123',
    status: 'approved',
    role: 'student',
    rememberMe: true,
    registeredAt: Date.now() - 86400000 * 10,
    approvedAt: Date.now() - 86400000 * 9,
    approvedBy: 'Admin',
    adminNotes: 'Completed Essential Verbs milestone',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sunil&backgroundColor=ffd5dc',
  },
];

// ----------------------------------------------------
// Admin Settings Get / Save
// ----------------------------------------------------
export function getAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_ADMIN_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to get admin settings', err);
  }
  return DEFAULT_ADMIN_SETTINGS;
}

export function saveAdminSettings(settings: AdminSettings): void {
  try {
    localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('admin-settings-changed'));
    // Sync to MongoDB Atlas
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).catch(() => {});
  } catch (err) {
    console.error('Failed to save admin settings', err);
  }
}

// ----------------------------------------------------
// Users Storage Get / Save
// ----------------------------------------------------
export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Migration safeguard: Ensure all users have status and role
        const mapped = parsed.map((u) => ({
          ...u,
          status: u.status || 'approved',
          role: u.role || 'student',
        }));

        // Ensure Supun Dilshan admin account is always present
        const hasAdmin = mapped.some(
          (u) => u.email.toLowerCase().replace(/\s+/g, '') === 'supundilshan358@gmail.com'
        );
        if (!hasAdmin) {
          const admin = DEFAULT_USERS.find((u) => u.id === 'admin-supun-dilshan') || DEFAULT_USERS[0];
          mapped.unshift(admin);
          saveStoredUsers(mapped);
        }
        return mapped;
      }
    }
    // Check older v1 storage if available
    const oldRaw = localStorage.getItem('taizerflow_registered_users_v1');
    if (oldRaw) {
      try {
        const oldParsed = JSON.parse(oldRaw);
        if (Array.isArray(oldParsed) && oldParsed.length > 0) {
          const migrated: UserProfile[] = oldParsed.map((u) => ({
            ...u,
            status: 'approved',
            role: 'student',
          }));
          const hasAdmin = migrated.some(
            (u) => u.email.toLowerCase().replace(/\s+/g, '') === 'supundilshan358@gmail.com'
          );
          if (!hasAdmin) {
            migrated.unshift(DEFAULT_USERS[0]);
          }
          saveStoredUsers(migrated);
          return migrated;
        }
      } catch {
        // ignore
      }
    }

    // Initialize with default demo users
    saveStoredUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  } catch (err) {
    console.error('Failed to get stored users', err);
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event('users-storage-changed'));
  } catch (err) {
    console.error('Failed to save stored users', err);
  }
}

// ----------------------------------------------------
// Current User Management
// ----------------------------------------------------
export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Fallback to v1
    const oldRaw = localStorage.getItem('taizerflow_current_user_v1');
    if (oldRaw) {
      return JSON.parse(oldRaw);
    }
  } catch (err) {
    console.error('Failed to get current user', err);
  }
  return null;
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem('taizerflow_current_user_v1');
    }
    window.dispatchEvent(new Event('auth-state-changed'));
  } catch (err) {
    console.error('Failed to set current user', err);
  }
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// ----------------------------------------------------
// Remembered Credentials
// ----------------------------------------------------
export function getRememberedCredentials(): { identifier: string; rememberMe: boolean } | null {
  try {
    const raw = localStorage.getItem(REMEMBERED_CREDS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    const oldRaw = localStorage.getItem('taizerflow_remembered_creds_v1');
    if (oldRaw) {
      return JSON.parse(oldRaw);
    }
  } catch (err) {
    console.error('Failed to get remembered creds', err);
  }
  return null;
}

export function saveRememberedCredentials(identifier: string, rememberMe: boolean): void {
  try {
    if (rememberMe && identifier) {
      localStorage.setItem(
        REMEMBERED_CREDS_KEY,
        JSON.stringify({ identifier, rememberMe: true })
      );
    } else {
      localStorage.removeItem(REMEMBERED_CREDS_KEY);
      localStorage.removeItem('taizerflow_remembered_creds_v1');
    }
  } catch (err) {
    console.error('Failed to save remembered credentials', err);
  }
}

// ----------------------------------------------------
// Register User with Approval Logic
// ----------------------------------------------------
export function registerUser(
  newUser: Omit<UserProfile, 'id' | 'registeredAt' | 'status' | 'role'> & {
    status?: UserAccountStatus;
    role?: UserRole;
  }
): { success: boolean; error?: string; user?: UserProfile; isPending?: boolean } {
  const settings = getAdminSettings();

  if (!settings.allowPublicRegistration) {
    return {
      success: false,
      error: 'නව සිසුන් ලියාපදිංචි වීම තාවකාලිකව අත්හිටුවා ඇත (Public registration paused by Admin).',
    };
  }

  const users = getStoredUsers();

  // Check duplicate email
  const existingEmail = users.find(
    (u) => u.email.toLowerCase() === newUser.email.trim().toLowerCase()
  );
  if (existingEmail) {
    return {
      success: false,
      error: 'මෙම ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත (Email already exists).',
    };
  }

  // Check duplicate NIC
  const existingNic = users.find(
    (u) => u.nic.toLowerCase() === newUser.nic.trim().toLowerCase()
  );
  if (existingNic) {
    return {
      success: false,
      error: 'මෙම ජාතික හැඳුනුම්පත් අංකය දැනටමත් ලියාපදිංචි කර ඇත (NIC already registered).',
    };
  }

  const initialStatus: UserAccountStatus = newUser.status
    ? newUser.status
    : settings.requireApproval
    ? 'pending'
    : 'approved';

  const createdUser: UserProfile = {
    ...newUser,
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: initialStatus,
    role: newUser.role || 'student',
    registeredAt: Date.now(),
    approvedAt: initialStatus === 'approved' ? Date.now() : undefined,
    approvedBy: initialStatus === 'approved' ? 'System Auto' : undefined,
  };

  const updated = [createdUser, ...users];
  saveStoredUsers(updated);

  // Sync new user to MongoDB Atlas
  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createdUser),
  }).catch(() => {});

  return {
    success: true,
    user: createdUser,
    isPending: initialStatus === 'pending',
  };
}

// ----------------------------------------------------
// Login User with Status Check
// ----------------------------------------------------
export function loginUser(
  identifier: string, // Email, NIC, or Phone
  passwordAttempt: string
): {
  success: boolean;
  error?: string;
  user?: UserProfile;
  isPending?: boolean;
  isSuspended?: boolean;
} {
  const users = getStoredUsers();
  const cleanId = identifier.trim().toLowerCase();
  const compactId = cleanId.replace(/\s+/g, '');

  // Special fast-path & robust handling for Admin: supundilshan358@gmail.com / password: addi
  const isAdminIdentifier =
    compactId === 'supundilshan358@gmail.com' ||
    cleanId === 'supun dilshan358@gmail.com' ||
    cleanId === 'supundilshan358@gmail.com';

  if (isAdminIdentifier) {
    if (passwordAttempt !== 'addi') {
      return {
        success: false,
        error: 'මුරපදය වැරදියි. නැවත උත්සාහ කරන්න (Incorrect password).',
      };
    }

    let adminUser = users.find(
      (u) => u.email.toLowerCase().replace(/\s+/g, '') === 'supundilshan358@gmail.com'
    );

    if (!adminUser) {
      adminUser = DEFAULT_USERS[0];
      const newUsers = [adminUser, ...users];
      saveStoredUsers(newUsers);
    } else {
      adminUser = {
        ...adminUser,
        role: 'admin',
        status: 'approved',
        password: 'addi',
        lastLoginAt: Date.now(),
      };
      saveStoredUsers(users.map((u) => (u.id === adminUser!.id ? adminUser! : u)));
    }

    return { success: true, user: adminUser };
  }

  const found = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.email.toLowerCase().replace(/\s+/g, '') === compactId ||
      u.nic.toLowerCase() === cleanId ||
      u.phoneNumber.trim() === cleanId
  );

  if (!found) {
    return {
      success: false,
      error: 'ගිණුමක් හමු නොවීය. කරුණාකර විස්තර පරීක්ෂා කරන්න හෝ Register වන්න (User not found).',
    };
  }

  if (found.password && found.password !== passwordAttempt) {
    return {
      success: false,
      error: 'මුරපදය වැරදියි. නැවත උත්සාහ කරන්න (Incorrect password).',
    };
  }

  // Check account status
  if (found.status === 'suspended') {
    return {
      success: false,
      isSuspended: true,
      error: 'මෙම ගිණුම පරිපාලක (Admin) විසින් අත්හිටුවා ඇත. කරුණාකර Admin අමතන්න (Account suspended).',
    };
  }

  if (found.status === 'pending') {
    const settings = getAdminSettings();
    return {
      success: false,
      isPending: true,
      user: found,
      error: settings.pendingUserNotice || 'ඔබගේ ගිණුම තවමත් පරිපාලක අනුමැතිය බලාපොරොත්තුවෙන් පවතී (Account pending approval).',
    };
  }

  // Update last login
  const updatedUser: UserProfile = {
    ...found,
    lastLoginAt: Date.now(),
  };

  const updatedUsers = users.map((u) => (u.id === found.id ? updatedUser : u));
  saveStoredUsers(updatedUsers);

  return { success: true, user: updatedUser };
}

// ----------------------------------------------------
// Admin Actions: User Management & Approval
// ----------------------------------------------------
export function approveUser(userId: string, approvedBy: string = 'Admin'): boolean {
  const users = getStoredUsers();
  let updated = false;

  const newUsers = users.map((u) => {
    if (u.id === userId) {
      updated = true;
      return {
        ...u,
        status: 'approved' as UserAccountStatus,
        approvedAt: Date.now(),
        approvedBy,
      };
    }
    return u;
  });

  if (updated) {
    saveStoredUsers(newUsers);

    // If current logged-in user was approved, update current user in storage
    const current = getCurrentUser();
    if (current && current.id === userId) {
      setCurrentUser({ ...current, status: 'approved', approvedAt: Date.now(), approvedBy });
    }

    // Sync to MongoDB Atlas
    fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', approvedBy }),
    }).catch(() => {});
  }

  return updated;
}

export function rejectOrPendingUser(userId: string): boolean {
  const users = getStoredUsers();
  let updated = false;

  const newUsers = users.map((u) => {
    if (u.id === userId) {
      updated = true;
      return {
        ...u,
        status: 'pending' as UserAccountStatus,
        approvedAt: undefined,
        approvedBy: undefined,
      };
    }
    return u;
  });

  if (updated) {
    saveStoredUsers(newUsers);

    // Sync to MongoDB Atlas
    fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pending' }),
    }).catch(() => {});
  }

  return updated;
}

export function suspendUser(userId: string): boolean {
  const users = getStoredUsers();
  let updated = false;

  const newUsers = users.map((u) => {
    if (u.id === userId) {
      updated = true;
      return {
        ...u,
        status: 'suspended' as UserAccountStatus,
      };
    }
    return u;
  });

  if (updated) {
    saveStoredUsers(newUsers);

    // If current logged in user was suspended, log them out
    const current = getCurrentUser();
    if (current && current.id === userId) {
      logoutUser();
    }

    // Sync to MongoDB Atlas
    fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    }).catch(() => {});
  }

  return updated;
}

export function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): { success: boolean; error?: string; user?: UserProfile } {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return { success: false, error: 'User not found' };
  }

  // Check email collision if email changed
  if (updates.email && updates.email.toLowerCase() !== users[index].email.toLowerCase()) {
    const exists = users.find(
      (u) => u.id !== userId && u.email.toLowerCase() === updates.email?.toLowerCase().trim()
    );
    if (exists) {
      return { success: false, error: 'මෙම ඊමේල් ලිපිනය වෙනත් පරිශීලකයෙකු සතුව ඇත (Email already in use).' };
    }
  }

  // Check NIC collision if NIC changed
  if (updates.nic && updates.nic.toLowerCase() !== users[index].nic.toLowerCase()) {
    const exists = users.find(
      (u) => u.id !== userId && u.nic.toLowerCase() === updates.nic?.toLowerCase().trim()
    );
    if (exists) {
      return { success: false, error: 'මෙම NIC අංකය වෙනත් පරිශීලකයෙකු සතුව ඇත (NIC already in use).' };
    }
  }

  const updatedUser: UserProfile = {
    ...users[index],
    ...updates,
  };

  users[index] = updatedUser;
  saveStoredUsers(users);

  // Sync current user if it's the active one
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(updatedUser);
  }

  // Sync to MongoDB Atlas
  fetch(`/api/users/${userId}/xp`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xp: updatedUser.xp, level: updatedUser.level }),
  }).catch(() => {});

  return { success: true, user: updatedUser };
}

export function deleteUser(userId: string): boolean {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== userId);

  if (filtered.length !== users.length) {
    saveStoredUsers(filtered);

    const current = getCurrentUser();
    if (current && current.id === userId) {
      logoutUser();
    }

    // Sync to MongoDB Atlas
    fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    }).catch(() => {});

    return true;
  }
  return false;
}

export function approveAllPendingUsers(): number {
  const users = getStoredUsers();
  let count = 0;

  const updatedUsers = users.map((u) => {
    if (u.status === 'pending') {
      count++;
      return {
        ...u,
        status: 'approved' as UserAccountStatus,
        approvedAt: Date.now(),
        approvedBy: 'Admin Bulk',
      };
    }
    return u;
  });

  if (count > 0) {
    saveStoredUsers(updatedUsers);
  }

  return count;
}

export function resetUsersToDemo(): UserProfile[] {
  saveStoredUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

export function exportUsersToCSV(): string {
  const users = getStoredUsers();
  const headers = ['ID', 'First Name', 'Last Name', 'NIC', 'Phone', 'Email', 'Status', 'Role', 'Registered Date', 'Approved Date', 'Notes'];

  const rows = users.map((u) => [
    u.id,
    `"${u.firstName.replace(/"/g, '""')}"`,
    `"${u.lastName.replace(/"/g, '""')}"`,
    `"${u.nic}"`,
    `"${u.phoneNumber}"`,
    `"${u.email}"`,
    u.status,
    u.role,
    u.registeredAt ? new Date(u.registeredAt).toISOString() : '',
    u.approvedAt ? new Date(u.approvedAt).toISOString() : '',
    `"${(u.adminNotes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// ----------------------------------------------------
// MongoDB Atlas Sync Function & Auto-Init
// ----------------------------------------------------
export async function syncFromMongoDB(): Promise<void> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users) && data.users.length > 0) {
        saveStoredUsers(data.users);
      }
    }
    const settingsRes = await fetch('/api/admin/settings');
    if (settingsRes.ok) {
      const sData = await settingsRes.json();
      if (sData.success && sData.settings) {
        localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(sData.settings));
        window.dispatchEvent(new Event('admin-settings-changed'));
      }
    }
  } catch {
    // Falls back to local storage if offline
  }
}

// Auto sync when loaded in browser
if (typeof window !== 'undefined') {
  syncFromMongoDB().catch(() => {});
}
