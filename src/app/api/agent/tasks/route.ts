import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user || (user as any).role !== 'agent') {
      return NextResponse.json(
        { error: 'Unauthorized - Agent access required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get tasks assigned to this specific agent
    const tasks = await Task.find({ 
      agentId: (user as any).agentId,
      userId: (user as any).userId
    })
    .populate('userId', 'email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Get total count for pagination
    const totalTasks = await Task.countDocuments({ 
      agentId: (user as any).agentId,
      userId: (user as any).userId
    });

    // Group tasks by upload ID for better organization
    const tasksByUpload = {};
    tasks.forEach(task => {
      if (!tasksByUpload[task.uploadId]) {
        tasksByUpload[task.uploadId] = {
          uploadId: task.uploadId,
          adminEmail: task.userId.email,
          createdAt: task.createdAt,
          tasks: []
        };
      }
      tasksByUpload[task.uploadId].tasks.push({
        id: task._id,
        firstName: task.firstName,
        phone: task.phone,
        notes: task.notes,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      });
    });

    return NextResponse.json({
      success: true,
      agent: {
        name: (user as any).name,
        email: (user as any).email,
        adminEmail: (user as any).adminEmail
      },
      taskGroups: Object.values(tasksByUpload),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
        hasNext: skip + limit < totalTasks,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get agent tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}