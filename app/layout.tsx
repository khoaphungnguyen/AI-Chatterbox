import "./globals.css";
import SideBar from "@/components/SideBar";
import ClientProvider from "@/components/ClientProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="h-full bg-gray-900">
          <head>
          < link className="text-red-500" rel="icon" href="/RapidSec.svg" sizes="any" />
          </head>
          <body className="h-full">
    
            <div className="flex flex-col lg:flex-row min-h-screen">
              
              <div className="flex-1 bg-gray-800 sm:h-screen">
                <SideBar />
                <ClientProvider />
                {children}      
              </div>
            </div>
      </body>
    </html>
  );
}
