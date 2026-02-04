import { useState } from "react";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useTypingIndicator } from "../../hooks/useTypingIndicator";
import { isValidMessage } from "../../utils/validators";

/**
 * Props:
 *  - aesKey (passed from higher level after key setup)
 */
export default function MessageInput({ aesKey }) {
  const [text, setText] = useState("");
  const { sendMessage } = useMessageSender(aesKey);
  const { startTyping } = useTypingIndicator();

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidMessage(text)) return;

    await sendMessage(text);
    setText("");
  };

  return (
    <form className="message-input" onSubmit={submit}>
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          startTyping();
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}
