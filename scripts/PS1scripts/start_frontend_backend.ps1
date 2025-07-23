# Artism 前后端同时启动脚本

$logFile = "artism_full_stack.log"

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

function Start-Backend {
    Write-Log "启动Artism Backend..." "INFO"
    
    try {
        # 切换到项目根目录
        Set-Location -Path ".."
        
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 设置环境变量
        $env:USE_MOCK_DB = "True"
        Write-Log "使用Mock数据库" "INFO"
        
        # 启动服务
        Write-Log "执行命令: python main.py" "INFO"
        Start-Process -FilePath "python" -ArgumentList "main.py" -NoNewWindow
        
        Write-Log "Artism Backend启动成功" "SUCCESS"
        return $true
    } catch {
        Write-Log "Artism Backend启动失败: $_" "ERROR"
        return $false
    } finally {
        # 返回到脚本目录
        Set-Location -Path "$PSScriptRoot"
    }
}

function Start-Frontend {
    Write-Log "启动AIDA Frontend..." "INFO"
    
    try {
        # 切换到项目根目录
        Set-Location -Path ".."
        
        # 切换到前端目录
        Set-Location -Path "apps/aida-frontend"
        
        # 启动服务
        Write-Log "执行命令: npm run dev" "INFO"
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
        
        Write-Log "AIDA Frontend启动成功" "SUCCESS"
        return $true
    } catch {
        Write-Log "AIDA Frontend启动失败: $_" "ERROR"
        return $false
    } finally {
        # 返回到脚本目录
        Set-Location -Path "$PSScriptRoot"
    }
}

# 主程序
Clear-Host
Write-Log "Artism 全栈启动工具" "INFO"

# 启动后端
$backendResult = Start-Backend

if (-not $backendResult) {
    Write-Log "后端启动失败，是否继续启动前端？(Y/N)" "WARNING"
    $continue = Read-Host
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Log "操作取消" "INFO"
        exit
    }
}

# 等待几秒确保后端启动
Start-Sleep -Seconds 3

# 启动前端
$frontendResult = Start-Frontend

if (-not $frontendResult) {
    Write-Log "前端启动失败" "ERROR"
} else {
    Write-Log "前后端均已成功启动" "SUCCESS"
    Write-Log "后端API地址: http://localhost:8000" "INFO"
    Write-Log "前端地址: http://localhost:3000" "INFO"
}

Write-Log "按任意键退出脚本..." "INFO"
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 