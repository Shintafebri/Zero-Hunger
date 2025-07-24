<?php
/**
 * Konfigurasi Database dan Aplikasi - Updated dengan Payment Gateway
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Kosong untuk XAMPP default
define('DB_NAME', 'donasi_pangan_sdgs');

// Application Configuration
define('BASE_URL', 'http://localhost/donasi-pangan-sdgs/');
define('SITE_NAME', 'Donasi Pangan SDGs');

// Payment Gateway Configuration (Midtrans)
define('MIDTRANS_SERVER_KEY', 'SB-Mid-server-YOUR_SERVER_KEY_HERE'); // Ganti dengan server key Anda
define('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-YOUR_CLIENT_KEY_HERE'); // Ganti dengan client key Anda
define('MIDTRANS_IS_PRODUCTION', false); // Set true untuk production

// Google Maps API Configuration
define('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY_HERE'); // Ganti dengan API key Anda

// Error Reporting (untuk development)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database Connection
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die("❌ Database connection failed: " . $e->getMessage());
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Helper functions
function formatCurrency($amount) {
    return 'Rp ' . number_format($amount, 0, ',', '.');
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function redirect($url) {
    header("Location: $url");
    exit;
}

function flashMessage($type, $message) {
    $_SESSION['flash'][$type] = $message;
}

function getFlashMessage($type) {
    if (isset($_SESSION['flash'][$type])) {
        $message = $_SESSION['flash'][$type];
        unset($_SESSION['flash'][$type]);
        return $message;
    }
    return null;
}

// Timezone
date_default_timezone_set('Asia/Jakarta');

// Create upload directory if not exists
$uploadPath = __DIR__ . '/../uploads/';
if (!file_exists($uploadPath)) {
    mkdir($uploadPath, 0755, true);
}

// Create api directory if not exists
$apiPath = __DIR__ . '/../api/';
if (!file_exists($apiPath)) {
    mkdir($apiPath, 0755, true);
}
?>
