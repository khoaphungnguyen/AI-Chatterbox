import React from 'react';

interface Suggestion {
  title: string;
  content: string;
}

interface SuggestionsSectionProps {
  suggestions?: Suggestion[];
  error?: string;
  loading: boolean; // Added loading property
}

interface SuggestionsGridProps {
  suggestions: Suggestion[];
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ suggestions, error, loading }) => (
    <div className="mt-12 mx-4 my-8">
      {error && <div className="text-center text-red-500">{error}</div>}
      {loading && <div className="text-center text-gray-300 animate-pulse">Loading suggestions...</div>}
      {!loading && suggestions && suggestions.length === 0 && !error && (
        <div className="text-center text-gray-500">No suggestions available.</div>
      )}
      {suggestions && suggestions.length > 0 && <SuggestionsGrid suggestions={suggestions} />}
    </div>
  );
  
  

const SuggestionsGrid: React.FC<SuggestionsGridProps> = ({ suggestions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="border rounded-xl p-2 border-gray-500 hover:border-gray-100">
          <button className="btn relative btn-neutral group w-full rounded-xl text-left shadow-md text-gray-300">
            <div className="p-2">
              <div className="font-semibold">{suggestion.title}</div>
              <div className="opacity-50">{suggestion.content}</div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsSection;
