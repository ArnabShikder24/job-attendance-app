import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, inviteCode } = await request.json()

    const client = await clientPromise
    const db = client.db("attendance")
    const users = db.collection("users")
    const teams = db.collection("teams")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    let teamId = null

    if (role === "admin") {
      // Create a new team for admin
      const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const team = await teams.insertOne({
        name: `${name}'s Team`,
        code: teamCode,
        createdBy: email,
        createdAt: new Date(),
      })
      teamId = team.insertedId.toString()
    } else if (role === "staff" && inviteCode) {
      // Find team by invite code
      const team = await teams.findOne({ code: inviteCode.toUpperCase() })
      if (team) {
        teamId = team._id.toString()
      }
    }

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      teamId,
      joinedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
