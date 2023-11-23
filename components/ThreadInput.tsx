'use client'

import React, { useState, FormEvent } from 'react';
import { useChat } from "@/app/context/ChatContext";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import ThreadForm from './ThreadForm';

type ThreadInputProps = {
    id: string;
};

function ThreadInput({ id }: ThreadInputProps) {
    const [prompt, setPrompt] = useState('');
    const { data: session } = useSession();
    const { addMessage } = useChat();
    
    const { data: model } = useSWR('model', {
        fallbackData: 'gpt-3.5-turbo-1106'
    });

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt) return;

        const notification = toast.loading("SmartChat is thinking...");

        try {
            await fetch(`/api/askQuestions/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: prompt.trim(),
                    model,
                }),
            });

            toast.success("SmartChat has responded", { id: notification });
            addMessage({ Content: prompt, Role: "user" });
            setPrompt('');
        } catch (error) {
            toast.error("An error occurred.", { id: notification });
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className=''>
            <ThreadForm session={session} prompt={prompt} setPrompt={setPrompt} sendMessage={sendMessage} />
            {/* <div className="hidden">
                <ModeSelection />
            </div> */}
        </div>
    );
}

export default ThreadInput;
