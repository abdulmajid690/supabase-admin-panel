import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Files, 
  HardDrive, 
  Activity,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Mock data for demonstration
const mockStats = {
  total_users: 1247,
  total_files: 3892,
  storage_used: 67.5,
  active_sessions: 89
}

const mockChartData = [
  { name: 'Jan', users: 400, files: 240 },
  { name: 'Feb', users: 300, files: 139 },
  { name: 'Mar', users: 200, files: 980 },
  { name: 'Apr', users: 278, files: 390 },
  { name: 'May', users: 189, files: 480 },
  { name: 'Jun', users: 239, files: 380 },
]

const mockRecentActivity = [
  { id: 1, user: 'john@example.com', action: 'Uploaded file', time: '2 minutes ago', type: 'upload' },
  { id: 2, user: 'sarah@example.com', action: 'Created account', time: '5 minutes ago', type: 'signup' },
  { id: 3, user: 'mike@example.com', action: 'Updated profile', time: '10 minutes ago', type: 'update' },
  { id: 4, user: 'emma@example.com', action: 'Deleted file', time: '15 minutes ago', type: 'delete' },
  { id: 5, user: 'alex@example.com', action: 'Signed in', time: '20 minutes ago', type: 'signin' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(mockStats)
  const [loading, setLoading] = useState(false)

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'Active users in the system'
    },
    {
      title: 'Total Files',
      value: stats.total_files.toLocaleString(),
      change: '+8%',
      changeType: 'positive',
      icon: Files,
      description: 'Files stored in the system'
    },
    {
      title: 'Storage Used',
      value: `${stats.storage_used}%`,
      change: '+3%',
      changeType: 'positive',
      icon: HardDrive,
      description: 'Of total storage capacity'
    },
    {
      title: 'Active Sessions',
      value: stats.active_sessions.toString(),
      change: '-2%',
      changeType: 'negative',
      icon: Activity,
      description: 'Currently active user sessions'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return '📁'
      case 'signup': return '👤'
      case 'update': return '✏️'
      case 'delete': return '🗑️'
      case 'signin': return '🔐'
      default: return '📋'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge 
                    variant={card.changeType === 'positive' ? 'default' : 'secondary'}
                    className="flex items-center space-x-1"
                  >
                    {card.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{card.change}</span>
                  </Badge>
                  <span>from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Charts */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              User and file growth over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="files" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Files"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest user actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="text-lg">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action}
                    </p>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>
            Current storage utilization across different file types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Images</span>
              <span>45% (2.1 GB)</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Documents</span>
              <span>30% (1.4 GB)</span>
            </div>
            <Progress value={30} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Videos</span>
              <span>20% (950 MB)</span>
            </div>
            <Progress value={20} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Other</span>
              <span>5% (240 MB)</span>
            </div>
            <Progress value={5} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}