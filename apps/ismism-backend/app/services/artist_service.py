from typing import List, Optional
from uuid import UUID
from app.db.mongodb.database import get_database
from app.schemas import Artist, ArtistCreate, ArtistUpdate, ArtistSearchParams
from datetime import datetime

async def get_all_artists(skip: int = 0, limit: int = 100, movement_id: Optional[UUID] = None) -> List[Artist]:
    """获取所有艺术家"""
    db = get_database()
    query = {}
    if movement_id:
        query["movement_id"] = str(movement_id)
    
    cursor = db.artists.find(query).skip(skip).limit(limit)
    artists = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        artists.append(Artist(**doc))
    return artists

async def search_artists(params: ArtistSearchParams) -> List[Artist]:
    """搜索艺术家"""
    db = get_database()
    query = {}
    
    if params.name:
        query["name"] = {"$regex": params.name, "$options": "i"}
    if params.movement:
        query["art_movement"] = {"$regex": params.movement, "$options": "i"}
    if params.nationality:
        query["nationality"] = {"$regex": params.nationality, "$options": "i"}
    
    cursor = db.artists.find(query).skip(params.skip).limit(params.limit)
    artists = []
    async for doc in cursor:
        doc["id"] = doc.pop("_id")
        artists.append(Artist(**doc))
    return artists

async def get_artist_by_id(artist_id: UUID) -> Optional[Artist]:
    """通过ID获取艺术家"""
    db = get_database()
    doc = await db.artists.find_one({"_id": str(artist_id)})
    if doc:
        doc["id"] = doc.pop("_id")
        return Artist(**doc)
    return None

async def create_artist(artist: ArtistCreate) -> Artist:
    """创建艺术家"""
    db = get_database()
    artist_dict = artist.dict()
    artist_dict["_id"] = str(UUID())
    artist_dict["created_at"] = datetime.utcnow()
    artist_dict["updated_at"] = datetime.utcnow()
    
    await db.artists.insert_one(artist_dict)
    artist_dict["id"] = artist_dict.pop("_id")
    return Artist(**artist_dict)

async def update_artist(artist_id: UUID, artist_update: ArtistUpdate) -> Optional[Artist]:
    """更新艺术家"""
    db = get_database()
    update_data = {k: v for k, v in artist_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.artists.update_one(
        {"_id": str(artist_id)},
        {"$set": update_data}
    )
    
    if result.modified_count:
        return await get_artist_by_id(artist_id)
    return None

async def delete_artist(artist_id: UUID) -> bool:
    """删除艺术家"""
    db = get_database()
    result = await db.artists.delete_one({"_id": str(artist_id)})
    return result.deleted_count > 0 