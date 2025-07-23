#!/bin/bash

# Artism 环境检查脚本
# 检查系统环境、依赖版本、数据库连接、配置文件等

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 图标定义
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"

echo -e "${BLUE}🔍 Artism 环境检查工具${NC}"
echo "=================================="

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${INFO} 项目根目录: ${PROJECT_ROOT}"
echo ""

# 1. 系统信息检查
echo -e "${BLUE}📱 系统信息${NC}"
echo "----------------------------------"

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    OS_VERSION=$(sw_vers -productVersion)
    echo -e "${CHECK} 操作系统: ${OS} ${OS_VERSION}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS_VERSION="$NAME $VERSION"
    else
        OS_VERSION="Unknown Linux"
    fi
    echo -e "${CHECK} 操作系统: ${OS_VERSION}"
else
    echo -e "${CROSS} 不支持的操作系统: $OSTYPE"
    OS="Unknown"
fi

# 检查架构
ARCH=$(uname -m)
echo -e "${CHECK} 系统架构: ${ARCH}"
echo ""

# 2. 依赖软件版本检查
echo -e "${BLUE}🛠️ 依赖软件版本${NC}"
echo "----------------------------------"

# 检查 Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${CHECK} Node.js: ${NODE_VERSION} (满足要求 >=18.x)"
    else
        echo -e "${WARNING} Node.js: ${NODE_VERSION} (建议升级到 >=18.x)"
    fi
else
    echo -e "${CROSS} Node.js: 未安装"
fi

# 检查 npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${CHECK} npm: v${NPM_VERSION}"
else
    echo -e "${CROSS} npm: 未安装"
fi

# 检查 Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    if [ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -ge 9 ]; then
        echo -e "${CHECK} Python: ${PYTHON_VERSION} (满足要求 >=3.9)"
    else
        echo -e "${WARNING} Python: ${PYTHON_VERSION} (建议升级到 >=3.9)"
    fi
else
    echo -e "${CROSS} Python3: 未安装"
fi

# 检查 pip
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
    echo -e "${CHECK} pip3: ${PIP_VERSION}"
else
    echo -e "${CROSS} pip3: 未安装"
fi

echo ""

# 3. MongoDB 连接检查
echo -e "${BLUE}🗄️ MongoDB 连接检查${NC}"
echo "----------------------------------"

# 检查 MongoDB 是否安装
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n1 | grep -o 'v[0-9]\+\.[0-9]\+\.[0-9]\+')
    echo -e "${CHECK} MongoDB 已安装: ${MONGO_VERSION}"
    
    # 检查 MongoDB 服务状态
    if [[ "$OS" == "macOS" ]]; then
        if brew services list | grep mongodb-community | grep -q started; then
            echo -e "${CHECK} MongoDB 服务: 运行中 (Homebrew)"
        else
            echo -e "${WARNING} MongoDB 服务: 未运行 (使用 'brew services start mongodb-community@7.0' 启动)"
        fi
    elif [[ "$OS" == "Linux"* ]]; then
        if systemctl is-active --quiet mongod; then
            echo -e "${CHECK} MongoDB 服务: 运行中 (systemd)"
        else
            echo -e "${WARNING} MongoDB 服务: 未运行 (使用 'sudo systemctl start mongod' 启动)"
        fi
    fi
    
    # 测试 MongoDB 连接
    if command -v mongosh &> /dev/null; then
        if mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null | grep -q "1"; then
            echo -e "${CHECK} MongoDB 连接: 成功 (localhost:27017)"
        else
            echo -e "${CROSS} MongoDB 连接: 失败 (请检查服务是否启动)"
        fi
    else
        echo -e "${WARNING} mongosh: 未安装，无法测试连接"
    fi
else
    echo -e "${CROSS} MongoDB: 未安装"
fi

echo ""

# 4. Nginx 检查
echo -e "${BLUE}🌐 Nginx 检查${NC}"
echo "----------------------------------"

if command -v nginx &> /dev/null; then
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    echo -e "${CHECK} Nginx 已安装: ${NGINX_VERSION}"
    
    # 检查 Nginx 服务状态
    if [[ "$OS" == "macOS" ]]; then
        if brew services list | grep nginx | grep -q started; then
            echo -e "${CHECK} Nginx 服务: 运行中 (Homebrew)"
        else
            echo -e "${INFO} Nginx 服务: 未运行 (可选服务)"
        fi
    elif [[ "$OS" == "Linux"* ]]; then
        if systemctl is-active --quiet nginx; then
            echo -e "${CHECK} Nginx 服务: 运行中 (systemd)"
        else
            echo -e "${INFO} Nginx 服务: 未运行 (可选服务)"
        fi
    fi
else
    echo -e "${INFO} Nginx: 未安装 (可选组件，用于生产环境反向代理)"
fi

echo ""

# 5. 环境配置文件检查
echo -e "${BLUE}📝 环境配置文件检查${NC}"
echo "----------------------------------"

