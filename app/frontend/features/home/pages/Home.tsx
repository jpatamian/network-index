import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const locationLabel = user?.zipcode
    ? `local wire · ${user.zipcode}`
    : "local wire";

  return (
    <div className="wire-home">
      {/* Top bar: location + search */}
      <div className="wire-home-top">
        <div>
          <span className="wire-home-location">{locationLabel}</span>
          {isAuthenticated && user && (
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              welcome back, {user.username || user.email}
              {" · "}
              <Link to="/profile">my account</Link>
            </div>
          )}
          {!isAuthenticated && (
            <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
              <Link to="/login">log in</Link>
              {" or "}
              <Link to="/signup">create account</Link>
              {" to personalize your feed"}
            </div>
          )}
        </div>
        <div className="wire-home-search">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
              navigate(`/posts?query=${encodeURIComponent(q)}`);
            }}
          >
            <input type="text" name="q" placeholder="search local wire" />
            {" "}
            <button type="submit" className="wire-btn wire-btn-sm">go</button>
          </form>
        </div>
      </div>

      {/* Category grid */}
      <div className="wire-category-grid">

        {/* Community */}
        <div className="wire-category-section">
          <Link to="/posts" className="wire-category-title">community</Link>
          <ul className="wire-category-links">
            <li><Link to="/posts?post_type=childcare">childcare</Link></li>
            <li><Link to="/posts?post_type=ride_share">ride share</Link></li>
            <li><Link to="/posts?post_type=food">food sharing</Link></li>
            <li><Link to="/posts?post_type=other">general help</Link></li>
            <li><Link to="/posts">all posts</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="wire-category-section">
          <span className="wire-category-title" style={{ cursor: "default" }}>resources</span>
          <ul className="wire-category-links">
            <li>
              <a
                href="https://www.211.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                211 helpline
              </a>
            </li>
            <li>
              <a
                href="https://www.foodpantries.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                food pantries
              </a>
            </li>
            <li>
              <a
                href="https://www.needhelppayingbills.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                bill assistance
              </a>
            </li>
            <li>
              <a
                href="https://www.benefits.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                benefits.gov
              </a>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div className="wire-category-section">
          <span className="wire-category-title" style={{ cursor: "default" }}>account</span>
          <ul className="wire-category-links">
            {isAuthenticated ? (
              <>
                <li><Link to="/profile">my account</Link></li>
                <li><Link to="/posts?mine=true">my posts</Link></li>
                <li><Link to="/posts/new">create post</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login">log in</Link></li>
                <li><Link to="/signup">create account</Link></li>
                <li><Link to="/posts/new">post anonymously</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Childcare */}
        <div className="wire-category-section">
          <Link to="/posts?post_type=childcare" className="wire-category-title">childcare</Link>
          <ul className="wire-category-links">
            <li><Link to="/posts?post_type=childcare">childcare requests</Link></li>
            <li><Link to="/posts?post_type=childcare">childcare offers</Link></li>
            <li><Link to="/posts/new">post a childcare need</Link></li>
          </ul>
        </div>

        {/* Ride Share */}
        <div className="wire-category-section">
          <Link to="/posts?post_type=ride_share" className="wire-category-title">ride share</Link>
          <ul className="wire-category-links">
            <li><Link to="/posts?post_type=ride_share">ride requests</Link></li>
            <li><Link to="/posts?post_type=ride_share">ride offers</Link></li>
            <li><Link to="/posts/new">post a ride need</Link></li>
          </ul>
        </div>

        {/* Food */}
        <div className="wire-category-section">
          <Link to="/posts?post_type=food" className="wire-category-title">food</Link>
          <ul className="wire-category-links">
            <li><Link to="/posts?post_type=food">food needed</Link></li>
            <li><Link to="/posts?post_type=food">food offered</Link></li>
            <li><Link to="/posts/new">post a food need</Link></li>
          </ul>
        </div>

      </div>

      {/* Footer note */}
      <div style={{ marginTop: "24px", borderTop: "1px solid #d5d5d5", paddingTop: "10px", fontSize: "12px", color: "#666" }}>
        local wire is a free community mutual aid board.{" "}
        <Link to="/posts/new">post now</Link>
        {" — no account required."}
      </div>
    </div>
  );
}
