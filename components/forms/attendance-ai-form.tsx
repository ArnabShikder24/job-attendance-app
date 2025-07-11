"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog"

interface ParsedAttendance {
  date: string
  timeIn: string
  timeOut: string
  taskSummary: string
  github?: string
}

export function AttendanceAIForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    timeRange: "",
    workDescription: "",
    githubUrl: "",
  })
  const [parsedData, setParsedData] = useState<ParsedAttendance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleAIParse = async () => {
    setError("")

    // Show coming soon message
    toast({
      title: "Coming Soon! 🚀",
      description: "AI-powered attendance processing will be available soon. Please use manual entry for now.",
    })
  }

  const handleConfirmSubmission = async () => {
    if (!parsedData) return

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: parsedData.date,
          timeIn: parsedData.timeIn,
          timeOut: parsedData.timeOut,
          summary: parsedData.taskSummary,
          githubUrl: parsedData.github,
          status: "present",
          mode: "auto",
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "AI-processed attendance submitted successfully",
        })
        // Reset form
        setFormData({
          date: new Date().toISOString().split("T")[0],
          timeRange: "",
          workDescription: "",
          githubUrl: "",
        })
        setParsedData(null)
        setShowConfirmation(false)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to submit attendance")
      }
    } catch (error) {
      setError("Something went wrong")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Attendance
          </CardTitle>
          <CardDescription>Describe your work in natural language and let AI structure it for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900 dark:text-blue-100">AI Processing Coming Soon!</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                We're working on integrating AI to automatically process your work descriptions. For now, please use the
                manual attendance entry option.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeRange">Time Range</Label>
                <Input
                  id="timeRange"
                  placeholder="e.g., 9 AM to 5:30 PM"
                  value={formData.timeRange}
                  onChange={(e) => handleInputChange("timeRange", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workDescription">Work Description</Label>
              <Textarea
                id="workDescription"
                placeholder="Describe what you worked on today in natural language. For example: 'I started at 9 AM and worked until 5:30 PM. I built the login API, fixed authentication bugs, and reviewed pull requests. I also had a team meeting from 2-3 PM.'"
                value={formData.workDescription}
                onChange={(e) => handleInputChange("workDescription", e.target.value)}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/repo/pull/123"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
              />
            </div>

            <Button onClick={handleAIParse} className="w-full" disabled={true}>
              <Sparkles className="mr-2 h-4 w-4" />
              Process with AI (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSubmission}
        parsedData={parsedData}
      />
    </>
  )
}
