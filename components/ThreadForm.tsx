import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Session } from "next-auth";

interface ThreadFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  session: Session | null;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ prompt, setPrompt, sendMessage, session }) => (
  <div className="w-full px-4 py-3"> {/* Slightly reduced horizontal padding */}
    <form id="thread-form" onSubmit={sendMessage} className="flex items-center justify-between max-w-3xl mx-auto">
        <textarea
      className="flex-grow p-3 text-base text-white placeholder-gray-400 rounded-l-full focus:outline-none bg-gray-700 border border-gray-600 resize-none h-14"
      placeholder="Send your message..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // This will prevent the default action of the key press
          document.getElementById('thread-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          // The addition of `bubbles: true` makes sure the event bubbles up through the DOM which may be necessary depending on your event listeners
        }
      }}
    />
      <button
        type="submit"
        
        disabled={!prompt || !session}
        className="px-4 py-2 text-base font-medium text-white bg-blue-500 rounded-r-full disabled:opacity-50 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 h-14 disabled:cursor-not-allowed" // Reduced x-axis padding from px-5 to px-4, y-axis padding from py-3 to py-2
      >
        <PaperAirplaneIcon className="w-5 h-5" /> 
      </button>
    </form>
  </div>
);


export default ThreadForm;
