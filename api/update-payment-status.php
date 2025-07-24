<?php
require_once '../includes/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$transactionId = $input['transaction_id'] ?? '';
$status = $input['status'] ?? '';

if (empty($transactionId) || empty($status)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    // Update donation status
    $stmt = $pdo->prepare("UPDATE donations SET payment_status = ?, updated_at = NOW() WHERE transaction_id = ?");
    $result = $stmt->execute([$status, $transactionId]);
    
    if ($result) {
        // If payment successful, trigger will automatically update program current_amount and calculate impact
        echo json_encode(['success' => true, 'message' => 'Payment status updated']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update payment status']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
