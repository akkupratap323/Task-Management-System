'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  FileSpreadsheet, 
  Shield, 
  CheckCircle, 
  BarChart3, 
  Lock,
  ArrowRight,
  Building2,
  PlayCircle,
  Monitor,
  UserPlus,
  Upload,
  Eye,
  TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">TaskFlow Pro</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">v2.0</Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" onClick={() => document.getElementById('tutorial')?.scrollIntoView({ behavior: 'smooth' })}>
                <PlayCircle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tutorial</span>
                <span className="sm:hidden">Demo</span>
              </Button>
              <Link href="/auth">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden">
                  <Lock className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button size="sm">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              <span className="hidden sm:inline">Enterprise Task Management Solution</span>
              <span className="sm:hidden">Task Management</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Streamline Your 
              <span className="text-indigo-600"> Task Distribution</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Efficiently manage agents, distribute tasks from CSV uploads, and track progress 
              with our powerful workspace management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/auth?tab=register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need to Manage Tasks
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              From agent management to task distribution, we've got you covered with enterprise-grade features.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Agent Management</CardTitle>
                <CardDescription>
                  Create, manage, and organize your agents with role-based access control
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Workspace Isolation
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Secure Authentication
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time Updates
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">CSV Task Upload</CardTitle>
                <CardDescription>
                  Upload spreadsheets and automatically distribute tasks among agents
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Smart Distribution
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Excel/CSV Support
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Bulk Operations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Analytics & Tracking</CardTitle>
                <CardDescription>
                  Monitor progress and performance with detailed analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Task History
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Performance Metrics
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Progress Reports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Tutorial Section */}
      <section id="tutorial" className="py-12 sm:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4" variant="outline">
              <PlayCircle className="h-4 w-4 mr-2" />
              Interactive Tutorial
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              See TaskFlow Pro in Action
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Take a guided tour through our platform and discover how to manage agents, distribute tasks, and track progress - no login required!
            </p>
          </div>

          {/* Tutorial Steps */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-12">
            {/* Step 1: Admin Dashboard */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <CardTitle className="text-xl">Admin Dashboard Overview</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Explore the powerful admin interface where you manage your entire workspace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Monitor className="h-16 w-16 text-indigo-600 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Admin Dashboard Preview</p>
                    <p className="text-sm text-gray-500 mt-1">Clean, intuitive interface</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Manage multiple agents from one dashboard</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Real-time task distribution overview</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Quick access to analytics and reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 2: Agent Management */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <CardTitle className="text-xl">Agent Management</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Create and manage your team of agents with secure access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <UserPlus className="h-16 w-16 text-green-600 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Agent Creation Form</p>
                    <p className="text-sm text-gray-500 mt-1">Simple setup process</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Add agents with name, email, and phone</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Automatic password generation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Workspace isolation for security</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 3: CSV Upload */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <CardTitle className="text-xl">CSV Task Upload</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Upload spreadsheets and watch tasks get automatically distributed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-16 w-16 text-purple-600 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Drag & Drop Upload</p>
                    <p className="text-sm text-gray-500 mt-1">CSV, XLS, XLSX support</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Smart distribution algorithm</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Support for FirstName, Phone, Notes columns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Instant task assignment to agents</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Step 4: Agent View */}
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <CardTitle className="text-xl">Agent Dashboard</CardTitle>
                </div>
                <CardDescription className="text-base">
                  See how agents view and complete their assigned tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <Eye className="h-16 w-16 text-orange-600 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Agent Task View</p>
                    <p className="text-sm text-gray-500 mt-1">Clean, focused interface</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>View assigned tasks with contact details</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>One-click task completion</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span>Progress tracking and status updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Preview */}
          <Card className="border-0 shadow-xl mb-8">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <CardTitle className="text-2xl">Advanced Analytics</CardTitle>
              </div>
              <CardDescription className="text-base">
                Comprehensive analytics dashboard with charts, performance metrics, and completion tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
                <TrendingUp className="h-20 w-20 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Analytics Dashboard</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">📊</div>
                    <div className="text-sm text-gray-600 mt-1">Task Completion Charts</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">📈</div>
                    <div className="text-sm text-gray-600 mt-1">Agent Performance</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">📋</div>
                    <div className="text-sm text-gray-600 mt-1">Progress Reports</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">⏱️</div>
                    <div className="text-sm text-gray-600 mt-1">Timeline Tracking</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial CTA */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Ready to Experience TaskFlow Pro?
              </h3>
              <p className="text-gray-600 mb-6">
                Start your free trial and see how easy task management can be. No credit card required!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link href="/auth?tab=register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">
                Sign up and create your secure workspace with admin privileges
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Agents</h3>
              <p className="text-gray-600">
                Create agent profiles with login credentials for your team members
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload & Distribute</h3>
              <p className="text-gray-600">
                Upload your CSV files and watch tasks get automatically distributed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 mb-6 sm:mb-8 px-4 sm:px-0">
              Join thousands of organizations already using TaskFlow Pro to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link href="/auth?tab=register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  Start Your Free Trial
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-white text-white hover:bg-white hover:text-indigo-600">
                  Sign In
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-semibold text-white">TaskFlow Pro</span>
            </div>
            <div className="text-sm">
              © 2024 TaskFlow Pro. All rights reserved. Built with Next.js & ShadCN UI.
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-sm text-gray-500">
            <p>Enterprise-grade task management and agent distribution system.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
