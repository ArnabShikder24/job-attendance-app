import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default async function StaffDashboard() {
  const session = await getServerSession(authOptions)

  // Mock data - replace with actual database queries
  const stats = {
    attendanceThisMonth: 22,
    totalWorkingDays: 25,
    avgCheckInTime: "9:15 AM",
    attendanceRate: 88,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {session?.user?.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your attendance and manage your work schedule.</p>
          </div>

          <Link href="/dashboard/staff/submit">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Submit Attendance
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceThisMonth}</div>
              <p className="text-xs text-muted-foreground">Days attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Working Days</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkingDays}</div>
              <p className="text-xs text-muted-foreground">Total this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Check-in</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgCheckInTime}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your latest attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Today</p>
                    <p className="text-xs text-muted-foreground">9:00 AM - 5:30 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Present</p>
                  <p className="text-xs text-muted-foreground">8.5 hours</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Yesterday</p>
                    <p className="text-xs text-muted-foreground">8:45 AM - 5:15 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Present</p>
                  <p className="text-xs text-muted-foreground">8.5 hours</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">July 9, 2025</p>
                    <p className="text-xs text-muted-foreground">Leave taken</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-600">Leave</p>
                  <p className="text-xs text-muted-foreground">Personal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
