<?php
/**
 * API endpoints untuk fitur maps
 * File: api/maps-enhanced.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../includes/config.php';
require_once '../includes/functions.php';

// Get all program locations for maps
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'program_locations') {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                l.population,
                l.poverty_rate,
                l.food_insecurity_rate
            FROM programs p
            LEFT JOIN locations l ON p.location = l.province
            WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
            ORDER BY p.created_at DESC
        ");
        
        $stmt->execute();
        $programs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $response = [
            'success' => true,
            'data' => array_map(function($program) {
                return [
                    'id' => (int)$program['id'],
                    'title' => $program['title'],
                    'description' => $program['description'],
                    'location' => $program['location'],
                    'coordinates' => [
                        'lat' => (float)$program['latitude'],
                        'lng' => (float)$program['longitude']
                    ],
                    'current_amount' => (float)$program['current_amount'],
                    'target_amount' => (float)$program['target_amount'],
                    'beneficiaries' => (int)$program['beneficiaries'],
                    'status' => $program['status'],
                    'category' => $program['category'],
                    'demographics' => [
                        'population' => (int)($program['population'] ?? 0),
                        'poverty_rate' => $program['poverty_rate'] ?? 'N/A',
                        'food_insecurity_rate' => $program['food_insecurity_rate'] ?? 'N/A'
                    ]
                ];
            }, $programs)
        ];
        
        echo json_encode($response);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
}

// Get detailed location info
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['location'])) {
    $location = $_GET['location'];
    
    try {
        // Get programs in this location
        $stmt = $pdo->prepare("
            SELECT id, title, current_amount, beneficiaries 
            FROM programs 
            WHERE location LIKE ? AND status = 'active'
            ORDER BY current_amount DESC
            LIMIT 5
        ");
        $stmt->execute(["%{$location}%"]);
        $programs_nearby = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get location demographics
        $stmt = $pdo->prepare("
            SELECT * FROM locations 
            WHERE name LIKE ? OR province LIKE ?
            LIMIT 1
        ");
        $stmt->execute(["%{$location}%", "%{$location}%"]);
        $location_data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Mock weather data (in real implementation, fetch from weather API)
        $weather_conditions = ['Cerah', 'Berawan', 'Hujan Ringan', 'Cerah Berawan'];
        $weather = [
            'temperature' => rand(24, 32) . '°C',
            'condition' => $weather_conditions[array_rand($weather_conditions)],
            'humidity' => rand(60, 85) . '%'
        ];
        
        $response = [
            'success' => true,
            'data' => [
                'results' => [[
                    'name' => $location,
                    'formatted_address' => $location . ', Indonesia',
                    'geometry' => [
                        'location' => [
                            'lat' => (float)($location_data['latitude'] ?? -6.17511),
                            'lng' => (float)($location_data['longitude'] ?? 106.865036)
                        ]
                    ],
                    'programs_nearby' => array_map(function($program) {
                        return [
                            'id' => (int)$program['id'],
                            'title' => $program['title'],
                            'distance' => rand(1, 10) . '.' . rand(0, 9) . ' km',
                            'beneficiaries' => (int)$program['beneficiaries']
                        ];
                    }, $programs_nearby),
                    'demographics' => [
                        'population' => (int)($location_data['population'] ?? rand(100000, 5000000)),
                        'poverty_rate' => $location_data['poverty_rate'] ?? rand(5, 25) . '.0%',
                        'food_insecurity_rate' => $location_data['food_insecurity_rate'] ?? rand(10, 35) . '.0%'
                    ],
                    'weather' => $weather,
                    'infrastructure' => [
                        'hospitals' => rand(1, 15),
                        'schools' => rand(10, 100),
                        'markets' => rand(5, 30),
                        'roads_quality' => ['Baik', 'Sedang', 'Perlu Perbaikan'][rand(0, 2)]
                    ]
                ]]
            ],
            'source' => 'Enhanced Maps API',
            'last_updated' => date('c')
        ];
        
        echo json_encode($response);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
}

// Track map view
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'track_view') {
    $program_id = $_POST['program_id'] ?? '';
    $user_ip = $_SERVER['REMOTE_ADDR'] ?? '';
    
    try {
        $stmt = $pdo->prepare("INSERT INTO map_views (program_id, user_ip) VALUES (?, ?)");
        $stmt->execute([$program_id, $user_ip]);
        
        echo json_encode(['success' => true, 'message' => 'View tracked']);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to track view']);
    }
}

// Get map statistics
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'statistics') {
    try {
        // Total programs with coordinates
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM programs WHERE latitude IS NOT NULL");
        $total_programs = $stmt->fetch()['total'];
        
        // Total beneficiaries
        $stmt = $pdo->query("SELECT SUM(beneficiaries) as total FROM programs WHERE status = 'active'");
        $total_beneficiaries = $stmt->fetch()['total'] ?? 0;
        
        // Total donations
        $stmt = $pdo->query("SELECT SUM(current_amount) as total FROM programs");
        $total_donations = $stmt->fetch()['total'] ?? 0;
        
        // Provinces covered
        $stmt = $pdo->query("SELECT COUNT(DISTINCT location) as total FROM programs");
        $provinces_covered = $stmt->fetch()['total'];
        
        $response = [
            'success' => true,
            'data' => [
                'total_programs' => (int)$total_programs,
                'total_beneficiaries' => (int)$total_beneficiaries,
                'total_donations' => (float)$total_donations,
                'provinces_covered' => (int)$provinces_covered
            ]
        ];
        
        echo json_encode($response);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database error']);
    }
}
?>
