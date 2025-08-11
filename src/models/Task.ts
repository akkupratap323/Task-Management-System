import mongoose from 'mongoose';

export interface ITask extends mongoose.Document {
  firstName: string;
  phone: string;
  notes: string;
  agentId: mongoose.Types.ObjectId;
  uploadId: string;
  userId: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  uploadId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema);