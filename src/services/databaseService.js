import { supabase } from '../lib/supabase.js';

// Konfigurasi database
export const DB_CONFIG = {
  table_name: 'scraped_data',
  max_entries: 10000 // Batasi jumlah entri untuk menghindari database penuh
};

// Inisialisasi database
export const initializeDatabase = async () => {
  try {
    // Cek apakah tabel sudah ada dengan mengambil satu record
    const { data, error } = await supabase
      .from(DB_CONFIG.table_name)
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // Tabel tidak ada, buat tabel baru
      console.log('Creating scraped_data table...');
      const { error: createError } = await supabase.rpc('create_scraped_data_table');
      if (createError) {
        console.error('Error creating table:', createError);
      }
    } else if (error) {
      console.error('Error checking database:', error);
    } else {
      console.log('Database already exists');
    }

    // Bersihkan data lama jika melebihi batas
    await cleanupOldData();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Simpan data hasil scraping ke database
export const saveScrapedData = async (newData) => {
  try {
    // Ambil data yang sudah ada untuk cek duplikasi
    const { data: existingData, error: fetchError } = await supabase
      .from(DB_CONFIG.table_name)
      .select('url');

    if (fetchError) {
      console.error('Error fetching existing data:', fetchError);
      return [];
    }

    // Filter data baru yang belum ada di database (berdasarkan URL)
    const existingUrls = new Set(existingData.map(item => item.url));
    const filteredNewData = newData.filter(item => !existingUrls.has(item.url));

    if (filteredNewData.length === 0) {
      console.log('Tidak ada data baru untuk disimpan');
      return [];
    }

    // Simpan data baru ke database
    const { data: savedData, error: insertError } = await supabase
      .from(DB_CONFIG.table_name)
      .insert(filteredNewData)
      .select();

    if (insertError) {
      console.error('Error saving data:', insertError);
      return [];
    }

    console.log(`Berhasil menyimpan ${savedData.length} data baru`);
    return savedData;
  } catch (error) {
    console.error('Error saat menyimpan data scraping:', error);
    return [];
  }
};

// Ambil semua data hasil scraping
export const getAllScrapedData = async () => {
  try {
    const { data, error } = await supabase
      .from(DB_CONFIG.table_name)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error saat mengambil data scraping:', error);
    return [];
  }
};

// Cari data berdasarkan kata kunci
export const searchScrapedData = async (keyword, category = null) => {
  try {
    let query = supabase
      .from(DB_CONFIG.table_name)
      .select('*');

    // Filter berdasarkan kategori jika disediakan
    if (category) {
      query = query.eq('category', category);
    }

    // Cari di judul, deskripsi, dan lokasi
    query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,location.ilike.%${keyword}%`);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error saat mencari data:', error);
    return [];
  }
};

// Ambil data berdasarkan kategori
export const getDataByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from(DB_CONFIG.table_name)
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error saat mengambil data berdasarkan kategori:', error);
    return [];
  }
};

// Bersihkan data lama jika melebihi batas
const cleanupOldData = async () => {
  try {
    const { data: allData, error } = await supabase
      .from(DB_CONFIG.table_name)
      .select('id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data for cleanup:', error);
      return;
    }

    if (allData && allData.length > DB_CONFIG.max_entries) {
      // Ambil ID data yang perlu dihapus (data lama)
      const idsToDelete = allData.slice(DB_CONFIG.max_entries).map(item => item.id);

      const { error: deleteError } = await supabase
        .from(DB_CONFIG.table_name)
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        console.error('Error deleting old data:', deleteError);
      } else {
        console.log(`Membersihkan data lama. Menghapus ${idsToDelete.length} data`);
      }
    }
  } catch (error) {
    console.error('Error saat membersihkan data lama:', error);
  }
};

// Ekspor data ke JSON (untuk backup)
export const exportDatabaseToJSON = async () => {
  try {
    const allData = await getAllScrapedData();
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
export const importDatabaseFromJSON = async (jsonData) => {
  try {
    const parsedData = JSON.parse(jsonData);
    if (!Array.isArray(parsedData)) {
      throw new Error('Format data tidak valid');
    }

    // Simpan data ke database
    const { data, error } = await supabase
      .from(DB_CONFIG.table_name)
      .insert(parsedData)
      .select();

    if (error) {
      console.error('Error importing data:', error);
      return false;
    }

    console.log(`Berhasil mengimpor ${data.length} data`);
    return true;
  } catch (error) {
    console.error('Error saat mengimpor database:', error);
    return false;
  }
};