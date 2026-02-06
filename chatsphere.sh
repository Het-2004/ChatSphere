#!/bin/bash

# ==========================================
# ChatSphere Development Manager - Industry Level Upgrade
# ==========================================

# 1. Dynamic Path Resolution (Portable)
# Gets the directory of the script, works regardless of where it's called from
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# 2. Configuration
FRONTEND_DIR="$SCRIPT_DIR/chatsphere-frontend"
BACKEND_DIR="$SCRIPT_DIR/chatsphere-backend"
LOG_DIR="$SCRIPT_DIR/logs"
PID_DIR="$SCRIPT_DIR/.pids"

# Ensure directories exist
mkdir -p "$LOG_DIR"
mkdir -p "$PID_DIR"

# Files
BACKEND_PID_FILE="$PID_DIR/backend.pid"
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

# Helper: Check if a process is running by PID
is_running() {
    local pid_file=$1
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            return 0 # True
        fi
        # Stale PID file
        rm "$pid_file"
    fi
    return 1 # False
}

show_status() {
    echo "------------------------------------------------"
    echo "[Service Status]"
    echo "------------------------------------------------"
    
    if is_running "$BACKEND_PID_FILE"; then
        echo -e "  Backend:  \033[32m[RUNNING]\033[0m (PID: $(cat "$BACKEND_PID_FILE"))"
    else
        echo -e "  Backend:  \033[31m[OFFLINE]\033[0m"
    fi
    
    if is_running "$FRONTEND_PID_FILE"; then
        echo -e "  Frontend: \033[32m[RUNNING]\033[0m (PID: $(cat "$FRONTEND_PID_FILE"))"
    else
        echo -e "  Frontend: \033[31m[OFFLINE]\033[0m"
    fi
    echo ""
}

start_service() {
    local name=$1
    local dir=$2
    local pid_file=$3
    local log_file=$4
    local cmd="npm start"

    if is_running "$pid_file"; then
        echo "$name is already running."
        return
    fi

    if [ ! -d "$dir" ]; then
        echo "Error: Directory for $name not found at $dir"
        return
    fi

    echo "Starting $name..."
    
    # Use subshell to not change current shell directory
    (
        cd "$dir" || exit
        # nohup allows process to survive shell closure
        nohup $cmd > "$log_file" 2>&1 &
        echo $! > "$pid_file"
    )
    
    echo "$name started. Logs: $log_file"
}

stop_service() {
    local name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        echo "Stopping $name (PID: $pid)..."
        
        # Graceful kill
        kill "$pid" 2>/dev/null
        
        # Wait for it to die
        local count=0
        while kill -0 "$pid" 2>/dev/null && [ $count -lt 5 ]; do
            sleep 1
            ((count++))
        done
        
        # Force kill if stubborn
        if kill -0 "$pid" 2>/dev/null; then
            echo "Force killing $name..."
            kill -9 "$pid" 2>/dev/null
        fi
        
        rm "$pid_file"
        echo "$name stopped."
    else
        echo "$name is not running."
    fi
}

start_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo "Error: PM2 is not installed. Please run: npm install -g pm2"
        read -p "Press Enter to return..."
        return
    fi
    echo "Starting ChatSphere with PM2 (Industry Standard)..."
    pm2 start "$SCRIPT_DIR/ecosystem.config.js"
    pm2 save
    echo "Services started. Use 'pm2 list' or 'pm2 monit' to monitor."
    read -p "Press Enter to return..."
}

stop_pm2() {
    if command -v pm2 &> /dev/null; then
        echo "Stopping PM2 services..."
        pm2 stop all
        pm2 delete all
        read -p "Press Enter to return..."
    fi
}

start_all() {
    clear
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting ChatSphere Services..."
    start_service "Backend" "$BACKEND_DIR" "$BACKEND_PID_FILE" "$BACKEND_LOG"
    start_service "Frontend" "$FRONTEND_DIR" "$FRONTEND_PID_FILE" "$FRONTEND_LOG"
    echo ""
    read -p "Press Enter to return to menu..."
}

stop_all() {
    clear
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Stopping all ChatSphere Services..."
    stop_service "Backend" "$BACKEND_PID_FILE"
    stop_service "Frontend" "$FRONTEND_PID_FILE"
    echo ""
    read -p "Press Enter to return to menu..."
}

stop_backend_only() {
    clear
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Stopping Backend..."
    stop_service "Backend" "$BACKEND_PID_FILE"
    read -p "Press Enter to return to menu..."
}

view_logs() {
    clear
    echo "================================================"
    echo "       Log Viewer"
    echo "================================================"
    echo "1. Backend Log"
    echo "2. Frontend Log"
    echo "3. Both (tail -f)"
    echo "4. Back"
    echo ""
    read -p "Choice: " lchoice
    
    case $lchoice in
        1) tail -f "$BACKEND_LOG" ;;
        2) tail -f "$FRONTEND_LOG" ;;
        3) tail -f "$BACKEND_LOG" "$FRONTEND_LOG" ;;
        *) return ;;
    esac
}

while true; do
    clear
    echo "================================================"
    echo "       ChatSphere Development Manager"
    echo "================================================"
    echo "Project Root: $SCRIPT_DIR"
    show_status
    echo "1. Start All Services"
    echo "2. Stop All Services"
    echo "3. Restart All Services"
    echo "4. View Logs"
    echo "5. Stop Backend Only"
    echo "6. Start Production (PM2)"
    echo "7. Stop Production (PM2)"
    echo "8. Exit"
    echo ""
    read -p "Enter your choice (1-8): " choice
    
    case $choice in
        1) start_all ;;
        2) stop_all ;;
        3) stop_all; sleep 1; start_all ;;
        4) view_logs ;;
        5) stop_backend_only ;;
        6) start_pm2 ;;
        7) stop_pm2 ;;
        8) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice"; sleep 1 ;;
    esac
done