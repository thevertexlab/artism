# Artism 全栈开发环境启动手册

## 🏗️ 架构概览

| 服务 | 技术栈 | 端口 | 数据库 | 启动顺序 |
|------|--------|------|--------|----------|
| MongoDB | Database | 27017 | - | 1 |
| Artism Backend | FastAPI/Python | 8000 | aida | 2 |
| AIDA Frontend | Next.js | 3000 | - | 3 |
| Ismism Backend | Express.js | 5001 | ismism-machine | 4 |
| Ismism Frontend | React+Vite | 5173 | - | 5 |

## 🖥️ 系统环境准备

### Mac 环境 (macOS)

#### 安装 Homebrew (如未安装)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 安装依赖软件
```bash
# 更新 Homebrew
brew update

# 安装 Node.js (包含 npm)
brew install node@18
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 安装 Python
brew install python@3.11
echo 'export PATH="/opt/homebrew/opt/python@3.11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 安装 MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community@7.0
```

#### 版本验证 (Mac)
```bash
node --version    # 应显示: v18.x.x
npm --version     # 应显示: 9.x.x 或更高
python3 --version # 应显示: Python 3.11.x
mongod --version  # 应显示: db version v7.0.x
```

### Ubuntu 环境 (Ubuntu 20.04+)

#### 更新系统包
```bash
sudo apt update && sudo apt upgrade -y
```

#### 安装 Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 安装 Python 3.11
```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-pip python3.11-venv
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1
```

#### 安装 MongoDB 7.0
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### 版本验证 (Ubuntu)
```bash
node --version    # 应显示: v18.x.x
npm --version     # 应显示: 9.x.x 或更高
python3 --version # 应显示: Python 3.11.x
mongod --version  # 应显示: db version v7.0.x
```

### 通用环境检查

#### 🚀 快速环境检查脚本
```bash
# 快速检查所有关键环境 (推荐)
bash scripts/quick_check.sh

# 详细环境检查 (包含完整诊断信息)
bash scripts/check_environment.sh
```

#### 手动端口占用检查
```bash
# 检查关键端口是否被占用
sudo lsof -i :27017,8000,3000,5001,5173
# 预期输出: 空 (无进程占用) 或仅显示已知服务
```

#### 项目目录验证
```bash
cd /path/to/artism
ls -la apps/
# 预期输出: aida-frontend  artism-backend  ismism-backend  ismism-frontend
```

## 🔧 项目配置

### 环境变量 (已配置完成)
- ✅ `apps/artism-backend/.env` - 已创建并配置
- ✅ `apps/artism-backend/.env.example` - 已同步更新
- ✅ `.gitignore` 已修改，`.env` 文件已纳入版本控制

### 依赖安装预检查

#### Python 依赖 (Artism Backend)
```bash
cd apps/artism-backend
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt
# 验证关键包
python3 -c "import fastapi, uvicorn, pymongo; print('Python dependencies OK')"
```

#### Node.js 依赖预检查
```bash
# 检查 npm 全局权限 (避免权限问题)
npm config get prefix
# Mac 预期: /opt/homebrew 或 /usr/local
# Ubuntu 预期: /usr 或 /usr/local
```

## 🚀 服务启动流程

### 1. 启动 MongoDB

#### Mac 启动
```bash
# 启动 MongoDB 服务
brew services start mongodb-community@7.0

# 验证启动
brew services list | grep mongodb
# 预期输出: mongodb-community@7.0 started
```

#### Ubuntu 启动
```bash
# 启动 MongoDB 服务
sudo systemctl start mongod
sudo systemctl enable mongod

# 验证启动
sudo systemctl status mongod
# 预期输出: Active: active (running)
```

#### 通用验证
```bash
# 测试连接
mongosh --eval "db.adminCommand('ping')"
# 预期输出: { ok: 1 }

# 检查端口监听
netstat -tlnp | grep :27017
# 预期输出: tcp 0.0.0.0:27017 LISTEN
```

### 2. 启动 Artism Backend (端口 8000)

#### 进入目录并安装依赖
```bash
cd apps/artism-backend

# 首次运行或依赖更新时
pip3 install -r requirements.txt
```

#### 启动服务
```bash
# Mac & Ubuntu 通用
python3 main.py

# 预期日志输出:
# ✅ Database initialized successfully
# INFO: Uvicorn running on http://0.0.0.0:8000
# AIDA API is running at: http://localhost:8000
```

#### 验证服务
```bash
# 新终端窗口执行
curl -s http://localhost:8000/api/docs | grep -q "Swagger" && echo "✅ Artism Backend OK" || echo "❌ Backend Failed"

# 检查 API 健康状态
curl -s http://localhost:8000/api/v1/artists | head -n 5
# 预期: JSON 响应或空数组 []
```

