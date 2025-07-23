# Artism Frontend and Backend Starter

$logFile = "artism_full_stack.log"

function Write-Log {
    param (
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Console output
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARNING" { Write-Host $logEntry -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logEntry -ForegroundColor Green }
        default { Write-Host $logEntry }
    }
    
    # Write to log file
    Add-Content -Path $logFile -Value $logEntry
}

# Check if dependencies are installed
function Check-Dependencies {
    Write-Log "Checking dependencies..." "INFO"
    $allDepsInstalled = $true
    
    # Check Python
    try {
        $pythonVersion = python --version 2>&1
        Write-Log "Python detected: $pythonVersion" "INFO"
    } catch {
        Write-Log "Python is not installed or not in PATH" "ERROR"
        Write-Log "Please install Python from https://www.python.org/downloads/" "ERROR"
        $allDepsInstalled = $false
    }
    
    # Check Node.js and npm
    try {
        $nodeVersion = node --version 2>&1
        $npmVersion = npm --version 2>&1
        Write-Log "Node.js detected: $nodeVersion" "INFO"
        Write-Log "npm detected: $npmVersion" "INFO"
    } catch {
        Write-Log "Node.js/npm is not installed or not in PATH" "ERROR"
        Write-Log "Please install Node.js from https://nodejs.org/en/download/" "ERROR"
        Write-Log "INSTALLATION INSTRUCTIONS:" "ERROR"
        Write-Log "1. Download the Windows installer (.msi) from https://nodejs.org/en/download/" "ERROR"
        Write-Log "2. Run the installer with default settings" "ERROR"
        Write-Log "3. Restart your PowerShell/Command Prompt" "ERROR"
        Write-Log "4. Run this script again" "ERROR"
        $allDepsInstalled = $false
    }
    
    # Check uvicorn
    try {
        $uvicornVersion = python -c "import uvicorn; print(f'uvicorn {uvicorn.__version__}')" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "uvicorn detected: $uvicornVersion" "INFO"
        } else {
            throw "uvicorn not installed"
        }
    } catch {
        Write-Log "uvicorn is not installed. Installing now..." "WARNING"
        pip install uvicorn
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Failed to install uvicorn. Please install manually with 'pip install uvicorn'" "ERROR"
            $allDepsInstalled = $false
        } else {
            Write-Log "uvicorn installed successfully" "SUCCESS"
        }
    }
    
    return $allDepsInstalled
}

function Start-Backend {
    Write-Log "Starting Artism Backend..." "INFO"
    
    try {
        # Save current directory
        $originalLocation = Get-Location
        
        # Switch to backend directory
        Set-Location -Path "apps/artism-backend"
        
        # Set environment variables
        $env:USE_MOCK_DB = "True"
        Write-Log "Using Mock Database" "INFO"
        
        # Check for additional backend dependencies
        Write-Log "Checking backend dependencies..." "INFO"
        pip install -r requirements.txt 2>$null
        
        # Start the service
        Write-Log "Running command: python main.py" "INFO"
        Start-Process -FilePath "python" -ArgumentList "main.py" -NoNewWindow
        
        Write-Log "Artism Backend started successfully" "SUCCESS"
        return $true
    } 
    catch {
        Write-Log "Failed to start Artism Backend: $_" "ERROR"
        return $false
    } 
    finally {
        # Return to original directory
        Set-Location -Path $originalLocation
    }
}

function Start-Frontend {
    Write-Log "Starting AIDA Frontend..." "INFO"
    
    try {
        # Save current directory
        $originalLocation = Get-Location
        
        # Switch to frontend directory
        Set-Location -Path "apps/aida-frontend"
        
        # Check if node_modules exists
        if (-not (Test-Path -Path "node_modules")) {
            Write-Log "Installing npm dependencies (this may take a while)..." "INFO"
            npm install
            if ($LASTEXITCODE -ne 0) {
                Write-Log "Failed to install npm dependencies" "ERROR"
                return $false
            }
        }
        
        # Start the service
        Write-Log "Running command: npm run dev" "INFO"
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        
        Write-Log "AIDA Frontend started successfully" "SUCCESS"
        return $true
    } 
    catch {
        Write-Log "Failed to start AIDA Frontend: $_" "ERROR"
        return $false
    } 
    finally {
        # Return to original directory
        Set-Location -Path $originalLocation
    }
}

# Main program
Clear-Host
Write-Log "Artism Full-Stack Startup Tool" "INFO"

# Check dependencies
$depsInstalled = Check-Dependencies
if (-not $depsInstalled) {
    Write-Log "Some dependencies are missing. Please install them according to the instructions above." "WARNING"
    Write-Log "Do you want to continue anyway? (Y/N)" "WARNING"
    $continue = Read-Host
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Log "Operation cancelled. Please install the required dependencies and try again." "INFO"
        exit
    }
}

# Start backend
$backendResult = Start-Backend

if (-not $backendResult) {
    Write-Log "Backend startup failed. Continue with frontend startup? (Y/N)" "WARNING"
    $continue = Read-Host
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Log "Operation cancelled" "INFO"
        exit
    }
}

# Wait a few seconds for backend to initialize
Start-Sleep -Seconds 3

# Start frontend
$frontendResult = Start-Frontend

if (-not $frontendResult) {
    Write-Log "Frontend startup failed" "ERROR"
} 
else {
    Write-Log "Frontend and backend started successfully" "SUCCESS"
    Write-Log "Backend API URL: http://localhost:8000" "INFO"
    Write-Log "Frontend URL: http://localhost:3000" "INFO"
}

Write-Log "Press any key to exit..." "INFO"
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 