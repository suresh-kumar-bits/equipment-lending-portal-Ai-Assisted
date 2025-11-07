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
 * Database Seeding Script
 * 
 * This script creates initial users in the database.
 * Run this script ONCE to populate your empty database.
 * 
 * Usage: node backend/scripts/seedDatabase.js
 */

// Debug: Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables!');
  console.error('   .env file location:', envPath);
  console.error('   .env file exists:', fs.existsSync(envPath));
  console.error('\n   Please check your .env file contains:');
  console.error('   MONGODB_URI=your_connection_string\n');
  process.exit(1);
}

// User Schema (inline to avoid import issues)
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
// USERS TO SEED
// ============================================================

const usersToSeed = [
  // Admin Users
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'password123',
    role: 'admin',
    isActive: true,
  },

  // Staff Users
  {
    name: 'Staff Member',
    email: 'staff@example.com',
    password: 'password123',
    role: 'staff',
    isActive: true,
  },
  {
    name: 'Lab Assistant',
    email: 'assistant@example.com',
    password: 'password123',
    role: 'staff',
    isActive: true,
  },

  // Student Users
  {
    name: 'John Doe',
    email: 'student@example.com',
    password: 'password123',
    role: 'student',
    isActive: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'student',
    isActive: true,
  },
];

// ============================================================
// SEEDING FUNCTION
// ============================================================

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    
    if (existingUsers > 0) {
      console.log(`⚠️  Warning: Database already has ${existingUsers} user(s)`);
      console.log('   Do you want to clear existing users and reseed?');
      console.log('   Comment out the exit below to proceed with clearing.\n');
      
      // SAFETY: Comment out the next line to allow clearing existing users
      process.exit(0);
      
      // Clear existing users
      await User.deleteMany({});
      console.log('🗑️  Cleared existing users\n');
    }

    // Hash passwords and create users
    console.log('🔐 Hashing passwords and creating users...\n');
    
    const createdUsers = [];
    
    for (const userData of usersToSeed) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      
      createdUsers.push(user);
      
      console.log(`✅ Created ${userData.role.toUpperCase()}: ${userData.email}`);
      console.log(`   Name: ${userData.name}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   ID: ${user._id}\n`);
    }

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📊 Summary:');
    console.log(`   Total Users Created: ${createdUsers.length}`);
    console.log(`   Admins: ${createdUsers.filter(u => u.role === 'admin').length}`);
    console.log(`   Staff: ${createdUsers.filter(u => u.role === 'staff').length}`);
    console.log(`   Students: ${createdUsers.filter(u => u.role === 'student').length}\n`);
    
    console.log('🔑 Login Credentials:');
    console.log('   Admin: admin@example.com / password123');
    console.log('   Staff: staff@example.com / password123');
    console.log('   Student: student@example.com / password123\n');
    
    console.log('💡 Tips:');
    console.log('   - Change passwords after first login');
    console.log('   - Edit this script to add more users');
    console.log('   - Use MongoDB Compass to manage users directly\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

// ============================================================
// RUN SEEDING
// ============================================================

seedDatabase();