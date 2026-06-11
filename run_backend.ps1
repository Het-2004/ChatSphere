# Load environment variables from root .env file
if (Test-Path ".env") {
    Write-Host "Loading environment variables from .env..."
    Get-Content .env | Where-Object { $_.Trim() -notlike '#*' -and $_ -match '=' } | ForEach-Object {
        $name, $value = $_ -split '=', 2
        [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), "Process")
    }
} else {
    Write-Warning ".env file not found"
}

# Navigate to backend and run the JAR
cd chatsphere-backend
java -jar target/chatsphere-backend-0.0.1-SNAPSHOT.jar
