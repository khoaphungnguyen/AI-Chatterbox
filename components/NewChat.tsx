import { PlusIcon } from "@heroicons/react/24/outline"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import  {addDoc, collection, serverTimestamp} from "firebase/firestore"
import {db} from "@/firebase"

function NewChat() {
  const router = useRouter()
  const {data:session} = useSession();

  const createNewChat = async() => {
    const doc = await addDoc(collection(db, "users", session?.user?.email!, 'chats'),{
      userId: session?.user?.email!,
      createAt: serverTimestamp(),
    })

    router.push(`/chat/${doc.id}`)
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