import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import Agent from '@/models/Agent';
import User from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    console.log('🔍 Analytics API - User from token:', user);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required - No valid token' },
        { status: 401 }
      );
    }
    
    if ((user as any).role === 'agent') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Default to admin if role is not explicitly set or is 'admin'
    if (!(user as any).role || (user as any).role === 'admin') {
      console.log('✅ Analytics API - Admin access granted');
    } else {
      console.log('❌ Analytics API - Invalid role:', (user as any).role);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Ensure models are registered
    User;
    Agent;

    const userId = (user as any).userId;

    // Get all tasks for this admin
    const allTasks = await Task.find({ userId })
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate overall statistics
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Group by agent
    const agentStats: Record<string, any> = {};
    allTasks.forEach(task => {
      const agentId = task.agentId._id.toString();
      const agentName = task.agentId.name;
      
      if (!agentStats[agentId]) {
        agentStats[agentId] = {
          agent: {
            id: agentId,
            name: agentName,
            email: task.agentId.email
          },
          total: 0,
          completed: 0,
          pending: 0,
          completionRate: 0
        };
      }
      
      agentStats[agentId].total++;
      if (task.status === 'completed') {
        agentStats[agentId].completed++;
      } else {
        agentStats[agentId].pending++;
      }
    });

    // Calculate completion rates for agents
    Object.values(agentStats).forEach((stats: any) => {
      stats.completionRate = stats.total > 0 ? 
        ((stats.completed / stats.total) * 100).toFixed(1) : 0;
    });

    // Group by upload session
    const uploadStats: Record<string, any> = {};
    allTasks.forEach(task => {
      if (!uploadStats[task.uploadId]) {
        uploadStats[task.uploadId] = {
          uploadId: task.uploadId,
          createdAt: task.createdAt,
          total: 0,
          completed: 0,
          pending: 0,
          completionRate: 0
        };
      }
      
      uploadStats[task.uploadId].total++;
      if (task.status === 'completed') {
        uploadStats[task.uploadId].completed++;
      } else {
        uploadStats[task.uploadId].pending++;
      }
    });

    // Calculate completion rates for uploads
    Object.values(uploadStats).forEach((stats: any) => {
      stats.completionRate = stats.total > 0 ? 
        ((stats.completed / stats.total) * 100).toFixed(1) : 0;
    });

    // Get completion timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const completionTimeline = [];
    const timelineMap: Record<string, any> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      timelineMap[dateStr] = { date: dateStr, completed: 0 };
    }
    
    // Count completions by day
    allTasks.forEach(task => {
      if (task.status === 'completed' && task.completedAt) {
        const dateStr = task.completedAt.toISOString().split('T')[0];
        if (timelineMap[dateStr]) {
          timelineMap[dateStr].completed++;
        }
      }
    });
    
    const timeline = Object.values(timelineMap);

    // Recent completions (last 10)
    const recentCompletions = allTasks
      .filter(task => task.status === 'completed')
      .slice(0, 10)
      .map(task => ({
        id: task._id,
        firstName: task.firstName,
        phone: task.phone,
        agentName: task.agentId.name,
        completedAt: task.completedAt,
        uploadId: task.uploadId
      }));

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalTasks,
          completedTasks,
          pendingTasks,
          completionRate: parseFloat(completionRate.toString())
        },
        agentPerformance: Object.values(agentStats),
        uploadSessions: Object.values(uploadStats).sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        completionTimeline: timeline,
        recentCompletions
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}