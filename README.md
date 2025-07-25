# Artism - 艺术主义生态系统

> 一个专注于艺术流派、艺术家和AI艺术创作的综合性平台生态系统

## 🏗️ 项目架构概览

本项目采用微服务架构，包含四个核心应用，形成完整的艺术数据生态系统：

```
┌─────────────────────────────────────────────────────────────────┐
│                        Artism 生态系统                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────────────────────────┐ │
│  │  AIDA Frontend  │◄──►│        Artism Backend               │ │
│  │   (Next.js)     │    │        (FastAPI)                    │ │
│  │                 │    │  ┌─────────────────────────────────┐ │ │
│  │ • AI艺术家数据库 │    │  │        核心数据服务              │ │ │
│  │ • 艺术家交互界面 │    │  │ • 艺术家/作品/流派 统一API      │ │ │
│  │ • 数据可视化    │    │  │ • MongoDB 统一数据层            │ │ │
│  └─────────────────┘    │  │ • 跨应用数据同步               │ │ │
│           │              │  └─────────────────────────────────┘ │ │
│           │              │  ┌─────────────────────────────────┐ │ │
│           │              │  │        AIDA 专有服务            │ │ │
│           │              │  │ • AI艺术家对话 (LangChain)      │ │ │
│           │              │  │ • 风格向量计算                 │ │ │
│           │              │  │ • 数据生成工具                 │ │ │
│           │              │  └─────────────────────────────────┘ │ │
│           │              └─────────────────────────────────────┘ │
│           │                              │                       │
│           │                     ┌────────▼────────┐              │
│           │                     │   MongoDB       │              │
│           │                     │ (统一艺术数据库) │              │
│           │                     │ • artists       │              │
│           │                     │ • artworks      │              │
│           │                     │ • art_movements │              │
│           │                     └─────────────────┘              │
│           │                              ▲                       │
│  ┌─────────────────┐    ┌─────────────────┼─────────────────┐    │
│  │ Ismism Frontend │    │ Ismism Backend  │                 │    │
│  │   (React+Vite)  │    │ (Express.js)    │                 │    │
│  │                 │    │                 │                 │    │
│  │ • 艺术流派时间线 │◄──►│ • 流派数据API   │ (迁移中...)     │    │
│  │ • 交互式可视化  │    │ • 时间线服务    │                 │    │
│  │ • 多层级分类    │    │ • 独有业务逻辑  │◄────────────────┘    │
│  └─────────────────┘    └─────────────────┘                     │
│           │                       │                             │
│           └───────────────────────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 应用详细说明

### �️ Artism Backend - 核心数据后端
**架构定位**: 整个生态系统的统一数据后端和API服务中心

#### 核心数据服务 (`apps/artism-backend/`)
- **技术栈**: FastAPI + Python + MongoDB + Motor (异步ORM)
- **端口**: 8000
- **API文档**: http://localhost:8000/api/docs
- **架构角色**:
  - 🎯 **统一数据层**: 所有艺术相关数据的唯一真实来源
  - 🔄 **跨应用API**: 为AIDA和Ismism提供统一的数据接口
  - 📊 **数据同步中心**: 处理不同应用间的数据一致性

#### 功能模块
**📦 核心数据服务** (服务所有前端应用)
- RESTful API (艺术家、作品、艺术流派)
- 统一数据模型和验证
- 跨应用数据同步机制
- 高性能查询和索引优化

**🤖 AIDA 专有服务** (仅服务AIDA前端)
- AI艺术家对话服务 (LangChain + OpenAI)
- 艺术风格向量计算和相似度分析
- 虚拟艺术家生成和管理
- CSV数据处理和批量导入工具

### 🎨 AIDA Frontend - AI艺术家交互界面
**核心功能**: AI增强的艺术家数据库管理和交互平台

#### 应用特性 (`apps/aida-frontend/`)
- **技术栈**: Next.js 14 + TypeScript + Mantine + Tailwind CSS + Jotai
- **端口**: 3000
- **数据来源**: 完全依赖 Artism Backend API
- **主要功能**:
  - 艺术家数据库浏览和高级搜索
  - AI艺术家对话交互界面
  - 艺术作品展示和风格分析
  - 响应式数据表格和可视化图表

### 🏛️ Ismism Frontend - 艺术流派可视化平台
**核心功能**: 交互式艺术流派历史和关系探索

#### 应用特性 (`apps/ismism-frontend/`)
- **技术栈**: React 18 + TypeScript + Vite + Tailwind CSS + Zustand
- **端口**: 5173
- **数据来源**: 混合架构 (详见迁移计划)
- **主要功能**:
  - 交互式艺术流派时间线
  - 多维度流派分类和筛选
  - 关键词标签系统和关系图谱
  - 响应式设计 (桌面/移动端适配)

### 🔄 Ismism Backend - 过渡期独立后端
**架构状态**: 🚧 **迁移中** - 逐步整合到 Artism Backend

#### 当前状态 (`apps/ismism-backend/`)
- **技术栈**: Express.js + Node.js + MongoDB + Mongoose
- **端口**: 3000/5000
- **迁移策略**:
  - ✅ **核心数据**: 艺术流派数据已迁移到 Artism Backend
  - 🔄 **业务逻辑**: 时间线算法和可视化逻辑迁移中
  - 📦 **独有功能**: 部分Ismism特有的业务逻辑将保留

#### 迁移计划
- **Phase 1** (已完成): 数据模型统一到 Artism Backend
- **Phase 2** (进行中): API逐步切换到 Artism Backend
- **Phase 3** (计划中): 保留Ismism特有的可视化算法服务

## 🔄 数据流和应用关系

### 数据层级关系
```
艺术流派 (Art Movements) ──┐
                          ├─► 艺术家 (Artists) ──► 艺术作品 (Artworks)
