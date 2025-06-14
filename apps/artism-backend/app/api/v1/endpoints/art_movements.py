from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from typing import List, Optional

from app.schemas.art_movement import (
    ArtMovement, ArtMovementCreate, ArtMovementUpdate, ArtMovementDetail,
    ArtMovementStatistics, TimelineEntry, PeriodQuery, ArtistMovementRequest, ArtworkMovementRequest
)
from app.schemas.response import APIResponse, PaginatedResponse
from app.services.art_movement_service import ArtMovementService
from app.utils.query_params import QueryParams

router = APIRouter()


@router.get("/", response_model=PaginatedResponse[ArtMovement])
async def get_art_movements(params: QueryParams = Depends()):
    """
    获取所有艺术运动
    
    支持查询参数：project, fields, include, search, tags, yearFrom, yearTo, sortBy, order, page, pageSize
    """
    try:
        response = ArtMovementService.get_all(params)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching art movements: {str(e)}")


@router.get("/{movement_id}", response_model=APIResponse[ArtMovement])
async def get_art_movement(movement_id: str = Path(..., description="艺术运动ID")):
    """
    获取特定艺术运动
    
    根据ID获取特定艺术运动的详细信息
    
    Args:
        movement_id: 艺术运动ID
    """
    try:
        response = ArtMovementService.get_by_id(movement_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching art movement: {str(e)}")


@router.post("/", response_model=APIResponse[ArtMovement], status_code=status.HTTP_201_CREATED)
async def create_art_movement(movement: ArtMovementCreate):
    """
    创建艺术运动
    
    创建新的艺术运动记录
    
    Args:
        movement: 艺术运动创建模式
    """
    try:
        response = ArtMovementService.create(movement.dict())
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating art movement: {str(e)}")


@router.put("/{movement_id}", response_model=APIResponse[ArtMovement])
async def update_art_movement(
    movement_update: ArtMovementUpdate,
    movement_id: str = Path(..., description="艺术运动ID")
):
    """
    更新艺术运动
    
    更新特定艺术运动的信息
    
    Args:
        movement_id: 艺术运动ID
        movement_update: 艺术运动更新模式
    """
    try:
        # 过滤掉 None 值，只更新提供的字段
        update_data = {k: v for k, v in movement_update.dict().items() if v is not None}
        response = ArtMovementService.update(movement_id, update_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating art movement: {str(e)}")


@router.delete("/{movement_id}", response_model=APIResponse)
async def delete_art_movement(movement_id: str = Path(..., description="艺术运动ID")):
    """
    删除艺术运动
    
    删除特定艺术运动的记录
    
    Args:
        movement_id: 艺术运动ID
    """
    try:
        response = ArtMovementService.delete(movement_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting art movement: {str(e)}")


@router.get("/search/", response_model=APIResponse[List[ArtMovement]])
async def search_art_movements(
    query: str = Query(..., description="搜索关键词"),
    limit: int = Query(10, description="结果数量限制")
):
    """
    搜索艺术运动
    
    根据关键词在艺术运动名称、描述、标签中搜索
    
    Args:
        query: 搜索关键词
        limit: 结果数量限制
    """
    try:
        movements = ArtMovementService.search_movements(query, limit)
        from app.schemas.response import create_success_response
        return create_success_response(data=movements, message=f"找到 {len(movements)} 个匹配的艺术运动")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching art movements: {str(e)}")


@router.get("/period/", response_model=APIResponse[List[ArtMovement]])
async def get_movements_by_period(
    start_year: int = Query(..., description="起始年份"),
    end_year: int = Query(..., description="结束年份")
):
    """
    根据时期获取艺术运动
    
    获取在指定时期内活跃的艺术运动
    
    Args:
        start_year: 起始年份
        end_year: 结束年份
    """
    try:
        movements = ArtMovementService.get_movements_by_period(start_year, end_year)
        from app.schemas.response import create_success_response
        return create_success_response(
            data=movements, 
            message=f"找到 {len(movements)} 个在 {start_year}-{end_year} 年间活跃的艺术运动"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movements by period: {str(e)}")


@router.get("/active/{year}", response_model=APIResponse[List[ArtMovement]])
async def get_active_movements(year: int = Path(..., description="指定年份")):
    """
    获取指定年份活跃的艺术运动
    
    Args:
        year: 指定年份
    """
    try:
        movements = ArtMovementService.get_active_movements(year)
        from app.schemas.response import create_success_response
        return create_success_response(
            data=movements, 
            message=f"找到 {len(movements)} 个在 {year} 年活跃的艺术运动"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching active movements: {str(e)}")


@router.get("/timeline/", response_model=APIResponse[List[ArtMovement]])
async def get_movements_timeline():
    """
    获取艺术运动时间线
    
    按时间顺序返回所有艺术运动
    """
    try:
        movements = ArtMovementService.get_movements_timeline()
        from app.schemas.response import create_success_response
        return create_success_response(data=movements, message=f"获取到 {len(movements)} 个艺术运动的时间线")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movements timeline: {str(e)}")


@router.get("/{movement_id}/statistics", response_model=APIResponse[ArtMovementStatistics])
async def get_movement_statistics(movement_id: str = Path(..., description="艺术运动ID")):
    """
    获取艺术运动统计信息
    
    Args:
        movement_id: 艺术运动ID
    """
    try:
        stats = ArtMovementService.get_movement_statistics(movement_id)
        if not stats:
            raise HTTPException(status_code=404, detail="Art movement not found")
        
        from app.schemas.response import create_success_response
        return create_success_response(data=stats, message="获取统计信息成功")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movement statistics: {str(e)}")


@router.get("/artist/{artist_id}", response_model=APIResponse[List[ArtMovement]])
async def get_movements_by_artist(artist_id: str = Path(..., description="艺术家ID")):
    """
    根据艺术家获取相关艺术运动
    
    Args:
        artist_id: 艺术家ID
    """
    try:
        movements = ArtMovementService.get_movements_by_artist(artist_id)
        from app.schemas.response import create_success_response
        return create_success_response(data=movements, message=f"找到 {len(movements)} 个相关艺术运动")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching movements by artist: {str(e)}")


@router.post("/{movement_id}/artists", response_model=APIResponse)
async def add_artist_to_movement(
    movement_id: str = Path(..., description="艺术运动ID"),
    request: ArtistMovementRequest = ...
):
    """
    将艺术家添加到艺术运动
    
    Args:
        movement_id: 艺术运动ID
        request: 包含艺术家ID的请求
    """
    try:
        success = ArtMovementService.add_artist_to_movement(movement_id, request.artist_id)
        if success:
            from app.schemas.response import create_success_response
            return create_success_response(message="艺术家添加成功")
        else:
            raise HTTPException(status_code=400, detail="Failed to add artist to movement")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding artist to movement: {str(e)}")


@router.delete("/{movement_id}/artists/{artist_id}", response_model=APIResponse)
async def remove_artist_from_movement(
    movement_id: str = Path(..., description="艺术运动ID"),
    artist_id: str = Path(..., description="艺术家ID")
):
    """
    从艺术运动中移除艺术家
    
    Args:
        movement_id: 艺术运动ID
        artist_id: 艺术家ID
    """
    try:
        success = ArtMovementService.remove_artist_from_movement(movement_id, artist_id)
        if success:
            from app.schemas.response import create_success_response
            return create_success_response(message="艺术家移除成功")
        else:
            raise HTTPException(status_code=400, detail="Failed to remove artist from movement")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing artist from movement: {str(e)}")


@router.post("/{movement_id}/artworks", response_model=APIResponse)
async def add_artwork_to_movement(
    movement_id: str = Path(..., description="艺术运动ID"),
    request: ArtworkMovementRequest = ...
):
    """
    将作品添加到艺术运动的代表作品
    
    Args:
        movement_id: 艺术运动ID
        request: 包含作品ID的请求
    """
    try:
        success = ArtMovementService.add_artwork_to_movement(movement_id, request.artwork_id)
        if success:
            from app.schemas.response import create_success_response
            return create_success_response(message="代表作品添加成功")
        else:
            raise HTTPException(status_code=400, detail="Failed to add artwork to movement")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding artwork to movement: {str(e)}")


@router.delete("/{movement_id}/artworks/{artwork_id}", response_model=APIResponse)
async def remove_artwork_from_movement(
    movement_id: str = Path(..., description="艺术运动ID"),
    artwork_id: str = Path(..., description="作品ID")
):
    """
    从艺术运动的代表作品中移除作品
    
    Args:
        movement_id: 艺术运动ID
        artwork_id: 作品ID
    """
    try:
        success = ArtMovementService.remove_artwork_from_movement(movement_id, artwork_id)
        if success:
            from app.schemas.response import create_success_response
            return create_success_response(message="代表作品移除成功")
        else:
            raise HTTPException(status_code=400, detail="Failed to remove artwork from movement")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing artwork from movement: {str(e)}")
