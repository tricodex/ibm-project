import React, { useState, useEffect, useRef } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { X, Send } from 'lucide-react';
import styles from './Chat.module.css';

interface ChatProps {
  isVisible?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
}

const Chat: React.FC<ChatProps> = ({ isVisible = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now().toString(),
      content: 'Hello! How can I assist you today?',
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const { generateText, isLoading } = useWatson();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await generateText({
        input,
        modelId: 'GRANITE_13B_CHAT_V2',
        projectId: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID || '',
        parameters: {
          max_new_tokens: 150,
        },
      });

      if (response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.generated_text,
          sender: 'ai',
        };

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error during message handling:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={styles.chatToggle}
          aria-label="Open chat"
        >
          <Send />
        </button>
      )}
      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h2 className={styles.chatTitle}>AI Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="Close chat"
            >
              <X />
            </button>
          </div>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.aiMessage}`}
              >
                {message.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={styles.input}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendButton} disabled={isLoading} title="Submit">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
