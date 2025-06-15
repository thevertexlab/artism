# Artism Backend启动脚本
# 整合所有功能，提供简单的启动方式

param (
    [switch]$FixOnly = $false,
    [switch]$TestOnly = $false,
    [switch]$MonitorOnly = $false,
    [switch]$ForceUseMock = $false,
    [switch]$SkipInstall = $false,
    [switch]$CreateEnvFile = $false,
    [switch]$Verbose = $false
)

$logFile = "artism_backend.log"

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

function Show-Menu {
    Clear-Host
    Write-Host "===== Artism Backend 管理工具 =====" -ForegroundColor Cyan
    Write-Host
    Write-Host "1. 启动服务" -ForegroundColor Green
    Write-Host "2. 修复问题" -ForegroundColor Yellow
    Write-Host "3. 测试API" -ForegroundColor Blue
    Write-Host "4. 监控服务" -ForegroundColor Magenta
    Write-Host "5. 全部执行（修复 -> 启动 -> 测试 -> 监控）" -ForegroundColor Cyan
    Write-Host "0. 退出" -ForegroundColor Red
    Write-Host
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host
    
    $choice = Read-Host "请选择操作"
    return $choice
}

function Start-Backend {
    Write-Log "启动Artism Backend..." "INFO"
    
    try {
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 设置环境变量
        if ($ForceUseMock) {
            $env:USE_MOCK_DB = "True"
            Write-Log "强制使用Mock数据库" "INFO"
        }
        
        # 启动服务
        Write-Log "执行命令: python main.py" "INFO"
        Start-Process -FilePath "python" -ArgumentList "main.py" -NoNewWindow
        
        Write-Log "Artism Backend启动成功" "SUCCESS"
        return $true
    } catch {
        Write-Log "Artism Backend启动失败: $_" "ERROR"
        return $false
    }
}

function Fix-Backend {
    Write-Log "修复Artism Backend..." "INFO"
    
    try {
        # 执行修复脚本
        $params = @()
        if ($ForceUseMock) { $params += "-ForceUseMock" }
        if ($SkipInstall) { $params += "-SkipInstall" }
        if ($CreateEnvFile) { $params += "-CreateEnvFile" }
        
        $paramString = $params -join " "
        
        Write-Log "执行命令: .\fix_artism_backend.ps1 $paramString" "INFO"
        & ".\fix_artism_backend.ps1" @params
        
        Write-Log "Artism Backend修复完成" "SUCCESS"
        return $true
    } catch {
        Write-Log "Artism Backend修复失败: $_" "ERROR"
        return $false
    }
}

function Test-Backend {
    Write-Log "测试Artism Backend API..." "INFO"
    
    try {
        # 执行测试脚本
        $params = @()
        if ($Verbose) { $params += "-Verbose" }
        
        $paramString = $params -join " "
        
        Write-Log "执行命令: .\test_api_endpoints.ps1 $paramString" "INFO"
        & ".\test_api_endpoints.ps1" @params
        
        Write-Log "Artism Backend API测试完成" "SUCCESS"
        return $true
    } catch {
        Write-Log "Artism Backend API测试失败: $_" "ERROR"
        return $false
    }
}

function Monitor-Backend {
    Write-Log "监控Artism Backend..." "INFO"
    
    try {
        # 执行监控脚本
        Write-Log "执行命令: .\cursor_monitor.ps1" "INFO"
        & ".\cursor_monitor.ps1"
        
        return $true
    } catch {
        Write-Log "Artism Backend监控失败: $_" "ERROR"
        return $false
    }
}

function Execute-All {
    Write-Log "执行完整流程..." "INFO"
    
    # 修复
    $fixResult = Fix-Backend
    if (-not $fixResult) {
        Write-Log "修复失败，无法继续" "ERROR"
        return $false
    }
    
    # 启动
    $startResult = Start-Backend
    if (-not $startResult) {
        Write-Log "启动失败，无法继续" "ERROR"
        return $false
    }
    
    # 等待服务启动
    Write-Log "等待服务启动..." "INFO"
    Start-Sleep -Seconds 5
    
    # 测试
    $testResult = Test-Backend
    if (-not $testResult) {
        Write-Log "测试失败，继续监控" "WARNING"
    }
    
    # 监控
    Monitor-Backend
    
    return $true
}

# 主程序
Write-Log "Artism Backend管理工具启动" "INFO"

# 根据参数执行特定功能
if ($FixOnly) {
    Fix-Backend
    exit
}

if ($TestOnly) {
    Test-Backend
    exit
}

if ($MonitorOnly) {
    Monitor-Backend
    exit
}

# 显示菜单
if (-not ($FixOnly -or $TestOnly -or $MonitorOnly)) {
    $choice = Show-Menu
    
    switch ($choice) {
        "1" { Start-Backend }
        "2" { Fix-Backend }
        "3" { Test-Backend }
        "4" { Monitor-Backend }
        "5" { Execute-All }
        "0" { exit }
        default { Write-Log "无效选择" "ERROR" }
    }
} 