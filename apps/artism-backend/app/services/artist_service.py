from typing import List, Dict, Any, Optional
import pandas as pd
from bson import json_util
import json

from app.db.mongodb import get_collection
from app.models.artist import Artist
from app.core.config import ARTISTS_COLLECTION
from .base_service import BaseService

class ArtistService(BaseService):
    """
    艺术家服务类

    提供艺术家数据的CRUD操作和其他相关功能
    """

    COLLECTION_NAME = ARTISTS_COLLECTION
    MODEL_CLASS = Artist
    
    @classmethod
    def get_artists_by_movement(cls, movement_id: str) -> List[Dict[str, Any]]:
        """
        根据艺术运动获取艺术家

        Args:
            movement_id: 艺术运动ID

        Returns:
            List[Dict[str, Any]]: 艺术家列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        artists = list(collection.find({"associated_movements": movement_id}))

        processed_artists = []
        for artist in artists:
            processed_artist = cls._process_record(artist)
            processed_artists.append(processed_artist)

        return processed_artists
    
    @classmethod
    def get_fictional_artists(cls, project: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        获取虚构艺术家

        Args:
            project: 项目名称筛选

        Returns:
            List[Dict[str, Any]]: 虚构艺术家列表
        """
        collection = get_collection(cls.COLLECTION_NAME)

        filter_dict = {"is_fictional": True}
        if project:
            filter_dict["fictional_meta.origin_project"] = project

        artists = list(collection.find(filter_dict))

        processed_artists = []
        for artist in artists:
            processed_artist = cls._process_record(artist)
            processed_artists.append(processed_artist)

        return processed_artists
    
    @classmethod
    def get_real_artists(cls) -> List[Dict[str, Any]]:
        """
        获取真实艺术家

        Returns:
            List[Dict[str, Any]]: 真实艺术家列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        artists = list(collection.find({"is_fictional": {"$ne": True}}))

        processed_artists = []
        for artist in artists:
            processed_artist = cls._process_record(artist)
            processed_artists.append(processed_artist)

        return processed_artists
    
    @classmethod
    def search_artists(cls, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        搜索艺术家

        Args:
            query: 搜索关键词
            limit: 结果限制数量

        Returns:
            List[Dict[str, Any]]: 搜索结果
        """
        collection = get_collection(cls.COLLECTION_NAME)

        # 构建搜索条件
        search_regex = {"$regex": query, "$options": "i"}
        filter_dict = {
            "$or": [
                {"name": search_regex},
                {"bio": search_regex},
                {"nationality": search_regex},
                {"tags": search_regex}
            ]
        }

        artists = list(collection.find(filter_dict).limit(limit))

        processed_artists = []
        for artist in artists:
            processed_artist = cls._process_record(artist)
            processed_artists.append(processed_artist)

        return processed_artists
    
    @classmethod
    def get_artist_social_network(cls, artist_id: str) -> List[Dict[str, Any]]:
        """
        获取艺术家的社交网络

        Args:
            artist_id: 艺术家ID

        Returns:
            List[Dict[str, Any]]: 连接的艺术家列表
        """
        collection = get_collection(cls.COLLECTION_NAME)

        # 获取艺术家信息
        artist = collection.find_one({"id": artist_id})
        if not artist or not artist.get("agent", {}).get("connected_network_ids"):
            return []

        # 获取连接的艺术家
        connected_ids = artist["agent"]["connected_network_ids"]
        connected_artists = list(collection.find({"id": {"$in": connected_ids}}))

        processed_artists = []
        for connected_artist in connected_artists:
            processed_artist = cls._process_record(connected_artist)
            processed_artists.append(processed_artist)

        return processed_artists
    
    @classmethod
    def add_artist_to_movement(cls, artist_id: str, movement_id: str) -> bool:
        """
        将艺术家添加到艺术运动

        Args:
            artist_id: 艺术家ID
            movement_id: 艺术运动ID

        Returns:
            bool: 是否成功添加
        """
        collection = get_collection(cls.COLLECTION_NAME)

        result = collection.update_one(
            {"id": artist_id},
            {"$addToSet": {"associated_movements": movement_id}}
        )

        return result.modified_count > 0

    @classmethod
    def remove_artist_from_movement(cls, artist_id: str, movement_id: str) -> bool:
        """
        从艺术运动中移除艺术家

        Args:
            artist_id: 艺术家ID
            movement_id: 艺术运动ID

        Returns:
            bool: 是否成功移除
        """
        collection = get_collection(cls.COLLECTION_NAME)

        result = collection.update_one(
            {"id": artist_id},
            {"$pull": {"associated_movements": movement_id}}
        )

        return result.modified_count > 0