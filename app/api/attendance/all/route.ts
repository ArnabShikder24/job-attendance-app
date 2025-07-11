import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("attendance")
    const attendance = db.collection("attendance")

    // Get all attendance records for the admin's team
    const records = await attendance
      .find({
        /* Add team filtering logic here */
      })
      .sort({ date: -1 })
      .limit(100)
      .toArray()

    const formattedRecords = records.map((record) => ({
      id: record._id.toString(),
      userId: record.userId,
      userName: record.userName,
      date: record.date.toISOString().split("T")[0],
      timeIn: record.timeIn,
      timeOut: record.timeOut,
      summary: record.summary,
      githubUrl: record.githubUrl,
      status: record.status,
      mode: record.mode,
    }))

    return NextResponse.json({ records: formattedRecords })
  } catch (error) {
    console.error("Fetch all attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