时代背景 (Historical Context) ──┘
```

### 应用间协作
1. **Ismism** 专注于**宏观视角** - 艺术流派的历史发展和相互影响
2. **AIDA** 专注于**微观视角** - 具体艺术家和作品的详细信息
3. **数据互补**: Ismism的流派数据为AIDA提供分类依据，AIDA的艺术家数据丰富Ismism的流派内容
4. **技术栈互补**:
   - Ismism使用轻量级技术栈，适合快速原型和可视化
   - AIDA使用企业级技术栈，支持复杂的AI交互和数据处理

## 🚀 快速启动

### 开发环境要求
- **Node.js**: v18.12.1+
- **Python**: 3.9+
- **MongoDB**: 6.0+
- **Docker**: (可选，用于容器化部署)

### 🎯 一键启动 (推荐)

```bash
# 1. 启动数据库
mongod

# 2. 环境检查
npm run check

# 3. 安装所有依赖
npm run all:install

# 4. 启动所有服务
npm run all:dev
```

### 📋 手动启动 (详细控制)

```bash
# 1. 启动数据库
mongod

# 2. 启动 Artism 后端 (端口 8000)
cd apps/artism-backend
pip install -r requirements.txt
python3 main.py

# 3. 启动 AIDA 前端 (端口 3100)
cd apps/aida-frontend
npm install
npm run dev

# 4. 启动 Ismism 后端 (端口 5001)
cd apps/ismism-backend
npm install
npm run dev

