// Simulasi database dengan localStorage
const STORAGE_KEY = 'chakrai_data';

// Inisialisasi data dari localStorage atau gunakan data default
const initializeData = () => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  // Data default jika tidak ada di localStorage
  return [
    {
      Judul: "Kasus Judi Online di Desa Sukamaju",
      Desa: "Sukamaju",
      Kecamatan: "Cianjur",
      Kako: "Bandung",
      Provinsi: "Jawa Barat",
      Kasus: "Judi Online",
      Waktu: "2023-06-15T00:00:00"
    },
    {
      Judul: "Pinjaman Online Ilegal di Kelurahan Merdeka",
      Desa: "Merdeka",
      Kecamatan: "Sumur Bandung",
      Kako: "Bandung",
      Provinsi: "Jawa Barat",
      Kasus: "Pinjaman Online Ilegal",
      Waktu: "2023-07-22T00:00:00"
    }
  ];
};

// Simpan data ke localStorage
const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Ambil semua data
export const getAllData = () => {
  return initializeData();
};

// Tambah data baru
export const addNewReport = (report) => {
  const data = getAllData();
  const newData = [...data, {
    ...report,
    Waktu: new Date().toISOString()
  }];
  
  saveData(newData);
  return newData;
};

// Cari lokasi berdasarkan kata kunci
export const findSimilarLocation = (inputText) => {
  const data = getAllData();
  const locations = [];
  
  // Kumpulkan semua lokasi dari data
  data.forEach(item => {
    locations.push(item.Desa);
    locations.push(item.Kecamatan);
    locations.push(item.Kako);
    locations.push(item.Provinsi);
  });
  
  // Filter lokasi yang unik
  const uniqueLocations = [...new Set(locations)];
  
  // Cari lokasi yang mirip dengan input
  const inputLower = inputText.toLowerCase();
  const matchingLocations = uniqueLocations.filter(loc => 
    loc.toLowerCase().includes(inputLower)
  );
  
  if (matchingLocations.length > 0) {
    // Ambil data kasus untuk lokasi yang cocok
    const matchingCases = data.filter(item => 
      matchingLocations.includes(item.Desa) || 
      matchingLocations.includes(item.Kecamatan) || 
      matchingLocations.includes(item.Kako) || 
      matchingLocations.includes(item.Provinsi)
    );
    
    return {
      found: true,
      location: matchingLocations[0],
      cases: matchingCases
    };
  }
  
  return { found: false };
};