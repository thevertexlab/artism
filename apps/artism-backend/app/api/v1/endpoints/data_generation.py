from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from pydantic import BaseModel, Field

from app.schemas.response import APIResponse
from app.utils.data_generator import (
    ArtistDataGenerator, ArtworkDataGenerator, ArtMovementDataGenerator, FullDatasetGenerator
)
from app.services.artist_service import ArtistService
from app.services.artwork_service import ArtworkService
from app.services.art_movement_service import ArtMovementService

router = APIRouter()


class ArtistGenerationRequest(BaseModel):
    """艺术家生成请求"""
    count: int = Field(5, ge=1, le=50, description="生成数量")
    fictional: bool = Field(False, description="是否为虚构艺术家")
    project: str = Field("zhuyizhuyi", description="项目名称（仅虚构艺术家）")


class ArtworkGenerationRequest(BaseModel):
    """艺术品生成请求"""
    count: int = Field(10, ge=1, le=100, description="生成数量")
    fictional: bool = Field(False, description="是否为虚构作品")


class MovementGenerationRequest(BaseModel):
    """艺术运动生成请求"""
    fictional: bool = Field(False, description="是否为虚构运动")


class FullDatasetRequest(BaseModel):
    """完整数据集生成请求"""
    real_artists_count: int = Field(5, ge=1, le=20, description="真实艺术家数量")
    fictional_artists_count: int = Field(5, ge=1, le=20, description="虚构艺术家数量")
    artworks_per_artist: int = Field(2, ge=1, le=10, description="每个艺术家的作品数量")
    include_movements: bool = Field(True, description="是否包含艺术运动")
    clear_existing: bool = Field(False, description="是否清除现有数据")


@router.post("/artists", response_model=APIResponse)
async def generate_artists(request: ArtistGenerationRequest):
    """
    生成艺术家数据
    
    Args:
        request: 艺术家生成请求
    """
    try:
        if request.fictional:
            artists_data = ArtistDataGenerator.generate_fictional_artists(
                count=request.count,
                project=request.project
            )
        else:
            artists_data = ArtistDataGenerator.generate_real_artists(count=request.count)
        
        # 批量插入数据库
        created_count = 0
        errors = []
        
        for artist_data in artists_data:
            try:
                response = ArtistService.create(artist_data)
                if response.success:
                    created_count += 1
                else:
                    errors.append(f"Failed to create artist {artist_data['name']}: {response.message}")
            except Exception as e:
                errors.append(f"Error creating artist {artist_data['name']}: {str(e)}")
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data={
                "generated_count": len(artists_data),
                "created_count": created_count,
                "errors": errors,
                "type": "fictional" if request.fictional else "real"
            },
            message=f"成功生成 {created_count} 个{'虚构' if request.fictional else '真实'}艺术家"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating artists: {str(e)}")


@router.post("/artworks", response_model=APIResponse)
async def generate_artworks(request: ArtworkGenerationRequest):
    """
    生成艺术品数据
    
    Args:
        request: 艺术品生成请求
    """
    try:
        # 获取现有艺术家
        artists_response = ArtistService.get_all()
        if not artists_response.success or not artists_response.data:
            raise HTTPException(status_code=400, detail="No artists found. Please create artists first.")
        
        # 筛选艺术家
        if request.fictional:
            artist_ids = [artist["id"] for artist in artists_response.data if artist.get("is_fictional", False)]
        else:
            artist_ids = [artist["id"] for artist in artists_response.data if not artist.get("is_fictional", False)]
        
        if not artist_ids:
            raise HTTPException(
                status_code=400, 
                detail=f"No {'fictional' if request.fictional else 'real'} artists found."
            )
        
        # 生成艺术品数据
        artworks_data = ArtworkDataGenerator.generate_artworks(
            artist_ids=artist_ids,
            count=request.count,
            fictional=request.fictional
        )
        
        # 批量插入数据库
        created_count = 0
        errors = []
        
        for artwork_data in artworks_data:
            try:
                response = ArtworkService.create(artwork_data)
                if response.success:
                    created_count += 1
                else:
                    errors.append(f"Failed to create artwork {artwork_data['title']}: {response.message}")
            except Exception as e:
                errors.append(f"Error creating artwork {artwork_data['title']}: {str(e)}")
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data={
                "generated_count": len(artworks_data),
                "created_count": created_count,
                "errors": errors,
                "type": "fictional" if request.fictional else "real"
            },
            message=f"成功生成 {created_count} 件{'虚构' if request.fictional else '真实'}艺术品"
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating artworks: {str(e)}")


