const path = require('path');
const fs = require('fs');

// Try multiple possible .env locations
const possibleEnvPaths = [
  path.join(__dirname, '../.env'),           // backend/.env (one level up)
  path.join(__dirname, '../../.env'),        // root/.env (two levels up)
  path.join(__dirname, '../../backend/.env'), // root/backend/.env
];

let envPath = null;
for (const envFilePath of possibleEnvPaths) {
  if (fs.existsSync(envFilePath)) {
    envPath = envFilePath;
    break;
  }
}

if (!envPath) {
  console.error('❌ Could not find .env file!');
  console.error('   Searched in:');
  possibleEnvPaths.forEach(p => console.error(`   - ${p}`));
  process.exit(1);
}

console.log(`📄 Loading .env from: ${envPath}\n`);
require('dotenv').config({ path: envPath });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Add Single User Script
 * 
 * This script adds a new user to the existing database.
 * Safe to run multiple times - checks for existing email.
 * 
 * Usage: node backend/scripts/addUser.js
 */

// Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables!');
  console.error('   .env file location:', envPath);
  console.error('\n   Please check your .env file contains:');
  console.error('   MONGODB_URI=your_connection_string\n');
  process.exit(1);
}

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// ============================================================
// NEW USER TO ADD
// ============================================================
// Edit the user details below before running this script

const newUser = {
  name: 'New User Name',              // Change this
  email: 'newuser@example.com',       // Change this
  password: 'password123',            // Change this
  role: 'student',                    // Options: 'student', 'staff', 'admin'
  isActive: true,
};

// ============================================================
// ADD USER FUNCTION
// ============================================================

const addUser = async () => {
  try {
    console.log('👤 Adding new user to database...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if user already exists
    const existingUser = await User.findOne({ email: newUser.email });
    
    if (existingUser) {
      console.log('⚠️  User with this email already exists!');
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   ID: ${existingUser._id}\n`);
      console.log('   Please use a different email address.');
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    // Create user
    console.log('💾 Creating user...');
    const user = await User.create({
      ...newUser,
      password: hashedPassword,
    });

    // Success message
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ USER ADDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('👤 User Details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Created: ${user.createdAt}\n`);
    
    console.log('🔑 Login Credentials:');
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Password: ${newUser.password}\n`);
    
    console.log('💡 Tip: Change the password after first login!\n');

    // Show current user count
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to add user:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

// ============================================================
// RUN SCRIPT
// ============================================================

addUser();