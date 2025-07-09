from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class CommentBase(BaseModel):
    """评论基础模式"""
    content: str = Field(..., description="评论内容")
    author_id: str = Field(..., description="评论者ID")
    target_type: str = Field(..., description="目标类型: artwork, artist, comment, post")
    target_id: str = Field(..., description="目标ID")
    parent_comment_id: Optional[str] = Field(None, description="父评论ID，用于回复")
    sentiment: Optional[str] = Field(None, description="情感倾向: positive, negative, neutral")
    ai_generated: bool = Field(True, description="是否为AI生成")
    generation_context: Optional[Dict[str, Any]] = Field(None, description="生成上下文信息")

class CommentCreate(CommentBase):
    """创建评论模式"""
    pass

class CommentUpdate(BaseModel):
    """更新评论模式"""
    content: Optional[str] = None
    sentiment: Optional[str] = None
    generation_context: Optional[Dict[str, Any]] = None

class Comment(CommentBase):
    """评论完整模式"""
    id: str = Field(..., description="评论ID")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        from_attributes = True

class CommentResponse(Comment):
    """评论响应模式，包含关联信息"""
    author_name: Optional[str] = Field(None, description="评论者姓名")
    target_name: Optional[str] = Field(None, description="目标名称")
    replies: Optional[List['CommentResponse']] = Field(None, description="回复列表")
    reply_count: int = Field(0, description="回复数量")
    likes_count: int = Field(0, description="点赞数量")

class CommentThread(BaseModel):
    """评论线程模式"""
    id: str = Field(..., description="线程ID")
    topic: str = Field(..., description="话题")
    participants: List[str] = Field(..., description="参与者ID列表")
    status: str = Field("active", description="状态: active, completed, paused")
    thread_type: str = Field("discussion", description="类型: discussion, debate, collaboration")
    max_comments: int = Field(10, description="最大评论数")
    comment_count: int = Field(0, description="当前评论数")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

class CreateThreadRequest(BaseModel):
    """创建线程请求"""
    topic: str = Field(..., description="话题")
    participant_ids: List[str] = Field(..., description="参与者ID列表")
    thread_type: str = Field("discussion", description="线程类型")
    max_comments: int = Field(10, description="最大评论数")

class GenerateCommentsRequest(BaseModel):
    """生成评论请求"""
    max_comments: int = Field(5, description="最大生成评论数")
    target_type: Optional[str] = Field(None, description="目标类型过滤")
    target_id: Optional[str] = Field(None, description="目标ID过滤")

class CommentStats(BaseModel):
    """评论统计模式"""
    total_comments: int = Field(0, description="总评论数")
    ai_generated_comments: int = Field(0, description="AI生成评论数")
    active_threads: int = Field(0, description="活跃线程数")
    most_active_artists: List[Dict[str, Any]] = Field([], description="最活跃艺术家")
    sentiment_distribution: Dict[str, int] = Field({}, description="情感分布")

# 解决前向引用问题
CommentResponse.model_rebuild()