@router.post("/art-movements", response_model=APIResponse)
async def generate_art_movements(request: MovementGenerationRequest):
    """
    生成艺术运动数据
    
    Args:
        request: 艺术运动生成请求
    """
    try:
        movements_data = ArtMovementDataGenerator.generate_movements(fictional=request.fictional)
        
        # 批量插入数据库
        created_count = 0
        errors = []
        
        for movement_data in movements_data:
            try:
                response = ArtMovementService.create(movement_data)
                if response.success:
                    created_count += 1
                else:
                    errors.append(f"Failed to create movement {movement_data['name']}: {response.message}")
            except Exception as e:
                errors.append(f"Error creating movement {movement_data['name']}: {str(e)}")
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data={
                "generated_count": len(movements_data),
                "created_count": created_count,
                "errors": errors,
                "type": "fictional" if request.fictional else "real"
            },
            message=f"成功生成 {created_count} 个{'虚构' if request.fictional else '真实'}艺术运动"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating art movements: {str(e)}")


@router.post("/full-dataset", response_model=APIResponse)
async def generate_full_dataset(request: FullDatasetRequest):
    """
    生成完整数据集
    
    Args:
        request: 完整数据集生成请求
    """
    try:
        # 清除现有数据（如果需要）
        if request.clear_existing:
            # 这里可以添加清除逻辑，但为了安全起见，暂时跳过
            pass
        
        # 生成完整数据集
        dataset = FullDatasetGenerator.generate_complete_dataset(
            real_artists_count=request.real_artists_count,
            fictional_artists_count=request.fictional_artists_count,
            artworks_per_artist=request.artworks_per_artist,
            include_movements=request.include_movements
        )
        
        # 统计信息
        stats = {
            "artists": {"generated": 0, "created": 0, "errors": []},
            "artworks": {"generated": 0, "created": 0, "errors": []},
            "movements": {"generated": 0, "created": 0, "errors": []}
        }
        
        # 插入艺术家
        for artist_data in dataset["artists"]:
            stats["artists"]["generated"] += 1
            try:
                response = ArtistService.create(artist_data)
                if response.success:
                    stats["artists"]["created"] += 1
                else:
                    stats["artists"]["errors"].append(f"Failed to create artist {artist_data['name']}")
            except Exception as e:
                stats["artists"]["errors"].append(f"Error creating artist {artist_data['name']}: {str(e)}")
        
        # 插入艺术品
        for artwork_data in dataset["artworks"]:
            stats["artworks"]["generated"] += 1
            try:
                response = ArtworkService.create(artwork_data)
                if response.success:
                    stats["artworks"]["created"] += 1
                else:
                    stats["artworks"]["errors"].append(f"Failed to create artwork {artwork_data['title']}")
            except Exception as e:
                stats["artworks"]["errors"].append(f"Error creating artwork {artwork_data['title']}: {str(e)}")
        
        # 插入艺术运动
        if request.include_movements:
            for movement_data in dataset["movements"]:
                stats["movements"]["generated"] += 1
                try:
                    response = ArtMovementService.create(movement_data)
                    if response.success:
                        stats["movements"]["created"] += 1
                    else:
                        stats["movements"]["errors"].append(f"Failed to create movement {movement_data['name']}")
                except Exception as e:
                    stats["movements"]["errors"].append(f"Error creating movement {movement_data['name']}: {str(e)}")
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data=stats,
            message=f"完整数据集生成完成：艺术家 {stats['artists']['created']}/{stats['artists']['generated']}，"
                   f"艺术品 {stats['artworks']['created']}/{stats['artworks']['generated']}，"
                   f"艺术运动 {stats['movements']['created']}/{stats['movements']['generated']}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating full dataset: {str(e)}")


@router.get("/sample-data", response_model=APIResponse)
async def get_sample_data():
    """
    获取示例数据（不插入数据库）
    """
    try:
        # 生成示例数据
        real_artists = ArtistDataGenerator.generate_real_artists(2)
        fictional_artists = ArtistDataGenerator.generate_fictional_artists(2)
        
        artist_ids = [artist["id"] for artist in real_artists + fictional_artists]
        artworks = ArtworkDataGenerator.generate_artworks(artist_ids, 4)
        movements = ArtMovementDataGenerator.generate_movements()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data={
                "real_artists": real_artists,
                "fictional_artists": fictional_artists,
                "artworks": artworks,
                "movements": movements
            },
            message="示例数据生成成功（未插入数据库）"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating sample data: {str(e)}")
