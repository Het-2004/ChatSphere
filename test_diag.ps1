$baseUrl = "http://localhost:4040"
$rand = Get-Random
$email = "test_diag_$rand@example.com"
$name = "Test User $rand"
$body = @{ email=$email; password="Password123!"; name=$name; captchaToken="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" } | ConvertTo-Json

try {
    $reg = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Register success: $reg"
} catch {
    Write-Host "Register error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($reader.ReadToEnd())"
    }
}

try {
    $login = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "Login success: $login"
    $token = $login.token
    
    $headers = @{ "Authorization" = "Bearer $token" }
    $me = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Headers $headers -ErrorAction Stop
    Write-Host "Me success: $me"
} catch {
    Write-Host "Me/Login error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($reader.ReadToEnd())"
    }
}
