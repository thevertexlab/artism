# Artism Backend API测试脚本
# 用于测试API端点的可用性和功能

param (
    [string]$BaseUrl = "http://localhost:8000",
    [switch]$Verbose = $false
)

$logFile = "api_test.log"

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

# 测试基本连接
function Test-BaseConnection {
    Write-Log "测试基本连接..." "INFO"
    $result = Test-ApiEndpoint -Endpoint "/" -Description "根端点"
    return $result.Success
}

# 测试API文档
function Test-ApiDocs {
    Write-Log "测试API文档..." "INFO"
    $docsResult = Test-ApiEndpoint -Endpoint "/api/docs" -Description "Swagger UI"
    $redocResult = Test-ApiEndpoint -Endpoint "/api/redoc" -Description "ReDoc"
    
    return $docsResult.Success -and $redocResult.Success
}

# 测试艺术家API
function Test-ArtistsApi {
    Write-Log "测试艺术家API..." "INFO"
    
    # 获取艺术家列表
    $listResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Description "获取艺术家列表"
    
    # 创建艺术家
    $newArtist = @{
        name = "测试艺术家"
        birth_year = 1980
        nationality = "中国"
        bio = "这是一个测试艺术家"
        tags = @("测试", "现代")
    }
    
    $createResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Method "POST" -Body $newArtist -Description "创建艺术家"
    
    # 如果创建成功，测试获取单个艺术家
    if ($createResult.Success) {
        $artistId = $createResult.Response.data.id
        $getResult = Test-ApiEndpoint -Endpoint "/api/v1/artists/$artistId" -Description "获取单个艺术家"
        
        # 测试搜索
        $searchResult = Test-ApiEndpoint -Endpoint "/api/v1/artists/search/?query=测试" -Description "搜索艺术家"
        
        return $listResult.Success -and $createResult.Success -and $getResult.Success -and $searchResult.Success
    }
    
    return $false
}

# 测试艺术品API
function Test-ArtworksApi {
    Write-Log "测试艺术品API..." "INFO"
    
    # 获取艺术家列表找到一个艺术家ID
    $artistsResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Description "获取艺术家列表"
    
    if (-not $artistsResult.Success -or -not $artistsResult.Response.data -or $artistsResult.Response.data.Count -eq 0) {
        Write-Log "没有找到艺术家，无法测试艺术品API" "WARNING"
        return $false
    }
    
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
    
    # 如果创建成功，测试获取单个艺术品
    if ($createResult.Success) {
        $artworkId = $createResult.Response.data.id
        $getResult = Test-ApiEndpoint -Endpoint "/api/v1/artworks/$artworkId" -Description "获取单个艺术品"
        
        # 测试按艺术家获取艺术品
        $byArtistResult = Test-ApiEndpoint -Endpoint "/api/v1/artworks/artist/$artistId" -Description "按艺术家获取艺术品"
        
        return $createResult.Success -and $getResult.Success -and $byArtistResult.Success
    }
    
    return $false
}

# 测试艺术运动API
function Test-ArtMovementsApi {
    Write-Log "测试艺术运动API..." "INFO"
    
    # 获取艺术运动列表
    $listResult = Test-ApiEndpoint -Endpoint "/api/v1/art-movements" -Description "获取艺术运动列表"
    
    # 创建艺术运动
    $newMovement = @{
        name = "测试运动"
        description = "这是一个测试艺术运动"
        start_year = 2000
        end_year = 2023
        tags = @("测试", "现代")
    }
    
    $createResult = Test-ApiEndpoint -Endpoint "/api/v1/art-movements" -Method "POST" -Body $newMovement -Description "创建艺术运动"
    
    # 如果创建成功，测试获取单个艺术运动
    if ($createResult.Success) {
        $movementId = $createResult.Response.data.id
        $getResult = Test-ApiEndpoint -Endpoint "/api/v1/art-movements/$movementId" -Description "获取单个艺术运动"
        
        return $listResult.Success -and $createResult.Success -and $getResult.Success
    }
    
    return $false
}

# 测试AI交互API
function Test-AiInteractionApi {
    Write-Log "测试AI交互API..." "INFO"
    
    # 获取艺术家列表找到一个艺术家ID
    $artistsResult = Test-ApiEndpoint -Endpoint "/api/v1/artists" -Description "获取艺术家列表"
    
    if (-not $artistsResult.Success -or -not $artistsResult.Response.data -or $artistsResult.Response.data.Count -eq 0) {
        Write-Log "没有找到艺术家，无法测试AI交互API" "WARNING"
        return $false
    }
    
    $artistId = $artistsResult.Response.data[0].id
    
    # 测试AI交互
    $interaction = @{
        artist_id = $artistId
        message = "你好，请介绍一下你自己"
    }
    
    $interactionResult = Test-ApiEndpoint -Endpoint "/api/v1/ai-interaction" -Method "POST" -Body $interaction -Description "AI交互"
    
    return $interactionResult.Success
}

# 主程序
Write-Log "API测试脚本启动" "INFO"

# 测试基本连接
$baseConnected = Test-BaseConnection
if (-not $baseConnected) {
    Write-Log "基本连接失败，API可能未运行" "ERROR"
    exit 1
}

# 测试API文档
$docsAvailable = Test-ApiDocs
if (-not $docsAvailable) {
    Write-Log "API文档不可用" "WARNING"
}

# 测试艺术家API
$artistsApiWorking = Test-ArtistsApi
if ($artistsApiWorking) {
    Write-Log "艺术家API测试通过" "SUCCESS"
} else {
    Write-Log "艺术家API测试失败" "ERROR"
}

# 测试艺术品API
$artworksApiWorking = Test-ArtworksApi
if ($artworksApiWorking) {
    Write-Log "艺术品API测试通过" "SUCCESS"
} else {
    Write-Log "艺术品API测试失败" "ERROR"
}

# 测试艺术运动API
$artMovementsApiWorking = Test-ArtMovementsApi
if ($artMovementsApiWorking) {
    Write-Log "艺术运动API测试通过" "SUCCESS"
} else {
    Write-Log "艺术运动API测试失败" "ERROR"
}

# 测试AI交互API
$aiInteractionApiWorking = Test-AiInteractionApi
if ($aiInteractionApiWorking) {
    Write-Log "AI交互API测试通过" "SUCCESS"
} else {
    Write-Log "AI交互API测试失败" "ERROR"
}

# 总结测试结果
$allTests = @($baseConnected, $docsAvailable, $artistsApiWorking, $artworksApiWorking, $artMovementsApiWorking, $aiInteractionApiWorking)
$passedTests = $allTests | Where-Object { $_ -eq $true } | Measure-Object | Select-Object -ExpandProperty Count

Write-Log "测试完成: $passedTests / $($allTests.Count) 通过" "INFO"

if ($passedTests -eq $allTests.Count) {
    Write-Log "所有API测试通过!" "SUCCESS"
    exit 0
} else {
    Write-Log "部分API测试失败" "WARNING"
    exit 1
} 