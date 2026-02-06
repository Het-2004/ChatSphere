import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import { isEmail } from "../utils/validators";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // 2FA State
  const [requires2fa, setRequires2fa] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otpCode, setOtpCode] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (requires2fa) {
        // Handle 2FA Verification
        const data = await verify2fa(userId, otpCode);
        login(data.token);
        navigate("/");
      } else {
        // Handle Normal Login
        const data = await loginUser({ email, password });

        if (data.requires2fa) {
          setRequires2fa(true);
          setUserId(data.userId);
          setError(null);
        } else {
          login(data.token);
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{requires2fa ? "Two-Factor Authentication" : "Login to ChatSphere"}</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!requires2fa ? (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Enter OTP Code sent to your email</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                required
              />
              <div className="otp-instructions">
                (Check server console for OTP in dev mode)
              </div>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {requires2fa ? "Verify" : "Login"}
          </button>
        </form>

        {!requires2fa && (
          <>
            <div className="auth-footer">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="auth-footer">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
