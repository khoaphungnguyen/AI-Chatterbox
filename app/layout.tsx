 import SessionProvider from "../components/SessionProvider";
 import { getServerSession } from "next-auth";
import "./globals.css";
import SideBar from "@/components/SideBar";
import Login from "@/components/Login"
import { nextAuthOptions } from "./api/auth/[...nextauth]/route";
import ClientProvider from "@/components/ClientProvider";
import { Analytics } from '@vercel/analytics/react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const session = await getServerSession(nextAuthOptions); 
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {!session ? (
            <Login /> 
          ) : (
            <div className="flex">
              <div className="bg-[#202123] h-screen overflow-y-auto max-w-0 sm:min-w-[10rem] md:min-w-[20rem]">
                <SideBar />
              </div>

              {/* ClientProvider - Toast */}
              <ClientProvider />
              <div className="bg-[#343541] flex-1">{children}</div>
              <Analytics />
            </div>
           )} 
        </SessionProvider> 
      </body>
    </html>
  );
}
