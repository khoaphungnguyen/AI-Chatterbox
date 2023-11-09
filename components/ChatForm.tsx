import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Session } from "next-auth";
// Define a type for the props
interface ChatFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  session: Session | null;
}

const ChatForm: React.FC<ChatFormProps> = ({ prompt, setPrompt, sendMessage, session }) => (
  <div className="w-full px-4 py-3"> {/* Slightly reduced horizontal padding */}
    <form onSubmit={sendMessage} className="flex items-center justify-between max-w-3xl mx-auto">
      <textarea
        className="flex-grow p-3 text-base text-white placeholder-gray-400 rounded-l-full focus:outline-none bg-gray-700 border border-gray-600 resize-none h-14" // Minor border color adjustment for better contrast
        placeholder="Send your message..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
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


export default ChatForm;
