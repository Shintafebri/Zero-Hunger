-- Tambahan tabel untuk fitur maps dan lokasi

USE donasi_pangan_sdgs;

-- Tabel untuk menyimpan koordinat program
ALTER TABLE programs 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN address TEXT,
ADD COLUMN beneficiaries INT DEFAULT 0;

-- Tabel untuk data cuaca (opsional, bisa diambil dari API eksternal)
CREATE TABLE weather_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT,
    temperature VARCHAR(10),
    condition VARCHAR(100),
    humidity VARCHAR(10),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Tabel untuk tracking view maps
CREATE TABLE map_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT,
    user_ip VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Update data program dengan koordinat
UPDATE programs SET 
    latitude = 3.595196, 
    longitude = 98.672226, 
    address = 'Jl. Sisingamangaraja, Medan, Sumatra Utara',
    beneficiaries = 1500
WHERE id = 1;

UPDATE programs SET 
    latitude = -2.533333, 
    longitude = 140.716667, 
    address = 'Jl. Ahmad Yani, Jayapura, Papua',
    beneficiaries = 2300
WHERE id = 2;

UPDATE programs SET 
    latitude = -6.966667, 
    longitude = 110.416667, 
    address = 'Jl. Pandanaran, Semarang, Jawa Tengah',
    beneficiaries = 800
WHERE id = 3;

-- Insert data program tambahan untuk maps
INSERT INTO programs (title, description, target_amount, current_amount, location, category, status, start_date, end_date, created_by, latitude, longitude, address, beneficiaries) VALUES
('Program Ketahanan Pangan Sulawesi', 'Meningkatkan ketahanan pangan melalui diversifikasi tanaman pangan lokal di Sulawesi Selatan.', 60000000, 25000000, 'Sulawesi Selatan', 'Ketahanan Pangan', 'active', '2024-02-01', '2024-08-01', 1, -5.147665, 119.432732, 'Jl. AP Pettarani, Makassar, Sulawesi Selatan', 1200),
('Bantuan Gizi Balita Kalimantan', 'Program khusus untuk mengatasi stunting dan malnutrisi pada balita di Kalimantan Timur.', 40000000, 18000000, 'Kalimantan Timur', 'Program Gizi Anak', 'active', '2024-01-20', '2024-07-20', 1, -0.502106, 117.153709, 'Jl. Mulawarman, Samarinda, Kalimantan Timur', 950);

-- Index untuk optimasi query maps
CREATE INDEX idx_programs_coordinates ON programs(latitude, longitude);
CREATE INDEX idx_programs_location_status ON programs(location, status);
