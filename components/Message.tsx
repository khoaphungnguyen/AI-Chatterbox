import React, { useMemo } from "react";
import { ChatMessage } from "@/typings";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import useChatStore from "@/app/store/threadStore";
import useSWR from "swr";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  message: ChatMessage;
  id: string;
};

interface CustomCodeComponentProps {
  node: any;
  inline: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CopyButton: React.FC<{ codeString: string }> = ({ codeString }) => (
  <CopyToClipboard
    text={codeString}
    onCopy={() => toast.success("Text copied to clipboard!")}
  >
    <button
      className="absolute top-2 right-2 text-white rounded p-2 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition ease-in-out duration-200"
      title="Copy to clipboard"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
        />
      </svg>
    </button>
  </CopyToClipboard>
);

const CodeComponent: React.FC<CustomCodeComponentProps> = ({
  inline,
  className,
  children,
}) => {
  const language =
    (className?.match(/language-([\w-.]+)/) || [])[1] || "plaintext";
  const codeString = String(children).replace(/\n$/, "");

  return !inline ? (
    <div className="relative ">
      <CopyButton codeString={codeString} />
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className}>{children}</code>
  );
};

const Message: React.FC<Props> = ({ message, id }) => {
  const { data: session } = useSession();
  const { content, role, createdAt } = message;
  const isSmartChat = role === "assistant";
  const timeString = useMemo(
    () => (createdAt ? new Date(createdAt).toLocaleTimeString() : "N/A"),
    [createdAt]
  );

  const addMessage = useChatStore((state) => state.addMessage);
  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo-0125",
  });
  const { setIsStreaming, messages } = useChatStore();
  const router = useRouter();
  const pathname = usePathname();

  const renderers: Components = {
    code: CodeComponent as any,
  };

  const regenerate = async (message: string, createdAt: string) => {
    const preContent: { role: string; content: string }[] = [];
    for (const mes of messages) {
      if (mes.content === message && mes.createdAt === createdAt) {
        break;
      }
      preContent.push({
        role: mes.role,
        content: mes.content,
      });
    }
    //console.log("content: ",preContent)
    const regenerateMessage = "R :" + preContent[preContent.length - 1].content;
    if (session && session.error) {
      router.push(`/api/auth/signin?callbackUrl=${pathname}`);
      console.log("Refresh token is invalid");
      return;
    }
    setIsStreaming(true);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: regenerateMessage,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    try {
      const response = await fetch(`/api/sendMessage/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: preContent, model: model }),
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
  };

  return (
    <div className="flex items-start space-x-3 max-w-3xl mx-auto">
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
        <div className="h-9 w-9 rounded-full bg-blue-500 text-white font-semibold  shadow-lg flex items-center justify-center transition-all duration-200 ease-in-out transform hover:scale-110">
          <p className="text-center ">
            {session?.user?.name
              ? session.user.name
                  .split(" ")
                  .map((namePart) => namePart[0].toUpperCase())
                  .join("")
              : ""}
          </p>
        </div>
      )}
      <div className="px-1 rounded-lg my-1 cursor-pointer relative w-full ">
        {isSmartChat && (
          <div className="flex justify-end items-center space-x-4 ">
            <CopyToClipboard
              text={content}
              onCopy={() => toast.success("Text copied to clipboard!")}
            >
              <button
                className="absolute top-4 right-10 text-white 
           hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 
           focus:ring-blue-600 focus:bg-blue-500 focus:ring-opacity-50 transition ease-in-out duration-200 rounded-lg p-2"
                title="Copy to clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.25 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </button>
            </CopyToClipboard>
            <button
              onClick={() => {
                if (content && createdAt) {
                  regenerate(content, createdAt);
                }
              }}
              className="absolute top-4 right-2 text-white  hover:bg-green-700
         active:bg-green-800 focus:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50
          transition ease-in-out duration-200 rounded-lg p-2"
              title="Regenerate"
            >
              <ArrowPathRoundedSquareIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex justify-between items-center mb-2">
          <p
            className={`text-lg font-semibold ${
              isSmartChat ? "text-white" : "text-white"
            }`}
          >
            {isSmartChat ? "Assistant" : session?.user?.name}
          </p>
        </div>

        <ReactMarkdown
          className={`prose prose-sky lg:prose-lg ${
            isSmartChat ? "text-white/70" : "text-gray-300"
          }`}
          remarkPlugins={[gfm]}
          components={renderers}
        >
          {content}
        </ReactMarkdown>
        <p className="mt-2 text-gray-400 text-right text-sm">{timeString}</p>
      </div>
    </div>
  );
};
export default Message;
