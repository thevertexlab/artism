#!/bin/bash

# Artism 一键部署脚本
# 自动拉取最新代码并重启所有服务

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 图标定义
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"

# 获取脚本所在目录（项目根目录）
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_LOG="${PROJECT_ROOT}/deploy.log"

# 日志函数
log() {
    echo -e "$1" | tee -a "$DEPLOY_LOG"
}

log_info() {
    log "${INFO} $1"
}

log_success() {
    log "${CHECK} $1"
}

log_warning() {
    log "${WARNING} $1"
}

log_error() {
    log "${CROSS} $1"
}

# 开始部署
echo ""
log "${BLUE}${ROCKET} Artism 一键部署开始${NC}"
log "=================================="
log "${INFO} 部署时间: $(date)"
log "${INFO} 项目目录: ${PROJECT_ROOT}"
echo ""

# 1. 检查 Git 状态
log "${BLUE}📋 检查 Git 状态${NC}"
log "----------------------------------"

if [[ ! -d ".git" ]]; then
    log_error "当前目录不是 Git 仓库"
    exit 1
fi

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
log_info "当前分支: ${CURRENT_BRANCH}"

if [[ "$CURRENT_BRANCH" != "main" ]]; then
    log_warning "当前不在 main 分支，是否切换到 main 分支？ [y/N]"
    read -p "请选择: " SWITCH_BRANCH
    if [[ "$SWITCH_BRANCH" =~ ^[Yy]$ ]]; then
        log_info "切换到 main 分支..."
        git checkout main
        log_success "已切换到 main 分支"
    else
        log_info "继续在当前分支 ${CURRENT_BRANCH} 部署"
    fi
fi

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    log_warning "检测到未提交的更改:"
    git status --short
    log_warning "是否继续部署？未提交的更改可能会丢失 [y/N]"
    read -p "请选择: " CONTINUE_DEPLOY
    if [[ ! "$CONTINUE_DEPLOY" =~ ^[Yy]$ ]]; then
        log_error "部署已取消"
        exit 1
    fi
fi

echo ""

# 2. 停止当前服务
log "${BLUE}🛑 停止当前服务${NC}"
log "----------------------------------"

log_info "停止所有 Artism 服务..."
npm run stop 2>/dev/null || log_warning "没有运行中的服务需要停止"

# 额外确保端口清理
log_info "清理端口占用..."
lsof -ti:3100,5273,8000,5001 | xargs kill -9 2>/dev/null || log_info "端口已清理"

log_success "服务停止完成"
echo ""

# 3. 拉取最新代码
log "${BLUE}📥 拉取最新代码${NC}"
log "----------------------------------"

log_info "从远程仓库拉取最新代码..."

# 保存当前 stash（如果有未提交更改）
if [[ -n $(git status --porcelain) ]]; then
    log_info "暂存当前更改..."
    git stash push -m "Auto stash before deploy $(date)"
fi

# 拉取最新代码
if git pull origin main; then
    log_success "代码拉取成功"
    
    # 显示最新提交信息
    log_info "最新提交信息:"
    git log --oneline -1 | tee -a "$DEPLOY_LOG"
else
    log_error "代码拉取失败"
    exit 1
fi

echo ""

# 4. 安装依赖
log "${BLUE}📦 安装/更新依赖${NC}"
log "----------------------------------"

log_info "检查 package.json 是否有更新..."
if git diff HEAD~1 HEAD --name-only | grep -q "package.json\|requirements.txt"; then
    log_warning "检测到依赖文件更新，重新安装依赖..."
    
    log_info "安装所有项目依赖..."
    if npm run all:install; then
        log_success "依赖安装完成"
    else
        log_error "依赖安装失败"
        exit 1
    fi
else
    log_info "依赖文件无更新，跳过安装"
fi

echo ""

# 5. 环境检查
log "${BLUE}🔍 环境检查${NC}"
log "----------------------------------"

log_info "执行快速环境检查..."
if npm run check; then
    log_success "环境检查通过"
else
    log_warning "环境检查发现问题，但继续部署..."
fi

echo ""

# 6. 启动服务
log "${BLUE}🚀 启动所有服务${NC}"
log "----------------------------------"

log_info "启动 Artism 全栈服务..."

# 在后台启动服务
nohup npm run all:dev > artism.log 2>&1 &
SERVICE_PID=$!

log_success "服务启动命令已执行 (PID: ${SERVICE_PID})"
log_info "等待服务启动..."

# 等待服务启动
sleep 10

echo ""

# 7. 健康检查
log "${BLUE}🏥 服务健康检查${NC}"
log "----------------------------------"

# 检查进程是否还在运行
if kill -0 $SERVICE_PID 2>/dev/null; then
    log_success "服务进程运行正常 (PID: ${SERVICE_PID})"
else
    log_error "服务进程已退出，检查日志: tail -f artism.log"
    exit 1
fi

# 检查端口监听
log_info "检查端口监听状态..."
PORTS=(3100 5273 8000 5001)
PORT_NAMES=("AIDA Frontend" "Ismism Frontend" "Artism Backend" "Ismism Backend")

ALL_PORTS_OK=true
for i in "${!PORTS[@]}"; do
    port="${PORTS[$i]}"
    name="${PORT_NAMES[$i]}"
    
    # 等待端口启动（最多30秒）
    for attempt in {1..30}; do
        if lsof -i :$port &> /dev/null; then
            log_success "端口 ${port} (${name}): 正常监听"
            break
        elif [[ $attempt -eq 30 ]]; then
            log_error "端口 ${port} (${name}): 启动超时"
            ALL_PORTS_OK=false
            break
        else
            sleep 1
        fi
    done
done

echo ""

# 8. 显示部署结果
log "${BLUE}📊 部署结果${NC}"
log "=================================="

if [[ "$ALL_PORTS_OK" == "true" ]]; then
    log "${GREEN}${CHECK} 部署成功！所有服务正常运行${NC}"
    
    echo ""
    log "${CYAN}🌐 服务访问地址:${NC}"
    
    # 获取服务器 IP
    SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "YOUR_SERVER_IP")
    
    log "  ${CHECK} AIDA Frontend:     http://${SERVER_IP}:3100"
    log "  ${CHECK} AIDA API Docs:     http://${SERVER_IP}:8000/api/docs"
    log "  ${CHECK} Ismism Frontend:   http://${SERVER_IP}:5273"
    log "  ${CHECK} Ismism API:        http://${SERVER_IP}:5001/api"
    
    echo ""
    log "${CYAN}📝 管理命令:${NC}"
    log "  查看日志: tail -f artism.log"
    log "  停止服务: npm run stop"
    log "  重启服务: ./deploy.sh"
    log "  检查状态: npm run check:external"
    
else
    log "${RED}${CROSS} 部署失败！部分服务未正常启动${NC}"
    log "${INFO} 请检查日志: tail -f artism.log"
    exit 1
fi

echo ""
log "${INFO} 部署完成时间: $(date)"
log "${INFO} 部署日志已保存到: ${DEPLOY_LOG}"

# 保存 PID 到文件，方便后续管理
echo $SERVICE_PID > artism.pid
log "${INFO} 服务 PID 已保存到: artism.pid"

echo ""
log "${GREEN}🎉 Artism 部署完成！${NC}"
