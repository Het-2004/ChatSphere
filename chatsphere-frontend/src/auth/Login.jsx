import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginApi } from "../api/authApi";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      const token = await loginApi(email, password);
      login(token);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}
