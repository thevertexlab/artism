# Cursor监控脚本
# 用于监控Cursor对话和自动处理常见问题

$logFile = "cursor_monitor.log"

function Write-Log {
    param (
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # 输出到控制台
    switch ($Level) {
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "WARNING" { Write-Host $logEntry -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logEntry -ForegroundColor Green }
        default { Write-Host $logEntry }
    }
    
    # 写入日志文件
    Add-Content -Path $logFile -Value $logEntry
}

function Test-MongoDB {
    try {
        # 检查MongoDB服务是否运行
        $mongoRunning = $false
        
        try {
            $result = Invoke-RestMethod -Uri "http://localhost:27017" -Method Get -ErrorAction SilentlyContinue
            $mongoRunning = $true
        } catch {
            # 尝试使用mongomock替代
            Write-Log "MongoDB服务未运行，将使用mongomock模拟数据库" "WARNING"
            $env:USE_MOCK_DB = "True"
        }
        
        return $mongoRunning
    } catch {
        Write-Log "检查MongoDB状态时出错: $_" "ERROR"
        return $false
    }
}

function Start-ArtismBackend {
    try {
        Write-Log "启动Artism Backend服务..." "INFO"
        
        # 检查MongoDB状态
        Test-MongoDB
        
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 使用超时脚本启动服务
        $command = "python main.py"
        powershell -File ../../command_timeout.ps1 -Command $command -TimeoutSeconds 120
        
        Write-Log "Artism Backend服务已启动" "SUCCESS"
    } catch {
        Write-Log "启动Artism Backend服务失败: $_" "ERROR"
    }
}

function Test-ApiEndpoint {
    param (
        [string]$Endpoint = "http://localhost:8000"
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Endpoint -Method Get -ErrorAction Stop
        Write-Log "API端点 $Endpoint 测试成功" "SUCCESS"
        return $true
    } catch {
        Write-Log "API端点 $Endpoint 测试失败: $_" "ERROR"
        return $false
    }
}

function Initialize-Environment {
    Write-Log "初始化环境..." "INFO"
    
    # 检查必要的依赖
    try {
        python --version
        Write-Log "Python已安装" "SUCCESS"
    } catch {
        Write-Log "Python未安装或不在PATH中" "ERROR"
        return $false
    }
    
    # 检查pip
    try {
        pip --version
        Write-Log "Pip已安装" "SUCCESS"
    } catch {
        Write-Log "Pip未安装或不在PATH中" "ERROR"
        return $false
    }
    
    # 检查MongoDB
    $mongoStatus = Test-MongoDB
    if ($mongoStatus) {
        Write-Log "MongoDB服务正在运行" "SUCCESS"
    } else {
        Write-Log "MongoDB未运行，将使用mongomock" "WARNING"
    }
    
    return $true
}

# 主程序
Write-Log "Cursor监控脚本启动" "INFO"

# 初始化环境
$envReady = Initialize-Environment
if (-not $envReady) {
    Write-Log "环境初始化失败，请检查依赖项" "ERROR"
    exit 1
}

# 监控循环
while ($true) {
    # 检查API是否可用
    $apiAvailable = Test-ApiEndpoint
    
    if (-not $apiAvailable) {
        Write-Log "API不可用，尝试启动后端服务..." "WARNING"
        Start-ArtismBackend
    }
    
    # 每30秒检查一次
    Start-Sleep -Seconds 30
} 