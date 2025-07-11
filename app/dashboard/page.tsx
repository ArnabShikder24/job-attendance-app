import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect based on role
  if (session.user.role === "admin") {
    redirect("/dashboard/admin")
  } else {
    redirect("/dashboard/staff")
  }
}
