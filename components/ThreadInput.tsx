'use client'

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ThreadForm from './ThreadForm';
import useSWR from 'swr';
import { ChatMessage } from "@/typings";

type ThreadInputProps = {
    id: string;
};

function ThreadInput({ id }: ThreadInputProps) {
    const [prompt, setPrompt] = useState('');
    const { data: session } = useSession();
    const { data: messages, mutate: mutateMessages } = useSWR<ChatMessage[]>(`/api/getMessages/${id}`);

    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        // Optimistically update the messages list
        const optimisticMessage: ChatMessage = {
            id: 'temp-id-' + Date.now(), // Temporary ID; 
            content: message,
            role: 'user',
            createdAt: new Date().toISOString(), // Temporary createdAt
          };
        mutateMessages([...(messages || []), optimisticMessage], false);
        setPrompt('');

        const notification = toast.loading("SmartChat is thinking...");

        try {
            const response = await fetch(`/api/askQuestions/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, model: 'gpt-3.5-turbo-1106' }),
            });

            if (response.ok) {
                toast.success("Done!!!", { id: notification });
            } else {
                // Handle errors here
                toast.error("Failed to send message.", { id: notification });
            }
        } catch (error) {
            toast.error("An error occurred.", { id: notification });
            console.error("Error sending message:", error);
        }
    };

    return (
        <div>
            <ThreadForm session={session} prompt={prompt} setPrompt={setPrompt} sendMessage={() => sendMessage(prompt)} />
        </div>
    );
}

export default ThreadInput;
