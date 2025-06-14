from pydantic import BaseModel
from typing import Optional, Any, List, Generic, TypeVar
from datetime import datetime

T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """
    统一API响应格式
    """
    success: bool = True
    data: Optional[T] = None
    message: str = "操作成功"
    code: int = 200
    timestamp: datetime = datetime.utcnow()
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class PaginatedResponse(BaseModel, Generic[T]):
    """
    分页响应格式
    """
    success: bool = True
    data: List[T] = []
    message: str = "操作成功"
    code: int = 200
    timestamp: datetime = datetime.utcnow()
    
    # 分页信息
    total: int = 0
    page: int = 1
    page_size: int = 10
    total_pages: int = 0
    has_next: bool = False
    has_prev: bool = False
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def __init__(self, **data):
        super().__init__(**data)
        # 计算分页信息
        if self.total > 0 and self.page_size > 0:
            self.total_pages = (self.total + self.page_size - 1) // self.page_size
            self.has_next = self.page < self.total_pages
            self.has_prev = self.page > 1


class ErrorResponse(BaseModel):
    """
    错误响应格式
    """
    success: bool = False
    data: Optional[Any] = None
    message: str
    code: int
    timestamp: datetime = datetime.utcnow()
    error_details: Optional[dict] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


def create_success_response(data: Any = None, message: str = "操作成功", code: int = 200) -> APIResponse:
    """
    创建成功响应
    
    Args:
        data: 响应数据
        message: 响应消息
        code: 状态码
        
    Returns:
        APIResponse: 成功响应
    """
    return APIResponse(
        success=True,
        data=data,
        message=message,
        code=code,
        timestamp=datetime.utcnow()
    )


def create_error_response(message: str, code: int = 400, error_details: dict = None) -> ErrorResponse:
    """
    创建错误响应
    
    Args:
        message: 错误消息
        code: 错误状态码
        error_details: 错误详情
        
    Returns:
        ErrorResponse: 错误响应
    """
    return ErrorResponse(
        success=False,
        message=message,
        code=code,
        timestamp=datetime.utcnow(),
        error_details=error_details
    )


def create_paginated_response(
    data: List[Any],
    total: int,
    page: int = 1,
    page_size: int = 10,
    message: str = "操作成功",
    code: int = 200
) -> PaginatedResponse:
    """
    创建分页响应
    
    Args:
        data: 响应数据列表
        total: 总记录数
        page: 当前页码
        page_size: 每页大小
        message: 响应消息
        code: 状态码
        
    Returns:
        PaginatedResponse: 分页响应
    """
    return PaginatedResponse(
        success=True,
        data=data,
        total=total,
        page=page,
        page_size=page_size,
        message=message,
        code=code,
        timestamp=datetime.utcnow()
    )
