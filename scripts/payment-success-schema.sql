-- Tambahan tabel untuk tracking payment success dan receipt

USE donasi_pangan_sdgs;

-- Tabel untuk menyimpan receipt/kwitansi digital
CREATE TABLE receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    file_path VARCHAR(255),
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id)
);

-- Tabel untuk tracking sharing donasi
CREATE TABLE donation_shares (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    platform VARCHAR(50), -- facebook, twitter, whatsapp, etc
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id)
);

-- Tabel untuk impact tracking
CREATE TABLE impact_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    people_fed INT DEFAULT 0,
    families_helped INT DEFAULT 0,
    children_nutrition INT DEFAULT 0,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(id)
);

-- Update donations table untuk menambah kolom impact
ALTER TABLE donations 
ADD COLUMN impact_people_fed INT DEFAULT 0,
ADD COLUMN impact_families_helped INT DEFAULT 0,
ADD COLUMN impact_children_nutrition INT DEFAULT 0;

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
