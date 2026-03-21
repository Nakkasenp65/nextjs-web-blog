import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string
      accessToken?: string
    } & DefaultSession["user"]
  }
}
