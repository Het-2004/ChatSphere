import { useChat } from "../../hooks/useChat";
import { useMessageSender } from "../../hooks/useMessageSender";
import { useState } from "react";

export default function ForwardMessageModal() {
    const { chats, forwardingMessage, setForwardingMessage, activeChatId } = useChat();
    const { sendMessage } = useMessageSender(); // We need a generic sendMessage that can target any chat

    // Note: useMessageSender typically uses activeChatId. We might need to refactor it or use a specialized forward function.
    // Actually sendMessage in useMessageSender usually takes chatId as an arg or uses activeChatId default.
    // Let's look at useMessageSender again. It uses activeChatId.
    // We should probably update useMessageSender to allow overriding chatId.

    const [selectedChatId, setSelectedChatId] = useState(null);

    if (!forwardingMessage) return null;

    const handleForward = async () => {
        if (!selectedChatId) return;

        // We can't use the standard sendMessage hook easily for *another* chat if it depends on activeChatId for encryption keys.
        // Wait, encryption keys are per chat. The hook might check activeChatId to get the key.
        // We need to fetch the key for the *target* chat.
        // For now, let's assume we can just pass the targetChatId to a modified sendMessage, 
        // OR we just switch chat, send, and switch back (bad UX).
        // Better: useMessageSender should allow sending to a specific chat if provided, fetching key as needed.

        // For this step, I'll assume we can pass targetChatId. I will update useMessageSender next.

        // We are sending the *content* of the forwardingMessage.
        // If it's media, we send mediaUrl.
        await sendMessage(
            forwardingMessage.text,
            forwardingMessage.type || "TEXT",
            forwardingMessage.mediaUrl,
            null, // replyToId
            selectedChatId, // targetChatId (need to add this param)
            true, // forwarded
            forwardingMessage.senderId // originalSenderId
        );

        setForwardingMessage(null);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content forward-modal">
                <h3>Forward Message</h3>
                <div className="chat-list-compact">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
                            onClick={() => setSelectedChatId(chat.id)}
                        >
                            <div className="chat-avatar small">{chat.name?.charAt(0)}</div>
                            <div className="chat-name">{chat.name}</div>
                        </div>
                    ))}
                </div>
                <div className="modal-actions">
                    <button onClick={() => setForwardingMessage(null)}>Cancel</button>
                    <button onClick={handleForward} disabled={!selectedChatId}>Send</button>
                </div>
            </div>
        </div>
    );
}
