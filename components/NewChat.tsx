import { PlusIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation";

function NewChat() {
  const router = useRouter()
  const createNewChat = async() => {
    const response  = await fetch('/api/getThread')
    if (!response.ok) {
      throw new Error('Failed to create thread');
    }
    const data = await response.json();
    console.log('Thread ID:', data.threadId.id);
    router.push(`/chat/${data.threadId.id}`)
  }
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