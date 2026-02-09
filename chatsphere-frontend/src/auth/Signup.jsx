import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signupApi } from "../api/authApi";
import { sanitizeEmail } from "../utils/sanitize";
import { validateEmail, validatePassword, getPasswordStrength } from "../utils/validation";
import Background from "../components/effects/Background";
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
  const [captchaToken, setCaptchaToken] = useState(null);

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

    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

    try {
      setSubmitting(true);
      await signupApi(email, password, captchaToken);
      setSuccess(true);
      // Wait for success animation
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      // Clean error presentation
      const msg = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(msg.replace("CAPTCHA", "Security check"));
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
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="success-state"
              >
                <div className="success-icon-wrapper">
                  <motion.div
                    className="success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    ✓
                  </motion.div>
                  <div className="success-ring" />
                </div>
                <h2>Welcome Aboard!</h2>
                <p>Redirecting you to login...</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="form-state">
                <header className="auth-header">
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-text"
                  >
                    Create Account
                  </motion.h1>
                  <p className="subtitle">Join the future of communication</p>
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

                  {/* Password Strength Meter */}
                  <div className="strength-meter">
                    <div className="strength-bars">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`strength-bar ${level <= passwordStrength.strength ? 'active' : ''}`}
                          style={{ '--bar-color': passwordStrength.color }}
                        />
                      ))}
                    </div>
                    <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                  </div>

                  <div className="input-group">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder=" "
                      className="floating-input"
                    />
                    <label className="floating-label">Confirm Password</label>
                    <div className="input-highlight" />
                  </div>

                  <div className="input-group" style={{ display: 'flex', justifyContent: 'center' }}>
                    <ReCAPTCHA
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      onChange={setCaptchaToken}
                      theme="dark"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="btn-primary btn-block btn-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px var(--color-primary)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                  >
                    {submitting ? <LoadingSpinner size={24} /> : "Sign Up"}
                  </motion.button>
                </form>

                <footer className="auth-footer">
                  <p>Already have an account? <Link to="/login" className="link-hover">Log In</Link></p>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        .modern-auth {
          perspective: 1000px;
          overflow: hidden;
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
          margin-bottom: 0.5rem;
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
          background: var(--bg-primary); /* Matches bg to hide line if needed, or transparent */
          backdrop-filter: blur(10px);
          border-radius: 4px;
        }

        .strength-meter {
          margin-top: -10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
          margin-right: 10px;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-bar.active {
          background: var(--bar-color);
          box-shadow: 0 0 10px var(--bar-color);
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

        .success-icon-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: var(--color-success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: white;
          z-index: 2;
          box-shadow: 0 0 30px var(--color-success);
        }

        .success-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid var(--color-success);
          border-radius: 50%;
          animation: ripple 1.5s infinite;
        }

        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
