import React, { useMemo, useCallback } from 'react';
import { ChatMessage } from "@/typings";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

type Props = {
  message: ChatMessage;
};

function getContentString(content: any): string {
  if (typeof content === 'string') {
    return content;
  } else if (Array.isArray(content)) {
    return content.join(' ');
  } else if (typeof content === 'object') {
    return JSON.stringify(content);
  } else {
    return '';
  }
}

function Message({ message }: Props) {
  const { data: session } = useSession(); 
  const { content, role, createdAt } = message;
  const isSmartChat = role === "assistant";

  const timeString = useMemo(() => createdAt ? new Date(createdAt).toLocaleTimeString() : 'N/A', [createdAt]);
  const contentString = useMemo(() => getContentString(content), [content]);

  function getInitials(fullName: string = "") {
    return fullName.split(' ').map(name => name[0]).join('');
  }

  const copyText = useCallback(() => {
    if (isSmartChat) {
      navigator.clipboard.writeText(contentString);
      toast.success('Text copied to clipboard!');
    }
  }, [isSmartChat, contentString])

  return (
    <div className="flex items-start space-x-3 max-w-2xl mx-auto my-2">
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
          alt={`Profile picture of ${session.user.name}`} // More descriptive alt text
          className="h-8 w-8 rounded-full border-2 border-gray-500"
          width={32} 
          height={32}
        />
      ) : (
        <div className="h-8 w-8 rounded-full border-2 border-gray-500 flex items-center justify-center bg-gray-500 text-white font-semibold">
          {getInitials(session?.user?.name ?? "")}
        </div>
      )}
       <div className="py-2 px-3 rounded-lg my-2" onClick={copyText}>
        <div className="flex justify-between items-center">
          <p className={`text-sm ${isSmartChat ? 'text-blue-300' : 'text-gray-400'}`}>
            {isSmartChat ? "Assistant" : session?.user?.name}
          </p>
        </div>
        <ReactMarkdown className={`text-lg mt-1 prose prose-sm ${isSmartChat ? 'text-blue-400' : 'text-white/90'}`}>
          {contentString}
        </ReactMarkdown>
        <p className="text-sm text-gray-400 text-right">{timeString}</p>
      </div>
    </div>
  );
}

export default Message;