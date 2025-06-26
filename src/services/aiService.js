import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllScrapedData, getDataByCategory, searchScrapedData } from './databaseService.js';

const API_KEY = "AIzaSyBoJyYtLFNt8lqQe5C9EUmBqokAuUJC5yM";
const genAI = new GoogleGenerativeAI(API_KEY);

// Analisis lokasi dengan data dari database scraping
export const analyzeLocationWithScrapedData = async (location) => {
  try {
    // Cari data terkait lokasi dari database scraping
    const relatedData = searchScrapedData(location);
    
    // Ambil data judi online untuk konteks tambahan
    const judiOnlineData = getDataByCategory('Judi Online').slice(0, 5);
    const pinjolData = getDataByCategory('Pinjol Ilegal').slice(0, 5);
    
    // Gabungkan data untuk konteks
    const contextData = [...relatedData, ...judiOnlineData, ...pinjolData];
    
    // Format data untuk konteks AI
    const contextStr = contextData.map(item => (
      `- ${item.title} (${item.category}, ${item.location}, ${item.timestamp})`
    )).join('\n');
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prompt dengan konteks dari database scraping
    const prompt = `
      Analisis lokasi berikut untuk mendeteksi kemungkinan aktivitas judi online dan pinjaman ilegal:
      Lokasi: ${location}
      
      Konteks dari database kasus:
      ${contextStr || 'Tidak ada data spesifik untuk lokasi ini.'}
      
      Berdasarkan data yang tersedia, berikan:
      1. Tingkat risiko judi online di lokasi tersebut (tinggi/sedang/rendah)
      2. Tingkat risiko pinjaman ilegal di lokasi tersebut (tinggi/sedang/rendah)
      3. Rekomendasi tindakan pencegahan
      4. Tips keamanan untuk menghindari judi online dan pinjaman ilegal
      
      Format respons dalam bahasa Indonesia yang ramah dan informatif.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error saat menganalisis lokasi dengan data scraping:", error);
    return "Maaf, terjadi kesalahan saat menganalisis lokasi. Silakan coba lagi nanti.";
  }
};

// Dapatkan insight dari data yang di-scrape
export const getInsightsFromScrapedData = async () => {
  try {
    // Ambil data untuk analisis
    const allData = getAllScrapedData();
    const judiOnlineData = getDataByCategory('Judi Online');
    const pinjolData = getDataByCategory('Pinjol Ilegal');
    const kreditIlegalData = getDataByCategory('Kredit Ilegal');
    const sabungAyamData = getDataByCategory('Judi Sabung Ayam');
    
    // Hitung statistik dasar
    const stats = {
      total: allData.length,
      judiOnline: judiOnlineData.length,
      pinjolIlegal: pinjolData.length,
      kreditIlegal: kreditIlegalData.length,
      sabungAyam: sabungAyamData.length
    };
    
    // Ambil 10 kasus terbaru untuk konteks
    const recentCases = allData.slice(0, 10).map(item => (
      `- ${item.title} (${item.category}, ${item.location}, ${item.timestamp})`
    )).join('\n');
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prompt untuk analisis insight
    const prompt = `
      Analisis data kasus ilegal berikut dan berikan insight:
      
      Statistik:
      - Total kasus: ${stats.total}
      - Kasus judi online: ${stats.judiOnline}
      - Kasus pinjol ilegal: ${stats.pinjolIlegal}
      - Kasus kredit ilegal: ${stats.kreditIlegal}
      - Kasus judi sabung ayam: ${stats.sabungAyam}
      
      Kasus terbaru:
      ${recentCases}
      
      Berdasarkan data di atas, berikan:
      1. Tren terkini tentang aktivitas ilegal ini di Indonesia
      2. Rekomendasi untuk masyarakat dalam menghindari aktivitas ilegal tersebut
      3. Prediksi perkembangan kasus ke depan
      
      Format respons dalam bahasa Indonesia yang informatif dan berbasis data.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error saat mendapatkan insight dari data scraping:", error);
    return "Maaf, terjadi kesalahan saat menganalisis data. Silakan coba lagi nanti.";
  }
};

