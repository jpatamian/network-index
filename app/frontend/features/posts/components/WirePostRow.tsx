import { Link } from "react-router-dom";
import { Post } from "@/types/post";
import { formatDate } from "@/lib/date";

const POST_TYPE_LABELS: Record<Post["post_type"], string> = {
  other: "other",
  childcare: "childcare",
  ride_share: "ride share",
  food: "food",
};

const shortDateFormat: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

interface WirePostRowProps {
  post: Post;
}

export function WirePostRow({ post }: WirePostRowProps) {
  const dateStr = formatDate(post.created_at, shortDateFormat);
  const label = POST_TYPE_LABELS[post.post_type];

  return (
    <li className="wire-post-row">
      <span className="wire-post-date">{dateStr}</span>
      <Link to={`/posts/${post.id}`} className="wire-post-title-link">
        {post.title}
      </Link>
      <span className="wire-post-meta">
        {post.author.name && (
          <>
            <span style={{ color: "#999" }}>·</span>{" "}
            {post.author.name}
          </>
        )}
        {" "}
        <span className="wire-post-tag">{label}</span>
        {post.comment_count > 0 && (
          <>
            {" "}
            <span style={{ color: "#999", fontSize: "11px" }}>
              ({post.comment_count})
            </span>
          </>
        )}
      </span>
    </li>
  );
}
