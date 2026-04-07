import express from 'express';
import session from 'express-session';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve runtime public assets like /images
app.use(express.static(path.join(__dirname, 'dist'))); // Serve React build
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// Session configuration
app.use(session({
  secret: 'your-secret-key', // Change to a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
}));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const publicImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagesDir = path.join(__dirname, 'public', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const base = (req.body?.project || 'project').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const safeBase = base || 'project';
    cb(null, `${safeBase}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const allowedDocumentMimeTypes = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/rtf',
  'text/rtf'
]);

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Keep original uploaded file bytes with no compression to preserve quality.
    if (file.mimetype.startsWith('image/') || allowedDocumentMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error('Unsupported file type. Please upload images, PDF, or text/document files.'));
  }
});

const projectImageUpload = multer({
  storage: publicImagesStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }

    cb(new Error('Project image upload accepts image files only.'));
  }
});

const profileImageUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
      return;
    }

    cb(new Error('Profile picture upload accepts image files only.'));
  }
});

// Mock admin credentials (in production, use database)
const adminEmail = 'nickkiim7@gmail.com';
let adminPasswordHash = bcrypt.hashSync('Maddox@311', 10); // Initial password hash
const passwordResetTokens = new Map();

// Routes
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || '').toLowerCase().replace(/\s+/g, '');
  if (normalizedEmail === adminEmail && await bcrypt.compare(password, adminPasswordHash)) {
    req.session.admin = true;
    req.session.email = adminEmail;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/forgot-password', (req, res) => {
  const normalizedEmail = (req.body?.email || '').toLowerCase().replace(/\s+/g, '');

  if (normalizedEmail !== adminEmail) {
    return res.status(404).json({ success: false, message: 'Email not found' });
  }

  const resetToken = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000;
  passwordResetTokens.set(resetToken, { email: adminEmail, expiresAt });

  // For this portfolio app, token is returned so reset can be completed from UI.
  return res.json({
    success: true,
    message: 'Reset token generated. Use it below to set a new password.',
    resetToken
  });
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body || {};
  const tokenData = passwordResetTokens.get(token);

  if (!tokenData) {
    return res.status(400).json({ success: false, message: 'Invalid reset token' });
  }

  if (tokenData.expiresAt < Date.now()) {
    passwordResetTokens.delete(token);
    return res.status(400).json({ success: false, message: 'Reset token expired' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  }

  adminPasswordHash = await bcrypt.hash(newPassword, 10);
  passwordResetTokens.delete(token);
  req.session.admin = false;
  req.session.email = '';

  return res.json({ success: true, message: 'Password reset successfully' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/check-session', (req, res) => {
  if (req.session.admin) {
    res.json({ loggedIn: true, email: req.session.email });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/api/public-images', (req, res) => {
  const imagesDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(imagesDir)) {
    return res.json({ images: [] });
  }

  try {
    const entries = fs.readdirSync(imagesDir, { withFileTypes: true });
    const images = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /\.(png|jpe?g|webp|gif|svg|avif|bmp|tiff?|heic|heif)$/i.test(name))
      .map((name) => `/images/${name}`)
      .sort((a, b) => b.localeCompare(a));

    return res.json({ images });
  } catch {
    return res.status(500).json({ message: 'Could not read public images.' });
  }
});

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.session.admin) return res.status(403).json({ message: 'Not authorized' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.post('/api/upload-project-image', projectImageUpload.single('image'), (req, res) => {
  if (!req.session.admin) return res.status(403).json({ message: 'Not authorized' });
  res.json({ url: `/images/${req.file.filename}` });
});

app.post('/api/upload-profile-image', profileImageUpload.single('image'), (req, res) => {
  if (!req.session.admin) return res.status(403).json({ message: 'Not authorized' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use((err, req, res, next) => {
  if (
    err instanceof multer.MulterError ||
    err?.message?.includes('Unsupported file type') ||
    err?.message?.includes('accepts image files only')
  ) {
    return res.status(400).json({ message: err.message || 'Upload failed' });
  }
  return next(err);
});

// Update data (mock, in production use database)
let siteData = {
  projects: [
    {
      title: 'Spicy Game App',
      description: 'A spicy, game-focused web app with custom interactions.',
      image: '/images/spicy-game.png',
      url: 'https://spicygame.example.com'
    },
    {
      title: 'Portfolio Website',
      description: 'My personal portfolio showcasing projects and skills.',
      image: '/images/portfolio.png',
      url: 'https://portfolio.example.com'
    }
  ],
  about: 'I am familiar with React, JavaScript, HTML, CSS, Ruby on Rails, SQL, and PostgreSQL. I design and ship scalable web products with strong UX, clean code, and meaningful motion.',
  profileImage: '/images/me.jpg',
  skills: []
};

app.get('/api/data', (req, res) => {
  res.json(siteData);
});

app.post('/api/data', (req, res) => {
  if (!req.session.admin) return res.status(403).json({ message: 'Not authorized' });
  siteData = { ...siteData, ...req.body };
  res.json({ success: true });
});

// Serve React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});