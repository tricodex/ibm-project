'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWatson } from '@/hooks/useWatson';
import { FiSend, FiChevronDown, FiChevronUp, FiCopy, FiCheck } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import 'prismjs/themes/prism-tomorrow.css'; // Theme for syntax highlighting



interface Message {
  id: string;
  sender: 'You' | 'AI Assistant';
  content: string;
}

const MessageSection: React.FC = () => {
  const { generateCodeSnippet } = useWatson();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'AI Assistant', content: 'How can I help you with your coding project today?' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 w-128 h-128 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg overflow-hidden">
      <div className={`flex justify-between items-center bg-gray-800 px-4 py-2 ${isCollapsed ? 'bg-opacity-50' : ''}`}>
      <span className="app-name">granix</span><span className="app-name text-white">code</span>        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-300 hover:text-white"
        >
          {isCollapsed ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
      </div>
      {!isCollapsed && (
        <>
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-opacity-90">
            {messages.map((message) => (
              <div key={message.id} className={`${message.sender === 'You' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-2 rounded-lg ${
                  message.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">{message.sender}</span>
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedId === message.id ? <FiCheck size={12} /> : <FiCopy size={12} />}
                    </button>
                  </div>
                  <ReactMarkdown
  components={{
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        return (
          <pre
            className={`language-${match[1]}`}
            {...(props as React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>)}
          >
            <code className={`language-${match[1]}`}>
              {children}
            </code>
          </pre>
        );
      } else {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
    },
  }}
>
  {message.content}
</ReactMarkdown>

                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center bg-gray-800 p-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-grow bg-gray-700 text-white rounded-l-md px-3 py-2 focus:outline-none"
            />
            <button
              title="Send Message"
              onClick={handleSendMessage}
              className="bg-blue-600 text-white rounded-r-md px-4 py-2 hover:bg-blue-700"
            >
              <FiSend size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageSection;
