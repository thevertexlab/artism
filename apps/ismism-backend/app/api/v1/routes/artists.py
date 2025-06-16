from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from uuid import UUID
from app.schemas import Artist, ArtistCreate, ArtistUpdate, ArtistSearchParams
from app.services.artist_service import (
    get_all_artists, 
    get_artist_by_id, 
    create_artist, 
    update_artist, 
    delete_artist,
    search_artists
)

router = APIRouter()

@router.get("/", response_model=List[Artist])
async def read_artists(
    skip: int = 0, 
    limit: int = 100, 
    movement_id: Optional[UUID] = None
):
    """
    获取所有艺术家
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的最大记录数
    - **movement_id**: 可选的艺术流派ID过滤
    """
    artists = await get_all_artists(skip, limit, movement_id)
    return artists

@router.get("/search", response_model=List[Artist])
async def search_artists_endpoint(
    name: Optional[str] = None,
    movement: Optional[str] = None,
    nationality: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """
    搜索艺术家
    
    - **name**: 艺术家姓名（部分匹配）
    - **movement**: 艺术流派（部分匹配）
    - **nationality**: 国籍（部分匹配）
    - **limit**: 返回的最大记录数
    - **skip**: 跳过的记录数
    """
    search_params = ArtistSearchParams(
        name=name,
        movement=movement,
        nationality=nationality,
        limit=limit,
        skip=skip
    )
    artists = await search_artists(search_params)
    return artists

@router.get("/{artist_id}", response_model=Artist)
async def read_artist(artist_id: UUID):
    """
    获取特定艺术家
    
    - **artist_id**: 艺术家ID
    """
    artist = await get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return artist

@router.post("/", response_model=Artist)
async def create_artist_endpoint(artist: ArtistCreate):
    """
    创建艺术家
    
    - **artist**: 艺术家信息
    """
    return await create_artist(artist)

@router.put("/{artist_id}", response_model=Artist)
async def update_artist_endpoint(artist_id: UUID, artist_update: ArtistUpdate):
    """
    更新艺术家
    
    - **artist_id**: 艺术家ID
    - **artist_update**: 更新的艺术家信息
    """
    updated_artist = await update_artist(artist_id, artist_update)
    if not updated_artist:
        raise HTTPException(status_code=404, detail="Artist not found")
    return updated_artist

@router.delete("/{artist_id}")
async def delete_artist_endpoint(artist_id: UUID):
    """
    删除艺术家
    
    - **artist_id**: 艺术家ID
    """
    success = await delete_artist(artist_id)
    if not success:
        raise HTTPException(status_code=404, detail="Artist not found")
    return {"message": "Artist deleted successfully"} 