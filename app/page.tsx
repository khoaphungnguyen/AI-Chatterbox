'use client'

import { useState } from 'react';
import useSWR from 'swr';
import {  useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import { ChatMessage } from "@/typings";
import useChatStore from "@/app/store/threadStore";
import SuggestionsSection from '@/components/Suggestions';
import ThreadForm from '@/components/ThreadForm';
import { useSession } from 'next-auth/react';

export  default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const addMessage = useChatStore(state => state.addMessage);
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-1106' });
  const { setIsStreaming } = useChatStore();
  const { data: session } = useSession();
  const pathname = usePathname();
    // Updated fetcher function
    const fetcher = async (url: string) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: "gpt-3.5-turbo-1106" }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      return response.json(); 
    };
  
    const { data: suggestions, error: suggestionsError, isLoading } = useSWR(['/api/getSuggestions', model], 
      () => fetcher('/api/getSuggestions'), {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });
  // Parse suggestions and handle errors
  const parsedSuggestions = suggestions ? JSON.parse(suggestions) : [];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    if (session && session.error) {
      router.push(`/api/auth/signin?callbackUrl=${pathname}`);
      console.log("Refresh token is invalid")
      return
    }
    try {
      const response = await fetch('/api/createThread', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();
      router.push(`/thread/${data.threadId.id}`); 
      //Add delay to allow thread to be created
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsStreaming(true);
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: message,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
  
      addMessage(userMessage);
      setPrompt('');
  
      try {
        const response = await fetch(`/api/sendMessage/${data.threadId.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, model: model }),
        });
  
        if (!response.ok) { 
          toast.error("Failed to send message.");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`An error occurred: ${error.message}`);
        } else {
          toast.error("An error occurred.");
        } 
      }  finally{
        setIsStreaming(false);
      }
  
      return data.threadId.id;
    } catch (error) {
      // Narrow down the type to Error
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        // If it's not an Error instance, handle accordingly
        console.log('An unknown error occurred');
      } 
    }
  };

return (
    <div className="flex flex-col h-full justify-between text-gray-100 ">
      <Header />
      <div >
          <SuggestionsSection suggestions={parsedSuggestions} error={suggestionsError} loading={isLoading} sendMessage={sendMessage} />
          <ThreadForm prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage} />
      </div>
    </div>
  );
}