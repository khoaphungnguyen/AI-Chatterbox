'use client'

import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useSWR from 'swr';
import useChatStore from '@/app/store/threadStore';
import { ChatMessage } from '@/typings';

type ThreadProps = {
  id: string;
};

const fetcher = async (url: string): Promise<ChatMessage[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error('Data is not an array');
  }
  return data;
};

const Thread: React.FC<ThreadProps> = ({ id }) => {
  const { data: initialMessages } = useSWR<ChatMessage[]>(`/api/getMessages/${id}`, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const { messages, addMessage, isStreaming, setIsStreaming, error, reset } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    reset();

    if (initialMessages) {
      initialMessages.forEach((message) => {
        if (!messages.some((m) => m.id === message.id)) {
          addMessage(message);
        }
      });
    }
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, id]);

  useEffect(() => {
    const setupSSE = () => {
      const eventSource = new EventSource(`/api/getStream/${id}`);
      let currentStreamId: string | null = null;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('SSE data:', data);
        if (data.content === '' && currentStreamId) {
          setIsStreaming(false);
          currentStreamId = null;
        } else if (!currentStreamId) {
          setIsStreaming(true);
          currentStreamId = `stream-${Date.now()}`;
        }

        if (data.content !== '') {
          addMessage({
            id: `chunk-${currentStreamId ?? 'unknown'}`,
            content: data.content,
            streamId: currentStreamId ?? 'unknown',
            role: 'assistant',
            createdAt: new Date().toISOString(),
          });
        }
      };

      eventSource.onerror = (errorEvent) => {
        console.error(`EventSource failed for thread ID ${id}:`, errorEvent);
        eventSource.close();
        setIsStreaming(false);
        useChatStore.setState({ error: 'Stream Error' });
      };

      return () => {
        console.log(`Cleaning up SSE connection for thread ID: ${id}`);
        eventSource.close();
      };
    };

    console.log(`Setting up SSE connection for thread ID: ${id}`);
    const cleanupSSE = setupSSE();

    return () => {
      console.log(`Cleaning up thread: ${id}`);
      cleanupSSE();
    };
  }, [id]);

  return (
    <div ref={chatContainerRef} className="chat-container flex-1 overflow-y-scroll overflow-x-hidden">
      {messages.map((message, index) => (
        <Message key={message.id || index.toString()} message={message} />
      ))}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default Thread;
