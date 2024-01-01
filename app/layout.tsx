import "./globals.css";
import SideBar from "@/components/SideBar";
import ClientProvider from "@/components/ClientProvider";
import Providers from "@/components/SessionProvider";
import {auth} from "@/auth"
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" className="h-full bg-gray-900">
          <head>
          <link rel="icon" href="/favicon.svg" type="image/svg" sizes="32x32" />     
      </head>
          <body className="h-full">
            <Providers session={session} >
              
            <div className="flex flex-col lg:flex-row min-h-screen">
              <div className="flex-1 bg-gray-800 sm:h-screen">
                <SideBar />
                <ClientProvider />
                {children}      
              </div>
            </div>
            </Providers>
      </body>
    </html>
  );
}
