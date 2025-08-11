import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find agent by email across all users (agents can have same email under different admins)
    const agent = await Agent.findOne({ email }).populate('userId', 'email');
    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await agent.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({
      agentId: agent._id,
      userId: agent.userId._id,
      email: agent.email,
      name: agent.name,
      role: 'agent',
      adminEmail: agent.userId.email
    });

    return NextResponse.json({
      success: true,
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber,
        adminEmail: agent.userId.email,
        role: 'agent'
      }
    });

  } catch (error) {
    console.error('Agent login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}