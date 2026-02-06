import { useState, useRef } from "react";
import { uploadFile } from "../../api/fileApi";

export default function AudioRecorder({ onSend, onStartRecording, onStopRecording }) {
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setRecording(true);
            if (onStartRecording) onStartRecording();
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            if (onStopRecording) onStopRecording();
        }
    };

    const sendAudio = async () => {
        if (!audioBlob) return;

        try {
            // 1. Upload
            // Create a File object from Blob
            const file = new File([audioBlob], "voice_note.webm", { type: "audio/webm" });
            const fileUrl = await uploadFile(file);

            // 2. Callback
            onSend(fileUrl);

            // Reset
            setAudioBlob(null);
        } catch (error) {
            alert("Failed to send audio.");
        }
    };

    const cancelRecording = () => {
        setAudioBlob(null);
        setRecording(false);
        chunksRef.current = [];
    };

    if (audioBlob) {
        return (
            <div className="audio-preview">
                <audio src={URL.createObjectURL(audioBlob)} controls />
                <button className="btn-send" onClick={sendAudio}>➤</button>
                <button className="btn-cancel" onClick={cancelRecording}>✖</button>
            </div>
        );
    }

    return (
        <div className="audio-recorder">
            {!recording ? (
                <button type="button" onClick={startRecording} className="btn-mic">
                    🎤
                </button>
            ) : (
                <button type="button" onClick={stopRecording} className="btn-stop recording-pulse">
                    ⏹️
                </button>
            )}
        </div>
    );
}
