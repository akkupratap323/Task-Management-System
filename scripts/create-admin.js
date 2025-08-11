const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });

// User schema (copied from the model)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-assignment');
    console.log('Connected to MongoDB');

    // Create multiple test users
    const testUsers = [
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'user1@test.com', password: 'user123' },
      { email: 'user2@test.com', password: 'user123' }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists!`);
        continue;
      }

      // Create new user
      const user = new User({
        email: userData.email,
        password: userData.password,
        role: 'admin'
      });

      await user.save();
      console.log(`✅ User created: ${userData.email} (password: ${userData.password})`);
    }
    
    console.log('');
    console.log('🎉 Test users are ready!');
    console.log('📧 admin@test.com (password: admin123)');
    console.log('📧 user1@test.com (password: user123)');
    console.log('📧 user2@test.com (password: user123)');
    console.log('');
    console.log('🌐 You can now login with these credentials at http://localhost:3001/login');
    console.log('💡 Each user has their own separate workspace with isolated data!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

createAdmin();