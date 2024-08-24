import React, { useState } from 'react';
import { useWatson } from '@/hooks/useWatson';

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

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Generate AI response
    const aiResponse = await generateCodeSnippet(newMessage);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'AI Assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="messages-section">
      <button className="messages-close">
        {/* Add close icon */}
      </button>
      <div className="projects-section-header">
        <p>AI Coding Assistant</p>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message-box">
            <div className="message-content">
              <div className="message-header">
                <div className="name">{message.sender}</div>
              </div>
              <p className="message-line">
                {message.content}
              </p>
              <p className="message-line time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="messages-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageSection;