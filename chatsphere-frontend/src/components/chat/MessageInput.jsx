import { useState, useRef, useEffect } from "react";
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
    playSound("sent");
    setReplyingTo(null);
  };

  // Drag and drop handlers
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
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
    <div className="message-input-container" ref={dropZoneRef}>
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-content">
            <div className="drag-icon">📎</div>
            <div className="drag-text">Drop files here to upload</div>
          </div>
        </div>
      )}

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

      {isUploading && <div className="uploading-indicator">⏳ Uploading media...</div>}

      {showFormattingToolbar && (
        <MessageFormattingToolbar onFormat={handleFormat} />
      )}

      <div className="input-toolbar">
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Attach file"
        >
          📎
        </button>
        
        <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => setShowGifPicker(true)}
          title="Send GIF"
        >
          GIF
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => setShowStickerPicker(true)}
          title="Send sticker"
        >
          ⭐
        </button>
        
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
          title="Format text"
        >
          ✏️
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: "none" }}
          accept="image/*,video/*,audio/*,application/*"
        />
      </div>

      <MessageInputForm
        text={text}
        setText={setText}
        onSubmit={submit}
        startTyping={startTyping}
        inputRef={inputRef}
      />
      
      <AudioRecorder
        onSend={handleAudioSend}
        onStartRecording={() => sendRecordingStatus(true)}
        onStopRecording={() => sendRecordingStatus(false)}
      />

      {showGifPicker && (
        <GifPicker
          onGifSelect={handleGifSelect}
          onClose={() => setShowGifPicker(false)}
        />
      )}

      {showStickerPicker && (
        <StickerPicker
          onStickerSelect={handleStickerSelect}
          onClose={() => setShowStickerPicker(false)}
        />
      )}
    </div>
  );
}

function MessageInputForm({ text, setText, onSubmit, startTyping, inputRef }) {
  return (
    <form className="message-input" onSubmit={onSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message... (supports **bold** _italic_ `code`)"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          startTyping();
        }}
      />
      <button type="submit" className="send-btn">
        <span>📤</span> Send
      </button>
    </form>
  );
}
