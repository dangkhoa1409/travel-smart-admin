/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import debounce from "lodash.debounce";

export const useDestinationSearch = () => {
  const provider = new OpenStreetMapProvider();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async (query: string) => {
    try {
      const results = await provider.search({ query });
      setSearchResults(results);
      setError(null);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      console.error("Search Error:", err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchResults = useCallback(
    debounce((query: string) => fetchResults(query), 300),
    []
  );

  return { searchResults, error, debouncedFetchResults };
};
