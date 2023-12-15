import React from 'react';
import { ChatMessage } from "@/typings";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

type Props = {
  message: ChatMessage;
};

function Message({ message }: Props) {
  const { data: session } = useSession(); 
  const { content, role, createdAt } = message;
  const isSmartChat = role === "assistant";

  // Function to get initials from a full name
  function getInitials(fullName: string = "") {
    return fullName.split(' ').map(name => name[0]).join('');
  }

  // Format createdAt date safely
  const timeString = createdAt ? new Date(createdAt).toLocaleTimeString() : 'N/A';

  return (
    <div className={`flex items-start space-x-3 max-w-2xl mx-auto my-2 ${isSmartChat ? "flex-row-reverse" : "flex-row"}`}>
      {isSmartChat ? (
        <Image 
          src="/icon.png" 
          alt="Assistant" 
          className="h-8 w-8 rounded-full"
          width={32} 
          height={32}
        />
      ) : session?.user?.image ? (
        <Image 
          src={session.user.image} 
          alt="Profile" 
          className="h-8 w-8 rounded-full border-2 border-gray-500"
          width={32} 
          height={32}
        />
      ) : (
        <div className="h-8 w-8 rounded-full border-2 border-gray-500 flex items-center justify-center bg-gray-500 text-white font-semibold">
          {getInitials(session?.user?.name ?? "")}
        </div>
      )}
      <div className={`py-3 px-4 rounded-lg my-2 text-white ${isSmartChat ? "" : "bg-gray-800"}`}>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-300">
            {/* Render the user's name */}
            {isSmartChat ? "Assistant" : session?.user?.name}
          </p>
          {/* Render the time string */}
          <p className="text-xs text-gray-300">{timeString}</p>
        </div>
        <ReactMarkdown className="text-sm mt-1 prose prose-sm">
          {/* Render the content */}
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Message;