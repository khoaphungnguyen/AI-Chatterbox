import React, { useEffect, useState ,useCallback} from 'react'
import Link from 'next/link'
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';



type Props = {
  id: string;
  title: string;
  onDelete: () => void; // Add a callback prop to inform the parent about the deletion
};
function ChatRow({id, title, onDelete}: Props) {
    const pathName = usePathname()
    const router = useRouter()
    // const {data: session} = useSession();
    const [active, setActive]= useState(false)

   // Remove chat using Go backend
   const removeChat = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this chat?')) {
      return; // Early return if the user cancels the confirmation
    }

    try {
      const response = await fetch(`/api/deleteThread/${id}`, { method: 'DELETE' }); // Update the endpoint as necessary
      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }
      // Call the onDelete callback prop
       onDelete();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }, [id, onDelete]);

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
        {title && title || "New Chat"}
     
        </p>
        <TrashIcon onClick={removeChat} className='h-5 w-5 text-gray-700 hover:text-red-700'/>
    </Link>
  )
}

export default ChatRow