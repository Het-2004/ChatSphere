# ===================================================
# ChatSphere Service Manager (PowerShell)
# ===================================================

$ErrorActionPreference = "SilentlyContinue"

# 1. Paths
$SCRIPT_DIR = $PSScriptRoot
Set-Location $SCRIPT_DIR

$LOG_DIR = Join-Path $SCRIPT_DIR "logs"
$PID_DIR = Join-Path $SCRIPT_DIR ".pids"

New-Item -ItemType Directory -Force -Path $LOG_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $PID_DIR | Out-Null

$BACKEND_PID_FILE = Join-Path $PID_DIR "backend.pid"
$FRONTEND_PID_FILE = Join-Path $PID_DIR "frontend.pid"
$BACKEND_LOG = Join-Path $LOG_DIR "backend.log"
$BACKEND_ERR = Join-Path $LOG_DIR "backend.err"
$FRONTEND_LOG = Join-Path $LOG_DIR "frontend.log"
$FRONTEND_ERR = Join-Path $LOG_DIR "frontend.err"

# 2. Load Environment Variables from root .env
if (Test-Path ".env") {
    Get-Content ".env" | Where-Object { $_.Trim() -notlike '#*' -and $_ -match '=' } | ForEach-Object {
        $name, $value = $_ -split '=', 2
        [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), "Process")
    }
}

$backendPort = [System.Environment]::GetEnvironmentVariable("BACKEND_PORT")
if (-not $backendPort) { $backendPort = "4040" }
$frontendPort = "5173"

# 3. Helper Functions
function Free-Port {
    param([int]$port)
    $output = netstat -ano | findstr "LISTENING" | findstr ":$port "
    if ($output) {
        $pidsToKill = $output -split "`n" | ForEach-Object {
            $parts = $_.Trim() -split "\s+"
            if ($parts.Count -ge 5) {
                $parts[-1]
            }
        } | Select-Object -Unique | Where-Object { $_ -match "^\d+$" -and $_ -ne "0" -and $_ -ne "4" }

        foreach ($pidToKill in $pidsToKill) {
            Write-Host "[!] Port $port is busy. Terminating owner process (PID: $pidToKill)..." -ForegroundColor Yellow
            taskkill /F /T /PID $pidToKill 2>&1 | Out-Null
        }
    }
}

function Is-Running {
    param([string]$pidFile)
    if (Test-Path $pidFile) {
        $pidVal = Get-Content $pidFile -ErrorAction SilentlyContinue
        if ($pidVal) {
            $proc = Get-Process -Id $pidVal -ErrorAction SilentlyContinue
            if ($proc) {
                return $pidVal
            }
            # Clean up stale PID file
            Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
        }
    }
    return $null
}

function Show-Status {
    Write-Host "------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  Service Status Report" -ForegroundColor White
    Write-Host "------------------------------------------------" -ForegroundColor DarkGray

    $bPid = Is-Running $BACKEND_PID_FILE
    if ($bPid) {
        Write-Host "  Backend Service:  " -NoNewline
        Write-Host "RUNNING" -ForegroundColor Green -NoNewline
        Write-Host " (PID: $bPid, Port: $backendPort)" -ForegroundColor Gray
    } else {
        Write-Host "  Backend Service:  " -NoNewline
        Write-Host "OFFLINE" -ForegroundColor Red
    }

    $fPid = Is-Running $FRONTEND_PID_FILE
    if ($fPid) {
        Write-Host "  Frontend Service: " -NoNewline
        Write-Host "RUNNING" -ForegroundColor Green -NoNewline
        Write-Host " (PID: $fPid, Port: $frontendPort)" -ForegroundColor Gray
    } else {
        Write-Host "  Frontend Service: " -NoNewline
        Write-Host "OFFLINE" -ForegroundColor Red
    }
    Write-Host "------------------------------------------------" -ForegroundColor DarkGray
}

