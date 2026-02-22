import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { flagsApi, notificationsApi, usersApi, postsApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { FlagReview } from "@/types/flag";
import { NotificationItem } from "@/types/notification";
import { formatDate } from "@/lib/date";

const dateFormat: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [flagReviews, setFlagReviews] = useState<FlagReview[]>([]);
  const [seenFlags, setSeenFlags] = useState<FlagReview[]>([]);
  const [flagLoading, setFlagLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    zipcode: user?.zipcode || "",
  });

  useEffect(() => {
    if (!token) return;
    setNotifLoading(true);
    notificationsApi
      .list(token)
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setNotifLoading(false));
  }, [token]);

  useEffect(() => {
    if (!user?.is_moderator || !token) return;
    setFlagLoading(true);
    Promise.all([flagsApi.list(token, "pending"), flagsApi.list(token, "seen")])
      .then(([pending, seen]) => {
        setFlagReviews(pending);
        setSeenFlags(seen);
      })
      .catch(() => {})
      .finally(() => setFlagLoading(false));
  }, [token, user?.is_moderator]);

  const handleSave = async () => {
    if (!user || !token) return;
    setIsSaving(true);
    const updateData: Record<string, string> = {};
    if (formData.username !== user.username) updateData.username = formData.username;
    if (formData.email !== user.email) updateData.email = formData.email;
    if (formData.zipcode !== user.zipcode) updateData.zipcode = formData.zipcode;

    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      setIsSaving(false);
      return;
    }

    try {
      await usersApi.update(user.id, updateData, token);
      toaster.success({ title: "Profile updated" });
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      toaster.error({
        title: "Error updating profile",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      zipcode: user?.zipcode || "",
    });
    setIsEditing(false);
  };

  const handleAcknowledge = async (flagId: number) => {
    if (!token) return;
    try {
      await flagsApi.acknowledge(flagId, token);
      const moved = flagReviews.find((f) => f.id === flagId);
      setFlagReviews((prev) => prev.filter((f) => f.id !== flagId));
      if (moved) setSeenFlags((prev) => [moved, ...prev]);
    } catch (err) {
      toaster.error({ title: "Unable to acknowledge", description: err instanceof Error ? err.message : "" });
    }
  };

  const handleDeleteFlaggedPost = async (postId: number, flagId: number) => {
    if (!token || !confirm("Delete this post? This cannot be undone.")) return;
    try {
      await postsApi.delete(postId, token);
      await flagsApi.acknowledge(flagId, token);
      const moved = flagReviews.find((f) => f.id === flagId);
      setFlagReviews((prev) => prev.filter((f) => f.id !== flagId));
      if (moved) setSeenFlags((prev) => [moved, ...prev]);
      toaster.success({ title: "Post deleted" });
    } catch (err) {
      toaster.error({ title: "Unable to delete post", description: err instanceof Error ? err.message : "" });
    }
  };

  return (
    <ProtectedRoute>
      <div className="wire-profile">
        {/* Breadcrumb */}
        <div className="wire-breadcrumb">
          <Link to="/">local wire</Link> › my account
        </div>

        {/* Account Details */}
        <div className="wire-profile-section">
          <div className="wire-profile-section-title">
            account details
            {!isEditing && (
              <>
                {" "}
                <button
                  className="wire-btn-link"
                  style={{ fontSize: "12px" }}
                  onClick={() => setIsEditing(true)}
                >
                  edit
                </button>
              </>
            )}
          </div>
          <table className="wire-profile-table">
            <tbody>
              <tr>
                <td>username</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, username: e.target.value }))
                      }
                      style={{ font: "inherit", fontSize: "13px", border: "1px solid #aaa", padding: "2px 4px" }}
                    />
                  ) : (
                    user?.username || <span style={{ color: "#999" }}>not set</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>email</td>
                <td>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      style={{ font: "inherit", fontSize: "13px", border: "1px solid #aaa", padding: "2px 4px", width: "240px" }}
                    />
                  ) : (
                    user?.email || <span style={{ color: "#999" }}>not set</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>phone</td>
                <td>
                  {user?.phone || <span style={{ color: "#999" }}>not set</span>}
                </td>
              </tr>
              <tr>
                <td>zipcode</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.zipcode}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, zipcode: e.target.value }))
                      }
                      maxLength={10}
                      style={{ font: "inherit", fontSize: "13px", border: "1px solid #aaa", padding: "2px 4px", width: "100px" }}
                    />
                  ) : (
                    user?.zipcode || <span style={{ color: "#999" }}>not set</span>
                  )}
                </td>
              </tr>
              {user?.is_moderator && (
                <tr>
                  <td>role</td>
                  <td style={{ color: "#4a4a8a", fontWeight: "bold" }}>moderator</td>
                </tr>
              )}
            </tbody>
          </table>
          {isEditing && (
            <div style={{ padding: "8px 10px", borderTop: "1px solid #eee", display: "flex", gap: "8px" }}>
              <button
                className="wire-btn wire-btn-sm"
                onClick={handleCancel}
              >
                cancel
              </button>
              <button
                className="wire-btn wire-btn-primary wire-btn-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "saving..." : "save changes"}
              </button>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="wire-profile-section">
          <div className="wire-profile-section-title">my activity</div>
          <div style={{ padding: "8px 10px", fontSize: "13px" }}>
            <Link to="/posts?filter=mine">my posts</Link>
            {" · "}
            <Link to="/posts/new">create new post</Link>
            {" · "}
            <Link to="/posts">browse community</Link>
          </div>
        </div>

        {/* Notifications */}
        <div className="wire-profile-section">
          <div className="wire-profile-section-title">
            notifications ({notifications.length})
          </div>
          {notifLoading ? (
            <div className="wire-loading" style={{ padding: "8px 10px" }}>loading...</div>
          ) : notifications.length === 0 ? (
            <div className="wire-empty" style={{ padding: "8px 10px" }}>no notifications.</div>
          ) : (
            <div style={{ padding: "4px 10px" }}>
              {notifications.map((n) => (
                <div key={n.id} className={`wire-notification${!n.read_at ? " unread" : ""}`}>
                  <div>{n.message}</div>
                  <div className="wire-notification-meta">
                    {formatDate(n.created_at, dateFormat)}
                    {n.post_title && (
                      <>
                        {" · "}
                        <Link to={`/posts/${n.post_id}`}>{n.post_title}</Link>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Moderation queue (moderators only) */}
        {user?.is_moderator && (
          <>
            <div className="wire-profile-section">
              <div className="wire-profile-section-title">
                moderation queue ({flagReviews.length} pending)
              </div>
              {flagLoading ? (
                <div className="wire-loading" style={{ padding: "8px 10px" }}>loading...</div>
              ) : flagReviews.length === 0 ? (
                <div className="wire-empty" style={{ padding: "8px 10px" }}>no pending flags.</div>
              ) : (
                <table className="wire-table">
                  <thead>
                    <tr>
                      <th>type</th>
                      <th>content</th>
                      <th>reason</th>
                      <th>date</th>
                      <th>actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flagReviews.map((flag) => (
                      <tr key={flag.id}>
                        <td>{flag.flaggable_type}</td>
                        <td style={{ maxWidth: "300px" }}>
                          {flag.flaggable?.title || flag.flaggable?.content?.slice(0, 80) || flag.flaggable?.message?.slice(0, 80) || "—"}
                          {flag.flaggable?.post_id && (
                            <>
                              {" "}
                              <Link to={`/posts/${flag.flaggable.post_id}`} style={{ fontSize: "11px" }}>
                                view
                              </Link>
                            </>
                          )}
                        </td>
                        <td>{flag.reason}{flag.description ? `: ${flag.description}` : ""}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatDate(flag.created_at, dateFormat)}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          <button
                            className="wire-btn wire-btn-sm"
                            onClick={() => handleAcknowledge(flag.id)}
                          >
                            dismiss
                          </button>
                          {" "}
                          {flag.flaggable_type === "Post" && (
                            <button
                              className="wire-btn wire-btn-danger wire-btn-sm"
                              onClick={() =>
                                handleDeleteFlaggedPost(flag.flaggable_id, flag.id)
                              }
                            >
                              delete post
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {seenFlags.length > 0 && (
              <div className="wire-profile-section">
                <div className="wire-profile-section-title">
                  reviewed flags ({seenFlags.length})
                </div>
                <table className="wire-table">
                  <thead>
                    <tr>
                      <th>type</th>
                      <th>reason</th>
                      <th>date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seenFlags.map((flag) => (
                      <tr key={flag.id}>
                        <td>{flag.flaggable_type}</td>
                        <td>{flag.reason}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{formatDate(flag.created_at, dateFormat)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
