#!/bin/bash

# Artism 端口开放脚本 - Ubuntu 防火墙配置
# 用于在 Ubuntu 服务器上开放 Artism 服务所需的端口

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

echo -e "${BLUE}🔥 Artism 端口开放配置工具${NC}"
echo "=================================="

# 检查是否为 root 用户或有 sudo 权限
if [[ $EUID -eq 0 ]]; then
    SUDO=""
    echo -e "${INFO} 检测到 root 用户"
elif sudo -n true 2>/dev/null; then
    SUDO="sudo"
    echo -e "${INFO} 检测到 sudo 权限"
else
    echo -e "${CROSS} 需要 root 权限或 sudo 权限来配置防火墙"
    echo "请使用: sudo bash scripts/enable_ports.sh"
    exit 1
fi

# 检查操作系统
if [[ ! -f /etc/os-release ]]; then
    echo -e "${CROSS} 无法检测操作系统版本"
    exit 1
fi

. /etc/os-release
if [[ "$ID" != "ubuntu" ]]; then
    echo -e "${WARNING} 此脚本专为 Ubuntu 设计，当前系统: $PRETTY_NAME"
    echo -e "${INFO} 继续执行可能需要手动调整..."
fi

echo -e "${INFO} 操作系统: $PRETTY_NAME"
echo ""

# Artism 服务端口配置
declare -A ARTISM_PORTS=(
    ["3100"]="AIDA Frontend"
    ["5273"]="Ismism Frontend"
    ["8000"]="Artism Backend API"
    ["5001"]="Ismism Backend API"
)

# MongoDB 端口 (可选)
MONGODB_PORT="27017"

# 检查 ufw 是否安装
echo -e "${BLUE}📦 检查防火墙工具${NC}"
echo "----------------------------------"

if ! command -v ufw &> /dev/null; then
    echo -e "${WARNING} ufw 未安装，正在安装..."
    $SUDO apt update
    $SUDO apt install -y ufw
    echo -e "${CHECK} ufw 安装完成"
else
    echo -e "${CHECK} ufw 已安装"
fi

# 检查 ufw 状态
UFW_STATUS=$($SUDO ufw status | head -n1)
echo -e "${INFO} 防火墙状态: $UFW_STATUS"
echo ""

# 询问用户配置选项
echo -e "${BLUE}🔧 配置选项${NC}"
echo "----------------------------------"

# 是否开放 MongoDB 端口
echo -e "${WARNING} 是否开放 MongoDB 端口 (27017)？"
echo "  [y] 是 - 允许外部访问数据库 (不推荐用于生产环境)"
echo "  [n] 否 - 仅本地访问 (推荐)"
read -p "请选择 [y/N]: " OPEN_MONGODB
OPEN_MONGODB=${OPEN_MONGODB:-n}

# 是否限制特定 IP
echo ""
echo -e "${INFO} 是否限制特定 IP 地址访问？"
echo "  [y] 是 - 仅允许指定 IP 访问"
echo "  [n] 否 - 允许所有 IP 访问"
read -p "请选择 [y/N]: " RESTRICT_IP
RESTRICT_IP=${RESTRICT_IP:-n}

ALLOWED_IPS=""
if [[ "$RESTRICT_IP" =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${INFO} 请输入允许访问的 IP 地址 (多个 IP 用空格分隔):"
    echo "  例如: 192.168.1.100 10.0.0.50"
    read -p "IP 地址: " ALLOWED_IPS
fi

echo ""
echo -e "${BLUE}🚀 开始配置防火墙${NC}"
echo "----------------------------------"

# 备份当前 ufw 规则
echo -e "${INFO} 备份当前防火墙规则..."
$SUDO ufw --force reset > /dev/null 2>&1 || true

# 设置默认策略
echo -e "${INFO} 设置默认策略..."
$SUDO ufw default deny incoming
$SUDO ufw default allow outgoing

# 允许 SSH (重要!)
echo -e "${CHECK} 允许 SSH 连接 (端口 22)"
$SUDO ufw allow ssh

# 开放 Artism 服务端口
echo -e "${INFO} 开放 Artism 服务端口..."

for port in "${!ARTISM_PORTS[@]}"; do
    service_name="${ARTISM_PORTS[$port]}"
    
    if [[ -n "$ALLOWED_IPS" ]]; then
        # 限制特定 IP 访问
        for ip in $ALLOWED_IPS; do
            $SUDO ufw allow from "$ip" to any port "$port"
            echo -e "${CHECK} 端口 $port ($service_name) - 允许 IP: $ip"
        done
    else
        # 允许所有 IP 访问
        $SUDO ufw allow "$port"
        echo -e "${CHECK} 端口 $port ($service_name) - 允许所有 IP"
    fi
done

# 处理 MongoDB 端口
if [[ "$OPEN_MONGODB" =~ ^[Yy]$ ]]; then
    if [[ -n "$ALLOWED_IPS" ]]; then
        for ip in $ALLOWED_IPS; do
            $SUDO ufw allow from "$ip" to any port "$MONGODB_PORT"
            echo -e "${WARNING} 端口 $MONGODB_PORT (MongoDB) - 允许 IP: $ip"
        done
    else
        $SUDO ufw allow "$MONGODB_PORT"
        echo -e "${WARNING} 端口 $MONGODB_PORT (MongoDB) - 允许所有 IP"
    fi
    echo -e "${WARNING} 注意: MongoDB 端口已开放，请确保数据库安全配置！"
else
    echo -e "${INFO} 跳过 MongoDB 端口 (仅本地访问)"
fi

# 启用防火墙
echo ""
echo -e "${INFO} 启用防火墙..."
$SUDO ufw --force enable

echo ""
echo -e "${GREEN}${CHECK} 防火墙配置完成！${NC}"
echo ""

# 显示当前规则
echo -e "${BLUE}📋 当前防火墙规则${NC}"
echo "----------------------------------"
$SUDO ufw status numbered

echo ""
echo -e "${BLUE}🌐 Artism 服务访问地址${NC}"
echo "----------------------------------"

# 获取服务器 IP 地址
SERVER_IP=$(hostname -I | awk '{print $1}')
if [[ -z "$SERVER_IP" ]]; then
    SERVER_IP="YOUR_SERVER_IP"
fi

echo -e "${CHECK} 服务器 IP: ${SERVER_IP}"
echo ""
echo "外部访问地址:"
for port in "${!ARTISM_PORTS[@]}"; do
    service_name="${ARTISM_PORTS[$port]}"
    echo -e "  ${service_name}: http://${SERVER_IP}:${port}"
done

if [[ "$OPEN_MONGODB" =~ ^[Yy]$ ]]; then
    echo -e "  MongoDB: mongodb://${SERVER_IP}:${MONGODB_PORT}"
fi

echo ""
echo -e "${BLUE}📝 重要提醒${NC}"
echo "----------------------------------"
echo -e "${WARNING} 1. 确保 Artism 服务绑定到 0.0.0.0 而不是 127.0.0.1"
echo -e "${WARNING} 2. 检查云服务商的安全组设置 (AWS/阿里云/腾讯云等)"
echo -e "${WARNING} 3. 考虑使用 HTTPS 和域名进行生产部署"
echo -e "${INFO} 4. 使用 'sudo ufw status' 查看防火墙状态"
echo -e "${INFO} 5. 使用 'sudo ufw delete [规则号]' 删除特定规则"

echo ""
echo -e "${GREEN}🎉 配置完成！现在可以通过外部 IP 访问 Artism 服务了${NC}"