### 3. 启动 AIDA Frontend (端口 3000)

#### 进入目录并安装依赖
```bash
cd apps/aida-frontend

# 首次运行或依赖更新时
npm install
```

#### 启动服务
```bash
# Mac & Ubuntu 通用
npm run dev

# 预期日志输出:
# ▲ Next.js 14.x.x
# - Local: http://localhost:3000
# ✓ Ready in 2.3s
```

#### 验证服务
```bash
# 新终端窗口执行
curl -s http://localhost:3000 | grep -q "AIDA" && echo "✅ AIDA Frontend OK" || echo "❌ Frontend Failed"

# 检查页面标题
curl -s http://localhost:3000 | grep -o '<title>.*</title>'
```

### 4. 启动 Ismism Backend (端口 5001)

#### 进入目录并安装依赖
```bash
cd apps/ismism-backend

# 首次运行或依赖更新时
npm install
```

#### 启动服务
```bash
# Mac & Ubuntu 通用
npm run dev

# 预期日志输出:
# MongoDB Connected: localhost
# Server is running on port 5001
```

#### 验证服务
```bash
# 新终端窗口执行
curl -s http://localhost:5001/api | grep -q "movements\|timeline" && echo "✅ Ismism Backend OK" || echo "❌ Backend Failed"
```

### 5. 启动 Ismism Frontend (端口 5173)

#### 进入目录并安装依赖
```bash
cd apps/ismism-frontend

# 首次运行或依赖更新时
npm install
```

#### 启动服务
```bash
# Mac & Ubuntu 通用
npm run dev

# 预期日志输出:
# VITE v4.x.x ready in xxx ms
# ➜ Local: http://localhost:5173/
# ➜ Network: use --host to expose
```

#### 验证服务
```bash
# 新终端窗口执行
curl -s http://localhost:5173 | grep -q "Ismism\|timeline" && echo "✅ Ismism Frontend OK" || echo "❌ Frontend Failed"
```

## 🌐 访问地址和功能验证

| 服务 | URL | 功能验证 |
|------|-----|----------|
| AIDA Frontend | http://localhost:3000 | AI艺术家数据库界面 |
| AIDA API Docs | http://localhost:8000/api/docs | Swagger UI 可访问 |
| AIDA ReDoc | http://localhost:8000/api/redoc | ReDoc 文档可访问 |
| Ismism Frontend | http://localhost:5173 | 艺术流派时间线界面 |
| Ismism API | http://localhost:5001/api | 返回 API 端点列表 |

### 完整系统健康检查脚本
```bash
#!/bin/bash
echo "🔍 Artism 系统健康检查"
echo "========================"

# MongoDB
mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null && echo "✅ MongoDB: 运行正常" || echo "❌ MongoDB: 连接失败"

# Artism Backend
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/docs | grep -q "200" && echo "✅ Artism Backend: 运行正常" || echo "❌ Artism Backend: 服务异常"

# AIDA Frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200" && echo "✅ AIDA Frontend: 运行正常" || echo "❌ AIDA Frontend: 服务异常"

# Ismism Backend
curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api | grep -q "200" && echo "✅ Ismism Backend: 运行正常" || echo "❌ Ismism Backend: 服务异常"

# Ismism Frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200" && echo "✅ Ismism Frontend: 运行正常" || echo "❌ Ismism Frontend: 服务异常"

echo "========================"
echo "🎯 所有服务状态检查完成"
```

## 🔧 故障排除矩阵

### 常见问题 × 平台解决方案

| 问题 | Mac 解决方案 | Ubuntu 解决方案 | 通用验证 |
|------|-------------|----------------|----------|
| **MongoDB 连接失败** | `brew services restart mongodb-community@7.0` | `sudo systemctl restart mongod` | `mongosh --eval "db.adminCommand('ping')"` |
| **端口被占用** | `lsof -ti:端口号 \| xargs kill -9` | `sudo fuser -k 端口号/tcp` | `netstat -tlnp \| grep :端口号` |
| **Python 包安装失败** | `brew reinstall python@3.11` | `sudo apt install python3.11-dev` | `pip3 list \| grep fastapi` |
| **Node 权限错误** | `sudo chown -R $(whoami) /opt/homebrew` | `sudo chown -R $(whoami) ~/.npm` | `npm config get prefix` |
| **MongoDB 权限错误** | `sudo chown -R $(whoami) /opt/homebrew/var/mongodb` | `sudo chown -R mongodb:mongodb /var/lib/mongodb` | `ls -la /var/log/mongodb/` |
| **API CORS 错误** | 检查 `.env` 中 `ALLOWED_ORIGINS` | 检查 `.env` 中 `ALLOWED_ORIGINS` | `curl -H "Origin: http://localhost:3000" http://localhost:8000/api/v1/artists` |

