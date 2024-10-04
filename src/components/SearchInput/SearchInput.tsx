/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useDestinationSearch } from "../../hooks/useDestinationSearch";

interface SearchInputProps {
  date: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: any) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSelect,
}) => {
  const { searchResults, error, debouncedFetchResults } = useDestinationSearch();
  const [query, setQuery] = useState(value);

  useEffect(() => {
    if (query.length > 2) {
      debouncedFetchResults(query);
    }
  }, [query, debouncedFetchResults]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSelect = (result: any) => {
    onSelect(result);
    setQuery(""); 
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Add a new destination"
        className="w-full bg-gray-100 mt-3 dark:text-primary rounded-full p-2"
      />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {query && searchResults.length > 0 && (
        <ul className="top-full mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-40 overflow-auto">
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleSelect(result)}
            >
              {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
