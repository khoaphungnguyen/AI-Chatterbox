import NextAuth from 'next-auth'
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from 'jsonwebtoken';

export const nextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   if (user) {
    //     const isNewUser = false; 
    //     if (isNewUser) {
    //       return '/auth/signup'; 
    //     }
    //   }
    //   return true; // Return true to allow sign-in
    // },
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?? ""
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          credentials: 'include', // Include credentials to handle cookies
        });

        const data = await res.json();
        const decoded = jwt.decode(data.accessToken) as { userId: string, fullName: string };

        if (res.ok && data) {
          return {
            id: decoded && decoded.userId || 'user-specific-id', // You need to ensure an 'id' is provided
            email : credentials?.email,
            name: decoded && decoded.fullName || "",      
            accessToken: data.accessToken,
            // refreshToken is handled via HTTP-only cookie
          };
        }
       
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions


export const handler = NextAuth(nextAuthOptions)

export {handler as GET, handler as POST}

