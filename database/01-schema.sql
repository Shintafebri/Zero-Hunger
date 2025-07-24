-- Database Schema untuk Donasi Pangan SDGs
-- Jalankan file ini PERTAMA

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
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    beneficiaries INT DEFAULT 0,
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
    impact_people_fed INT DEFAULT 0,
    impact_families_helped INT DEFAULT 0,
    impact_children_nutrition INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id)
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

-- Index untuk optimasi query
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_location ON programs(location);
CREATE INDEX idx_donations_program ON donations(program_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_programs_coordinates ON programs(latitude, longitude);

-- Trigger untuk auto-calculate impact setelah donation berhasil
DELIMITER //
CREATE TRIGGER calculate_donation_impact 
AFTER UPDATE ON donations
FOR EACH ROW
BEGIN
    IF NEW.payment_status = 'success' AND OLD.payment_status != 'success' THEN
        UPDATE donations 
        SET 
            impact_people_fed = FLOOR(NEW.amount / 25000),
            impact_families_helped = FLOOR(NEW.amount / 100000),
            impact_children_nutrition = FLOOR(NEW.amount / 50000)
        WHERE id = NEW.id;
        
        -- Update current_amount di program
        UPDATE programs 
        SET current_amount = current_amount + NEW.amount 
        WHERE id = NEW.program_id;
    END IF;
END//
DELIMITER ;
