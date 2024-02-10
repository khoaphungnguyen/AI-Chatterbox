"use client";

import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import { Select, SelectItem, TextInput } from "@tremor/react";
import useSWR from "swr";
import { set } from "zod";
import { LoaderIcon } from "lucide-react";

interface Note {
  id: number;
  title: string;
  level: string;
  type: string;
  threadID: string;
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
  deleteNote: (id: number, threadID: string) => void;
  router: ReturnType<typeof useRouter>; // Using ReturnType to infer the type
}

const NoteItem: React.FC<NoteItemProps> = ({ note, deleteNote, router }) => (
  <li
    key={note.id}
    className="flex items-center justify-between mb-4 p-4 bg-gray-900 border border-gray-300 rounded shadow-lg"
  >
    <div>
      <div>
        <span className="font-semibold text-lg text-white">{note.title}</span>
        <span className="ml-2 text-sm text-blue-500">Level: {note.level}</span>
        <span className="ml-2 text-sm text-green-500">
          Data Type:{note.type}
        </span>
      </div>

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
        View
        {/* {note.threadID} */}
        {/* {note.id} */}
      </button>
      <button
        onClick={() => deleteNote(note.id, note.threadID)}
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
  const [level, setLevel] = useState("Easy");
  const [type, setType] = useState("Array");
  const [isLoading, setIsLoading] = useState(false);

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

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo-0125",
  });

  const addNote = async () => {
    setIsLoading(true);
    const response = await fetch("/api/createThread", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newNoteTitle, model: model }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create thread: ${response.statusText}`);
    }
    const res = await response.json();
    const threadID = res.threadId.id;

    if (newNoteTitle) {
      // Create the note via the API
      await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newNoteTitle,
          level: level,
          threadID: threadID,
          type: type,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Create a new note with the data from the response
          const newNote: Note = {
            id: data.ID,
            title: data.Title,
            level: data.Level,
            type: data.Type,
            threadID: data.ThreadID,
            created_at: new Date(data.CreatedAt),
            updated_at: new Date(data.UpdatedAt),
          };

          // Add the new note to the local state
          dispatch({ type: "ADD_NOTE", note: newNote });
        });

      setNewNoteTitle("");
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: number, threadID: string) => {
    // Delete the note via the API
    setIsLoading(true);
    const response = await fetch(`/api/deleteThread/${threadID}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete thread");
    }

    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    }).then(() => {
      // Remove the note from the local state
      dispatch({ type: "DELETE_NOTE", id });
    });
    setIsLoading(false);
  };

  return (
    <div className="mx-auto p-10 min-w-screen min-h-screen bg-gray-800   text-white">
      <div className="mb-4 flex  items-center ">
        <TextInput
          type="text"
          value={newNoteTitle}
          className="w-2/5"
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Enter note title"
        />
        <Select
          value={level}
          onValueChange={setLevel}
          placeholder="Easy"
          className="ml-2 w-1/4 bg-gray-700 text-white"
        >
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </Select>

        <Select
          value={type}
          onValueChange={setType}
          placeholder="Array"
          className="ml-2 w-1/4 bg-gray-700 text-white"
        >
          <SelectItem value="Array">Array</SelectItem>
          <SelectItem value="Linked-list">Linked List</SelectItem>
          <SelectItem value="Tree">Tree</SelectItem>
          <SelectItem value="Heap">Heap</SelectItem>
          <SelectItem value="Backtrack">Backtracking</SelectItem>
          <SelectItem value="Graph">Graph</SelectItem>
          <SelectItem value="Dynamic-Programming">
            Dynamic Programming
          </SelectItem>
        </Select>

        <button
          onClick={addNote}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Note
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="flex items-center justify-center space-x-2">
            <LoaderIcon size={30} className="animate-spin text-blue-500" />
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              deleteNote={deleteNote}
              router={router}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
