  import NextAuth from 'next-auth'
  import type { NextAuthOptions } from "next-auth";
  import CredentialsProvider from "next-auth/providers/credentials";
  import GoogleProvider from "next-auth/providers/google";
  import jwt from 'jsonwebtoken';

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
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }
        if (token?.accessToken) {
          const decodedToken = jwt.decode(token.accessToken);
          const currentTime = Date.now() / 1000;
  
         // console.log("refreshToken", token.refreshToken)
          if (!decodedToken || decodedToken.exp < currentTime) {
            // If the token is expired, refresh it
            
            const refreshToken = async () => {
              const res =  await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  refreshToken: token.refreshToken,
                }),
              });
            
              const data = await res.json();
              if (res.ok && data) {
                return data.accessToken;
              }
            
              // Return null if new access token could not be retrieved
              return null;
            }
            const newAccessToken = await refreshToken();
            console.log("newAccessToken", newAccessToken)
            if (newAccessToken) {
              token.accessToken = newAccessToken;
            } 
            else {
              return Promise.resolve(null);
            }
          }
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
            credentials: 'include', // Include credentials to handle cookies
          });

          const user = await res.json();
          
          if (res.ok && user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
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

