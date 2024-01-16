"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Bars4Icon } from "@heroicons/react/20/solid";
import ThreadRow from "./ThreadRow";
import Avvvatars from "avvvatars-react";

import { signOut } from "@/components/SignOut";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
interface Thread {
  id: string;
  title: string;
  model: string;
}

export default function SideNav() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname(); // Initialize usePathname

  // Function to extract initials
  function getInitials(fullName: string) {
    const names = fullName.split(" ");
    const initials = names.map((name) => name[0]).join("");
    return initials;
  }

  const fetchThreads = async () => {
    try {
      const response = await fetch("/api/getThreads");
      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }
      const data = await response.json();
      setThreads(data.data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  // Call fetchThreads when the toggle button is pressed
  const handleToggleButtonClick = () => {
    if (!isOpen) {
      if (session && session.error) {
        router.push(`/api/auth/signin?callbackUrl=${pathname}`);
        console.log("Refresh token is invalid");
        return;
      }

      fetchThreads();
    }
    toggleSidebar();
  };

  const handleThreadDeletion = (threadId: string) => {
    setThreads((currentThreads) =>
      currentThreads.filter((thread) => thread.id !== threadId)
    );
  };

  // Classes to control the sidebar appearance and transition
  const sidebarClasses = isOpen
    ? "translate-x-0 ease-out"
    : "-translate-x-full ease-in";

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
          className={`fixed z-30 inset-y-0 left-0 w-1/2 sm:w-1/3  overflow-hidden transition-all duration-300 ${sidebarClasses}`}
        >
          {/* Sidebar content */}
          <div className="flex flex-col h-screen p-4 overflow-y-auto bg-[#20232b]/50  shadow-md">
            {/* Sidebar main content */}
            <div className="flex-1 ">
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 border w-full border-gray-700 bg-blue-500/50 hover:bg-blue-600/50 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
              >
                <PlusIcon className="h-6 w-6" />
                <h1 className=" font-semibold">New Thread</h1>
              </button>
              {/* <div className="hidden">
             <ModeSelection />
           </div> */}
              <div className="flex flex-col space-y-2 my-2 w-full">
                {threads &&
                  threads.map((thread) => (
                    <div key={thread.id}>
                      <ThreadRow
                        key={thread.id}
                        id={thread.id}
                        title={thread.title}
                        model={thread.model}
                        onDelete={() => handleThreadDeletion(thread.id)}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Logout Section */}
            {
              <div className="flex justify-center items-center">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await signOut();
                  }}
                  className="flex w-full"
                >
                  <button
                    className="flex h-[56px] items-center justify-center gap-2 
    rounded-md bg-gray-50 p-3 font-medium
    hover:bg-red-100 hover:text-red-600 max-w-md mx-auto md:p-2 md:px-3 shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                  >
                    {session?.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        className="h-10 w-10 rounded-full mr-3 border-2"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white font-semibold text-lg border-4 border-white shadow-lg">
                        <Avvvatars value={session?.user.name! } />
                      </div>
                    )}
                    <div className="block ">Sign Out</div>
                  </button>
                </form>
              </div>
            }
          </div>
        </div>
      ) : (
        session && (
          <button
            onClick={handleToggleButtonClick}
            className="fixed z-40 top-0 left-0 p-4 text-white"
          >
            <Bars4Icon className="w-6 h-6" />
          </button>
        )
      )}
    </>
  );
}
