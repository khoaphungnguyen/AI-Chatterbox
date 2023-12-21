import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/signin',
    newUser: '/signup',

  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isSignUp = nextUrl.pathname.startsWith('/signup');
      if (isSignUp) {
       return true;
      } else if (!isLoggedIn) {
        return false; // Redirect unauthenticated users to signin page
      } else if (isLoggedIn) {
        const redirectUrl = nextUrl.searchParams.get('callbackUrl') || '';
        // Redirect to callbackUrl if it exists
        if (nextUrl.searchParams.get('callbackUrl')) {
          console.log("callback is called")
          return Response.redirect(redirectUrl)
        } 
        console.log("middleware is called")
        return true
       
      }
    },
    async jwt({ token, user }) {
      // Add access_token to the token right after signin
      if (user) {
       // console.log('user', user);
        token.accessToken = user.accessToken;
        token.refresh = user.refreshToken;
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add property to session, like an access_token from a provider.
      if (session && token )  {
        session.accessToken = token.accessToken as string;
        session.user.name = token.name;
      }

      return session;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;