import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/signup',

  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/');
      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log('User is already logged in, redirecting...');
        return Response.redirect(new URL('/login', nextUrl).searchParams.append('callbackUrl', nextUrl.href));
      }
      return true;
    },
    
  },
  providers: [], 
} satisfies NextAuthConfig;