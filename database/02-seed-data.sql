-- Data awal untuk testing
-- Jalankan file ini KEDUA setelah schema

USE donasi_pangan_sdgs;

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Administrator', 'admin@donasipangan.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', 'admin'),
('John Donor', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567891', 'donor'),
('Jane Volunteer', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567892', 'volunteer');

-- Insert sample programs dengan koordinat
INSERT INTO programs (title, description, target_amount, current_amount, location, category, status, start_date, end_date, created_by, latitude, longitude, address, beneficiaries) VALUES
('Bantuan Pangan Daerah Terpencil Sumatra', 'Program bantuan pangan untuk masyarakat di daerah terpencil Sumatra yang kesulitan akses makanan bergizi.', 50000000, 32500000, 'Sumatra Utara', 'Bantuan Pangan Darurat', 'active', '2024-01-15', '2024-06-15', 1, 3.595196, 98.672226, 'Jl. Sisingamangaraja, Medan, Sumatra Utara', 1500),
('Gizi Anak Sekolah Papua', 'Program pemberian makanan bergizi untuk anak-anak sekolah di Papua guna mendukung tumbuh kembang optimal.', 75000000, 45000000, 'Papua', 'Program Gizi Anak', 'active', '2024-01-10', '2024-07-10', 1, -2.533333, 140.716667, 'Jl. Ahmad Yani, Jayapura, Papua', 2300),
('Pemberdayaan Petani Lokal Jawa Tengah', 'Program pemberdayaan petani lokal dengan teknologi pertanian modern untuk meningkatkan hasil panen.', 100000000, 100000000, 'Jawa Tengah', 'Pemberdayaan Petani', 'completed', '2023-12-01', '2024-05-01', 1, -6.966667, 110.416667, 'Jl. Pandanaran, Semarang, Jawa Tengah', 800),
('Program Ketahanan Pangan Sulawesi', 'Meningkatkan ketahanan pangan melalui diversifikasi tanaman pangan lokal di Sulawesi Selatan.', 60000000, 25000000, 'Sulawesi Selatan', 'Ketahanan Pangan', 'active', '2024-02-01', '2024-08-01', 1, -5.147665, 119.432732, 'Jl. AP Pettarani, Makassar, Sulawesi Selatan', 1200),
('Bantuan Gizi Balita Kalimantan', 'Program khusus untuk mengatasi stunting dan malnutrisi pada balita di Kalimantan Timur.', 40000000, 18000000, 'Kalimantan Timur', 'Program Gizi Anak', 'active', '2024-01-20', '2024-07-20', 1, -0.502106, 117.153709, 'Jl. Mulawarman, Samarinda, Kalimantan Timur', 950);

-- Insert sample donations
INSERT INTO donations (program_id, donor_name, donor_email, donor_phone, amount, payment_method, transaction_id, payment_status, message) VALUES
(1, 'Ahmad Wijaya', 'ahmad@example.com', '081234567893', 500000, 'bca', 'TXN1704067200001', 'success', 'Semoga bermanfaat untuk saudara-saudara kita'),
(1, 'Siti Nurhaliza', 'siti@example.com', '081234567894', 1000000, 'mandiri', 'TXN1704067200002', 'success', 'Untuk anak-anak Indonesia'),
(2, 'Budi Santoso', 'budi@example.com', '081234567895', 750000, 'gopay', 'TXN1704067200003', 'success', 'Dukung gizi anak Papua'),
(2, 'Rina Kartika', 'rina@example.com', '081234567896', 2000000, 'bni', 'TXN1704067200004', 'success', 'Semoga anak-anak sehat dan cerdas');

-- Insert location data
INSERT INTO locations (name, province, latitude, longitude, population, poverty_rate, food_insecurity_rate) VALUES
('Medan', 'Sumatra Utara', 3.595196, 98.672226, 2435252, 8.9, 18.4),
('Jayapura', 'Papua', -2.533333, 140.716667, 398478, 27.8, 35.2),
('Semarang', 'Jawa Tengah', -6.966667, 110.416667, 1653524, 11.2, 19.8),
('Jakarta', 'DKI Jakarta', -6.175110, 106.865036, 10560000, 3.8, 12.5),
('Makassar', 'Sulawesi Selatan', -5.147665, 119.432732, 1423877, 9.1, 16.7),
('Samarinda', 'Kalimantan Timur', -0.502106, 117.153709, 827994, 6.8, 14.2);
