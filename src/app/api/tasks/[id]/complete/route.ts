import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import Agent from '@/models/Agent';
import { authenticateRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);
    if (!user || (user as any).role !== 'agent') {
      return NextResponse.json(
        { error: 'Unauthorized - Agent access required' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Ensure models are registered
    User;
    Agent;

    const taskId = params.id;
    const agentId = (user as any).agentId;

    // Find the task and verify it belongs to this agent
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if task belongs to this agent
    if (task.agentId.toString() !== agentId) {
      return NextResponse.json(
        { error: 'Unauthorized - Task not assigned to you' },
        { status: 403 }
      );
    }

    // Check if task is already completed
    if (task.status === 'completed') {
      return NextResponse.json(
        { error: 'Task is already completed' },
        { status: 400 }
      );
    }

    // Mark task as completed
    task.status = 'completed';
    task.completedAt = new Date();
    task.completedBy = agentId;
    await task.save();

    return NextResponse.json({
      success: true,
      message: 'Task marked as completed',
      task: {
        id: task._id,
        firstName: task.firstName,
        phone: task.phone,
        notes: task.notes,
        status: task.status,
        completedAt: task.completedAt
      }
    });

  } catch (error) {
    console.error('Complete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authenticateRequest(request);
    if (!user || (user as any).role !== 'agent') {
      return NextResponse.json(
        { error: 'Unauthorized - Agent access required' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Ensure models are registered
    User;
    Agent;

    const taskId = params.id;
    const agentId = (user as any).agentId;

    // Find the task and verify it belongs to this agent
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Check if task belongs to this agent
    if (task.agentId.toString() !== agentId) {
      return NextResponse.json(
        { error: 'Unauthorized - Task not assigned to you' },
        { status: 403 }
      );
    }

    // Check if task is completed
    if (task.status !== 'completed') {
      return NextResponse.json(
        { error: 'Task is not completed' },
        { status: 400 }
      );
    }

    // Mark task as pending (uncomplete)
    task.status = 'pending';
    task.completedAt = undefined;
    task.completedBy = undefined;
    await task.save();

    return NextResponse.json({
      success: true,
      message: 'Task marked as pending',
      task: {
        id: task._id,
        firstName: task.firstName,
        phone: task.phone,
        notes: task.notes,
        status: task.status
      }
    });

  } catch (error) {
    console.error('Uncomplete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}