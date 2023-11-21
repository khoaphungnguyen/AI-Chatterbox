import NextAuth from 'next-auth'
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {jwtDecode} from 'jwt-decode';

type DecodedToken = {
  exp?: number;
  // ... other token properties ...
};

export const nextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      // No need to handle refreshToken here as it's an HTTP-only cookie
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
        const res = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          credentials: 'include', // Include credentials to handle cookies
        });
      

        const data = await res.json();
        if (res.ok && data) {
          return {
            id: 'user-specific-id', // You need to ensure an 'id' is provided
            name: 'User Name',      // Replace with actual data if available
            email: credentials?.email,
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

