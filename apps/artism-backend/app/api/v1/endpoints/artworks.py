from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from typing import List, Optional

from app.schemas.artwork import Artwork, ArtworkCreate, ArtworkUpdate, ArtworkResponse, SimilarArtworkRequest
from app.schemas.response import APIResponse, PaginatedResponse
from app.services.artwork_service import ArtworkService
from app.services.artist_service import ArtistService
from app.utils.query_params import QueryParams

router = APIRouter()

@router.get("/", response_model=PaginatedResponse[Artwork])
async def get_artworks(params: QueryParams = Depends()):
    """
    获取所有艺术品

    支持查询参数：project, fields, include, search, tags, yearFrom, yearTo, sortBy, order, page, pageSize
    """
    try:
        response = ArtworkService.get_all(params)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artworks: {str(e)}")

# Removed import_test_data endpoint - will be handled by data generation utilities

@router.get("/{artwork_id}", response_model=APIResponse[Artwork])
async def get_artwork(artwork_id: str = Path(..., description="艺术品ID")):
    """
    获取特定艺术品

    根据ID获取特定艺术品的详细信息

    Args:
        artwork_id: 艺术品ID
    """
    try:
        response = ArtworkService.get_by_id(artwork_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artwork: {str(e)}")

@router.post("/", response_model=APIResponse[Artwork], status_code=status.HTTP_201_CREATED)
async def create_artwork(artwork: ArtworkCreate):
    """
    创建艺术品

    创建新的艺术品记录

    Args:
        artwork: 艺术品数据
    """
    try:
        response = ArtworkService.create(artwork.dict())
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating artwork: {str(e)}")

@router.put("/{artwork_id}", response_model=APIResponse[Artwork])
async def update_artwork(artwork_data: ArtworkUpdate, artwork_id: str = Path(..., description="艺术品ID")):
    """
    更新艺术品

    更新特定艺术品的信息

    Args:
        artwork_id: 艺术品ID
        artwork_data: 艺术品更新数据
    """
    try:
        # 过滤掉 None 值，只更新提供的字段
        update_data = {k: v for k, v in artwork_data.dict().items() if v is not None}
        response = ArtworkService.update(artwork_id, update_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating artwork: {str(e)}")

@router.delete("/{artwork_id}", response_model=APIResponse)
async def delete_artwork(artwork_id: str = Path(..., description="艺术品ID")):
    """
    删除艺术品

    删除特定艺术品

    Args:
        artwork_id: 艺术品ID
    """
    try:
        response = ArtworkService.delete(artwork_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting artwork: {str(e)}")

@router.get("/artist/{artist_id}", response_model=APIResponse[List[Artwork]])
async def get_artworks_by_artist(artist_id: str = Path(..., description="艺术家ID")):
    """
    获取艺术家的艺术品

    根据艺术家ID获取其所有艺术品

    Args:
        artist_id: 艺术家ID
    """
    try:
        artworks = ArtworkService.get_artworks_by_artist(artist_id)
        from app.schemas.response import create_success_response
        return create_success_response(data=artworks, message=f"找到 {len(artworks)} 件作品")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artworks: {str(e)}")

@router.get("/{artwork_id}/similar", response_model=APIResponse[List[Artwork]])
async def get_similar_artworks(
    artwork_id: str = Path(..., description="艺术品ID"),
    threshold: float = Query(0.8, ge=0.0, le=1.0, description="相似度阈值"),
    limit: int = Query(10, ge=1, le=50, description="返回结果数量限制")
):
    """
    获取相似艺术品

    根据风格向量获取相似的艺术品

    Args:
        artwork_id: 艺术品ID
        threshold: 相似度阈值 (0.0-1.0)
        limit: 返回结果数量限制
    """
    try:
        similar_artworks = ArtworkService.get_similar_artworks(artwork_id, threshold, limit)
        from app.schemas.response import create_success_response
        return create_success_response(
            data=similar_artworks,
            message=f"找到 {len(similar_artworks)} 件相似作品"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching similar artworks: {str(e)}")

@router.get("/movement/{movement_id}", response_model=APIResponse[List[Artwork]])
async def get_artworks_by_movement(movement_id: str = Path(..., description="艺术运动ID")):
    """
    获取艺术运动的代表作品

    Args:
        movement_id: 艺术运动ID
    """
    try:
        artworks = ArtworkService.get_artworks_by_movement(movement_id)
        from app.schemas.response import create_success_response
        return create_success_response(data=artworks, message=f"找到 {len(artworks)} 件代表作品")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artworks by movement: {str(e)}")

@router.get("/style/search", response_model=APIResponse[List[Artwork]])
async def search_artworks_by_style(
    tags: str = Query(..., description="风格标签，用逗号分隔"),
    limit: int = Query(10, ge=1, le=50, description="返回结果数量限制")
):
    """
    根据风格标签搜索作品

    Args:
        tags: 风格标签，用逗号分隔
        limit: 返回结果数量限制
    """
    try:
        style_tags = [tag.strip() for tag in tags.split(",") if tag.strip()]
        artworks = ArtworkService.search_artworks_by_style(style_tags, limit)
        from app.schemas.response import create_success_response
        return create_success_response(data=artworks, message=f"找到 {len(artworks)} 件匹配作品")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching artworks by style: {str(e)}")

@router.get("/year-range/", response_model=APIResponse[List[Artwork]])
async def get_artworks_by_year_range(
    start_year: int = Query(..., description="起始年份"),
    end_year: int = Query(..., description="结束年份")
):
    """
    根据年份范围获取作品

    Args:
        start_year: 起始年份
        end_year: 结束年份
    """
    try:
        artworks = ArtworkService.get_artworks_by_year_range(start_year, end_year)
        from app.schemas.response import create_success_response
        return create_success_response(
            data=artworks,
            message=f"找到 {len(artworks)} 件 {start_year}-{end_year} 年间的作品"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artworks by year range: {str(e)}")