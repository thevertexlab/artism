from typing import List, Optional
from uuid import UUID
from app.db.mongodb.database import get_database
from app.schemas import ArtMovement, ArtMovementCreate, ArtMovementUpdate
from datetime import datetime

async def get_all_art_movements(skip: int = 0, limit: int = 100) -> List[ArtMovement]:
    """获取所有艺术流派"""
    db = get_database()
    cursor = db.art_movements.find().skip(skip).limit(limit)
    art_movements = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        art_movements.append(ArtMovement(**doc))
    return art_movements

async def get_art_movement_by_id(movement_id: UUID) -> Optional[ArtMovement]:
    """通过ID获取艺术流派"""
    db = get_database()
    doc = await db.art_movements.find_one({"_id": str(movement_id)})
    if doc:
        doc["id"] = doc.pop("_id")
        return ArtMovement(**doc)
    return None

async def create_art_movement(art_movement: ArtMovementCreate) -> ArtMovement:
    """创建艺术流派"""
    db = get_database()
    movement_dict = art_movement.dict()
    movement_dict["_id"] = str(UUID())
    movement_dict["created_at"] = datetime.utcnow()
    movement_dict["updated_at"] = datetime.utcnow()
    
    await db.art_movements.insert_one(movement_dict)
    movement_dict["id"] = movement_dict.pop("_id")
    return ArtMovement(**movement_dict)

async def update_art_movement(movement_id: UUID, art_movement_update: ArtMovementUpdate) -> Optional[ArtMovement]:
    """更新艺术流派"""
    db = get_database()
    update_data = {k: v for k, v in art_movement_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.art_movements.update_one(
        {"_id": str(movement_id)},
        {"$set": update_data}
    )
    
    if result.modified_count:
        return await get_art_movement_by_id(movement_id)
    return None

async def delete_art_movement(movement_id: UUID) -> bool:
    """删除艺术流派"""
    db = get_database()
    result = await db.art_movements.delete_one({"_id": str(movement_id)})
    return result.deleted_count > 0 