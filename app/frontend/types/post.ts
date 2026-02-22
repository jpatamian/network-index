export const POST_TYPE_VALUES = [
  "other",
  "childcare",
  "ride_share",
  "food",
] as const;

export type PostType = (typeof POST_TYPE_VALUES)[number];
export type PostTypeFilter = PostType | "all";

export interface Post {
  id: number;
  title: string;
  content: string;
  post_type: PostType;
  metadata: Record<string, string | number | boolean | null>;
  likes_count: number;
  liked_by_current_user: boolean;
  author: {
    id: number;
    name: string;
    username: string | null;
    email: string | null;
  };
  comment_count: number;
  created_at: string;
  updated_at: string;
  zipcode?: string;
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
  post_type: PostType;
  metadata?: Record<string, string | number | boolean | null>;
  zipcode?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  post_type?: PostType;
  metadata?: Record<string, string | number | boolean | null>;
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
}

export interface SearchAndFilterProps {
  state: {
    zipcodeInput: string;
    queryInput: string;
    postTypeInput: PostTypeFilter;
    radiusInput: string;
    canResetSearch: boolean;
  };
  actions: {
    onZipcodeInputChange: (value: string) => void;
    onQueryInputChange: (value: string) => void;
    onPostTypeInputChange: (value: PostTypeFilter) => void;
    onRadiusInputChange: (value: string) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onSearchReset: () => void;
  };
}

export const PostTypeEnum = {
  OTHER: "other",
  CHILDCARE: "childcare",
  RIDE_SHARE: "ride_share",
  FOOD: "food",
} as const;
