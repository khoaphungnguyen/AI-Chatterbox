"use client";

import { SearchIcon } from "lucide-react";

type Props = {
  setSearchTerm: (term: string) => void;
};

export default function Search({ setSearchTerm }: Props) {
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setSearchTerm(event.target.value);
  }

  return (
    <div className="relative mt-5 max-w-md">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="rounded-md shadow-sm">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden="true"
        >
          <SearchIcon
            className="mr-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="h-10 block w-full rounded-md border border-gray-200 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Search by name..."
          spellCheck={false}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
