const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Agent schema
const agentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

agentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Agent = mongoose.model('Agent', agentSchema);

async function verifyAgents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-assignment');
    console.log('Connected to MongoDB');

    // Find all agents
    const agents = await Agent.find({}).populate('userId', 'email');
    console.log(`\n🔍 Found ${agents.length} agents:`);

    const testPassword = 'agent123';
    
    for (const agent of agents) {
      console.log(`\n📧 ${agent.email} (${agent.name})`);
      console.log(`   Admin: ${agent.userId ? agent.userId.email : 'NO ADMIN!'}`);
      console.log(`   Mobile: ${agent.mobileNumber}`);
      
      // Test password comparison
      try {
        const isValid = await agent.comparePassword(testPassword);
        console.log(`   Password '${testPassword}': ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        
        // Also check if raw password matches (in case hashing failed)
        const isRawMatch = agent.password === testPassword;
        console.log(`   Raw password match: ${isRawMatch ? '✅ YES (NOT HASHED!)' : '❌ NO (PROPERLY HASHED)'}`);
        
        // Show password hash
        console.log(`   Password hash: ${agent.password.substring(0, 30)}...`);
        
      } catch (error) {
        console.log(`   Password test ERROR: ${error.message}`);
      }
    }

    // Special check for jane@agent.com
    console.log('\n🔍 Special check for jane@agent.com:');
    const janeAgent = await Agent.findOne({ email: 'jane@agent.com' });
    if (janeAgent) {
      console.log('✅ Jane agent found');
      console.log(`   ID: ${janeAgent._id}`);
      console.log(`   Name: ${janeAgent.name}`);
      console.log(`   Email: ${janeAgent.email}`);
      console.log(`   Has userId: ${janeAgent.userId ? 'YES' : 'NO'}`);
      
      // Test different password variations
      const passwordTests = ['agent123', 'Agent123', 'AGENT123', 'jane123'];
      for (const testPwd of passwordTests) {
        try {
          const valid = await janeAgent.comparePassword(testPwd);
          console.log(`   Password '${testPwd}': ${valid ? '✅ VALID' : '❌ INVALID'}`);
        } catch (error) {
          console.log(`   Password '${testPwd}': ERROR - ${error.message}`);
        }
      }
    } else {
      console.log('❌ Jane agent NOT FOUND');
    }

  } catch (error) {
    console.error('Error verifying agents:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

verifyAgents();