# 5. 启动 Ismism 前端 (端口 5273)
cd apps/ismism-frontend
npm install
npm run dev
```

### 🛠️ 开发命令

```bash
npm run help              # 显示所有可用命令
npm run check             # 快速环境检查
npm run check:detailed    # 详细环境检查
npm run all:install       # 安装所有依赖
npm run all:dev           # 启动所有服务
npm run show:urls         # 显示访问地址
npm run stop              # 停止所有服务
npm run clean             # 清理构建缓存
```

### 访问地址
- **AIDA Frontend**: http://localhost:3100
- **AIDA API Docs**: http://localhost:8000/api/docs
- **Ismism Frontend**: http://localhost:5273
- **Ismism API**: http://localhost:5001

## 🛠️ 技术栈对比

| 组件 | AIDA | Ismism |
|------|------|--------|
| **前端框架** | Next.js 14 | React 18 + Vite |
| **状态管理** | Jotai (原子化) | Zustand (简单) |
| **UI组件库** | Mantine + Tailwind | 纯 Tailwind CSS |
| **后端框架** | FastAPI (Python) | Express.js (Node.js) |
| **数据库ORM** | Motor (异步MongoDB) | Mongoose (MongoDB) |
| **AI集成** | LangChain + OpenAI | 无 |
| **部署方式** | Docker + uvicorn | Docker + pm2 |

## 🎯 使用场景

### 教育研究场景
1. **艺术史学习**: 通过Ismism了解流派发展 → 通过AIDA深入了解具体艺术家
2. **学术研究**: 使用AIDA的AI功能进行艺术家访谈模拟和风格分析

### 创作灵感场景
1. **风格探索**: 在Ismism中发现感兴趣的流派 → 在AIDA中找到代表艺术家
2. **AI协作**: 与AIDA中的AI艺术家对话，获取创作建议

### 数据分析场景
1. **趋势分析**: 结合两个平台的数据，分析艺术发展趋势
2. **关系挖掘**: 发现艺术家与流派之间的隐藏联系

## 📦 Legacy 项目迁移状态 (`apps-legacy/`)

### 🏛️ 迁移概览
`apps-legacy/` 目录包含项目演进过程中的历史版本，部分功能已迁移至 `apps/` 目录，部分仍在独立维护。

| Legacy 项目 | 迁移状态 | 对应新项目 | 维护状态 |
|------------|----------|------------|----------|
| **AIDA-page** | 🔄 **部分迁移** | `apps/aida-frontend` + `apps/artism-backend` | 🟡 **过渡期** |
| **Ismism-Machine** | ✅ **已迁移** | `apps/ismism-frontend` + `apps/ismism-backend` | 🟢 **已完成** |
| **Scraper 工具** | ❌ **未迁移** | 无 | 🟢 **独立维护** |

### 📋 详细迁移对应关系

#### AIDA-page → 新架构迁移
```
apps-legacy/AIDA-page/
├── backend/          → apps/artism-backend/     (✅ 已迁移)
├── frontend/         → apps/aida-frontend/      (✅ 已迁移)
├── scraper/          → 保留在 legacy           (❌ 未迁移)
└── data/                                      (❌ 未迁移)
```

**迁移增强点**:
- **Backend**: FastAPI 架构优化，统一数据模型，增加 AI 交互服务
- **Frontend**: Next.js 14 升级，Mantine UI 重构，Jotai 状态管理
- **API**: 统一 RESTful 设计，完整 OpenAPI 文档

#### Ismism-Machine → 新架构迁移
```
apps-legacy/Ismism-Machine/
├── src/              → apps/ismism-frontend/src/    (✅ 已迁移)
├── server/           → apps/ismism-backend/         (✅ 已迁移)
├── database/         → apps/artism-backend/         (❌ 未迁移)
```

**迁移优化点**:
- **数据统一**: 流派数据迁移到 Artism Backend 统一管理
- **技术栈升级**: React 18 + TypeScript + Vite 优化
- **响应式重构**: Tailwind CSS 移动端适配

### 🔧 独立维护的 Legacy 组件

#### Scraper 工具集 (`apps-legacy/AIDA-page/scraper/`)
**保留原因**: 专业爬虫工具，独立性强，无需迁移
- **功能**: Artsy.net 艺术数据爬取
- **技术栈**: Python + FastAPI + Selenium + BeautifulSoup
- **使用方式**:
  ```bash
  cd apps-legacy/AIDA-page
  ./run_artsy_tools.bat  # Windows GUI 工具
  ./run_artsy_scraper.bat  # 命令行工具
  ```
- **数据输出**: 直接导出 CSV，可导入新架构
- **维护状态**: 🟢 **活跃维护**，支持嵌套 Git 开发

### 🎯 Legacy 使用建议

#### 1. 数据爬取场景
```bash
# 使用 legacy scraper 爬取数据
cd apps-legacy/AIDA-page
./run_artsy_tools.bat

# 将数据导入新架构
cd apps/artism-backend
python scripts/import_csv.py --source ../legacy/data/artsy_artists.csv
```

#### 2. 历史版本对比
- **Legacy AIDA**: 适合了解项目演进历史
- **Legacy Ismism**: 可作为新版本的功能参考

#### 3. 独立功能开发
- **Scraper**: 在 legacy 中继续开发爬虫功能
- **实验性功能**: 可在 legacy 中快速原型验证

## 🔮 未来规划

### 短期目标 (3个月)
- [ ] 统一用户认证系统
- [ ] 跨应用数据同步机制
- [ ] 移动端适配优化
- [ ] Legacy scraper 工具现代化

### 中期目标 (6个月)
- [ ] AI艺术生成功能集成
- [ ] 实时协作功能
- [ ] 高级数据可视化
- [ ] Legacy 项目完全归档

### 长期目标 (1年)
- [ ] 多语言国际化支持
- [ ] 区块链艺术品认证
- [ ] VR/AR艺术展示

## 🤝 贡献指南

1. **选择应用**: 根据兴趣选择AIDA或Ismism进行贡献
2. **遵循规范**: 查看各应用目录下的具体开发规范
3. **提交流程**: Fork → 功能分支 → Pull Request
4. **代码风格**: 使用各项目配置的ESLint/Prettier规则

## 📄 许可证

详见各应用目录下的LICENSE文件