# Artism Backend 启动和测试脚本
# 用于启动后端服务并测试API端点

param (
    [string]$BaseUrl = "http://localhost:8000",
    [switch]$ForceUseMock = $true,
    [switch]$Verbose = $false,
    [int]$TimeoutSeconds = 60
)

$logFile = "run_test_backend.log"

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

function Start-BackendJob {
    Write-Log "启动Artism Backend作为后台作业..." "INFO"
    
    try {
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 设置环境变量
        if ($ForceUseMock) {
            $env:USE_MOCK_DB = "True"
            Write-Log "强制使用Mock数据库" "INFO"
        }
        
        # 启动服务作为后台作业
        Write-Log "执行命令: python main.py" "INFO"
        $job = Start-Job -ScriptBlock {
            Set-Location -Path "apps/artism-backend"
            python main.py
        }
        
        Write-Log "Artism Backend作业已启动，JobId: $($job.Id)" "SUCCESS"
        return $job
    } catch {
        Write-Log "Artism Backend启动失败: $_" "ERROR"
        return $null
    }
}

function Wait-ForBackendStartup {
    param (
        [int]$TimeoutSeconds = 30
    )
    
    Write-Log "等待后端服务启动 ($TimeoutSeconds 秒)..." "INFO"
    
    $startTime = Get-Date
    $endpoint = "$BaseUrl/docs"
    
    while ((Get-Date) -lt $startTime.AddSeconds($TimeoutSeconds)) {
        try {
            $response = Invoke-WebRequest -Uri $endpoint -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Log "后端服务已成功启动" "SUCCESS"
                return $true
            }
        } catch {
            # 继续尝试
        }
        
        Start-Sleep -Seconds 2
        Write-Host "." -NoNewline
    }
    
    Write-Log "等待后端服务启动超时" "ERROR"
    return $false
}

function Test-ApiEndpoint {
    param (
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null,
        [string]$Description = ""
    )
    
    $url = "$BaseUrl$Endpoint"
    
    try {
        Write-Log "测试端点: $url ($Method) - $Description" "INFO"
        
        $params = @{
            Uri = $url
            Method = $Method
            ErrorAction = "Stop"
            ContentType = "application/json"
        }
        
        if ($Body -ne $null) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $params.Add("Body", $jsonBody)
        }
        
        $response = Invoke-RestMethod @params
        
        if ($Verbose) {
            Write-Log "响应: $($response | ConvertTo-Json -Depth 3)" "INFO"
        }
        
        Write-Log "端点测试成功: $url" "SUCCESS"
        return @{
            Success = $true
            Response = $response
        }
    } catch {
        Write-Log "端点测试失败: $url - $($_.Exception.Message)" "ERROR"
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

function Test-BasicEndpoints {
    Write-Log "测试基本API端点..." "INFO"
    
    # 测试API文档
    $docsResult = Test-ApiEndpoint -Endpoint "/docs" -Description "Swagger UI"
    
    # 测试健康检查
    $healthResult = Test-ApiEndpoint -Endpoint "/api/v1/database/health" -Description "数据库健康检查"
    
    # 测试基本测试端点
    $testResult = Test-ApiEndpoint -Endpoint "/api/v1/test" -Description "测试端点"
    
    return $docsResult.Success -and $healthResult.Success -and $testResult.Success
}

# 主程序
Write-Log "Artism Backend启动和测试脚本开始执行" "INFO"

# 启动后端作为后台作业
$backendJob = Start-BackendJob

if ($backendJob -eq $null) {
    Write-Log "无法启动后端服务，脚本终止" "ERROR"
    exit 1
}

# 等待后端启动
$backendStarted = Wait-ForBackendStartup -TimeoutSeconds $TimeoutSeconds

if (-not $backendStarted) {
    Write-Log "后端服务未能在指定时间内启动，停止作业并退出" "ERROR"
    Stop-Job -Job $backendJob
    Remove-Job -Job $backendJob
    exit 1
}

# 测试基本端点
$basicEndpointsWorking = Test-BasicEndpoints

if ($basicEndpointsWorking) {
    Write-Log "基本API端点测试通过" "SUCCESS"
} else {
    Write-Log "基本API端点测试失败" "ERROR"
}

Write-Log "脚本执行完成，后端服务仍在后台运行 (JobId: $($backendJob.Id))" "INFO"
Write-Log "要停止后端服务，请运行: Stop-Job -Id $($backendJob.Id); Remove-Job -Id $($backendJob.Id)" "INFO"

# 返回作业ID，以便后续操作
return $backendJob.Id
