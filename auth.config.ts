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
      if (token)  {
        session.accessToken = token.accessToken ;
        session.refreshToken = token.refresh;
        session.user.id = token.id;
        session.user.name = token.name;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
    
  },
  providers: [], 
} satisfies NextAuthConfig;