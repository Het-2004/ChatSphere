import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { resetPassword } from "../api/authApi";

const LockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

function PasswordStrength({ password }) {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][passed];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#00a884"][passed];
  const barWidth = `${(passed / 5) * 100}%`;

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ height: "4px", background: "var(--bg-elevated)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: barWidth, height: "100%", background: strengthColor, borderRadius: "2px", transition: "all 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>
          {!checks.length && "Min 8 characters"}
          {checks.length && !checks.upper && "Add uppercase"}
          {checks.length && checks.upper && !checks.number && "Add a number"}
        </span>
        <span style={{ fontSize: "0.72rem", color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-app)", padding: "24px" }}>
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ color: "var(--text-1)", fontSize: "1.2rem", marginBottom: "10px" }}>Invalid Reset Link</h2>
          <p style={{ color: "var(--text-2)", fontSize: "0.88rem", marginBottom: "24px" }}>
            This reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" className="auth-submit-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center", padding: "12px 28px" }}>
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      // Auto-redirect after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to reset password. The link may have expired.";
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
        bottom: "-15%", left: "-10%", pointerEvents: "none",
      }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <AnimatePresence mode="wait">
          {success ? (
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
                Password Reset!
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "8px" }}>
                Your password has been changed successfully.
              </p>
              <p style={{ fontSize: "0.83rem", color: "var(--text-3)", marginBottom: "28px" }}>
                Redirecting you to login in a moment…
              </p>
              <Link to="/login" className="auth-submit-btn" style={{ display: "inline-block", textDecoration: "none", textAlign: "center", padding: "12px 32px" }}>
                Go to Login
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="auth-logo">
                <div className="auth-logo-icon" style={{ background: "var(--c-primary)" }}>
                  <LockIcon />
                </div>
                <div className="auth-app-name">Set New Password</div>
                <div className="auth-subtitle">Choose a strong password for your account</div>
              </div>

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
                    <span>⚠️</span><span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="auth-form" onSubmit={handleSubmit}>
                {/* New password */}
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoFocus
                      style={{ paddingRight: "46px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", color: "var(--text-3)", cursor: "pointer",
                        display: "flex", padding: "4px",
                      }}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                {/* Confirm password */}
                <div className="form-group">
                  <label className="form-label">
                    Confirm Password
                    {confirmPassword && (
                      <span style={{
                        marginLeft: "8px",
                        fontSize: "0.75rem",
                        color: password === confirmPassword ? "var(--online)" : "#ef4444",
                      }}>
                        {password === confirmPassword ? "✓ Matches" : "✗ Doesn't match"}
                      </span>
                    )}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="form-input"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      style={{ paddingRight: "46px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(p => !p)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", color: "var(--text-3)", cursor: "pointer",
                        display: "flex", padding: "4px",
                      }}
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading || !password || !confirmPassword}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Resetting…
                    </span>
                  ) : "Reset Password"}
                </button>
              </form>

              <div className="auth-alt-link">
                <Link to="/login">← Back to Login</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
