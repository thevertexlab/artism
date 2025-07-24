#!/bin/bash

# Artism 快速环境检查脚本
# 简化版本，快速检查关键环境

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}⚡ Artism 快速环境检查${NC}"
echo "========================"

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 检查计数器
PASS=0
TOTAL=0

# 检查函数
check_item() {
    local name="$1"
    local command="$2"
    local expected="$3"
    
    TOTAL=$((TOTAL + 1))
    
    if eval "$command" &> /dev/null; then
        echo -e "✅ $name"
        PASS=$((PASS + 1))
    else
        echo -e "❌ $name"
    fi
}

# 系统检查
echo "🖥️  系统环境:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "   macOS $(sw_vers -productVersion)"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "   Linux $(uname -r)"
fi

echo ""
echo "🛠️  依赖软件:"

# Node.js 检查
check_item "Node.js (>=18)" "node --version | grep -E 'v1[8-9]|v[2-9][0-9]'"

# Python 检查  
check_item "Python3 (>=3.9)" "python3 --version | grep -E 'Python 3\.(9|1[0-9])'"

# MongoDB 检查
check_item "MongoDB" "command -v mongod"

# MongoDB 连接检查
echo -n "   MongoDB 连接: "
ARTISM_ENV="${PROJECT_ROOT}/apps/artism-backend/.env"
if [ -f "$ARTISM_ENV" ]; then
    MONGODB_URI_FROM_ENV=$(grep "MONGODB_URI=" "$ARTISM_ENV" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    echo -n "(${MONGODB_URI_FROM_ENV}) "
fi

if mongosh --quiet --eval 'db.adminCommand("ping").ok' --serverSelectionTimeoutMS 3000 2>/dev/null | grep -q '1'; then
    echo -e "✅"
    PASS=$((PASS + 1))
else
    echo -e "❌ (运行详细检查获取更多信息)"
fi
TOTAL=$((TOTAL + 1))

echo ""
echo "📝 配置文件:"

# .env 文件检查
check_item "Artism Backend .env" "test -f '${PROJECT_ROOT}/apps/artism-backend/.env'"

echo ""
echo "🔌 端口状态:"

# 端口检查
PORTS=(27017 8000 3100 5001 5273)
for port in "${PORTS[@]}"; do
    if lsof -i :$port &> /dev/null; then
        echo -e "⚠️  端口 $port: 被占用"
    else
        echo -e "✅ 端口 $port: 可用"
    fi
done

echo ""
echo "========================"
echo -e "📊 检查结果: ${GREEN}${PASS}/${TOTAL}${NC} 项通过"

if [ $PASS -eq $TOTAL ]; then
    echo -e "${GREEN}🎉 环境检查全部通过！可以启动服务${NC}"
    echo ""
    echo "🚀 启动命令:"
    echo "   bash scripts/start_all.sh"
else
    echo -e "${YELLOW}⚠️  存在问题，请运行详细检查:${NC}"
    echo "   bash scripts/check_environment.sh"
fi
