from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ArtworkBase(BaseModel):
    """艺术品基础模式"""
    title: str
    artist_id: str
    year: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    movement_ids: List[str] = []
    tags: List[str] = []
    style_vector: List[float] = []

class ArtworkCreate(ArtworkBase):
    """创建艺术品模式"""
    pass

class ArtworkUpdate(BaseModel):
    """更新艺术品模式"""
    title: Optional[str] = None
    artist_id: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    movement_ids: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    style_vector: Optional[List[float]] = None

class Artwork(ArtworkBase):
    """艺术品完整模式"""
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ArtworkResponse(BaseModel):
    """艺术品响应模式"""
    data: List[Artwork]
    total: int
    page: int = 1
    page_size: int = 10
    
class ArtworkDetail(Artwork):
    """艺术品详情模式"""
    artist_name: Optional[str] = None
    similar_artworks: Optional[List[Dict[str, Any]]] = None
    movement_names: Optional[List[str]] = None

class SimilarArtworkRequest(BaseModel):
    """相似作品查询请求"""
    threshold: float = Field(0.8, ge=0.0, le=1.0, description="相似度阈值")
    limit: int = Field(10, ge=1, le=50, description="返回结果数量限制")