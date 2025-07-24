-- Data awal untuk testing
-- Jalankan setelah database-schema.sql

USE donasi_pangan_sdgs;

-- Insert admin user
INSERT INTO users (name, email, password, phone, role) VALUES
('Administrator', 'admin@donasipangan.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', 'admin'),
('John Donor', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567891', 'donor'),
('Jane Volunteer', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567892', 'volunteer');

-- Insert sample programs
INSERT INTO programs (title, description, target_amount, current_amount, location, category, status, start_date, end_date, created_by) VALUES
('Bantuan Pangan Daerah Terpencil Sumatra', 'Program bantuan pangan untuk masyarakat di daerah terpencil Sumatra yang kesulitan akses makanan bergizi.', 50000000, 32500000, 'Sumatra Utara', 'Bantuan Pangan Darurat', 'active', '2024-01-15', '2024-06-15', 1),
('Gizi Anak Sekolah Papua', 'Program pemberian makanan bergizi untuk anak-anak sekolah di Papua guna mendukung tumbuh kembang optimal.', 75000000, 45000000, 'Papua', 'Program Gizi Anak', 'active', '2024-01-10', '2024-07-10', 1),
('Pemberdayaan Petani Lokal Jawa Tengah', 'Program pemberdayaan petani lokal dengan teknologi pertanian modern untuk meningkatkan hasil panen.', 100000000, 100000000, 'Jawa Tengah', 'Pemberdayaan Petani', 'completed', '2023-12-01', '2024-05-01', 1);

-- Insert sample donations
INSERT INTO donations (program_id, donor_name, donor_email, donor_phone, amount, payment_method, transaction_id, payment_status, message) VALUES
(1, 'Ahmad Wijaya', 'ahmad@example.com', '081234567893', 500000, 'bca', 'TXN1704067200001', 'success', 'Semoga bermanfaat untuk saudara-saudara kita'),
(1, 'Siti Nurhaliza', 'siti@example.com', '081234567894', 1000000, 'mandiri', 'TXN1704067200002', 'success', 'Untuk anak-anak Indonesia'),
(2, 'Budi Santoso', 'budi@example.com', '081234567895', 750000, 'gopay', 'TXN1704067200003', 'success', 'Dukung gizi anak Papua'),
(2, 'Rina Kartika', 'rina@example.com', '081234567896', 2000000, 'bni', 'TXN1704067200004', 'success', 'Semoga anak-anak sehat dan cerdas');

-- Insert SDGs data
INSERT INTO sdgs_data (goal_number, target_id, indicator_id, title, value, year, status, source) VALUES
(2, '2.1', '2.1.1', 'Prevalence of undernourishment', '8.9%', 2023, 'improving', 'Bappenas Indonesia'),
(2, '2.1', '2.1.2', 'Prevalence of moderate or severe food insecurity', '23.2%', 2023, 'stable', 'Bappenas Indonesia'),
(2, '2.2', '2.2.1', 'Prevalence of stunting among children under 5', '21.6%', 2023, 'improving', 'Kemenkes Indonesia'),
(2, '2.2', '2.2.2', 'Prevalence of wasting among children under 5', '7.7%', 2023, 'stable', 'Kemenkes Indonesia');

-- Insert location data
INSERT INTO locations (name, province, latitude, longitude, population, poverty_rate, food_insecurity_rate) VALUES
('Medan', 'Sumatra Utara', 3.595196, 98.672226, 2435252, 8.9, 18.4),
('Jayapura', 'Papua', -2.533333, 140.716667, 398478, 27.8, 35.2),
('Semarang', 'Jawa Tengah', -6.966667, 110.416667, 1653524, 11.2, 19.8),
('Jakarta', 'DKI Jakarta', -6.175110, 106.865036, 10560000, 3.8, 12.5);
