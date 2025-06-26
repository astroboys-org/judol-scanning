// Hapus import puppeteer
import { saveScrapedData } from './databaseService.js';
import axios from 'axios';

// Konfigurasi untuk scraping
const SCRAPING_CONFIG = {
  interval: 3600000, // Interval scraping dalam milidetik (1 jam)
  apiBaseUrl: 'http://localhost:3001/api', // URL API backend
  corsProxy: 'http://localhost:3001/proxy?url=', // CORS proxy
  sources: [
    {
      name: 'Kominfo Pemblokiran',
      url: 'https://trustpositif.kominfo.go.id/assets/db/db_gamble.txt',
      type: 'text',
      category: 'Judi Online'
    },
    // Sumber berita untuk scraping
    {
      name: 'Detik News',
      url: 'https://www.detik.com/search/searchall?query=pinjol%20ilegal',
      type: 'html',
      category: 'Pinjol Ilegal'
    },
    {
      name: 'Detik News - Judi Online',
      url: 'https://www.detik.com/search/searchall?query=judi%20online',
      type: 'html',
      category: 'Judi Online'
    },
    {
      name: 'Detik News - Sabung Ayam',
      url: 'https://www.detik.com/search/searchall?query=judi%20sabung%20ayam',
      type: 'html',
      category: 'Judi Sabung Ayam'
    },
    {
      name: 'Kompas - Pinjol Ilegal',
      url: 'https://search.kompas.com/search/?q=pinjol%20ilegal',
      type: 'html',
      category: 'Pinjol Ilegal'
    },
    {
      name: 'Kompas - Kredit Ilegal',
      url: 'https://search.kompas.com/search/?q=kredit%20ilegal',
      type: 'html',
      category: 'Kredit Ilegal'
    },
    // Tambahkan sumber lain sesuai kebutuhan
  ]
};

// Fungsi untuk memulai proses scraping
export const startScraping = async () => {
  console.log('Memulai proses scraping otomatis...');
  // Jalankan scraping pertama kali
  return runScraping(); // Return promise untuk async/await
};

// Fungsi utama untuk menjalankan scraping
const runScraping = async () => {
  console.log(`Menjalankan scraping pada ${new Date().toLocaleString()}`);
  
  try {
    // Panggil API backend untuk menjalankan scraping
    const response = await axios.post(`${SCRAPING_CONFIG.apiBaseUrl}/scrape`);
    const results = response.data.results;
    
    // Proses hasil scraping
    for (const result of results) {
      if (result.data && result.data.length > 0) {
        // Simpan data ke database lokal
        const savedData = await saveScrapedData(result.data);
        console.log(`Berhasil menyimpan ${savedData.length} data baru dari ${result.source}`);
      } else {
        console.log(`Tidak ada data baru dari ${result.source}`);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error saat menjalankan scraping:', error.message);
    return [{ error: error.message }];
  }
};

// Fungsi untuk menghentikan scraping (jika diperlukan)
export const stopScraping = () => {
  // Implementasi untuk menghentikan interval jika diperlukan
  console.log('Scraping dihentikan');
};