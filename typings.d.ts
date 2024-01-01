import NextAuth, { DefaultSession } from "next-auth"

interface ChatMessage {
  id: string;
  content: string;
  role: string;
  createdAt?: string;
  streamId?: string;
  isStreaming?: boolean;
}


declare module 'next-auth' {
  /**
   * Extends the built-in User type with custom properties
   */
  interface User {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
  // Extend the Session type
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"] // Make sure the user in Session is of the extended User type
    accessToken?: string;
    expiresIn?: number;
    error?: "RefreshAccessTokenError"

  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    id?: string;
    error?: "RefreshAccessTokenError"
  }
}
