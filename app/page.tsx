'use client'

import { useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { db } from '@/firebase';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
import Header from '@/components/Header';
import MainTitle from '@/components/MainTitle';

import SuggestionsSection from '@/components/Suggestions';
import ThreadForm from '@/components/ThreadForm';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const { data: session } = useSession();
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-0613' });

  // Fetcher function for SWR
  const fetcher = async ([url, model]: FetcherParams) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    });
  
    if (!response.ok) {
      // If the HTTP status code is not in the range 200-299, we throw an error
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response.json();
  };
  
  // SWR hook for fetching suggestions
  const { data: suggestions, error: suggestionsError, isLoading} = useSWR(['/api/fetchSuggestions', model], fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  
  // Parse suggestions and handle errors
  const parsedSuggestions = suggestions && typeof suggestions.answer === 'string'
  ? JSON.parse(suggestions.answer)
  : null;

  // Function to handle thread creation
  const sendMessage = async (event:  React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    const input = prompt.trim();
    setPrompt("");

    // Ensure the user is authenticated before trying to access their email
    if (!session || !session.user || !session.user.email) {
      toast.error("You need to be logged in.");
      return;
    }
    try {

      const doc = await addDoc(collection(db, "users", session?.user?.email!, 'chats'),{
        userId: session?.user?.email!,
        createAt: serverTimestamp(),
      })

      router.push(`/chat/${doc.id}`);

      const message = {
        "content": input,
        "createAt": serverTimestamp(),
        "user": {
          "_id": session.user.email,
          "name": session.user.name,
          "avatar": session.user.image || `https://ui-avatars.com/api/?name=${session.user.name}`,
          role: "user",
        },
      };

      await addDoc(collection(db, "users", session.user.email, "chats", doc.id, 'messages'), message);
      const notification = toast.loading("SmartChat is thinking...");

      const response = await fetch('/api/askQuestions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          chatId: doc.id,
          model,
          session,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      toast.success("SmartChat has responded", {
        id: notification,
      });

      
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast.error("There was an issue starting the chat.");
    }

    setPrompt("");
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