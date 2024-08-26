import React, { useState } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './MessageSection.module.css';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: string;
  content: string;
}

const MessageSection: React.FC = () => {
  const { generateCodeSnippet } = useWatson();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'granix', content: 'How can I help you with your coding project today?' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    try {
      const aiResponse = await generateCodeSnippet(newMessage);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'AI Assistant',
        content: aiResponse,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  };

  return (
    <div className={`${styles.messageSection} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
      <span className="app-name">granix</span>
      <span className="app-name text-white">code</span>
        <div className={styles.controls}>
          <button className={styles.collapseButton} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <FiChevronDown size={20} /> : <FiChevronUp size={20} />}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div key={message.id} className={message.sender === 'You' ? styles.userMessageBox : styles.aiMessageBox}>
                <div className={styles.messageContent}>
                  <span className={styles.senderName}>{message.sender}</span>
                  <div className={styles.messageText}>
                    <ReactMarkdown components={{
                      p: ({node, ...props}) => <div {...props} />
                    }}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
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