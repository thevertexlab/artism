from typing import Optional, Dict, Any, List
import pandas as pd
from .base import BaseModel


class ArtMovement(BaseModel):
    """
    艺术运动数据模型
    
    用于表示艺术运动的基本信息和相关数据
    """
    
    def __init__(
        self,
        name: str,
        description: Optional[str] = None,
        start_year: Optional[int] = None,
        end_year: Optional[int] = None,
        key_artists: Optional[List[str]] = None,
        representative_works: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.name = name
        self.description = description
        self.start_year = start_year
        self.end_year = end_year
        self.key_artists = key_artists or []
        self.representative_works = representative_works or []
        self.tags = tags or []
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ArtMovement':
        """
        从字典创建艺术运动实例
        
        Args:
            data: 包含艺术运动数据的字典
            
        Returns:
            ArtMovement: 艺术运动实例
        """
        # 确保必填字段存在
        if 'name' not in data:
            raise ValueError("ArtMovement data must contain 'name' field")
        
        # 调用父类方法处理基础字段
        return super().from_dict(data)
    
    def validate_data(self) -> List[str]:
        """
        验证艺术运动数据
        
        Returns:
            List[str]: 验证错误列表
        """
        errors = super().validate_data()
        
        # 艺术运动特有验证
        if not self.name or not self.name.strip():
            errors.append("ArtMovement name is required")
        
        # 验证年份逻辑
        if (self.start_year is not None and self.end_year is not None and 
            self.start_year > self.end_year):
            errors.append("Start year cannot be greater than end year")
        
        return errors
    
    @staticmethod
    def validate_csv_data(df: pd.DataFrame) -> List[str]:
        """
        验证 CSV 数据是否符合艺术运动模型要求
        
        Args:
            df: 包含艺术运动数据的 DataFrame
            
        Returns:
            List[str]: 验证错误列表，如果没有错误则为空列表
        """
        errors = BaseModel.validate_csv_data(df)
        
        # 检查必填字段
        if 'name' not in df.columns:
            errors.append("Missing required column: 'name'")
            
        # 检查字段非空
        if 'name' in df.columns and df['name'].isna().any():
            errors.append("Column 'name' contains null values")
            
        return errors
    
    def get_duration(self) -> Optional[int]:
        """
        获取艺术运动持续时间
        
        Returns:
            Optional[int]: 持续年数，如果缺少年份信息则返回None
        """
        if self.start_year is not None and self.end_year is not None:
            return self.end_year - self.start_year
        return None
    
    def is_active_in_year(self, year: int) -> bool:
        """
        判断艺术运动在指定年份是否活跃
        
        Args:
            year: 指定年份
            
        Returns:
            bool: 是否活跃
        """
        if self.start_year is not None and year < self.start_year:
            return False
        if self.end_year is not None and year > self.end_year:
            return False
        return True
    
    def add_artist(self, artist_id: str):
        """
        添加关键艺术家
        
        Args:
            artist_id: 艺术家ID
        """
        if artist_id not in self.key_artists:
            self.key_artists.append(artist_id)
            self.update_timestamp()
    
    def remove_artist(self, artist_id: str):
        """
        移除关键艺术家
        
        Args:
            artist_id: 艺术家ID
        """
        if artist_id in self.key_artists:
            self.key_artists.remove(artist_id)
            self.update_timestamp()
    
    def add_representative_work(self, artwork_id: str):
        """
        添加代表作品
        
        Args:
            artwork_id: 作品ID
        """
        if artwork_id not in self.representative_works:
            self.representative_works.append(artwork_id)
            self.update_timestamp()
    
    def remove_representative_work(self, artwork_id: str):
        """
        移除代表作品
        
        Args:
            artwork_id: 作品ID
        """
        if artwork_id in self.representative_works:
            self.representative_works.remove(artwork_id)
            self.update_timestamp()
    
    @staticmethod
    def get_movements_by_period(movements: List['ArtMovement'], start_year: int, end_year: int) -> List['ArtMovement']:
        """
        根据时期筛选艺术运动
        
        Args:
            movements: 艺术运动列表
            start_year: 起始年份
            end_year: 结束年份
            
        Returns:
            List[ArtMovement]: 符合条件的艺术运动列表
        """
        result = []
        for movement in movements:
            # 检查运动是否与指定时期有重叠
            if (movement.start_year is None or movement.start_year <= end_year) and \
               (movement.end_year is None or movement.end_year >= start_year):
                result.append(movement)
        return result
