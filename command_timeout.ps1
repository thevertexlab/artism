param (
    [Parameter(Mandatory=$true)]
    [string]$Command,
    
    [Parameter(Mandatory=$false)]
    [int]$TimeoutSeconds = 60
)

# 显示将要执行的命令
Write-Host "执行命令: $Command" -ForegroundColor Cyan
Write-Host "超时设置: $TimeoutSeconds 秒" -ForegroundColor Cyan

# 创建任务来执行命令
$job = Start-Job -ScriptBlock {
    param($cmd)
    Invoke-Expression $cmd
} -ArgumentList $Command

# 等待任务完成或超时
$completed = Wait-Job -Job $job -Timeout $TimeoutSeconds

# 检查是否超时
if ($completed -eq $null) {
    Write-Host "命令执行超时 ($TimeoutSeconds 秒)，正在终止..." -ForegroundColor Red
    Stop-Job -Job $job
    Remove-Job -Job $job -Force
    exit 1
} else {
    # 获取并显示结果
    $result = Receive-Job -Job $job
    Write-Output $result
    Remove-Job -Job $job
    exit 0
} 