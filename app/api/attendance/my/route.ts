import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("attendance")
    const attendance = db.collection("attendance")

    const records = await attendance.find({ userId: session.user.id }).sort({ date: -1 }).limit(50).toArray()

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
    console.error("Fetch attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
