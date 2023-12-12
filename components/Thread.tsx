'use client'

import React, { useEffect } from 'react';
import Message from './Message';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { ChatMessage } from "@/typings";
import useChatStore from "@/app/store/threadStore"; // Adjust the import path

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
  const { data: initialMessages } = useSWR<ChatMessage[]>(`/api/getMessages/${id}`, fetcher,{
    revalidateOnFocus:false
  });

  const { messages, addMessage, isStreaming, setIsStreaming, error, reset } = useChatStore();

   // Reset the store when the thread ID changes
   useEffect(() => {
    reset();
  }, [id, reset]);


  useEffect(() => {
    if (initialMessages) {
      // Here, you might want to replace existing messages in the store
      // or handle the merging of messages differently depending on your needs
      initialMessages.forEach(message => addMessage(message));
    }
  }, [initialMessages]);

  useEffect(() => {
    if (session) {
      const eventSource = new EventSource(`/api/getSSE/${id}`);
      let accumulatedStream = '';

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
      
        // Check if the stream is starting or ending based on an empty content string.
     
          if (data.content === '' && accumulatedStream === '') {
            // Start of a new message stream.
            setIsStreaming(true); // Set streaming status to true when the stream starts.
          } else if (data.content === '' && accumulatedStream !== '') {
            // End of the current message stream.
            setIsStreaming(false); // Set streaming status to false when the stream ends.
            addMessage({
              id: `assistant-${Date.now()}`,
              content: accumulatedStream,
              role: 'assistant',
              // ... other necessary fields like createdAt
            });
            accumulatedStream = ''; // Clear the accumulator after adding the message.
          } else {
            // Accumulate the message content.
            accumulatedStream += data.content;
          }
      };
      

      eventSource.onerror = (errorEvent: Event) => {
        console.error('EventSource failed:', errorEvent);
        eventSource.close();
        // Update error state in zustand store
         useChatStore.setState({ error: 'Stream Error' });
      };

      return () => {
        eventSource.close();
        setIsStreaming(false);
      };;
    }
  }, [id, session, addMessage,setIsStreaming]);

  return (
    <div className='flex-1 overflow-y-scroll overflow-x-hidden'>
      {messages.map((message, index) => (
        <Message
          key={message.id || index}
          message={message}
        />
      ))}
      {/* Display an error message if needed */}
      {error && <div>Error: {error}</div>}
      {/* Display a loading or streaming indicator based on isStreaming */}
      {isStreaming && <div>Streaming messages...</div>}
    </div>
  );
}

export default Thread;
