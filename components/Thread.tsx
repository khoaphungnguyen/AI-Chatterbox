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
    if (Array.isArray(data)) {
      return data;
    } else {
      throw new Error('Data is not an array');
    }
  });

function Thread({ id }: ThreadProps) {
  const { data: session } = useSession();
  const { data: initialMessages } = useSWR<ChatMessage[]>(`/api/getMessages/${id}`, fetcher);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamedMessage, setStreamedMessage] = useState('');

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    
    if (session) {
      const eventSource = new EventSource(`/api/getSSE/${id}`);
      let accumulatedStream = ''; // Accumulator for the streamed data

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received data: ", data); // Debugging log

        if (data.role === 'assistant') {
          // If the message is part of a stream, accumulate it
          accumulatedStream += data.content;

          // Identify the end of a message. This is an example and may need to be adjusted.
          if (data.content.endsWith('\n')) { // Assuming '\n' is the end of a message
            setMessages(prevMessages => [...prevMessages, {
              id: `assistant-${Date.now()}`,
              content: accumulatedStream,
              role: 'assistant',
              // ... (any other necessary fields)
            }]);
            accumulatedStream = ''; // Clear the accumulator
          }
        } else {
          // For user messages, add them immediately
          setMessages(prevMessages => [...prevMessages, data]);
        }
      };

      eventSource.onerror = (error: Event) => {
        console.error('EventSource failed:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [id, session, streamedMessage]);

  return (
    <div className='flex-1 overflow-y-scroll overflow-x-hidden'>
      {messages.map((message, index) => (
        <Message
          key={message.id || index}
          message={message}
        />
      ))}
      {/* If a message is being streamed, display it */}
      {streamedMessage && (
        <Message
          key="streamed-message"
          message={{
            id: 'streamed-message',
            content: streamedMessage,
            role: 'assistant',
            createdAt: new Date().toISOString()
          }}
        />
      )}
    </div>
  );
}

export default Thread;
