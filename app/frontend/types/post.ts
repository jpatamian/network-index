export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    username: string | null;
    email: string | null;
  };
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  message: string;
  author: {
    id: number;
    name: string;
    username: string | null;
  };
  created_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

export interface PostInputProps {
  setIsExpanded: (expanded: boolean) => void;
}

export interface PostsHeroProps {
  meta: {
    pageTitle: string;
    subtitle: string;
    viewingMine: boolean;
    zipcode: string | null;
  };
  filter: {
    hasFilter: boolean;
    clearFilterLabel: string;
    onClearFilter: () => void;
  };
}

export interface SearchAndFilterProps {
  state: {
    zipcodeInput: string;
    queryInput: string;
    canResetSearch: boolean;
  };
  actions: {
    onZipcodeInputChange: (value: string) => void;
    onQueryInputChange: (value: string) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onSearchReset: () => void;
  };
}
