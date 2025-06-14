# AIDA 后端重构工作记录

## 原始需求

用户要求：
> 仔细分析目前后端的现状，然后阅读需求文档 @`gptmemory/req.md` ，阅读多个后端相关文件，思考后端目前现状是怎么样的，实现这些后端并实现一些伪数据需要做什么，有哪些多了，哪些少了，哪些不对齐，以及我们要给多个下游服务，目前基本不需要考虑 auth ，到底需要分几步执行。

用户进一步要求：
> 计划还不够详细，另外，现在后端的架构是最优的吗，从 DRY 出发有必要引入新库新依赖来降低复杂度吗，以及伪数据之类的要怎么操作，这些细节都没有。先不要执行任何代码修改，阅读相关文件，中文给出详细计划描述（不给代码段，不要给详细代码，只是文本陈述），给我 review

最终要求：
> 还是不够细节，你这都是大而化之的提纲挈领的列表，我要超具体到底每个具体做啥。[更新细致方案] 重新阅读对应代码文件，细致描述详细修改方案（不要推测或者可能，一定都取读相关文件确定具体当前实现然后给出具体修改方法），描述但不给代码，先不要执行，给我 review

## 项目现状分析

### 当前架构问题
1. **数据库连接问题**：`get_database()`函数没有指定数据库名称，ArtistService使用"test_table"集合，ArtworkService使用"artworks"集合，命名不一致
2. **数据模型不统一**：Artist是普通Python类，Artwork混用Pydantic和Python类，完全缺少ArtMovement模型
3. **服务层重复代码**：ArtistService和ArtworkService有大量重复CRUD代码
4. **响应格式不统一**：缺乏统一的API响应包装
5. **字段不匹配需求**：现有模型缺少需求文档中的isFictional、fictionalMeta、agent、styleVector等关键字段

### 需求文档要求
- 支持Artist、Artwork、ArtMovement三个核心模型
- 支持AIDA（真实艺术家）和主义主义机（虚构艺术家）两个项目
- 统一响应格式、通用查询参数、关联数据填充
- 风格推荐、社交网络、数据生成等高级功能

## 总体实施计划

### 实施原则
- 不引入过度复杂的新依赖（如Beanie ORM）
- 保持现有FastAPI+MongoDB架构
- 通过DRY原则减少重复代码
- 确保向后兼容性

### 时间安排
- **总工期**：5个工作日
- **每日8小时工作量**
- **按步骤顺序执行，不可跳跃**

## 详细执行清单

### 第一天：数据库配置和模型重构

#### ✅ 步骤1.1：修复数据库连接配置
**文件**：`backend/app/core/config.py`
- [ ] 在第38行`DATABASE_NAME = os.getenv("DATABASE_NAME", "aida")`后添加集合名称常量
- [ ] 添加以下三行：
  ```
  ARTISTS_COLLECTION = "artists"
  ARTWORKS_COLLECTION = "artworks" 
  ART_MOVEMENTS_COLLECTION = "art_movements"
  ```

**文件**：`backend/app/db/mongodb/__init__.py`
- [ ] 在文件顶部第2行后添加：`from app.core.config import DATABASE_NAME`
- [ ] 修改第20行`return get_client().get_database()`为`return get_client().get_database(DATABASE_NAME)`

#### ✅ 步骤1.2：创建统一数据模型基类
**文件**：`backend/app/models/base.py`（新建）
- [ ] 创建BaseModel类
- [ ] 包含字段：id(int)、createdAt(datetime)、updatedAt(datetime)
- [ ] 实现方法：to_dict()、from_dict()、validate_data()
- [ ] 添加通用数据清理逻辑

#### ✅ 步骤1.3：重构Artist模型
**文件**：`backend/app/models/artist.py`
- [ ] 删除第4-95行（整个现有Artist类）
- [ ] 重新实现Artist类继承BaseModel
- [ ] 添加字段：
  - [ ] `isFictional: bool = False`
  - [ ] `fictionalMeta: Optional[Dict] = None`（包含originProject、originStory、fictionalStyle、modelPromptSeed）
  - [ ] `agent: Optional[Dict] = None`（包含enabled、personalityProfile、promptSeed、connectedNetworkIds）
  - [ ] `notableWorks: List[str] = []`
  - [ ] `associatedMovements: List[str] = []`
  - [ ] `avatarUrl: Optional[str] = None`
  - [ ] `tags: List[str] = []`
  - [ ] 保留原有字段：name、bio、birthYear、deathYear、nationality

