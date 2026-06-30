"use client";

import { useEffect } from "react";

type Suggestion = {
  id: string;
  name: string;
  lat: string;
  lon: string;
};

export type LocationSuggestion = Suggestion

export const useLocationSuggestions = (
  query: string | undefined,
  setSuggestions: (suggestions: Suggestion[]) => void,
) => {
  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(query)}` +
            `&format=json` +
            `&addressdetails=1` +
            `&limit=5`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = await response.json();

        const suggestions: Suggestion[] = data.map((item: any) => ({
          id: item.place_id ? String(item.place_id) : `${item.lat}-${item.lon}`,
          name: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));

        setSuggestions(suggestions);
      } catch (error) {
        if ((error as any).name !== "AbortError") {
          console.error("Autocomplete fetch error:", error);
        }
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, setSuggestions]);
};
