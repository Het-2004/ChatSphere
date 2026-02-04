import { useState } from "react";

export default function MessageInput() {
  const [msg, setMsg] = useState("");
  return (
    <div className="input-box">
      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button>Send</button>
    </div>
  );
}
