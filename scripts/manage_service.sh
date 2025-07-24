#!/bin/bash

# Artism 服务管理脚本
# 提供启动、停止、重启、状态查看等功能

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

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PID_FILE="${PROJECT_ROOT}/artism.pid"
LOG_FILE="${PROJECT_ROOT}/artism.log"

# 显示帮助信息
show_help() {
    echo -e "${BLUE}🛠️ Artism 服务管理工具${NC}"
    echo "=================================="
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start    - 启动所有服务"
    echo "  stop     - 停止所有服务"
    echo "  restart  - 重启所有服务"
    echo "  status   - 查看服务状态"
    echo "  logs     - 查看服务日志"
    echo "  deploy   - 执行完整部署"
    echo "  help     - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start     # 启动服务"
    echo "  $0 status    # 查看状态"
    echo "  $0 logs      # 查看日志"
}

# 检查服务状态
check_status() {
    local pid_running=false
    local ports_listening=false
    
    # 检查 PID 文件
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${CHECK} 服务进程运行中 (PID: $pid)"
            pid_running=true
        else
            echo -e "${WARNING} PID 文件存在但进程已退出 (PID: $pid)"
        fi
    else
        echo -e "${INFO} 未找到 PID 文件"
    fi
    
    # 检查端口监听
    echo ""
    echo "端口监听状态:"
    
    local ports=(3100 5273 8000 5001)
    local names=("AIDA Frontend" "Ismism Frontend" "Artism Backend" "Ismism Backend")
    local listening_count=0
    
    for i in "${!ports[@]}"; do
        local port="${ports[$i]}"
        local name="${names[$i]}"
        
        if lsof -i :$port &> /dev/null; then
            echo -e "  ${CHECK} 端口 $port ($name): 正在监听"
            ((listening_count++))
        else
            echo -e "  ${CROSS} 端口 $port ($name): 未监听"
        fi
    done
    
    if [[ $listening_count -eq 4 ]]; then
        ports_listening=true
    fi
    
    # 返回总体状态
    if [[ "$pid_running" == true && "$ports_listening" == true ]]; then
        echo ""
        echo -e "${GREEN}${CHECK} 服务状态: 正常运行${NC}"
        return 0
    elif [[ "$ports_listening" == true ]]; then
        echo ""
        echo -e "${YELLOW}${WARNING} 服务状态: 运行中但 PID 文件异常${NC}"
        return 1
    else
        echo ""
        echo -e "${RED}${CROSS} 服务状态: 未运行${NC}"
        return 2
    fi
}

# 启动服务
start_service() {
    echo -e "${BLUE}🚀 启动 Artism 服务${NC}"
    echo "=================================="
    
    # 检查是否已经运行
    if check_status &>/dev/null; then
        echo -e "${WARNING} 服务已在运行中"
        return 0
    fi
    
    echo "启动所有服务..."
    cd "$PROJECT_ROOT"
    
    # 在后台启动服务
    nohup npm run all:dev > "$LOG_FILE" 2>&1 &
    local pid=$!
    
    # 保存 PID
    echo $pid > "$PID_FILE"
    
    echo -e "${CHECK} 服务启动命令已执行 (PID: $pid)"
    echo "等待服务启动..."
    
    # 等待服务启动
    sleep 10
    
    # 检查启动结果
    if check_status; then
        echo -e "${GREEN}${CHECK} 服务启动成功！${NC}"
    else
        echo -e "${RED}${CROSS} 服务启动失败，请检查日志${NC}"
        return 1
    fi
}

# 停止服务
stop_service() {
    echo -e "${BLUE}🛑 停止 Artism 服务${NC}"
    echo "=================================="
    
    local stopped=false
    
    # 通过 PID 文件停止
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "停止主进程 (PID: $pid)..."
            kill -TERM "$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null
            sleep 2
            stopped=true
        fi
        rm -f "$PID_FILE"
    fi
    
    # 通过 npm 停止
    cd "$PROJECT_ROOT"
    npm run stop 2>/dev/null && stopped=true
    
    # 强制清理端口
    echo "清理端口占用..."
    lsof -ti:3100,5273,8000,5001 | xargs kill -9 2>/dev/null || true
    
    if [[ "$stopped" == true ]]; then
        echo -e "${CHECK} 服务停止完成"
    else
        echo -e "${WARNING} 没有运行中的服务"
    fi
}

# 重启服务
restart_service() {
    echo -e "${BLUE}🔄 重启 Artism 服务${NC}"
    echo "=================================="
    
    stop_service
    sleep 2
    start_service
}

# 查看日志
show_logs() {
    echo -e "${BLUE}📋 Artism 服务日志${NC}"
    echo "=================================="
    
    if [[ -f "$LOG_FILE" ]]; then
        echo "日志文件: $LOG_FILE"
        echo "按 Ctrl+C 退出日志查看"
        echo ""
        tail -f "$LOG_FILE"
    else
        echo -e "${WARNING} 日志文件不存在: $LOG_FILE"
    fi
}

# 执行部署
deploy_service() {
    echo -e "${BLUE}🚀 执行完整部署${NC}"
    echo "=================================="
    
    cd "$PROJECT_ROOT"
    if [[ -f "deploy.sh" ]]; then
        ./deploy.sh
    else
        echo -e "${CROSS} 部署脚本不存在: deploy.sh"
        return 1
    fi
}

# 主函数
main() {
    case "${1:-help}" in
        "start")
            start_service
            ;;
        "stop")
            stop_service
            ;;
        "restart")
            restart_service
            ;;
        "status")
            echo -e "${BLUE}📊 Artism 服务状态${NC}"
            echo "=================================="
            check_status
            ;;
        "logs")
            show_logs
            ;;
        "deploy")
            deploy_service
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"
