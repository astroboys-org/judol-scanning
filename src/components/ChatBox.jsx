import React, { useState, useEffect, useRef } from 'react';
import { analyzeLocation, getFinancialAdvice } from '../services/geminiService';
import { findSimilarLocation } from '../services/dataService';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [chatState, setChatState] = useState('awal');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Inisialisasi chat
  useEffect(() => {
    addMessage('system', 'Selamat datang di ChakrAI! 👋 Di mana lokasi Anda saat ini? (sebutkan nama desa, kecamatan, kabupaten/kota, dan provinsi Anda)');
  }, []);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text, timestamp: new Date() }]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    addMessage('user', inputText);
    setIsLoading(true);

    try {
      if (chatState === 'awal') {
        // Cek lokasi di database lokal
        const locationResult = findSimilarLocation(inputText);
        
        if (locationResult.found) {
          // Jika lokasi ditemukan di database
          const recentCase = locationResult.cases[0];
          const caseType = recentCase.Kasus;
          
          if (caseType === 'Pinjaman Online Ilegal') {
            addMessage('system', `<strong>Peringatan Keamanan</strong><br>Hai, kami mendeteksi bahwa di sekitar ${locationResult.location} terdeteksi aktivitas/kejadian <strong>Pinjaman Online Ilegal</strong>.<br><br>Berhati-hatilah terhadap penawaran pinjaman cepat melalui aplikasi tidak resmi.<br><br>💡 <strong>Tips:</strong> Jangan pernah mengirim KTP/foto diri ke pihak tidak dikenal`);
          } else {
            addMessage('system', `<strong>Peringatan Keamanan</strong><br>Hai, kami mendeteksi bahwa di sekitar ${locationResult.location} saat ini, aktivitas <strong>judi online</strong> cukup rawan terjadi.<br><br>Hati-hati dengan ajakan yang menjanjikan uang cepat. Hindari tautan mencurigakan dan catat pengeluaran harian.<br><br>💡 <strong>Tips:</strong> Jangan sembarangan klik tautan judi, slot, atau mengandung kata 'gacor'`);
          }
        } else {
          // Jika lokasi tidak ditemukan, gunakan Gemini AI untuk analisis
          const aiResponse = await analyzeLocation(inputText);
          addMessage('system', aiResponse);
        }
        setChatState('bertanya_bantuan');
      } else if (chatState === 'bertanya_bantuan') {
        const lowerInput = inputText.toLowerCase();
        if (lowerInput.includes('ya') || lowerInput.includes('iya') || lowerInput.includes('iy')) {
          addMessage('system', 'Mau tips terkait keuangan atau lainnya?');
          setChatState('konsultasi');
        } else if (lowerInput.includes('tidak') || lowerInput.includes('tdk') || lowerInput.includes('gak') || lowerInput.includes('gk')) {
          addMessage('system', 'Terima kasih telah menggunakan aplikasi ChakrAI. Semoga informasi yang diberikan bermanfaat! 🙏');
          setChatState('selesai');
        } else {
          addMessage('system', 'Maaf, apa ada yang bisa dibantu lagi?');
        }
      } else if (chatState === 'konsultasi') {
        if (inputText.toLowerCase().includes('keuangan')) {
          addMessage('system', '<em>Sedang menyiapkan tips keuangan...</em>');
          const financialAdvice = await getFinancialAdvice();
          addMessage('system', financialAdvice);
        } else if (inputText.toLowerCase().includes('lain')) {
          addMessage('system', 'Maaf, aplikasi ini hanya mendeteksi risiko Judi Online dan Pinjaman Online Ilegal di sekitar Anda serta Literasi Keuangan');
        } else {
          addMessage('system', 'Ada yang bisa dibantu lagi?');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage('system', 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Chat dengan ChakrAI</h2>
      </div>
      
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'system-message'}`}>
            <div 
              className={`chat-bubble ${msg.sender === 'user' ? 'chat-user' : 'chat-system'}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            <div className="message-timestamp">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message system-message">
            <div className="chat-bubble chat-system">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda di sini..."
          disabled={isLoading}
        />
        <button 
          className="send-button" 
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
          </svg>
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatBox;