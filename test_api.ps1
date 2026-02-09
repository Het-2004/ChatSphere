# ChatSphere API Test Script
# Tests all endpoints to identify what's working and what's broken

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ChatSphere API Test Suite" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:4040"
$testEmail = "testuser_$(Get-Random)@example.com"
$testPassword = "SecurePass123!@#"

# Test 1: Health Check
Write-Host "[1/6] Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Health endpoint: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Signup
Write-Host "`n[2/6] Testing User Signup..." -ForegroundColor Yellow
$signupBody = @{
    email = $testEmail
    password = $testPassword
    captchaToken = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method POST -Body $signupBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ Signup successful for: $testEmail" -ForegroundColor Green
} catch {
    Write-Host "❌ Signup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}

# Test 3: Login
Write-Host "`n[3/6] Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
    captchaToken = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
} | ConvertTo-Json

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $login.token
    Write-Host "✅ Login successful! Token received." -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    $token = $null
}

# Test 4: Get Current User (Protected Endpoint)
if ($token) {
    Write-Host "`n[4/6] Testing Protected Endpoint (Get Me)..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    try {
        $me = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "✅ Protected endpoint works! User: $($me.email)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Protected endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n[4/6] Skipping protected endpoint test (no token)" -ForegroundColor Gray
}

# Test 5: WebSocket Endpoint Check
Write-Host "`n[5/6] Checking WebSocket Endpoint..." -ForegroundColor Yellow
try {
    $wsCheck = Invoke-WebRequest -Uri "$baseUrl/ws" -Method GET -ErrorAction Stop
    Write-Host "✅ WebSocket endpoint accessible" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 426) {
        Write-Host "✅ WebSocket endpoint exists (426 Upgrade Required)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WebSocket: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Test 6: Chat Endpoints
if ($token) {
    Write-Host "`n[6/6] Testing Chat Endpoints..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    try {
        $chats = Invoke-RestMethod -Uri "$baseUrl/api/chats" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "✅ Chat list endpoint works! Chats: $($chats.Count)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Chat endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n[6/6] Skipping chat test (no token)" -ForegroundColor Gray
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
