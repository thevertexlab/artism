from typing import Optional, Dict, Any, List
import pandas as pd
from .base import BaseModel

class Artwork(BaseModel):
    """
    艺术品数据模型

    用于表示艺术品的基本信息和相关数据
    """

    def __init__(
        self,
        title: str,
        artist_id: str,
        year: Optional[int] = None,
        description: Optional[str] = None,
        image_url: Optional[str] = None,
        movement_ids: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        style_vector: Optional[List[float]] = None,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.title = title
        self.artist_id = artist_id
        self.year = year
        self.description = description
        self.image_url = image_url
        self.movement_ids = movement_ids or []
        self.tags = tags or []
        self.style_vector = style_vector or []
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Artwork':
        """
        从字典创建艺术品实例

        Args:
            data: 包含艺术品数据的字典

        Returns:
            Artwork: 艺术品实例
        """
        # 确保必填字段存在
        if 'title' not in data:
            raise ValueError("Artwork data must contain 'title' field")

        if 'artist_id' not in data:
            raise ValueError("Artwork data must contain 'artist_id' field")

        # 调用父类方法处理基础字段
        return super().from_dict(data)
    
    def validate_data(self) -> List[str]:
        """
        验证艺术品数据

        Returns:
            List[str]: 验证错误列表
        """
        errors = super().validate_data()

        # 艺术品特有验证
        if not self.title or not self.title.strip():
            errors.append("Artwork title is required")

        if not self.artist_id:
            errors.append("Artwork artist_id is required")

        return errors

    @staticmethod
    def validate_csv_data(df: pd.DataFrame) -> List[str]:
        """
        验证 CSV 数据是否符合艺术品模型要求

        Args:
            df: 包含艺术品数据的 DataFrame

        Returns:
            List[str]: 验证错误列表，如果没有错误则为空列表
        """
        errors = BaseModel.validate_csv_data(df)

        # 检查必填字段
        if 'title' not in df.columns:
            errors.append("Missing required column: 'title'")
        if 'artist_id' not in df.columns:
            errors.append("Missing required column: 'artist_id'")

        # 检查字段非空
        if 'title' in df.columns and df['title'].isna().any():
            errors.append("Column 'title' contains null values")
        if 'artist_id' in df.columns and df['artist_id'].isna().any():
            errors.append("Column 'artist_id' contains null values")

        return errors

    @staticmethod
    def calculate_style_similarity(vector1: List[float], vector2: List[float]) -> float:
        """
        计算风格向量相似度

        Args:
            vector1: 第一个风格向量
            vector2: 第二个风格向量

        Returns:
            float: 相似度分数 (0-1)
        """
        if not vector1 or not vector2 or len(vector1) != len(vector2):
            return 0.0

        # 计算余弦相似度
        import math

        dot_product = sum(a * b for a, b in zip(vector1, vector2))
        magnitude1 = math.sqrt(sum(a * a for a in vector1))
        magnitude2 = math.sqrt(sum(b * b for b in vector2))

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)