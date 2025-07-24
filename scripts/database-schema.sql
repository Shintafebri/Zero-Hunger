-- Database Schema untuk Donasi Pangan SDGs
-- Untuk dijalankan di MySQL/MariaDB pada XAMPP

-- Buat database
CREATE DATABASE IF NOT EXISTS donasi_pangan_sdgs;
USE donasi_pangan_sdgs;

-- Tabel Users (Pengguna)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'donor', 'volunteer', 'beneficiary') DEFAULT 'donor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Programs (Program Donasi)
CREATE TABLE programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0,
    location VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabel Donations (Donasi)
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    donor_name VARCHAR(255) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(20),
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    payment_status ENUM('pending', 'success', 'failed', 'cancelled') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Tabel SDGs Data (Data SDGs dari API eksternal)
CREATE TABLE sdgs_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    goal_number INT NOT NULL,
    target_id VARCHAR(10),
    indicator_id VARCHAR(10),
    title VARCHAR(255) NOT NULL,
    value VARCHAR(100),
    year INT,
    status VARCHAR(50),
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Locations (Data Lokasi)
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    province VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INT,
    poverty_rate DECIMAL(5,2),
    food_insecurity_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Payment Logs (Log Pembayaran)
CREATE TABLE payment_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(255),
    gateway_response TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id)
);

-- Index untuk optimasi query
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_location ON programs(location);
CREATE INDEX idx_donations_program ON donations(program_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
