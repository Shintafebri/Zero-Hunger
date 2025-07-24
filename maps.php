<?php
require_once 'includes/config.php';

// Fetch programs with coordinates
try {
    $stmt = $pdo->prepare("
        SELECT p.*, 
               (SELECT COUNT(*) FROM donations d WHERE d.program_id = p.id AND d.payment_status = 'success') as donor_count
        FROM programs p 
        WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();
    $programs = $stmt->fetchAll();
} catch (PDOException $e) {
    // In case of a database error, initialize with an empty array
    $programs = [];
}

$pageTitle = 'Peta Program Donasi - Donasi Pangan SDGs';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
    <link href="assets/css/style.css" rel="stylesheet">
    <style>
        #map {
            height: 500px;
            width: 100%;
            border-radius: 10px;
            z-index: 0;
        }
        .program-card {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .program-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .program-card.selected {
            border: 2px solid #198754;
            background-color: #f8fff9;
        }
        /* Custom Leaflet Popup Style */
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
            margin: 15px;
            font-size: 14px;
            line-height: 1.6;
        }
    </style>
</head>
<body class="bg-light">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.php">
                <i class="fas fa-heart text-success me-2 fs-4"></i>
                <span class="fw-bold text-success">Donasi Pangan SDGs</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="dashboard.php">Program</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="maps.php">Peta</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="donate.php">Donasi</a>
                    </li>
                </ul>
                <div class="navbar-nav">
                    <?php if (isLoggedIn()): ?>
                        <div class="dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                <i class="fas fa-user me-1"></i><?= htmlspecialchars($_SESSION['user_name']) ?>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="dashboard.php">Dashboard</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="logout.php">Logout</a></li>
                            </ul>
                        </div>
                    <?php else: ?>
                        <a class="nav-link btn btn-outline-success me-2" href="login.php">Login</a>
                        <a class="nav-link btn btn-success" href="register.php">Register</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <div class="container py-4">
        <!-- Header Section -->
        <div class="row mb-4">
            <div class="col">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 class="h3 mb-1">
                            <i class="fas fa-map-marker-alt text-success me-2"></i>
                            Peta Program Donasi
                        </h1>
                        <p class="text-muted mb-0">Lokasi program SDGs 2: Zero Hunger di seluruh Indonesia</p>
                    </div>
                    <div class="badge bg-success fs-6">
                        <?= count($programs) ?> Program Aktif
                    </div>
                </div>
            </div>
        </div>

        <!-- Search & Filter -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Cari Program</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fas fa-search"></i></span>
                            <input type="text" class="form-control" id="searchInput" placeholder="Cari berdasarkan nama atau lokasi...">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Kategori</label>
                        <select class="form-select" id="categoryFilter">
                            <option value="">Semua Kategori</option>
                            <option value="Bantuan Pangan Darurat">Bantuan Pangan Darurat</option>
                            <option value="Program Gizi Anak">Program Gizi Anak</option>
                            <option value="Pemberdayaan Petani">Pemberdayaan Petani</option>
                            <option value="Ketahanan Pangan">Ketahanan Pangan</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="statusFilter">
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="completed">Selesai</option>
                            <option value="paused">Dijeda</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label">&nbsp;</label>
                        <button class="btn btn-outline-secondary w-100" onclick="resetFilters()">
                            <i class="fas fa-undo me-1"></i>Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Map Section -->
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-globe me-2"></i>Peta Interaktif
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div id="map"></div>
                    </div>
                </div>
                 <!-- Map Controls -->
                 <div class="card mt-3">
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-4">
                                <button class="btn btn-outline-primary btn-sm w-100" onclick="showAllPrograms()">
                                    <i class="fas fa-eye me-1"></i>Tampilkan Semua
                                </button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-outline-success btn-sm w-100" onclick="filterByStatus('active')">
                                    <i class="fas fa-play me-1"></i>Program Aktif
                                </button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-outline-info btn-sm w-100" onclick="centerMap()">
                                    <i class="fas fa-crosshairs me-1"></i>Pusat Indonesia
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Program List -->
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-list me-2"></i>Daftar Program
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div id="programList" style="max-height: 600px; overflow-y: auto;">
                            <?php if (empty($programs)): ?>
                                <p class="p-3 text-center text-muted">Tidak ada program yang ditemukan.</p>
                            <?php else: ?>
                                <?php foreach ($programs as $program): ?>
                                    <div class="program-card p-3 border-bottom" data-program-id="<?= $program['id'] ?>" onclick="selectProgram(<?= $program['id'] ?>)">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <span class="badge bg-<?= $program['status'] === 'active' ? 'success' : ($program['status'] === 'completed' ? 'primary' : 'secondary') ?> small">
                                                <?= $program['status'] === 'active' ? 'Aktif' : ($program['status'] === 'completed' ? 'Selesai' : 'Dijeda') ?>
                                            </span>
                                            <small class="text-muted"><?= htmlspecialchars($program['location']) ?></small>
                                        </div>
                                        
                                        <h6 class="mb-2 program-title"><?= htmlspecialchars($program['title']) ?></h6>
                                        <p class="text-muted small mb-2 program-description"><?= htmlspecialchars(substr($program['description'], 0, 80)) ?>...</p>
                                        
                                        <!-- Progress -->
                                        <?php 
                                        $progress = $program['target_amount'] > 0 ? ($program['current_amount'] / $program['target_amount']) * 100 : 0;
                                        ?>
                                        <div class="mb-2">
                                            <div class="d-flex justify-content-between small mb-1">
                                                <span>Progress</span>
                                                <span><?= number_format($progress, 1) ?>%</span>
                                            </div>
                                            <div class="progress" style="height: 4px;">
                                                <div class="progress-bar bg-success" style="width: <?= min($progress, 100) ?>%"></div>
                                            </div>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between align-items-center">
                                            <small class="text-muted">
                                                <i class="fas fa-users me-1"></i><?= number_format($program['beneficiaries']) ?> penerima
                                            </small>
                                            <div class="btn-group btn-group-sm">
                                                <button class="btn btn-outline-primary btn-sm" onclick="event.stopPropagation(); viewProgram(<?= $program['id'] ?>)">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <?php if ($program['status'] === 'active'): ?>
                                                    <button class="btn btn-success btn-sm" onclick="event.stopPropagation(); donateToProgram(<?= $program['id'] ?>)">
                                                        <i class="fas fa-heart"></i>
                                                    </button>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Program Detail Modal -->
    <div class="modal fade" id="programModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detail Program</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="programModalBody">
                    <!-- Content will be loaded here by JavaScript -->
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    
    <script>
        // Store program data from PHP into a JavaScript variable
        const programs = <?= json_encode($programs) ?>;
        
        // Map-related global variables
        let map;
        let markerLayer;
        let markers = {}; // Use an object to store markers by program ID

        // Center of Indonesia coordinates
        const INDONESIA_CENTER = [-2.5489, 118.0149];
        const INITIAL_ZOOM = 5;

        /**
         * Initializes the Leaflet map and adds the initial markers.
         */
        function initializeMap() {
            if (map) return; // Prevent re-initialization

            map = L.map('map').setView(INDONESIA_CENTER, INITIAL_ZOOM);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            markerLayer = L.layerGroup().addTo(map);
            updateMarkers(programs);
        }

        /**
         * Clears and updates markers on the map based on a provided list of programs.
         * @param {Array} programsToShow - An array of program objects to display.
         */
        function updateMarkers(programsToShow) {
            markerLayer.clearLayers();
            markers = {};

            programsToShow.forEach(program => {
                const position = [parseFloat(program.latitude), parseFloat(program.longitude)];
                
                const progress = program.target_amount > 0 ? (program.current_amount / program.target_amount) * 100 : 0;
                
                // Popup content HTML
                const popupContent = `
                    <div style="max-width: 250px;">
                        <h6 class="mb-1">${program.title}</h6>
                        <p class="text-muted small mb-2">📍 ${program.location}</p>
                        <div class="progress mb-2" style="height: 4px;">
                           <div class="progress-bar bg-success" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <div class="d-flex gap-2">
                           <button class="btn btn-outline-primary btn-sm" onclick="viewProgram(${program.id})">
                               <i class="fas fa-eye me-1"></i>Detail
                           </button>
                           ${program.status === 'active' ? `
                           <button class="btn btn-success btn-sm" onclick="donateToProgram(${program.id})">
                               <i class="fas fa-heart me-1"></i>Donasi
                           </button>
                           ` : ''}
                        </div>
                    </div>`;

                const marker = L.marker(position).addTo(markerLayer)
                    .bindPopup(popupContent);

                marker.on('click', () => {
                    selectProgram(program.id, false); // Don't fly to map when clicking marker
                });
                
                markers[program.id] = marker;
            });
        }
        
        /**
         * Selects a program, highlights it in the list, and centers the map on it.
         * @param {number} programId - The ID of the program to select.
         * @param {boolean} flyTo - Whether to fly the map to the location.
         */
        function selectProgram(programId, flyTo = true) {
            // Highlight the card in the list
            document.querySelectorAll('.program-card').forEach(card => {
                card.classList.remove('selected');
            });
            const programCard = document.querySelector(`.program-card[data-program-id="${programId}"]`);
            if (programCard) {
                programCard.classList.add('selected');
                programCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            // Center map and open popup
            const program = programs.find(p => p.id == programId);
            if (program && map) {
                const position = [parseFloat(program.latitude), parseFloat(program.longitude)];
                if(flyTo) {
                    map.flyTo(position, 12);
                }
                
                // Open the corresponding popup
                if (markers[programId]) {
                    markers[programId].openPopup();
                }
            }
        }

        /**
         * Applies all active filters (search, category, status) to the program list and map.
         */
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const status = document.getElementById('statusFilter').value;

            const filteredPrograms = programs.filter(p => {
                const titleMatch = p.title.toLowerCase().includes(searchTerm);
                const locationMatch = p.location.toLowerCase().includes(searchTerm);
                const categoryMatch = !category || p.category === category;
                const statusMatch = !status || p.status === status;
                return (titleMatch || locationMatch) && categoryMatch && statusMatch;
            });
            
            // Update the program list visibility
            document.querySelectorAll('.program-card').forEach(card => {
                const programId = card.getAttribute('data-program-id');
                const isVisible = filteredPrograms.some(p => p.id == programId);
                card.style.display = isVisible ? 'block' : 'none';
            });

            // Update markers on the map
            updateMarkers(filteredPrograms);
        }

        /**
         * Resets all filters to their default values and shows all programs.
         */
        function resetFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('categoryFilter').value = '';
            document.getElementById('statusFilter').value = '';
            applyFilters();
            showAllPrograms();
        }

        // --- Map Control Functions ---
        function showAllPrograms() {
            if (programs.length > 0) {
                const allMarkersGroup = L.featureGroup(Object.values(markers));
                map.fitBounds(allMarkersGroup.getBounds().pad(0.1));
            } else {
                centerMap();
            }
        }
        
        function filterByStatus(status) {
            document.getElementById('statusFilter').value = status;
            applyFilters();
        }

        function centerMap() {
            map.flyTo(INDONESIA_CENTER, INITIAL_ZOOM);
        }
        
        // --- Action Functions ---
        function viewProgram(programId) {
            const program = programs.find(p => p.id == programId);
            if (!program) return;

            const progress = program.target_amount > 0 ? (program.current_amount / program.target_amount) * 100 : 0;
            const modalBody = document.getElementById('programModalBody');
            
            modalBody.innerHTML = `
                <h5>${program.title}</h5>
                <p class="text-muted">${program.description}</p>
                <hr>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <small class="text-muted d-block">Lokasi</small>
                        <strong><i class="fas fa-map-marker-alt me-1"></i>${program.location}</strong>
                    </div>
                    <div class="col-md-6 mb-3">
                        <small class="text-muted d-block">Kategori</small>
                        <strong><i class="fas fa-tag me-1"></i>${program.category || 'Umum'}</strong>
                    </div>
                    <div class="col-md-6 mb-3">
                        <small class="text-muted d-block">Penerima Manfaat</small>
                        <strong><i class="fas fa-users me-1"></i>${parseInt(program.beneficiaries).toLocaleString()} orang</strong>
                    </div>
                    <div class="col-md-6 mb-3">
                        <small class="text-muted d-block">Status</small>
                        <span class="badge bg-${program.status === 'active' ? 'success' : (program.status === 'completed' ? 'primary' : 'secondary')}">
                           ${program.status === 'active' ? 'Aktif' : (program.status === 'completed' ? 'Selesai' : 'Dijeda')}
                        </span>
                    </div>
                </div>
                <div class="card bg-light">
                    <div class="card-body">
                         <div class="d-flex justify-content-between">
                            <span>Rp ${parseInt(program.current_amount).toLocaleString()}</span>
                            <small>Target: Rp ${parseInt(program.target_amount).toLocaleString()}</small>
                        </div>
                        <div class="progress my-2" style="height: 8px;">
                            <div class="progress-bar bg-success" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <div class="text-center"><strong>${progress.toFixed(1)}%</strong> terkumpul</div>
                    </div>
                </div>
            `;
            
            const programModal = new bootstrap.Modal(document.getElementById('programModal'));
            programModal.show();
        }

        function donateToProgram(programId) {
            window.location.href = `donate.php?program=${programId}`;
        }

        // --- Event Listeners ---
        document.addEventListener('DOMContentLoaded', initializeMap);
        document.getElementById('searchInput').addEventListener('input', applyFilters);
        document.getElementById('categoryFilter').addEventListener('change', applyFilters);
        document.getElementById('statusFilter').addEventListener('change', applyFilters);

    </script>
</body>
</html>
