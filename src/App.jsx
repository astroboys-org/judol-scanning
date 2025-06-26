import { useState, useEffect } from 'react';
import './App.css';
import ChatBox from './components/ChatBox';
import Dashboard from './components/Dashboard';
import LaporKejadian from './components/LaporKejadian';
import ScrapingDashboard from './components/ScrapingDashboard';
import { initializeDatabase } from './services/databaseService';
import { startScraping } from './services/scrapingService';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [dataRefresh, setDataRefresh] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Inisialisasi database dan mulai scraping saat aplikasi dimuat
  useEffect(() => {
    initializeDatabase();
    startScraping();
  }, []);

  const handleDataRefresh = () => {
    setDataRefresh(!dataRefresh);
  };

  // Di dalam komponen App, tambahkan useEffect berikut
  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
    
    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, [sidebarOpen]);

  return (
    <div className="app-container">
      {currentPage === 'welcome' ? (
        <div className="welcome-screen">
          <div className="app-logo">
            <img src="/vite.svg" alt="Logo" />
            <h1>ChakrAI</h1>
          </div>
          <h2>Asisten Cerdas untuk Keamanan Digital</h2>
          <p>Konsultasikan masalah keamanan digital Anda dengan ChakrAI</p>
          <button className="btn-primary" onClick={() => setCurrentPage('chat')}>
            Mulai Konsultasi
          </button>
        </div>
      ) : (
        <>
          <header className="app-header">
            <div className="app-logo">
              <img src="/vite.svg" alt="Logo" />
              <h1>ChakrAI</h1>
            </div>
            <div className="header-actions">
              <button className="btn-secondary sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? 'Tutup Database' : 'Database Scraping'}
              </button>
              <button className="btn-secondary" onClick={() => setCurrentPage('welcome')}>
                Kembali ke Beranda
              </button>
            </div>
          </header>
          
          <div className={`main-container ${sidebarOpen ? 'with-sidebar' : ''}`}>
            <div className="content-area">
              <ChatBox dataRefresh={dataRefresh} />
              
              <div className="action-buttons">
                <Dashboard onDataRefresh={handleDataRefresh} />
                <LaporKejadian onDataRefresh={handleDataRefresh} />
              </div>
            </div>
            
            {sidebarOpen && (
              <div className="sidebar-container">
                <ScrapingDashboard 
                  onDataRefresh={handleDataRefresh} 
                  inSidebar={true}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
