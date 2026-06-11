import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Background from "../components/effects/Background";
import LoadingSpinner from "../components/effects/LoadingSpinner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!captchaToken) { setError("Please complete the CAPTCHA"); return; }
      setSubmitting(true);
      const response = await login(email, password, captchaToken);
      if (response?.requires2fa) {
        navigate("/verify-2fa", { state: { userId: response.userId } });
        return;
      }
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-app)", padding: "24px", position: "relative", overflow: "hidden" }}>
      <Background />

      {/* Ambient glows */}
      <div style={{
        position: "absolute", width: "40vw", height: "40vw", borderRadius: "50%",
        background: "var(--c-primary)", filter: "blur(100px)", opacity: 0.06,
        top: "-10%", left: "-10%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "40vw", height: "40vw", borderRadius: "50%",
        background: "var(--c-accent, #b026ff)", filter: "blur(100px)", opacity: 0.06,
        bottom: "-10%", right: "-10%", pointerEvents: "none",
      }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* Logo */}
        <div className="auth-logo">
          <motion.div
            className="auth-logo-icon"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </motion.div>
          <div className="auth-app-name">ChatSphere</div>
          <div className="auth-subtitle">Sign in to continue messaging</div>
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
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              Password
              <Link to="/forgot-password" style={{ color: "var(--c-primary)", fontWeight: 500, textDecoration: "none", fontSize: "0.82rem" }}>
                Forgot?
              </Link>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={setCaptchaToken}
              theme="dark"
            />
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner size={20} /> : "Log In"}
          </button>
        </form>

        <div className="auth-alt-link">
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </div>

        {/* E2EE notice */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "20px",
          fontSize: "0.75rem",
          color: "var(--text-3)",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Your messages are end-to-end encrypted
        </div>
      </motion.div>
    </div>
  );
}
