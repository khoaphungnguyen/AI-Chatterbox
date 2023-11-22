'use client'

import { useSession, signOut } from "next-auth/react"
import NewChat from "./NewChat"
import ChatRow from "./ChatRow";
import ModeSelection from "./ModeSelection";
import Image from "next/image";
import {useState, useEffect} from "react"
import { Bars4Icon } from "@heroicons/react/20/solid";

function SideBar() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to manage sidebar visibility
  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/getThreads');
        if (!response.ok) {
          throw new Error('Failed to fetch threads');
        }
        const data = await response.json();
        console.log(data.data)
        setThreads(data.data); // Assuming the API returns an object with a threads array
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };

    if (session) {
      fetchThreads();
    }
  }, [session]);

  // Classes to control the sidebar appearance and transition
  const sidebarClasses = isOpen ? "translate-x-0 ease-out": "-translate-x-full ease-in";
    return (
      <>
      {isOpen && (
      <div
        className="fixed inset-0 z-20 transition-opacity bg-black opacity-50"
        onClick={toggleSidebar}
      />
    )}
    
    {isOpen ? (
      <div
        className={`fixed z-30 inset-y-0 left-0 lg:block lg:w-64 xl:w-80 overflow-hidden transition-all duration-300 ${sidebarClasses}`}
      >
          {/* Sidebar content */}
          <div className="flex flex-col h-screen p-4 overflow-y-auto bg-[#20232b]/50  shadow-md">
            {/* Sidebar main content */}
            <div className="flex-1">
              <NewChat />
              <div className="hidden">
                <ModeSelection />
              </div>
              <div className="flex flex-col space-y-2 my-2">
                {threads.map((thread) => (
                  <ChatRow key={thread.id} id={thread.id} />
                ))}
              </div>
            </div>
            
            {/* Logout Section */}
            {session && (
              <div className="flex items-center justify-center mx-auto mb-4 p-2 hover:bg-gray-700 rounded-lg transition-all duration-300 cursor-pointer shadow-md" onClick={() => signOut()}>
                <Image 
                  src={session.user?.image || ''} // Handle the case when image is undefined
                  alt="Profile" 
                  className="h-10 w-10 rounded-full mr-3 border-2 border-red-700"
                  width={40} // width and height should be consistent with the className styling
                  height={40}
                />
                <p className="text-red-700 font-semibold tracking-wide uppercase">Log out</p>
              </div>
            )}
          </div>
        </div>
    ):  (
      <button
        onClick={toggleSidebar}
        className="fixed z-40 top-0 left-0 p-4 text-white"
      >
        {/* Replace Bars4Icon with the actual icon component you are using */}
        <Bars4Icon className="w-6 h-6" />
      </button>
    )
}
</>
)}

export default SideBar