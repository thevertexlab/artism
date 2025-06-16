from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

class ArtistBase(BaseModel):
    """艺术家基础模型"""
    name: str = Field(..., description="艺术家姓名")
    birth_year: Optional[int] = Field(None, description="出生年份")
    death_year: Optional[int] = Field(None, description="逝世年份")
    nationality: Optional[str] = Field(None, description="国籍")
    art_movement: Optional[str] = Field(None, description="艺术流派")
    biography: Optional[str] = Field(None, description="传记")
    style_description: Optional[str] = Field(None, description="风格描述")
    famous_works: Optional[List[str]] = Field(default=[], description="著名作品列表")
    ai_personality: Optional[str] = Field(None, description="AI人格设定")

class ArtistCreate(ArtistBase):
    """创建艺术家模型"""
    pass

class ArtistUpdate(BaseModel):
    """更新艺术家模型"""
    name: Optional[str] = None
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    nationality: Optional[str] = None
    art_movement: Optional[str] = None
    biography: Optional[str] = None
    style_description: Optional[str] = None
    famous_works: Optional[List[str]] = None
    ai_personality: Optional[str] = None

class ArtistInDB(ArtistBase):
    """数据库中的艺术家模型"""
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True

class Artist(ArtistInDB):
    """API响应中的艺术家模型"""
    pass

class ArtistSearchParams(BaseModel):
    """艺术家搜索参数"""
    name: Optional[str] = None
    movement: Optional[str] = None
    nationality: Optional[str] = None
    limit: int = 10
    skip: int = 0 