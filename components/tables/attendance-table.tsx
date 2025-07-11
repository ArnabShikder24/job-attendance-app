"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Filter, Calendar } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  date: string
  timeIn?: string
  timeOut?: string
  summary?: string
  githubUrl?: string
  status: "present" | "absent" | "leave"
  mode: "manual" | "auto"
}

interface AttendanceTableProps {
  isAdmin?: boolean
}

export function AttendanceTable({ isAdmin = false }: AttendanceTableProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState("")

  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchTerm, statusFilter, dateFilter])

  const fetchAttendanceRecords = async () => {
    try {
      const endpoint = isAdmin ? "/api/attendance/all" : "/api/attendance/my"
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records)
      }
    } catch (error) {
      console.error("Failed to fetch attendance records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = records

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.summary?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter((record) => record.date === dateFilter)
    }

    setFilteredRecords(filtered)
  }

  const exportToCSV = () => {
    const headers = isAdmin
      ? ["Name", "Date", "Time In", "Time Out", "Status", "Summary", "Mode"]
      : ["Date", "Time In", "Time Out", "Status", "Summary", "Mode"]

    const csvData = filteredRecords.map((record) => {
      const row = isAdmin
        ? [
            record.userName,
            formatDate(record.date),
            record.timeIn ? formatTime(record.timeIn) : "-",
            record.timeOut ? formatTime(record.timeOut) : "-",
            record.status,
            record.summary || "-",
            record.mode,
          ]
        : [
            formatDate(record.date),
            record.timeIn ? formatTime(record.timeIn) : "-",
            record.timeOut ? formatTime(record.timeOut) : "-",
            record.status,
            record.summary || "-",
            record.mode,
          ]
      return row.join(",")
    })

    const csv = [headers.join(","), ...csvData].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      present: "default",
      absent: "destructive",
      leave: "secondary",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getModeBadge = (mode: string) => {
    return (
      <Badge variant={mode === "auto" ? "outline" : "secondary"} className="text-xs">
        {mode === "auto" ? "AI" : "Manual"}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {isAdmin ? "Team Attendance" : "My Attendance"}
        </CardTitle>
        <CardDescription>
          {isAdmin ? "View and manage team attendance records" : "Your attendance history and records"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isAdmin ? "Search by name or summary..." : "Search by summary..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-[180px]"
          />

          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Name</TableHead>}
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    {isAdmin && <TableCell className="font-medium">{record.userName}</TableCell>}
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.timeIn ? formatTime(record.timeIn) : "-"}</TableCell>
                    <TableCell>{record.timeOut ? formatTime(record.timeOut) : "-"}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{getModeBadge(record.mode)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={record.summary}>
                        {record.summary || "-"}
                      </div>
                      {record.githubUrl && (
                        <a
                          href={record.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          GitHub Link
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
