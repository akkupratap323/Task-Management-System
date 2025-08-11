import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Agent from '@/models/Agent';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const uploadId = searchParams.get('uploadId');
    const agentId = searchParams.get('agentId');

    let query: any = { userId: (user as any).userId };
    if (uploadId) query.uploadId = uploadId;
    if (agentId) query.agentId = agentId;

    const tasks = await Task.find(query).populate('agentId', 'name email mobileNumber');

    if (uploadId && !agentId) {
      const agents = await Agent.find({ userId: (user as any).userId });
      const tasksByAgent = {};

      for (const agent of agents) {
        tasksByAgent[agent._id.toString()] = {
          agent: {
            id: agent._id,
            name: agent.name,
            email: agent.email,
            mobileNumber: agent.mobileNumber
          },
          tasks: [],
          taskCount: 0
        };
      }

      for (const task of tasks) {
        const agentId = task.agentId._id.toString();
        if (tasksByAgent[agentId]) {
          tasksByAgent[agentId].tasks.push(task);
          tasksByAgent[agentId].taskCount++;
        }
      }

      return NextResponse.json({
        success: true,
        uploadId,
        totalTasks: tasks.length,
        distribution: Object.values(tasksByAgent)
      });
    }

    return NextResponse.json({
      success: true,
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}