import { useState } from "react";
import { signupApi } from "../api/authApi";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await signupApi(email, password);
    alert("Signup successful. Please login.");
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Signup</button>
    </div>
  );
}
