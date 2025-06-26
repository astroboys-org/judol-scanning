import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import process from 'process';
// Import fungsi ekstraksi lokasi
// Pastikan ini ada di package.json
// "type": "module",

// Dan pastikan path import relatif sudah benar
import { processLocationBatch } from './src/services/aiService.js';

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi untuk scraping
const SCRAPING_CONFIG = {
  sources: [
    {
      name: 'Kominfo Pemblokiran',
      url: 'https://trustpositif.kominfo.go.id/assets/db/db_gamble.txt',
      type: 'text',
      category: 'Judi Online',
    },
    {
      name: 'Detik News',
      url: 'https://www.detik.com/search/searchall?query=pinjol%20ilegal',
      type: 'html',
      category: 'Pinjol Ilegal',
    },
    {
      name: 'Detik News - Judi Online',
      url: 'https://www.detik.com/search/searchall?query=judi%20online',
      type: 'html',
      category: 'Judi Online',
    },
    {
      name: 'Detik News - Sabung Ayam',
      url: 'https://www.detik.com/search/searchall?query=judi%20sabung%20ayam',
      type: 'html',
      category: 'Judi Sabung Ayam',
    },
    {
      name: 'Kompas - Pinjol Ilegal',
      url: 'https://search.kompas.com/search/?q=pinjol%20ilegal',
      type: 'html',
      category: 'Pinjol Ilegal',
    },
    {
      name: 'Kompas - Kredit Ilegal',
      url: 'https://search.kompas.com/search/?q=kredit%20ilegal',
      type: 'html',
      category: 'Kredit Ilegal',
    },
  ]
};

// Endpoint untuk CORS proxy
app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send('URL parameter is required');
    }
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send(`Proxy error: ${error.message}`);
  }
});

// Endpoint untuk menjalankan scraping
app.post('/api/scrape', async (req, res) => {
  try {
    const results = [];
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const source of SCRAPING_CONFIG.sources) {
      try {
        console.log(`Scraping dari sumber: ${source.name}`);
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        console.log(`Mengakses URL: ${source.url}`);
        await page.goto(source.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        const content = await page.content();
        console.log(`Respons diterima dari ${source.name}, ukuran data: ${content.length} bytes`);
        
        // Parse data berdasarkan jenis sumber
        let parsedData = [];
        
        if (source.type === 'text') {
          // Parse data teks (seperti Kominfo)
          const lines = content.split('\n').filter(line => line.trim() !== '');
          
          parsedData = lines.map(line => ({
            url: line.trim(),
            title: `Domain Judi Online Terblokir: ${line.trim()}`,
            description: 'Domain yang diblokir oleh Kominfo karena terindikasi judi online',
            source: source.name,
            category: source.category,
            timestamp: new Date().toISOString(),
            location: 'Indonesia' // Default location yang akan diupdate
          }));
        } else if (source.type === 'html') {
          // Parse data HTML (seperti Detik atau Kompas)
          const $ = cheerio.load(content);
          
          if (source.name.includes('Detik')) {
            // Parse Detik News
            $('article').each((i, el) => {
              const title = $(el).find('h2').text().trim();
              const link = $(el).find('a').first().attr('href');
              const dateStr = $(el).find('span.date').text().trim();
              const description = title; // Gunakan judul sebagai deskripsi jika tidak ada deskripsi
              
              parsedData.push({
                title,
                url: link,
                description,
                source: source.name,
                category: source.category,
                timestamp: dateStr || new Date().toISOString(),
                location: 'Indonesia' // Default location yang akan diupdate
              });
            });
          } else if (source.name.includes('Kompas')) {
            // Parse Kompas
            $('.article__list').each((i, el) => {
              const title = $(el).find('h3 a').text().trim();
              const link = $(el).find('h3 a').attr('href');
              const dateStr = $(el).find('.article__date').text().trim();
              const description = title; // Gunakan judul sebagai deskripsi jika tidak ada deskripsi
              
              parsedData.push({
                title,
                url: link,
                description,
                source: source.name,
                category: source.category,
                timestamp: dateStr || new Date().toISOString(),
                location: 'Indonesia' // Default location yang akan diupdate
              });
            });
          }
        }
        
        console.log(`Data berhasil di-parse, jumlah item: ${parsedData.length}`);
        
        // Proses batch data untuk mengekstrak lokasi spesifik
        if (parsedData.length > 0) {
          console.log(`Mengekstrak lokasi spesifik untuk ${parsedData.length} item...`);
          
          // Batasi jumlah item yang diproses sekaligus untuk menghindari rate limit
          const batchSize = 5;
          let processedData = [];
          
          for (let i = 0; i < parsedData.length; i += batchSize) {
            const batch = parsedData.slice(i, Math.min(i + batchSize, parsedData.length));
            const processedBatch = await processLocationBatch(batch);
            processedData = [...processedData, ...processedBatch];
            
            // Tambahkan delay kecil antara batch untuk menghindari rate limit
            if (i + batchSize < parsedData.length) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          parsedData = processedData;
          console.log(`Ekstraksi lokasi selesai, ${parsedData.length} item diproses`);
        }
        
        results.push({
          source: source.name,
          parsed: parsedData.length,
          data: parsedData
        });
        
        await page.close();
      } catch (error) {
        console.error(`Error saat scraping ${source.name}:`, error.message);
        results.push({
          source: source.name,
          error: error.message
        });
      }
      
      // Delay antar request untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    await browser.close();
    res.json({ success: true, results });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint untuk mendapatkan data yang sudah di-scrape
app.get('/api/data', (req, res) => {
  // Di sini Anda bisa menambahkan logika untuk mengambil data dari database
  // Untuk contoh sederhana, kita akan mengembalikan data dummy
  res.json({
    success: true,
    message: 'Data retrieved successfully',
    data: []
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});