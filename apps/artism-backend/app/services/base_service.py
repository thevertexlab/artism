from typing import List, Dict, Any, Optional, Type, Union
import pandas as pd
from bson import json_util
import json
from datetime import datetime

from app.db.mongodb import get_collection
from app.models.base import BaseModel
from app.utils.query_params import QueryParams, QueryParamsParser
from app.schemas.response import APIResponse, PaginatedResponse, create_success_response, create_error_response, create_paginated_response


class BaseService:
    """
    基础服务类
    
    提供通用的CRUD操作和其他相关功能
    """
    
    COLLECTION_NAME: str = None  # 子类必须定义
    MODEL_CLASS: Type[BaseModel] = None  # 子类必须定义
    
    @classmethod
    def get_all(cls, params: Optional[QueryParams] = None) -> PaginatedResponse:
        """
        获取所有记录
        
        Args:
            params: 查询参数
            
        Returns:
            PaginatedResponse: 分页响应
        """
        if not cls.COLLECTION_NAME:
            raise NotImplementedError("COLLECTION_NAME must be defined in subclass")
        
        collection = get_collection(cls.COLLECTION_NAME)
        
        # 构建查询条件
        filter_dict = {}
        sort_params = None
        projection = None
        
        if params:
            filter_dict = QueryParamsParser.build_mongo_filter(params)
            sort_params = QueryParamsParser.build_mongo_sort(params)
            projection = QueryParamsParser.build_mongo_projection(params)
        
        # 计算总数
        total = collection.count_documents(filter_dict)
        
        # 分页参数
        page = params.page if params else 1
        page_size = params.page_size if params else 10
        skip = QueryParamsParser.calculate_skip(page, page_size)
        
        # 查询数据
        cursor = collection.find(filter_dict, projection)
        
        if sort_params:
            cursor = cursor.sort(sort_params)
        
        records = list(cursor.skip(skip).limit(page_size))
        
        # 处理数据
        processed_records = []
        for record in records:
            processed_record = cls._process_record(record)
            processed_records.append(processed_record)
        
        return create_paginated_response(
            data=processed_records,
            total=total,
            page=page,
            page_size=page_size
        )
    
    @classmethod
    def get_by_id(cls, record_id: str) -> APIResponse:
        """
        根据 ID 获取记录
        
        Args:
            record_id: 记录 ID
            
        Returns:
            APIResponse: API响应
        """
        if not cls.COLLECTION_NAME:
            raise NotImplementedError("COLLECTION_NAME must be defined in subclass")
        
        collection = get_collection(cls.COLLECTION_NAME)
        record = collection.find_one({"id": record_id})
        
        if not record:
            return create_error_response(
                message=f"Record with ID {record_id} not found",
                code=404
            )
        
        processed_record = cls._process_record(record)
        return create_success_response(data=processed_record)
    
    @classmethod
    def create(cls, record_data: Dict[str, Any]) -> APIResponse:
        """
        创建记录
        
        Args:
            record_data: 记录数据
            
        Returns:
            APIResponse: API响应
        """
        if not cls.COLLECTION_NAME:
            raise NotImplementedError("COLLECTION_NAME must be defined in subclass")
        
        try:
            collection = get_collection(cls.COLLECTION_NAME)
            
            # 生成ID（如果没有提供）
            if "id" not in record_data or not record_data["id"]:
                record_data["id"] = cls._generate_id()
            
            # 检查ID唯一性
            existing = collection.find_one({"id": record_data["id"]})
            if existing:
                return create_error_response(
                    message=f"Record with ID {record_data['id']} already exists",
                    code=409
                )
            
            # 添加时间戳
            now = datetime.utcnow()
            record_data["created_at"] = now
            record_data["updated_at"] = now
            
            # 验证数据
            if cls.MODEL_CLASS:
                model_instance = cls.MODEL_CLASS.from_dict(record_data)
                validation_errors = model_instance.validate_data()
                if validation_errors:
                    return create_error_response(
                        message="Validation failed",
                        code=400,
                        error_details={"validation_errors": validation_errors}
                    )
            
            # 插入数据
            collection.insert_one(record_data)
            
            # 返回创建的记录
            created_record = cls._process_record(record_data)
            return create_success_response(
                data=created_record,
                message="Record created successfully",
                code=201
            )
            
        except Exception as e:
            return create_error_response(
                message=f"Failed to create record: {str(e)}",
                code=500
            )
    
    @classmethod
    def update(cls, record_id: str, record_data: Dict[str, Any]) -> APIResponse:
        """
        更新记录
        
        Args:
            record_id: 记录 ID
            record_data: 要更新的记录数据
            
        Returns:
            APIResponse: API响应
        """
        if not cls.COLLECTION_NAME:
            raise NotImplementedError("COLLECTION_NAME must be defined in subclass")
        
        try:
            collection = get_collection(cls.COLLECTION_NAME)
            
            # 检查记录是否存在
            existing = collection.find_one({"id": record_id})
            if not existing:
                return create_error_response(
                    message=f"Record with ID {record_id} not found",
                    code=404
                )
            
            # 更新时间戳
            record_data["updated_at"] = datetime.utcnow()
            
            # 验证数据
            if cls.MODEL_CLASS:
                # 合并现有数据和更新数据进行验证
                merged_data = {**existing, **record_data}
                model_instance = cls.MODEL_CLASS.from_dict(merged_data)
                validation_errors = model_instance.validate_data()
                if validation_errors:
                    return create_error_response(
                        message="Validation failed",
                        code=400,
                        error_details={"validation_errors": validation_errors}
                    )
            
            # 更新数据
            collection.update_one({"id": record_id}, {"$set": record_data})
            
            # 返回更新后的记录
            updated_record = collection.find_one({"id": record_id})
            processed_record = cls._process_record(updated_record)
            return create_success_response(
                data=processed_record,
                message="Record updated successfully"
            )
            
        except Exception as e:
            return create_error_response(
                message=f"Failed to update record: {str(e)}",
                code=500
            )
    
    @classmethod
    def delete(cls, record_id: str) -> APIResponse:
        """
        删除记录
        
        Args:
            record_id: 记录 ID
            
        Returns:
            APIResponse: API响应
        """
        if not cls.COLLECTION_NAME:
            raise NotImplementedError("COLLECTION_NAME must be defined in subclass")
        
        try:
            collection = get_collection(cls.COLLECTION_NAME)
            
            # 检查记录是否存在
            existing = collection.find_one({"id": record_id})
            if not existing:
                return create_error_response(
                    message=f"Record with ID {record_id} not found",
                    code=404
                )
            
            # 删除记录
            result = collection.delete_one({"id": record_id})
            
            if result.deleted_count > 0:
                return create_success_response(
                    message="Record deleted successfully"
                )
            else:
                return create_error_response(
                    message="Failed to delete record",
                    code=500
                )
                
        except Exception as e:
            return create_error_response(
                message=f"Failed to delete record: {str(e)}",
                code=500
            )
    
    @classmethod
    def import_from_csv(cls, csv_path: str, clear_existing: bool = False) -> APIResponse:
        """
        从 CSV 文件导入数据
        
        Args:
            csv_path: CSV 文件路径
            clear_existing: 是否清除现有数据
            
        Returns:
            APIResponse: 导入结果
        """
        try:
            # 读取 CSV 文件
            df = pd.read_csv(csv_path)
            
            # 验证数据
            if cls.MODEL_CLASS:
                errors = cls.MODEL_CLASS.validate_csv_data(df)
                if errors:
                    return create_error_response(
                        message="CSV validation failed",
                        code=400,
                        error_details={"validation_errors": errors}
                    )
            
            # 转换为记录列表
            records = df.to_dict('records')
            
            # 获取集合
            collection = get_collection(cls.COLLECTION_NAME)
            
            # 清除现有数据（如果需要）
            if clear_existing:
                collection.delete_many({})
            
            # 处理记录
            processed_records = []
            for record in records:
                # 清理数据
                cleaned_record = BaseModel.clean_data(record)
                
                # 生成ID（如果没有）
                if "id" not in cleaned_record or not cleaned_record["id"]:
                    cleaned_record["id"] = cls._generate_id()
                
                # 添加时间戳
                now = datetime.utcnow()
                cleaned_record["created_at"] = now
                cleaned_record["updated_at"] = now
                
                processed_records.append(cleaned_record)
            
            # 插入记录
            if processed_records:
                collection.insert_many(processed_records)
            
            return create_success_response(
                data={
                    "rows_processed": len(processed_records),
                    "sample_records": processed_records[:3] if len(processed_records) > 3 else processed_records
                },
                message=f"Successfully imported {len(processed_records)} records"
            )
            
        except Exception as e:
            return create_error_response(
                message=f"Failed to import CSV: {str(e)}",
                code=500
            )
    
    @classmethod
    def _process_record(cls, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        处理记录，移除MongoDB特有字段并转换数据类型
        
        Args:
            record: 原始记录
            
        Returns:
            Dict[str, Any]: 处理后的记录
        """
        if "_id" in record:
            del record["_id"]
        
        # 转换 NaN 值为 None
        for key, value in record.items():
            if isinstance(value, float) and pd.isna(value):
                record[key] = None
        
        return record
    
    @classmethod
    def _generate_id(cls) -> str:
        """
        生成唯一ID
        
        Returns:
            str: 唯一ID
        """
        import uuid
        return str(uuid.uuid4())
