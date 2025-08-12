import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import Task from '@/models/Task';
import { authenticateRequest } from '@/lib/auth';
import { parseCSVFile, distributeTasksAmongAgents } from '@/lib/csvParser';

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && 
        !file.name.toLowerCase().endsWith('.csv') && 
        !file.name.toLowerCase().endsWith('.xlsx') && 
        !file.name.toLowerCase().endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV, XLS, or XLSX files only.' },
        { status: 400 }
      );
    }

    const agents = await Agent.find({ userId: (user as any).userId }).limit(5);
    if (agents.length < 5) {
      return NextResponse.json(
        { error: 'At least 5 agents are required for task distribution in your workspace' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    let parsedData;
    try {
      parsedData = parseCSVFile(buffer, file.name);
    } catch (parseError: any) {
      return NextResponse.json(
        { error: `File parsing error: ${parseError.message}` },
        { status: 400 }
      );
    }

    const uploadId = Date.now().toString();
    const agentIds = agents.map(agent => agent._id.toString());
    
    const distributedTasks = distributeTasksAmongAgents(parsedData, agentIds, uploadId, (user as any).userId);

    const savedTasks = await Task.insertMany(distributedTasks);

    const tasksByAgent: Record<string, any[]> = {};
    for (const task of savedTasks) {
      const agentId = task.agentId.toString();
      if (!tasksByAgent[agentId]) {
        tasksByAgent[agentId] = [];
      }
      tasksByAgent[agentId].push(task);
    }

    const result = agents.map(agent => ({
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber
      },
      tasks: tasksByAgent[agent._id.toString()] || [],
      taskCount: (tasksByAgent[agent._id.toString()] || []).length
    }));

    return NextResponse.json({
      success: true,
      uploadId,
      totalTasks: parsedData.length,
      distribution: result
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};