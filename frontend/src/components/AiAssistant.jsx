import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { AI_RESPONSES } from '../data';

const AiAssistant = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Welcome! ✦ I'm your personal Habesha Heritage style advisor. I can help you find the perfect outfit, recommend sizes, and suggest designs for any occasion. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const aiIdx = useRef(0);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: AI_RESPONSES[aiIdx.current % AI_RESPONSES.length] },
      ]);
      aiIdx.current++;
    }, 1200 + Math.random() * 600);
  };

  if (!open) return null;

  const chips = [
    '🎉 Timkat season recommendations',
    '📏 Help with sizing',
    '💍 Bridal styling tips',
    '🌍 International shipping info',
  ];

  return (
    <div
      className="modal-backdrop active"
      role="dialog"
      aria-modal
      aria-label="AI Style Assistant"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ai-modal-content">
        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-icon">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="ai-header-title">Habesha Style AI</div>
            <div className="ai-header-sub">Your personal Ethiopian fashion advisor</div>
          </div>
          <div className="ai-online-dot" title="Online" />
          <button
            onClick={onClose}
            style={{ marginLeft: 12, color: 'rgba(255,255,255,.4)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat */}
        <div className="ai-chat" ref={chatRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`ai-msg ${msg.role === 'user' ? 'user' : ''}`}>
              {msg.role === 'bot' && (
                <div className="ai-avatar"><Sparkles size={14} /></div>
              )}
              <div className={`ai-bubble ${msg.role === 'bot' ? 'ai-bubble-bot' : 'ai-bubble-user'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="ai-msg">
              <div className="ai-avatar"><Sparkles size={14} /></div>
              <div className="ai-bubble ai-bubble-bot">
                <div className="ai-typing-dot">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick chips */}
        <div className="ai-quick-chips">
          {chips.map(chip => (
            <button key={chip} className="ai-chip" onClick={() => sendMessage(chip)}>
              {chip}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="ai-input-bar">
          <input
            type="text"
            placeholder="Ask anything about styling, sizing, or designs..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            aria-label="Chat input"
          />
          <button
            className="ai-send-btn"
            onClick={() => sendMessage()}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
