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

    const { code } = await request.json()

    const client = await clientPromise
    const db = client.db("attendance")
    const teams = db.collection("teams")
    const users = db.collection("users")

    // Find team by code
    const team = await teams.findOne({ code: code.toUpperCase() })

    if (!team) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 400 })
    }

    // Update user's team
    await users.updateOne({ email: session.user.email }, { $set: { teamId: team._id.toString() } })

    return NextResponse.json({
      message: "Successfully joined team",
      teamName: team.name,
    })
  } catch (error) {
    console.error("Join team error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
