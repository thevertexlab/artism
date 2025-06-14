from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.artist import Artist
from app.services.artist_service import ArtistService

router = APIRouter()

@router.get("/", response_model=List[Artist])
async def get_ai_artists():
    """
    获取所有AI艺术家
    
    返回可以进行AI交互的艺术家列表
    目前返回所有艺术家，因为每个艺术家都可以进行AI交互
    """
    try:
        # 获取所有艺术家作为AI艺术家
        # 在实际应用中，可以添加一个字段来标识哪些艺术家支持AI交互
        artists = ArtistService.get_all_artists()
        
        # 为每个艺术家添加AI相关的描述
        for artist in artists:
            if hasattr(artist, 'bio'):
                artist.bio = f"AI {artist.name} - {artist.bio}"
        
        return artists
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching AI artists: {str(e)}")

@router.get("/{artist_id}", response_model=Artist)
async def get_ai_artist(artist_id: int):
    """
    获取特定AI艺术家
    
    根据ID获取特定AI艺术家的详细信息
    
    Args:
        artist_id: 艺术家ID
    """
    try:
        artist = ArtistService.get_artist_by_id(artist_id)
        
        if not artist:
            raise HTTPException(status_code=404, detail="AI Artist not found")
        
        # 为AI艺术家添加特殊标识
        if hasattr(artist, 'bio'):
            artist.bio = f"AI {artist.name} - {artist.bio}"
        
        return artist
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching AI artist: {str(e)}") 