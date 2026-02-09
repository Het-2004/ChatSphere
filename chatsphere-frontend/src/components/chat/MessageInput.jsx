import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useTypingIndicator } from "../../hooks/useTypingIndicator";
import { useChat } from "../../hooks/useChat";
import { isValidMessage } from "../../utils/validators";
import { uploadFile } from "../../api/fileApi";
import AudioRecorder from "./AudioRecorder";
import EmojiPickerButton from "./EmojiPickerButton";
import GifPicker from "./GifPicker";
import StickerPicker from "./StickerPicker";
import MessageFormattingToolbar from "./MessageFormattingToolbar";
import { playSound } from "../../utils/notifications";

export default function MessageInput({ aesKey }) {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { sendMessage, sendRecordingStatus } = useMessageSender(aesKey);
  const { startTyping } = useTypingIndicator();
  const { replyingTo, setReplyingTo } = useChat();

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidMessage(text)) return;

    await sendMessage(text, "TEXT", null, replyingTo?.id);
    playSound("sent");
    setText("");
    setReplyingTo(null);
  };

  const handleEmojiSelect = (emoji) => {
    const cursorPos = inputRef.current?.selectionStart || text.length;
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setText(newText);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    }, 0);
  };

  const handleGifSelect = async (gifUrl) => {
    await sendMessage("GIF", "IMAGE", gifUrl, replyingTo?.id);
    playSound("sent");
    setReplyingTo(null);
  };

  const handleStickerSelect = async (sticker) => {
    await sendMessage(sticker, "TEXT", null, replyingTo?.id);
    playSound("sent");
    setReplyingTo(null);
  };

  const handleFormat = (syntax) => {
    const cursorPos = inputRef.current?.selectionStart || 0;
    const selection = inputRef.current?.selectionEnd || 0;
    const selectedText = text.slice(cursorPos, selection);

    let newText;
    if (selectedText) {
      newText = text.slice(0, cursorPos) + syntax + selectedText + syntax + text.slice(selection);
    } else {
      newText = text.slice(0, cursorPos) + syntax + syntax + text.slice(cursorPos);
    }

    setText(newText);
    setTimeout(() => {
      inputRef.current?.focus();
      const newPos = cursorPos + syntax.length;
      inputRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert("File too large > 50MB");
      return;
    }

    try {
      setIsUploading(true);
      const data = await uploadFile(file);

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
      e.target.value = null;
    }
  };

  const handleAudioSend = async (fileUrl) => {
    await sendMessage("🎤 Voice Message", "AUDIO", fileUrl, replyingTo?.id);
    playSound("sent");
    setReplyingTo(null);
  };

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragOver = (e) => {
      e.preventDefault(); e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault(); e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = async (e) => {
      e.preventDefault(); e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        if (file.size > 50 * 1024 * 1024) return alert("File too large");

        try {
          setIsUploading(true);
          const data = await uploadFile(file);
          let type = "FILE";
          if (file.type.startsWith("image/")) type = "IMAGE";
          else if (file.type.startsWith("video/")) type = "VIDEO";
          else if (file.type.startsWith("audio/")) type = "AUDIO";

          await sendMessage(file.name, type, data.fileDownloadUri, replyingTo?.id);
          playSound("sent");
          setReplyingTo(null);
        } catch (err) {
          alert("Upload failed");
        } finally {
          setIsUploading(false);
        }
      }
    };

    dropZone.addEventListener("dragover", handleDragOver);
    dropZone.addEventListener("dragleave", handleDragLeave);
    dropZone.addEventListener("drop", handleDrop);

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("dragleave", handleDragLeave);
      dropZone.removeEventListener("drop", handleDrop);
    };
  }, [replyingTo, sendMessage]);

  return (
    <div className="message-input-wrapper" ref={dropZoneRef}>
      {isDragging && (
        <div className="drag-overlay">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="drag-content">
            <span style={{ fontSize: '3rem' }}>📎</span>
            <h3>Drop to Upload</h3>
          </motion.div>
        </div>
      )}

      {/* Reply Preview */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="reply-bar"
          >
            <div className="reply-content">
              <span className="reply-icon">↩️</span>
              <div className="reply-info">
                <span className="reply-label">Replying to</span>
                <span className="reply-message text-truncate">{replyingTo.text || "Media Attachment"}</span>
              </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="close-btn">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formatting Toolbar */}
      <AnimatePresence>
        {showFormattingToolbar && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="formatting-toolbar-container"
          >
            <MessageFormattingToolbar onFormat={handleFormat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Bar */}
      <div className="input-bar glass-strong">
        <div className="tools-left">
          <button onClick={() => fileInputRef.current?.click()} className="tool-btn" title="Attach">📎</button>
          <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
          <button onClick={() => setShowGifPicker(true)} className="tool-btn" title="GIF">GIF</button>
          <button onClick={() => setShowStickerPicker(true)} className="tool-btn" title="Stickers">⭐</button>
          <button onClick={() => setShowFormattingToolbar(!showFormattingToolbar)} className={`tool-btn ${showFormattingToolbar ? 'active' : ''}`} title="Format">✏️</button>
        </div>

        <form onSubmit={submit} className="input-form">
          <input
            ref={inputRef}
            type="text"
            className="main-input"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => { setText(e.target.value); startTyping(); }}
            disabled={isUploading}
          />
          {isUploading && <span className="upload-spinner">⏳</span>}
        </form>

        <div className="tools-right">
          {text.trim() || isUploading ? (
            <button onClick={submit} className="send-btn" disabled={!text.trim() && !isUploading}>
              ➤
            </button>
          ) : (
            <AudioRecorder
              onSend={handleAudioSend}
              onStartRecording={() => sendRecordingStatus(true)}
              onStopRecording={() => sendRecordingStatus(false)}
            />
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        accept="image/*,video/*,audio/*,application/*"
      />

      {/* Pickers */}
      {showGifPicker && <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />}
      {showStickerPicker && <StickerPicker onStickerSelect={handleStickerSelect} onClose={() => setShowStickerPicker(false)} />}

      <style>{`
        .message-input-wrapper {
          position: relative;
          padding: 1rem;
          z-index: 20;
        }

        .drag-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 243, 255, 0.2);
          backdrop-filter: blur(5px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 2px dashed var(--color-primary);
        }

        .drag-content {
          background: var(--bg-primary);
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .reply-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          padding: 0.5rem 1rem;
          margin-bottom: -10px;
          padding-bottom: 15px;
          border: 1px solid var(--glass-border);
          border-bottom: none;
        }

        .reply-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow: hidden;
        }

        .reply-info {
          display: flex;
          flex-direction: column;
          font-size: 0.8rem;
          overflow: hidden;
        }

        .reply-label {
          color: var(--color-primary);
          font-weight: 600;
        }

        .reply-message {
          color: var(--text-secondary);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
        }

        .formatting-toolbar-container {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
        }

        .input-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 20px; /* Pill shape */
          border: 1px solid var(--glass-border);
          background: rgba(20, 20, 30, 0.6);
        }

        .tools-left {
          display: flex;
          gap: 0.25rem;
        }

        .tool-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .tool-btn:hover, .tool-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-primary);
        }

        .input-form {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
        }

        .main-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 20px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          transition: all 0.2s;
        }

        .main-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--glass-border);
          outline: none;
        }

        .upload-spinner {
          position: absolute;
          right: 10px;
          animation: spin 1s linear infinite;
        }

        .tools-right {
          display: flex;
          align-items: center;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: var(--color-primary);
          color: black;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: transform 0.2s;
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.3);
        }

        .send-btn:hover {
          transform: scale(1.05);
        }

        .send-btn:active {
          transform: scale(0.95);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
