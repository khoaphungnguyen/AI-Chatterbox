import React from 'react';
import { ChatMessage } from "@/typings";
import { useSession } from "next-auth/react";
import Image from 'next/image';

type Props = {
  message: ChatMessage;
  isStreaming?: boolean;
};

function Message({ message, isStreaming = false }: Props) {
  const { data: session } = useSession();
  const { content, role } = message;
  const isSmartChat = role === "assistant";

  const messageClasses = `py-5 text-white ${isSmartChat ? "bg-gray-700" : ""}`;
  
  // Function to get initials from a full name
  function getInitials(fullName: string = "") {
    return fullName.split(' ').map(name => name[0]).join('');
  }

  // Determine the display content based on whether the message is being streamed
  const displayContent = isStreaming ? (content + "...") : content; // Append "..." if streaming

  return (
    <div className={messageClasses}>
      <div className="flex items-center space-x-5 px-5 max-w-2xl mx-auto">
        {isSmartChat ? (
          <Image 
            src="/icon.png" 
            alt="Assistant" 
            className="h-10 w-10 rounded-full mr-3"
            width={40} 
            height={40}
          />
        ) : session?.user?.image ? (
          <Image 
            src={session.user.image} 
            alt="Profile" 
            className="h-10 w-10 rounded-full mr-3 border-2 border-blue-700"
            width={40} 
            height={40}
          />
        ) : (
          <div className="h-10 w-10 rounded-full mr-3 border-2 border-blue-700 flex items-center justify-center bg-gray-700 text-white font-semibold">
            {getInitials(session?.user?.name ?? "")}
          </div>
        )}
        <p className="pt-1 text">{displayContent}</p> {/* Render the display content */}
      </div>
    </div>
  );
}

export default Message;
