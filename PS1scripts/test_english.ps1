# Simple Test Script

Write-Host "Testing script execution"

# Test basic functionality
$baseUrl = "http://localhost:8000"
$endpoint = "/api/v1/test"
$url = "$baseUrl$endpoint"

Write-Host "Testing URL: $url"

try {
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "Response status code: $($response.StatusCode)"
    
    if ($response.StatusCode -eq 200) {
        Write-Host "Test successful" -ForegroundColor Green
    } else {
        Write-Host "Test failed: Status code is not 200" -ForegroundColor Red
    }
} catch {
    Write-Host "Test failed: $_" -ForegroundColor Red
}

Write-Host "Script execution completed" 