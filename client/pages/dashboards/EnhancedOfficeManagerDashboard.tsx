import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Calendar,
  Car,
  ShoppingCart,
  UserPlus,
  Search,
  TrendingUp,
  Bell,
  MessageSquare,
  Eye,
  UserCheck,
  Wrench,
  Timer,
  AlertCircle,
  Activity,
  Phone,
  Mail,
  MapPin,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import {
  JobCard,
  JobStatus,
  JobPriority,
  UserRole,
} from '@shared/types';

// Extended technician interface with real-time status
interface TechnicianStatus {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isActive: boolean;
  lastSeen: Date;
  currentStatus: 'available' | 'busy' | 'break' | 'offline';
  currentJobId?: string;
  currentJobTitle?: string;
  skillset: string[];
  completedJobsToday: number;
  hoursWorkedToday: number;
  efficiency: number; // percentage
}

// Communication message interface
interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'job_update' | 'approval_request' | 'system';
  jobCardId?: string;
  isRead: boolean;
}

// Mock data for enhanced dashboard
const mockTechnicians: TechnicianStatus[] = [
  {
    id: 'tech-1',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    phone: '+1234567892',
    isActive: true,
    lastSeen: new Date(),
    currentStatus: 'busy',
    currentJobId: 'JOB-2024-001',
    currentJobTitle: 'Oil Change - Toyota Camry',
    skillset: ['Engine Repair', 'Oil Changes', 'Brake Service'],
    completedJobsToday: 3,
    hoursWorkedToday: 6.5,
    efficiency: 95,
  },
  {
    id: 'tech-2',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    phone: '+1234567893',
    isActive: true,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    currentStatus: 'available',
    skillset: ['Tire Service', 'Brake Repair', 'Diagnostics'],
    completedJobsToday: 2,
    hoursWorkedToday: 4.0,
    efficiency: 88,
  },
  {
    id: 'tech-3',
    name: 'Tom Brown',
    email: 'tom@company.com',
    phone: '+1234567894',
    isActive: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    currentStatus: 'offline',
    skillset: ['Engine Diagnostics', 'Electrical', 'AC Service'],
    completedJobsToday: 1,
    hoursWorkedToday: 2.5,
    efficiency: 92,
  },
];

