import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


type Props = {
    id: string;
}

function ChatRow({id}: Props) {
    const pathName = usePathname()
    const router = useRouter()
    const {data: session} = useSession();
    const [active, setActive]= useState(false)
    const [messages, setMessages] = useState([]);

     // Fetching chat messages from Go backend
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/getThreads`);
      if (!response.ok) {
        console.error('Failed to fetch messages');
        return;
      }
      const data = await response.json();
      setMessages(data.messages); 
    };

    if (session?.user?.email) {
      fetchMessages();
    }
  }, [id, session?.user?.email]);

   // Remove chat using Go backend
  const removeChat = async () => {
    try {
      await fetch(`/api/deleteChat?chatId=${id}`, { method: 'DELETE' });
      router.replace('/');
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

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
        {/* {messages[messages.length - 1]?.data! || "New Chat"} */}
     "New Chat"
        </p>
        <TrashIcon onClick={removeChat} className='h-5 w-5 text-gray-700 hover:text-red-700'/>
    </Link>
  )
}

export default ChatRow