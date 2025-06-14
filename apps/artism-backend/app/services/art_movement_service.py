from typing import List, Dict, Any, Optional
import pandas as pd
from bson import json_util
import json

from app.db.mongodb import get_collection
from app.models.art_movement import ArtMovement
from app.core.config import ART_MOVEMENTS_COLLECTION
from .base_service import BaseService


class ArtMovementService(BaseService):
    """
    艺术运动服务类
    
    提供艺术运动数据的CRUD操作和其他相关功能
    """
    
    COLLECTION_NAME = ART_MOVEMENTS_COLLECTION
    MODEL_CLASS = ArtMovement
    
    @classmethod
    def get_movements_by_period(cls, start_year: int, end_year: int) -> List[Dict[str, Any]]:
        """
        根据时期获取艺术运动
        
        Args:
            start_year: 起始年份
            end_year: 结束年份
            
        Returns:
            List[Dict[str, Any]]: 艺术运动列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        # 构建查询条件：运动时期与指定时期有重叠
        filter_dict = {
            "$or": [
                # 运动开始时间在指定时期内
                {
                    "start_year": {"$gte": start_year, "$lte": end_year}
                },
                # 运动结束时间在指定时期内
                {
                    "end_year": {"$gte": start_year, "$lte": end_year}
                },
                # 运动跨越整个指定时期
                {
                    "start_year": {"$lte": start_year},
                    "end_year": {"$gte": end_year}
                },
                # 没有结束时间的运动（仍在进行）
                {
                    "start_year": {"$lte": end_year},
                    "end_year": None
                }
            ]
        }
        
        movements = list(collection.find(filter_dict))
        
        processed_movements = []
        for movement in movements:
            processed_movement = cls._process_record(movement)
            processed_movements.append(processed_movement)
        
        return processed_movements
    
    @classmethod
    def get_active_movements(cls, year: int) -> List[Dict[str, Any]]:
        """
        获取指定年份活跃的艺术运动
        
        Args:
            year: 指定年份
            
        Returns:
            List[Dict[str, Any]]: 活跃的艺术运动列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        filter_dict = {
            "$and": [
                {"$or": [{"start_year": None}, {"start_year": {"$lte": year}}]},
                {"$or": [{"end_year": None}, {"end_year": {"$gte": year}}]}
            ]
        }
        
        movements = list(collection.find(filter_dict))
        
        processed_movements = []
        for movement in movements:
            processed_movement = cls._process_record(movement)
            processed_movements.append(processed_movement)
        
        return processed_movements
    
    @classmethod
    def search_movements(cls, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        搜索艺术运动
        
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
                {"description": search_regex},
                {"tags": search_regex}
            ]
        }
        
        movements = list(collection.find(filter_dict).limit(limit))
        
        processed_movements = []
        for movement in movements:
            processed_movement = cls._process_record(movement)
            processed_movements.append(processed_movement)
        
        return processed_movements
    
    @classmethod
    def get_movements_by_artist(cls, artist_id: str) -> List[Dict[str, Any]]:
        """
        根据艺术家获取相关艺术运动
        
        Args:
            artist_id: 艺术家ID
            
        Returns:
            List[Dict[str, Any]]: 艺术运动列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        movements = list(collection.find({"key_artists": artist_id}))
        
        processed_movements = []
        for movement in movements:
            processed_movement = cls._process_record(movement)
            processed_movements.append(processed_movement)
        
        return processed_movements
    
    @classmethod
    def add_artist_to_movement(cls, movement_id: str, artist_id: str) -> bool:
        """
        将艺术家添加到艺术运动
        
        Args:
            movement_id: 艺术运动ID
            artist_id: 艺术家ID
            
        Returns:
            bool: 是否成功添加
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        result = collection.update_one(
            {"id": movement_id},
            {"$addToSet": {"key_artists": artist_id}}
        )
        
        return result.modified_count > 0
    
    @classmethod
    def remove_artist_from_movement(cls, movement_id: str, artist_id: str) -> bool:
        """
        从艺术运动中移除艺术家
        
        Args:
            movement_id: 艺术运动ID
            artist_id: 艺术家ID
            
        Returns:
            bool: 是否成功移除
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        result = collection.update_one(
            {"id": movement_id},
            {"$pull": {"key_artists": artist_id}}
        )
        
        return result.modified_count > 0
    
    @classmethod
    def add_artwork_to_movement(cls, movement_id: str, artwork_id: str) -> bool:
        """
        将作品添加到艺术运动的代表作品
        
        Args:
            movement_id: 艺术运动ID
            artwork_id: 作品ID
            
        Returns:
            bool: 是否成功添加
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        result = collection.update_one(
            {"id": movement_id},
            {"$addToSet": {"representative_works": artwork_id}}
        )
        
        return result.modified_count > 0
    
    @classmethod
    def remove_artwork_from_movement(cls, movement_id: str, artwork_id: str) -> bool:
        """
        从艺术运动的代表作品中移除作品
        
        Args:
            movement_id: 艺术运动ID
            artwork_id: 作品ID
            
        Returns:
            bool: 是否成功移除
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        result = collection.update_one(
            {"id": movement_id},
            {"$pull": {"representative_works": artwork_id}}
        )
        
        return result.modified_count > 0
    
    @classmethod
    def get_movement_statistics(cls, movement_id: str) -> Dict[str, Any]:
        """
        获取艺术运动统计信息
        
        Args:
            movement_id: 艺术运动ID
            
        Returns:
            Dict[str, Any]: 统计信息
        """
        collection = get_collection(cls.COLLECTION_NAME)
        movement = collection.find_one({"id": movement_id})
        
        if not movement:
            return {}
        
        # 计算统计信息
        stats = {
            "movement_id": movement_id,
            "name": movement.get("name", ""),
            "key_artists_count": len(movement.get("key_artists", [])),
            "representative_works_count": len(movement.get("representative_works", [])),
            "duration": None,
            "tags_count": len(movement.get("tags", []))
        }
        
        # 计算持续时间
        if movement.get("start_year") and movement.get("end_year"):
            stats["duration"] = movement["end_year"] - movement["start_year"]
        
        return stats
    
    @classmethod
    def get_movements_timeline(cls) -> List[Dict[str, Any]]:
        """
        获取艺术运动时间线
        
        Returns:
            List[Dict[str, Any]]: 按时间排序的艺术运动列表
        """
        collection = get_collection(cls.COLLECTION_NAME)
        
        # 按开始年份排序
        movements = list(collection.find().sort("start_year", 1))
        
        processed_movements = []
        for movement in movements:
            processed_movement = cls._process_record(movement)
            processed_movements.append(processed_movement)
        
        return processed_movements
