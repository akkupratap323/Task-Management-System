import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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
    
    const agents = await Agent.find({ userId: (user as any).userId }).select('-password');
    
    return NextResponse.json({
      success: true,
      agents
    });

  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    const { name, email, mobileNumber, password } = await request.json();

    if (!name || !email || !mobileNumber || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingAgent = await Agent.findOne({ email, userId: (user as any).userId });
    if (existingAgent) {
      return NextResponse.json(
        { error: 'Agent already exists with this email in your workspace' },
        { status: 409 }
      );
    }

    const agent = new Agent({
      name,
      email,
      mobileNumber,
      password,
      userId: (user as any).userId
    });

    await agent.save();

    const agentResponse = agent.toObject();
    delete agentResponse.password;

    return NextResponse.json({
      success: true,
      agent: agentResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}