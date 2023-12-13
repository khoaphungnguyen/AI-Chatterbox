'use client'
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Session } from "next-auth";

interface ThreadFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => void; // Changed to accept a message string
  session: Session | null;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ prompt, setPrompt, sendMessage, session }) => {
  // Handler for the Enter key without Shift
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(prompt); // Call sendMessage directly with the current prompt
    }
  };

  // Handler for the form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(prompt); // Call sendMessage directly with the current prompt
  };

  return (
    <div className="w-full px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-center justify-between max-w-3xl mx-auto">
        <textarea
          className="flex-grow p-3 text-base text-white placeholder-gray-400 rounded-l-full focus:outline-none bg-gray-700 border border-gray-600 resize-none h-14"
          placeholder="Send your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          disabled={!prompt || !session}
          className="px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-r-full disabled:opacity-50 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 h-14 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ThreadForm;
