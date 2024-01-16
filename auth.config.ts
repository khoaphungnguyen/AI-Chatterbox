import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/signin',
    newUser: '/signup',

  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const expires = auth?.error;
      const isSignUp = nextUrl.pathname.startsWith('/signup');
      if (isSignUp) {
        return true;
      } else if (!isLoggedIn) {
        return false; // Redirect unauthenticated users to signin page
      } else if (isLoggedIn) {
        if (expires) {
          return false;
        }
        const redirectUrl = nextUrl.searchParams.get('callbackUrl') || '';
        // Redirect to callbackUrl if it exists
        if (nextUrl.searchParams.get('callbackUrl')) {
          return Response.redirect(redirectUrl)
        }
        return true
      }
    },
    async jwt({ token, user }) {
      const isSignIn = user ? true : false; 
      // Add access_token to the token right after signin
      if (isSignIn) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.name = user.name;
        token.expiresIn = user.expiresIn;
        token.email = user.email;
        token.role = user.role;
      // Add access_token to the token right after signup
      }  else{
        const time = Math.floor(Date.now() / 1000)
        const expiresIn = token.expiresIn
        // If access token has expired, try to update it
        if (expiresIn && expiresIn - time < 60 * 30) {
        const refresh = token.refreshToken;
          try {
          const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: refresh }),
              });
              if (!res.ok) {
                throw new Error();
              }            
              const newToken = await res.json();
              token.accessToken = newToken.accessToken as string;
              token.expiresIn = newToken.expiresIn;
            } catch (error) {
              token.error = "RefreshAccessTokenError"

            }
          }
      }     
     
        return token;
    },
    async session({ session, token }) {
      if (session) {
        session.accessToken = token.accessToken as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.error = token.error;    
        session.user.role = token.role;    
      }
      return session;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;