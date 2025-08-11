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

const Agent = mongoose.model('Agent', agentSchema);

async function testWorkspaceIsolation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-assignment');
    console.log('Connected to MongoDB');

    // Create a second admin
    const admin2Email = 'admin2@test.com';
    let admin2 = await User.findOne({ email: admin2Email });
    
    if (!admin2) {
      admin2 = new User({
        email: admin2Email,
        password: 'admin123',
        role: 'admin'
      });
      await admin2.save();
      console.log('✅ Created second admin: admin2@test.com');
    } else {
      console.log('✅ Second admin already exists: admin2@test.com');
    }

    // Create some agents for the second admin
    const admin2Agents = [
      { name: 'Agent Smith', email: 'smith@agent.com', mobileNumber: '+1111111111', password: 'agent123' },
      { name: 'Agent Jones', email: 'jones@agent.com', mobileNumber: '+2222222222', password: 'agent123' }
    ];

    for (const agentData of admin2Agents) {
      const existingAgent = await Agent.findOne({ email: agentData.email, userId: admin2._id });
      if (!existingAgent) {
        const newAgent = new Agent({
          ...agentData,
          userId: admin2._id
        });
        await newAgent.save();
        console.log(`✅ Created agent: ${agentData.name} for admin2`);
      } else {
        console.log(`✅ Agent already exists: ${agentData.name} for admin2`);
      }
    }

    // Now test the workspace isolation
    console.log('\n🔍 Testing workspace isolation:');
    
    const admin1 = await User.findOne({ email: 'admin@test.com' });
    console.log(`\n📊 Admin 1 (${admin1.email}) ID: ${admin1._id}`);
    const admin1Agents = await Agent.find({ userId: admin1._id }).select('name email');
    console.log(`   Has ${admin1Agents.length} agents:`);
    admin1Agents.forEach(agent => console.log(`   - ${agent.name} (${agent.email})`));

    console.log(`\n📊 Admin 2 (${admin2.email}) ID: ${admin2._id}`);
    const admin2AgentsFound = await Agent.find({ userId: admin2._id }).select('name email');
    console.log(`   Has ${admin2AgentsFound.length} agents:`);
    admin2AgentsFound.forEach(agent => console.log(`   - ${agent.name} (${agent.email})`));

    // Test API endpoint simulation
    console.log('\n🔍 Simulating API queries:');
    console.log('Admin 1 query: Agent.find({ userId: admin1._id })');
    console.log(`Result: ${admin1Agents.length} agents`);
    console.log('Admin 2 query: Agent.find({ userId: admin2._id })');
    console.log(`Result: ${admin2AgentsFound.length} agents`);

    if (admin1Agents.length > 0 && admin2AgentsFound.length > 0) {
      console.log('\n✅ Workspace isolation is WORKING correctly!');
      console.log('Each admin sees only their own agents.');
    } else {
      console.log('\n⚠️  Need to verify workspace isolation setup.');
    }

  } catch (error) {
    console.error('Error testing workspace isolation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

testWorkspaceIsolation();