#### ✅ 步骤1.4：重构Artwork模型
**文件**：`backend/app/models/artwork.py`
- [ ] 删除第4-113行（整个现有Artwork类）
- [ ] 重新实现Artwork类继承BaseModel
- [ ] 添加字段：
  - [ ] `movementIds: List[str] = []`
  - [ ] `styleVector: List[float] = []`
  - [ ] `tags: List[str] = []`
  - [ ] 保留原有字段：title、description、imageUrl、year、artistId

#### ✅ 步骤1.5：创建ArtMovement模型
**文件**：`backend/app/models/art_movement.py`（新建）
- [ ] 实现ArtMovement类继承BaseModel
- [ ] 包含字段：name、description、startYear、endYear、keyArtists、representativeWorks、tags

### 第二天：Schema统一和服务基类

#### ✅ 步骤2.1：更新Artist Schema
**文件**：`backend/app/schemas/artist.py`
- [ ] 删除第4-12行（ArtistBase类的字段定义）
- [ ] 重新定义字段匹配新的Artist模型
- [ ] 添加嵌套模型：FictionalMeta、Agent
- [ ] 修改第28-33行Artist类，添加所有新字段

#### ✅ 步骤2.2：更新Artwork Schema
**文件**：`backend/app/schemas/artwork.py`
- [ ] 删除第4-13行（ArtworkBase类的字段定义）
- [ ] 重新定义字段匹配新的Artwork模型
- [ ] 添加字段：styleVector、movementIds、tags

#### ✅ 步骤2.3：创建ArtMovement Schema
**文件**：`backend/app/schemas/art_movement.py`（新建）
- [ ] 创建ArtMovementBase、ArtMovementCreate、ArtMovementUpdate、ArtMovement类
- [ ] 实现完整的Pydantic模型

#### ✅ 步骤2.4：创建统一服务基类
**文件**：`backend/app/services/base_service.py`（新建）
- [ ] 实现BaseService类
- [ ] 包含通用CRUD方法：get_all()、get_by_id()、create()、update()、delete()
- [ ] 统一错误处理机制
- [ ] 实现通用查询参数解析
- [ ] 统一响应格式包装

### 第三天：服务层重构和响应格式统一

#### ✅ 步骤3.1：重构ArtistService
**文件**：`backend/app/services/artist_service.py`
- [ ] 删除第16行，改为：`from app.core.config import ARTISTS_COLLECTION`
- [ ] 修改第16行为：`COLLECTION_NAME = ARTISTS_COLLECTION`
- [ ] 删除第19-187行（所有方法实现）
- [ ] 重新实现ArtistService继承BaseService
- [ ] 只保留艺术家特有的业务逻辑方法

#### ✅ 步骤3.2：重构ArtworkService
**文件**：`backend/app/services/artwork_service.py`
- [ ] 删除第18行，改为：`from app.core.config import ARTWORKS_COLLECTION`
- [ ] 修改第18行为：`COLLECTION_NAME = ARTWORKS_COLLECTION`
- [ ] 删除第21-212行（所有方法实现）
- [ ] 重新实现ArtworkService继承BaseService
- [ ] 添加风格推荐相关方法

#### ✅ 步骤3.3：创建ArtMovementService
**文件**：`backend/app/services/art_movement_service.py`（新建）
- [ ] 实现ArtMovementService继承BaseService
- [ ] 添加艺术运动特有的业务逻辑

#### ✅ 步骤3.4：创建统一响应格式
**文件**：`backend/app/schemas/response.py`（新建）
- [ ] 实现APIResponse通用响应类
- [ ] 包含字段：success、data、message、code
- [ ] 实现PaginatedResponse分页响应类

### 第四天：API端点更新和ArtMovement API

#### ✅ 步骤4.1：更新Artists API
**文件**：`backend/app/api/v1/endpoints/artists.py`
- [ ] 修改第9行response_model为APIResponse[List[Artist]]
- [ ] 修改第17-18行返回格式为APIResponse包装
- [ ] 实现第113-154行search_artists的真正搜索逻辑
- [ ] 添加通用查询参数支持

