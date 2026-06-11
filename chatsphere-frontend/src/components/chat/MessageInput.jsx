import { useState, useRef, useEffect, useCallback } from "react";
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
import { playSound } from "../../utils/notifications";

// Icons
const AttachIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const GifBadge = () => (
  <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.5px", lineHeight: 1 }}>GIF</span>
);

const StickerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"/>
    <path d="M8 15h8"/><path d="M9 9h.01"/><path d="M15 9h.01"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function MessageInput({ aesKey }) {
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [inputRows, setInputRows] = useState(1);

  const { sendMessage, sendRecordingStatus } = useMessageSender(aesKey);
  const { startTyping } = useTypingIndicator();
  const { replyingTo, setReplyingTo } = useChat();

  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  const submit = async (e) => {
    e?.preventDefault();
    if (!isValidMessage(text)) return;
    await sendMessage(text, "TEXT", null, replyingTo?.id);
    playSound("sent");
    setText("");
    setInputRows(1);
    setReplyingTo(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    startTyping();

    // Auto-grow textarea (up to 5 rows)
    const lines = val.split("\n").length;
    setInputRows(Math.min(5, Math.max(1, lines)));
  };

  const handleEmojiSelect = (emoji) => {
    const pos = inputRef.current?.selectionStart ?? text.length;
    const newText = text.slice(0, pos) + emoji + text.slice(pos);
    setText(newText);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(pos + emoji.length, pos + emoji.length);
    }, 0);
  };

  const handleGifSelect = async (gifUrl) => {
    await sendMessage("GIF", "IMAGE", gifUrl, replyingTo?.id);
    playSound("sent");
    setReplyingTo(null);
    setShowGifPicker(false);
  };

  const handleStickerSelect = async (sticker) => {
    await sendMessage(sticker, "TEXT", null, replyingTo?.id);
    playSound("sent");
    setReplyingTo(null);
    setShowStickerPicker(false);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { alert("File is too large (max 50 MB)"); return; }

    try {
      setIsUploading(true);
      const data = await uploadFile(file);
      let type = "FILE";
      if (file.type.startsWith("image/")) type = "IMAGE";
      else if (file.type.startsWith("video/")) type = "VIDEO";
      else if (file.type.startsWith("audio/")) type = "AUDIO";
      await sendMessage(file.name, type, data.fileDownloadUri, replyingTo?.id);
      setReplyingTo(null);
    } catch {
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

  // Drag & drop
  useEffect(() => {
    const zone = wrapRef.current;
    if (!zone) return;

    const over = (e) => { e.preventDefault(); setIsDragging(true); };
    const leave = (e) => { e.preventDefault(); setIsDragging(false); };
    const drop = async (e) => {
      e.preventDefault(); setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (file.size > 50 * 1024 * 1024) { alert("File too large"); return; }
      try {
        setIsUploading(true);
        const data = await uploadFile(file);
        let type = "FILE";
        if (file.type.startsWith("image/")) type = "IMAGE";
        else if (file.type.startsWith("video/")) type = "VIDEO";
        else if (file.type.startsWith("audio/")) type = "AUDIO";
        await sendMessage(file.name, type, data.fileDownloadUri, replyingTo?.id);
        playSound("sent"); setReplyingTo(null);
      } catch { alert("Upload failed"); }
      finally { setIsUploading(false); }
    };

    zone.addEventListener("dragover", over);
    zone.addEventListener("dragleave", leave);
    zone.addEventListener("drop", drop);
    return () => { zone.removeEventListener("dragover", over); zone.removeEventListener("dragleave", leave); zone.removeEventListener("drop", drop); };
  }, [replyingTo, sendMessage]);

  const hasText = text.trim().length > 0 || isUploading;

  return (
    <div className="input-zone" ref={wrapRef}>
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="drag-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="drag-body">
              <div className="drag-icon">📎</div>
              <h3>Drop to send</h3>
              <p>Images, videos, documents up to 50 MB</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply bar */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            className="reply-bar-strip"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="label">Replying to</div>
              <div className="text" style={{
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {replyingTo.text || "Media"}
              </div>
            </div>
            <button className="reply-close" onClick={() => setReplyingTo(null)}>
              <CloseIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="upload-badge"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="spinner" />
            Uploading file…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main input bar */}
      <div className="input-bar">
        {/* Left tools */}
        <div className="input-left-tools">
          <button className="tool-btn" onClick={() => fileInputRef.current?.click()} title="Attach file">
            <AttachIcon />
          </button>
          <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
          <button className="tool-btn" onClick={() => setShowGifPicker(true)} title="Send GIF">
            <GifBadge />
          </button>
          <button
            className={`tool-btn${showStickerPicker ? " active" : ""}`}
            onClick={() => setShowStickerPicker(s => !s)}
            title="Stickers"
          >
            <StickerIcon />
          </button>
        </div>

        {/* Text input */}
        <div className="input-field-wrap">
          <textarea
            ref={inputRef}
            className="input-field"
            placeholder="Type a message"
            value={text}
            rows={inputRows}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={isUploading}
          />
        </div>

        {/* Send / Mic */}
        <div>
          {hasText ? (
            <motion.button
              className="send-btn"
              onClick={submit}
              disabled={!text.trim() && !isUploading}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
            >
              <SendIcon />
            </motion.button>
          ) : (
            <AudioRecorder
              onSend={handleAudioSend}
              onStartRecording={() => sendRecordingStatus(true)}
              onStopRecording={() => sendRecordingStatus(false)}
            />
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        accept="image/*,video/*,audio/*,application/*"
      />

      {/* Pickers */}
      {showGifPicker && (
        <GifPicker onGifSelect={handleGifSelect} onClose={() => setShowGifPicker(false)} />
      )}
      {showStickerPicker && (
        <StickerPicker onStickerSelect={handleStickerSelect} onClose={() => setShowStickerPicker(false)} />
      )}
    </div>
  );
}