const mockActiveOrders: JobCard[] = [
  {
    id: '1',
    jobNumber: 'JOB-2024-001',
    title: 'Oil Change and Filter Replacement',
    description: 'Regular maintenance - change engine oil and oil filter',
    customerId: '1',
    customer: {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      customerType: 'individual',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedTechnicianId: 'tech-1',
    assignedTechnician: {
      id: 'tech-1',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: UserRole.TECHNICIAN,
      phone: '+1234567892',
      isActive: true,
      createdAt: new Date(),
      permissions: [],
    },
    createdBy: 'manager-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    scheduledStartDate: new Date(Date.now() - 60 * 60 * 1000),
    expectedCompletionDate: new Date(Date.now() + 30 * 60 * 1000),
    status: JobStatus.IN_PROGRESS,
    priority: JobPriority.NORMAL,
    tasks: ['Drain old oil', 'Replace oil filter', 'Add new oil', 'Check fluid levels'],
    laborEntries: [],
    materialsUsed: [],
    attachments: [],
    notes: ['Customer mentioned slight engine noise'],
    approvals: [],
    digitalSignatures: [],
    lastUpdatedBy: 'tech-1',
    lastUpdatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    jobNumber: 'JOB-2024-002',
    title: 'Brake Inspection',
    description: 'Customer reported squeaking noise when braking',
    customerId: '2',
    customer: {
      id: '2',
      name: 'ABC Company',
      email: 'contact@abc.com',
      phone: '+1234567891',
      company: 'ABC Corporation',
      customerType: 'business',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    assignedTechnicianId: 'tech-2',
    assignedTechnician: {
      id: 'tech-2',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: UserRole.TECHNICIAN,
      phone: '+1234567893',
      isActive: true,
      createdAt: new Date(),
      permissions: [],
    },
    createdBy: 'manager-1',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    scheduledStartDate: new Date(Date.now() + 30 * 60 * 1000),
    expectedCompletionDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: JobStatus.WAITING_APPROVAL,
    priority: JobPriority.HIGH,
    tasks: ['Inspect brake pads', 'Check brake fluid', 'Test brake performance'],
    laborEntries: [],
    materialsUsed: [],
    attachments: [],
    notes: ['Work completed, awaiting approval'],
    approvals: [
      {
        id: '1',
        type: 'completion',
        requestedBy: 'tech-2',
        approverRole: UserRole.OFFICE_MANAGER,
        status: 'pending',
        notes: 'Brake inspection completed, ready for review',
      },
    ],
    digitalSignatures: [],
    lastUpdatedBy: 'tech-2',
    lastUpdatedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    from: 'tech-1',
    to: 'manager-1',
    content: 'Customer mentioned engine noise during oil change. Should I investigate further?',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'message',
    jobCardId: 'JOB-2024-001',
    isRead: false,
  },
  {
    id: '2',
    from: 'tech-2',
    to: 'manager-1',
    content: 'Brake inspection completed. Job ready for approval.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'approval_request',
    jobCardId: 'JOB-2024-002',
    isRead: false,
  },
  {
    id: '3',
    from: 'system',
    to: 'manager-1',
    content: 'New customer John Smith added to system',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: 'system',
    isRead: true,
  },
];

export default function EnhancedOfficeManagerDashboard() {
  const { user } = useAuth();
  const [technicians, setTechnicians] = useState<TechnicianStatus[]>(mockTechnicians);
  const [activeOrders] = useState<JobCard[]>(mockActiveOrders);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianStatus | null>(null);
  const [showTechnicianDetails, setShowTechnicianDetails] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTechnicians(prev => 
        prev.map(tech => ({
          ...tech,
          lastSeen: tech.isActive ? new Date() : tech.lastSeen,
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Dashboard statistics
  const stats = {
    totalActiveOrders: activeOrders.length,
    awaitingApproval: activeOrders.filter(order => order.status === JobStatus.WAITING_APPROVAL).length,
    inProgress: activeOrders.filter(order => order.status === JobStatus.IN_PROGRESS).length,
    activeTechnicians: technicians.filter(tech => tech.isActive).length,
    totalTechnicians: technicians.length,
    todayRevenue: 2450.00,
    avgCompletionTime: 2.3,
    customerSatisfaction: 4.8,
    unreadMessages: messages.filter(msg => !msg.isRead).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'break': return 'bg-blue-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Working';
      case 'break': return 'On Break';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getJobStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.PENDING: return 'bg-gray-100 text-gray-800';
      case JobStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case JobStatus.WAITING_APPROVAL: return 'bg-yellow-100 text-yellow-800';
      case JobStatus.COMPLETED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: JobPriority) => {
    switch (priority) {
      case JobPriority.URGENT: return 'bg-red-100 text-red-800';
      case JobPriority.HIGH: return 'bg-orange-100 text-orange-800';
      case JobPriority.NORMAL: return 'bg-blue-100 text-blue-800';
      case JobPriority.LOW: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewTechnicianDetails = (technician: TechnicianStatus) => {
    setSelectedTechnician(technician);
    setShowTechnicianDetails(true);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Process Control Center</h1>
          <p className="text-gray-600">Central hub for managing all service operations and team coordination</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/orders/job-cards">
              <Plus className="h-4 w-4 mr-2" />
              New Job Card
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/customers/add">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalActiveOrders}</p>
                <p className="text-xs text-gray-500">{stats.inProgress} in progress</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Awaiting Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.awaitingApproval}</p>
                <p className="text-xs text-gray-500">Require your review</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Technicians</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeTechnicians}/{stats.totalTechnicians}</p>
                <p className="text-xs text-gray-500">Currently online</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-3xl font-bold text-purple-600">${stats.todayRevenue}</p>
                <p className="text-xs text-gray-500">+12% from yesterday</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Process Overview</TabsTrigger>
          <TabsTrigger value="technicians">
            Team Status
            {stats.unreadMessages > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {stats.unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approvals">
            Approvals
            {stats.awaitingApproval > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-white text-xs">
                {stats.awaitingApproval}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active-orders">Active Orders</TabsTrigger>
          <TabsTrigger value="communication">
            Messages
            {stats.unreadMessages > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                {stats.unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Process Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Today's Workflow Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Orders Created</span>
                      <span>8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Orders Completed</span>
                      <span>6/8</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span>{stats.customerSatisfaction}/5.0</span>
                    </div>
                    <Progress value={(stats.customerSatisfaction / 5) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex-col" asChild>
                    <Link to="/customers/search">
                      <Search className="h-5 w-5 mb-1" />
                      Find Customer
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col" asChild>
                    <Link to="/orders/job-cards">
                      <Plus className="h-5 w-5 mb-1" />
                      New Job Card
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col" asChild>
                    <Link to="/services/car">
                      <Car className="h-5 w-5 mb-1" />
                      Car Services
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col" asChild>
                    <Link to="/orders/completed">
                      <FileText className="h-5 w-5 mb-1" />
                      View Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      message.isRead ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-l-blue-500'
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      message.type === 'approval_request' ? 'bg-yellow-500' :
                      message.type === 'job_update' ? 'bg-blue-500' :
                      message.type === 'system' ? 'bg-gray-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{message.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {message.from !== 'system' ? `From: ${message.from}` : 'System'} • 
                          {format(message.timestamp, 'MMM dd, HH:mm')}
                        </p>
                        {message.jobCardId && (
                          <Badge variant="outline" className="text-xs">
                            {message.jobCardId}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!message.isRead && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markMessageAsRead(message.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Status Tab */}
        <TabsContent value="technicians" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Technician Status Board
              </CardTitle>
              <CardDescription>Real-time status of all technicians</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicians.map((technician) => (
                  <Card 
                    key={technician.id} 
                    className={`cursor-pointer transition-shadow hover:shadow-md ${
                      technician.isActive ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                    }`}
                    onClick={() => viewTechnicianDetails(technician)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={technician.avatar} />
                              <AvatarFallback>
                                {technician.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {/* Status Indicator */}
                            <div 
                              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                                getStatusColor(technician.currentStatus)
                              }`}
                              title={getStatusText(technician.currentStatus)}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{technician.name}</h3>
                            <p className="text-xs text-gray-600">{getStatusText(technician.currentStatus)}</p>
                          </div>
                        </div>
                        <Badge 
                          className={`text-xs ${
                            technician.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {technician.isActive ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                      
                      {technician.currentJobTitle && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                          <p className="font-medium">Current Job:</p>
                          <p className="text-blue-700">{technician.currentJobTitle}</p>
                        </div>
                      )}
                      
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-semibold">{technician.completedJobsToday}</p>
                          <p className="text-gray-600">Jobs</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{technician.hoursWorkedToday}h</p>
                          <p className="text-gray-600">Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{technician.efficiency}%</p>
                          <p className="text-gray-600">Efficiency</p>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Last seen: {format(technician.lastSeen, 'HH:mm')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Job cards waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              {activeOrders.filter(order => order.status === JobStatus.WAITING_APPROVAL).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No job cards pending approval at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeOrders
                    .filter(order => order.status === JobStatus.WAITING_APPROVAL)
                    .map((order) => (
                      <Card key={order.id} className="border-yellow-200 bg-yellow-50/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{order.jobNumber}</h3>
                                <Badge className={getPriorityColor(order.priority)}>
                                  {order.priority}
                                </Badge>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Awaiting Approval
                                </Badge>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">{order.title}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                                <div>Customer: {order.customer.name}</div>
                                <div>Technician: {order.assignedTechnician?.name}</div>
                                <div>Expected: {order.expectedCompletionDate ? format(new Date(order.expectedCompletionDate), 'MMM dd, HH:mm') : 'Not set'}</div>
                              </div>
                              {order.notes.length > 0 && (
                                <p className="text-sm text-gray-600 mb-2">
                                  <strong>Latest Note:</strong> {order.notes[order.notes.length - 1]}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/orders/job-cards?view=${order.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Orders Tab */}
        <TabsContent value="active-orders" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Active Orders Monitor
                  </CardTitle>
                  <CardDescription>Real-time tracking of ongoing work</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/orders/active">
                    View All Orders
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <Card key={order.id} className="border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{order.jobNumber}</h3>
                            <Badge className={getJobStatusColor(order.status)}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(order.priority)}>
                              {order.priority}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-2">{order.title}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {order.customer.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Wrench className="h-3 w-3" />
                              {order.assignedTechnician?.name || 'Unassigned'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Created: {format(new Date(order.createdAt), 'MMM dd')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              Due: {order.expectedCompletionDate ? format(new Date(order.expectedCompletionDate), 'MMM dd, HH:mm') : 'Not set'}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/orders/job-cards?view=${order.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Monitor
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Center
              </CardTitle>
              <CardDescription>Messages and updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`${
                      message.isRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              className={`text-xs ${
                                message.type === 'approval_request' ? 'bg-yellow-100 text-yellow-800' :
                                message.type === 'job_update' ? 'bg-blue-100 text-blue-800' :
                                message.type === 'system' ? 'bg-gray-100 text-gray-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {message.type.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(message.timestamp, 'MMM dd, HH:mm')}
                            </span>
                            {message.jobCardId && (
                              <Badge variant="outline" className="text-xs">
                                {message.jobCardId}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            From: {message.from === 'system' ? 'System' : message.from}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!message.isRead && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          {message.jobCardId && (
                            <Button size="sm" asChild>
                              <Link to={`/orders/job-cards?view=${message.jobCardId}`}>
                                View Job
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technician Details Modal */}
      <Dialog open={showTechnicianDetails} onOpenChange={setShowTechnicianDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Technician Details</DialogTitle>
          </DialogHeader>
          
          {selectedTechnician && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedTechnician.avatar} />
                    <AvatarFallback className="text-lg">
                      {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white ${
                      getStatusColor(selectedTechnician.currentStatus)
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedTechnician.name}</h3>
                  <p className="text-sm text-gray-600">{getStatusText(selectedTechnician.currentStatus)}</p>
                  <Badge className={selectedTechnician.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedTechnician.isActive ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{selectedTechnician.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{selectedTechnician.phone}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedTechnician.skillset.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold">{selectedTechnician.completedJobsToday}</p>
                  <p className="text-xs text-gray-600">Jobs Today</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedTechnician.hoursWorkedToday}h</p>
                  <p className="text-xs text-gray-600">Hours Worked</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedTechnician.efficiency}%</p>
                  <p className="text-xs text-gray-600">Efficiency</p>
                </div>
              </div>

              {selectedTechnician.currentJobTitle && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Current Assignment</h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">{selectedTechnician.currentJobTitle}</p>
                      <p className="text-xs text-gray-600">Job ID: {selectedTechnician.currentJobId}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Last seen: {format(selectedTechnician.lastSeen, 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
