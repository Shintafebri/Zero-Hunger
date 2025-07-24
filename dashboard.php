<?php
require_once 'includes/config.php';
requireLogin();

// Fetch programs
try {
    $stmt = $pdo->prepare("
        SELECT p.*, 
               (SELECT COUNT(*) FROM donations d WHERE d.program_id = p.id AND d.payment_status = 'success') as donor_count
        FROM programs p 
        ORDER BY p.created_at DESC
    ");
    $stmt->execute();
    $programs = $stmt->fetchAll();
    
    // Get statistics
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM programs");
    $totalPrograms = $stmt->fetch()['total'];
    
    $stmt = $pdo->query("SELECT SUM(current_amount) as total FROM programs");
    $totalDonations = $stmt->fetch()['total'] ?? 0;
    
    $stmt = $pdo->query("SELECT COUNT(DISTINCT location) as total FROM programs");
    $totalLocations = $stmt->fetch()['total'];
    
} catch (PDOException $e) {
    $programs = [];
    $totalPrograms = $totalDonations = $totalLocations = 0;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Donasi Pangan SDGs</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body class="bg-light">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="dashboard.php">
                <i class="fas fa-heart text-success me-2 fs-4"></i>
                <span class="fw-bold text-success">Dashboard</span>
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
                        <a class="nav-link active" href="dashboard.php">Program</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="maps.php">Peta</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="donate.php">Donasi</a>
                    </li>
                </ul>
                <div class="navbar-nav">
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
                </div>
            </div>
        </div>
    </nav>

    <!-- Flash Messages -->
    <?php
    $successMessage = getFlashMessage('success');
    $errorMessage = getFlashMessage('error');
    ?>
    
    <?php if ($successMessage): ?>
        <div class="alert alert-success alert-dismissible fade show m-3" role="alert">
            <i class="fas fa-check-circle me-2"></i><?= htmlspecialchars($successMessage) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>
    
    <?php if ($errorMessage): ?>
        <div class="alert alert-danger alert-dismissible fade show m-3" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i><?= htmlspecialchars($errorMessage) ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    <?php endif; ?>

    <div class="container py-4">
        <!-- Welcome Message -->
        <div class="row mb-4">
            <div class="col">
                <h1 class="h3 mb-0">Selamat datang, <?= htmlspecialchars($_SESSION['user_name']) ?>!</h1>
                <p class="text-muted">Kelola program donasi dan pantau dampak kontribusi Anda untuk SDGs 2: Zero Hunger</p>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4 mb-4">
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body text-center">
                        <div class="d-flex justify-content-center align-items-center mb-3">
                            <div class="bg-primary bg-opacity-10 rounded-circle p-3">
                                <i class="fas fa-chart-bar text-primary fs-1"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold"><?= $totalPrograms ?></h3>
                        <p class="text-muted mb-0">Total Program</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body text-center">
                        <div class="d-flex justify-content-center align-items-center mb-3">
                            <div class="bg-success bg-opacity-10 rounded-circle p-3">
                                <i class="fas fa-money-bill-wave text-success fs-1"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold"><?= formatCurrency($totalDonations) ?></h3>
                        <p class="text-muted mb-0">Total Donasi</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card border-0 shadow-sm">
                    <div class="card-body text-center">
                        <div class="d-flex justify-content-center align-items-center mb-3">
                            <div class="bg-warning bg-opacity-10 rounded-circle p-3">
                                <i class="fas fa-map-marker-alt text-warning fs-1"></i>
                            </div>
                        </div>
                        <h3 class="fw-bold"><?= $totalLocations ?></h3>
                        <p class="text-muted mb-0">Lokasi Terjangkau</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 class="fw-bold mb-0">Program Donasi</h2>
            <div class="btn-group" role="group">
                <a href="maps.php" class="btn btn-outline-primary">
                    <i class="fas fa-map me-2"></i>Lihat Peta
                </a>
                <a href="donate.php" class="btn btn-success">
                    <i class="fas fa-heart me-2"></i>Donasi Sekarang
                </a>
            </div>
        </div>

        <!-- Programs Grid -->
        <?php if (empty($programs)): ?>
            <div class="text-center py-5">
                <i class="fas fa-inbox text-muted fs-1 mb-3"></i>
                <h4 class="text-muted">Belum ada program donasi</h4>
                <p class="text-muted">Program donasi akan ditampilkan di sini</p>
            </div>
        <?php else: ?>
            <div class="row g-4">
                <?php foreach ($programs as $program): ?>
                    <div class="col-lg-4 col-md-6">
                        <div class="card h-100 shadow-sm border-0">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <span class="badge bg-<?= $program['status'] === 'active' ? 'success' : ($program['status'] === 'completed' ? 'primary' : 'secondary') ?>">
                                        <?= $program['status'] === 'active' ? 'Aktif' : ($program['status'] === 'completed' ? 'Selesai' : 'Dijeda') ?>
                                    </span>
                                    <small class="text-muted"><?= date('d/m/Y', strtotime($program['created_at'])) ?></small>
                                </div>
                                
                                <h5 class="card-title"><?= htmlspecialchars($program['title']) ?></h5>
                                <p class="card-text text-muted small"><?= htmlspecialchars(substr($program['description'], 0, 100)) ?>...</p>
                                
                                <div class="mb-3">
                                    <i class="fas fa-map-marker-alt text-muted me-1"></i>
                                    <small class="text-muted"><?= htmlspecialchars($program['location']) ?></small>
                                </div>

                                <!-- Progress Bar -->
                                <div class="mb-3">
                                    <?php 
                                    $progress = $program['target_amount'] > 0 ? ($program['current_amount'] / $program['target_amount']) * 100 : 0;
                                    ?>
                                    <div class="d-flex justify-content-between small mb-1">
                                        <span>Progress</span>
                                        <span><?= number_format($progress, 1) ?>%</span>
                                    </div>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-success" style="width: <?= min($progress, 100) ?>%"></div>
                                    </div>
                                    <div class="d-flex justify-content-between small mt-1">
                                        <span class="fw-bold"><?= formatCurrency($program['current_amount']) ?></span>
                                        <span class="text-muted">dari <?= formatCurrency($program['target_amount']) ?></span>
                                    </div>
                                </div>

                                <div class="d-flex gap-2">
                                    <a href="program-detail.php?id=<?= $program['id'] ?>" class="btn btn-outline-primary btn-sm flex-fill">
                                        <i class="fas fa-eye me-1"></i>Detail
                                    </a>
                                    <?php if ($program['status'] === 'active'): ?>
                                        <a href="donate.php?program=<?= $program['id'] ?>" class="btn btn-success btn-sm flex-fill">
                                            <i class="fas fa-heart me-1"></i>Donasi
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
