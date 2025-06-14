from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field
from fastapi import Query
import re


class QueryParams(BaseModel):
    """
    通用查询参数模型
    """
    # 项目筛选
    project: Optional[str] = Field(None, description="项目名称，如 'aida' 或 'zhuyizhuyi'")
    
    # 字段控制
    fields: Optional[str] = Field(None, description="限定返回字段，用逗号分隔，如 'name,avatarUrl'")
    include: Optional[str] = Field(None, description="填充关联字段，用逗号分隔，如 'notableWorks,associatedMovements'")
    
    # 搜索和筛选
    search: Optional[str] = Field(None, description="模糊搜索关键词")
    tags: Optional[str] = Field(None, description="标签筛选，用逗号分隔")
    
    # 时间区间筛选
    year_from: Optional[int] = Field(None, alias="yearFrom", description="起始年份")
    year_to: Optional[int] = Field(None, alias="yearTo", description="结束年份")
    
    # 排序
    sort_by: Optional[str] = Field(None, alias="sortBy", description="排序字段")
    order: Optional[str] = Field("asc", description="排序方向，'asc' 或 'desc'")
    
    # 分页
    page: int = Field(1, ge=1, description="页码")
    page_size: int = Field(10, ge=1, le=100, alias="pageSize", description="每页大小")
    
    # 特殊筛选
    is_fictional: Optional[bool] = Field(None, alias="isFictional", description="真实/虚构筛选")


class QueryParamsParser:
    """
    查询参数解析器
    """
    
    @staticmethod
    def parse_fields(fields_str: Optional[str]) -> Optional[List[str]]:
        """
        解析字段参数
        
        Args:
            fields_str: 字段字符串，如 "name,avatarUrl"
            
        Returns:
            List[str]: 字段列表
        """
        if not fields_str:
            return None
        return [field.strip() for field in fields_str.split(",") if field.strip()]
    
    @staticmethod
    def parse_include(include_str: Optional[str]) -> Optional[List[str]]:
        """
        解析关联字段参数
        
        Args:
            include_str: 关联字段字符串，如 "notableWorks,associatedMovements"
            
        Returns:
            List[str]: 关联字段列表
        """
        if not include_str:
            return None
        return [field.strip() for field in include_str.split(",") if field.strip()]
    
    @staticmethod
    def parse_tags(tags_str: Optional[str]) -> Optional[List[str]]:
        """
        解析标签参数
        
        Args:
            tags_str: 标签字符串，如 "印象派,现代主义"
            
        Returns:
            List[str]: 标签列表
        """
        if not tags_str:
            return None
        return [tag.strip() for tag in tags_str.split(",") if tag.strip()]
    
    @staticmethod
    def build_mongo_filter(params: QueryParams) -> Dict[str, Any]:
        """
        构建MongoDB查询过滤器
        
        Args:
            params: 查询参数
            
        Returns:
            Dict[str, Any]: MongoDB查询过滤器
        """
        filter_dict = {}
        
        # 项目筛选
        if params.project:
            # 可以根据需要添加项目相关的筛选逻辑
            pass
        
        # 搜索
        if params.search:
            # 在多个字段中进行模糊搜索
            search_regex = {"$regex": params.search, "$options": "i"}
            filter_dict["$or"] = [
                {"name": search_regex},
                {"description": search_regex},
                {"bio": search_regex}
            ]
        
        # 标签筛选
        if params.tags:
            tags_list = QueryParamsParser.parse_tags(params.tags)
            if tags_list:
                filter_dict["tags"] = {"$in": tags_list}
        
        # 时间区间筛选
        year_filter = {}
        if params.year_from is not None:
            year_filter["$gte"] = params.year_from
        if params.year_to is not None:
            year_filter["$lte"] = params.year_to
        
        if year_filter:
            # 根据模型类型选择年份字段
            filter_dict["$or"] = [
                {"year": year_filter},
                {"birth_year": year_filter},
                {"start_year": year_filter}
            ]
        
        # 虚构/真实筛选
        if params.is_fictional is not None:
            filter_dict["is_fictional"] = params.is_fictional
        
        return filter_dict
    
    @staticmethod
    def build_mongo_sort(params: QueryParams) -> Optional[List[tuple]]:
        """
        构建MongoDB排序参数
        
        Args:
            params: 查询参数
            
        Returns:
            List[tuple]: MongoDB排序参数
        """
        if not params.sort_by:
            return None
        
        direction = 1 if params.order.lower() == "asc" else -1
        return [(params.sort_by, direction)]
    
    @staticmethod
    def build_mongo_projection(params: QueryParams) -> Optional[Dict[str, int]]:
        """
        构建MongoDB字段投影
        
        Args:
            params: 查询参数
            
        Returns:
            Dict[str, int]: MongoDB字段投影
        """
        fields = QueryParamsParser.parse_fields(params.fields)
        if not fields:
            return None
        
        projection = {"_id": 0}  # 默认排除 _id
        for field in fields:
            projection[field] = 1
        
        return projection
    
    @staticmethod
    def calculate_skip(page: int, page_size: int) -> int:
        """
        计算跳过的记录数
        
        Args:
            page: 页码
            page_size: 每页大小
            
        Returns:
            int: 跳过的记录数
        """
        return (page - 1) * page_size
    
    @staticmethod
    def validate_sort_field(sort_by: str, allowed_fields: List[str]) -> bool:
        """
        验证排序字段是否允许
        
        Args:
            sort_by: 排序字段
            allowed_fields: 允许的字段列表
            
        Returns:
            bool: 是否允许
        """
        return sort_by in allowed_fields
