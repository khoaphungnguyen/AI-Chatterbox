import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import React from "react";
import TextareaAutosize from 'react-textarea-autosize';
import useChatStore from "@/app/store/threadStore";
import { Transition } from 'react-transition-group';
interface ThreadFormProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => void;

}

const ThreadForm: React.FC<ThreadFormProps> = ({ prompt, setPrompt, sendMessage }) => {
  const { isStreaming } = useChatStore();
 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(prompt) ;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(prompt);
  };

  return (
    <div className="w-full py-10  rounded-lg shadow-md">
    <form onSubmit={handleSubmit} className="relative flex items-center justify-between max-w-3xl mx-auto rounded-lg">
      <TextareaAutosize
        minRows={1} 
        maxRows={6} 
        className="w-full p-4 pr-16 text-base lg:text-lg text-white placeholder-gray-400 rounded-xl
         bg-gray-700 focus:outline-none border border-gray-700 resize-none"
        placeholder="Send your message..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Transition in={isStreaming} timeout={500}>
        {(state) => (
          <button
            type="submit"
            disabled={!prompt}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition duration-500 
            ease-in-out hover:-translate-y-1/2 hover:scale-110 px-4 py-2 text-base font-medium text-blue-500 
            rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 
            h-14 disabled:cursor-not-allowed ${isStreaming ? 'animate-pulse' : ''}`}
          >
            {state === 'entering' || state === 'entered' ? (
              <div className="animate-bounce text-4xl">...</div>
            ) : (
              <PaperAirplaneIcon className="w-7 h-7 text-blue-500 hover:text-blue-600" />
            )}
          </button>
        )}
      </Transition>
    </form>
    <p className="mt-4 text-xs sm:text-sm text-center text-gray-500">Use AI-generated content cautiously as it may not always be accurate
     and can sometimes provide erroneous information.</p>
  </div>
  );
};

export default ThreadForm;