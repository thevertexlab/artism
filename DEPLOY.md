# 🚀 Artism 一键部署指南

## 📋 快速开始

### 1. 首次部署

```bash
# 克隆项目
git clone https://github.com/thevertexlab/artism.git
cd artism

# 一键部署
./deploy.sh
```

### 2. 日常更新部署

```bash
# 拉取最新代码并重启服务
./deploy.sh

# 或使用 npm 命令
npm run deploy
```

## 🛠️ 服务管理

### 基础命令

```bash
# 启动服务
npm run service start

# 停止服务
npm run service stop

# 重启服务
npm run service restart

# 查看状态
npm run service status

# 查看日志
npm run service logs

# 完整部署
npm run deploy
```

### 直接使用脚本

```bash
# 服务管理
bash scripts/manage_service.sh start
bash scripts/manage_service.sh stop
bash scripts/manage_service.sh status
bash scripts/manage_service.sh logs

# 一键部署
./deploy.sh
```

## 📊 部署流程

`deploy.sh` 脚本会自动执行以下步骤：

1. **🔍 检查 Git 状态**
   - 检查当前分支
   - 处理未提交的更改

2. **🛑 停止当前服务**
   - 停止所有运行中的服务
   - 清理端口占用

3. **📥 拉取最新代码**
   - 从 `origin main` 拉取最新代码
   - 显示最新提交信息

4. **📦 安装/更新依赖**
   - 检查依赖文件是否有更新
   - 智能安装必要的依赖

5. **🔍 环境检查**
   - 执行快速环境检查
   - 确保运行环境正常

6. **🚀 启动服务**
   - 后台启动所有服务
   - 保存进程 PID

7. **🏥 健康检查**
   - 检查进程状态
   - 验证端口监听
   - 显示访问地址

## 📁 生成的文件

部署过程中会生成以下文件：

- `artism.log` - 服务运行日志
- `artism.pid` - 服务进程 PID
- `deploy.log` - 部署操作日志

## 🌐 服务访问

部署成功后，可通过以下地址访问：

```
http://YOUR_SERVER_IP:3100  - AIDA Frontend (AI艺术家数据库)
http://YOUR_SERVER_IP:8000  - Artism Backend API
http://YOUR_SERVER_IP:5273  - Ismism Frontend (艺术流派时间线)
http://YOUR_SERVER_IP:5001  - Ismism Backend API
```

## 🔧 故障排除

### 查看日志

```bash
# 查看服务日志
tail -f artism.log

# 查看部署日志
tail -f deploy.log

# 实时查看日志
npm run service logs
```

### 常见问题

1. **端口被占用**
   ```bash
   # 强制停止服务
   npm run service stop
   
   # 或手动清理端口
   lsof -ti:3100,5273,8000,5001 | xargs kill -9
   ```

2. **依赖安装失败**
   ```bash
   # 清理缓存重新安装
   npm run clean
   npm run all:install
   ```

3. **Git 冲突**
   ```bash
   # 重置到远程状态
   git reset --hard origin/main
   ./deploy.sh
   ```

4. **服务启动失败**
   ```bash
   # 检查详细错误
   tail -f artism.log
   
   # 检查环境
   npm run check:detailed
   ```

## 🔒 安全配置

### 防火墙设置

```bash
# 配置防火墙开放端口
npm run enable:ports

# 检查外部访问配置
npm run check:external
```

### 生产环境建议

1. **使用 HTTPS**
2. **配置域名和反向代理**
3. **限制特定 IP 访问**
4. **定期备份数据**
5. **监控服务状态**

## 📝 自动化部署

### 定时部署 (可选)

```bash
# 添加到 crontab，每天凌晨 2 点自动部署
0 2 * * * cd /path/to/artism && ./deploy.sh >> deploy.log 2>&1
```

### Webhook 部署 (高级)

可以配合 GitHub Webhooks 实现 push 时自动部署：

1. 创建简单的 webhook 接收器
2. 配置 GitHub webhook
3. 接收到 push 事件时自动执行 `./deploy.sh`

## 🎯 最佳实践

1. **部署前测试**: 在本地测试通过后再部署
2. **备份数据**: 重要数据定期备份
3. **监控日志**: 定期查看服务日志
4. **版本管理**: 使用 Git tags 标记重要版本
5. **回滚准备**: 保留上一个稳定版本的备份

## 📞 支持

如果遇到问题，请：

1. 查看 `artism.log` 和 `deploy.log`
2. 运行 `npm run check:detailed` 检查环境
3. 查看项目文档 `STARTUP_MANUAL.md`
4. 提交 GitHub Issue
