from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

class ArtworkBase(BaseModel):
    """艺术作品基础模型"""
    title: str = Field(..., description="作品标题")
    artist_id: UUID = Field(..., description="艺术家ID")
    year: Optional[int] = Field(None, description="创作年份")
    medium: Optional[str] = Field(None, description="创作媒介")
    dimensions: Optional[str] = Field(None, description="尺寸")
    description: Optional[str] = Field(None, description="描述")
    style_tags: Optional[List[str]] = Field(default=[], description="风格标签")
    image_url: Optional[str] = Field(None, description="图片URL")

class ArtworkCreate(ArtworkBase):
    """创建艺术作品模型"""
    pass

class ArtworkUpdate(BaseModel):
    """更新艺术作品模型"""
    title: Optional[str] = None
    year: Optional[int] = None
    medium: Optional[str] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None
    style_tags: Optional[List[str]] = None
    image_url: Optional[str] = None

class ArtworkInDB(ArtworkBase):
    """数据库中的艺术作品模型"""
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True

class Artwork(ArtworkInDB):
    """API响应中的艺术作品模型"""
    pass 