function Start-Backend {
    param([switch]$Build)
    Write-Host "[*] Starting Backend (Spring Boot)..." -ForegroundColor Cyan
    # Clear logs
    New-Item -ItemType File -Force -Path $BACKEND_LOG | Out-Null
    New-Item -ItemType File -Force -Path $BACKEND_ERR | Out-Null
    
    if ($Build) {
        Write-Host "    -> Building Backend using Maven (Skipping tests)..." -ForegroundColor Yellow
        $mvnProc = Start-Process cmd -ArgumentList "/c .\mvnw clean package -DskipTests" -WorkingDirectory "chatsphere-backend" -NoNewWindow -Wait -PassThru
        if ($mvnProc.ExitCode -ne 0) {
            Write-Host "    -> ERROR: Backend build failed!" -ForegroundColor Red
            return
        }
    }

    $javaPath = "java"
    if (Test-Path "C:\Users\hetpr\.jdks\ms-21.0.10\bin\java.exe") {
        $javaPath = "C:\Users\hetpr\.jdks\ms-21.0.10\bin\java.exe"
    }

    $envProps = @()
    if (Test-Path ".env") {
        Get-Content ".env" | Where-Object { $_.Trim() -notlike '#*' -and $_ -match '=' } | ForEach-Object {
            $n, $v = $_ -split '=', 2
            $n = $n.Trim(); $v = $v.Trim()
            switch ($n) {
                "MONGODB_URI"     { $envProps += "-DMONGODB_URI=$v" }
                "BACKEND_PORT"    { $envProps += "-DBACKEND_PORT=$v" }
                "FRONTEND_URL"    { $envProps += "-DFRONTEND_URL=$v" }
                "ADMIN_NAME"      { $envProps += "-DADMIN_NAME=$v" }
                "ADMIN_EMAIL"     { $envProps += "-DADMIN_EMAIL=$v" }
                "ADMIN_PASSWORD"  { $envProps += "-DADMIN_PASSWORD=$v" }
                "MAIL_HOST"       { $envProps += "-DMAIL_HOST=$v" }
                "MAIL_PORT"       { $envProps += "-DMAIL_PORT=$v" }
                "MAIL_USERNAME"   { $envProps += "-DMAIL_USERNAME=$v" }
                "MAIL_PASSWORD"   { $envProps += "-DMAIL_PASSWORD=$v" }
                "MAIL_FROM"       { $envProps += "-DMAIL_FROM=$v" }
            }
        }
    }

    $javaArgs = $envProps + @("-jar", "chatsphere-backend/target/chatsphere-backend-0.0.1-SNAPSHOT.jar")

    $backendProc = Start-Process $javaPath -ArgumentList $javaArgs `
        -RedirectStandardOutput $BACKEND_LOG -RedirectStandardError $BACKEND_ERR -NoNewWindow -PassThru -ErrorAction SilentlyContinue

    if ($backendProc) {
        $backendProc.Id | Out-File $BACKEND_PID_FILE -Force
        Write-Host "    -> Backend started successfully (PID: $($backendProc.Id))" -ForegroundColor Gray
    } else {
        Write-Host "    -> ERROR: Failed to start backend" -ForegroundColor Red
    }
}

function Start-Services {
    param([switch]$Build)
    Write-Host ""
    Write-Host "[*] Checking ports before start..." -ForegroundColor Cyan
    Free-Port $backendPort
    Free-Port $frontendPort

    # 1. Start Backend
    Start-Backend -Build:$Build

    # 2. Start Frontend
    Write-Host "[*] Starting Frontend (Vite)..." -ForegroundColor Cyan
    New-Item -ItemType File -Force -Path $FRONTEND_LOG | Out-Null
    New-Item -ItemType File -Force -Path $FRONTEND_ERR | Out-Null

    $frontendProc = Start-Process cmd -ArgumentList "/c npm run dev" -WorkingDirectory "chatsphere-frontend" `
        -RedirectStandardOutput $FRONTEND_LOG -RedirectStandardError $FRONTEND_ERR -NoNewWindow -PassThru -ErrorAction SilentlyContinue

    if ($frontendProc) {
        $frontendProc.Id | Out-File $FRONTEND_PID_FILE -Force
        Write-Host "    -> Frontend started successfully (PID: $($frontendProc.Id))" -ForegroundColor Gray
    } else {
        Write-Host "    -> ERROR: Failed to start frontend" -ForegroundColor Red
    }

    Start-Sleep -Milliseconds 500
    Show-Status
    Write-Host "Press any key to return to menu..."
    [System.Console]::ReadKey($true) | Out-Null
}

