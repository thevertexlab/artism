from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from typing import List, Optional

from app.schemas.artist import Artist, ArtistCreate, ArtistUpdate, ArtistResponse
from app.schemas.response import APIResponse, PaginatedResponse
from app.services.artist_service import ArtistService
from app.utils.query_params import QueryParams

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[Artist])
async def get_artists(params: QueryParams = Depends()):
    """
    获取所有艺术家

    支持查询参数：project, fields, include, search, tags, yearFrom, yearTo, sortBy, order, page, pageSize, isFictional
    """
    try:
        response = ArtistService.get_all(params)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artists: {str(e)}")

@router.get("/{artist_id}", response_model=APIResponse[Artist])
async def get_artist(artist_id: str = Path(..., description="艺术家ID")):
    """
    获取特定艺术家

    根据ID获取特定艺术家的详细信息

    Args:
        artist_id: 艺术家ID
    """
    try:
        response = ArtistService.get_by_id(artist_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artist: {str(e)}")

@router.post("/", response_model=APIResponse[Artist], status_code=status.HTTP_201_CREATED)
async def create_artist(artist: ArtistCreate):
    """
    创建艺术家

    创建新的艺术家记录

    Args:
        artist: 艺术家创建模式
    """
    try:
        response = ArtistService.create(artist.dict())
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating artist: {str(e)}")

@router.put("/{artist_id}", response_model=APIResponse[Artist])
async def update_artist(
    artist_update: ArtistUpdate,
    artist_id: str = Path(..., description="艺术家ID")
):
    """
    更新艺术家

    更新特定艺术家的信息

    Args:
        artist_id: 艺术家ID
        artist_update: 艺术家更新模式
    """
    try:
        # 过滤掉 None 值，只更新提供的字段
        update_data = {k: v for k, v in artist_update.dict().items() if v is not None}

        response = ArtistService.update(artist_id, update_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating artist: {str(e)}")

@router.delete("/{artist_id}", response_model=APIResponse)
async def delete_artist(artist_id: str = Path(..., description="艺术家ID")):
    """
    删除艺术家

    删除特定艺术家的记录

    Args:
        artist_id: 艺术家ID
    """
    try:
        response = ArtistService.delete(artist_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting artist: {str(e)}")

@router.get("/search/", response_model=APIResponse[List[Artist]])
async def search_artists(
    query: str = Query(..., description="搜索关键词"),
    limit: int = Query(10, description="结果数量限制")
):
    """
    搜索艺术家

    根据关键词在艺术家姓名、简介、国籍、标签中搜索

    Args:
        query: 搜索关键词
        limit: 结果数量限制
    """
    try:
        artists = ArtistService.search_artists(query, limit)
        from app.schemas.response import create_success_response
        return create_success_response(data=artists, message=f"找到 {len(artists)} 个匹配的艺术家")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching artists: {str(e)}")

@router.get("/fictional/", response_model=APIResponse[List[Artist]])
async def get_fictional_artists(
    project: Optional[str] = Query(None, description="项目名称筛选")
):
    """
    获取虚构艺术家

    Args:
        project: 项目名称筛选（如 'zhuyizhuyi'）
    """
    try:
        artists = ArtistService.get_fictional_artists(project)
        from app.schemas.response import create_success_response
        return create_success_response(data=artists, message=f"找到 {len(artists)} 个虚构艺术家")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching fictional artists: {str(e)}")

@router.get("/real/", response_model=APIResponse[List[Artist]])
async def get_real_artists():
    """
    获取真实艺术家
    """
    try:
        artists = ArtistService.get_real_artists()
        from app.schemas.response import create_success_response
        return create_success_response(data=artists, message=f"找到 {len(artists)} 个真实艺术家")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching real artists: {str(e)}")

@router.get("/{artist_id}/social-network/", response_model=APIResponse[List[Artist]])
async def get_artist_social_network(artist_id: str = Path(..., description="艺术家ID")):
    """
    获取艺术家的社交网络

    Args:
        artist_id: 艺术家ID
    """
    try:
        connected_artists = ArtistService.get_artist_social_network(artist_id)
        from app.schemas.response import create_success_response
        return create_success_response(data=connected_artists, message=f"找到 {len(connected_artists)} 个连接的艺术家")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artist social network: {str(e)}")