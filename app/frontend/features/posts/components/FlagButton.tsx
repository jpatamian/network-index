import { useState, useRef, useEffect } from "react";
import { flagsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toaster } from "@/components/ui/toaster";
import { FlagButtonProps } from "@/types/flag";

const FLAG_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "profanity", label: "Profanity" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "off_topic", label: "Off-topic" },
  { value: "other", label: "Other" },
];

export const FlagButton = ({ isDisabled, ariaLabel, ...target }: FlagButtonProps) => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!token) return;
    const trimmed = description.trim();
    if (reason === "other" && !trimmed) {
      setError("Please share a short explanation.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = { reason, description: trimmed || undefined };
      if (target.target === "post") {
        await flagsApi.createForPost(target.postId, payload, token);
      } else {
        await flagsApi.createForComment(target.postId, target.commentId, payload, token);
      }
      setSubmitted(true);
      setIsOpen(false);
      toaster.success({ title: "Thanks for reporting", description: "We'll review this soon." });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        aria-label={ariaLabel || "flag"}
        className="wire-btn-link"
        style={{
          fontSize: "11px",
          color: submitted ? "#c33" : "#999",
        }}
        disabled={isDisabled || submitted}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {submitted ? "flagged" : "flag"}
      </button>

      {isOpen && !submitted && (
        <div className="wire-flag-popover">
          <div style={{ marginBottom: "4px", fontWeight: "bold", color: "#333" }}>
            why are you reporting this?
          </div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {FLAG_REASONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {reason === "other" && (
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="short explanation"
            />
          )}
          {error && (
            <div style={{ color: "#c33", fontSize: "11px", marginBottom: "4px" }}>
              {error}
            </div>
          )}
          <div className="wire-flag-actions">
            <button
              className="wire-btn wire-btn-sm"
              onClick={() => setIsOpen(false)}
            >
              cancel
            </button>
            <button
              className="wire-btn wire-btn-primary wire-btn-sm"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "submitting..." : "submit"}
            </button>
          </div>
        </div>
      )}
    </span>
  );
};
