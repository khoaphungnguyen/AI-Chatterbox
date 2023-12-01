'use client'

import { useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import MainTitle from '@/components/MainTitle';

import SuggestionsSection from '@/components/Suggestions';
import ThreadForm from '@/components/ThreadForm';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const { data: session } = useSession();
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-1106' });

    // Updated fetcher function
    const fetcher = async (url) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model:"gpt-3.5-turbo-1106" }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      return response.json(); // This line parses the JSON response body
    };
  
    // Updated useSWR hook
    const { data: suggestions, error: suggestionsError, isLoading } = useSWR(['/api/fetchSuggestions', model], 
      () => fetcher('/api/fetchSuggestions'), {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });
  // Parse suggestions and handle errors
  const parsedSuggestions = suggestions ? JSON.parse(suggestions) : [];
  //const parsedSuggestions = suggestions ? (suggestions) : [];
  const createNewThread = async () => {
    try {
      const response = await fetch('/api/createThread', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();
      router.push(`/thread/${data.threadId.id}`); 
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

  // Function to handle thread creation
  const sendMessage = async (event:  React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    const input = prompt.trim();
    setPrompt("");

    if (!session || !session.user || !session.user.email) {
      toast.error("You need to be logged in.");
      return;
    }
  
    try {

      const res = await fetch('/api/createThread', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Failed to create thread: ${res.statusText}`);
      }
      const data = await res.json();
      router.push(`/thread/${data.threadId.id}`)

      // const message = {
      //   "content": input,
      //   "createAt": serverTimestamp(),
      //   "user": {
      //     "_id": session.user.email,
      //     "name": session.user.name,
      //     "avatar": session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`,
      //     role: "user",
      //   },
      // };

      // await addDoc(collection(db, "users", session.user.email, "chats", doc.id, 'messages'), message);
      // const notification = toast.loading("SmartChat is thinking...");

      // const response = await fetch('/api/askQuestions', {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     messages: [{ role: 'user', content: input }],
      //     chatId: doc.id,
      //     model,
      //     session,
      //   }),
      // });

      // if (!response.ok) {
      //   const errorText = await response.text();
      //   throw new Error(`Error ${response.status}: ${errorText}`);
      // }
      // toast.success("SmartChat has responded", {
      //   id: notification,
      // });
      
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast.error("There was an issue starting the chat.");
    }
  };
return (
  <div className="flex flex-col h-full justify-between  text-gray-100 p-4">
    <Header model={model} />
    <MainTitle />
    <SuggestionsSection suggestions={parsedSuggestions} error={suggestionsError} loading={isLoading} setPrompt={setPrompt}  sendMessage={sendMessage} session={session}/>
    <ThreadForm prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage} session={session} />
  </div>
);
}