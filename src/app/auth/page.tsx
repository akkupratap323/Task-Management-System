'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  UserCheck,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from "sonner";

function AuthPageContent() {
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  });
  const [agentForm, setAgentForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    admin: '',
    agent: '',
    register: ''
  });
  const [loading, setLoading] = useState({
    admin: false,
    agent: false,
    register: false
  });
  const [showPassword, setShowPassword] = useState({
    admin: false,
    agent: false,
    register: false,
    confirm: false
  });

  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'admin';

  useEffect(() => {
    console.log('🔍 Auth: isAuthenticated:', isAuthenticated, 'user:', user);
    if (isAuthenticated && user) {
      console.log('🔍 Auth: Redirecting based on role:', user.role);
      if (user.role === 'agent') {
        router.push('/agent-dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, admin: '' }));
    setLoading(prev => ({ ...prev, admin: true }));

    console.log('🔍 Auth: Admin login attempt:', { email: adminForm.email });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm)
      });

      const data = await response.json();
      console.log('🔍 Auth: Admin login response:', { status: response.status, success: data.success });

      if (data.success) {
        console.log('✅ Auth: Admin login successful, redirecting to dashboard');
        login(data.token, data.user);
        toast.success("🎉 Welcome back, Admin!", {
          description: "Successfully logged in to your dashboard",
          duration: 4000,
        });
        router.push('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, admin: data.error || 'Login failed' }));
        toast.error("❌ Login failed", {
          description: data.error || 'Please check your credentials',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('❌ Auth: Admin login error:', error);
      setErrors(prev => ({ ...prev, admin: 'An error occurred during login' }));
    } finally {
      setLoading(prev => ({ ...prev, admin: false }));
    }
  };

  const handleAgentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, agent: '' }));
    setLoading(prev => ({ ...prev, agent: true }));

    console.log('🔍 Auth: Agent login attempt:', { email: agentForm.email });

    try {
      const response = await fetch('/api/auth/agent-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentForm)
      });

      const data = await response.json();
      console.log('🔍 Auth: Agent login response:', { status: response.status, success: data.success });

      if (data.success) {
        console.log('✅ Auth: Agent login successful, redirecting to agent dashboard');
        login(data.token, data.agent);
        toast.success("🎉 Welcome back, Agent!", {
          description: `Hello ${data.agent.name}, ready to work on your tasks?`,
          duration: 4000,
        });
        router.push('/agent-dashboard');
      } else {
        setErrors(prev => ({ ...prev, agent: data.error || 'Login failed' }));
        toast.error("❌ Agent login failed", {
          description: data.error || 'Please check your credentials',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('❌ Auth: Agent login error:', error);
      setErrors(prev => ({ ...prev, agent: 'An error occurred during login' }));
    } finally {
      setLoading(prev => ({ ...prev, agent: false }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(prev => ({ ...prev, register: '' }));

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrors(prev => ({ ...prev, register: 'Passwords do not match' }));
      return;
    }

    if (registerForm.password.length < 6) {
      setErrors(prev => ({ ...prev, register: 'Password must be at least 6 characters long' }));
      return;
    }

    setLoading(prev => ({ ...prev, register: true }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password
        })
      });

      const data = await response.json();

      if (data.success) {
        login(data.token, data.user);
        toast.success("🎉 Account created successfully!", {
          description: "Welcome to TaskFlow Pro! Your workspace is ready",
          duration: 4000,
        });
        router.push('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, register: data.error || 'Registration failed' }));
        toast.error("❌ Registration failed", {
          description: data.error || 'Please try again with different details',
          duration: 4000,
        });
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, register: 'An error occurred during registration' }));
    } finally {
      setLoading(prev => ({ ...prev, register: false }));
    }
  };

  const handleFormChange = (form: string, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (form === 'admin') {
      setAdminForm(prev => ({ ...prev, [field]: value }));
    } else if (form === 'agent') {
      setAgentForm(prev => ({ ...prev, [field]: value }));
    } else if (form === 'register') {
      setRegisterForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const togglePasswordVisibility = (form: string, field: string = 'main') => {
    const key = form === 'register' && field === 'confirm' ? 'confirm' : form;
    setShowPassword(prev => ({ ...prev, [key as keyof typeof prev]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow Pro</h1>
          </div>
          <p className="text-gray-600">Access your workspace</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sm:inline">Admin</span>
                </TabsTrigger>
                <TabsTrigger value="agent" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sm:inline">Agent</span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sm:inline">Register</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="mb-2">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Portal
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Manage agents and distribute tasks
                  </p>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@company.com"
                        value={adminForm.email}
                        onChange={handleFormChange('admin', 'email')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-password"
                        type={showPassword.admin ? "text" : "password"}
                        placeholder="Enter your password"
                        value={adminForm.password}
                        onChange={handleFormChange('admin', 'password')}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('admin')}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.admin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {errors.admin && (
                    <div className="text-red-600 text-sm text-center">{errors.admin}</div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading.admin}
                    size="lg"
                  >
                    {loading.admin ? 'Signing in...' : 'Sign in as Admin'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="agent" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <Badge variant="secondary" className="mb-2">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Agent Portal
                  </Badge>
                  <p className="text-sm text-gray-600">
                    View your assigned tasks
                  </p>
                </div>
                <form onSubmit={handleAgentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="agent-email"
                        type="email"
                        placeholder="agent@company.com"
                        value={agentForm.email}
                        onChange={handleFormChange('agent', 'email')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agent-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="agent-password"
                        type={showPassword.agent ? "text" : "password"}
                        placeholder="Enter your password"
                        value={agentForm.password}
                        onChange={handleFormChange('agent', 'password')}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('agent')}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.agent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {errors.agent && (
                    <div className="text-red-600 text-sm text-center">{errors.agent}</div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading.agent}
                    size="lg"
                    variant="secondary"
                  >
                    {loading.agent ? 'Signing in...' : 'Sign in as Agent'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <Badge variant="default" className="mb-2">
                    <User className="h-3 w-3 mr-1" />
                    Create Admin Account
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Get admin privileges for your workspace
                  </p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@company.com"
                        value={registerForm.email}
                        onChange={handleFormChange('register', 'email')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword.register ? "text" : "password"}
                        placeholder="Create a password (min 6 chars)"
                        value={registerForm.password}
                        onChange={handleFormChange('register', 'password')}
                        className="pl-10 pr-10"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('register')}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.register ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-confirm"
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerForm.confirmPassword}
                        onChange={handleFormChange('register', 'confirmPassword')}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('register', 'confirm')}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {errors.register && (
                    <div className="text-red-600 text-sm text-center">{errors.register}</div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading.register}
                    size="lg"
                  >
                    {loading.register ? 'Creating Account...' : 'Create Admin Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">Need help?</p>
              <div className="flex justify-center space-x-4">
                <span>👨‍💼 Admin: Manage workspace</span>
                <span>👤 Agent: View tasks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 TaskFlow Pro. Secure & Reliable.</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}