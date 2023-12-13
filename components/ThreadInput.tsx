'use client'

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
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
  const { data: session } = useSession();
  const addMessage = useChatStore(state => state.addMessage);
  const { data: model } = useSWR('model', { fallbackData: 'gpt-3.5-turbo-1106' });

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    setPrompt('');

    const notification = toast.loading("Sending message...");

    try {
      const response = await fetch(`/api/sendMessage/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, model: model }),
      });

      if (response.ok) {
        // If you need to handle the response, do so here
        toast.success("Message sent successfully!", { id: notification });
      } else {
        toast.error("Failed to send message.", { id: notification });
      }
    } catch (error) {
        if (error instanceof Error) {
          toast.error(`An error occurred: ${error.message}`, { id: notification });
          console.error("Error sending message:", error);
        } else {
          toast.error("An error occurred.", { id: notification });
          console.error("Error sending message:", error);
        }
    } 
  };

  return (
    <ThreadForm session={session} prompt={prompt} setPrompt={setPrompt} sendMessage={() => sendMessage(prompt)} />
  );
}

export default ThreadInput
