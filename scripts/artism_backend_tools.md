# Artism Backend 工具集

这是一组用于管理和监控Artism Backend的工具脚本，可以帮助您快速启动、修复、测试和监控后端服务。

## 脚本列表

1. **start_artism_backend.ps1** - 主启动脚本，整合所有功能
2. **fix_artism_backend.ps1** - 修复常见问题的脚本
3. **test_api_endpoints.ps1** - 测试API端点的脚本
4. **cursor_monitor.ps1** - 监控服务状态的脚本
5. **command_timeout.ps1** - 命令超时控制脚本
6. **run_and_test_backend.ps1** - 启动后端服务并测试API端点
7. **test_db_connection.ps1** - 测试数据库连接和初始化数据库
8. **test_api_endpoints_simple.ps1** - 简化版API端点测试脚本
9. **start_and_test.ps1** - 启动后端服务并执行所有测试

## 使用方法

### 快速启动

最简单的方法是运行主启动脚本，它会显示一个菜单供您选择操作：

```powershell
.\start_artism_backend.ps1
```

### 修复问题

如果您遇到启动或运行问题，可以使用修复脚本：

```powershell
.\fix_artism_backend.ps1 -ForceUseMock -CreateEnvFile
```

参数说明：
- `-ForceUseMock` - 强制使用Mock数据库
- `-SkipInstall` - 跳过依赖安装
- `-CreateEnvFile` - 创建.env文件

### 测试API

启动服务后，您可以测试API端点：

```powershell
.\test_api_endpoints.ps1 -Verbose
```

参数说明：
- `-BaseUrl` - 指定API基础URL，默认为http://localhost:8000
- `-Verbose` - 显示详细输出

### 监控服务

您可以启动监控脚本来持续监控服务状态：

```powershell
.\cursor_monitor.ps1
```

### 命令超时控制

如果您需要执行可能超时的命令，可以使用命令超时控制脚本：

```powershell
.\command_timeout.ps1 -Command "python main.py" -TimeoutSeconds 60
```

参数说明：
- `-Command` - 要执行的命令
- `-TimeoutSeconds` - 超时时间（秒），默认为60秒

### 一键启动和测试

如果您想一次性启动后端服务并执行所有测试，可以使用：

```powershell
.\start_and_test.ps1
```

参数说明：
- `-BaseUrl` - 指定API基础URL，默认为http://localhost:8000
- `-ForceUseMock` - 强制使用Mock数据库，默认为true
- `-Verbose` - 显示详细输出
- `-TimeoutSeconds` - 等待服务启动的超时时间（秒），默认为60秒

### 后台运行服务

如果您只想在后台启动服务并测试API端点，可以使用：

```powershell
.\run_and_test_backend.ps1
```

参数说明与`start_and_test.ps1`相同。

### 测试数据库连接

如果您只想测试数据库连接和初始化数据库，可以使用：

```powershell
.\test_db_connection.ps1
```

参数说明：
- `-BaseUrl` - 指定API基础URL，默认为http://localhost:8000
- `-Verbose` - 显示详细输出

### 简化版API测试

如果您想使用简化版的API测试脚本，可以使用：

```powershell
.\test_api_endpoints_simple.ps1
```

参数说明与`test_api_endpoints.ps1`相同。

## 常见问题解决

### MongoDB连接问题

如果您遇到MongoDB连接问题，可以使用以下方法：

1. 确保MongoDB服务已启动
2. 使用Mock数据库：`$env:USE_MOCK_DB="True"`
3. 运行修复脚本：`.\fix_artism_backend.ps1 -ForceUseMock`

### 启动失败

如果服务启动失败，请尝试：

1. 检查依赖是否正确安装：`pip install -r requirements.txt`
2. 检查.env文件是否存在
3. 运行修复脚本：`.\fix_artism_backend.ps1`

### API测试失败

如果API测试失败，请检查：

1. 服务是否正在运行
2. 端口是否被占用
3. 查看日志文件：`api_test.log`

## 日志文件

所有脚本都会生成日志文件，您可以查看这些日志来诊断问题：

- `artism_backend.log` - 主启动脚本日志
- `fix_artism_backend.log` - 修复脚本日志
- `api_test.log` - API测试日志
- `cursor_monitor.log` - 监控脚本日志
- `run_test_backend.log` - 启动和测试脚本日志
- `test_db_connection.log` - 数据库连接测试日志
- `test_api_simple.log` - 简化版API测试日志
- `start_and_test.log` - 启动和执行所有测试脚本日志 