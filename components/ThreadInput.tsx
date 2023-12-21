'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ThreadForm from './ThreadForm';
import useChatStore from "@/app/store/threadStore";
import { ChatMessage } from "@/typings";
import useSWR from 'swr';

type ThreadInputProps = {
  id: string;
};

function ThreadInput({ id }: ThreadInputProps) {
  const [prompt, setPrompt] = useState('');
  const addMessage = useChatStore(state => state.addMessage);
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-1106' });
  const { setIsStreaming } = useChatStore();
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
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
