declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      teamId?: string
    }
  }

  interface User {
    role: string
    teamId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    teamId?: string
  }
}
