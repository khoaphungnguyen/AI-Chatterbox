import { PlusIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation";
interface NewThreadProps {
  onNewThreadCreated: () => void; 
}

function NewThread({ onNewThreadCreated }: NewThreadProps) {
  const router = useRouter()
  const createNewThread = async () => {
    try {
      const response = await fetch('/api/createThread', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data)
      router.push(`/thread/${data.threadId.id}`); 
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
    onClick={createNewThread}
    className="flex items-center space-x-2 border border-gray-700 bg-blue-500/50 hover:bg-blue-600/50 text-white px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ease-in-out"
  >
    <PlusIcon className="h-6 w-6"/>
    <h1 className="text-lg font-semibold">New Thread</h1>
  </div>
  )
}

export default NewThread