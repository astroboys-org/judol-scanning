import { supabase } from '../lib/supabase.js';

const TABLE_NAME = 'laporan_kasus';

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
    console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are not configured');
    }

    // Test a simple query
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('count')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      throw error;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    throw error;
  }
};

// Inisialisasi data dari database atau gunakan data default
const initializeData = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
      // Jika tabel tidak ada, buat data default
      return getDefaultData();
    }

    return data || getDefaultData();
  } catch (error) {
    console.error('Error initializing data:', error);
    return getDefaultData();
  }
};

// Data default jika tidak ada di database
const getDefaultData = () => {
  return [
    {
      judul: "Kasus Judi Online di Desa Sukamaju",
      desa: "Sukamaju",
      kecamatan: "Cianjur",
      kako: "Bandung",
      provinsi: "Jawa Barat",
      kasus: "Judi Online",
      waktu: "2023-06-15T00:00:00"
    },
    {
      judul: "Pinjaman Online Ilegal di Kelurahan Merdeka",
      desa: "Merdeka",
      kecamatan: "Sumur Bandung",
      kako: "Bandung",
      provinsi: "Jawa Barat",
      kasus: "Pinjaman Online Ilegal",
      waktu: "2023-07-22T00:00:00"
    }
  ];
};

// Simpan data ke database
const saveData = async (data) => {
  try {
    // Hapus data lama
    const { error: deleteError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .neq('id', 0); // Hapus semua data

    if (deleteError) {
      console.error('Error deleting old data:', deleteError);
      return false;
    }

    // Simpan data baru
    const { error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert(data);

    if (insertError) {
      console.error('Error saving data:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

// Ambil semua data
export const getAllData = async () => {
  return await initializeData();
};

// Tambah data baru
export const addNewReport = async (report) => {
  try {
    // Check if Supabase is properly configured
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    const newReport = {
      ...report,
      waktu: new Date().toISOString()
    };

    console.log('Attempting to insert report:', newReport);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(newReport)
      .select();

    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(`Database error: ${error.message || error.details || 'Unknown error'}`);
    }

    console.log('Successfully inserted report:', data);
    return data[0];
  } catch (error) {
    console.error('Error adding new report:', error);
    throw error;
  }
};

// Cari lokasi berdasarkan kata kunci
export const findSimilarLocation = async (inputText) => {
  try {
    const data = await getAllData();
    const locations = [];

    // Kumpulkan semua lokasi dari data
    data.forEach(item => {
      locations.push(item.desa);
      locations.push(item.kecamatan);
      locations.push(item.kako);
      locations.push(item.provinsi);
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
        matchingLocations.includes(item.desa) ||
        matchingLocations.includes(item.kecamatan) ||
        matchingLocations.includes(item.kako) ||
        matchingLocations.includes(item.provinsi)
      );

      return {
        found: true,
        location: matchingLocations[0],
        cases: matchingCases
      };
    }

    return { found: false };
  } catch (error) {
    console.error('Error finding similar location:', error);
    return { found: false };
  }
};