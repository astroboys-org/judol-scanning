import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Badge, Tabs, Tab, Alert } from 'react-bootstrap';
import { getAllScrapedData, getDataByCategory, searchScrapedData, exportDatabaseToJSON, importDatabaseFromJSON } from '../services/databaseService';
import { getInsightsFromScrapedData, extractInformationFromScrapedData } from '../services/aiService';
import { startScraping } from '../services/scrapingService';
import { DB_CONFIG } from '../services/databaseService';

const ScrapingDashboard = ({ onDataRefresh, inSidebar = false }) => {
  const [scrapedData, setScrapedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [importFile, setImportFile] = useState(null);
  const [activeTab, setActiveTab] = useState('data');
  
  // Load data when component mounts or when in sidebar mode
  useEffect(() => {
    if (inSidebar) {
      loadData();
    }
  }, [inSidebar]);
  
  // Filter data when search term or category changes
  useEffect(() => {
    filterData();
  }, [searchTerm, selectedCategory, scrapedData]);
  
  // Load all scraped data
  const loadData = () => {
    const data = getAllScrapedData();
    setScrapedData(data);
    setFilteredData(data);
  };
  
  // Filter data based on search term and category
  const filterData = () => {
    let result = [];
    
    if (searchTerm) {
      result = searchScrapedData(searchTerm, selectedCategory !== 'all' ? selectedCategory : null);
    } else if (selectedCategory !== 'all') {
      result = getDataByCategory(selectedCategory);
    } else {
      result = [...scrapedData];
    }
    
    setFilteredData(result);
  };
  
  // Get AI insights from scraped data
  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const insightText = await getInsightsFromScrapedData();
      setInsights(insightText);
    } catch (error) {
      console.error('Error loading insights:', error);
      setNotification({
        show: true,
        message: 'Gagal memuat insight dari data',
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle export database
  const handleExport = () => {
    const success = exportDatabaseToJSON();
    if (success) {
      setNotification({
        show: true,
        message: 'Database berhasil diekspor',
        type: 'success'
      });
    } else {
      setNotification({
        show: true,
        message: 'Gagal mengekspor database',
        type: 'danger'
      });
    }
  };
  
  // Handle import database
  const handleImport = (e) => {
    setImportFile(e.target.files[0]);
  };
  
  const processImport = () => {
    if (!importFile) {
      setNotification({
        show: true,
        message: 'Pilih file untuk diimpor',
        type: 'warning'
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = importDatabaseFromJSON(e.target.result);
        if (success) {
          setNotification({
            show: true,
            message: 'Database berhasil diimpor',
            type: 'success'
          });
          loadData();
          if (onDataRefresh) onDataRefresh();
        } else {
          setNotification({
            show: true,
            message: 'Gagal mengimpor database',
            type: 'danger'
          });
        }
      } catch {
        setNotification({
          show: true,
          message: 'Format file tidak valid',
          type: 'danger'
        });
      }
    };
    reader.readAsText(importFile);
  };
  
  // Get badge color based on category
  const getBadgeColor = (category) => {
    switch (category) {
      case 'Judi Online': return 'danger';
      case 'Pinjol Ilegal': return 'warning';
      case 'Kredit Ilegal': return 'info';
      case 'Judi Sabung Ayam': return 'dark';
      default: return 'secondary';
    }
  };
  
  // Import fungsi ekstraksi informasi
// Move this import statement to the top of the file with other imports
  
  // Fungsi untuk memulai scraping secara manual
  const handleStartScraping = async () => {
    setIsLoading(true);
    setNotification({
      show: true,
      message: 'Memulai proses scraping...',
      type: 'info'
    });
    
    try {
      // Jalankan proses scraping
      await startScraping();
      
      // Ambil data hasil scraping
      const scrapedData = getAllScrapedData();
      
      // Jika ada data yang berhasil di-scrape
      if (scrapedData.length > 0) {
        setNotification({
          show: true,
          message: 'Mengekstrak informasi penting dari hasil scraping...',
          type: 'info'
        });
        
        // Proses batch data untuk menghindari token limit
        const batchSize = 10;
        let processedData = [];
        
        for (let i = 0; i < scrapedData.length; i += batchSize) {
          const batch = scrapedData.slice(i, i + batchSize);
          const extractedInfo = await extractInformationFromScrapedData(batch);
          processedData = [...processedData, ...extractedInfo];
        }
        
        // Update data dengan informasi yang diekstrak
        if (processedData.length > 0) {
          // Gabungkan data yang sudah diekstrak dengan data asli
          const updatedData = scrapedData.map(item => {
            const extractedItem = processedData.find(extracted => extracted.url === item.url);
            if (extractedItem) {
              return {
                ...item,
                title: extractedItem.title || item.title,
                category: extractedItem.category || item.category,
                location: extractedItem.location || item.location
              };
            }
            return item;
          });
          
          // Simpan data yang sudah diperbarui
          localStorage.setItem(DB_CONFIG.scraped_data_key, JSON.stringify(updatedData));
        }
      }
      
      setNotification({
        show: true,
        message: 'Proses scraping dan ekstraksi informasi selesai',
        type: 'success'
      });
      
      loadData(); // Muat ulang data setelah scraping
    } catch (error) {
      console.error('Error saat scraping:', error);
      setNotification({
        show: true,
        message: 'Gagal menjalankan scraping',
        type: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Jika dalam mode sidebar, render konten sidebar
  if (inSidebar) {
    return (
      <div className="sidebar-scraping-dashboard">
        <div className="sidebar-header">
          <h3>Database Kasus Ilegal</h3>
        </div>
        
        {notification.show && (
          <Alert variant={notification.type} onClose={() => setNotification({...notification, show: false})} dismissible>
            {notification.message}
          </Alert>
        )}
        
        <div className="sidebar-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data Scraping
            </button>
            <button 
              className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'data' && (
              <div className="data-tab">
                <div className="sidebar-controls">
                  <div className="search-filter">
                    <Form.Control 
                      type="text" 
                      placeholder="Cari data..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="sidebar-search"
                    />
                    <Form.Select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="sidebar-select"
                    >
                      <option value="all">Semua Kategori</option>
                      <option value="Judi Online">Judi Online</option>
                      <option value="Pinjol Ilegal">Pinjol Ilegal</option>
                      <option value="Kredit Ilegal">Kredit Ilegal</option>
                      <option value="Judi Sabung Ayam">Judi Sabung Ayam</option>
                    </Form.Select>
                  </div>
                  
                  <div className="sidebar-actions">
                    <Button 
                      variant="warning" 
                      onClick={handleStartScraping} 
                      disabled={isLoading}
                      size="sm"
                      className="sidebar-button"
                    >
                      {isLoading ? 'Scraping...' : 'Mulai Scraping'}
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={handleExport} 
                      size="sm"
                      className="sidebar-button"
                    >
                      Export
                    </Button>
                    <div className="import-container">
                      <Form.Control 
                        type="file" 
                        onChange={handleImport} 
                        accept=".json"
                        size="sm"
                        className="sidebar-file-input"
                      />
                      <Button 
                        variant="primary" 
                        onClick={processImport} 
                        size="sm"
                        className="sidebar-button"
                      >
                        Import
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="sidebar-table-container">
                  <Table striped bordered hover size="sm" className="sidebar-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Judul</th>
                        <th>Kategori</th>
                        <th>Lokasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                                {item.title.length > 30 ? `${item.title.substring(0, 30)}...` : item.title}
                              </a>
                            </td>
                            <td>
                              <Badge bg={getBadgeColor(item.category)} className="sidebar-badge">
                                {item.category}
                              </Badge>
                            </td>
                            <td>{item.location}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Tidak ada data yang ditemukan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
                <div className="sidebar-footer">
                  Menampilkan {filteredData.length} dari {scrapedData.length} data
                </div>
              </div>
            )}
            
            {activeTab === 'insights' && (
              <div className="insights-tab">
                <Button 
                  variant="primary" 
                  onClick={loadInsights} 
                  disabled={isLoading}
                  size="sm"
                  className="sidebar-button mb-3"
                >
                  {isLoading ? 'Memuat...' : 'Generate Insights'}
                </Button>
                
                {insights ? (
                  <div className="sidebar-insights">
                    <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    Klik tombol di atas untuk menghasilkan insights
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Jika tidak dalam mode sidebar, render tombol untuk membuka modal
  return (
    <Button variant="info" onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}>
      Database Scraping
    </Button>
  );
};

export default ScrapingDashboard;