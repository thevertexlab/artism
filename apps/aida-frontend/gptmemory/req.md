MongoDB 数据API需求文档 v1
一、项目背景
该 API 为两个项目提供统一的数据服务支持：
AIDA
主义主义机
两个项目均涉及艺术家、艺术作品、艺术运动三类核心信息，未来所有艺术家将配有 AI
Agent，参与自动化的社交网络行为。API 应支持多项目、关联数据结构、较大的数据
量，以及
良好的可维护性和扩展性。
另外需要注意的是：
AIDA 项目中的艺术家数据主要来源于真实艺术史资料（通过爬
主义主义机 中的艺术家多数为人工创作的虚构角色
虫采集）
因此，建议在 Artist 模型中添加以下字段以标识
其真实或虚构身份及其构造来源：
isFictional: Boolean // true 表
示为虚构艺术家，false 表
示为真实人物
fictionalMeta: {
originProject: String, // 来源项目名，如“主义主义机”
originStory: String, // 背景设定故事
fictionalStyle: [String], // 虚构风格标签，如“未来主义”、“AI融合主义”
modelPromptSeed: String // 用于生成该角色的AI Prompt原始文本
}
注：真实艺术家该字段为 null 或不包含 fictionalMeta 即可。
二、核心数据模型
1. 艺术家（Artist）
MongoDB 数据API需求文档 v1 1
{
_id: ObjectId,
name: String,
bio: String,
birthYear: Number,
deathYear: Number,
nationality: String,
avatarUrl: String,
notableWorks: [ObjectId], // Artwork ID
associatedMovements: [ObjectId], // ArtMovement ID
tags: [String],
isFictional: Boolean, // 是否为虚构艺术家
fictionalMeta: {
originProject: String, // 来源项目
originStory: String, // 背景设定故事
fictionalStyle: [String], // 风格标签
modelPromptSeed: String // Prompt来源
},
agent: {
enabled: Boolean,
personalityProfile: String,
promptSeed: String,
connectedNetworkIds: [ObjectId] // 指向其他 Artist 的“好友” /“社交网络”结构
},
updatedAt: Date
}
2. 艺术作品（Artwork）
{
_id: ObjectId,
title: String,
description: String,
imageUrl: String,
MongoDB 数据API需求文档 v1 2
year: Number,
artistId: ObjectId,
movementIds: [ObjectId],
tags: [String],
styleVector: [Number], // 可用于风格推荐的 embedding
updatedAt: Date
}
3. 艺术运动（ArtMovement）
{
_id: ObjectId,
name: String,
description: String,
startYear: Number,
endYear: Number,
keyArtists: [ObjectId], // Artist ID
representativeWorks: [ObjectId],
tags: [String],
updatedAt: Date
}
三、API 功能设计
通用参数支持
project : 指定项目（如 aida , zhuyizhuyi ）
fields : 限定返回字段（如 fields=name,avatarUrl ）
include : 填充关联字段（如 include=notableWorks,associatedMovements ）
search : 模糊搜索关键词（如 search=
达达 ）
tags : 标签筛选（如 tags=印象派 ）
yearFrom / yearTo : 时间区间筛选
MongoDB 数据API需求文档 v1 3
sortBy , order : 排序（如 sortBy=year&order=desc ）
page , pageSize : 分页参数
isFictional : 真实/虚构筛选（如 isFictional=true ）
1. 艺术家 API
GET /artists
GET /artists/:id
POST /artists
PUT /artists/:id
DELETE /artists/:id
可选参数
include=notableWorks,associatedMovements,agent.connectedNetworkIds
支持根据社交
图谱推荐好友、群组艺术家、AI互动模拟
2. 艺术作品 API
GET /artworks
GET /artworks/:id
POST /artworks
PUT /artworks/:id
DELETE /artworks/:id
支持 styleVector 相似度推荐：GET /artworks/:id/similar?threshold=0.8
支持根据标签、风格、时间进行推荐
3. 艺术运动 API
GET /movements
GET /movements/:id
POST /movements
PUT /movements/:id
DELETE /movements/:id
MongoDB 数据API需求文档 v1 4
四、接口响应格式
统一响应结构：
{
"success": true,
"data": {...},
"message": "操作成功"
,
"code": 200
}
失败示例：
{
"success": false,
"data": null,
"message": "找不到该艺术家"
,
"code": 404
}
五、性能与扩展建议
所有集
合建议对以下字段建立索引： name , tags , artistId , movementIds , updatedAt ,
isFictional
使用 lean() 提升查询性能
分页使用 skip/limit ，或未来支持 cursor-based
若流量上升可使用 Redis 做缓存
所有数据带 updatedAt 字段，便于前端缓存更新
可按 project 分库或分集
合处理，提升独立性与隔离性
可将 styleVector
存
入向量数据库（如 Pinecone / Milvus）以提升风格推荐效率
MongoDB 数据API需求文档 v1 5
六、未来扩展方向
增加 AI Agent 独立模型（支持状态
储、行为模拟、对话日志等）
存
支持基于 movement / agent 状态的社交
活动模拟
提供数据
同步 / 批量更新 API
管理后台或内嵌轻量级 CMS 界面
支持艺术家跨项目复用及虚构-
真实角色混合
映射
建立艺术家之间的社交网络结构（可通过 agent.connectedNetworkIds 实现关系
网）
艺术作品支持风格推荐与相似查询，结合
风格向量 + 标签 + movement
七、开发建议
技术栈推荐：Express.js + Mongoose
可使用 Swagger/OpenAPI 文档规范进行接口说明书生成
推荐使用 Postman 做接口
测试
前端建议引入请求缓存与数据去重策略（特别是关联字段查询）
若接入 AI 模型，可预先
存
储 embedding 数据至向量数据库，提升推荐系统性能
如需样例代码或接口模拟，可单独提出由我生成。
MongoDB 数据API需求文档 v1 6