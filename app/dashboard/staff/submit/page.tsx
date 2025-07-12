"use client";
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AttendanceForm } from "@/components/forms/attendance-form";
import { AttendanceAIForm } from "@/components/forms/attendance-ai-form";
import { AttendanceTable } from "@/components/tables/attendance-table";
import { Button } from "@/components/ui/button";

export default function SubmitAttendance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");

  // When a date is clicked, open the dialog
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  // For AttendanceForm, pass the selected date as a prop (if needed)
  // For now, AttendanceForm uses today's date by default, but you can enhance it to accept a date prop

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Submit Attendance</h1>
        {/* Calendar */}
        <div className="mb-8 bg-white dark:bg-gray-900 p-4 rounded shadow">
          <Calendar
            mode="single"
            selected={selectedDate}
            onDayClick={handleDayClick}
            className="mx-auto"
          />
        </div>
        
        {/* Dialog for attendance form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDate ? `Attendance for ${selectedDate.toLocaleDateString()}` : "Attendance"}
              </DialogTitle>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
              <TabsList className="w-full">
                <TabsTrigger value="manual" className="flex-1">Manual Entry</TabsTrigger>
                <TabsTrigger value="ai" className="flex-1">AI (Coming Soon)</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                {/* You can enhance AttendanceForm to accept a date prop */}
                <AttendanceForm />
              </TabsContent>
              <TabsContent value="ai">
                <AttendanceAIForm />
              </TabsContent>
            </Tabs>
            <DialogClose asChild>
              <Button variant="outline" className="mt-4 w-full">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* My Attendance Records */}
        <div className="mt-10">
          <AttendanceTable isAdmin={false} />
        </div>
      </div>
    </DashboardLayout>
  );
} 