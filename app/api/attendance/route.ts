import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { date, timeIn, timeOut, summary, githubUrl, status, mode } = await request.json()

    const client = await clientPromise
    const db = client.db("attendance")
    const attendance = db.collection("attendance")

    // Check if attendance already exists for this date
    const existingAttendance = await attendance.findOne({
      userId: session.user.id,
      date: new Date(date),
    })

    if (existingAttendance) {
      return NextResponse.json({ error: "Attendance already submitted for this date" }, { status: 400 })
    }

    const result = await attendance.insertOne({
      userId: session.user.id,
      userName: session.user.name,
      date: new Date(date),
      timeIn,
      timeOut,
      summary,
      githubUrl,
      status,
      mode: mode || "manual",
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Attendance submitted successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Attendance submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
