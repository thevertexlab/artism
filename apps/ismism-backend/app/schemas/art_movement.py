from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

class ArtMovementBase(BaseModel):
    """艺术流派基础模型"""
    name: str = Field(..., description="流派名称")
    start_year: Optional[int] = Field(None, description="开始年份")
    end_year: Optional[int] = Field(None, description="结束年份")
    description: Optional[str] = Field(None, description="描述")
    characteristics: Optional[List[str]] = Field(default=[], description="特点")
    key_artists: Optional[List[str]] = Field(default=[], description="代表艺术家")
    influences: Optional[List[str]] = Field(default=[], description="影响")
    image_url: Optional[str] = Field(None, description="代表图片URL")

class ArtMovementCreate(ArtMovementBase):
    """创建艺术流派模型"""
    pass

class ArtMovementUpdate(BaseModel):
    """更新艺术流派模型"""
    name: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    description: Optional[str] = None
    characteristics: Optional[List[str]] = None
    key_artists: Optional[List[str]] = None
    influences: Optional[List[str]] = None
    image_url: Optional[str] = None

class ArtMovementInDB(ArtMovementBase):
    """数据库中的艺术流派模型"""
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True

class ArtMovement(ArtMovementInDB):
    """API响应中的艺术流派模型"""
    pass 