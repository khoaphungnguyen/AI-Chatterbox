"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // corrected from next/navigation
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
  SquareGanttIcon,
  LoaderIcon,
  X,
} from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Note {
  id: number;
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
  const [hints, setHints] = useState(null);

  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [isLoadingRevise, setIsLoadingRevise] = useState(false);
  const [isLoadingSolution, setIsLoadingSolution] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const handleUpdate = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!note) return;

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

  const handleGenerateHints = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsLoadingHint(true);
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

    const response = await fetch(`/api/generateNote/getHints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
      }),
    });

    const data = await response.json();
    setHints(data);
    setIsLoadingHint(false);
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

        <div>
          <h1 className="text-4xl font-semibold text-center ">
            {note.title}
          </h1>
          <p className="text-xl font-semibold text-center text-blue-400">
            Level: <span className="text-red-500">{note.level}</span>
          </p>
          <p className="text-lg font-semibold text-center text-blue-300">
            Data Type: {note.type}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            onClick={handleUpdate}
            className="flex items-center px-6 py-3 bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white font-bold rounded-md transition duration-300 ease-in-out shadow-lg hover:shadow-none"
          >
            <Save className="mr-2 text-white" size={22} />
            Update Note
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Updated at: {new Date(note.updated_at).toLocaleString()}
      </p>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Suggestion Column */}
          <div className="md:col-span-1 md:row-span-4 bg-gray-800 border border-gray-700 p-4 rounded-md overflow-auto flex flex-col justify-between space-y-4">
            <div>
              <label className="text-lg font-bold mb-2 flex items-center text-orange-300">
                <SquareGanttIcon className="mr-2 text-orange-300" size={22} />
                Feeback
              </label>
              <p>
                {isLoadingHint ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center justify-center ">
                      <LoaderIcon size={22} className="animate-spin mr-2" />
                      Processing...
                    </div>
                  </div>
                ) : hints ? (
                  hints
                ) : (
                  "As an AI assistant, I'll guide your algorithmic challenge, providing feedback but not direct solutions. Let's start!"
                )}
              </p>
            </div>
            <button
              className={`bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg hover:shadow-none transition duration-300 ease-in-out ${
                isLoadingHint ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleGenerateHints}
              disabled={isLoadingHint}
            >
              Get Hints
            </button>
          </div>

          {/* Problem Content */}
          <div className="md:col-span-3">
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
                  Generate
                </button>
              </div>
            </div>
            {isLoadingProblem ? (
              <div className="flex items-center justify-center space-x-2 w-full h-40 p-4 rounded-md bg-gray-800 border border-gray-700">
                <div className="flex items-center justify-center ">
                  <LoaderIcon size={22} className="animate-spin mr-2" />
                  Processing...
                </div>
              </div>
            ) : (
              <textarea
                value={note.problem}
                onChange={(e) => handleInputChange(e.target.value, "problem")}
                className="w-full h-40 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-teal-500 focus:ring focus:ring-teal-300 focus:ring-opacity-50"
                placeholder="Describe the problem..."
              />
            )}
          </div>

          {/* Approach */}
          <div className="md:col-span-3">
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
              <div className="flex items-center justify-center space-x-2 w-full h-40 p-4 rounded-md bg-gray-800 border border-gray-700">
                <div className="flex items-center justify-center ">
                  <LoaderIcon size={22} className="animate-spin mr-2" />
                  Processing...
                </div>
              </div>
            ) : (
              <textarea
                value={note.approach}
                onChange={(e) => handleInputChange(e.target.value, "approach")}
                className="w-full h-40 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-300 focus:ring-opacity-50"
                placeholder="Describe your approach..."
              />
            )}
          </div>

          {/* Solution */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center">
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
                      <Title>View Solution</Title>
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
                        <div className=" bg-gray-800 overflow-hidden rounded-md p-4">
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
              className="w-full h-60 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
              placeholder="Describe the solution..."
            />
          </div>
        </div>
      </form>
    </main>
  );
}
