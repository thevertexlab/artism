from typing import List, Dict, Any, Optional
import pandas as pd
from bson import json_util
import json
import os
from pymongo.collection import Collection

from app.db.mongodb import get_collection
from app.models.artwork import Artwork
from app.core.config import ARTWORKS_COLLECTION
from .base_service import BaseService

class ArtworkService(BaseService):
    """
    艺术品服务

    提供艺术品数据的CRUD操作
    """

    COLLECTION_NAME = ARTWORKS_COLLECTION
    MODEL_CLASS = Artwork
    
    @classmethod
    def get_artworks_by_artist(cls, artist_id: str) -> List[Dict[str, Any]]:
        """
        根据艺术家ID获取作品

        Args:
            artist_id: 艺术家ID

        Returns:
            List[Dict[str, Any]]: 作品列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        artworks = list(collection.find({"artist_id": artist_id}))

        processed_artworks = []
        for artwork in artworks:
            processed_artwork = cls._process_record(artwork)
            processed_artworks.append(processed_artwork)

        return processed_artworks
    
    @classmethod
    def get_artworks_by_movement(cls, movement_id: str) -> List[Dict[str, Any]]:
        """
        根据艺术运动ID获取作品

        Args:
            movement_id: 艺术运动ID

        Returns:
            List[Dict[str, Any]]: 作品列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        artworks = list(collection.find({"movement_ids": movement_id}))

        processed_artworks = []
        for artwork in artworks:
            processed_artwork = cls._process_record(artwork)
            processed_artworks.append(processed_artwork)

        return processed_artworks
    
    @classmethod
    def get_similar_artworks(cls, artwork_id: str, threshold: float = 0.8, limit: int = 10) -> List[Dict[str, Any]]:
        """
        根据风格向量获取相似作品

        Args:
            artwork_id: 作品ID
            threshold: 相似度阈值
            limit: 结果限制数量

        Returns:
            List[Dict[str, Any]]: 相似作品列表
        """
        collection = get_collection(cls.COLLECTION_NAME)

        # 获取目标作品
        target_artwork = collection.find_one({"id": artwork_id})
        if not target_artwork or not target_artwork.get("style_vector"):
            return []

        target_vector = target_artwork["style_vector"]

        # 获取所有有风格向量的作品
        artworks_with_vectors = list(collection.find({
            "style_vector": {"$exists": True, "$ne": []},
            "id": {"$ne": artwork_id}
        }))

        # 计算相似度并筛选
        similar_artworks = []
        for artwork in artworks_with_vectors:
            if artwork.get("style_vector"):
                similarity = Artwork.calculate_style_similarity(target_vector, artwork["style_vector"])
                if similarity >= threshold:
                    artwork["similarity_score"] = similarity
                    similar_artworks.append(artwork)

        # 按相似度排序
        similar_artworks.sort(key=lambda x: x["similarity_score"], reverse=True)

        # 处理结果
        processed_artworks = []
        for artwork in similar_artworks[:limit]:
            processed_artwork = cls._process_record(artwork)
            processed_artworks.append(processed_artwork)

        return processed_artworks
    
    @classmethod
    def search_artworks_by_style(cls, style_tags: List[str], limit: int = 10) -> List[Dict[str, Any]]:
        """
        根据风格标签搜索作品

        Args:
            style_tags: 风格标签列表
            limit: 结果限制数量

        Returns:
            List[Dict[str, Any]]: 搜索结果
        """
        collection = get_collection(cls.COLLECTION_NAME)

        # 构建查询条件
        filter_dict = {"tags": {"$in": style_tags}}

        artworks = list(collection.find(filter_dict).limit(limit))

        processed_artworks = []
        for artwork in artworks:
            processed_artwork = cls._process_record(artwork)
            processed_artworks.append(processed_artwork)

        return processed_artworks
    
    @classmethod
    def get_artworks_by_year_range(cls, start_year: int, end_year: int) -> List[Dict[str, Any]]:
        """
        根据年份范围获取作品

        Args:
            start_year: 起始年份
            end_year: 结束年份

        Returns:
            List[Dict[str, Any]]: 作品列表
        """
        collection = get_collection(cls.COLLECTION_NAME)

        filter_dict = {
            "year": {
                "$gte": start_year,
                "$lte": end_year
            }
        }

        artworks = list(collection.find(filter_dict))

        processed_artworks = []
        for artwork in artworks:
            processed_artwork = cls._process_record(artwork)
            processed_artworks.append(processed_artwork)

        return processed_artworks
    
    @classmethod
    def add_artwork_to_movement(cls, artwork_id: str, movement_id: str) -> bool:
        """
        将作品添加到艺术运动

        Args:
            artwork_id: 作品ID
            movement_id: 艺术运动ID

        Returns:
            bool: 是否成功添加
        """
        collection = get_collection(cls.COLLECTION_NAME)

        result = collection.update_one(
            {"id": artwork_id},
            {"$addToSet": {"movement_ids": movement_id}}
        )

        return result.modified_count > 0
    
    @classmethod
    def remove_artwork_from_movement(cls, artwork_id: str, movement_id: str) -> bool:
        """
        从艺术运动中移除作品

        Args:
            artwork_id: 作品ID
            movement_id: 艺术运动ID

        Returns:
            bool: 是否成功移除
        """
        collection = get_collection(cls.COLLECTION_NAME)

        result = collection.update_one(
            {"id": artwork_id},
            {"$pull": {"movement_ids": movement_id}}
        )

        return result.modified_count > 0

    @classmethod
    def update_style_vector(cls, artwork_id: str, style_vector: List[float]) -> bool:
        """
        更新作品的风格向量

        Args:
            artwork_id: 作品ID
            style_vector: 新的风格向量

        Returns:
            bool: 是否成功更新
        """
        collection = get_collection(cls.COLLECTION_NAME)

        result = collection.update_one(
            {"id": artwork_id},
            {"$set": {"style_vector": style_vector}}
        )

        return result.modified_count > 0