  import NextAuth from 'next-auth'
  import type { NextAuthOptions } from "next-auth";
  import CredentialsProvider from "next-auth/providers/credentials";
  import GoogleProvider from "next-auth/providers/google";

  const refreshToken = async (token:string) => {
    const res =  await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        refreshToken: token,
      }),
    });
  
    const data = await res.json();
    if (res.ok && data) {
      return data;
    }
  
    // Return null if new access token could not be retrieved
    return null;
  }

  export const nextAuthOptions = {
    session: {
      strategy: "jwt",
      maxAge: 2 * 60, 
    },
    callbacks: {
      async jwt({ token, user}) {
        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.expiresIn = user.expiresIn;
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        } 
        return token;
      },
      async session({ session, token }) {
        if (!token || token.expiresIn === undefined || token.refreshToken === undefined) {
          throw new Error('Token is required');
        }
        const currentTime = Math.floor(Date.now() / 1000);
        console.log("token: ",new Date(token.expiresIn * 1000)); // Convert to Date object
        console.log("Now: ", new Date(currentTime * 1000)); 
        if (token.expiresIn < currentTime) {
          const newToken = await refreshToken(token.refreshToken);
          if (newToken) {
           // console.log(newToken)
            token.accessToken = newToken.accessToken;
            token.expiresIn = newToken.expiresIn;
          } else {
            throw new Error('Could not refresh token');
          }
        }
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
        name: "Credentials",
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
          });

          const user = await res.json();
          
          if (res.ok && user) {
            return {
              id: user.id,
              name: user.name,
              expiresIn: user.expiresIn,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
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

