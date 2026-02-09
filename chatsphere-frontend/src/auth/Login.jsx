import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import Background from "../components/effects/Background";
import LoadingSpinner from "../components/effects/LoadingSpinner";
import { cardVariants, shakeVariants } from "../components/animations/variants";

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
      if (!captchaToken) {
        setError("Please complete the CAPTCHA");
        return;
      }
      setSubmitting(true);
      await login(email, password, captchaToken);
      // Auth context handles redirect
    } catch (err) {
      console.error(err);
      if (err.response?.data?.requires2fa) {
        // Handle 2FA (if implemented in future updates)
        navigate("/verify-2fa", { state: { userId: err.response.data.userId } });
      } else {
        const msg = err.response?.data?.message || "Invalid email or password";
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container modern-auth">
      <Background />

      {/* Ambient Glows */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <motion.div
        className="auth-card glass-strong"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        style={{ width: "100%", maxWidth: "440px", zIndex: 10 }}
      >
        <div className="card-content">
          <motion.div key="form" className="form-state">
            <header className="auth-header">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="logo-icon"
              >
                💬
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="gradient-text"
              >
                Welcome Back
              </motion.h1>
              <p className="subtitle">Sign in to continue to ChatSphere</p>
            </header>

            <AnimatePresence>
              {error && (
                <motion.div
                  className="error-banner"
                  variants={shakeVariants}
                  initial="initial"
                  animate="shake"
                  exit={{ opacity: 0, height: 0 }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={submit} className="auth-form">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  className="floating-input"
                />
                <label className="floating-label">Email Address</label>
                <div className="input-highlight" />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=" "
                  className="floating-input"
                />
                <label className="floating-label">Password</label>
                <div className="input-highlight" />
              </div>

              <div className="input-group" style={{ display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                  onChange={setCaptchaToken}
                  theme="dark"
                />
              </div>

              <div className="form-actions">
                <Link to="/forgot-password" class="forgot-link">Forgot Password?</Link>
              </div>

              <motion.button
                type="submit"
                className="btn-primary btn-block btn-lg"
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px var(--color-primary)" }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
              >
                {submitting ? <LoadingSpinner size={24} /> : "Log In"}
              </motion.button>
            </form>

            <footer className="auth-footer">
              <p>Don't have an account? <Link to="/signup" className="link-hover">Sign Up</Link></p>
            </footer>
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        .modern-auth {
          perspective: 1000px;
          overflow: hidden;
        }
        
        .logo-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: inline-block;
          filter: drop-shadow(0 0 20px var(--color-primary));
        }
        
        .ambient-glow {
          position: absolute;
          width: 50vw;
          height: 50vw;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
          animation: float 10s ease-in-out infinite;
        }
        
        .glow-1 {
          background: var(--color-primary);
          top: -10%;
          left: -10%;
        }
        
        .glow-2 {
          background: var(--color-secondary);
          bottom: -10%;
          right: -10%;
          animation-delay: -5s;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .gradient-text {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, var(--color-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.5rem;
          letter-spacing: -1px;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .floating-input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .floating-input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(0, 243, 255, 0.1);
        }

        .floating-label {
          position: absolute;
          left: 1rem;
          top: 1rem;
          color: var(--text-tertiary);
          pointer-events: none;
          transition: all 0.3s ease;
          background: transparent;
          padding: 0 4px;
        }

        .floating-input:focus ~ .floating-label,
        .floating-input:not(:placeholder-shown) ~ .floating-label {
          top: -0.6rem;
          left: 0.8rem;
          font-size: 0.75rem;
          color: var(--color-primary);
          background: var(--bg-primary); 
          backdrop-filter: blur(10px);
          border-radius: 4px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 20px;
        }
        
        .forgot-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        
        .forgot-link:hover {
          color: var(--color-primary);
        }

        .btn-block {
          width: 100%;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 1rem;
        }

        .link-hover {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
          position: relative;
        }
        
        .link-hover::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: var(--color-primary);
          transition: width 0.3s ease;
        }
        
        .link-hover:hover::after {
          width: 100%;
        }

        .error-banner {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.5);
          color: #ff3b30;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .success-state {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