// Fungsi untuk mengekstrak informasi penting dari hasil scraping menggunakan Gemini AI
export const extractInformationFromScrapedData = async (scrapedData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Batasi jumlah data yang diproses untuk menghindari token limit
    const dataToProcess = scrapedData.slice(0, 10); // Proses 10 data sekaligus
    
    const dataStr = dataToProcess.map(item => {
      return `URL: ${item.url}\nJudul: ${item.title}\nDeskripsi: ${item.description || 'Tidak ada deskripsi'}\nSumber: ${item.source}\nTimestamp: ${item.timestamp}`;
    }).join('\n\n');
    
    const prompt = `
      Analisis data berikut dan ekstrak informasi penting:
      
      ${dataStr}
      
      Untuk setiap item, berikan:
      1. Judul yang lebih informatif dan ringkas
      2. Kategori yang tepat (Judi Online, Pinjol Ilegal, Kredit Ilegal, Judi Sabung Ayam)
      3. Lokasi kejadian yang WAJIB spesifik minimal tingkat kabupaten/kota, lebih baik jika bisa kecamatan atau desa
         Format lokasi: "[Nama Kabupaten/Kota], [Provinsi]" atau "[Desa/Kelurahan], [Kecamatan], [Kabupaten/Kota]"
         JANGAN pernah mengembalikan hanya "Indonesia" sebagai lokasi
      
      Format respons dalam JSON seperti berikut:
      [
        {
          "url": "url_asli",
          "title": "judul_yang_diperbarui",
          "category": "kategori_yang_tepat",
          "location": "lokasi_spesifik"
        },
        ...
      ]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const parsedResponse = JSON.parse(response.text());
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error saat mengekstrak informasi dari data scraping:", error);
    return [];
  }
};

// Fungsi untuk mengekstrak lokasi spesifik dari judul atau deskripsi berita
export const extractSpecificLocation = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Ekstrak lokasi spesifik dari teks berikut:
      "${text}"
      
      Aturan ekstraksi:
      1. WAJIB mengembalikan lokasi minimal tingkat kabupaten/kota, kecamatan, atau desa
      2. JANGAN pernah mengembalikan hanya nama provinsi atau negara
      3. Jika tidak ada lokasi spesifik yang disebutkan, analisis konteks untuk menebak lokasi berdasarkan konten
      4. Jika benar-benar tidak ada petunjuk lokasi spesifik, kembalikan "Lokasi tidak spesifik"
      5. Format respons: "[Nama Kabupaten/Kota], [Provinsi]" atau "[Desa/Kelurahan], [Kecamatan], [Kabupaten/Kota]"
      
      Format respons: Nama lokasi saja (contoh: "Kabupaten Bogor, Jawa Barat" atau "Desa Sukamaju, Kecamatan Ciomas, Kabupaten Bogor")
      Jangan sertakan kata pengantar atau penjelasan tambahan.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const extractedLocation = response.text().trim();
    
    // Jika lokasi tidak ditemukan atau terlalu umum (hanya Indonesia), kembalikan nilai default
    if (extractedLocation === "Lokasi tidak spesifik" || extractedLocation === "Indonesia") {
      return "Lokasi tidak spesifik";
    }
    
    return extractedLocation;
  } catch (error) {
    console.error("Error saat mengekstrak lokasi:", error);
    return "Lokasi tidak spesifik";
  }
};

// Fungsi untuk memproses batch data dan mengekstrak lokasi untuk setiap item
export const processLocationBatch = async (dataItems) => {
  const processedItems = [];
  
  for (const item of dataItems) {
    // Gabungkan judul dan deskripsi untuk analisis
    const textToAnalyze = `${item.title} ${item.description || ''}`;
    
    // Ekstrak lokasi spesifik
    const specificLocation = await extractSpecificLocation(textToAnalyze);
    
    // Update item dengan lokasi yang lebih spesifik
    processedItems.push({
      ...item,
      location: specificLocation !== "Lokasi tidak spesifik" ? specificLocation : item.location
    });
  }
  
  return processedItems;
};