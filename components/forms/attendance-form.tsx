"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AttendanceForm() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    timeIn: "",
    timeOut: "",
    summary: "",
    githubUrl: "",
    status: "present",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          mode: "manual",
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Attendance submitted successfully",
        })
        // Reset form
        setFormData({
          date: new Date().toISOString().split("T")[0],
          timeIn: "",
          timeOut: "",
          summary: "",
          githubUrl: "",
          status: "present",
        })
      } else {
        const data = await response.json()
        setError(data.error || "Failed to submit attendance")
      }
    } catch (error) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Manual Attendance Entry
        </CardTitle>
        <CardDescription>Fill in your attendance details manually</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.status === "present" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeIn">Time In</Label>
                <Input
                  id="timeIn"
                  type="time"
                  value={formData.timeIn}
                  onChange={(e) => handleInputChange("timeIn", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeOut">Time Out</Label>
                <Input
                  id="timeOut"
                  type="time"
                  value={formData.timeOut}
                  onChange={(e) => handleInputChange("timeOut", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="summary">Work Summary</Label>
            <Textarea
              id="summary"
              placeholder="Describe what you worked on today..."
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              rows={4}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Attendance
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
