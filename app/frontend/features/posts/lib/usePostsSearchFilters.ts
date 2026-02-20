import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { POST_TYPE_VALUES, PostTypeFilter } from "@/types/post";

function normalizePostTypeFilter(value: string | null): PostTypeFilter {
  if (!value) {
    return "all";
  }

  if (POST_TYPE_VALUES.includes(value as (typeof POST_TYPE_VALUES)[number])) {
    return value as PostTypeFilter;
  }

  return "all";
}

export function usePostsSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const query = searchParams.get("q");
  const postTypeParam = searchParams.get("post_type");
  const viewingMine = searchParams.get("filter") === "mine";

  const [zipcodeInput, setZipcodeInput] = useState(zipcode ?? "");
  const [queryInput, setQueryInput] = useState(query ?? "");
  const [postTypeInput, setPostTypeInput] = useState<PostTypeFilter>(
    normalizePostTypeFilter(postTypeParam),
  );

  const hasSearchFilters =
    Boolean(zipcode) || Boolean(query) || Boolean(postTypeParam);
  const isSearchFormDirty =
    Boolean(zipcodeInput.trim()) ||
    Boolean(queryInput.trim()) ||
    postTypeInput !== "all";
  const canResetSearch = hasSearchFilters || isSearchFormDirty;

  useEffect(() => {
    setZipcodeInput(zipcode ?? "");
  }, [zipcode]);

  useEffect(() => {
    setQueryInput(query ?? "");
  }, [query]);

  useEffect(() => {
    setPostTypeInput(normalizePostTypeFilter(postTypeParam));
  }, [postTypeParam]);

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

    if (postTypeInput !== "all") {
      params.set("post_type", postTypeInput);
    } else {
      params.delete("post_type");
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
    params.delete("post_type");
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    setZipcodeInput("");
    setQueryInput("");
    setPostTypeInput("all");
    setSearchParams(new URLSearchParams());
  };

  return {
    params: {
      zipcode,
      query,
      postType: postTypeParam,
      viewingMine,
    },
    state: {
      zipcodeInput,
      queryInput,
      postTypeInput,
      hasSearchFilters,
      canResetSearch,
    },
    actions: {
      setZipcodeInput,
      setQueryInput,
      setPostTypeInput,
      handleSearchSubmit,
      handleSearchReset,
      handleClearFilter,
    },
  };
}
