# AI Agent 使用 Artism Backend 指南

## 🎯 核心架构关系

### 系统角色定位
- **Artism Backend** (`apps/artism-backend/`): 统一数据层，所有艺术数据的唯一真实来源
- **AIDA Frontend** (`apps/aida-frontend/`): AI 艺术家交互界面，专注 AI 对话和数据可视化
- **Ismism Frontend** (`apps/ismism-frontend/`): 艺术流派探索界面，专注流派分析和作品展示

### 数据流向
```
MongoDB ← Artism Backend (FastAPI) → AIDA/Ismism Frontend
                ↓
        统一 RESTful API (端口 8000)
```

## 🚀 快速启动 API 文档

### 1. 启动服务
```bash
cd apps/artism-backend
python main.py
```

### 2. 访问文档
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### 3. 复制 API 文档给 Agent
```bash
# 获取完整 OpenAPI 规范
curl http://localhost:8000/openapi.json > api_spec.json

# 或直接在浏览器访问并复制 JSON 内容
```

## 📋 核心模块索引

### 数据管理模块
| 模块 | 路径 | 核心功能 | 关键端点 |
|------|------|----------|----------|
| **Artists** | `/api/v1/artists` | 艺术家 CRUD | `GET /artists`, `POST /artists`, `GET /artists/search` |
| **Artworks** | `/api/v1/artworks` | 作品管理 | `GET /artworks`, `POST /artworks`, `GET /artworks/by-artist/{id}` |
| **Art Movements** | `/api/v1/art-movements` | 艺术流派 | `GET /art-movements`, `POST /art-movements` |

### AI 增强模块
| 模块 | 路径 | 核心功能 | 关键端点 |
|------|------|----------|----------|
| **AI Interaction** | `/api/v1/ai-interaction` | AI 对话服务 | `POST /ai-interaction` |
| **AI Artists** | `/api/v1/ai-artists` | 虚拟艺术家 | `GET /ai-artists`, `POST /ai-artists/generate` |

### 数据处理模块
| 模块 | 路径 | 核心功能 | 关键端点 |
|------|------|----------|----------|
| **Data Generation** | `/api/v1/data-generation` | 批量数据生成 | `POST /data-generation/artists`, `POST /data-generation/artworks` |
| **Database Management** | `/api/v1/database` | 数据库操作 | `POST /database/init`, `DELETE /database/clear` |
| **Data Import** | `/api/v1/data` | CSV 导入导出 | `POST /data/import-csv`, `GET /data/export-csv` |

## 🤖 AI Agent 联动策略

### 1. 数据查询模式
```python
# 搜索艺术家
GET /api/v1/artists/search?name={query}&movement={movement}&limit=10

# 获取艺术家作品
GET /api/v1/artworks/by-artist/{artist_id}

# 流派相关艺术家
GET /api/v1/artists?movement_id={movement_id}
```

### 2. AI 对话集成
```python
# AI 艺术家对话
POST /api/v1/ai-interaction
{
  "artist_id": "artist_uuid",
  "message": "用户问题",
  "context": "对话上下文"
}
```

### 3. 数据创建流程
```python
# 1. 创建艺术家
POST /api/v1/artists
# 2. 创建作品
POST /api/v1/artworks
# 3. 关联流派
PUT /api/v1/artists/{id}
```

## 🔧 关键配置文件

### 环境配置
- **配置文件**: `apps/artism-backend/.env`
- **示例文件**: `apps/artism-backend/.env.example`
- **核心变量**: `MONGODB_URI`, `OPENAI_API_KEY`, `API_HOST`, `API_PORT`

### 数据模型位置
- **Pydantic 模型**: `apps/artism-backend/app/schemas/`
- **MongoDB 模型**: `apps/artism-backend/app/models/`
- **数据库操作**: `apps/artism-backend/app/db/mongodb/`

## 📊 数据结构概览

### Artist Schema 核心字段
```python
{
  "id": "UUID",
  "name": "艺术家姓名",
  "birth_year": 1900,
  "death_year": 2000,
  "nationality": "国籍",
  "art_movement": "艺术流派",
  "biography": "传记",
  "style_description": "风格描述",
  "famous_works": ["作品列表"],
  "ai_personality": "AI 人格设定"
}
```

### Artwork Schema 核心字段
```python
{
  "id": "UUID",
  "title": "作品标题",
  "artist_id": "艺术家ID",
  "year": 1950,
  "medium": "创作媒介",
  "dimensions": "尺寸",
  "description": "描述",
  "style_tags": ["风格标签"],
  "image_url": "图片URL"
}
```

## 🎯 Agent 使用建议

### 1. 数据探索流程
1. 使用 `/artists/search` 查找相关艺术家
2. 通过 `/artworks/by-artist/{id}` 获取作品
3. 使用 `/art-movements` 了解流派信息

### 2. AI 交互最佳实践
- 先获取艺术家信息构建上下文
- 使用 AI 交互端点进行对话
- 保持对话历史以提供连贯体验

### 3. 数据管理操作
- 使用批量端点处理大量数据
- 利用搜索功能进行智能查询
- 通过数据库管理端点进行维护

### 4. 错误处理
- 检查 HTTP 状态码
- 解析错误响应中的详细信息
- 使用测试端点验证连接

## 🔍 调试和监控

### 日志位置
- **应用日志**: 控制台输出
- **数据库连接**: 启动时显示状态
- **API 调用**: FastAPI 自动日志

### 健康检查
```bash
# 基础连接测试
GET /

# 数据库状态
GET /api/v1/test/db-status

# API 功能测试
GET /api/v1/test/
```

## 📚 扩展资源

### 代码位置索引
- **API 路由**: `apps/artism-backend/app/api/v1/`
- **业务逻辑**: `apps/artism-backend/app/services/`
- **数据库操作**: `apps/artism-backend/app/db/mongodb/`
- **配置管理**: `apps/artism-backend/app/core/config.py`

### 依赖关系
- **FastAPI**: Web 框架
- **Motor**: 异步 MongoDB 驱动
- **LangChain**: AI 对话框架
- **OpenAI**: AI 模型接口
- **Pydantic**: 数据验证

---

**💡 提示**: Agent 应优先使用 OpenAPI 规范进行 API 调用，本文档提供架构理解和快速索引。所有端点详情请参考实时 API 文档。
