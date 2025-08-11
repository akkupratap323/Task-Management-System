const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.local' });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-assignment');
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('email role');
    console.log('\n📊 Available Admin Accounts:');
    users.forEach(user => {
      console.log(`   📧 ${user.email} (Role: ${user.role})`);
    });

    console.log('\n🔑 Test Credentials:');
    console.log('   Email: admin@test.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('   Email: admin2@test.com'); 
    console.log('   Password: admin123');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkUsers();