// ⚠️ CRITICAL: Load environment variables FIRST - Before anything else!
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ============================================================
// MIDDLEWARE - MUST BE BEFORE ROUTES!
// ============================================================

// Parse JSON request bodies - THIS MUST BE FIRST
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================================
// CORS CONFIGURATION - FIXED
// ============================================================

const allowedOrigins = [
  'https://equipment-lending-portal.vercel.app',
  'http://localhost:3000',  // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔍 Request origin:', origin); // Debug log
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware BEFORE other middleware
app.use(cors(corsOptions));

// ============================================================
// MONGODB CONNECTION
// ============================================================

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ ERROR: MONGODB_URI not found in .env file');
  console.error('   Make sure .env file is in: backend/.env');
  console.error('   And contains: MONGODB_URI=your_connection_string');
  process.exit(1);
}

console.log('🔌 Connecting to MongoDB...');

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ============================================================
// IMPORT ROUTES - AFTER MIDDLEWARE
// ============================================================

const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const requestRoutes = require('./routes/requestRoutes');

// ============================================================
// REGISTER ROUTES - AFTER MIDDLEWARE
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/requests', requestRoutes);

// ============================================================
// TEST ROUTES
// ============================================================

// Test Route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date(),
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// ============================================================
// ERROR HANDLING - 404
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API docs: Check API_DOCUMENTATION.md`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
});