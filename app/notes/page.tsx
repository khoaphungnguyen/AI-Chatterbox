"use client";

import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
interface Note {
  id: number;
  title: string;
  created_at: Date;
  updated_at: Date;
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
    <div>
      <span className="font-semibold text-lg">{note.title}</span>
      <div className="text-sm text-gray-500">
        Created at: {note.created_at.toLocaleDateString()}{" "}
      </div>
      <div className="text-sm text-gray-500">
        Updated at: {note.updated_at.toLocaleDateString()}{" "}
      </div>
    </div>
    <div>
      <button
        onClick={() => router.push(`/notes/${note.id}`)}
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
    // Fetch all notes from the API
    fetch(`/api/notes`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        const notesWithDateObjects = data.map((note: any) => ({
          ...note,
          created_at: parseISO(note.created_at),
          updated_at: parseISO(note.updated_at),
        }));
        dispatch({ type: "SET_NOTES", notes: notesWithDateObjects });
      })
      .catch((error) => console.error("Failed to fetch notes", error));
  }, []);

  const addNote = async () => {
    if (newNoteTitle) {
      // Create the note via the API
      await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newNoteTitle }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          // Create a new note with the data from the response
          const newNote: Note = {
            id: data.ID,
            title: data.Title,
            created_at: new Date(data.CreatedAt),
            updated_at: new Date(data.UpdatedAt),
          };

          // Add the new note to the local state
          dispatch({ type: "ADD_NOTE", note: newNote });
        });

      setNewNoteTitle("");
    }
  };

  const deleteNote = (id: number) => {
    // Delete the note via the API
    fetch(`/api/notes/${id}`, {
      method: "DELETE",
    }).then(() => {
      // Remove the note from the local state
      dispatch({ type: "DELETE_NOTE", id });
    });
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
            router={router}
          />
        ))}
      </ul>
    </div>
  );
}
