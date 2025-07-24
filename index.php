<?php
require_once 'includes/config.php';
$pageTitle = 'Beranda - Donasi Pangan SDGs';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.php">
                <i class="fas fa-heart text-success me-2 fs-3"></i>
                <span class="fw-bold text-success">Donasi Pangan SDGs</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.php">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="dashboard.php">Program</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="maps.php">Peta</a>
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

    <!-- Hero Section -->
    <section class="hero-section bg-gradient-success py-5">
        <div class="container py-5">
            <div class="row justify-content-center text-center">
                <div class="col-lg-8">
                    <h1 class="display-4 fw-bold text-dark mb-4">Donasi Pangan SDGs 2: Zero Hunger</h1>
                    <p class="lead text-muted mb-4">
                        Bergabunglah dalam misi menghapus kelaparan dan mencapai ketahanan pangan untuk semua. 
                        Setiap donasi Anda berkontribusi langsung pada SDGs 2: Zero Hunger.
                    </p>
                    <div class="d-flex justify-content-center gap-3 flex-wrap">
                        <a href="donate.php" class="btn btn-success btn-lg">
                            <i class="fas fa-heart me-2"></i>Donasi Sekarang
                        </a>
                        <a href="dashboard.php" class="btn btn-outline-success btn-lg">
                            <i class="fas fa-chart-bar me-2"></i>Lihat Program
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-5 bg-white">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card text-center h-100 shadow-sm">
                        <div class="card-body">
                            <i class="fas fa-users text-success fs-1 mb-3"></i>
                            <h3 class="fw-bold">10,000+</h3>
                            <p class="text-muted">Orang Terbantu</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center h-100 shadow-sm">
                        <div class="card-body">
                            <i class="fas fa-bullseye text-success fs-1 mb-3"></i>
                            <h3 class="fw-bold">500+</h3>
                            <p class="text-muted">Program Donasi</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center h-100 shadow-sm">
                        <div class="card-body">
                            <i class="fas fa-map-marker-alt text-success fs-1 mb-3"></i>
                            <h3 class="fw-bold">50+</h3>
                            <p class="text-muted">Kota Terjangkau</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SDGs Info Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="row justify-content-center text-center mb-5">
                <div class="col-lg-8">
                    <h2 class="fw-bold mb-4">Tentang SDGs 2: Zero Hunger</h2>
                    <p class="lead text-muted">
                        Sustainable Development Goal 2 bertujuan untuk mengakhiri kelaparan, mencapai ketahanan pangan dan nutrisi
                        yang lebih baik, serta mempromosikan pertanian berkelanjutan pada tahun 2030.
                    </p>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-bullseye text-success me-2"></i>Target Utama
                            </h5>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-check text-success me-2"></i>Mengakhiri kelaparan dan malnutrisi</li>
                                <li><i class="fas fa-check text-success me-2"></i>Meningkatkan produktivitas pertanian</li>
                                <li><i class="fas fa-check text-success me-2"></i>Memastikan sistem pangan berkelanjutan</li>
                                <li><i class="fas fa-check text-success me-2"></i>Menjaga keragaman genetik benih</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="fas fa-heart text-success me-2"></i>Dampak Donasi
                            </h5>
                            <ul class="list-unstyled">
                                <li><i class="fas fa-check text-success me-2"></i>Bantuan pangan langsung</li>
                                <li><i class="fas fa-check text-success me-2"></i>Program edukasi gizi</li>
                                <li><i class="fas fa-check text-success me-2"></i>Pemberdayaan petani lokal</li>
                                <li><i class="fas fa-check text-success me-2"></i>Pengembangan teknologi pertanian</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4">
                    <h5><i class="fas fa-heart text-success me-2"></i>Donasi Pangan SDGs</h5>
                    <p class="text-muted">Platform donasi untuk mendukung SDGs 2: Zero Hunger dan menciptakan dunia tanpa kelaparan.</p>
                </div>
                <div class="col-md-4 mb-4">
                    <h5>Kontak</h5>
                    <p class="text-muted mb-1"><i class="fas fa-envelope me-2"></i>info@donasipangan.org</p>
                    <p class="text-muted"><i class="fas fa-phone me-2"></i>+62 21 1234 5678</p>
                </div>
                <div class="col-md-4 mb-4">
                    <h5>Referensi</h5>
                    <a href="https://sdgs.itpln.ac.id" class="text-success d-block mb-2" target="_blank">
                        <i class="fas fa-external-link-alt me-2"></i>SDGs ITB PLN
                    </a>
                    <a href="https://sdgs.un.org/goals/goal2" class="text-success d-block" target="_blank">
                        <i class="fas fa-external-link-alt me-2"></i>UN SDGs Goal 2
                    </a>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center">
                <p class="text-muted mb-0">&copy; 2024 Donasi Pangan SDGs. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
