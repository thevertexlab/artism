from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class PostBase(BaseModel):
    """帖子基础模式"""
    title: str = Field(..., description="帖子标题")
    content: str = Field(..., description="帖子内容")
    author_id: str = Field(..., description="作者ID")
    image_url: Optional[str] = Field(None, description="图片URL")
    artwork_id: Optional[str] = Field(None, description="关联的艺术品ID")
    tags: List[str] = Field([], description="标签列表")
    location: Optional[str] = Field(None, description="位置信息")

class PostCreate(PostBase):
    """创建帖子模式"""
    pass

class PostUpdate(BaseModel):
    """更新帖子模式"""
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    location: Optional[str] = None

class Post(PostBase):
    """帖子完整模式"""
    id: str = Field(..., description="帖子ID")
    likes_count: int = Field(0, description="点赞数")
    comments_count: int = Field(0, description="评论数")
    views_count: int = Field(0, description="浏览数")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        from_attributes = True

class PostResponse(Post):
    """帖子响应模式，包含关联信息"""
    author_name: Optional[str] = Field(None, description="作者姓名")
    author_avatar: Optional[str] = Field(None, description="作者头像")
    author_username: Optional[str] = Field(None, description="作者用户名")
    is_verified: bool = Field(False, description="是否认证")
    timestamp_display: Optional[str] = Field(None, description="显示时间")

class PostWithComments(PostResponse):
    """包含评论的帖子"""
    comments: List[Dict[str, Any]] = Field([], description="评论列表")
    recent_comments: List[Dict[str, Any]] = Field([], description="最近评论")

class PostStats(BaseModel):
    """帖子统计"""
    total_posts: int = Field(0, description="总帖子数")
    total_likes: int = Field(0, description="总点赞数")
    total_comments: int = Field(0, description="总评论数")
    most_active_posts: List[Dict[str, Any]] = Field([], description="最活跃帖子")
    recent_posts: List[PostResponse] = Field([], description="最近帖子")
