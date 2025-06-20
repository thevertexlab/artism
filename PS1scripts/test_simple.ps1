# 简单测试脚本

Write-Host "测试脚本开始执行"

# 测试基本功能
$baseUrl = "http://localhost:8000"
$endpoint = "/api/v1/test"
$url = "$baseUrl$endpoint"

Write-Host "测试URL: $url"

try {
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "响应状态码: $($response.StatusCode)"
    
    if ($response.StatusCode -eq 200) {
        Write-Host "测试成功" -ForegroundColor Green
    } else {
        Write-Host "测试失败: 状态码不是200" -ForegroundColor Red
    }
} catch {
    Write-Host "测试失败: $_" -ForegroundColor Red
}

Write-Host "测试脚本执行完成" 