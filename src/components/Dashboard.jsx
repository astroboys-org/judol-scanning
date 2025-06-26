import React, { useState, useEffect } from 'react';
import { getAllData } from '../services/dataService';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Ambil data saat komponen dimuat
    setData(getAllData());
  }, []);

  const handleShowDashboard = () => {
    setShowModal(true);
  };

  // Hitung jumlah kasus per bulan untuk visualisasi
  const getCasesByMonth = () => {
    const monthCounts = {};
    
    data.forEach(item => {
      const date = new Date(item.Waktu);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthCounts[monthYear]) {
        monthCounts[monthYear] = 0;
      }
      monthCounts[monthYear]++;
    });
    
    return Object.entries(monthCounts).map(([key, value]) => ({
      month: key,
      count: value
    }));
  };

  // Hitung jumlah kasus per wilayah
  const getCasesByRegion = () => {
    const regionCounts = {};
    
    data.forEach(item => {
      if (!regionCounts[item.Kako]) {
        regionCounts[item.Kako] = 0;
      }
      regionCounts[item.Kako]++;
    });
    
    return Object.entries(regionCounts).map(([key, value]) => ({
      region: key,
      count: value
    }));
  };

  return (
    <>
      <button 
        onClick={handleShowDashboard} 
        className="action-button secondary-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 0h16v16H0V0zm1 1v14h14V1H1zm1 1h12v12H2V2zm.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
          <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1-2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm-2 4a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5zm-1-2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
        </svg>
        Dashboard Kasus
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Visualisasi Kasus</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="dashboard-container">
                <div className="dashboard-card">
                  <h3>Jumlah Kejadian per Bulan</h3>
                  <div className="chart-container">
                    {getCasesByMonth().map((item, index) => (
                      <div key={index} className="chart-item">
                        <div className="chart-bar" style={{ height: `${item.count * 30}px` }}></div>
                        <div className="chart-label">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="dashboard-card">
                  <h3>Jumlah Kejadian menurut Wilayah</h3>
                  <div className="chart-container">
                    {getCasesByRegion().map((item, index) => (
                      <div key={index} className="chart-item horizontal">
                        <div className="chart-label">{item.region}</div>
                        <div className="chart-bar horizontal" style={{ width: `${item.count * 30}px` }}></div>
                        <div className="chart-value">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-button secondary-button" onClick={() => setShowModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;