function Stop-Services {
    Write-Host ""
    Write-Host "[*] Stopping services..." -ForegroundColor Cyan

    $bPid = Is-Running $BACKEND_PID_FILE
    if ($bPid) {
        Write-Host "  Stopping Backend (PID: $bPid)..." -ForegroundColor Gray
        taskkill /F /T /PID $bPid 2>&1 | Out-Null
        Remove-Item $BACKEND_PID_FILE -Force -ErrorAction SilentlyContinue
    }

    $fPid = Is-Running $FRONTEND_PID_FILE
    if ($fPid) {
        Write-Host "  Stopping Frontend (PID: $fPid)..." -ForegroundColor Gray
        taskkill /F /T /PID $fPid 2>&1 | Out-Null
        Remove-Item $FRONTEND_PID_FILE -Force -ErrorAction SilentlyContinue
    }

    # Clean residual port listeners
    Free-Port $backendPort
    Free-Port $frontendPort

    Write-Host "[*] All services stopped." -ForegroundColor Green
}

function Stream-Logs {
    param([string]$logPath, [string]$errPath, [string]$name)
    if (-not (Test-Path $logPath)) {
        Write-Host "Log file for $name not found yet." -ForegroundColor Red
        Start-Sleep -Seconds 1
        return
    }

    Clear-Host
    Write-Host "==========================================================" -ForegroundColor DarkGray
    Write-Host "  Streaming logs for $name (Press ANY KEY to exit)" -ForegroundColor Yellow
    Write-Host "  Errors (if any) are written to $errPath" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor DarkGray
    Write-Host ""

    # Open log with shared read/write access
    $stream = [System.IO.File]::Open($logPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $reader = New-Object System.IO.StreamReader($stream)

    # Read existing content first
    $reader.ReadToEnd() | Write-Host -NoNewline

    # Loop and read incoming lines
    while ($true) {
        if ([System.Console]::KeyAvailable) {
            $null = [System.Console]::ReadKey($true)
            break
        }
        $line = $reader.ReadLine()
        if ($null -ne $line) {
            Write-Host $line
        } else {
            Start-Sleep -Milliseconds 100
        }
    }

    $reader.Close()
    $stream.Close()
}

# 4. Main Menu Loop
$running = $true
while ($running) {
    Clear-Host
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "       ChatSphere CLI Development Manager" -ForegroundColor White
    Write-Host "==================================================" -ForegroundColor Cyan
    Show-Status
    Write-Host ""
    Write-Host "  1. Start All Services (Fast Start)" -ForegroundColor Gray
    Write-Host "  2. Build Backend & Start All Services" -ForegroundColor Gray
    Write-Host "  3. Stop All Services" -ForegroundColor Gray
    Write-Host "  4. Restart Services (Fast)" -ForegroundColor Gray
    Write-Host "  5. View Backend Logs" -ForegroundColor Gray
    Write-Host "  6. View Frontend Logs" -ForegroundColor Gray
    Write-Host "  7. Exit" -ForegroundColor Gray
    Write-Host ""
    Write-Host -NoNewline "Enter choice [1-7]: "
    $choice = Read-Host

    switch ($choice) {
        "1" { Start-Services }
        "2" { Start-Services -Build }
        "3" { Stop-Services; Write-Host "Press any key to return..."; [System.Console]::ReadKey($true) | Out-Null }
        "4" { Stop-Services; Start-Services }
        "5" { Stream-Logs $BACKEND_LOG $BACKEND_ERR "Backend" }
        "6" { Stream-Logs $FRONTEND_LOG $FRONTEND_ERR "Frontend" }
        "7" { Stop-Services; $running = $false }
        default { Write-Host "Invalid option!" -ForegroundColor Red; Start-Sleep -Seconds 1 }
    }
}
