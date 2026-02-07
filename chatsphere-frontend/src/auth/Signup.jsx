import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signupApi } from "../api/authApi";
import { sanitizeEmail } from "../utils/sanitize";
import { validateEmail, validatePassword, getPasswordStrength } from "../utils/validation";
import ParticlesBackground from "../components/effects/ParticlesBackground";
import LoadingSpinner from "../components/effects/LoadingSpinner";
import { cardVariants, buttonVariants, shakeVariants, successVariants } from "../components/animations/variants";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password strength with enhanced validation
  const passwordStrength = getPasswordStrength(password);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email);
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      setError(emailValidation.error);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await signupApi(email, password);
      setSuccess(true);

      // Redirect after success animation
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <ParticlesBackground />

      <motion.div
        className="auth-card"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Glowing orb effect */}
        <motion.div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)",
            opacity: 0.3,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              variants={successVariants}
              initial="initial"
              animate="animate"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--spacing-lg)",
                padding: "var(--spacing-xl)",
              }}
            >
              <motion.div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "var(--color-success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
              >
                ✓
              </motion.div>
              <h2 style={{ color: "var(--text-primary)", margin: 0 }}>Account Created!</h2>
              <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>
                Redirecting to login...
              </p>
            </motion.div>
          ) : (
            <motion.div key="form">
              <motion.h2
                style={{
                  textAlign: "center",
                  marginBottom: "var(--spacing-xl)",
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "2rem",
                  fontWeight: "700",
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Create Account
              </motion.h2>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    variants={shakeVariants}
                    initial="initial"
                    animate="shake"
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      padding: "var(--spacing-md)",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid var(--color-error)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--color-error)",
                      marginBottom: "var(--spacing-lg)",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500" }}>
                    Email
                  </label>
                  <motion.input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02 }}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-md)",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      transition: "all var(--transition-base)",
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500" }}>
                    Password
                  </label>
                  <motion.input
                    type="password"
                    placeholder="Create a password (min 8 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02 }}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-md)",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      transition: "all var(--transition-base)",
                    }}
                  />

                  {/* Password strength indicator */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{ marginTop: "var(--spacing-sm)" }}
                    >
                      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                        {[1, 2, 3, 4].map((level) => (
                          <motion.div
                            key={level}
                            style={{
                              flex: 1,
                              height: "4px",
                              background: level <= passwordStrength.strength ? passwordStrength.color : "var(--bg-tertiary)",
                              borderRadius: "2px",
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: level * 0.1 }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: passwordStrength.color, margin: 0 }}>
                        {passwordStrength.label}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500" }}>
                    Confirm Password
                  </label>
                  <motion.input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02 }}
                    style={{
                      width: "100%",
                      padding: "var(--spacing-md)",
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      transition: "all var(--transition-base)",
                    }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={submitting}
                  style={{
                    padding: "var(--spacing-md) var(--spacing-lg)",
                    background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: "var(--shadow-md)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {submitting ? (
                    <LoadingSpinner size={24} />
                  ) : (
                    <span>Create Account</span>
                  )}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  style={{
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    marginTop: "var(--spacing-md)",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "var(--color-primary)",
                      textDecoration: "none",
                      fontWeight: "600",
                      transition: "all var(--transition-base)",
                    }}
                  >
                    Login
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
