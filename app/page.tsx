'use client'

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import MainTitle from '@/components/MainTitle';

import SuggestionsSection from '@/components/Suggestions';
import ThreadForm from '@/components/ThreadForm';

export  default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-1106' });

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
  
    try {

      const res = await fetch('/api/createThread', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Failed to create thread: ${res.statusText}`);
      }
      const data = await res.json();
      router.push(`/thread/${data.threadId.id}`)
    } catch (error) {
      console.error("Failed to create new chat:", error);
      toast.error("There was an issue starting the chat.");
    }
  };
return (
  <div className="flex flex-col h-full justify-between  text-gray-100 p-4">
    <Header model={model} />
    <MainTitle />
    <SuggestionsSection suggestions={parsedSuggestions} error={suggestionsError} loading={isLoading} setPrompt={setPrompt}  sendMessage={sendMessage} />
    <ThreadForm prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage}  />
  </div>
);
}