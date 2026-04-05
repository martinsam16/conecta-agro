import React, { useState, useEffect, useRef } from 'react';
import { Smile, Image as ImageIcon, Folder, Phone, FileText, Maximize2, MessageSquare, Search, X, MessageCircle } from 'lucide-react';
import { getChatHistory } from '../services/api';
import './ChatModal.css';

const WS_URL = 'wss://echo.websocket.org';

const ChatModal = ({ isOpen, onClose, producerName, productImage, productName, quantity, subtotal }) => {
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
        
        {/* MAIN CHAT PANE */}
        <div className="chat-main-pane">
          <div className="chat-header">
            <div className="brand-logo-container">
               <div className="brand-placeholder">{producerName ? producerName.charAt(0).toUpperCase() : 'V'}</div>
               <h2 className="brand-title">{producerName || "Valle verde SAC"}</h2>
               {!isConnected && <span style={{fontSize:'12px', color:'red', marginLeft:'10px'}}>(Desconectado)</span>}
            </div>
            <div className="close-btn" onClick={onClose}>
               <X size={24} />
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
                {productImage && <img src={productImage} alt="Producto" className="snippet-img" />}
                <div className="snippet-text">
                   <div className="snippet-product-name">{productName || "Consulta directa con el productor"}</div>
                   <div className="snippet-product-meta">Cant: {quantity} • Subtotal: S/ {subtotal}</div>
                </div>
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
                  placeholder="Escribe tu duda sobre el producto aquí"
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

      </div>
    </div>
  );
};

export default ChatModal;
