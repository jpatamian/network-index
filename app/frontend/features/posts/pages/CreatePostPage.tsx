import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { postsApi } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { postsErrorMessages, toErrorMessage } from "@/features/posts/lib/utils";
import { PostType } from "@/types/post";

type Step = "gate" | "anon-email" | "form" | "submitted";

const POST_TYPE_OPTIONS: { value: PostType; label: string }[] = [
  { value: "other", label: "General Help" },
  { value: "childcare", label: "Childcare" },
  { value: "ride_share", label: "Ride Share" },
  { value: "food", label: "Food" },
];

export const CreatePostPage = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(isAuthenticated ? "form" : "gate");
  const [anonEmail, setAnonEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    zipcode: "",
    postType: "other" as PostType,
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleGateLogin = () => {
    navigate("/login?next=/posts/new");
  };

  const handleGateAnon = () => {
    setStep("anon-email");
  };

  const handleAnonEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonEmail.trim()) {
      setEmailError("Email is required to post anonymously.");
      return;
    }
    if (!termsAccepted) {
      setEmailError("You must accept the terms to continue.");
      return;
    }
    setEmailError("");
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    if (!isAuthenticated && !formData.zipcode.trim()) {
      setFormError(postsErrorMessages.anonymousZipRequired);
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      const metadata: Record<string, string> = {};
      if (!isAuthenticated && anonEmail.trim()) {
        metadata.notification_email = anonEmail.trim();
      }

      const postData: {
        title: string;
        content: string;
        post_type: PostType;
        zipcode?: string;
        metadata?: Record<string, string>;
      } = {
        title: formData.title,
        content: formData.content,
        post_type: formData.postType,
      };

      if (!isAuthenticated) {
        postData.zipcode = formData.zipcode;
        if (Object.keys(metadata).length > 0) {
          postData.metadata = metadata;
        }
      }

      const post = await postsApi.create(postData, token);

      if (isAuthenticated) {
        toaster.success({
          title: "Post published",
          description: "Your post is now live.",
        });
        navigate(`/posts/${post.id}`);
      } else {
        setStep("submitted");
      }
    } catch (err) {
      setFormError(toErrorMessage(err, postsErrorMessages.createPostFailed));
    } finally {
      setLoading(false);
    }
  };

  // Step: auth gate
  if (step === "gate") {
    return (
      <div className="wire-create-gate">
        <div className="wire-breadcrumb">
          <Link to="/">local wire</Link> › <Link to="/posts">community</Link> › create post
        </div>
        <h2 style={{ marginBottom: "14px" }}>to post on local wire, choose one:</h2>

        <div className="wire-gate-options">
          <div className="wire-gate-option" onClick={handleGateLogin}>
            <input type="radio" name="gate" readOnly />
            <div>
              <div className="wire-gate-option-label">I have an account</div>
              <div className="wire-gate-option-desc">
                log in to post with your username and manage your posts
              </div>
            </div>
          </div>
          <div className="wire-gate-option" onClick={handleGateAnon}>
            <input type="radio" name="gate" readOnly />
            <div>
              <div className="wire-gate-option-label">post anonymously</div>
              <div className="wire-gate-option-desc">
                provide an email address to verify your post — email is never shown publicly
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#666" }}>
          don't have an account? <Link to="/signup">create one</Link> — free, takes 30 seconds.
        </div>
      </div>
    );
  }

  // Step: anon email + terms
  if (step === "anon-email") {
    return (
      <div className="wire-create-gate">
        <div className="wire-breadcrumb">
          <Link to="/">local wire</Link> › <Link to="/posts">community</Link> › post anonymously
        </div>
        <h2>anonymous posting</h2>
        <div className="wire-anon-note">
          your email address is used only to confirm your post and allow future edits.
          it will never be displayed publicly or shared with anyone.
        </div>

        {emailError && <div className="wire-error">{emailError}</div>}

        <form onSubmit={handleAnonEmailContinue}>
          <div className="wire-form-row">
            <label htmlFor="anon-email">email:</label>
            <input
              id="anon-email"
              type="email"
              value={anonEmail}
              onChange={(e) => setAnonEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="wire-terms-row">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree to the local wire{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                terms of use
              </a>
              . I understand this post represents me and must be honest and respectful.
            </label>
          </div>

          <div className="wire-form-actions">
            <button
              type="button"
              className="wire-btn wire-btn-sm"
              onClick={() => setStep("gate")}
            >
              back
            </button>
            <button type="submit" className="wire-btn wire-btn-primary wire-btn-sm">
              continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step: confirmation (anon only)
  if (step === "submitted") {
    return (
      <div className="wire-create-gate">
        <div className="wire-success">
          ✓ your post has been submitted.
        </div>
        <p style={{ fontSize: "13px", marginBottom: "10px" }}>
          your post is now live in the community feed.
          {anonEmail && (
            <>
              {" "}we'll send notifications about replies to <strong>{anonEmail}</strong>.
            </>
          )}
        </p>
        <p style={{ fontSize: "13px" }}>
          <Link to="/posts">return to posts</Link>
        </p>
      </div>
    );
  }

  // Step: post form
  return (
    <div className="wire-create-gate">
      <div className="wire-breadcrumb">
        <Link to="/">local wire</Link> › <Link to="/posts">community</Link> ›{" "}
        {isAuthenticated ? "create post" : "post anonymously"}
      </div>

      <h2>{isAuthenticated ? "create post" : "post anonymously"}</h2>

      {!isAuthenticated && (
        <div className="wire-anon-note">
          posting anonymously — your email ({anonEmail}) will not be shown publicly.
        </div>
      )}

      {formError && <div className="wire-error">{formError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="wire-form-row">
          <label htmlFor="post-type">category:</label>
          <select
            id="post-type"
            value={formData.postType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                postType: e.target.value as PostType,
              }))
            }
          >
            {POST_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {!isAuthenticated && (
          <div className="wire-form-row">
            <label htmlFor="post-zip">zipcode: *</label>
            <input
              id="post-zip"
              type="text"
              value={formData.zipcode}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, zipcode: e.target.value }))
              }
              placeholder="your zipcode"
              maxLength={10}
              required
            />
          </div>
        )}

        <div className="wire-form-row">
          <label htmlFor="post-title">title: *</label>
          <input
            id="post-title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="brief, descriptive title"
            maxLength={200}
            required
          />
        </div>

        <div className="wire-form-row" style={{ alignItems: "flex-start" }}>
          <label htmlFor="post-content" style={{ paddingTop: "4px" }}>
            description: *
          </label>
          <textarea
            id="post-content"
            value={formData.content}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            placeholder="what do you need or have to offer? be specific."
            maxLength={5000}
            required
          />
        </div>

        <div className="wire-form-actions">
          <button
            type="button"
            className="wire-btn wire-btn-sm"
            onClick={() => navigate("/posts")}
          >
            cancel
          </button>
          <button
            type="submit"
            className="wire-btn wire-btn-primary wire-btn-sm"
            disabled={loading}
          >
            {loading
              ? "posting..."
              : isAuthenticated
              ? "publish post"
              : "submit post"}
          </button>
        </div>
      </form>
    </div>
  );
};
