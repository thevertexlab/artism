from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class FictionalMeta(BaseModel):
    """虚构艺术家元数据"""
    origin_project: str
    origin_story: Optional[str] = None
    fictional_style: List[str] = []
    model_prompt_seed: Optional[str] = None

class Agent(BaseModel):
    """AI代理配置"""
    enabled: bool = False
    personality_profile: Optional[str] = None
    prompt_seed: Optional[str] = None
    connected_network_ids: List[str] = []

class ArtistBase(BaseModel):
    """艺术家基础模式"""
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    nationality: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    notable_works: List[str] = []
    associated_movements: List[str] = []
    tags: List[str] = []
    is_fictional: bool = False
    fictional_meta: Optional[FictionalMeta] = None
    agent: Optional[Agent] = None

class ArtistCreate(ArtistBase):
    """创建艺术家模式"""
    pass

class ArtistUpdate(BaseModel):
    """更新艺术家模式"""
    name: Optional[str] = None
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    nationality: Optional[str] = None
    bio: Optional[str] = None
    art_movement: Optional[str] = None
    image_url: Optional[str] = None

class Artist(ArtistBase):
    """艺术家完整模式"""
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CSVUploadResponse(BaseModel):
    """CSV上传响应模式"""
    filename: str
    rows_processed: int
    status: str

class QueryParams(BaseModel):
    """查询参数模式"""
    name: Optional[str] = None
    nationality: Optional[str] = None
    style: Optional[str] = None
    min_year: Optional[int] = None
    max_year: Optional[int] = None

class ArtistResponse(BaseModel):
    """艺术家响应模式"""
    data: List[Artist]
    total: int
    page: int = 1
    page_size: int = 10
    
class ArtistDetail(Artist):
    """艺术家详情模式"""
    works: Optional[List[Dict[str, Any]]] = None
    exhibitions: Optional[List[Dict[str, Any]]] = None
    related_artists: Optional[List[Dict[str, Any]]] = None

class AIInteractionRequest(BaseModel):
    """AI交互请求模式"""
    message: str = Field(..., description="用户发送给AI艺术家的消息")
    artist_id: Optional[int] = Field(None, description="特定艺术家ID，如果为空则使用默认AI艺术家")
    
class AIInteractionResponse(BaseModel):
    """AI交互响应模式"""
    response: str = Field(..., description="AI艺术家的回复")
    artist_name: str = Field(..., description="回复的AI艺术家名称") 