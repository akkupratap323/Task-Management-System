import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Agent from '@/models/Agent';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();
    console.log('🔍 Agent login attempt:', { email, passwordLength: password?.length });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find agent by email across all users (agents can have same email under different admins)
    const agent = await Agent.findOne({ email }).populate('userId', 'email');
    console.log('🔍 Agent found:', agent ? `${agent.name} (${agent.email})` : 'None');
    
    if (!agent) {
      console.log('❌ Agent not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('🔍 Checking password for:', agent.name);
    const isPasswordValid = await agent.comparePassword(password);
    console.log('🔍 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password validation failed for:', agent.email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    console.log('✅ Login successful for:', agent.email);

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