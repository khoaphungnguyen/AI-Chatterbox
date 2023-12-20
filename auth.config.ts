import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/signin',
    newUser: '/signup',

  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith('/');
      const isSignUp = nextUrl.pathname.startsWith('/signup');
      if (isSignUp) {
       return true;
      } else
      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to signin page
      } else if (isLoggedIn) {
        console.log('User is already logged in, redirecting...');
        return Response.redirect(new URL('/signin', nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      // Add access_token to the token right after signin
      if (user) {
        console.log('user', user);
        token.accessToken = user.accessToken;
        token.refresh = user.refreshToken;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.refreshToken = token.refresh;
      session.id = token.id;
      session.name = token.name;
      return session;
    },
    
  },
  providers: [], 
} satisfies NextAuthConfig;