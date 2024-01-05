'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ThreadForm from './ThreadForm';
import useChatStore from "@/app/store/threadStore";
import { ChatMessage } from "@/typings";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from "next/navigation"; 

type ThreadInputProps = {
  id: string;
};

function ThreadInput({ id }: ThreadInputProps) {
  const [prompt, setPrompt] = useState('');
  const addMessage = useChatStore(state => state.addMessage);
  const { data: model } = useSWR('model', { fallbackData: 'llama2:13b-chat' });
  const { setIsStreaming } = useChatStore();
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    if (session && session.error) {
      router.push(`/api/auth/signin?callbackUrl=${pathname}`);
      console.log("Refresh token is invalid")
      return
    }
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
    <ThreadForm  prompt={prompt} setPrompt={setPrompt} sendMessage={() => sendMessage(prompt)}  />
  );
}

export default ThreadInput
