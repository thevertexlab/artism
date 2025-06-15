# Artism Backend修复脚本
# 用于修复常见的启动和运行问题

param (
    [switch]$ForceUseMock = $false,
    [switch]$SkipInstall = $false,
    [switch]$CreateEnvFile = $false
)

$logFile = "fix_artism_backend.log"

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

function Install-Dependencies {
    if ($SkipInstall) {
        Write-Log "跳过依赖安装" "INFO"
        return $true
    }
    
    Write-Log "安装依赖..." "INFO"
    
    try {
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 安装依赖
        pip install -r requirements.txt
        
        Write-Log "依赖安装完成" "SUCCESS"
        return $true
    } catch {
        Write-Log "依赖安装失败: $_" "ERROR"
        return $false
    }
}

function Create-EnvFile {
    if (-not $CreateEnvFile) {
        Write-Log "跳过创建.env文件" "INFO"
        return $true
    }
    
    Write-Log "创建.env文件..." "INFO"
    
    try {
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 创建.env文件
        $envContent = @"
# API配置
API_HOST=0.0.0.0
API_PORT=8000

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/aida
DATABASE_NAME=aida
USE_MOCK_DB=True

# 安全配置
JWT_SECRET=your-secret-key-for-jwt

# OpenAI配置
OPENAI_API_KEY=
"@
        
        $envContent | Out-File -FilePath ".env" -Encoding utf8
        
        Write-Log ".env文件创建成功" "SUCCESS"
        return $true
    } catch {
        Write-Log ".env文件创建失败: $_" "ERROR"
        return $false
    }
}

function Fix-StartupScript {
    Write-Log "修复启动脚本..." "INFO"
    
    try {
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 修复startup.py
        $startupPath = "app/utils/startup.py"
        $startupContent = Get-Content -Path $startupPath -Raw
        
        # 检查是否已经修复
        if ($startupContent -match "except RuntimeError:") {
            Write-Log "启动脚本已经修复" "INFO"
        } else {
            # 替换run_startup函数
            $newRunStartup = @'
def run_startup():
    """
    运行启动序列（同步版本）
    """
    try:
        # 尝试使用asyncio.run
        return asyncio.run(startup_sequence())
    except RuntimeError:
        # 如果已经在事件循环中，则直接创建任务
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(startup_sequence())
'@
            
            $startupContent = $startupContent -replace "def run_startup\(\):[\s\S]*?return asyncio\.run\(startup_sequence\(\)\)", $newRunStartup
            
            # 保存修改后的文件
            $startupContent | Out-File -FilePath $startupPath -Encoding utf8
            
            Write-Log "启动脚本修复成功" "SUCCESS"
        }
        
        return $true
    } catch {
        Write-Log "启动脚本修复失败: $_" "ERROR"
        return $false
    }
}

function Fix-MongoDBClient {
    Write-Log "修复MongoDB客户端..." "INFO"
    
    try {
        # 切换到后端目录
        Set-Location -Path "apps/artism-backend"
        
        # 修复MongoDB客户端
        $mongodbPath = "app/db/mongodb/__init__.py"
        $mongodbContent = Get-Content -Path $mongodbPath -Raw
        
        # 检查是否已经修复
        if ($mongodbContent -match "mongomock") {
            Write-Log "MongoDB客户端已经支持mock模式" "INFO"
        } else {
            # 替换get_client函数
            $newGetClient = @'
def get_client():
    """
    获取 MongoDB 客户端实例（单例模式）
    如果环境变量USE_MOCK_DB=True，则使用mongomock
    """
    global _client
    if _client is None:
        use_mock = os.getenv("USE_MOCK_DB", "True").lower() == "true"
        if use_mock:
            print("Using mock MongoDB client")
            _client = mongomock.MongoClient()
        else:
            print(f"Connecting to MongoDB: {MONGODB_URI}")
            _client = pymongo.MongoClient(MONGODB_URI)
    return _client
'@
            
            # 添加导入
            $importStatement = "import pymongo\nimport os\nimport mongomock\nfrom app.core.config import MONGODB_URI, DATABASE_NAME"
            
            $mongodbContent = $mongodbContent -replace "import pymongo[\s\S]*?from app\.core\.config import.*", $importStatement
            $mongodbContent = $mongodbContent -replace "def get_client\(\):[\s\S]*?return _client", $newGetClient
            
            # 保存修改后的文件
            $mongodbContent | Out-File -FilePath $mongodbPath -Encoding utf8
            
            Write-Log "MongoDB客户端修复成功" "SUCCESS"
        }
        
        return $true
    } catch {
        Write-Log "MongoDB客户端修复失败: $_" "ERROR"
        return $false
    }
}

function Start-ArtismBackend {
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
        Start-Process -FilePath "python" -ArgumentList "main.py" -NoNewWindow
        
        Write-Log "Artism Backend启动成功" "SUCCESS"
        return $true
    } catch {
        Write-Log "Artism Backend启动失败: $_" "ERROR"
        return $false
    }
}

# 主程序
Write-Log "Artism Backend修复脚本启动" "INFO"

# 安装依赖
$dependenciesInstalled = Install-Dependencies
if (-not $dependenciesInstalled) {
    Write-Log "依赖安装失败，无法继续" "ERROR"
    exit 1
}

# 创建.env文件
$envCreated = Create-EnvFile
if (-not $envCreated) {
    Write-Log ".env文件创建失败，继续执行" "WARNING"
}

# 修复启动脚本
$startupFixed = Fix-StartupScript
if (-not $startupFixed) {
    Write-Log "启动脚本修复失败，无法继续" "ERROR"
    exit 1
}

# 修复MongoDB客户端
$mongodbFixed = Fix-MongoDBClient
if (-not $mongodbFixed) {
    Write-Log "MongoDB客户端修复失败，无法继续" "ERROR"
    exit 1
}

# 启动Artism Backend
$backendStarted = Start-ArtismBackend
if (-not $backendStarted) {
    Write-Log "Artism Backend启动失败" "ERROR"
    exit 1
}

Write-Log "修复完成，Artism Backend正在运行" "SUCCESS" 