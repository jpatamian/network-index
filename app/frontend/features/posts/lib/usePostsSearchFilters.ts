import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function usePostsSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const query = searchParams.get("q");
  const viewingMine = searchParams.get("filter") === "mine";

  const [zipcodeInput, setZipcodeInput] = useState(zipcode ?? "");
  const [queryInput, setQueryInput] = useState(query ?? "");

  const hasSearchFilters = Boolean(zipcode) || Boolean(query);
  const isSearchFormDirty =
    Boolean(zipcodeInput.trim()) || Boolean(queryInput.trim());
  const canResetSearch = hasSearchFilters || isSearchFormDirty;

  useEffect(() => {
    setZipcodeInput(zipcode ?? "");
  }, [zipcode]);

  useEffect(() => {
    setQueryInput(query ?? "");
  }, [query]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (zipcodeInput.trim()) {
      params.set("zipcode", zipcodeInput.trim());
    } else {
      params.delete("zipcode");
    }

    if (queryInput.trim()) {
      params.set("q", queryInput.trim());
    } else {
      params.delete("q");
    }

    params.delete("filter");
    setSearchParams(params);
  };

  const handleSearchReset = () => {
    setZipcodeInput("");
    setQueryInput("");

    const params = new URLSearchParams(searchParams);
    params.delete("zipcode");
    params.delete("q");
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    setZipcodeInput("");
    setQueryInput("");
    setSearchParams(new URLSearchParams());
  };

  return {
    params: {
      zipcode,
      query,
      viewingMine,
    },
    state: {
      zipcodeInput,
      queryInput,
      hasSearchFilters,
      canResetSearch,
    },
    actions: {
      setZipcodeInput,
      setQueryInput,
      handleSearchSubmit,
      handleSearchReset,
      handleClearFilter,
    },
  };
}
