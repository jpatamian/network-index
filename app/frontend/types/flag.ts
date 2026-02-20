export type FlaggableType = "Post" | "Comment";

export interface FlagReview {
  id: number;
  reason: string;
  description: string | null;
  status: string;
  is_auto_flagged: boolean;
  created_at: string;
  other_flags_count: number;
  flaggable_type: FlaggableType;
  flaggable_id: number;
  flagger: {
    id: number | null;
    name: string;
  };
  flaggable?: {
    title?: string;
    content?: string;
    message?: string;
    post_id?: number;
  };
}

export type PostFlagTarget = { target: "post"; postId: number };

export type CommentFlagTarget = {
  target: "comment";
  postId: number;
  commentId: number;
};

export type FlagTarget = PostFlagTarget | CommentFlagTarget;

export type FlagButtonProps = FlagTarget & {
  isDisabled?: boolean;
  ariaLabel?: string;
};
