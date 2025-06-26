// Konfigurasi database
export const DB_CONFIG = {
  scraped_data_key: 'chakrai_scraped_data',
  max_entries: 10000 // Batasi jumlah entri untuk menghindari localStorage penuh
};

// Inisialisasi database
export const initializeDatabase = () => {
  // Cek apakah database sudah ada
  const scrapedData = localStorage.getItem(DB_CONFIG.scraped_data_key);
  if (!scrapedData) {
    // Inisialisasi database kosong
    localStorage.setItem(DB_CONFIG.scraped_data_key, JSON.stringify([]));
    console.log('Database initialized with empty data');
  } else {
    console.log('Database already exists');
  }
  
  // Bersihkan data lama jika melebihi batas
  cleanupOldData();
};

// Simpan data hasil scraping ke database
export const saveScrapedData = async (newData) => {
  try {
    // Ambil data yang sudah ada
    const existingDataStr = localStorage.getItem(DB_CONFIG.scraped_data_key);
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
    
    // Filter data baru yang belum ada di database (berdasarkan URL)
    const existingUrls = new Set(existingData.map(item => item.url));
    const filteredNewData = newData.filter(item => !existingUrls.has(item.url));
    
    if (filteredNewData.length === 0) {
      console.log('Tidak ada data baru untuk disimpan');
      return [];
    }
    
    // Gabungkan data baru dengan yang sudah ada
    const combinedData = [...filteredNewData, ...existingData];
    
    // Batasi jumlah data jika melebihi batas
    const trimmedData = combinedData.slice(0, DB_CONFIG.max_entries);
    
    // Simpan kembali ke localStorage
    localStorage.setItem(DB_CONFIG.scraped_data_key, JSON.stringify(trimmedData));
    
    console.log(`Berhasil menyimpan ${filteredNewData.length} data baru`);
    return filteredNewData;
  } catch (error) {
    console.error('Error saat menyimpan data scraping:', error);
    return [];
  }
};

// Ambil semua data hasil scraping
export const getAllScrapedData = () => {
  try {
    const dataStr = localStorage.getItem(DB_CONFIG.scraped_data_key);
    return dataStr ? JSON.parse(dataStr) : [];
  } catch (error) {
    console.error('Error saat mengambil data scraping:', error);
    return [];
  }
};

// Cari data berdasarkan kata kunci
export const searchScrapedData = (keyword, category = null) => {
  try {
    const allData = getAllScrapedData();
    const keywordLower = keyword.toLowerCase();
    
    return allData.filter(item => {
      // Filter berdasarkan kategori jika disediakan
      if (category && item.category !== category) {
        return false;
      }
      
      // Cari di judul, deskripsi, dan lokasi
      return (
        item.title.toLowerCase().includes(keywordLower) ||
        item.description.toLowerCase().includes(keywordLower) ||
        item.location.toLowerCase().includes(keywordLower)
      );
    });
  } catch (error) {
    console.error('Error saat mencari data:', error);
    return [];
  }
};

// Ambil data berdasarkan kategori
export const getDataByCategory = (category) => {
  try {
    const allData = getAllScrapedData();
    return allData.filter(item => item.category === category);
  } catch (error) {
    console.error('Error saat mengambil data berdasarkan kategori:', error);
    return [];
  }
};

// Bersihkan data lama jika melebihi batas
const cleanupOldData = () => {
  try {
    const allData = getAllScrapedData();
    if (allData.length > DB_CONFIG.max_entries) {
      const trimmedData = allData.slice(0, DB_CONFIG.max_entries);
      localStorage.setItem(DB_CONFIG.scraped_data_key, JSON.stringify(trimmedData));
      console.log(`Membersihkan data lama. Menyimpan ${trimmedData.length} dari ${allData.length} data`);
    }
  } catch (error) {
    console.error('Error saat membersihkan data lama:', error);
  }
};

// Ekspor data ke JSON (untuk backup)
export const exportDatabaseToJSON = () => {
  try {
    const allData = getAllScrapedData();
    const dataStr = JSON.stringify(allData, null, 2);
    
    // Buat blob dan download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Buat link download dan klik secara otomatis
    const a = document.createElement('a');
    a.href = url;
    a.download = `chakrai_database_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
    
    return true;
  } catch (error) {
    console.error('Error saat mengekspor database:', error);
    return false;
  }
};

// Import data dari JSON (untuk restore)
export const importDatabaseFromJSON = (jsonData) => {
  try {
    const parsedData = JSON.parse(jsonData);
    if (!Array.isArray(parsedData)) {
      throw new Error('Format data tidak valid');
    }
    
    // Simpan data ke localStorage
    localStorage.setItem(DB_CONFIG.scraped_data_key, JSON.stringify(parsedData));
    console.log(`Berhasil mengimpor ${parsedData.length} data`);
    return true;
  } catch (error) {
    console.error('Error saat mengimpor database:', error);
    return false;
  }
};