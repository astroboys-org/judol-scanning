import { GoogleGenerativeAI } from "@google/generative-ai";

// Ganti dengan API key Anda
const API_KEY = "AIzaSyBoJyYtLFNt8lqQe5C9EUmBqokAuUJC5yM";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeLocation = async (location) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prompt untuk analisis lokasi
    const prompt = `
      Analisis lokasi berikut untuk mendeteksi kemungkinan aktivitas judi online:
      Lokasi: ${location}
      
      Berdasarkan data yang tersedia, berikan:
      1. Tingkat risiko judi online di lokasi tersebut (tinggi/sedang/rendah)
      2. Rekomendasi tindakan pencegahan
      3. Tips keamanan untuk menghindari judi online
      
      Format respons dalam bahasa Indonesia yang ramah dan informatif menggunakan markdown.
      Gunakan **bold** untuk penekanan, bullet points untuk daftar, dan struktur yang jelas.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error saat menganalisis lokasi:", error);
    return "Maaf, terjadi kesalahan saat menganalisis lokasi. Silakan coba lagi nanti.";
  }
};

export const getFinancialAdvice = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Berikan tips pengelolaan keuangan untuk menghindari judi online dan pinjaman online ilegal dalam format berikut:
      1. Cara mengatur keuangan harian
      2. Cara mengenali dan menghindari tawaran judi online
      3. Cara mengenali dan menghindari pinjaman online ilegal
      4. Sumber informasi resmi untuk literasi keuangan
      
      Format respons dalam bahasa Indonesia yang ramah dan informatif menggunakan markdown.
      Gunakan **bold** untuk penekanan, bullet points untuk daftar, dan struktur yang jelas.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error saat mendapatkan saran keuangan:", error);
    return "Maaf, terjadi kesalahan saat mendapatkan saran keuangan. Silakan coba lagi nanti.";
  }
};