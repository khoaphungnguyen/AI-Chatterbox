"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import { ChatMessage } from "@/typings";
import useChatStore from "@/app/store/threadStore";
import SuggestionsSection from "@/components/Suggestions";
import ThreadForm from "@/components/ThreadForm";
import { useSession } from "next-auth/react";
import icon from "@/public/icon.svg";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const addMessage = useChatStore((state) => state.addMessage);
  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo-0125",
  });
  const { setIsStreaming } = useChatStore();
  const { data: session } = useSession();
  const pathname = usePathname();
  const fetcher = async (url: string) => {
    const response = await fetch(url, {
      method: "POST",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  };

  const {
    data: suggestions,
    error: suggestionsError ,
    isLoading,
  } = useSWR(
    ["/api/getSuggestions", model],
    () => fetcher("/api/getSuggestions"),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Parse suggestions and handle errors
  const parsedSuggestions = suggestions ? suggestions : [];

  const stopStreaming = async () => {
    try {
      console.log("Stop streaming:", pathname);
      const response = await fetch(`/api/sendMessage/${pathname}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stopStreaming: true }),
      });
      setIsStreaming(false);
      if (!response.ok) {
        toast.error("Failed to stop streaming.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`An error occurred: ${error.message}`);
      } else {
        toast.error("An error occurred.");
      }
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    if (session && session.error) {
      router.push(`/api/auth/signin?callbackUrl=${pathname}`);
      console.log("Refresh token is invalid");
      return;
    }
    try {
      const response = await fetch("/api/createThread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, model: model }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create thread: ${response.statusText}`);
      }
      const data = await response.json();
      router.push(`/thread/${data.threadId.id}`);
      //Add delay to allow thread to be created
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsStreaming(true);
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: message,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      addMessage(userMessage);
      setPrompt("");
      try {
        const response = await fetch(`/api/sendMessage/${data.threadId.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: message }],
            model: model,
          }),
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
      } finally {
        setIsStreaming(false);
      }

      return data.threadId.id;
    } catch (error) {
      // Narrow down the type to Error
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        // If it's not an Error instance, handle accordingly
        console.log("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between text-gray-100 bg-gray-800 ">
      <Header />
      <div className="flex justify-center">
        <Image src={icon} width={350} height={350} alt="RapidSec Logo" />
      </div>
      <div>
        <SuggestionsSection
          suggestions={parsedSuggestions}
          error={suggestionsError}
          loading={isLoading}
          sendMessage={sendMessage}
        />
        <ThreadForm
          prompt={prompt}
          setPrompt={setPrompt}
          sendMessage={sendMessage}
          stopStreaming={stopStreaming}
        />
      </div>
    </div>
  );
}
