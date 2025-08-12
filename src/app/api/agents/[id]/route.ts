import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import Task from '@/models/Task';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    
    const agent = await Agent.findOne({ _id: id, userId: (user as any).userId }).select('-password');
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const tasks = await Task.find({ agentId: id, userId: (user as any).userId });

    return NextResponse.json({
      success: true,
      agent,
      tasks
    });

  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    
    const { name, email, mobileNumber } = await request.json();

    if (!name || !email || !mobileNumber) {
      return NextResponse.json(
        { error: 'Name, email, and mobile number are required' },
        { status: 400 }
      );
    }

    const agent = await Agent.findOneAndUpdate(
      { _id: id, userId: (user as any).userId },
      { name, email, mobileNumber },
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      agent
    });

  } catch (error) {
    console.error('Update agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;
    
    const agent = await Agent.findOneAndDelete({ _id: id, userId: (user as any).userId });
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    await Task.deleteMany({ agentId: id, userId: (user as any).userId });

    return NextResponse.json({
      success: true,
      message: 'Agent deleted successfully'
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}