# Artism Backend 数据库连接测试脚本
# 用于测试数据库连接和初始化数据库

param (
    [string]$BaseUrl = "http://localhost:8000",
    [switch]$Verbose = $false
)

$logFile = "test_db_connection.log"

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

function Test-DatabaseConnection {
    Write-Log "测试数据库连接..." "INFO"
    
    # 测试数据库健康状态
    $healthResult = Test-ApiEndpoint -Endpoint "/api/v1/database/health" -Description "数据库健康检查"
    
    if (-not $healthResult.Success) {
        Write-Log "数据库健康检查失败" "ERROR"
        return $false
    }
    
    # 检查数据库连接状态
    $isConnected = $healthResult.Response.data.database_connected
    
    if ($isConnected) {
        Write-Log "数据库连接成功" "SUCCESS"
        
        # 显示数据库版本
        $dbVersion = $healthResult.Response.data.server_version
        Write-Log "MongoDB 服务器版本: $dbVersion" "INFO"
        
        return $true
    } else {
        Write-Log "数据库连接失败: $($healthResult.Response.data.error)" "ERROR"
        return $false
    }
}

function Initialize-Database {
    Write-Log "初始化数据库..." "INFO"
    
    # 确保集合存在
    $collectionsResult = Test-ApiEndpoint -Endpoint "/api/v1/database/ensure-collections" -Method "POST" -Description "确保集合存在"
    
    if (-not $collectionsResult.Success) {
        Write-Log "确保集合存在失败" "ERROR"
        return $false
    }
    
    # 创建索引
    $indexesResult = Test-ApiEndpoint -Endpoint "/api/v1/database/create-indexes" -Method "POST" -Description "创建索引"
    
    if (-not $indexesResult.Success) {
        Write-Log "创建索引失败" "ERROR"
        return $false
    }
    
    Write-Log "数据库初始化完成" "SUCCESS"
    return $true
}

function Generate-TestData {
    Write-Log "生成测试数据..." "INFO"
    
    # 生成测试数据
    $generateResult = Test-ApiEndpoint -Endpoint "/api/v1/data-generation/generate-test-data" -Method "POST" -Description "生成测试数据"
    
    if (-not $generateResult.Success) {
        Write-Log "生成测试数据失败" "ERROR"
        return $false
    }
    
    # 获取数据库统计信息
    $statsResult = Test-ApiEndpoint -Endpoint "/api/v1/database/stats" -Description "获取数据库统计信息"
    
    if ($statsResult.Success) {
        Write-Log "测试数据生成成功" "SUCCESS"
        return $true
    } else {
        Write-Log "获取数据库统计信息失败" "ERROR"
        return $false
    }
}

# 主程序
Write-Log "数据库连接测试脚本开始执行" "INFO"

# 测试数据库连接
$dbConnected = Test-DatabaseConnection

if (-not $dbConnected) {
    Write-Log "数据库连接失败，脚本终止" "ERROR"
    exit 1
}

# 初始化数据库
$dbInitialized = Initialize-Database

if (-not $dbInitialized) {
    Write-Log "数据库初始化失败" "WARNING"
}

# 生成测试数据
$dataGenerated = Generate-TestData

if (-not $dataGenerated) {
    Write-Log "测试数据生成失败" "WARNING"
}

Write-Log "数据库连接测试脚本执行完成" "INFO" 