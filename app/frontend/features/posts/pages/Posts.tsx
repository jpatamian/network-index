import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { WirePostRow } from "@/features/posts/components/WirePostRow";
import { usePostsFeed } from "@/features/posts/lib/usePostsFeed";
import { usePostsSearchFilters } from "@/features/posts/lib/usePostsSearchFilters";
import { PostTypeFilter } from "@/types/post";

const POST_TYPE_OPTIONS: { value: PostTypeFilter; label: string }[] = [
  { value: "all", label: "all types" },
  { value: "other", label: "general" },
  { value: "childcare", label: "childcare" },
  { value: "ride_share", label: "ride share" },
  { value: "food", label: "food" },
];

export const Posts = () => {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const { params, state, actions } = usePostsSearchFilters();
  const { zipcode, query, postType, viewingMine } = params;

  const { posts, loading, error, handlePostDeleted } = usePostsFeed({
    viewingMine,
    zipcode,
    query,
    postType,
    token,
    isAuthenticated,
    isAuthLoading,
  });

  const pageTitle = viewingMine
    ? "my posts"
    : zipcode
    ? `posts near ${zipcode}`
    : "community posts";

  return (
    <div className="wire-page wire-container">
      {/* Breadcrumb */}
      <div className="wire-breadcrumb">
        <Link to="/">local wire</Link>
        {" > "}
        <Link to="/posts">community</Link>
        {viewingMine && " > my posts"}
        {zipcode && !viewingMine && ` > ${zipcode}`}
      </div>

      {/* Header row */}
      <div className="wire-posts-header">
        <span className="wire-posts-title">{pageTitle}</span>
        <div className="wire-posts-actions">
          {isAuthenticated && !viewingMine && (
            <Link
              to="/posts?filter=mine"
              style={{ fontSize: "13px", color: "#4a4a8a" }}
            >
              my posts
            </Link>
          )}
          {viewingMine && (
            <Link
              to="/posts"
              style={{ fontSize: "13px", color: "#4a4a8a" }}
            >
              all posts
            </Link>
          )}
          <button
            className="wire-btn wire-btn-primary wire-btn-sm"
            onClick={() => navigate("/posts/new")}
          >
            + post
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {!viewingMine && (
        <form
          className="wire-filter-bar"
          onSubmit={actions.handleSearchSubmit}
        >
          <div className="wire-filter-group">
            <label htmlFor="filter-type">type:</label>
            <select
              id="filter-type"
              value={state.postTypeInput}
              onChange={(e) =>
                actions.setPostTypeInput(e.target.value as PostTypeFilter)
              }
            >
              {POST_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="wire-filter-group">
            <label htmlFor="filter-zip">zip:</label>
            <input
              id="filter-zip"
              type="text"
              value={state.zipcodeInput}
              onChange={(e) => actions.setZipcodeInput(e.target.value)}
              placeholder="zipcode"
              maxLength={10}
            />
          </div>

          <div className="wire-filter-group">
            <label htmlFor="filter-search">search:</label>
            <input
              id="filter-search"
              type="text"
              value={state.queryInput}
              onChange={(e) => actions.setQueryInput(e.target.value)}
              placeholder='try "rides to market"'
            />
          </div>

          <button type="submit" className="wire-btn wire-btn-sm">
            apply
          </button>
          {state.canResetSearch && (
            <button
              type="button"
              className="wire-btn wire-btn-sm"
              onClick={actions.handleSearchReset}
            >
              reset
            </button>
          )}
        </form>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="wire-loading">loading posts...</div>
      ) : error ? (
        <div className="wire-error">{error}</div>
      ) : posts.length === 0 ? (
        <div className="wire-empty">
          {viewingMine
            ? "you haven't posted anything yet. "
            : "no posts found. "}
          <Link to="/posts/new">create the first post</Link>
          {state.canResetSearch && !viewingMine && (
            <>
              {" or "}
              <button
                className="wire-btn-link"
                onClick={actions.handleClearFilter}
              >
                clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <ul className="wire-post-list">
          {posts.map((post) => (
            <WirePostRow
              key={post.id}
              post={post}
            />
          ))}
        </ul>
      )}

      {/* Pagination info */}
      {!loading && posts.length > 0 && (
        <div className="wire-pagination">
          showing {posts.length} post{posts.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};
