"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  ProgressCircle,
  Button,
  Dialog,
  DialogPanel,
  Title,
  Select,
  SelectItem,
  Subtitle,
} from "@tremor/react";
import {
  ArrowLeft,
  Save,
  Clipboard,
  CheckSquare,
  Lightbulb,
  LoaderIcon,
  X,
  MessageCircleHeartIcon,
  MessageCircle,
  MessageCircleCode,
  MessageCircleDashed,
  MessageCircleQuestion,
  MoveDownIcon,
  LucideMoveDown,
  ArrowDownCircleIcon,
} from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useSession } from "next-auth/react";

import React, { useEffect, useRef, useState } from "react";
import Message from "@/components/Message";
import useSWR from "swr";
import useChatStore from "@/app/store/threadStore";
import { ChatMessage } from "@/typings";
import ThreadInput from "@/components/ThreadInput";

interface Note {
  id: number;
  threadID: string;
  title: string;
  problem: string;
  approach: string;
  solution: string;
  code: string;
  type: string;
  level: string;
  updated_at: Date;
}

interface NotePayload {
  problem: string;
  approach: string;
  solution: string;
}

interface CodePayload {
  code: string;
}

type NotePageProps = {
  params: {
    id: string;
  };
};

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

export default function NotePage({ params: { id } }: NotePageProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [isLoadingRevise, setIsLoadingRevise] = useState(false);
  const [isLoadingSolution, setIsLoadingSolution] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [value, setValue] = useState("golang");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch note: ${response.status}`);
        }
        const noteToEdit: Note = await response.json();
        setNote(noteToEdit);
      } catch (error) {
        console.error("Failed to fetch note", error);
      }
    };

    fetchNote();
  }, [id]);

  interface CustomCodeComponentProps {
    node: any;
    inline: boolean;
    className?: string;
    children?: React.ReactNode;
  }

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo-0125",
  });
  const { setIsStreaming } = useChatStore();
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!note) return;
    setIsLoadingSave(true);
    const updatedNote: NotePayload = {
      problem: note.problem,
      approach: note.approach,
      solution: note.solution,
    };

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`);
      }

      // Update the note state with the new updatedAt value
      setNote({
        ...note,
        updated_at: new Date(),
      });
    } catch (error) {
      console.error("Failed to update note", error);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleSaveCode = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!note) return;

    const updatedNote: CodePayload = {
      code: note.code,
    };

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        throw new Error(`Failed to update note: ${response.status}`);
      }

      // Update the note state with the new updatedAt value
      setNote({
        ...note,
        updated_at: new Date(),
      });
    } catch (error) {
      console.error("Failed to update note", error);
    }
  };

  const handleInputChange = (value: string, field: keyof Note) => {
    if (note) {
      setNote({
        ...note,
        [field]: value,
      });
    }
  };

  const handleGenerateProblem = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsLoadingProblem(true);
    if (!note) return;

    const input = "Title:" + note?.title;

    const response = await fetch(`/api/generateNote/getProblems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
      }),
    });

    const data = await response.json();

    setNote({
      ...note,
      problem: data,
    });
    setIsLoadingProblem(false);
  };

  const handleGetRevise = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoadingRevise(true);
    if (!note) return;

    const input = "User Approach:" + note?.approach;

    const response = await fetch(`/api/generateNote/getRevise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
      }),
    });

    const data = await response.json();
    setNote({
      ...note,
      approach: data,
    });
    setIsLoadingRevise(false);
  };

  const handleGenerateFeedback = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsFeedbackOpen(true);
    setIsLoadingFeedback(true);
    if (!note) return;

    const input =
      "Title:" +
      note?.title +
      ". Problem Statement:" +
      note?.problem +
      ". User Approach:" +
      note?.approach +
      ". User Solution:" +
      note?.solution;

    const response = await fetch(`/api/generateNote/getFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
      }),
    });

    const data = await response.json();
    setFeedback(data);
    setIsLoadingFeedback(false);
  };

  const handleSolution = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoadingSolution(true);
    if (!note) return;
    console.log("Generating solution");
    const input = "Problem Statement:" + note?.problem;

    const response = await fetch(`/api/generateNote/getSolutions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
        language: value,
      }),
    });

    const data = await response.json();
    setNote({
      ...note,
      code: data,
    });
    setIsLoadingSolution(false);
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
  const { data: initialMessages } = useSWR<ChatMessage[]>(
    `/api/getMessages/${note?.threadID}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const { messages, addMessage, updateMessage, reset } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      eventSource = new EventSource(`/api/getStream/${note?.threadID}`);
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
  }, [note?.threadID, initialMessages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderers: Components = {
    code: CodeComponent as any,
  };

  if (!note) {
    return (
      <div className=" bg-gray-800 w-full h-full flex justify-center items-center">
        <ProgressCircle
          value={72}
          radius={25}
          strokeWidth={6}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-1 overflow-auto">
      <div className=" flex flex-col md:flex-row items-center justify-between">
        <button
          onClick={() => router.push("/notes")}
          className="flex items-center justify-center p-3 rounded-md text-red-400 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 shadow-lg hover:shadow-none transition duration-300 ease-in-out"
        >
          <ArrowLeft className="mr-2" size={22} />
          Back to Notes
        </button>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 text-center">
          <h1 className="text-4xl font-bold text-blue-500">{note.title}</h1>

          <p
            className={`text-sm py-1 px-2 font-medium rounded-xl text-white ${
              note.level === "Hard"
                ? "bg-red-600"
                : note.level === "Medium"
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          >
            {note.level}
          </p>

          <p className="text-sm py-1 px-2 font-medium text-blue-800 bg-blue-200 border border-blue-300 rounded-xl">
            {note.type}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            onClick={handleUpdate}
            className="flex items-center px-6 py-3 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white font-bold rounded-md transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          >
            <Save className="mr-2 text-white" size={22} />
            Save
          </button>
        </div>
      </div>

      <form className="space-y-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Problem Column */}
          <div className="md:col-span-1 md:row-span-4 ">
            <div>
              <div className="flex justify-between items-center">
                <label className="text-lg font-bold mb-2 flex items-center text-teal-300">
                  <Clipboard className="mr-2 text-teal-300" size={22} />
                  Problem
                </label>
                <div className="relative">
                  <button
                    className={`w-24 h-8 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded inline-flex items-center justify-center mb-2 ${
                      isLoadingProblem ? "opacity-50 cursor-not-allowed" : ""
                    } `}
                    onClick={handleGenerateProblem}
                    disabled={isLoadingProblem}
                  >
                    Create
                  </button>
                </div>
              </div>
              <p>
                {isLoadingProblem ? (
                  <div className="flex items-center justify-center space-x-2 w-full h-[50rem] p-4 rounded-md bg-gray-800 border border-gray-700">
                    <div className="flex items-center justify-center ">
                      <LoaderIcon size={22} className="animate-spin mr-2" />
                      Processing...
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={note.problem}
                    onChange={(e) =>
                      handleInputChange(e.target.value, "problem")
                    }
                    className="w-full h-[50rem] p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-teal-500 focus:ring focus:ring-teal-300 focus:ring-opacity-50"
                    placeholder="Describe the problem..."
                  />
                )}
              </p>
            </div>
          </div>

          {/* Approach */}
          <div className="md:col-span-3">
            <div className="flex justify-between  p-1">
              <div></div>
              <div className="flex flex-col items-center justify-center space-y-2 bg-gray-900 text-white ">
                <p className="text-center text-lg">
                  Click the button below to generate feedback on your work.
                  Remember, this is a tool to help you improve!
                </p>

                <button
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-none transition duration-300 ease-in-out"
                  onClick={handleGenerateFeedback}
                >
                  Generate Feedback
                </button>
              </div>

              <Dialog
                open={isFeedbackOpen}
                onClose={(val) => setIsFeedbackOpen(val)}
              >
                <DialogPanel>
                  <div className="flex justify-between items-center  ">
                    <div className="text-xl text-blue-100 font-bold">
                      Feedback
                    </div>

                    <Button
                      variant="light"
                      onClick={() => setIsFeedbackOpen(false)}
                    >
                      <X className="text-red-500" size={22} />
                    </Button>
                  </div>

                  <div className="mb-4">
                    {isLoadingFeedback ? (
                      <div className="flex items-center justify-center space-x-2">
                        <LoaderIcon
                          size={22}
                          className="animate-spin mr-2 text-blue-500"
                        />
                        Processing...
                      </div>
                    ) : (
                      <div className="prose max-h-[30rem]  overflow-y-auto  ">
                        <ReactMarkdown
                          className="text-gray-200"
                          remarkPlugins={[gfm]}
                          components={renderers}
                        >
                          {feedback}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </Dialog>
              {isLoadingSave ? (
                <p className="text-sm text-red-500">
                  Updated at: {new Date(note.updated_at).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Updated at: {new Date(note.updated_at).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <label className="text-lg font-bold mb-2 flex items-center text-yellow-300">
                <Lightbulb className="mr-2 text-yellow-300" size={22} />
                Approach
              </label>
              <div className="relative">
                <button
                  className={`w-24 h-8 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded inline-flex items-center justify-center mb-2 ${
                    isLoadingRevise ? "opacity-50 cursor-not-allowed" : ""
                  } `}
                  onClick={handleGetRevise}
                  disabled={isLoadingRevise}
                >
                  Revise
                </button>
              </div>
            </div>
            {isLoadingRevise ? (
              <div className="flex items-center justify-center space-x-2 w-full h-48 p-4 rounded-md bg-gray-800 border border-gray-700">
                <div className="flex items-center justify-center ">
                  <LoaderIcon size={22} className="animate-spin mr-2" />
                  Processing...
                </div>
              </div>
            ) : (
              <textarea
                value={note.approach}
                onChange={(e) => handleInputChange(e.target.value, "approach")}
                className="w-full h-48 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-300 focus:ring-opacity-50"
                placeholder="Describe your approach..."
              />
            )}
          </div>

          {/* Solution */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center ">
              <label className="text-lg font-bold mb-2 flex items-center text-green-300">
                <CheckSquare className="mr-2 text-green-300" size={22} />
                Solution
              </label>
              <div className="relative">
                <button
                  className={`w-24 h-8 bg-green-400 hover:bg-green-500 text-white font-bold rounded inline-flex items-center justify-center mb-2 ${
                    isLoadingSolution ? "opacity-50 cursor-not-allowed" : ""
                  } `}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(true);
                  }}
                >
                  Show
                </button>
                <Dialog open={isOpen} onClose={(val) => setIsOpen(val)}>
                  <DialogPanel>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl text-blue-100 font-bold">
                        Solution
                      </div>
                      <Button variant="light" onClick={() => setIsOpen(false)}>
                        <X className="text-red-500" size={22} />
                      </Button>
                    </div>
                    <Subtitle color="blue">
                      Please choose your language
                    </Subtitle>
                    <Select
                      value={value}
                      onValueChange={setValue}
                      placeholder="Golang"
                      color="blue"
                    >
                      <SelectItem value="1">Golang</SelectItem>
                      <SelectItem value="2">Python</SelectItem>
                      <SelectItem value="3">C</SelectItem>
                      <SelectItem value="4">C++</SelectItem>
                    </Select>
                    <div className="mb-4 mt-4">
                      {isLoadingSolution ? (
                        <div className="flex items-center justify-center space-x-2">
                          <LoaderIcon
                            size={22}
                            className="animate-spin mr-2 text-blue-500"
                          />
                          Processing...
                        </div>
                      ) : (
                        <div className="bg-gray-800 max-h-96 overflow-y-auto rounded-md p-4">
                          <ReactMarkdown
                            className="text-gray-200"
                            remarkPlugins={[gfm]}
                            components={renderers}
                          >
                            {note.code ? note.code : "No code generated yet"}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="primary"
                        color="green"
                        onClick={handleSolution}
                      >
                        Generate
                      </Button>
                      <Button
                        variant="primary"
                        color="blue"
                        onClick={handleSaveCode}
                      >
                        Save
                      </Button>
                    </div>
                  </DialogPanel>
                </Dialog>
              </div>
            </div>
            <textarea
              value={note.solution}
              onChange={(e) => handleInputChange(e.target.value, "solution")}
              className="w-full h-[29rem] p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
              placeholder="Implement your solution..."
            />
          </div>
        </div>
      </form>
      <div>
        <button
          className="fixed right-6 bottom-12   bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-none transition duration-300 ease-in-out"
          onClick={handleOpenModal}
        >
          <MessageCircleQuestion className="h-6 w-6" />
        </button>

        {isModalOpen && (
          <div
            className="fixed z-10 inset-0 overflow-y-auto"
            onClick={handleCloseModal}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div
                className="p-8 inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col h-full">
                  <div
                    ref={chatContainerRef}
                    className="h-[40rem] overflow-y-auto"
                  >
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <Message
                          key={`message-${message.id}`}
                          message={message}
                          id={note.threadID}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center   justify-center text-lg ont-semibold  ">
                        Please ask a question below to get started!
                        <span className="animate-bounce  py-2 px-4 f">
                          <ArrowDownCircleIcon size={22} />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <ThreadInput id={note.threadID} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
