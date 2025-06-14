from typing import Optional, Dict, Any, List
from datetime import datetime
import pandas as pd
from bson import ObjectId


class BaseModel:
    """
    基础数据模型类
    
    提供所有数据模型的通用字段和方法
    """
    
    def __init__(
        self,
        id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        **kwargs
    ):
        self.id = id
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        
        # 存储其他可能的字段
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'BaseModel':
        """
        从字典创建模型实例
        
        Args:
            data: 包含模型数据的字典
            
        Returns:
            BaseModel: 模型实例
        """
        # 处理 MongoDB ObjectId
        if "_id" in data:
            data["id"] = str(data["_id"])
            del data["_id"]
        
        # 处理 NaN 值
        for key, value in data.items():
            if isinstance(value, float) and pd.isna(value):
                data[key] = None
        
        # 处理日期字段
        if "created_at" in data and isinstance(data["created_at"], str):
            data["created_at"] = datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
        if "updated_at" in data and isinstance(data["updated_at"], str):
            data["updated_at"] = datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00"))
                
        return cls(**data)
    
    def to_dict(self) -> Dict[str, Any]:
        """
        将模型实例转换为字典
        
        Returns:
            Dict[str, Any]: 包含模型数据的字典
        """
        result = {}
        for key, value in self.__dict__.items():
            if not key.startswith('_'):  # 排除私有属性
                if isinstance(value, datetime):
                    result[key] = value.isoformat()
                elif isinstance(value, ObjectId):
                    result[key] = str(value)
                else:
                    result[key] = value
        return result
    
    def validate_data(self) -> List[str]:
        """
        验证数据是否符合模型要求
        
        Returns:
            List[str]: 验证错误列表，如果没有错误则为空列表
        """
        errors = []
        
        # 基础验证 - 子类可以重写此方法添加更多验证
        if not hasattr(self, 'id') or self.id is None:
            errors.append("Missing required field: 'id'")
            
        return errors
    
    def update_timestamp(self):
        """更新时间戳"""
        self.updated_at = datetime.utcnow()
    
    @staticmethod
    def clean_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """
        清理数据，移除空值和无效字段
        
        Args:
            data: 原始数据字典
            
        Returns:
            Dict[str, Any]: 清理后的数据字典
        """
        cleaned = {}
        for key, value in data.items():
            if value is not None and value != "":
                if isinstance(value, str):
                    value = value.strip()
                    if value:  # 只保留非空字符串
                        cleaned[key] = value
                else:
                    cleaned[key] = value
        return cleaned
    
    @staticmethod
    def validate_csv_data(df: pd.DataFrame) -> List[str]:
        """
        验证 CSV 数据是否符合模型要求
        
        Args:
            df: 包含数据的 DataFrame
            
        Returns:
            List[str]: 验证错误列表，如果没有错误则为空列表
        """
        errors = []
        
        # 基础验证 - 子类应该重写此方法
        if df.empty:
            errors.append("DataFrame is empty")
            
        return errors
