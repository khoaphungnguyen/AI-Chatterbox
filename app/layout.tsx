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
    <html lang="en" className="h-full bg-gray-900">
          <body className="h-full">
        <SessionProvider session={session}>
          {!session ? (
            <Login /> 
          ) : (
            <div className="flex flex-col lg:flex-row min-h-screen">
              <div className="hidden lg:block lg:w-64 xl:w-80 bg-[#20232b] overflow-y-auto h-full">
                <SideBar />
              </div>
              <div className="flex-1 bg-gray-800 sm:h-screen">
                <ClientProvider />
                {children}      
                <Analytics />
              </div>
            </div>
           )} 
        </SessionProvider> 
      </body>
    </html>
  );
}
