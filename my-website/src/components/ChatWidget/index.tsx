// src/components/ChatWidget/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { useAuth } from '@site/src/context/AuthContext'; // NEW IMPORT

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth(); // Already added in T016

  // Personalize initial greeting based on user's background
  const initialGreeting = () => {
    let greeting = '👋 Hi! I\'m your **Physical AI & Humanoid Robotics** assistant. What would you like to learn or discuss from the book today?';
    if (user && user.metadata && user.metadata.software_background) {
      const experience = user.metadata.software_background.experience_level.toLowerCase();
      if (experience === 'expert') {
        greeting = '🤖 Greetings, expert in AI & Robotics! Ready for a deep dive or complex discussion?';
      } else if (experience === 'intermediate') {
        greeting = '👋 Hello there! What\'s your next challenge in AI & Robotics today?';
      } else { // Beginner or any other
        greeting = '👋 Hi, aspiring innovator! How can I help you explore Physical AI & Humanoid Robotics today?';
      }
    }
    return [{ role: 'assistant', content: greeting }];
  };

  const [messages, setMessages] = useState(initialGreeting); // Use the personalized greeting

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const formatMessage = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (line.trim().startsWith('•')) {
          return `<div style="margin-left: 8px;">${line}</div>`;
        }
        return line;
      })
      .join('<br/>');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: userMessage, context: "" }),
});


      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.answer } // ✅ backend returns 'answer'
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Sorry! I couldn’t reach the server. Give it a moment and try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const quickQuestions = [
    
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="10" r="0.5" fill="currentColor" strokeWidth="0"/>
            <circle cx="12" cy="10" r="0.5" fill="currentColor" strokeWidth="0"/>
            <circle cx="15" cy="10" r="0.5" fill="currentColor" strokeWidth="0"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <div className={styles.botAvatar}>🤖</div>
              <div>
                <h3 className={styles.headerTitle}>Physical AI Assistant</h3>
                <p className={styles.headerSubtitle}></p>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >×</button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                {msg.role === 'assistant' && <div className={styles.messageAvatar}>🤖</div>}
                <div className={styles.messageContent} dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                {msg.role === 'user' && <div className={styles.messageAvatar}>👤</div>}
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageAvatar}>🤖</div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '12px' }}>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--ifm-color-emphasis-200)',
                      border: '2px solid var(--ifm-color-emphasis-300)',
                      borderRadius: '12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: '#1e1b4b',
                      textAlign: 'left',
                      fontWeight: '600',
                      lineHeight: '1.4'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)';
                      e.target.style.borderColor = '#6366f1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = 'var(--ifm-color-emphasis-200)';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className={styles.chatInput} onSubmit={sendMessage}>
            <textarea
              ref={(el) => {
                inputRef.current = el;
                textareaRef.current = el;
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message"
              disabled={isLoading}
              className={styles.input}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px', overflow: 'auto', color: '#1e1b4b' }}
            />
            <button type="submit" disabled={isLoading || !input.trim()} className={styles.sendButton} aria-label="Send message">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
