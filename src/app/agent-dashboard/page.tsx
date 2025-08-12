'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedAgentRoute from '@/components/ProtectedAgentRoute';

interface Task {
  id: string;
  firstName: string;
  phone: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'completed';
  completedAt?: string;
}

interface TaskGroup {
  uploadId: string;
  adminEmail: string;
  createdAt: string;
  tasks: Task[];
}

interface AgentData {
  name: string;
  email: string;
  adminEmail: string;
}

export default function AgentDashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNext: false,
    hasPrev: false
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      router.push('/agent-login');
      return;
    }
    fetchAgentTasks();
  }, [user, currentPage]);

  const fetchAgentTasks = async () => {
    try {
      const response = await fetch(`/api/agent/tasks?page=${currentPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAgentData(data.agent);
        setTaskGroups(data.taskGroups);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch tasks:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTotalTasksCount = () => {
    return taskGroups.reduce((total, group) => total + group.tasks.length, 0);
  };

  const getCompletedTasksCount = () => {
    return taskGroups.reduce((total, group) => 
      total + group.tasks.filter(task => task.status === 'completed').length, 0
    );
  };

  const handleTaskCompletion = async (taskId: string, currentStatus: string) => {
    try {
      const isCompleting = currentStatus === 'pending';
      const method = isCompleting ? 'POST' : 'DELETE';
      
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Update the task in the local state
        setTaskGroups(prevGroups => 
          prevGroups.map(group => ({
            ...group,
            tasks: group.tasks.map(task => 
              task.id === taskId 
                ? { 
                    ...task, 
                    status: isCompleting ? 'completed' : 'pending',
                    completedAt: isCompleting ? new Date().toISOString() : undefined
                  }
                : task
            )
          }))
        );
      } else {
        alert(`Failed to ${isCompleting ? 'complete' : 'uncomplete'} task: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('An error occurred while updating the task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'agent') {
    return null;
  }

  return (
    <ProtectedAgentRoute>
      <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Agent Dashboard</h1>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                Agent Portal
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {agentData?.name || user.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Agent Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Agent Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{agentData?.name || user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{agentData?.email || user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Admin</dt>
                  <dd className="mt-1 text-sm text-gray-900">{agentData?.adminEmail || user.adminEmail}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Task Summary */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Task Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-blue-600">Total Tasks</dt>
                  <dd className="mt-1 text-2xl font-semibold text-blue-900">{pagination.totalTasks}</dd>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-green-600">Completed</dt>
                  <dd className="mt-1 text-2xl font-semibold text-green-900">{getCompletedTasksCount()}</dd>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-orange-600">Pending</dt>
                  <dd className="mt-1 text-2xl font-semibold text-orange-900">{getTotalTasksCount() - getCompletedTasksCount()}</dd>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-purple-600">Task Groups</dt>
                  <dd className="mt-1 text-2xl font-semibold text-purple-900">{taskGroups.length}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Task Groups */}
          <div className="space-y-6">
            {taskGroups.length === 0 ? (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">No tasks assigned yet.</p>
                </div>
              </div>
            ) : (
              taskGroups.map((group, groupIndex) => (
                <div key={group.uploadId} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-md font-medium text-gray-900">
                          Task Group #{groupIndex + 1}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Uploaded: {formatDate(group.createdAt)} | Admin: {group.adminEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          Upload ID: {group.uploadId}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {group.tasks.length} tasks
                      </span>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-3">
                        {group.tasks.map((task, taskIndex) => (
                          <div key={task.id} className={`bg-gray-50 rounded p-4 border-l-4 ${task.status === 'completed' ? 'border-green-500 bg-green-50' : 'border-blue-400'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{task.firstName}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      task.status === 'completed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {task.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                                    </span>
                                  </div>
                                  <span className="text-gray-600">{task.phone}</span>
                                </div>
                                {task.notes && (
                                  <p className="text-gray-600 text-sm mb-2">{task.notes}</p>
                                )}
                                <div className="text-xs text-gray-500">
                                  <p>Created: {formatDate(task.createdAt)}</p>
                                  {task.updatedAt !== task.createdAt && (
                                    <p>Updated: {formatDate(task.updatedAt)}</p>
                                  )}
                                  {task.status === 'completed' && task.completedAt && (
                                    <p className="text-green-600 font-medium">Completed: {formatDate(task.completedAt)}</p>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <button
                                  onClick={() => handleTaskCompletion(task.id, task.status)}
                                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    task.status === 'completed'
                                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                  }`}
                                >
                                  {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                    <span className="font-medium">{pagination.totalPages}</span> (
                    <span className="font-medium">{pagination.totalTasks}</span> total tasks)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {pagination.currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedAgentRoute>
  );
}