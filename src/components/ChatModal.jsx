import React, { useState, useEffect, useRef } from 'react';
import { Smile, Image as ImageIcon, Folder, Phone, FileText, Maximize2, MessageSquare, Search, X, MessageCircle } from 'lucide-react';
import { getChatHistory } from '../services/api';
import './ChatModal.css';

const WS_URL = 'wss://echo.websocket.org';

const ChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize and load chat history
  useEffect(() => {
    if (isOpen) {
      const loadHistory = async () => {
        try {
          const localHistoryStr = localStorage.getItem('vverde_chat_history');
          if (localHistoryStr) {
            setMessages(JSON.parse(localHistoryStr));
          } else {
             // Fallback to our initial JSON data
             const data = await getChatHistory();
             setMessages(data);
          }
        } catch (error) {
          console.error("Error loading history:", error);
        }
      };
      loadHistory();
      
      // Connect to WebSocket Server (public echo server to simulate replies)
      const connectWebSocket = () => {
        const ws = new WebSocket(WS_URL);
        
        ws.onopen = () => {
          setIsConnected(true);
        };
        
        ws.onmessage = (event) => {
          // The echo server sends back whatever we sent it.
          // To make it look like a response, we'll parse it and attach "isMe: false"
          try {
            // Check if it's our own message bouncing back
            const incomingStr = event.data;
            if (incomingStr.startsWith('Request served by')) return; // Ignore meta echo messages
            
            const bounceMsg = {
               id: Date.now().toString() + Math.random(),
               sender: "Valle verde SAC",
               text: "Auto-respuesta [Echo]: " + incomingStr,
               timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
               isMe: false
            };
            
            setMessages(prev => {
              const newMsgs = [...prev, bounceMsg];
              localStorage.setItem('vverde_chat_history', JSON.stringify(newMsgs));
              return newMsgs;
            });
            
          } catch(e) {
            console.error("Echo message parse error");
          }
        };
        
        ws.onclose = () => {
          setIsConnected(false);
        };
        
        wsRef.current = ws;
      };

      connectWebSocket();

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "Tú",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isMe: true
    };

    const newMessagesList = [...messages, newMessage];
    setMessages(newMessagesList);
    localStorage.setItem('vverde_chat_history', JSON.stringify(newMessagesList));

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(inputText);
    }
    
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal-container">
        
        {/* LEFT PANE - MAIN CHAT */}
        <div className="chat-main-pane">
          <div className="chat-header">
            <div className="brand-logo-container">
               <div className="brand-placeholder">V</div>
               <h2 className="brand-title">Valle verde SAC</h2>
               {!isConnected && <span style={{fontSize:'12px', color:'red', marginLeft:'10px'}}>(Desconectado)</span>}
            </div>
          </div>

          <div className="chat-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.isMe ? 'outgoing' : 'incoming'}`}>
                <div>{msg.text}</div>
                <span className="message-time">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-composer-area">
             <div className="product-snippet">
                <img src="https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?auto=format&fit=crop&w=100&q=80" alt="Uvas" className="snippet-img" />
                <div className="snippet-text">Ped. Minimo: 100 kg</div>
             </div>
             
             <div className="composer-toolbar">
                <Smile size={18} className="toolbar-icon" />
                <ImageIcon size={18} className="toolbar-icon" />
                <Folder size={18} className="toolbar-icon" />
                <Phone size={18} className="toolbar-icon" />
                <MessageCircle size={18} className="toolbar-icon" />
                <FileText size={18} className="toolbar-icon" />
             </div>

             <div className="composer-input-wrapper">
                <Maximize2 size={16} className="expand-icon" />
                <textarea 
                  className="composer-textarea" 
                  placeholder="Ingresa tu mensaje aquí"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="send-btn-wrapper">
                   <button className="send-btn" onClick={handleSendMessage} disabled={!inputText.trim()}>Enviar</button>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT PANE - SIDEBAR */}
        <div className="chat-sidebar-pane">
          <div className="sidebar-header">
             <div className="sidebar-title-container">
                <MessageSquare size={24} />
                <span>Mensajes</span>
             </div>
             <div className="sidebar-actions">
                <Search size={20} />
                <X size={20} onClick={onClose} />
             </div>
          </div>
          
          <div className="chat-list">
             <div className="chat-list-item active">
                <div className="brand-placeholder" style={{width:'30px', height:'30px', fontSize:'14px'}}>V</div>
                <span className="chat-list-name">Valle verde SAC</span>
             </div>
             {/* Additional mock chats could go here */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatModal;
