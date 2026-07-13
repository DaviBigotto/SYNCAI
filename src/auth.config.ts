import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Will be implemented in auth.ts because it needs Prisma adapter
        // but here we just leave the skeleton and handle it in auth.ts
        // Actually, we can just return null and handle the real logic in auth.ts
        // OR we can implement it here if we pass the DB check. But auth.config doesn't have prisma.
        // For NextAuth v5 we can pass prisma to authorize in auth.ts
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
