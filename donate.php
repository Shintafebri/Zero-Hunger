<?php
require_once 'includes/config.php';

// Get program ID from URL
$programId = $_GET['program'] ?? null;
$selectedProgram = null;

// Fetch programs
try {
    $stmt = $pdo->prepare("SELECT * FROM programs WHERE status = 'active' ORDER BY created_at DESC");
    $stmt->execute();
    $programs = $stmt->fetchAll();
    
    // Get selected program if ID provided
    if ($programId) {
        $stmt = $pdo->prepare("SELECT * FROM programs WHERE id = ? AND status = 'active'");
        $stmt->execute([$programId]);
        $selectedProgram = $stmt->fetch();
    }
} catch (PDOException $e) {
    $programs = [];
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $program_id = $_POST['program_id'] ?? '';
    $amount = $_POST['amount'] ?? '';
    $payment_method = $_POST['payment_method'] ?? '';
    $donor_name = $_POST['donor_name'] ?? '';
    $donor_email = $_POST['donor_email'] ?? '';
    $donor_phone = $_POST['donor_phone'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Validasi
    if (empty($program_id) || empty($amount) || empty($payment_method) || empty($donor_name) || empty($donor_email)) {
        $error = 'Semua field wajib harus diisi';
    } elseif (!filter_var($donor_email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Format email tidak valid';
    } elseif ($amount < 10000) {
        $error = 'Minimal donasi Rp 10.000';
    } else {
        try {
            // Generate transaction ID
            $transactionId = 'TXN' . time() . rand(1000, 9999);
            
            // Insert donation
            $stmt = $pdo->prepare("
                INSERT INTO donations (program_id, donor_name, donor_email, donor_phone, amount, payment_method, transaction_id, message, payment_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            ");
            
            if ($stmt->execute([$program_id, $donor_name, $donor_email, $donor_phone, $amount, $payment_method, $transactionId, $message])) {
                // Redirect to payment processing
                header("Location: process-payment.php?transaction_id=" . $transactionId);
                exit;
            } else {
                $error = 'Terjadi kesalahan saat memproses donasi';
            }
        } catch (PDOException $e) {
            $error = 'Terjadi kesalahan sistem. Silakan coba lagi.';
        }
    }
}

$pageTitle = 'Donasi - Donasi Pangan SDGs';
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
                        <a class="nav-link" href="maps.php">Peta</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="donate.php">Donasi</a>
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
            <div class="col text-center">
                <h1 class="h3 mb-2">
                    <i class="fas fa-heart text-success me-2"></i>
                    Berdonasi untuk Zero Hunger
                </h1>
                <p class="text-muted">Setiap donasi Anda berkontribusi langsung pada SDGs 2: Zero Hunger</p>
            </div>
        </div>

        <div class="row">
            <!-- Form Donasi -->
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-credit-card me-2"></i>Form Donasi
                        </h5>
                    </div>
                    <div class="card-body">
                        <?php if ($error): ?>
                            <div class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle me-2"></i><?= htmlspecialchars($error) ?>
                            </div>
                        <?php endif; ?>

                        <?php if ($success): ?>
                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i><?= htmlspecialchars($success) ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" id="donationForm">
                            <!-- Pilih Program -->
                            <div class="mb-3">
                                <label for="program_id" class="form-label">Pilih Program Donasi *</label>
                                <select class="form-select" id="program_id" name="program_id" required onchange="updateProgramInfo()">
                                    <option value="">Pilih program donasi</option>
                                    <?php foreach ($programs as $program): ?>
                                        <option value="<?= $program['id'] ?>" 
                                                <?= $selectedProgram && $selectedProgram['id'] == $program['id'] ? 'selected' : '' ?>
                                                data-title="<?= htmlspecialchars($program['title']) ?>"
                                                data-description="<?= htmlspecialchars($program['description']) ?>"
                                                data-location="<?= htmlspecialchars($program['location']) ?>"
                                                data-current="<?= $program['current_amount'] ?>"
                                                data-target="<?= $program['target_amount'] ?>"
                                                data-beneficiaries="<?= $program['beneficiaries'] ?>">
                                            <?= htmlspecialchars($program['title']) ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <!-- Jumlah Donasi -->
                            <div class="mb-3">
                                <label for="amount" class="form-label">Jumlah Donasi (Rp) *</label>
                                <input type="number" class="form-control" id="amount" name="amount" 
                                       placeholder="Minimal Rp 10.000" min="10000" required 
                                       oninput="updateImpactCalculation()">
                                
                                <!-- Quick Amount Buttons -->
                                <div class="mt-2">
                                    <small class="text-muted">Pilih cepat:</small><br>
                                    <div class="btn-group btn-group-sm mt-1" role="group">
                                        <button type="button" class="btn btn-outline-success" onclick="setAmount(50000)">50K</button>
                                        <button type="button" class="btn btn-outline-success" onclick="setAmount(100000)">100K</button>
                                        <button type="button" class="btn btn-outline-success" onclick="setAmount(250000)">250K</button>
                                        <button type="button" class="btn btn-outline-success" onclick="setAmount(500000)">500K</button>
                                        <button type="button" class="btn btn-outline-success" onclick="setAmount(1000000)">1M</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Data Donatur -->
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="donor_name" class="form-label">Nama Lengkap *</label>
                                    <input type="text" class="form-control" id="donor_name" name="donor_name" 
                                           placeholder="Nama lengkap" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="donor_email" class="form-label">Email *</label>
                                    <input type="email" class="form-control" id="donor_email" name="donor_email" 
                                           placeholder="email@example.com" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="donor_phone" class="form-label">Nomor Telepon</label>
                                <input type="tel" class="form-control" id="donor_phone" name="donor_phone" 
                                       placeholder="08123456789">
                            </div>

                            <!-- Metode Pembayaran -->
                            <div class="mb-3">
                                <label class="form-label">Metode Pembayaran *</label>
                                <div class="row g-2">
                                    <!-- Bank Transfer -->
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('bca')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="bca" id="bca" class="d-none">
                                                <i class="fas fa-university text-primary me-2"></i>
                                                <strong>BCA Virtual Account</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('mandiri')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="mandiri" id="mandiri" class="d-none">
                                                <i class="fas fa-university text-warning me-2"></i>
                                                <strong>Mandiri Virtual Account</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('bni')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="bni" id="bni" class="d-none">
                                                <i class="fas fa-university text-info me-2"></i>
                                                <strong>BNI Virtual Account</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('bri')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="bri" id="bri" class="d-none">
                                                <i class="fas fa-university text-success me-2"></i>
                                                <strong>BRI Virtual Account</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- E-Wallet -->
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('gopay')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="gopay" id="gopay" class="d-none">
                                                <i class="fas fa-mobile-alt text-success me-2"></i>
                                                <strong>GoPay</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('ovo')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="ovo" id="ovo" class="d-none">
                                                <i class="fas fa-mobile-alt text-primary me-2"></i>
                                                <strong>OVO</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('dana')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="dana" id="dana" class="d-none">
                                                <i class="fas fa-mobile-alt text-info me-2"></i>
                                                <strong>DANA</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card payment-method" onclick="selectPayment('shopeepay')">
                                            <div class="card-body text-center py-2">
                                                <input type="radio" name="payment_method" value="shopeepay" id="shopeepay" class="d-none">
                                                <i class="fas fa-mobile-alt text-warning me-2"></i>
                                                <strong>ShopeePay</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pesan -->
                            <div class="mb-3">
                                <label for="message" class="form-label">Pesan untuk Penerima (Opsional)</label>
                                <textarea class="form-control" id="message" name="message" rows="3" 
                                          placeholder="Tulis pesan motivasi atau doa untuk penerima bantuan..."></textarea>
                            </div>

                            <button type="submit" class="btn btn-success btn-lg w-100" id="donateBtn">
                                <i class="fas fa-heart me-2"></i>
                                <span id="donateBtnText">Donasi Sekarang</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Info Panel -->
            <div class="col-lg-4">
                <!-- Selected Program Info -->
                <div class="card mb-3" id="programInfo" style="display: none;">
                    <div class="card-header">
                        <h6 class="card-title mb-0">
                            <i class="fas fa-info-circle me-2"></i>Detail Program
                        </h6>
                    </div>
                    <div class="card-body">
                        <h6 id="programTitle"></h6>
                        <p class="text-muted small" id="programDescription"></p>
                        <div class="mb-2">
                            <small class="text-muted">📍 <span id="programLocation"></span></small><br>
                            <small class="text-muted">👥 <span id="programBeneficiaries"></span> penerima</small>
                        </div>
                        <div class="mb-2">
                            <div class="d-flex justify-content-between small mb-1">
                                <span>Progress</span>
                                <span id="programProgress">0%</span>
                            </div>
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar bg-success" id="programProgressBar" style="width: 0%"></div>
                            </div>
                            <div class="d-flex justify-content-between small mt-1">
                                <span id="programCurrent">Rp 0</span>
                                <span id="programTarget">dari Rp 0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Impact Calculator -->
                <div class="card mb-3" id="impactCalculator" style="display: none;">
                    <div class="card-header">
                        <h6 class="card-title mb-0">
                            <i class="fas fa-calculator me-2"></i>Dampak Donasi Anda
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-4">
                                <div class="border rounded p-2">
                                    <div class="h5 text-primary mb-0" id="impactPeople">0</div>
                                    <small class="text-muted">Orang makan 1 hari</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="border rounded p-2">
                                    <div class="h5 text-success mb-0" id="impactFamilies">0</div>
                                    <small class="text-muted">Keluarga terbantu</small>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="border rounded p-2">
                                    <div class="h5 text-warning mb-0" id="impactChildren">0</div>
                                    <small class="text-muted">Anak gizi baik</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SDGs Info -->
                <div class="card">
                    <div class="card-header">
                        <h6 class="card-title mb-0">
                            <i class="fas fa-globe me-2"></i>Tentang SDGs 2: Zero Hunger
                        </h6>
                    </div>
                    <div class="card-body">
                        <p class="small text-muted mb-3">
                            Donasi Anda berkontribusi langsung pada pencapaian Sustainable Development Goal 2: Zero Hunger.
                        </p>
                        <div class="mb-2">
                            <span class="badge bg-success me-2">Target 2.1</span>
                            <small>Mengakhiri kelaparan dan malnutrisi</small>
                        </div>
                        <div class="mb-2">
                            <span class="badge bg-success me-2">Target 2.2</span>
                            <small>Meningkatkan akses pangan bergizi</small>
                        </div>
                        <div class="mb-2">
                            <span class="badge bg-success me-2">Target 2.3</span>
                            <small>Meningkatkan produktivitas pertanian</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function updateProgramInfo() {
            const select = document.getElementById('program_id');
            const option = select.options[select.selectedIndex];
            
            if (option.value) {
                const title = option.dataset.title;
                const description = option.dataset.description;
                const location = option.dataset.location;
                const current = parseInt(option.dataset.current);
                const target = parseInt(option.dataset.target);
                const beneficiaries = parseInt(option.dataset.beneficiaries);
                
                const progress = target > 0 ? (current / target) * 100 : 0;
                
                document.getElementById('programTitle').textContent = title;
                document.getElementById('programDescription').textContent = description;
                document.getElementById('programLocation').textContent = location;
                document.getElementById('programBeneficiaries').textContent = beneficiaries.toLocaleString();
                document.getElementById('programProgress').textContent = progress.toFixed(1) + '%';
                document.getElementById('programProgressBar').style.width = Math.min(progress, 100) + '%';
                document.getElementById('programCurrent').textContent = 'Rp ' + current.toLocaleString();
                document.getElementById('programTarget').textContent = 'dari Rp ' + target.toLocaleString();
                
                document.getElementById('programInfo').style.display = 'block';
            } else {
                document.getElementById('programInfo').style.display = 'none';
            }
        }

        function setAmount(amount) {
            document.getElementById('amount').value = amount;
            updateImpactCalculation();
            updateDonateButton();
        }

        function updateImpactCalculation() {
            const amount = parseInt(document.getElementById('amount').value) || 0;
            
            if (amount > 0) {
                const people = Math.floor(amount / 25000);
                const families = Math.floor(amount / 100000);
                const children = Math.floor(amount / 50000);
                
                document.getElementById('impactPeople').textContent = people;
                document.getElementById('impactFamilies').textContent = families;
                document.getElementById('impactChildren').textContent = children;
                
                document.getElementById('impactCalculator').style.display = 'block';
            } else {
                document.getElementById('impactCalculator').style.display = 'none';
            }
            
            updateDonateButton();
        }

        function updateDonateButton() {
            const amount = parseInt(document.getElementById('amount').value) || 0;
            const btnText = document.getElementById('donateBtnText');
            
            if (amount > 0) {
                btnText.textContent = `Donasi Rp ${amount.toLocaleString()}`;
            } else {
                btnText.textContent = 'Donasi Sekarang';
            }
        }

        function selectPayment(method) {
            // Remove previous selection
            document.querySelectorAll('.payment-method').forEach(card => {
                card.classList.remove('border-success', 'bg-light');
            });
            
            // Add selection to clicked method
            event.currentTarget.classList.add('border-success', 'bg-light');
            
            // Set radio button
            document.getElementById(method).checked = true;
        }

        // Initialize if program is pre-selected
        <?php if ($selectedProgram): ?>
            updateProgramInfo();
        <?php endif; ?>

        // Form validation
        document.getElementById('donationForm').addEventListener('submit', function(e) {
            const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
            if (!paymentMethod) {
                e.preventDefault();
                alert('Silakan pilih metode pembayaran');
                return false;
            }
            
            const amount = parseInt(document.getElementById('amount').value);
            if (amount < 10000) {
                e.preventDefault();
                alert('Minimal donasi Rp 10.000');
                return false;
            }
            
            // Show loading
            const btn = document.getElementById('donateBtn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Memproses...';
            btn.disabled = true;
        });

        // Auto-fill if logged in
        <?php if (isLoggedIn()): ?>
            document.getElementById('donor_name').value = '<?= htmlspecialchars($_SESSION['user_name']) ?>';
            document.getElementById('donor_email').value = '<?= htmlspecialchars($_SESSION['user_email']) ?>';
        <?php endif; ?>
    </script>

    <style>
        .payment-method {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .payment-method:hover {
            border-color: #198754 !important;
            background-color: #f8fff9 !important;
        }
    </style>
</body>
</html>
