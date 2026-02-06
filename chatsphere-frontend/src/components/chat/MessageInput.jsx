import { useState } from "react";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useTypingIndicator } from "../../hooks/useTypingIndicator";
import { useChat } from "../../hooks/useChat"; // Import useChat
import { isValidMessage } from "../../utils/validators";

/**
 * Props:
 *  - aesKey (passed from higher level after key setup)
 */
import { useRef } from "react";
import { uploadFile } from "../../api/fileApi";
import AudioRecorder from "./AudioRecorder";

export default function MessageInput({ aesKey }) {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { sendMessage, sendRecordingStatus } = useMessageSender(aesKey);
  const { startTyping } = useTypingIndicator();
  const { replyingTo, setReplyingTo } = useChat();

  const fileInputRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidMessage(text)) return;

    await sendMessage(text, "TEXT", null, replyingTo?.id);
    setText("");
    setReplyingTo(null);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File too large > 50MB");
      return;
    }

    try {
      setIsUploading(true);
      const data = await uploadFile(file);

      // Determine type
      let type = "FILE";
      if (file.type.startsWith("image/")) type = "IMAGE";
      else if (file.type.startsWith("video/")) type = "VIDEO";
      else if (file.type.startsWith("audio/")) type = "AUDIO";

      await sendMessage(file.name, type, data.fileDownloadUri, replyingTo?.id);
      setReplyingTo(null);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = null;
    }
  };

  const handleAudioSend = async (fileUrl) => {
    await sendMessage("🎤 Voice Message", "AUDIO", fileUrl, replyingTo?.id);
    setReplyingTo(null);
  };

  return (
    <div className="message-input-container">
      {replyingTo && (
        <div className="reply-context-banner">
          <div className="reply-text">
            Replying to: <strong>{replyingTo.text || "Media Message"}</strong>
          </div>
          <button className="cancel-reply" onClick={() => setReplyingTo(null)}>
            ✕
          </button>
        </div>
      )}

      {isUploading && <div className="uploading-indicator">Uploading media...</div>}

      <div className="input-toolbar">
        <button className="attach-btn" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*,video/*,audio/*"
        />
      </div>

      <MessageInputForm
        text={text}
        setText={setText}
        onSubmit={submit}
        startTyping={startTyping}
      />
      <AudioRecorder
        onSend={handleAudioSend}
        onStartRecording={() => sendRecordingStatus(true)}
        onStopRecording={() => sendRecordingStatus(false)}
      />
    </div>
  );
}

function MessageInputForm({ text, setText, onSubmit, startTyping }) {
  return (
    <form className="message-input" onSubmit={onSubmit}>
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
