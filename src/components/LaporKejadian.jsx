import React, { useState } from 'react';
import { addNewReport } from '../services/dataService';

const LaporKejadian = ({ onReportAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [formData, setFormData] = useState({
    Judul: '',
    Desa: '',
    Kecamatan: '',
    Kako: '',
    Provinsi: '',
    Kasus: 'Judi Online',
    Waktu: new Date().toISOString().split('T')[0]
  });

  const handleShowForm = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Validasi form sederhana
    if (!formData.Judul || !formData.Desa || !formData.Kecamatan || !formData.Kako || !formData.Provinsi) {
      alert('Semua field harus diisi');
      return;
    }

    // Simpan laporan
    addNewReport(formData);
    
    // Reset form dan tutup modal
    setFormData({
      Judul: '',
      Desa: '',
      Kecamatan: '',
      Kako: '',
      Provinsi: '',
      Kasus: 'Judi Online',
      Waktu: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
    
    // Tampilkan notifikasi
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
    
    // Callback untuk refresh data
    if (onReportAdded) onReportAdded();
  };

  return (
    <>
      <button 
        onClick={handleShowForm} 
        className="action-button primary-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Lapor Kejadian Lokal
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lapor Kejadian</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Judul Kasus</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="Judul" 
                  value={formData.Judul} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Jenis Kasus</label>
                <select 
                  className="form-select"
                  name="Kasus" 
                  value={formData.Kasus} 
                  onChange={handleInputChange}
                >
                  <option value="Judi Online">Judi Online</option>
                  <option value="Pinjaman Online Ilegal">Pinjaman Online Ilegal</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Desa</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="Desa" 
                  value={formData.Desa} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Kecamatan</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="Kecamatan" 
                  value={formData.Kecamatan} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Kabupaten/Kota</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="Kako" 
                  value={formData.Kako} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Provinsi</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="Provinsi" 
                  value={formData.Provinsi} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Waktu Kejadian</label>
                <input 
                  type="date" 
                  className="form-control"
                  name="Waktu" 
                  value={formData.Waktu} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="action-button secondary-button" onClick={() => setShowModal(false)}>
                Batal
              </button>
              <button className="action-button primary-button" onClick={handleSubmit}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotif && (
        <div className="notification">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>
          Laporan Anda telah berhasil kami terima. Terima kasih atas kontribusinya!
        </div>
      )}
    </>
  );
};

export default LaporKejadian;