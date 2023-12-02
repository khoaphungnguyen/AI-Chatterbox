'use client'

import React, { useEffect, useState } from 'react';
import Message from './Message';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { ChatMessage } from "@/typings";

type ThreadProps = {
  id: string;
};

const fetcher = (url: string) => fetch(url)
  .then(res => res.json())
  .then(data => {
    // Ensure that data is an array
    if (Array.isArray(data)) {
      return data;
    } else {
      // Log and throw an error if data is not an array
      throw new Error('Data is not an array');
    }
  });

function Thread({ id }: ThreadProps) {
    const { data: session } = useSession();
    const { data: initialMessages } = useSWR<ChatMessage[]>(`/api/getMessages/${id}`, fetcher);
    const [messages, setMessages] = useState<ChatMessage[]>([]); 

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    useEffect(() => {
        if (session) {
            const eventSource = new EventSource(`/api/getSSE/${id}`);

            eventSource.onmessage = (event) => {
                try {
                    const newMessage: ChatMessage = JSON.parse(event.data);
                    console.log("SSE message", newMessage)
                    setMessages(prevMessages => {
                        // This check prevents the same message from being added twice
                        // const messageExists = prevMessages.some(msg => msg.id === newMessage.id);
                        return [...prevMessages, newMessage];
                    });
                } catch (e) {
                    console.error('Error parsing SSE data:', e);
                }
            };

            eventSource.onerror = (error: Event) => {
                console.error('EventSource failed:', error);
                eventSource.close();
            };

            // Clean up the event source when the component unmounts
            return () => {
                eventSource.close();
            };
        }
    }, [id, session]);

    if (!Array.isArray(messages)) {
        return <div>Messages are not available or not in the expected format.</div>;
    }

    return (
        <div className='flex-1 overflow-y-scroll overflow-x-hidden'>
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}
        </div>
    );
}

export default Thread;
