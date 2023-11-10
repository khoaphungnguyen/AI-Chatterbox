'use client'

import { db } from '@/firebase'
import { collection, serverTimestamp, addDoc, orderBy, query  } from 'firebase/firestore'
import { useSession, } from 'next-auth/react'
import {useState, FormEvent} from 'react'
import toast from 'react-hot-toast'
import ModeSelection from './ModeSelection'
import useSWR from "swr"
import { useCollection } from 'react-firebase-hooks/firestore'
import ChatForm from './ChatForm'
type Props = {
    chatId: string
}

function ChatInput({chatId}:Props) {
    const [prompt, setPrompt] = useState(""); 
    const {data:session} = useSession()

    const { data: model} = useSWR('model',{
        fallbackData: 'gpt-3.5-turbo-0613'
    })

      const [oldMessage] = useCollection(session && query(
        collection(db,"users", session?.user?.email!, "chats", chatId,
        "messages"),orderBy("createAt", "asc")
      ))

    const sendMessage = async(e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        if (!prompt) return;
        const input = prompt.trim();
        setPrompt("")
        const message: Message = {
            "content": input,
            "createAt": serverTimestamp(),
            "user": {
                "_id": session?.user?.email!,
                "name": session?.user?.name!,
                "avatar": session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,
                "role":"user"
            }
        };

        await addDoc(collection(db, "users", session?.user?.email!, "chats", chatId, 'messages'),
         message)

        //Toast notificaiton to say Loading!
        const notificaiton = toast.loading("SmartChat is thinking...");

        const oldMessages = oldMessage?.docs.map(msg => {
            const data = msg.data()
            return {
                "role": data.user.role,
                "content": data.content
            };
            }) || [];

        const updatedMessages:ChatCompletionMessageParam[] = [...oldMessages, {"role":'user', "content": input}];
    
        await fetch('/api/askQuestions',{
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                messages: updatedMessages,
                chatId, 
                model, 
                session
            }),
         }).then(()=>{
            // Toast notification to say successful!
            toast.success("SmartChat has responded",{
                id:notificaiton,
            })
         });
    }


  return (
    <div className=''>
        <ChatForm session={session} prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage}/>
        <div className="hidden">
            <ModeSelection />
        </div>
    </div>
  )
}

export default ChatInput