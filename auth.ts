import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connect } from "@/lib/db";
import { signJwtToken } from "@/lib/jwt";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Password does not match");
          } else {
            const { password, ...currentUser } = user._doc;
            const accessToken = signJwtToken(currentUser, { expiresIn: "7d" });

            return {
              ...currentUser,
              id: currentUser._id.toString(),
              _id: currentUser._id.toString(),
              accessToken,
            };
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token._id = user._id;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
});