#### ✅ 步骤4.2：更新Artworks API
**文件**：`backend/app/api/v1/endpoints/artworks.py`
- [ ] 所有端点返回格式统一为APIResponse包装
- [ ] 删除第23-56行的import_test_data方法
- [ ] 添加风格推荐端点：GET /artworks/{id}/similar

#### ✅ 步骤4.3：创建ArtMovement API
**文件**：`backend/app/api/v1/endpoints/art_movements.py`（新建）
- [ ] 实现GET /art-movements（支持查询参数）
- [ ] 实现GET /art-movements/{id}
- [ ] 实现POST /art-movements
- [ ] 实现PUT /art-movements/{id}
- [ ] 实现DELETE /art-movements/{id}
- [ ] 实现GET /art-movements/{id}/artists
- [ ] 实现GET /art-movements/{id}/artworks

#### ✅ 步骤4.4：注册ArtMovement路由
**文件**：`backend/app/api/v1/__init__.py`
- [ ] 第3行添加：`, art_movements`
- [ ] 第13行后添加：`api_router.include_router(art_movements.router, prefix="/art-movements", tags=["art-movements"])`

### 第五天：数据生成和高级功能

#### ✅ 步骤5.1：创建通用查询参数支持
**文件**：`backend/app/utils/query_params.py`（新建）
- [ ] 实现QueryParamsParser类
- [ ] 支持参数：project、fields、include、search、tags、yearFrom/yearTo、sortBy、order
- [ ] 实现参数验证和转换逻辑

#### ✅ 步骤5.2：创建数据生成系统
**文件**：`backend/app/utils/data_generator.py`（新建）
- [ ] 实现ArtistDataGenerator类
- [ ] 实现ArtworkDataGenerator类
- [ ] 实现ArtMovementDataGenerator类
- [ ] 支持AIDA真实数据和主义主义机虚构数据生成

#### ✅ 步骤5.3：创建数据生成API
**文件**：`backend/app/api/v1/endpoints/data_generation.py`（新建）
- [ ] 实现POST /data-generation/artists
- [ ] 实现POST /data-generation/artworks
- [ ] 实现POST /data-generation/art-movements
- [ ] 实现POST /data-generation/full-dataset

#### ✅ 步骤5.4：更新数据导入逻辑
**文件**：`backend/app/api/v1/endpoints/data.py`
- [ ] 修改第45-75行import_test_data为通用导入
- [ ] 支持三种模型的CSV导入
- [ ] 实现数据关联关系自动建立

#### ✅ 步骤5.5：添加数据库索引
**文件**：`backend/app/db/indexes.py`（新建）
- [ ] 实现索引创建脚本
- [ ] 创建索引：name、tags、artistId、movementIds、updatedAt、isFictional

**文件**：`backend/main.py`
- [ ] 第6行后添加索引初始化调用

#### ✅ 步骤5.6：注册新路由
**文件**：`backend/app/api/v1/__init__.py`
- [ ] 添加data_generation路由注册

## 验收标准

### 功能验收
- [ ] 所有API端点返回统一格式
- [ ] 支持通用查询参数
- [ ] ArtMovement CRUD完整实现
- [ ] 数据生成功能正常
- [ ] 风格推荐功能正常

### 代码质量验收
- [ ] 无重复CRUD代码
- [ ] 统一错误处理
- [ ] 所有模型字段匹配需求文档
- [ ] 数据库索引正确创建

### 数据验收
- [ ] 能生成AIDA真实艺术家数据
- [ ] 能生成主义主义机虚构艺术家数据
- [ ] 数据关联关系正确建立

## 注意事项

1. **严格按顺序执行**：每个步骤都依赖前一步骤的完成
2. **文件路径精确**：所有文件路径都是相对于项目根目录
3. **行号准确**：所有行号都基于当前文件状态
4. **测试验证**：每完成一个步骤都要测试相关功能
5. **备份代码**：重大修改前先备份原文件

## 完成标志

当所有checklist项目都被勾选完成时，整个后端重构工作完成。此时应该能够：
- 启动后端服务无错误
- 访问所有API端点
- 生成和导入测试数据
- 前端能正常调用所有后端接口
