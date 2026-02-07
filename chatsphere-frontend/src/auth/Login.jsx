import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginApi, verify2fa } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { isEmail } from "../utils/validators";
import ParticlesBackground from "../components/effects/ParticlesBackground";
import LoadingSpinner from "../components/effects/LoadingSpinner";
import { cardVariants, buttonVariants, shakeVariants } from "../components/animations/variants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2FA State
  const [requires2fa, setRequires2fa] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otpCode, setOtpCode] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (requires2fa) {
        // Handle 2FA Verification
        const data = await verify2fa(userId, otpCode);
        login(data.token);
        navigate("/");
      } else {
        // Handle Normal Login
        const data = await loginApi(email, password);

        if (data.requires2fa) {
          setRequires2fa(true);
          setUserId(data.userId);
        } else {
          login(data);
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
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
          {requires2fa ? "Two-Factor Authentication" : "Welcome Back"}
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          {!requires2fa ? (
            <>
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
                  placeholder="Enter your password"
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
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <label style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: "500" }}>
                Verification Code
              </label>
              <motion.input
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                maxLength={6}
                whileFocus={{ scale: 1.02 }}
                style={{
                  width: "100%",
                  padding: "var(--spacing-md)",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontSize: "1.5rem",
                  textAlign: "center",
                  letterSpacing: "0.5rem",
                  transition: "all var(--transition-base)",
                }}
              />
            </motion.div>
          )}

          <motion.button
            type="submit"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={loading}
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "var(--shadow-md)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <LoadingSpinner size={24} />
            ) : (
              <span>{requires2fa ? "Verify" : "Login"}</span>
            )}

            {/* Shimmer effect */}
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
              animate={{
                left: ["100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          </motion.button>

          {!requires2fa && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)",
                marginTop: "var(--spacing-md)",
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "var(--color-primary)",
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  transition: "all var(--transition-base)",
                }}
              >
                Forgot Password?
              </Link>

              <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "all var(--transition-base)",
                  }}
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
