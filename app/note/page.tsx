"use client";

import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
interface Note {
  id: number;
  title: string;
  problemContent: string;
  approach: string;
  solution: string;
  extraNotes: string;
  timestamp: Date;
}

type Action =
  | { type: "ADD_NOTE"; note: Note }
  | { type: "DELETE_NOTE"; id: number }
  | { type: "SET_NOTES"; notes: Note[] };

function notesReducer(state: Note[], action: Action) {
  switch (action.type) {
    case "ADD_NOTE":
      return [...state, action.note];
    case "DELETE_NOTE":
      return state.filter((note) => note.id !== action.id);
    case "SET_NOTES":
      return action.notes;
    default:
      return state;
  }
}

interface NoteItemProps {
  note: Note;
  deleteNote: (id: number) => void;
  router: ReturnType<typeof useRouter>; // Using ReturnType to infer the type
}

const NoteItem: React.FC<NoteItemProps> = ({ note, deleteNote, router }) => (
  <li
    key={note.id}
    className="flex items-center justify-between mb-4 p-4 border border-gray-300 rounded shadow-lg"
  >
    <span className="font-semibold text-lg">{note.title}</span>
    <div>
      <button
        onClick={() => router.push(`/note/${note.id}`)}
        className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        View / Edit
      </button>
      <button
        onClick={() => deleteNote(note.id)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </li>
);
export default function NoteTaking() {
  const [notes, dispatch] = useReducer(notesReducer, []);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        const notesWithDateObjects = parsedNotes.map((note: any) => ({
          ...note,
          timestamp: new Date(note.timestamp),
        }));
        dispatch({ type: "SET_NOTES", notes: notesWithDateObjects });
      } catch (error) {
        console.error("Failed to parse notes from localStorage", error);
      }
    }
  }, []);

  const addNote = () => {
    if (newNoteTitle) {
      const newNote: Note = {
        id: Date.now(),
        title: newNoteTitle,
        problemContent: "",
        approach: "",
        solution: "",
        extraNotes: "",
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_NOTE", note: newNote });
      setNewNoteTitle("");
    }
  };

  const deleteNote = (id: number) => {
    dispatch({ type: "DELETE_NOTE", id });
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="mb-4">
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Enter note title"
          className="border border-gray-300 p-2 rounded"
        />
        <button
          onClick={addNote}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Note
        </button>
      </div>
      <ul>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            deleteNote={deleteNote}
            router={router} // Passing the router instance directly
          />
        ))}
      </ul>
    </div>
  );
}
