from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from uuid import UUID
from app.schemas import ArtMovement, ArtMovementCreate, ArtMovementUpdate
from app.services.art_movement_service import (
    get_all_art_movements,
    get_art_movement_by_id,
    create_art_movement,
    update_art_movement,
    delete_art_movement
)

router = APIRouter()

@router.get("/", response_model=List[ArtMovement])
async def read_art_movements(skip: int = 0, limit: int = 100):
    """
    获取所有艺术流派
    
    - **skip**: 跳过的记录数
    - **limit**: 返回的最大记录数
    """
    art_movements = await get_all_art_movements(skip, limit)
    return art_movements

@router.get("/{movement_id}", response_model=ArtMovement)
async def read_art_movement(movement_id: UUID):
    """
    获取特定艺术流派
    
    - **movement_id**: 艺术流派ID
    """
    art_movement = await get_art_movement_by_id(movement_id)
    if not art_movement:
        raise HTTPException(status_code=404, detail="Art movement not found")
    return art_movement

@router.post("/", response_model=ArtMovement)
async def create_art_movement_endpoint(art_movement: ArtMovementCreate):
    """
    创建艺术流派
    
    - **art_movement**: 艺术流派信息
    """
    return await create_art_movement(art_movement)

@router.put("/{movement_id}", response_model=ArtMovement)
async def update_art_movement_endpoint(movement_id: UUID, art_movement_update: ArtMovementUpdate):
    """
    更新艺术流派
    
    - **movement_id**: 艺术流派ID
    - **art_movement_update**: 更新的艺术流派信息
    """
    updated_art_movement = await update_art_movement(movement_id, art_movement_update)
    if not updated_art_movement:
        raise HTTPException(status_code=404, detail="Art movement not found")
    return updated_art_movement

@router.delete("/{movement_id}")
async def delete_art_movement_endpoint(movement_id: UUID):
    """
    删除艺术流派
    
    - **movement_id**: 艺术流派ID
    """
    success = await delete_art_movement(movement_id)
    if not success:
        raise HTTPException(status_code=404, detail="Art movement not found")
    return {"message": "Art movement deleted successfully"} 