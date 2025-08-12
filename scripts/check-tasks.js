const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.local' });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' }
}, { timestamps: true });

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobileNumber: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  notes: { type: String, trim: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadId: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Agent = mongoose.model('Agent', agentSchema);
const Task = mongoose.model('Task', taskSchema);

async function checkTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-assignment');
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('email');
    console.log('\n👥 Users in database:');
    users.forEach(user => console.log(`   📧 ${user.email} (ID: ${user._id})`));

    // Get all tasks
    const tasks = await Task.find({})
      .populate('userId', 'email')
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });

    console.log(`\n📋 Found ${tasks.length} tasks in database:`);
    
    if (tasks.length === 0) {
      console.log('   ❌ No tasks found in database');
      console.log('\n🔧 To create test tasks, you need to:');
      console.log('   1. Login as admin');
      console.log('   2. Create some agents'); 
      console.log('   3. Upload a CSV file with tasks');
      console.log('   4. Tasks will be distributed to agents');
    } else {
      // Group tasks by admin
      const tasksByAdmin = {};
      tasks.forEach(task => {
        const adminEmail = task.userId.email;
        if (!tasksByAdmin[adminEmail]) {
          tasksByAdmin[adminEmail] = {};
        }
        if (!tasksByAdmin[adminEmail][task.uploadId]) {
          tasksByAdmin[adminEmail][task.uploadId] = [];
        }
        tasksByAdmin[adminEmail][task.uploadId].push(task);
      });

      Object.keys(tasksByAdmin).forEach(adminEmail => {
        console.log(`\n📧 Admin: ${adminEmail}`);
        Object.keys(tasksByAdmin[adminEmail]).forEach(uploadId => {
          const tasksInUpload = tasksByAdmin[adminEmail][uploadId];
          console.log(`   📁 Upload ID: ${uploadId} (${tasksInUpload.length} tasks)`);
          tasksInUpload.slice(0, 3).forEach(task => {
            console.log(`      - ${task.firstName} (${task.phone}) → ${task.agentId.name}`);
          });
          if (tasksInUpload.length > 3) {
            console.log(`      ... and ${tasksInUpload.length - 3} more tasks`);
          }
        });
      });
    }

    // Check agents
    const agents = await Agent.find({}).populate('userId', 'email');
    console.log(`\n👤 Found ${agents.length} agents:`);
    const agentsByAdmin = {};
    agents.forEach(agent => {
      const adminEmail = agent.userId.email;
      if (!agentsByAdmin[adminEmail]) agentsByAdmin[adminEmail] = [];
      agentsByAdmin[adminEmail].push(agent);
    });

    Object.keys(agentsByAdmin).forEach(adminEmail => {
      console.log(`   📧 ${adminEmail}: ${agentsByAdmin[adminEmail].length} agents`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkTasks();