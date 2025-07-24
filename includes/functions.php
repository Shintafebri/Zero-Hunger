<?php
/**
 * Helper Functions
 * File: includes/functions.php
 */

/**
 * Get user data by ID
 */
function getUserById($pdo, $userId) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * Get all programs
 */
function getAllPrograms($pdo, $status = null) {
    try {
        $sql = "SELECT p.*, 
                       (SELECT COUNT(*) FROM donations d WHERE d.program_id = p.id AND d.payment_status = 'success') as donor_count
                FROM programs p";
        
        if ($status) {
            $sql .= " WHERE p.status = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$status]);
        } else {
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }
        
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        return [];
    }
}

/**
 * Get program by ID
 */
function getProgramById($pdo, $programId) {
    try {
        $stmt = $pdo->prepare("
            SELECT p.*, 
                   (SELECT COUNT(*) FROM donations d WHERE d.program_id = p.id AND d.payment_status = 'success') as donor_count,
                   (SELECT SUM(d.amount) FROM donations d WHERE d.program_id = p.id AND d.payment_status = 'success') as total_donations
            FROM programs p 
            WHERE p.id = ?
        ");
        $stmt->execute([$programId]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * Create new program
 */
function createProgram($pdo, $data) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO programs (title, description, target_amount, location, category, start_date, end_date, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        return $stmt->execute([
            $data['title'],
            $data['description'],
            $data['target_amount'],
            $data['location'],
            $data['category'],
            $data['start_date'],
            $data['end_date'],
            $data['created_by']
        ]);
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * Process donation
 */
function processDonation($pdo, $data) {
    try {
        $pdo->beginTransaction();
        
        // Insert donation
        $stmt = $pdo->prepare("
            INSERT INTO donations (program_id, donor_name, donor_email, donor_phone, amount, payment_method, transaction_id, message) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['program_id'],
            $data['donor_name'],
            $data['donor_email'],
            $data['donor_phone'],
            $data['amount'],
            $data['payment_method'],
            $data['transaction_id'],
            $data['message']
        ]);
        
        $donationId = $pdo->lastInsertId();
        
        // Update program current_amount (akan diupdate via trigger saat payment_status = 'success')
        
        $pdo->commit();
        return $donationId;
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        return false;
    }
}

/**
 * Update donation status
 */
function updateDonationStatus($pdo, $transactionId, $status) {
    try {
        $stmt = $pdo->prepare("UPDATE donations SET payment_status = ? WHERE transaction_id = ?");
        return $stmt->execute([$status, $transactionId]);
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * Get donation by transaction ID
 */
function getDonationByTransactionId($pdo, $transactionId) {
    try {
        $stmt = $pdo->prepare("
            SELECT d.*, p.title as program_title, p.location as program_location, p.current_amount, p.target_amount
            FROM donations d
            JOIN programs p ON d.program_id = p.id
            WHERE d.transaction_id = ?
        ");
        $stmt->execute([$transactionId]);
        return $stmt->fetch();
    } catch (PDOException $e) {
        return false;
    }
}

/**
 * Get statistics
 */
function getStatistics($pdo) {
    try {
        $stats = [];
        
        // Total programs
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM programs");
        $stats['total_programs'] = $stmt->fetch()['total'];
        
        // Total donations
        $stmt = $pdo->query("SELECT SUM(current_amount) as total FROM programs");
        $stats['total_donations'] = $stmt->fetch()['total'] ?? 0;
        
        // Total beneficiaries
        $stmt = $pdo->query("SELECT SUM(beneficiaries) as total FROM programs WHERE status = 'active'");
        $stats['total_beneficiaries'] = $stmt->fetch()['total'] ?? 0;
        
        // Provinces covered
        $stmt = $pdo->query("SELECT COUNT(DISTINCT location) as total FROM programs");
        $stats['provinces_covered'] = $stmt->fetch()['total'];
        
        return $stats;
    } catch (PDOException $e) {
        return [
            'total_programs' => 0,
            'total_donations' => 0,
            'total_beneficiaries' => 0,
            'provinces_covered' => 0
        ];
    }
}

/**
 * Upload file
 */
function uploadFile($file, $allowedTypes = ['jpg', 'jpeg', 'png', 'gif']) {
    if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
        return ['success' => false, 'message' => 'No file uploaded'];
    }
    
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    
    if ($fileError !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Upload error occurred'];
    }
    
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    if (!in_array($fileExt, $allowedTypes)) {
        return ['success' => false, 'message' => 'File type not allowed'];
    }
    
    if ($fileSize > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => 'File too large'];
    }
    
    $newFileName = uniqid() . '.' . $fileExt;
    $uploadPath = UPLOAD_PATH . $newFileName;
    
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        return ['success' => true, 'filename' => $newFileName];
    } else {
        return ['success' => false, 'message' => 'Failed to move uploaded file'];
    }
}

/**
 * Send email (placeholder - implement with PHPMailer)
 */
function sendEmail($to, $subject, $body) {
    // Implement email sending logic here
    // Using PHPMailer or similar library
    return true;
}

/**
 * Log activity
 */
function logActivity($pdo, $userId, $action, $details = null) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO activity_logs (user_id, action, details, ip_address) 
            VALUES (?, ?, ?, ?)
        ");
        
        return $stmt->execute([
            $userId,
            $action,
            $details,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        ]);
    } catch (PDOException $e) {
        return false;
    }
}
?>
