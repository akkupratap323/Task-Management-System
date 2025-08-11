const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }
}, { timestamps: true });

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

// Agent schema
const agentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

agentSchema.index({ email: 1, userId: 1 }, { unique: true });

agentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

agentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Agent = mongoose.model('Agent', agentSchema);

// Task schema
const taskSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  notes: { type: String, trim: true, default: '' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  uploadId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

async function cleanAndSetup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-assignment');
    console.log('Connected to MongoDB');

    // Clear existing agents and tasks
    console.log('🧹 Cleaning up existing agents and tasks...');
    await Agent.deleteMany({});
    await Task.deleteMany({});
    console.log('✅ Cleared agents and tasks');

    // Get admin user
    const adminUser = await User.findOne({ email: 'admin@test.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found. Please run create-admin.js first');
      return;
    }

    console.log('✅ Found admin user:', adminUser.email);

    // Create test agents for admin user
    const testAgents = [
      { name: 'John Agent', email: 'john@agent.com', mobileNumber: '+1234567890', password: 'agent123' },
      { name: 'Jane Agent', email: 'jane@agent.com', mobileNumber: '+1987654321', password: 'agent123' },
      { name: 'Bob Agent', email: 'bob@agent.com', mobileNumber: '+1122334455', password: 'agent123' },
      { name: 'Alice Agent', email: 'alice@agent.com', mobileNumber: '+1555666777', password: 'agent123' },
      { name: 'Charlie Agent', email: 'charlie@agent.com', mobileNumber: '+1999888777', password: 'agent123' }
    ];

    console.log('\n📝 Creating test agents...');
    const createdAgents = [];

    for (const agentData of testAgents) {
      const agent = new Agent({
        ...agentData,
        userId: adminUser._id
      });

      await agent.save();
      console.log(`✅ Created agent: ${agentData.name} (${agentData.email})`);
      
      // Test password immediately after creation
      const testValid = await agent.comparePassword('agent123');
      console.log(`   Password test: ${testValid ? '✅ PASS' : '❌ FAIL'}`);
      
      createdAgents.push(agent);
    }

    // Create test tasks
    console.log('\n📋 Creating test tasks...');
    const testTasks = [
      { firstName: 'Customer 1', phone: '+1111111111', notes: 'High priority client' },
      { firstName: 'Customer 2', phone: '+1111111112', notes: 'Follow up required' },
      { firstName: 'Customer 3', phone: '+1111111113', notes: 'New prospect' },
      { firstName: 'Customer 4', phone: '+1111111114', notes: 'VIP client' },
      { firstName: 'Customer 5', phone: '+1111111115', notes: 'Existing customer' },
      { firstName: 'Customer 6', phone: '+1111111116', notes: 'Referral' },
      { firstName: 'Customer 7', phone: '+1111111117', notes: 'Hot lead' },
      { firstName: 'Customer 8', phone: '+1111111118', notes: 'Demo scheduled' },
      { firstName: 'Customer 9', phone: '+1111111119', notes: 'Price inquiry' },
      { firstName: 'Customer 10', phone: '+1111111120', notes: 'Contract renewal' }
    ];

    const uploadId = 'test-upload-' + Date.now();
    const tasksToCreate = [];

    // Distribute tasks among agents
    testTasks.forEach((task, index) => {
      const agentIndex = index % 5; // Distribute among 5 agents
      tasksToCreate.push({
        ...task,
        agentId: createdAgents[agentIndex]._id,
        userId: adminUser._id,
        uploadId
      });
    });

    await Task.insertMany(tasksToCreate);
    console.log(`✅ Created ${tasksToCreate.length} test tasks distributed among agents`);

    // Verify agents
    console.log('\n🔍 Verifying created agents:');
    const verifyAgents = await Agent.find({ userId: adminUser._id }).populate('userId', 'email');
    for (const agent of verifyAgents) {
      console.log(`📧 ${agent.email} - Admin: ${agent.userId.email}`);
    }

    console.log('\n🎉 Clean setup complete!');
    console.log('\n📋 You can now test agent login with these credentials:');
    testAgents.forEach(agent => {
      console.log(`   📧 ${agent.email} (password: agent123)`);
    });
    
    console.log('\n🌐 Agent Login URL: http://localhost:3000/agent-login');

  } catch (error) {
    console.error('Error in clean setup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

cleanAndSetup();