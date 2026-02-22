import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header className="wire-header">
        <div className="wire-header-inner">
          <Link to="/" className="wire-logo">
            local wire
          </Link>
          <nav className="wire-nav">
            <Link to="/">home</Link>
            <span className="wire-nav-sep"> · </span>
            <Link to="/posts">community</Link>
            <span className="wire-nav-sep"> · </span>
            <Link to="/posts/new">post</Link>
            {!isLoading && (
              <>
                <span className="wire-nav-sep"> · </span>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile">
                      {user?.username || user?.email || "account"}
                    </Link>
                    <span className="wire-nav-sep"> · </span>
                    <button onClick={handleLogout}>log out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login">log in</Link>
                    <span className="wire-nav-sep"> · </span>
                    <Link to="/signup">create account</Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="wire-footer">
        <Link to="/">local wire</Link>
        {" · "}
        <Link to="/posts">community</Link>
        {" · "}
        <Link to="/posts/new">post</Link>
        {" · "}
        <Link to="/login">account</Link>
        {" · "}
        <span>© 2026 local wire</span>
      </footer>

      <Toaster />
    </div>
  );
}
