import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
interface Suggestion {
  title: string;
  content: string;
}

interface SuggestionsSectionProps {
  suggestions?: Suggestion[];
  error?: string;
  loading: boolean; 
  sendMessage: (message: string) => void;

}

interface SuggestionsGridProps {
  suggestions: Suggestion[];
  sendMessage: (message: string) => void;
}

const SuggestionSkeleton = () => (
  <div className="border rounded-xl p-2 border-gray-500/20 hover:border-gray-100 animate-pulse">
    <div className="h-10 w-28 bg-gray-300/20 rounded-md mb-2"></div>
    <div className="h-4 bg-gray-300/20 rounded mb-1"></div>
   
  </div>
);

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ suggestions, error, loading, sendMessage  }) => (
  <div className="mt-12 mx-4 my-8">
    {error && <div className="text-center text-red-500">{error}</div>}
    {loading && (
      <>
        <div className="flex justify-center items-center mb-4">
          <ArrowRightCircleIcon className="animate-spin h-5 w-5 mr-3 text-gray-300" aria-hidden="true" />
          <span className="text-gray-300">Loading suggestions...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {[...Array(4)].map((_, index) => (
            <SuggestionSkeleton key={index} />
          ))}
        </div>
      </>
    )}
    {!loading && suggestions && suggestions.length === 0 && !error && (
      <div className="text-center text-gray-500">No suggestions available.</div>
    )}
    {suggestions && suggestions.length > 0 && <SuggestionsGrid suggestions={suggestions}  sendMessage={sendMessage} />}
  </div>
);


const SuggestionsGrid: React.FC<SuggestionsGridProps> = ({ suggestions, sendMessage  }) => {
  const handleButtonClick = (content: string) => {
    sendMessage(content);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {suggestions.map((suggestion, index) => (
        <form key={index} onSubmit={(e) => { e.preventDefault(); handleButtonClick(suggestion.content); }}>
          <div className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
            <button type="submit" className="btn relative btn-neutral group w-full rounded-xl text-left shadow-md text-gray-300">
              <div className="p-2">
                <div className="font-semibold">{suggestion.title}</div>
                <div className="opacity-50">{suggestion.content}</div>
              </div>
            </button>
          </div>
        </form>
      ))}
    </div>
  );
};

export default SuggestionsSection;
