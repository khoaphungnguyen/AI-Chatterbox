'use client'

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import MainTitle from '@/components/MainTitle';
import { ChatMessage } from "@/typings";
import useChatStore from "@/app/store/threadStore";

import SuggestionsSection from '@/components/Suggestions';
import ThreadForm from '@/components/ThreadForm';

export  default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const addMessage = useChatStore(state => state.addMessage);
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-1106' });
  const { setIsStreaming } = useChatStore();
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
  
    // Updated useSWR hook
    const { data: suggestions, error: suggestionsError, isLoading } = useSWR(['/api/fetchSuggestions', model], 
      () => fetcher('/api/fetchSuggestions'), {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
    });
  // Parse suggestions and handle errors
  const parsedSuggestions = suggestions ? JSON.parse(suggestions) : [];
  const createNewThread = async () => {
    try {
      const response = await fetch('/api/createThread', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();
      await router.push(`/thread/${data.threadId.id}`); 
      return data.threadId.id;
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
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    const id = await createNewThread();
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
      const response = await fetch(`/api/sendMessage/${id}`, {
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
  };

return (
  <div className="flex flex-col h-full justify-between  text-gray-100 p-4">
    <Header  />
    <MainTitle />
    <SuggestionsSection suggestions={parsedSuggestions} error={suggestionsError} loading={isLoading} sendMessage={sendMessage} />
    <ThreadForm prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage}  />
  </div>
);
}