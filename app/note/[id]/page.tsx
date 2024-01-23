"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Note {
  id: number;
  title: string;
  problemContent: string;
  approach: string;
  solution: string;
  extraNotes: string;
  timestamp: Date;
}

export default function NotePage() {
  const router = useRouter();
  const id = usePathname().split("/")[2];

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [problemContent, setProblemContent] = useState("");
  const [approach, setApproach] = useState("");
  const [solution, setSolution] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  useEffect(() => {
    if (!id) return; // Ensure id is defined

    // Fetch the note from localStorage or an API
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      const notes: Note[] = JSON.parse(savedNotes);
      const noteToEdit = notes.find((note) => note.id === Number(id));
      if (noteToEdit) {
        setNote(noteToEdit);
        setTitle(noteToEdit.title);
        setProblemContent(noteToEdit.problemContent);
        setApproach(noteToEdit.approach);
        setSolution(noteToEdit.solution);
        setExtraNotes(noteToEdit.extraNotes);
      }
    }
  }, [id]);

  const handleUpdate = () => {
    if (!note) return; // Ensure note is defined

    const updatedNote: Note = {
      ...note,
      title,
      problemContent,
      approach,
      solution,
      extraNotes,
    };
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      let notes: Note[] = JSON.parse(savedNotes);
      notes = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
      localStorage.setItem("notes", JSON.stringify(notes));
      router.push("/"); // Navigate back to the main page after update
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="mx-auto p-8 flex justify-center items-center h-screen">
      <div className="max-w-2xl bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">Edit Note</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 rounded-lg w-full mb-4"
          placeholder="Title"
        />
        <textarea
          value={problemContent}
          onChange={(e) => setProblemContent(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 rounded-lg w-full mb-4"
          placeholder="Problem Content"
          rows={4}
        />
        <textarea
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 rounded-lg w-full mb-4"
          placeholder="Approach"
          rows={4}
        />
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 rounded-lg w-full mb-4"
          placeholder="Solution"
          rows={4}
        />
        <textarea
          value={extraNotes}
          onChange={(e) => setExtraNotes(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 rounded-lg w-full mb-4"
          placeholder="Extra Notes"
          rows={4}
        />
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleUpdate}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md w-full sm:w-auto flex-grow mr-2"
          >
            Update Note
          </button>
          <button
            onClick={() => router.push("/note")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-md w-full sm:w-auto flex-grow ml-2"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
