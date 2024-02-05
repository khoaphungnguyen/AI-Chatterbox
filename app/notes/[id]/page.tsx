"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // corrected from next/navigation
import {
  ProgressCircle,
  Button,
  Dialog,
  DialogPanel,
  Title,
  Textarea,
  Select,
  SelectItem,
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

interface Note {
  id: number;
  title: string;
  problem: string;
  approach: string;
  solution: string;
  updated_at: Date;
}

interface NotePayload {
  problem: string;
  approach: string;
  solution: string;
}

type NotePageProps = {
  params: {
    id: string;
  };
};

export default function NotePage({ params: { id } }: NotePageProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [hints, setHints] = useState(null);
  const [code, setCode] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [isLoadingRevise, setIsLoadingRevise] = useState(false);
  const [isLoadingSolution, setIsLoadingSolution] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("Golang");

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
    setCode(data);
    setIsLoadingSolution(false);
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
    <main className="min-h-screen bg-gray-900 text-gray-100 p-2 overflow-auto">
      <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
        <button
          onClick={() => router.push("/notes")}
          className="flex items-center justify-center p-3 rounded-md text-red-400 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 shadow-lg hover:shadow-none transition duration-300 ease-in-out"
        >
          <ArrowLeft className="mr-2" size={22} />
          Back to Notes
        </button>

        <h1 className="text-4xl font-semibold text-center text-blue-400">
          {note.title}
        </h1>

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

      <p className="text-sm text-gray-500 mt-2">
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
                <Dialog
                  open={isOpen}
                  onClose={(val) => setIsOpen(val)}
                  className="rounded-lg w-full h-full bg-gray-900 bg-opacity-90"
                >
                  <DialogPanel className="bg-gray-800 text-white p-6 w-3/4 h-3/4">
                    <div className="flex justify-between items-center mb-4">
                      <Title>Show Solution</Title>
                      <Button variant="light" onClick={() => setIsOpen(false)}>
                        <X className="text-red-500" size={22} />
                      </Button>
                    </div>
                    <Select value={value} onValueChange={setValue} placeholder="Golang">
                      <SelectItem value="1">Golang</SelectItem>
                      <SelectItem value="2">Python</SelectItem>
                      <SelectItem value="3">C</SelectItem>
                      <SelectItem value="4">C++</SelectItem>
                    </Select>
                    <div className="mb-4 mt-4">
                      {isLoadingSolution ? (
                        <div className="flex items-center justify-center space-x-2">
                          <LoaderIcon size={22} className="animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <Textarea
                          value={code}
                          placeholder="Your solution will be shown here..."
                          style={{ height: "300px" }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="primary"
                        color="green"
                        onClick={handleSolution}
                      >
                        Generate
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
