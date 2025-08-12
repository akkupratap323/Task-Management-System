'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import TaskEditModal from '@/components/TaskEditModal';
import TaskAnalytics from '@/components/TaskAnalytics';
import { toast } from "sonner";

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
}

interface Task {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
  agentId: string;
  uploadId: string;
}

interface TaskDistribution {
  agent: {
    id: string;
    name: string;
    email: string;
    mobileNumber: string;
  };
  tasks: Task[];
  taskCount: number;
}

export default function Dashboard() {
  const { logout, user, token } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState<'agents' | 'upload' | 'tasks' | 'analytics'>('agents');
  const [loading, setLoading] = useState(true);
  const [taskDistributions, setTaskDistributions] = useState<TaskDistribution[]>([]);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

  // Agent form state
  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: ''
  });
  const [agentFormError, setAgentFormError] = useState('');
  const [agentFormLoading, setAgentFormLoading] = useState(false);

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Task editing state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAgents();
      fetchAllTasks(); // Fetch all historical tasks on load
    }
  }, [token]);

  const fetchAgents = async () => {
    try {
      console.log('🔍 Frontend: Fetching agents...');
      console.log('🔍 Frontend: Token available:', !!token);
      console.log('🔍 Frontend: User:', user);
      
      if (!token) {
        console.log('❌ Frontend: No token available');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('🔍 Frontend: Response status:', response.status);
      const data = await response.json();
      console.log('🔍 Frontend: Response data:', data);
      
      if (data.success) {
        console.log('✅ Frontend: Setting agents:', data.agents.length, 'agents');
        setAgents(data.agents);
      } else {
        console.log('❌ Frontend: API returned error:', data.error);
      }
    } catch (error) {
      console.error('❌ Frontend: Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTasks = async () => {
    try {
      console.log('🔍 Frontend: Fetching all tasks for current admin...');
      
      if (!token) {
        console.log('❌ Frontend: No token available for tasks');
        return;
      }

      const response = await fetch('/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('🔍 Frontend: Tasks response status:', response.status);
      const data = await response.json();
      console.log('🔍 Frontend: Tasks data:', data);
      
      if (data.success && data.tasks) {
        // Group tasks by upload ID and agent
        const tasksByUpload = {};
        const agents = await fetch('/api/agents', {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json()).then(res => res.agents || []);

        // Create agent lookup
        const agentLookup = {};
        agents.forEach(agent => {
          agentLookup[agent._id] = agent;
        });

        data.tasks.forEach(task => {
          if (!tasksByUpload[task.uploadId]) {
            tasksByUpload[task.uploadId] = {
              uploadId: task.uploadId,
              createdAt: task.createdAt,
              agents: {}
            };
          }
          
          const agentId = task.agentId._id || task.agentId;
          if (!tasksByUpload[task.uploadId].agents[agentId]) {
            const agent = task.agentId.name ? task.agentId : agentLookup[agentId];
            tasksByUpload[task.uploadId].agents[agentId] = {
              agent: {
                id: agentId,
                name: agent?.name || 'Unknown Agent',
                email: agent?.email || '',
                mobileNumber: agent?.mobileNumber || ''
              },
              tasks: [],
              taskCount: 0
            };
          }
          
          tasksByUpload[task.uploadId].agents[agentId].tasks.push(task);
          tasksByUpload[task.uploadId].agents[agentId].taskCount++;
        });

        // Convert to the format expected by the UI
        const distribution = [];
        Object.values(tasksByUpload).forEach(upload => {
          Object.values(upload.agents).forEach(agentData => {
            distribution.push(agentData);
          });
        });

        console.log('✅ Frontend: Setting task distributions:', distribution.length, 'agent-task groups');
        setTaskDistributions(distribution);
        
        if (distribution.length > 0) {
          setActiveTab('tasks'); // Switch to tasks tab if there are tasks
        }
      } else {
        console.log('❌ Frontend: No tasks found or API error:', data.error);
      }
    } catch (error) {
      console.error('❌ Frontend: Error fetching all tasks:', error);
    }
  };

  const handleAgentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgentFormError('');
    setAgentFormLoading(true);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(agentForm)
      });

      const data = await response.json();

      if (data.success) {
        setAgents(prev => [...prev, data.agent]);
        setAgentForm({ name: '', email: '', mobileNumber: '', password: '' });
        toast.success("🎉 Agent created successfully!", {
          description: `${data.agent.name} has been added to your team`,
          duration: 4000,
        });
      } else {
        setAgentFormError(data.error || 'Failed to create agent');
        toast.error("❌ Failed to create agent", {
          description: data.error || 'Please try again',
          duration: 4000,
        });
      }
    } catch (error) {
      setAgentFormError('An error occurred while creating agent');
    } finally {
      setAgentFormLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file');
      return;
    }

    setUploadError('');
    setUploadLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch('/api/tasks/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setTaskDistributions(data.distribution);
        setCurrentUploadId(data.uploadId);
        setActiveTab('tasks');
        setUploadFile(null);
        const totalTasks = data.distribution.reduce((sum, dist) => sum + dist.taskCount, 0);
        toast.success("🚀 CSV uploaded and tasks distributed!", {
          description: `${totalTasks} tasks assigned to ${data.distribution.length} agents`,
          duration: 5000,
        });
      } else {
        setUploadError(data.error || 'Failed to upload file');
        toast.error("❌ Failed to upload CSV", {
          description: data.error || 'Please check your file format',
          duration: 4000,
        });
      }
    } catch (error) {
      setUploadError('An error occurred during file upload');
    } finally {
      setUploadLoading(false);
    }
  };

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        const deletedAgent = agents.find(agent => agent._id === agentId);
        setAgents(prev => prev.filter(agent => agent._id !== agentId));
        toast.success("🗑️ Agent deleted successfully", {
          description: `${deletedAgent?.name || 'Agent'} has been removed from your team`,
          duration: 4000,
        });
      } else {
        toast.error("❌ Failed to delete agent", {
          description: data.error || 'Please try again',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('An error occurred while deleting agent');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = async (taskId: string, updatedTask: { firstName: string; phone: string; notes: string }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask)
      });

      const data = await response.json();

      if (data.success) {
        // Update the task in the current distribution
        setTaskDistributions(prev => 
          prev.map(distribution => ({
            ...distribution,
            tasks: distribution.tasks.map(task => 
              task._id === taskId ? { ...task, ...updatedTask } : task
            )
          }))
        );
        toast.success("✏️ Task updated successfully!", {
          description: `Changes saved for ${updatedTask.firstName}`,
          duration: 4000,
        });
      } else {
        throw new Error(data.error || 'Failed to update task');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Get task name before deletion
        let taskName = '';
        taskDistributions.forEach(dist => {
          const task = dist.tasks.find(t => t._id === taskId);
          if (task) taskName = task.firstName;
        });
        
        // Remove the task from the current distribution
        setTaskDistributions(prev => 
          prev.map(distribution => ({
            ...distribution,
            tasks: distribution.tasks.filter(task => task._id !== taskId),
            taskCount: distribution.tasks.filter(task => task._id !== taskId).length
          }))
        );
        toast.success("🗑️ Task deleted successfully", {
          description: `Task for ${taskName} has been removed`,
          duration: 4000,
        });
      } else {
        toast.error("❌ Failed to delete task", {
          description: data.error || 'Please try again',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Task Management Dashboard</h1>
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Your Workspace
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.email}</span>
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
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('agents')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'agents'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Agents ({agents.length})
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'upload'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Upload CSV
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tasks'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Task Distribution
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Analytics & Charts
                </button>
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === 'agents' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Add New Agent
                      </h3>
                      <form onSubmit={handleAgentSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                          <input
                            type="text"
                            name="name"
                            placeholder="Agent Name"
                            value={agentForm.name}
                            onChange={handleAgentFormChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={agentForm.email}
                            onChange={handleAgentFormChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <input
                            type="tel"
                            name="mobileNumber"
                            placeholder="Mobile Number (with country code)"
                            value={agentForm.mobileNumber}
                            onChange={handleAgentFormChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <input
                            type="password"
                            name="password"
                            placeholder="Password (min 6 characters)"
                            value={agentForm.password}
                            onChange={handleAgentFormChange}
                            required
                            minLength={6}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          {agentFormError && (
                            <div className="text-red-600 text-sm">{agentFormError}</div>
                          )}
                          <button
                            type="submit"
                            disabled={agentFormLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            {agentFormLoading ? 'Creating...' : 'Add Agent'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Agents List
                      </h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {agents.map((agent) => (
                          <div key={agent._id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-md font-medium text-gray-900">{agent.name}</h4>
                                <p className="text-sm text-gray-500">{agent.email}</p>
                                <p className="text-sm text-gray-500">{agent.mobileNumber}</p>
                              </div>
                              <button
                                onClick={() => deleteAgent(agent._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                        {agents.length === 0 && (
                          <p className="text-gray-500 text-center">No agents added yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Upload CSV File
                    </h3>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Upload a CSV/Excel file with the following columns:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mb-4">
                        <li>FirstName (required)</li>
                        <li>Phone (required)</li>
                        <li>Notes (optional)</li>
                      </ul>
                      <p className="text-sm text-gray-600 mb-4">
                        Tasks will be distributed equally among {agents.length} agents.
                        {agents.length < 5 && (
                          <span className="text-red-600"> Note: You need at least 5 agents for distribution.</span>
                        )}
                      </p>
                    </div>
                    <form onSubmit={handleFileUpload}>
                      <div className="mb-4">
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      {uploadError && (
                        <div className="text-red-600 text-sm mb-4">{uploadError}</div>
                      )}
                      <button
                        type="submit"
                        disabled={uploadLoading || !uploadFile || agents.length < 5}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {uploadLoading ? 'Uploading...' : 'Upload and Distribute'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  {taskDistributions.length === 0 ? (
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6 text-center">
                        <p className="text-gray-500">
                          No tasks found for your workspace. Upload a CSV file to create and distribute tasks to your agents.
                        </p>
                        <div className="mt-4 text-sm text-gray-400">
                          <p>💡 Tasks from your previous uploads will automatically appear here.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                            Your Task Distribution History
                          </h3>
                          <p className="text-sm text-gray-600">
                            {currentUploadId ? `Latest Upload ID: ${currentUploadId} | ` : ''}
                            Total Tasks: {taskDistributions.reduce((sum, dist) => sum + dist.taskCount, 0)} | 
                            Agents with Tasks: {taskDistributions.length}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            📊 Showing all tasks you've created and distributed across your agents
                          </p>
                        </div>
                      </div>
                      
                      {taskDistributions.map((distribution, index) => (
                        <div key={distribution.agent.id} className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-md font-medium text-gray-900">{distribution.agent.name}</h4>
                                <p className="text-sm text-gray-500">{distribution.agent.email}</p>
                                <p className="text-sm text-gray-500">{distribution.agent.mobileNumber}</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {distribution.taskCount} tasks
                                </span>
                              </div>
                            </div>
                            
                            {distribution.tasks.length > 0 && (
                              <div className="max-h-64 overflow-y-auto">
                                <div className="grid grid-cols-1 gap-2">
                                  {distribution.tasks.map((task, taskIndex) => (
                                    <div key={task._id} className="bg-gray-50 rounded p-3 text-sm">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <div className="flex justify-between mb-1">
                                            <span className="font-medium">{task.firstName}</span>
                                            <span className="text-gray-600">{task.phone}</span>
                                          </div>
                                          {task.notes && (
                                            <p className="text-gray-600 text-xs">{task.notes}</p>
                                          )}
                                        </div>
                                        <div className="flex space-x-1 ml-2">
                                          <button
                                            onClick={() => handleEditTask(task)}
                                            className="text-blue-600 hover:text-blue-800 p-1"
                                            title="Edit task"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                            title="Delete task"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        📊 Task Completion Analytics & Charts
                      </h3>
                      <p className="text-sm text-gray-600">
                        View detailed analytics, completion rates, agent performance, and visual charts for your task management data.
                      </p>
                    </div>
                  </div>
                  <TaskAnalytics />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </ProtectedRoute>
  );
}