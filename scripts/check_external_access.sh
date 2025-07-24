#!/bin/bash

# Artism 外部访问检查脚本
# 检查服务是否正确配置为允许外部访问

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 图标定义
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"

echo -e "${BLUE}🌐 Artism 外部访问检查工具${NC}"
echo "=================================="

# 获取服务器 IP 地址
SERVER_IP=$(hostname -I | awk '{print $1}')
if [[ -z "$SERVER_IP" ]]; then
    echo -e "${WARNING} 无法自动获取服务器 IP，请手动检查"
    SERVER_IP="YOUR_SERVER_IP"
else
    echo -e "${INFO} 服务器 IP: ${SERVER_IP}"
fi

echo ""

# 检查端口监听状态
echo -e "${BLUE}🔍 端口监听检查${NC}"
echo "----------------------------------"

declare -A ARTISM_PORTS=(
    ["3100"]="AIDA Frontend"
    ["5273"]="Ismism Frontend"
    ["8000"]="Artism Backend API"
    ["5001"]="Ismism Backend API"
)

for port in "${!ARTISM_PORTS[@]}"; do
    service_name="${ARTISM_PORTS[$port]}"
    
    # 检查端口是否监听
    if netstat -tlnp 2>/dev/null | grep -q ":${port} "; then
        # 检查是否绑定到所有接口 (0.0.0.0)
        if netstat -tlnp 2>/dev/null | grep ":${port} " | grep -q "0.0.0.0:${port}"; then
            echo -e "${CHECK} 端口 ${port} (${service_name}): 正确绑定到所有接口"
        elif netstat -tlnp 2>/dev/null | grep ":${port} " | grep -q "127.0.0.1:${port}"; then
            echo -e "${WARNING} 端口 ${port} (${service_name}): 仅绑定到本地 (127.0.0.1)"
            echo -e "${INFO}   需要修改配置以允许外部访问"
        else
            echo -e "${INFO} 端口 ${port} (${service_name}): 监听中，检查绑定地址"
        fi
    else
        echo -e "${CROSS} 端口 ${port} (${service_name}): 未监听"
    fi
done

echo ""

# 检查防火墙状态
echo -e "${BLUE}🔥 防火墙状态检查${NC}"
echo "----------------------------------"

if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | head -n1)
    echo -e "${INFO} UFW 状态: ${UFW_STATUS}"
    
    if sudo ufw status 2>/dev/null | grep -q "Status: active"; then
        echo -e "${CHECK} 防火墙已启用"
        
        # 检查端口规则
        echo ""
        echo -e "${INFO} 已开放的端口:"
        for port in "${!ARTISM_PORTS[@]}"; do
            if sudo ufw status 2>/dev/null | grep -q "${port}"; then
                echo -e "${CHECK}   端口 ${port}: 已开放"
            else
                echo -e "${CROSS}   端口 ${port}: 未开放"
            fi
        done
    else
        echo -e "${WARNING} 防火墙未启用"
    fi
else
    echo -e "${INFO} UFW 未安装，检查其他防火墙工具..."
    
    # 检查 iptables
    if command -v iptables &> /dev/null; then
        echo -e "${INFO} 检测到 iptables"
    fi
fi

echo ""

# 检查服务配置
echo -e "${BLUE}⚙️ 服务配置检查${NC}"
echo "----------------------------------"

# 检查 Artism Backend 配置
if [[ -f "apps/artism-backend/.env" ]]; then
    API_HOST=$(grep "API_HOST=" apps/artism-backend/.env | cut -d'=' -f2)
    if [[ "$API_HOST" == "0.0.0.0" ]]; then
        echo -e "${CHECK} Artism Backend: 配置为允许外部访问 (API_HOST=0.0.0.0)"
    elif [[ "$API_HOST" == "127.0.0.1" || "$API_HOST" == "localhost" ]]; then
        echo -e "${WARNING} Artism Backend: 仅允许本地访问 (API_HOST=${API_HOST})"
        echo -e "${INFO}   建议修改 .env 文件: API_HOST=0.0.0.0"
    else
        echo -e "${INFO} Artism Backend: API_HOST=${API_HOST}"
    fi
else
    echo -e "${WARNING} 未找到 Artism Backend .env 文件"
fi

# 检查 Next.js 配置 (AIDA Frontend)
if [[ -f "apps/aida-frontend/next.config.js" ]]; then
    if grep -q "hostname.*0\.0\.0\.0\|hostname.*\*" apps/aida-frontend/next.config.js; then
        echo -e "${CHECK} AIDA Frontend: 配置为允许外部访问"
    else
        echo -e "${INFO} AIDA Frontend: 检查 next.config.js 配置"
    fi
fi

echo ""

# 网络连通性测试
echo -e "${BLUE}🌍 网络连通性测试${NC}"
echo "----------------------------------"

echo -e "${INFO} 测试外部访问 (从本机测试):"
for port in "${!ARTISM_PORTS[@]}"; do
    service_name="${ARTISM_PORTS[$port]}"
    
    if curl -s --connect-timeout 3 "http://${SERVER_IP}:${port}" > /dev/null 2>&1; then
        echo -e "${CHECK} http://${SERVER_IP}:${port} (${service_name}): 可访问"
    else
        echo -e "${CROSS} http://${SERVER_IP}:${port} (${service_name}): 无法访问"
    fi
done

echo ""

# 提供修复建议
echo -e "${BLUE}🔧 配置修复建议${NC}"
echo "----------------------------------"

echo -e "${INFO} 如果外部无法访问，请检查以下配置:"
echo ""
echo -e "${YELLOW}1. 服务绑定地址:${NC}"
echo "   - Artism Backend: 确保 .env 中 API_HOST=0.0.0.0"
echo "   - Next.js: 使用 next dev -H 0.0.0.0 或配置 next.config.js"
echo "   - Vite: 使用 --host 0.0.0.0 参数"
echo ""
echo -e "${YELLOW}2. 防火墙配置:${NC}"
echo "   - 运行: sudo bash scripts/enable_ports.sh"
echo "   - 或手动: sudo ufw allow 3100,5273,8000,5001"
echo ""
echo -e "${YELLOW}3. 云服务商安全组:${NC}"
echo "   - AWS: 在 EC2 安全组中开放端口"
echo "   - 阿里云: 在 ECS 安全组中开放端口"
echo "   - 腾讯云: 在 CVM 安全组中开放端口"
echo ""
echo -e "${YELLOW}4. 网络配置:${NC}"
echo "   - 确保服务器有公网 IP"
echo "   - 检查路由器端口转发 (如果在内网)"

echo ""
echo -e "${GREEN}🎯 外部访问地址:${NC}"
echo "----------------------------------"
for port in "${!ARTISM_PORTS[@]}"; do
    service_name="${ARTISM_PORTS[$port]}"
    echo -e "  ${service_name}: http://${SERVER_IP}:${port}"
done

echo ""
echo -e "${INFO} 使用 'sudo bash scripts/enable_ports.sh' 配置防火墙"
