from typing import Optional, Dict, Any, List
import pandas as pd
from .base import BaseModel

class Artist(BaseModel):
    """
    艺术家数据模型

    用于表示艺术家的基本信息和相关数据
    支持AIDA（真实艺术家）和主义主义机（虚构艺术家）两个项目
    """

    def __init__(
        self,
        name: str,
        birth_year: Optional[int] = None,
        death_year: Optional[int] = None,
        nationality: Optional[str] = None,
        bio: Optional[str] = None,
        avatar_url: Optional[str] = None,
        notable_works: Optional[List[str]] = None,
        associated_movements: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        is_fictional: bool = False,
        fictional_meta: Optional[Dict[str, Any]] = None,
        agent: Optional[Dict[str, Any]] = None,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.name = name
        self.birth_year = birth_year
        self.death_year = death_year
        self.nationality = nationality
        self.bio = bio
        self.avatar_url = avatar_url
        self.notable_works = notable_works or []
        self.associated_movements = associated_movements or []
        self.tags = tags or []
        self.is_fictional = is_fictional
        self.fictional_meta = fictional_meta
        self.agent = agent
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Artist':
        """
        从字典创建艺术家实例

        Args:
            data: 包含艺术家数据的字典

        Returns:
            Artist: 艺术家实例
        """
        # 确保 name 字段存在
        if 'name' not in data:
            raise ValueError("Artist data must contain 'name' field")

        # 调用父类方法处理基础字段
        return super().from_dict(data)
    
    def validate_data(self) -> List[str]:
        """
        验证艺术家数据

        Returns:
            List[str]: 验证错误列表
        """
        errors = super().validate_data()

        # 艺术家特有验证
        if not self.name or not self.name.strip():
            errors.append("Artist name is required")

        # 虚构艺术家验证
        if self.is_fictional and self.fictional_meta:
            if not self.fictional_meta.get('origin_project'):
                errors.append("Fictional artist must have origin_project")

        return errors
    
    @staticmethod
    def validate_csv_data(df: pd.DataFrame) -> List[str]:
        """
        验证 CSV 数据是否符合艺术家模型要求

        Args:
            df: 包含艺术家数据的 DataFrame

        Returns:
            List[str]: 验证错误列表，如果没有错误则为空列表
        """
        errors = BaseModel.validate_csv_data(df)

        # 检查必填字段
        if 'name' not in df.columns:
            errors.append("Missing required column: 'name'")

        # 检查名称非空
        if 'name' in df.columns and df['name'].isna().any():
            errors.append("Column 'name' contains null values")

        return errors

    @staticmethod
    def create_fictional_meta(
        origin_project: str,
        origin_story: Optional[str] = None,
        fictional_style: Optional[List[str]] = None,
        model_prompt_seed: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        创建虚构艺术家元数据

        Args:
            origin_project: 来源项目名
            origin_story: 背景设定故事
            fictional_style: 虚构风格标签
            model_prompt_seed: AI Prompt原始文本

        Returns:
            Dict[str, Any]: 虚构艺术家元数据
        """
        return {
            "origin_project": origin_project,
            "origin_story": origin_story,
            "fictional_style": fictional_style or [],
            "model_prompt_seed": model_prompt_seed
        }

    @staticmethod
    def create_agent_config(
        enabled: bool = False,
        personality_profile: Optional[str] = None,
        prompt_seed: Optional[str] = None,
        connected_network_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        创建AI代理配置

        Args:
            enabled: 是否启用AI代理
            personality_profile: 个性档案
            prompt_seed: 提示种子
            connected_network_ids: 连接的网络ID列表

        Returns:
            Dict[str, Any]: AI代理配置
        """
        return {
            "enabled": enabled,
            "personality_profile": personality_profile,
            "prompt_seed": prompt_seed,
            "connected_network_ids": connected_network_ids or []
        }