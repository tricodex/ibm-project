import React, { useState } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { FiSend, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './MessageSection.module.css'; // Assuming you create a CSS module for styling

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

const MessageSection: React.FC = () => {
  const { generateCodeSnippet } = useWatson();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'AI Assistant', content: 'How can I help you with your coding project today?', timestamp: new Date().toISOString() },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // Generate AI response
    const aiResponse = await generateCodeSnippet(newMessage);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'AI Assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div className={`${styles.messageSection} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <p className={styles.title}>AI Coding Assistant</p>
        <div className={styles.controls}>
          <button className={styles.collapseButton} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <FiChevronDown size={20} /> : <FiChevronUp size={20} />}
          </button>
          <button className={styles.closeButton} aria-label="Close">
            <FiX size={20} />
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div key={message.id} className={message.sender === 'You' ? styles.userMessageBox : styles.aiMessageBox}>
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.senderName}>{message.sender}</span>
                    <span className={styles.messageTime}>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className={styles.messageText}>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className={styles.inputField}
            />
            <button onClick={handleSendMessage} className={styles.sendButton} title="Send">
              <FiSend size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageSection;
