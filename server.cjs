const dns = require('dns');
// Set standard public DNS to resolve MongoDB Atlas SRV records smoothly on Windows / ISPs
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server override failed, continuing with system DNS:', e.message);
}

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://supundilshan358_db_user:ZaAoLY6pOTlsPg5D@cluster0.ouxm37c.mongodb.net/speakflow?retryWrites=true&w=majority&appName=Cluster0';

app.use(express.json({ limit: '10mb' }));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// -------------------------------------------------------------
// MongoDB Schemas & Models
// -------------------------------------------------------------

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nic: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  role: { type: String, enum: ['student', 'admin', 'teacher'], default: 'student' },
  rememberMe: { type: Boolean, default: false },
  registeredAt: { type: Number, default: () => Date.now() },
  approvedAt: { type: Number },
  approvedBy: { type: String },
  adminNotes: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastActive: { type: Number, default: () => Date.now() },
}, { timestamps: true });

const adminSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global_settings', unique: true },
  requireApproval: { type: Boolean, default: true },
  allowPublicRegistration: { type: Boolean, default: true },
  requireNicValidation: { type: Boolean, default: true },
  pendingUserNotice: { type: String, default: 'ඔබගේ ගිණුම සාර්ථකව නිර්මාණය විය. පරිපාලක (Admin) අනුමැතියෙන් පසු ඔබට ලොග් විය හැක.' },
  announcementText: { type: String, default: 'Welcome to SpeakFlow English Learning Platform! Master Spoken English and Grammar.' },
  showAnnouncement: { type: Boolean, default: false },
  autoApproveStaff: { type: Boolean, default: true },
}, { timestamps: true });

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  skill: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { type: String, default: 'Beginner' },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);
const Card = mongoose.model('Card', cardSchema);

// Initial Default Admin and Demo Users
const DEFAULT_USERS = [
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
    xp: 650,
    level: 3,
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
    xp: 0,
    level: 1,
  },
];

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial admin and demo users into MongoDB...');
      await User.insertMany(DEFAULT_USERS);
      console.log('Initial users seeded successfully!');
    }

    const settingsCount = await AdminSettings.countDocuments();
    if (settingsCount === 0) {
      console.log('Seeding default admin settings...');
      await AdminSettings.create({ key: 'global_settings' });
    }
  } catch (err) {
    console.error('Error during database seed:', err.message);
  }
}

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Authentication: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, nic, phoneNumber, email, password, avatarUrl } = req.body;

    if (!email || !password || !firstName) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'මෙම Email ලිපිනය දැනටමත් ලියාපදිංචි වී ඇත.' });
    }

    const settings = await AdminSettings.findOne({ key: 'global_settings' }) || {};
    const autoApproved = settings.requireApproval === false;

    const newUser = new User({
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      nic: (nic || '').trim(),
      phoneNumber: (phoneNumber || '').trim(),
      email: cleanEmail,
      password: password,
      status: autoApproved ? 'approved' : 'pending',
      role: 'student',
      registeredAt: Date.now(),
      approvedAt: autoApproved ? Date.now() : null,
      approvedBy: autoApproved ? 'System Auto-Approval' : '',
      adminNotes: autoApproved ? 'Auto-approved student' : 'New registration',
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firstName)}&backgroundColor=b6e3f4`,
      xp: 0,
      level: 1,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      user: newUser,
      message: autoApproved
        ? 'ලියාපදිංචිය සාර්ථකයි! ඔබට දැන් පිවිසිය හැක.'
        : (settings.pendingUserNotice || 'ඔබගේ ගිණුම සාර්ථකව නිර්මාණය විය. පරිපාලක (Admin) අනුමැතියෙන් පසු ඔබට ලොග් විය හැක.'),
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: err.message });
  }
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Email ලිපිනය හෝ Password එක වැරදිය.' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message: 'ඔබගේ ගිණුම තවමත් පරිපාලක (Admin) අනුමැතිය ලැබෙන තෙක් රැඳී පවතී. අනුමත වූ පසු ඔබට ලොග් විය හැක.',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message: 'ඔබගේ ගිණුම පරිපාලක විසින් ප්‍රතික්ෂේප කර ඇත. වැඩි විස්තර සඳහා සම්බන්ධ වන්න.',
      });
    }

    user.lastActive = Date.now();
    await user.save();

    res.json({
      success: true,
      user,
      message: 'සාර්ථකව ඇතුළු විය.',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.', error: err.message });
  }
});

// Get all users (Admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ registeredAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update user status (Approve / Reject)
app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const { status, approvedBy, adminNotes } = req.body;
    const user = await User.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    if (status === 'approved') {
      user.approvedAt = Date.now();
      user.approvedBy = approvedBy || 'Admin';
    }
    if (adminNotes !== undefined) {
      user.adminNotes = adminNotes;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update XP and Level
app.patch('/api/users/:id/xp', async (req, res) => {
  try {
    const { xp, level } = req.body;
    const user = await User.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (xp !== undefined) user.xp = xp;
    if (level !== undefined) user.level = level;
    user.lastActive = Date.now();

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await User.deleteOne({ id: req.params.id });
    res.json({ success: true, deleted: result.deletedCount > 0 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Settings: Get
app.get('/api/admin/settings', async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await AdminSettings.create({ key: 'global_settings' });
    }
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Settings: Update
app.put('/api/admin/settings', async (req, res) => {
  try {
    const updated = await AdminSettings.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cards API
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/cards', async (req, res) => {
  try {
    const { id, skill, title, category, level, content } = req.body;
    const card = await Card.findOneAndUpdate(
      { id },
      { $set: { skill, title, category, level, content } },
      { new: true, upsert: true }
    );
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// Connect and Start Server
// -------------------------------------------------------------
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 SpeakFlow Backend Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Start server even if offline, so frontend proxy doesn't 502
    app.listen(PORT, () => {
      console.log(`⚠️ SpeakFlow Backend Server running on http://localhost:${PORT} (offline DB mode)`);
    });
  });
