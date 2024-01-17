"use client";

import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useSWR from "swr";
import useChatStore from "@/app/store/threadStore";
import { ChatMessage } from "@/typings";

type ThreadProps = {
  id: string;
};

const fetcher = async (url: string): Promise<ChatMessage[]> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Data is not an array");
  }
  return data;
};

const Thread: React.FC<ThreadProps> = ({ id }) => {
  const { data: initialMessages } = useSWR<ChatMessage[]>(
    `/api/getMessages/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const { messages, addMessage, updateMessage, reset } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    reset();

    if (initialMessages) {
      initialMessages.forEach((message) => {
        if (!messages.some((m) => m.id === message.id)) {
          addMessage(message);
        }
      });
    }

    let eventSource: EventSource | null = null; // Define eventSource in the outer scope

    const setupSSE = () => {
      eventSource = new EventSource(`/api/getStream/${id}`);
      let currentStreamId: string | null = null;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.content === "" && currentStreamId) {
          currentStreamId = null;
        } else if (!currentStreamId) {
          currentStreamId = `stream-${Date.now()}`;
          addMessage({
            id: `chunk-${currentStreamId}`,
            content: data.content,
            streamId: currentStreamId,
            role: "assistant",
            createdAt: new Date().toISOString(),
          });
        } else {
          updateMessage(
            `chunk-${currentStreamId}`,
            (prevContent) => prevContent + data.content
          );
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
        useChatStore.setState({ error: "Stream Error" });

        // Try to reconnect after 5 seconds
        setTimeout(setupSSE, 5000);
      };
    };

    const cleanupSSE = () => {
      if (eventSource) {
        eventSource.close();
      }
    };

    setupSSE();

    return cleanupSSE;
  }, [id, initialMessages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 mt-10 overflow-y-scroll overflow-x-hidden"
    >
      {messages.length > 0 &&
        messages.map((message) => (
          <Message key={`message-${message.id}`} message={message} id={id} />
        ))}
    </div>
  );
};

export default Thread;
