import NextAuth from 'next-auth'
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const nextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?? ""
    }),
    // CredentialsProvider({
    //   name: "Sign in",
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "example@example.com",
    //     },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const user = { id: "1", name: "Admin", email: "admin@admin.com" };
    //     return user;
    //   },
    // }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions


export const handler = NextAuth(nextAuthOptions)

export {handler as GET, handler as POST}