# 检查 Artism Backend .env 文件
ARTISM_ENV="${PROJECT_ROOT}/apps/artism-backend/.env"
if [ -f "$ARTISM_ENV" ]; then
    echo -e "${CHECK} Artism Backend .env: 存在"
    
    # 检查关键配置项
    if grep -q "MONGODB_URI=" "$ARTISM_ENV"; then
        MONGODB_URI=$(grep "MONGODB_URI=" "$ARTISM_ENV" | cut -d'=' -f2)
        echo -e "${INFO}   MongoDB URI: ${MONGODB_URI}"
    fi
    
    if grep -q "API_PORT=" "$ARTISM_ENV"; then
        API_PORT=$(grep "API_PORT=" "$ARTISM_ENV" | cut -d'=' -f2)
        echo -e "${INFO}   API 端口: ${API_PORT}"
    fi
    
    if grep -q "USE_MOCK_DB=" "$ARTISM_ENV"; then
        USE_MOCK_DB=$(grep "USE_MOCK_DB=" "$ARTISM_ENV" | cut -d'=' -f2)
        if [ "$USE_MOCK_DB" = "True" ]; then
            echo -e "${WARNING}   数据库模式: Mock (开发模式)"
        else
            echo -e "${CHECK}   数据库模式: 真实 MongoDB"
        fi
    fi
else
    echo -e "${CROSS} Artism Backend .env: 不存在"
    echo -e "${INFO}   位置: ${ARTISM_ENV}"
fi

# 检查 .env.example 文件
ARTISM_ENV_EXAMPLE="${PROJECT_ROOT}/apps/artism-backend/.env.example"
if [ -f "$ARTISM_ENV_EXAMPLE" ]; then
    echo -e "${CHECK} Artism Backend .env.example: 存在"
else
    echo -e "${WARNING} Artism Backend .env.example: 不存在"
fi

echo ""

# 6. 端口占用检查
echo -e "${BLUE}🔌 端口占用检查${NC}"
echo "----------------------------------"

PORTS=(27017 8000 3000 5001 5173)
PORT_NAMES=("MongoDB" "Artism Backend" "AIDA Frontend" "Ismism Backend" "Ismism Frontend")

for i in "${!PORTS[@]}"; do
    PORT=${PORTS[$i]}
    NAME=${PORT_NAMES[$i]}
    
    if lsof -i :$PORT &> /dev/null; then
        PROCESS=$(lsof -i :$PORT | tail -n1 | awk '{print $1 " (PID: " $2 ")"}')
        echo -e "${WARNING} 端口 ${PORT} (${NAME}): 被占用 - ${PROCESS}"
    else
        echo -e "${CHECK} 端口 ${PORT} (${NAME}): 可用"
    fi
done

echo ""

# 7. 项目目录结构检查
echo -e "${BLUE}📁 项目目录结构检查${NC}"
echo "----------------------------------"

REQUIRED_DIRS=(
    "apps/artism-backend"
    "apps/aida-frontend"
    "apps/ismism-backend"
    "apps/ismism-frontend"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    FULL_PATH="${PROJECT_ROOT}/${dir}"
    if [ -d "$FULL_PATH" ]; then
        echo -e "${CHECK} ${dir}: 存在"
        
        # 检查关键文件
        case $dir in
            "apps/artism-backend")
                [ -f "${FULL_PATH}/main.py" ] && echo -e "${INFO}   ├── main.py: 存在" || echo -e "${CROSS}   ├── main.py: 缺失"
                [ -f "${FULL_PATH}/requirements.txt" ] && echo -e "${INFO}   └── requirements.txt: 存在" || echo -e "${CROSS}   └── requirements.txt: 缺失"
                ;;
            "apps/aida-frontend"|"apps/ismism-frontend")
                [ -f "${FULL_PATH}/package.json" ] && echo -e "${INFO}   ├── package.json: 存在" || echo -e "${CROSS}   ├── package.json: 缺失"
                [ -d "${FULL_PATH}/node_modules" ] && echo -e "${INFO}   └── node_modules: 存在" || echo -e "${WARNING}   └── node_modules: 不存在 (需要运行 npm install)"
                ;;
            "apps/ismism-backend")
                [ -f "${FULL_PATH}/package.json" ] && echo -e "${INFO}   ├── package.json: 存在" || echo -e "${CROSS}   ├── package.json: 缺失"
                [ -f "${FULL_PATH}/app.js" ] && echo -e "${INFO}   └── app.js: 存在" || echo -e "${CROSS}   └── app.js: 缺失"
                ;;
        esac
    else
        echo -e "${CROSS} ${dir}: 不存在"
    fi
done

echo ""

# 8. 总结和建议
echo -e "${BLUE}📋 检查总结${NC}"
echo "=================================="

echo -e "${INFO} 环境检查完成！"
echo ""
echo -e "${YELLOW}💡 下一步建议:${NC}"

# 根据检查结果给出建议
if ! command -v node &> /dev/null; then
    echo -e "   1. 安装 Node.js 18+ (https://nodejs.org/)"
fi

if ! command -v python3 &> /dev/null; then
    echo -e "   2. 安装 Python 3.9+ (https://python.org/)"
fi

if ! command -v mongod &> /dev/null; then
    echo -e "   3. 安装 MongoDB 7.0+ (https://mongodb.com/)"
fi

if [ ! -f "$ARTISM_ENV" ]; then
    echo -e "   4. 创建 .env 文件: cp apps/artism-backend/.env.example apps/artism-backend/.env"
fi

echo -e "   5. 参考 STARTUP_MANUAL.md 启动所有服务"
echo ""
echo -e "${GREEN}🚀 准备就绪后，运行以下命令启动服务:${NC}"
echo -e "   bash scripts/start_all.sh"
