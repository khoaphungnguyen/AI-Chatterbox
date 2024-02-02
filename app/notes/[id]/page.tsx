"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // corrected from next/navigation
import toast from "react-hot-toast";

import { ProgressCircle } from "@tremor/react";
import {
  ArrowLeft,
  Save,
  FileText,
  Clipboard,
  CheckSquare,
  Lightbulb,
  SquareGanttIcon,
  LoaderIcon,
} from "lucide-react";

interface Note {
  id: number;
  title: string;
  problem: string;
  approach: string;
  solution: string;
  extra_note: string;
}

interface NotePayload {
  problem: string;
  approach: string;
  solution: string;
  extraNote: string;
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
  const [isLoading, setIsLoading] = useState(false);

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
        toast.error("Failed to load the note.");
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
      extraNote: note.extra_note,
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

      toast.success("Note updated!");
    } catch (error) {
      console.error("Failed to update note", error);
      toast.error("Failed to update the note.");
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

  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
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

    const response = await fetch(`/api/getHints`, {
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
    toast.success("Hints generated!");
    setIsLoading(false);
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
    <main className="min-h-screen bg-gray-900 text-gray-100 p-10 overflow-auto">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between">
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
      </div>

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
                {isLoading ? (
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
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleGenerate}
              disabled={isLoading}
            >
              Get Hints
            </button>
          </div>

          {/* Problem Content */}
          <div className="md:col-span-3">
            <label className="text-lg font-bold mb-2 flex items-center text-teal-300">
              <Clipboard className="mr-2 text-teal-300" size={22} />
              Problem
            </label>
            <textarea
              value={note.problem}
              onChange={(e) => handleInputChange(e.target.value, "problem")}
              className="w-full h-32 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-teal-500 focus:ring focus:ring-teal-300 focus:ring-opacity-50"
              placeholder="Describe the problem..."
            />
          </div>

          {/* Approach */}
          <div className="md:col-span-3">
            <label className="text-lg font-bold mb-2 flex items-center text-yellow-300">
              <Lightbulb className="mr-2 text-yellow-300" size={22} />
              Approach
            </label>
            <textarea
              value={note.approach}
              onChange={(e) => handleInputChange(e.target.value, "approach")}
              className="w-full h-32 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:ring focus:ring-yellow-300 focus:ring-opacity-50"
              placeholder="Describe your approach..."
            />
          </div>

          {/* Solution */}
          <div className="md:col-span-3">
            <label className="text-lg font-bold mb-2 flex items-center text-green-300">
              <CheckSquare className="mr-2 text-green-300" size={22} />
              Solution
            </label>
            <textarea
              value={note.solution}
              onChange={(e) => handleInputChange(e.target.value, "solution")}
              className="w-full h-40 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50"
              placeholder="Describe the solution..."
            />
          </div>

          {/* Extra Notes */}
          <div className="md:col-span-3">
            <label className="text-lg font-bold mb-2 flex items-center text-purple-300">
              <FileText className="mr-2 text-purple-300" size={22} />
              Extra Notes
            </label>
            <textarea
              value={note.extra_note}
              onChange={(e) => handleInputChange(e.target.value, "extra_note")}
              className="w-full h-20 p-4 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50"
              placeholder="Any additional information..."
            />
          </div>
        </div>
      </form>
    </main>
  );
}
