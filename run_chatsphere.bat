@echo off
setlocal

:: Set title and color
title ChatSphere Launcher
color 0B

:: Load environment variables from .env
if exist ".env" (
    echo [*] Loading environment variables from .env...
    for /f "usebackq eol=# tokens=1,* delims==" %%i in (".env") do (
        set "%%i=%%j"
    )
)

echo ===================================================
echo      ChatSphere - Fast Launcher (JDK 21)
echo ===================================================
echo.

:: 1. Force use of local JDK 21
set "JAVA_HOME=C:\Users\hetpr\.jdks\ms-21.0.10"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [*] Environment Configured:
java -version
echo.

:: 2. Start Backend (in a new window)
echo [*] Starting Backend (Spring Boot)...
start "ChatSphere Backend" cmd /k "cd chatsphere-backend && mvn spring-boot:run"

:: Wait a bit for backend to initialize
timeout /t 5 >nul

:: 3. Start Frontend (in a new window)
echo [*] Starting Frontend (React/Vite)...
start "ChatSphere Frontend" cmd /k "cd chatsphere-frontend && npm run dev"

echo.
echo [*] Application launched! 
echo    - Backend: http://localhost:8080
echo    - Frontend: http://localhost:5173
echo.
echo [!] Press any key to exit this launcher (windows will stay open)
pause >nul
