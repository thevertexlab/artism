from fastapi import APIRouter, Query, Body
from typing import Optional

from app.schemas.artist import QueryParams

router = APIRouter()

@router.get("/")
async def test_get_api(
    name: Optional[str] = Query(None, description="Filter by name"),
    nationality: Optional[str] = Query(None, description="Filter by nationality"),
    style: Optional[str] = Query(None, description="Filter by art style"),
    min_year: Optional[int] = Query(None, description="Minimum birth year"),
    max_year: Optional[int] = Query(None, description="Maximum birth year")
):
    """
    测试 GET API
    
    演示如何在 GET 请求中使用查询参数
    
    Args:
        name: 按名称过滤
        nationality: 按国籍过滤
        style: 按艺术风格过滤
        min_year: 最小出生年份
        max_year: 最大出生年份
    """
    filters = {k: v for k, v in locals().items() if v is not None and k not in ['request']}
    
    return {
        "message": "Test GET API",
        "filters_applied": filters,
        "result": "This is a test response from the GET API"
    }

@router.post("/")
async def test_post_api(query_params: QueryParams = Body(...)):
    """
    测试 POST API
    
    演示如何在 POST 请求中使用请求体
    
    Args:
        query_params: 查询参数
    """
    filters = {k: v for k, v in query_params.dict().items() if v is not None}
    
    return {
        "message": "Test POST API",
        "filters_applied": filters,
        "result": "This is a test response from the POST API"
    } 