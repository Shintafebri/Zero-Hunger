<?php
/**
 * API endpoint untuk payment success page
 * File: api/payment-success.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../includes/config.php';
require_once '../includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $transaction_id = $_GET['transaction_id'] ?? '';
    
    if (empty($transaction_id)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Transaction ID required']);
        exit;
    }
    
    try {
        // Query untuk mendapatkan detail payment
        $stmt = $pdo->prepare("
            SELECT 
                d.*,
                p.title as program_title,
                p.location as program_location,
                p.current_amount,
                p.target_amount
            FROM donations d
            JOIN programs p ON d.program_id = p.id
            WHERE d.transaction_id = ?
        ");
        
        $stmt->execute([$transaction_id]);
        $donation = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$donation) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Transaction not found']);
            exit;
        }
        
        // Format response
        $response = [
            'success' => true,
            'data' => [
                'transaction_id' => $donation['transaction_id'],
                'donation_id' => $donation['id'],
                'amount' => (float)$donation['amount'],
                'payment_method' => $donation['payment_method'],
                'donor_name' => $donation['donor_name'],
                'donor_email' => $donation['donor_email'],
                'program' => [
                    'id' => $donation['program_id'],
                    'title' => $donation['program_title'],
                    'location' => $donation['program_location'],
                    'current_amount' => (float)$donation['current_amount'],
                    'target_amount' => (float)$donation['target_amount']
                ],
                'status' => $donation['payment_status'],
                'created_at' => $donation['created_at'],
                'impact' => [
                    'people_fed' => $donation['impact_people_fed'],
                    'families_helped' => $donation['impact_families_helped'],
                    'children_nutrition' => $donation['impact_children_nutrition']
                ]
            ]
        ];
        
        echo json_encode($response);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
}

// Handle receipt download
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'download_receipt') {
    $donation_id = $_POST['donation_id'] ?? '';
    
    try {
        // Generate receipt PDF (menggunakan library seperti TCPDF)
        $receipt_number = 'RCP' . date('Ymd') . str_pad($donation_id, 6, '0', STR_PAD_LEFT);
        
        // Update download count
        $stmt = $pdo->prepare("
            INSERT INTO receipts (donation_id, receipt_number) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE download_count = download_count + 1
        ");
        $stmt->execute([$donation_id, $receipt_number]);
        
        echo json_encode([
            'success' => true,
            'receipt_url' => "/receipts/{$receipt_number}.pdf"
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to generate receipt']);
    }
}

// Handle donation sharing
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'share') {
    $donation_id = $_POST['donation_id'] ?? '';
    $platform = $_POST['platform'] ?? 'web';
    
    try {
        $stmt = $pdo->prepare("INSERT INTO donation_shares (donation_id, platform) VALUES (?, ?)");
        $stmt->execute([$donation_id, $platform]);
        
        echo json_encode(['success' => true, 'message' => 'Share tracked successfully']);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to track share']);
    }
}
?>
