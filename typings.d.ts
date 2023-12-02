import { Session } from 'next-auth';

import 'next-auth';

interface ChatMessage {
  content: string;
  role: string;
  createdAt?: string; 
}

declare module 'next-auth' {
  /**
   * Extends the built-in User type with custom properties
   */
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }

  // Extend the Session type
  interface Session {
    user: User; // Make sure the user in Session is of the extended User type
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the JWT type with custom properties
   */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}
