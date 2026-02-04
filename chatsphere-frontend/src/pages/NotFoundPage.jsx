import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#020617",
        color: "#e5e7eb",
        textAlign: "center"
      }}
    >
      <div>
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/" style={{ color: "#22c55e" }}>
          Go to Chat
        </Link>
      </div>
    </div>
  );
}
