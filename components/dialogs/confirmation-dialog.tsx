"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, FileText, Github, CheckCircle } from "lucide-react"

interface ParsedAttendance {
  date: string
  timeIn: string
  timeOut: string
  taskSummary: string
  github?: string
}

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  parsedData: ParsedAttendance | null
}

export function ConfirmationDialog({ isOpen, onClose, onConfirm, parsedData }: ConfirmationDialogProps) {
  if (!parsedData) return null

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Confirm AI-Processed Attendance
          </DialogTitle>
          <DialogDescription>Please review the AI-processed attendance data before submitting.</DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processed Attendance Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(parsedData.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Working Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(parsedData.timeIn)} - {formatTime(parsedData.timeOut)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Task Summary</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">{parsedData.taskSummary}</p>
              </div>
            </div>

            {parsedData.github && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">GitHub Reference</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {parsedData.github}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Edit & Reprocess
          </Button>
          <Button onClick={onConfirm}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
