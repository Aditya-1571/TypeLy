import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, syncUser } from "./userStore";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = (token.id as string) || (token.sub as string);
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        if (user.image) {
          token.picture = user.image;
        }
      }
      // If user logged in via OAuth or token doesn't have database id, ensure user is created in DB
      if (token.email) {
        try {
          const dbUserId = await syncUser({
            name: (token.name as string) || null,
            email: token.email,
            image: (token.picture as string) || null,
          });
          if (dbUserId) {
            token.id = dbUserId;
          }
        } catch (e) {
          console.warn("Could not sync user in jwt callback:", e);
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "typely-super-secret-key-32characters-minimum",
};
