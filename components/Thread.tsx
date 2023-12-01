'use client'

import React, { useEffect } from 'react';
import { useChat } from "@/app/context/ChatContext";
import Message from './Message';
import { useSession } from 'next-auth/react';

type ThreadProps = {
  id: string;
};

function Thread({ id }: ThreadProps) {
    const { data: session } = useSession();
    const { messages, addMessage } = useChat();

    useEffect(() => {
      if (session) {
          const eventSource = new EventSource(`/api/getSSE/${id}`);
  
          eventSource.onmessage = (event) => {
              const newMessage = JSON.parse(event.data);
              addMessage(newMessage);
          };
  
          eventSource.onerror = (error) => {
              console.error('EventSource failed:', error);
              eventSource.close();
          };
  
          return () => eventSource.close();
      }
  }, [id, session, addMessage]);
  

    return (
        <div className='flex-1 overflow-y-scroll overflow-x-hidden'>
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}
        </div>
    );
}

export default Thread;
