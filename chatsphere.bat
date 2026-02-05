@echo off
setlocal enabledelayedexpansion

set "FRONTEND_DIR=d:\Project\ChatSphere\chatsphere-frontend"
set "BACKEND_DIR=d:\Project\ChatSphere\chatsphere-backend"
set "STATE_FILE=%TEMP%\chatsphere_state.txt"

REM Load previous state
if exist "%STATE_FILE%" (
    for /f "tokens=1,2 delims==" %%a in (%STATE_FILE%) do (
        set "%%a=%%b"
    )
)

:menu
cls
echo.
echo ================================================
echo        ChatSphere Development Manager
echo ================================================
echo.
call :show_status
echo.
echo 1. Start All Services
echo 2. Stop All Services
echo 3. Restart All Services
echo 4. View Logs
echo 5. Continue Last Session
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto stop_all
if "%choice%"=="3" goto restart_all
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto continue_session
if "%choice%"=="6" goto exit_program
goto menu

:continue_session
cls
echo.
echo [%date% %time%] Continuing Last Session...
echo.
call :show_status
echo.
tasklist /V | findstr /I "ChatSphere" >nul
if not errorlevel 1 (
    echo Services are already running!
    echo.
    echo Press any key to return to menu...
    pause >nul
    goto menu
)

echo Starting services from last session...
goto start_all

:start_all
cls
echo.
echo [%date% %time%] Starting ChatSphere Services...
// ...existing code...
echo LAST_STATE=RUNNING > "%STATE_FILE%"
echo LAST_START=%date% %time% >> "%STATE_FILE%"
// ...existing code...

:stop_all
cls
echo.
echo [%date% %time%] Stopping all ChatSphere Services...
// ...existing code...
echo LAST_STATE=STOPPED > "%STATE_FILE%"
echo LAST_STOP=%date% %time% >> "%STATE_FILE%"
// ...existing code...

// ...existing code...

:show_status
echo [Service Status]
tasklist /V | findstr /I "ChatSphere" >nul
if errorlevel 1 (
    echo   Frontend: [OFFLINE]
    echo   Backend:  [OFFLINE]
    if defined LAST_STOP echo   Last Stopped: !LAST_STOP!
) else (
    echo   Frontend: [RUNNING]
    echo   Backend:  [RUNNING]
    if defined LAST_START echo   Started: !LAST_START!
)
exit /b

endlocal