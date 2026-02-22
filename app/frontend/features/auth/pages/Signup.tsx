import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { useFormData } from "@/hooks/useFormData";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleClientIdConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const { formData, handleChange } = useFormData({
    email: "",
    username: "",
    zipcode: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup(formData);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (!credential) {
      setError("Google authentication failed");
      return;
    }
    setError("");
    try {
      await loginWithGoogle(credential);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google signup failed");
    }
  };

  return (
    <div className="wire-auth-page">
      <div className="wire-auth-title">create account</div>

      {googleClientIdConfigured && (
        <>
          <div style={{ marginBottom: "8px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => setError("Google authentication failed")}
              text="continue_with"
              size="medium"
            />
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
            you can add your zipcode later on your profile page.
          </div>
          <div className="wire-or-divider">or sign up with email</div>
        </>
      )}

      {error && <div className="wire-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="wire-form-row">
          <label htmlFor="email">email: *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div className="wire-form-row">
          <label htmlFor="username">username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="optional"
            autoComplete="username"
          />
        </div>
        <div className="wire-form-row">
          <label htmlFor="zipcode">zipcode: *</label>
          <input
            id="zipcode"
            name="zipcode"
            type="text"
            value={formData.zipcode}
            onChange={handleChange}
            required
            maxLength={10}
          />
        </div>
        <div className="wire-form-row">
          <label htmlFor="password">password: *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="wire-form-row">
          <label htmlFor="password_confirmation">confirm: *</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        <div style={{ fontSize: "11px", color: "#666", margin: "8px 0" }}>
          by creating an account, you agree to our{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>terms of use</a>.
        </div>

        <div className="wire-form-actions">
          <button
            type="submit"
            className="wire-btn wire-btn-primary"
            disabled={loading}
          >
            {loading ? "creating account..." : "create account"}
          </button>
        </div>
      </form>

      <div className="wire-auth-alt">
        already have an account?{" "}
        <Link to="/login">log in</Link>
      </div>
    </div>
  );
}
