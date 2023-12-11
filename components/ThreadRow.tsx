import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePathname ,useRouter} from 'next/navigation'; // Assuming usePathname is the correct hook
import toast from 'react-hot-toast';

type Props = {
  id: string;
  title: string;
  onDelete: () => void;
};


function ThreadRow({ id, title, onDelete }: Props) {
    const pathname = usePathname();
    const router = useRouter(); // This is a hypothetical hook based on your description
    const [active, setActive] = useState(false);
  

    const removeThread = useCallback(async () => {
      // Display toast with an action for confirmation
      toast(
        (t) => (
          <div className="flex justify-between">
            <span>Are you sure you want to delete this thread?</span>
            <div className="flex space-x-2">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    const response = await fetch(`/api/deleteThread/${id}`, { method: 'DELETE' });
                    if (!response.ok) {
                      throw new Error('Failed to delete thread');
                    }
                    onDelete();
                    toast.success('Thread deleted successfully');
                  } catch (error) {
                    if (error instanceof Error) {
                      toast.error(`Error: ${error.message}`);
                    } else {
                      toast.error('An unknown error occurred');
                    }
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ),
        { 
          id: 'deleteThreadToast',
          duration: Infinity,
          position: "top-left", // Position the toast in the bottom center
        }
      );
      
    }, [id, onDelete]);
    

  useEffect(() => {
    // Use pathname directly instead of router.asPath
    setActive(pathname.includes(id));
  }, [pathname, id]); // Include pathname in the dependency array
  return (
    <div className={`rounded-lg px-5 py-3 text-sm items-center
      space-x-2 hover:bg-gray-700/70 cursor-pointer text-gray-300
      transition-all duration-200 ease-in-out flex justify-between ${active &&
      "bg-gray-700/50"}`} onClick={() => router.push(`/thread/${id}`)}>
      <ChatBubbleLeftIcon className='h-5 w-5'/>
      <p className='flex-1 truncate'>
        {title || "New Thread"}
      </p>
      <TrashIcon onClick={(e) => {
        e.stopPropagation(); // Prevent Link navigation
        removeThread();
      }} className='h-5 w-5 text-gray-700 hover:text-red-700'/>
    </div>
  );
}

export default ThreadRow;
