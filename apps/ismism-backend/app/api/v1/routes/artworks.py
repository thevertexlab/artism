from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from uuid import UUID
from app.schemas import Artwork, ArtworkCreate, ArtworkUpdate
from app.services.artwork_service import (
    get_all_artworks,
    get_artwork_by_id,
    get_artworks_by_artist,
    create_artwork,
    update_artwork,
    delete_artwork
)

router = APIRouter()

@router.get("/", response_model=List[Artwork])
async def read_artworks(skip: int = 0, limit: int = 100):
    """
    获取所有艺术作品
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的最大记录数
    """
    artworks = await get_all_artworks(skip, limit)
    return artworks

@router.get("/by-artist/{artist_id}", response_model=List[Artwork])
async def read_artworks_by_artist(
    artist_id: UUID,
    skip: int = 0,
    limit: int = 100
):
    """
    获取特定艺术家的所有作品
    
    - **artist_id**: 艺术家ID
    - **skip**: 跳过的记录数
    - **limit**: 返回的最大记录数
    """
    artworks = await get_artworks_by_artist(artist_id, skip, limit)
    return artworks

@router.get("/{artwork_id}", response_model=Artwork)
async def read_artwork(artwork_id: UUID):
    """
    获取特定艺术作品
    
    - **artwork_id**: 艺术作品ID
    """
    artwork = await get_artwork_by_id(artwork_id)
    if not artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return artwork

@router.post("/", response_model=Artwork)
async def create_artwork_endpoint(artwork: ArtworkCreate):
    """
    创建艺术作品
    
    - **artwork**: 艺术作品信息
    """
    return await create_artwork(artwork)

@router.put("/{artwork_id}", response_model=Artwork)
async def update_artwork_endpoint(artwork_id: UUID, artwork_update: ArtworkUpdate):
    """
    更新艺术作品
    
    - **artwork_id**: 艺术作品ID
    - **artwork_update**: 更新的艺术作品信息
    """
    updated_artwork = await update_artwork(artwork_id, artwork_update)
    if not updated_artwork:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return updated_artwork

@router.delete("/{artwork_id}")
async def delete_artwork_endpoint(artwork_id: UUID):
    """
    删除艺术作品
    
    - **artwork_id**: 艺术作品ID
    """
    success = await delete_artwork(artwork_id)
    if not success:
        raise HTTPException(status_code=404, detail="Artwork not found")
    return {"message": "Artwork deleted successfully"} 