from typing import List, Optional
from uuid import UUID
from app.db.mongodb.database import get_database
from app.schemas import Artwork, ArtworkCreate, ArtworkUpdate
from datetime import datetime

async def get_all_artworks(skip: int = 0, limit: int = 100) -> List[Artwork]:
    """获取所有艺术作品"""
    db = get_database()
    cursor = db.artworks.find().skip(skip).limit(limit)
    artworks = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        artworks.append(Artwork(**doc))
    return artworks

async def get_artwork_by_id(artwork_id: UUID) -> Optional[Artwork]:
    """通过ID获取艺术作品"""
    db = get_database()
    doc = await db.artworks.find_one({"_id": str(artwork_id)})
    if doc:
        doc["id"] = doc.pop("_id")
        return Artwork(**doc)
    return None

async def get_artworks_by_artist(artist_id: UUID, skip: int = 0, limit: int = 100) -> List[Artwork]:
    """获取艺术家的所有作品"""
    db = get_database()
    cursor = db.artworks.find({"artist_id": str(artist_id)}).skip(skip).limit(limit)
    artworks = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        artworks.append(Artwork(**doc))
    return artworks

async def create_artwork(artwork: ArtworkCreate) -> Artwork:
    """创建艺术作品"""
    db = get_database()
    artwork_dict = artwork.dict()
    artwork_dict["_id"] = str(UUID())
    artwork_dict["created_at"] = datetime.utcnow()
    artwork_dict["updated_at"] = datetime.utcnow()
    
    # 确保artist_id是字符串
    if isinstance(artwork_dict["artist_id"], UUID):
        artwork_dict["artist_id"] = str(artwork_dict["artist_id"])
    
    await db.artworks.insert_one(artwork_dict)
    artwork_dict["id"] = artwork_dict.pop("_id")
    return Artwork(**artwork_dict)

async def update_artwork(artwork_id: UUID, artwork_update: ArtworkUpdate) -> Optional[Artwork]:
    """更新艺术作品"""
    db = get_database()
    update_data = {k: v for k, v in artwork_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.artworks.update_one(
        {"_id": str(artwork_id)},
        {"$set": update_data}
    )
    
    if result.modified_count:
        return await get_artwork_by_id(artwork_id)
    return None

async def delete_artwork(artwork_id: UUID) -> bool:
    """删除艺术作品"""
    db = get_database()
    result = await db.artworks.delete_one({"_id": str(artwork_id)})
    return result.deleted_count > 0 