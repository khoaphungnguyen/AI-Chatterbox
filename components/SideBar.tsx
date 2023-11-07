'use client'

import { useSession, signOut } from "next-auth/react"
import NewChat from "./NewChat"
import {useCollection} from "react-firebase-hooks/firestore"
import { collection, orderBy,query } from "firebase/firestore";
import {db} from "@/firebase"
import ChatRow from "./ChatRow";
import ModeSelection from "./ModeSelection";

function SideBar() {
  const {data:session} = useSession();
  const [chats, loading, error] = useCollection(
    session && query(collection(db, "users", session?.user?.email!, "chats")
  , orderBy("createAt", "asc")));

  return (
    <div className="flex p-2 flex-col h-screen">
      <div className="flex-1">
        <div>
          <NewChat />
          <div className="hidden sm:inline">
          <ModeSelection />
          </div>
          {loading && (
            <div className="animate-pulse text-center text-white">
              <p>Loading Chats...</p>
            </div>
          )}
          <div className="flex flex-col space-y-2 my-2">
          {chats?.docs.map(chat =>(
            <ChatRow key={chat.id} id={chat.id} />
          ))}
          </div>
        
        </div>
      </div>
      {session && (
      <div className="flex items-center justify-center mx-auto mb-4 p-2 hover:bg-gray-700 rounded-lg transition-all duration-300 cursor-pointer shadow-md" onClick={() => signOut()}>
   <img 
       src={session.user?.image!} 
       alt="Profile" 
       className="h-10 w-10 rounded-full mr-3 border-2 border-red-700"
   />
   <p className="text-red-700 font-semibold tracking-wide uppercase">Log out</p>
</div>
      ) }
    </div>
  )
}

export default SideBar