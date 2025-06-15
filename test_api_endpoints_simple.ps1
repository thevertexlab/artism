# Artism Backend API端点测试脚本
# 用于测试API端点的可用性和功能

param (
    [string]$BaseUrl = "http://localhost:8000",
    [switch]$Verbose = $false
)

$logFile = "test_api_simple.log"

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

function Test-ArtistsEndpoints {
    Write-Log "测试艺术家API端点..." "INFO"
    
    # 获取艺术家列表
    $listResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Description "获取艺术家列表"
    
    if (-not $listResult.Success) {
        Write-Log "获取艺术家列表失败" "ERROR"
        return $false
    }
    
    # 创建艺术家
    $newArtist = @{
        name = "测试艺术家"
        birth_year = 1980
        nationality = "中国"
        bio = "这是一个测试艺术家"
        tags = @("测试", "现代")
    }
    
    $createResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Method "POST" -Body $newArtist -Description "创建艺术家"
    
    if (-not $createResult.Success) {
        Write-Log "创建艺术家失败" "ERROR"
        return $false
    }
    
    # 获取创建的艺术家ID
    $artistId = $createResult.Response.data.id
    
    # 获取单个艺术家
    $getResult = Test-ApiEndpoint -Endpoint "/api/v1/artists/$artistId" -Description "获取单个艺术家"
    
    if (-not $getResult.Success) {
        Write-Log "获取单个艺术家失败" "ERROR"
        return $false
    }
    
    # 搜索艺术家
    $searchResult = Test-ApiEndpoint -Endpoint "/api/v1/artists/search/?query=测试" -Description "搜索艺术家"
    
    if (-not $searchResult.Success) {
        Write-Log "搜索艺术家失败" "ERROR"
        return $false
    }
    
    Write-Log "艺术家API端点测试通过" "SUCCESS"
    return $true
}

function Test-ArtworksEndpoints {
    Write-Log "测试艺术品API端点..." "INFO"
    
    # 获取艺术家列表找到一个艺术家ID
    $artistsResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Description "获取艺术家列表"
    
    if (-not $artistsResult.Success) {
        Write-Log "获取艺术家列表失败，无法测试艺术品API" "ERROR"
        return $false
    }
    
    # 检查是否有艺术家数据
    if (-not $artistsResult.Response.data -or $artistsResult.Response.data.Count -eq 0) {
        Write-Log "没有找到艺术家，无法测试艺术品API" "WARNING"
        return $false
    }
    
    # 获取第一个艺术家的ID
    $artistId = $artistsResult.Response.data[0].id
    
    # 创建艺术品
    $newArtwork = @{
        title = "测试艺术品"
        artist_id = $artistId
        year = 2023
        description = "这是一个测试艺术品"
        tags = @("测试", "现代")
    }
    
    $createResult = Test-ApiEndpoint -Endpoint "/api/v1/artworks" -Method "POST" -Body $newArtwork -Description "创建艺术品"
    
    if (-not $createResult.Success) {
        Write-Log "创建艺术品失败" "ERROR"
        return $false
    }
    
    # 获取创建的艺术品ID
    $artworkId = $createResult.Response.data.id
    
    # 获取单个艺术品
    $getResult = Test-ApiEndpoint -Endpoint "/api/v1/artworks/$artworkId" -Description "获取单个艺术品"
    
    if (-not $getResult.Success) {
        Write-Log "获取单个艺术品失败" "ERROR"
        return $false
    }
    
    # 按艺术家获取艺术品
    $byArtistResult = Test-ApiEndpoint -Endpoint "/api/v1/artworks/artist/$artistId" -Description "按艺术家获取艺术品"
    
    if (-not $byArtistResult.Success) {
        Write-Log "按艺术家获取艺术品失败" "ERROR"
        return $false
    }
    
    Write-Log "艺术品API端点测试通过" "SUCCESS"
    return $true
}

function Test-ArtMovementsEndpoints {
    Write-Log "测试艺术运动API端点..." "INFO"
    
    # 获取艺术运动列表
    $listResult = Test-ApiEndpoint -Endpoint "/api/v1/art-movements" -Description "获取艺术运动列表"
    
    if (-not $listResult.Success) {
        Write-Log "获取艺术运动列表失败" "ERROR"
        return $false
    }
    
    # 创建艺术运动
    $newMovement = @{
        name = "测试运动"
        description = "这是一个测试艺术运动"
        start_year = 2000
        end_year = 2023
        tags = @("测试", "现代")
    }
    
    $createResult = Test-ApiEndpoint -Endpoint "/api/v1/art-movements" -Method "POST" -Body $newMovement -Description "创建艺术运动"
    
    if (-not $createResult.Success) {
        Write-Log "创建艺术运动失败" "ERROR"
        return $false
    }
    
    # 获取创建的艺术运动ID
    $movementId = $createResult.Response.data.id
    
    # 获取单个艺术运动
    $getResult = Test-ApiEndpoint -Endpoint "/api/v1/art-movements/$movementId" -Description "获取单个艺术运动"
    
    if (-not $getResult.Success) {
        Write-Log "获取单个艺术运动失败" "ERROR"
        return $false
    }
    
    Write-Log "艺术运动API端点测试通过" "SUCCESS"
    return $true
}

# 主程序
Write-Log "API端点测试脚本开始执行" "INFO"

# 测试基本端点
$basicEndpointsWorking = Test-BasicEndpoints

if ($basicEndpointsWorking) {
    Write-Log "基本API端点测试通过" "SUCCESS"
} else {
    Write-Log "基本API端点测试失败，脚本终止" "ERROR"
    exit 1
}

# 测试艺术家API
$artistsApiWorking = Test-ArtistsEndpoints

if ($artistsApiWorking) {
    Write-Log "艺术家API测试通过" "SUCCESS"
} else {
    Write-Log "艺术家API测试失败" "ERROR"
}

# 测试艺术品API
$artworksApiWorking = Test-ArtworksEndpoints

if ($artworksApiWorking) {
    Write-Log "艺术品API测试通过" "SUCCESS"
} else {
    Write-Log "艺术品API测试失败" "ERROR"
}

# 测试艺术运动API
$artMovementsApiWorking = Test-ArtMovementsEndpoints

if ($artMovementsApiWorking) {
    Write-Log "艺术运动API测试通过" "SUCCESS"
} else {
    Write-Log "艺术运动API测试失败" "ERROR"
}

Write-Log "API端点测试脚本执行完成" "INFO" 