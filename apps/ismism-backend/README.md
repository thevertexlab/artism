# Ismism Backend API

## 🎯 核心架构关系

### 系统角色定位
- **Ismism Backend** (`apps/ismism-backend/`): 统一数据层，所有艺术数据的唯一真实来源
- **Ismism Frontend** (`apps/ismism-frontend/`): 艺术流派探索界面，专注流派分析和作品展示

### 数据流向
```
MongoDB ← Ismism Backend (FastAPI) → Ismism Frontend
                ↓
        统一 RESTful API (端口 8000)
```

## 🚀 快速启动

### 1. 安装依赖
```bash
cd apps/ismism-backend
pip install -r requirements.txt
```

### 2. 配置环境变量
创建`.env`文件，参考`.env.example`：
```
MONGODB_URI=mongodb://localhost:27017/ismism-db
API_HOST=localhost
API_PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. 启动服务
```bash
python main.py
```

### 4. 访问API文档
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 📋 核心模块索引

### 数据管理模块
| 模块 | 路径 | 核心功能 | 关键端点 |
|------|------|----------|----------|
| **Artists** | `/api/v1/artists` | 艺术家 CRUD | `GET /artists`, `POST /artists`, `GET /artists/search` |
| **Artworks** | `/api/v1/artworks` | 作品管理 | `GET /artworks`, `POST /artworks`, `GET /artworks/by-artist/{id}` |
| **Art Movements** | `/api/v1/art-movements` | 艺术流派 | `GET /art-movements`, `POST /art-movements` |

## 🔧 关键配置文件

### 环境配置
- **配置文件**: `apps/ismism-backend/.env`
- **示例文件**: `apps/ismism-backend/.env.example`
- **核心变量**: `MONGODB_URI`, `API_HOST`, `API_PORT`

### 数据模型位置
- **Pydantic 模型**: `apps/ismism-backend/app/schemas/`
- **数据库操作**: `apps/ismism-backend/app/db/mongodb/`

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

### Art Movement Schema 核心字段
```python
{
  "id": "UUID",
  "name": "流派名称",
  "start_year": 1900,
  "end_year": 1950,
  "description": "描述",
  "characteristics": ["特点列表"],
  "key_artists": ["代表艺术家"],
  "influences": ["影响"],
  "image_url": "代表图片URL"
}
```

## 🔍 调试和监控

### 健康检查
```bash
# 基础连接测试
GET /

# 数据库状态
GET /api/v1/test/db-status
``` 