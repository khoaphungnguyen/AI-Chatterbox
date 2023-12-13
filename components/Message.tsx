import React, { useState, useEffect } from 'react';
import { ChatMessage } from "@/typings";
import { useSession } from "next-auth/react";
import Image from 'next/image';

type Props = {
  message: ChatMessage;
  isStreaming?: boolean;
};

function Message({ message, isStreaming = false }: Props) {
  const { data: session } = useSession();
  const { content, role, createdAt, streamId } = message;
  const isSmartChat = role === "assistant";

  // State to manage the expanded state of the message
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  // State to accumulate streaming content
  const [streamingContent, setStreamingContent] = useState('');

  // Determine if the message should be truncated
  const MAX_LENGTH = 300;
  const shouldTruncate = content.length > MAX_LENGTH && !isExpanded;

  // Effect to handle accumulating streaming content
  useEffect(() => {
    if (isStreaming) {
      setStreamingContent(prev => prev + content);
    } else {
      setStreamingContent('');
    }
  }, [content, isStreaming]);

  // Determine the display content based on whether the message is streaming
  const displayContent = isStreaming ? streamingContent : content;

  // Determine message style based on whether it's streaming
  const messageClasses = `py-5 text-white ${isSmartChat ? "bg-gray-700" : ""} ${isStreaming ? "opacity-75" : ""}`;

  // Function to get initials from a full name
  function getInitials(fullName: string = "") {
    return fullName.split(' ').map(name => name[0]).join('');
  }

  // Format createdAt date safely
  const timeString = createdAt ? new Date(createdAt).toLocaleTimeString() : 'N/A';

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
         <p className="pt-1 text">
          {/* Render the display content based on the streaming state */}
          {shouldTruncate && !isStreaming ? content.substring(0, MAX_LENGTH) + "..." : displayContent}
          {/* Toggle for expanding truncated content */}
          {shouldTruncate && !isStreaming && (
            <button onClick={toggleExpanded} className="text-blue-500 ml-2">
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>
        {/* Render the time string */}
        <p className="text-xs text-gray-500">{timeString}</p>
      </div>
    </div>
  );
}

export default Message;