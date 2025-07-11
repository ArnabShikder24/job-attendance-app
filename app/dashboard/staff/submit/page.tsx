import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceForm } from "@/components/forms/attendance-form"
import { AttendanceAIForm } from "@/components/forms/attendance-ai-form"

export default function SubmitAttendance() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose between manual entry or AI-powered attendance submission.
          </p>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="ai">AI-Powered</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-6">
            <AttendanceForm />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <AttendanceAIForm />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
