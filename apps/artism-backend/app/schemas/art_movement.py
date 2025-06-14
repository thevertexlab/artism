from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ArtMovementBase(BaseModel):
    """艺术运动基础模式"""
    name: str
    description: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    key_artists: List[str] = []
    representative_works: List[str] = []
    tags: List[str] = []


class ArtMovementCreate(ArtMovementBase):
    """创建艺术运动模式"""
    pass


class ArtMovementUpdate(BaseModel):
    """更新艺术运动模式"""
    name: Optional[str] = None
    description: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    key_artists: Optional[List[str]] = None
    representative_works: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class ArtMovement(ArtMovementBase):
    """艺术运动完整模式"""
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ArtMovementDetail(ArtMovement):
    """艺术运动详情模式"""
    artist_names: Optional[List[str]] = None
    artwork_titles: Optional[List[str]] = None
    duration: Optional[int] = None
    is_active: Optional[bool] = None


class ArtMovementStatistics(BaseModel):
    """艺术运动统计信息"""
    movement_id: str
    name: str
    key_artists_count: int
    representative_works_count: int
    duration: Optional[int] = None
    tags_count: int


class TimelineEntry(BaseModel):
    """时间线条目"""
    movement_id: str
    name: str
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    description: Optional[str] = None
    key_artists_count: int
    representative_works_count: int


class PeriodQuery(BaseModel):
    """时期查询参数"""
    start_year: int = Field(..., description="起始年份")
    end_year: int = Field(..., description="结束年份")
    
    class Config:
        schema_extra = {
            "example": {
                "start_year": 1850,
                "end_year": 1950
            }
        }


class ArtistMovementRequest(BaseModel):
    """艺术家-运动关联请求"""
    artist_id: str = Field(..., description="艺术家ID")
    
    class Config:
        schema_extra = {
            "example": {
                "artist_id": "artist_123"
            }
        }


class ArtworkMovementRequest(BaseModel):
    """作品-运动关联请求"""
    artwork_id: str = Field(..., description="作品ID")
    
    class Config:
        schema_extra = {
            "example": {
                "artwork_id": "artwork_456"
            }
        }
