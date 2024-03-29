import "./globals.css";
import "@tldraw/tldraw/tldraw.css"
import SideBar from "@/components/SideBar";
import ClientProvider from "@/components/ClientProvider";
import Providers from "@/components/SessionProvider";
import {auth} from "@/auth"
import Navbar from "@/components/Navbar";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = await session?.user;

  return (
    <html lang="en" className="h-full ">
          <head>
          <link rel="icon" href="/favicon.svg" sizes="any" />  
          </head>
          <body className="h-full">
            <Providers session={session} >
            <div className="flex flex-col lg:flex-row min-h-screen">
              <div className="flex-1 min-h-screen ">
                {user?.role === "admin" ? <div><Navbar user={user!}/></div> : <div><SideBar /></div>}
                <ClientProvider />
                {children}      
              </div>
            </div>
            </Providers>
      </body>
    </html>
  );
}
