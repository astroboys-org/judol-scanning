-- Supabase Setup Script for ChakrAI Application
-- Run this in your Supabase SQL Editor

-- Create scraped_data table
CREATE TABLE IF NOT EXISTS scraped_data (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    source TEXT,
    category TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create laporan_kasus table for user reports
CREATE TABLE IF NOT EXISTS laporan_kasus (
    id BIGSERIAL PRIMARY KEY,
    Judul TEXT,
    Desa TEXT,
    Kecamatan TEXT,
    Kako TEXT,
    Provinsi TEXT,
    Kasus TEXT,
    Waktu TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scraped_data_url ON scraped_data(url);
CREATE INDEX IF NOT EXISTS idx_scraped_data_category ON scraped_data(category);
CREATE INDEX IF NOT EXISTS idx_scraped_data_location ON scraped_data(location);
CREATE INDEX IF NOT EXISTS idx_scraped_data_created_at ON scraped_data(created_at);

CREATE INDEX IF NOT EXISTS idx_laporan_kasus_kasus ON laporan_kasus(Kasus);
CREATE INDEX IF NOT EXISTS idx_laporan_kasus_desa ON laporan_kasus(Desa);
CREATE INDEX IF NOT EXISTS idx_laporan_kasus_kecamatan ON laporan_kasus(Kecamatan);
CREATE INDEX IF NOT EXISTS idx_laporan_kasus_kako ON laporan_kasus(Kako);
CREATE INDEX IF NOT EXISTS idx_laporan_kasus_provinsi ON laporan_kasus(Provinsi);

-- Enable Row Level Security (RLS)
ALTER TABLE scraped_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_kasus ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public security app)
CREATE POLICY "Allow public read access to scraped_data" ON scraped_data
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access to laporan_kasus" ON laporan_kasus
    FOR SELECT USING (true);

-- Create policies for authenticated users to insert/update
CREATE POLICY "Allow authenticated users to insert scraped_data" ON scraped_data
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update scraped_data" ON scraped_data
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert laporan_kasus" ON laporan_kasus
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update laporan_kasus" ON laporan_kasus
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_scraped_data_updated_at 
    BEFORE UPDATE ON scraped_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_laporan_kasus_updated_at 
    BEFORE UPDATE ON laporan_kasus 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO laporan_kasus (Judul, Desa, Kecamatan, Kako, Provinsi, Kasus) VALUES
('Kasus Judi Online di Desa Sukamaju', 'Sukamaju', 'Cianjur', 'Bandung', 'Jawa Barat', 'Judi Online'),
('Pinjaman Online Ilegal di Kelurahan Merdeka', 'Merdeka', 'Sumur Bandung', 'Bandung', 'Jawa Barat', 'Pinjaman Online Ilegal')
ON CONFLICT DO NOTHING; 