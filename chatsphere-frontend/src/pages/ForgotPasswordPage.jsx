import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { forgotPassword } from "../api/authApi";

const MailIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to send reset email. Please check your email address.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-app)",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "40vw", height: "40vw", borderRadius: "50%",
        background: "var(--c-primary)", filter: "blur(120px)", opacity: 0.05,
        top: "-15%", right: "-10%", pointerEvents: "none",
      }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            // ── Success state ──
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "8px 0" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(37,211,102,0.12)",
                  border: "2px solid rgba(37,211,102,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "var(--online)",
                }}
              >
                <CheckIcon />
              </motion.div>

              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "10px" }}>
                Check your inbox!
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "24px" }}>
                We've sent a password reset link to <strong style={{ color: "var(--text-1)" }}>{email}</strong>.
                The link expires in 1 hour.
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-3)", lineHeight: 1.6, marginBottom: "28px" }}>
                Didn't receive it? Check your spam folder, or{" "}
                <button
                  onClick={() => setSuccess(false)}
                  style={{ background: "none", border: "none", color: "var(--c-primary)", cursor: "pointer", fontWeight: 600, padding: 0, fontSize: "inherit" }}
                >
                  try again
                </button>.
              </p>
              <Link
                to="/login"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  color: "var(--c-primary)", fontWeight: 600, textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                <BackIcon /> Back to Login
              </Link>
            </motion.div>
          ) : (
            // ── Form state ──
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className="auth-logo">
                <div className="auth-logo-icon" style={{ background: "var(--c-primary)" }}>
                  <MailIcon />
                </div>
                <div className="auth-app-name">Forgot Password?</div>
                <div className="auth-subtitle">
                  Enter your email and we'll send you a reset link
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#ef4444",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "0.86rem",
                      marginBottom: "16px",
                      display: "flex", alignItems: "flex-start", gap: "8px",
                    }}
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading || !email}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Sending…
                    </span>
                  ) : "Send Reset Link"}
                </button>
              </form>

              <div className="auth-alt-link" style={{ marginTop: "20px" }}>
                <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <BackIcon /> Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
