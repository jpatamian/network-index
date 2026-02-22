import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { useFormData } from "@/hooks/useFormData";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleClientIdConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const { formData, handleChange } = useFormData({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response: CredentialResponse) => {
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
      setError(err instanceof Error ? err.message : "Google login failed");
    }
  };

  return (
    <div className="wire-auth-page">
      <div className="wire-auth-title">my account · log in</div>

      {error && <div className="wire-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="wire-form-row">
          <label htmlFor="email">email:</label>
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
          <label htmlFor="password">password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="wire-form-actions">
          <button
            type="submit"
            className="wire-btn wire-btn-primary"
            disabled={loading}
          >
            {loading ? "logging in..." : "log in"}
          </button>
        </div>
      </form>

      {googleClientIdConfigured && (
        <>
          <div className="wire-or-divider">or</div>
          <div className="wire-google-btn">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google authentication failed")}
              text="continue_with"
              size="medium"
            />
          </div>
        </>
      )}

      <div className="wire-auth-alt">
        don't have an account?{" "}
        <Link to="/signup">create account</Link>
      </div>
      <div className="wire-auth-alt" style={{ marginTop: "6px" }}>
        want to post without an account?{" "}
        <Link to="/posts/new">post anonymously</Link>
      </div>
    </div>
  );
}
