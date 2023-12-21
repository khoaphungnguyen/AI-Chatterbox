"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const Providers = ({
  children,
  session,
}: React.PropsWithChildren<{ session: Session | null}>) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Providers
