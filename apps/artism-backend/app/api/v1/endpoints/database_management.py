from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.schemas.response import APIResponse
from app.utils.database_setup import DatabaseSetup, DatabaseMigration

router = APIRouter()


@router.post("/setup", response_model=APIResponse)
async def setup_database():
    """
    设置数据库（创建集合和索引）
    """
    try:
        DatabaseSetup.setup_database()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            message="数据库设置完成"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error setting up database: {str(e)}")


@router.post("/create-indexes", response_model=APIResponse)
async def create_indexes():
    """
    创建数据库索引
    """
    try:
        DatabaseSetup.create_indexes()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            message="数据库索引创建完成"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating indexes: {str(e)}")


@router.delete("/drop-indexes", response_model=APIResponse)
async def drop_indexes():
    """
    删除数据库索引
    """
    try:
        DatabaseSetup.drop_indexes()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            message="数据库索引删除完成"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error dropping indexes: {str(e)}")


@router.get("/indexes", response_model=APIResponse)
async def list_indexes():
    """
    列出所有数据库索引
    """
    try:
        # 由于 list_indexes 方法打印到控制台，我们需要重新实现
        from app.db.mongodb import get_database
        from app.core.config import ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION
        
        db = get_database()
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        
        indexes_info = {}
        
        for collection_name in collections:
            try:
                collection = db[collection_name]
                indexes = list(collection.list_indexes())
                indexes_info[collection_name] = [
                    {
                        "name": idx["name"],
                        "key": idx.get("key", {}),
                        "unique": idx.get("unique", False)
                    }
                    for idx in indexes
                ]
            except Exception as e:
                indexes_info[collection_name] = {"error": str(e)}
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data=indexes_info,
            message="索引信息获取成功"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing indexes: {str(e)}")


@router.get("/stats", response_model=APIResponse)
async def get_database_stats():
    """
    获取数据库统计信息
    """
    try:
        stats = DatabaseSetup.get_collection_stats()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data=stats,
            message="数据库统计信息获取成功"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting database stats: {str(e)}")


@router.post("/migrate", response_model=APIResponse)
async def migrate_database():
    """
    执行数据库迁移
    """
    try:
        DatabaseMigration.migrate_to_new_schema()
        DatabaseMigration.add_timestamps()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            message="数据库迁移完成"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error migrating database: {str(e)}")


@router.post("/ensure-collections", response_model=APIResponse)
async def ensure_collections():
    """
    确保所有必要的集合存在
    """
    try:
        DatabaseSetup.ensure_collections_exist()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            message="集合检查完成"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ensuring collections: {str(e)}")


@router.delete("/reset", response_model=APIResponse)
async def reset_database():
    """
    重置数据库（危险操作：删除所有数据）
    """
    try:
        DatabaseSetup.reset_database()
        
        from app.schemas.response import create_success_response
        return create_success_response(
            message="数据库重置完成"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting database: {str(e)}")


@router.get("/health", response_model=APIResponse)
async def check_database_health():
    """
    检查数据库健康状态
    """
    try:
        from app.db.mongodb import get_database
        
        db = get_database()
        
        # 测试数据库连接
        server_info = db.client.server_info()
        
        # 获取统计信息
        stats = DatabaseSetup.get_collection_stats()
        
        health_info = {
            "database_connected": True,
            "server_version": server_info.get("version", "unknown"),
            "collections": stats
        }
        
        from app.schemas.response import create_success_response
        return create_success_response(
            data=health_info,
            message="数据库健康检查完成"
        )
        
    except Exception as e:
        health_info = {
            "database_connected": False,
            "error": str(e)
        }
        
        from app.schemas.response import create_error_response
        return create_error_response(
            message="数据库连接失败",
            code=500,
            error_details=health_info
        )