### 日志查看方法

#### Mac 日志查看
```bash
# MongoDB 日志
tail -f /opt/homebrew/var/log/mongodb/mongo.log

# 应用日志 (在对应终端查看实时输出)
# 或使用 Console.app 查看系统日志
```

#### Ubuntu 日志查看
```bash
# MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log

# 系统服务日志
sudo journalctl -u mongod -f

# 应用日志 (在对应终端查看实时输出)
```

## 🛠️ 管理脚本

### 快速启动脚本 (start_all.sh)
```bash
#!/bin/bash
echo "🚀 启动 Artism 全栈服务"

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    echo "📱 检测到 macOS 环境"
    brew services start mongodb-community@7.0
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Ubuntu
    echo "🐧 检测到 Linux 环境"
    sudo systemctl start mongod
fi

echo "⏳ 等待 MongoDB 启动..."
sleep 3

# 启动后端服务 (后台运行)
echo "🔧 启动 Artism Backend..."
cd apps/artism-backend && python3 main.py &
ARTISM_PID=$!

echo "⏳ 等待后端启动..."
sleep 5

# 启动前端服务 (后台运行)
echo "🎨 启动 AIDA Frontend..."
cd ../aida-frontend && npm run dev &
AIDA_PID=$!

echo "🏛️ 启动 Ismism Backend..."
cd ../ismism-backend && npm run dev &
ISMISM_BACKEND_PID=$!

echo "🌐 启动 Ismism Frontend..."
cd ../ismism-frontend && npm run dev &
ISMISM_FRONTEND_PID=$!

echo "📝 进程 ID 记录:"
echo "Artism Backend: $ARTISM_PID"
echo "AIDA Frontend: $AIDA_PID"
echo "Ismism Backend: $ISMISM_BACKEND_PID"
echo "Ismism Frontend: $ISMISM_FRONTEND_PID"

echo "✅ 所有服务启动完成!"
echo "🌐 访问地址:"
echo "  - AIDA Frontend: http://localhost:3000"
echo "  - AIDA API Docs: http://localhost:8000/api/docs"
echo "  - Ismism Frontend: http://localhost:5173"
echo "  - Ismism API: http://localhost:5001/api"
```

### 停止所有服务脚本 (stop_all.sh)
```bash
#!/bin/bash
echo "🛑 停止 Artism 全栈服务"

# 停止应用进程
echo "🔧 停止应用服务..."
lsof -ti:3000,5173,8000,5001 | xargs kill -9 2>/dev/null

# 停止 MongoDB
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    brew services stop mongodb-community@7.0
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Ubuntu
    sudo systemctl stop mongod
fi

echo "✅ 所有服务已停止"
```

### 状态检查脚本 (check_status.sh)
```bash
#!/bin/bash
echo "📊 Artism 服务状态检查"
echo "======================"

# 检查端口占用
echo "🔍 端口占用情况:"
lsof -i :27017,8000,3000,5001,5173 | grep LISTEN

echo ""
echo "🌐 服务可访问性:"

# 检查各服务
services=("MongoDB:27017" "Artism Backend:8000" "AIDA Frontend:3000" "Ismism Backend:5001" "Ismism Frontend:5173")
urls=("" "http://localhost:8000/api/docs" "http://localhost:3000" "http://localhost:5001/api" "http://localhost:5173")

for i in "${!services[@]}"; do
    service="${services[$i]}"
    url="${urls[$i]}"

    if [[ -n "$url" ]]; then
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            echo "✅ $service - 运行正常"
        else
            echo "❌ $service - 服务异常"
        fi
    else
        # MongoDB 特殊检查
        if mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null | grep -q "1"; then
            echo "✅ $service - 运行正常"
        else
            echo "❌ $service - 连接失败"
        fi
    fi
done

echo "======================"
echo "📈 检查完成"
```

## 📋 完整启动验证清单

### 启动前检查
- [ ] 系统依赖已安装 (Node.js 18+, Python 3.11+, MongoDB 7.0+)
- [ ] 端口 27017, 8000, 3000, 5001, 5173 未被占用
- [ ] 项目目录结构完整
- [ ] 环境变量文件存在

### 启动过程检查
- [ ] MongoDB 启动成功，可连接
- [ ] Artism Backend 启动，API 文档可访问
- [ ] AIDA Frontend 启动，页面正常加载
- [ ] Ismism Backend 启动，API 响应正常
- [ ] Ismism Frontend 启动，页面正常加载

### 功能验证检查
- [ ] 前端可以调用后端 API
- [ ] 数据库连接正常
- [ ] 跨域配置正确
- [ ] 所有服务日志无错误

**预计启动时间**: 首次 8-15 分钟 (含依赖安装) | 后续 2-3 分钟
