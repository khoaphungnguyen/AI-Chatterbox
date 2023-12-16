import React, { useMemo } from 'react';
import { ChatMessage } from "@/typings";
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast';
import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Image from 'next/image';

type Props = {
  message: ChatMessage;
};

// Define a type that aligns with what ReactMarkdown expects for custom renderers
interface CustomCodeComponentProps {
  node: any;
  inline: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeComponent: React.FC<CustomCodeComponentProps> = ({ inline, className, children }) => {
  const match = /language-([\w-.]+)/.exec(className || '');
  const language = match ? match[1] : 'plaintext';

  const customStyle = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      fontSize: '1.05em',
    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      fontSize: '1.05em',
    },
  };

  const codeString = String(children).replace(/\n$/, '');

  return !inline ? (
    <div className="relative bg-gray-800 rounded ">
      <CopyToClipboard text={codeString} onCopy={() => toast.success('Text copied to clipboard!')}>
        <button className="absolute top-2 right-2 bg-blue-500 text-white rounded px-2 py-1 text-xs hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition ease-in-out duration-200">
          Copy
        </button>
      </CopyToClipboard>
      <SyntaxHighlighter style={customStyle}  language={language}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} style={{ fontSize: '1em' }}>
      {children}
    </code>
  );
};

const Message: React.FC<Props> = ({ message }) => {
  const { data: session } = useSession();
  const { content, role, createdAt } = message;
  const isSmartChat = role === "assistant";
  const timeString = useMemo(() => createdAt ? new Date(createdAt).toLocaleTimeString() : 'N/A', [createdAt]);

  const renderers: Components = {
    code: CodeComponent as any,
  };

  return (
    <div className="flex items-start space-x-3 max-w-2xl mx-auto my-2 text-gray-800">      
    {isSmartChat ? (
        <Image 
          src="/icon.png" 
          alt="Assistant" 
          className="h-9 w-9 rounded-full"
          width={32} 
          height={32}
        />
      ) : session?.user?.image ? (
        <Image 
          src={session.user.image} 
          alt={`Profile picture of ${session.user.name}`}
          className="h-9 w-9 rounded-full border-2 border-gray-500"
          width={32} 
          height={32}
        />
      ) : (
        <div className="h-9 w-9 rounded-full border-2 border-gray-500 flex items-center justify-center bg-gray-500  font-semibold text-white">
          {session?.user?.name ? session.user.name.split(' ').map(namePart => namePart[0].toUpperCase()).join('') : ""}
        </div>
      )}
      <div className="px-4 rounded-lg my-2 cursor-pointer relative ">
        {isSmartChat && 
          <CopyToClipboard text={content} onCopy={() => toast.success('Text copied to clipboard!')}>
          <button className="absolute right-0 top-0 bg-blue-500 text-white rounded px-2 py-1 text-xs hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition ease-in-out duration-200">
            Copy
          </button>
        </CopyToClipboard>
        }
        <div className="flex justify-between items-center">
        <p className={`text-lg font-semibold ${isSmartChat ? 'text-blue-600' : 'text-white'}`}>
        {isSmartChat ? "Assistant" : session?.user?.name}
          </p>
        </div>
        <ReactMarkdown 
          className={`prose prose-blue list-decimal list-inside ${isSmartChat ? 'text-white' : 'text-white'}`} 
          remarkPlugins={[gfm]}
          components={renderers}
        >
          {content}
        </ReactMarkdown>
        <p className="mt-2 text-gray-500 text-right text-sm">{timeString}</p>
      </div>  
    </div>
  );
}

export default Message;


