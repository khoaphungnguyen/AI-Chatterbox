import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc, query,orderBy} from 'firebase/firestore';
import {db} from "@/firebase"

type Props = {
    id: string;
}

function ChatRow({id}: Props) {
    const pathName = usePathname()
    const router = useRouter()
    const {data: session} = useSession();
    const [active, setActive]= useState(false)

    const [messages] = useCollection(
        collection(db,"users", session?.user?.email!, "chats", id, 'messages')
    )

    const [oldMessage] = useCollection(session && query(
        collection(db,"users", session?.user?.email!, "chats", id,
        "messages"),orderBy("createAt", "asc")
      ))

  
    const removeChat = async() =>{
        try {
            oldMessage?.docs.map(async (item) => {
              const docRef = item.ref;
              await deleteDoc(docRef);
            });
          } catch (error) {
            console.error("Error deleting documents:", error);
          }
        await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id));
        router.replace('/');
    }

    useEffect(() =>{
        if (!pathName) return;
        setActive(pathName.includes(id));
    }, [pathName])

  return (
    <Link href={`/chat/${id}`} className={`rounded-lg px-5 py-3 text-sm items-center
    space-x-2 hover:bg-gray-700/70 cursor-pointer text-gray-300
    transition-all duration-200 ease-in-out flex justify-center ${active &&
    "bg-gray-700/50" }`}>
        <ChatBubbleLeftIcon className='h-5 w-5'/>
        <p className='flex-1 hidden md:inline-flex truncate'>
           {messages?.docs[messages?.docs.length -1]?.data().content || 
           "New Chat"}
        </p>
        <TrashIcon onClick={removeChat} className='h-5 w-5 text-gray-700 hover:text-red-700'/>
    </Link>
  )
}

export default ChatRow