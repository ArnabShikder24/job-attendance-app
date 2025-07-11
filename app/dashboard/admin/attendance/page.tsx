import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface AttendanceRecord {
  user: string;
  date: string;
  status: string;
}

async function getAttendanceData(): Promise<AttendanceRecord[]> {
  try {
    const res = await fetch("/api/attendance/all", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function TeamAttendancePage() {
  const data = await getAttendanceData();

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Team Attendance</h1>
        {data.length === 0 ? (
          <div>No attendance records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">{record.user}</td>
                    <td className="px-4 py-2 border">{record.date}</td>
                    <td className="px-4 py-2 border">{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 