import { PlusIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation";
interface NewChatProps {
  onNewThreadCreated: () => void; 
}

function NewChat({ onNewThreadCreated }: NewChatProps) {
  const router = useRouter()
  const createNewChat = async () => {
    try {
      const response = await fetch('/api/createThread', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();
      router.push(`/chat/${data.threadId}`); 
      if (onNewThreadCreated) {
        onNewThreadCreated();
      }
    } catch (error) {
      // Narrow down the type to Error
      if (error instanceof Error) {
        alert(error.message);
      } else {
        // If it's not an Error instance, handle accordingly
        alert('An unknown error occurred');
      } 
    }
  };
  
  return (
    <div
    onClick={createNewChat}
    className="flex items-center space-x-2 border border-gray-700 bg-blue-500/50 hover:bg-blue-600/50 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
  >
    <PlusIcon className="h-6 w-6"/>
    <h1 className="text-lg font-semibold">New Chat</h1>
  </div>
  )
}

export default NewChat