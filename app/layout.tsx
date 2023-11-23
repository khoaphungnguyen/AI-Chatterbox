import SessionProvider from "../components/SessionProvider";
import { getServerSession } from "next-auth";
import "./globals.css";
import SideBar from "@/components/SideBar";
import { nextAuthOptions } from "./api/auth/[...nextauth]/route";
import ClientProvider from "@/components/ClientProvider";
import AuthForm from "@/components/AuthForm";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(nextAuthOptions); 
  return (
    <html lang="en" className="h-full bg-gray-900">
          <head>
          < link className="text-red-500" rel="icon" href="/RapidSec.svg" sizes="any" />
          </head>
          <body className="h-full">
        <SessionProvider session={session}>
          {!session ? (
            <AuthForm /> 
          ) : (
            <div className="flex flex-col lg:flex-row min-h-screen">
              
              <div className="flex-1 bg-gray-800 sm:h-screen">
                <SideBar />
                <ClientProvider />
                {children}      
              </div>
            </div>
         )}
        </SessionProvider> 
      </body>
    </html>
  );
}
