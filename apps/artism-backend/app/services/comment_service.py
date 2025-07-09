from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.db.mongodb import get_collection
from app.models.comment import Comment, AICommentThread
from app.schemas.comment import CommentCreate, CommentUpdate, CommentStats
from app.services.artist_service import ArtistService
import uuid
import logging

logger = logging.getLogger(__name__)

class CommentService:
    """评论服务类"""
    
    @staticmethod
    def get_collection():
        """获取评论集合"""
        return get_collection("comments")
    
    @staticmethod
    def get_threads_collection():
        """获取线程集合"""
        return get_collection("comment_threads")
    
    @classmethod
    def create_comment(cls, comment_data: CommentCreate) -> Dict[str, Any]:
        """创建评论"""
        try:
            collection = cls.get_collection()
            
            # 创建评论对象
            comment = Comment(
                content=comment_data.content,
                author_id=comment_data.author_id,
                target_type=comment_data.target_type,
                target_id=comment_data.target_id,
                parent_comment_id=comment_data.parent_comment_id,
                sentiment=comment_data.sentiment,
                ai_generated=comment_data.ai_generated,
                generation_context=comment_data.generation_context or {}
            )
            
            # 转换为字典并插入数据库
            comment_dict = comment.to_dict()
            result = collection.insert_one(comment_dict)
            
            if result.inserted_id:
                comment_dict['_id'] = str(result.inserted_id)
                logger.info(f"Created comment {comment.id}")
                return comment_dict
            else:
                raise Exception("Failed to insert comment")
                
        except Exception as e:
            logger.error(f"Error creating comment: {e}")
            raise
    
    @classmethod
    def get_comment_by_id(cls, comment_id: str) -> Optional[Dict[str, Any]]:
        """根据ID获取评论"""
        try:
            collection = cls.get_collection()
            comment = collection.find_one({"id": comment_id})
            
            if comment:
                comment['_id'] = str(comment['_id'])
                return comment
            return None
            
        except Exception as e:
            logger.error(f"Error getting comment {comment_id}: {e}")
            return None
    
    @classmethod
    def get_comments_by_target(cls, target_type: str, target_id: str, 
                              skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        """根据目标获取评论"""
        try:
            collection = cls.get_collection()
            
            query = {
                "target_type": target_type,
                "target_id": target_id
            }
            
            comments = list(collection.find(query)
                          .sort("created_at", -1)
                          .skip(skip)
                          .limit(limit))
            
            # 转换ObjectId为字符串
            for comment in comments:
                comment['_id'] = str(comment['_id'])
            
            return comments
            
        except Exception as e:
            logger.error(f"Error getting comments for {target_type}:{target_id}: {e}")
            return []
    
    @classmethod
    def get_recent_comments(cls, limit: int = 20) -> List[Dict[str, Any]]:
        """获取最近的评论"""
        try:
            collection = cls.get_collection()
            
            comments = list(collection.find()
                          .sort("created_at", -1)
                          .limit(limit))
            
            # 转换ObjectId为字符串并添加作者信息
            for comment in comments:
                comment['_id'] = str(comment['_id'])
                
                # 获取作者信息
                try:
                    artist_response = ArtistService.get_by_id(comment['author_id'])
                    if artist_response.success and artist_response.data:
                        comment['author_name'] = artist_response.data.name
                except Exception:
                    comment['author_name'] = f"AI Artist {comment['author_id']}"
            
            return comments
            
        except Exception as e:
            logger.error(f"Error getting recent comments: {e}")
            return []
    
    @classmethod
    def update_comment(cls, comment_id: str, update_data: CommentUpdate) -> Optional[Dict[str, Any]]:
        """更新评论"""
        try:
            collection = cls.get_collection()
            
            # 准备更新数据
            update_dict = {}
            if update_data.content is not None:
                update_dict['content'] = update_data.content
            if update_data.sentiment is not None:
                update_dict['sentiment'] = update_data.sentiment
            if update_data.generation_context is not None:
                update_dict['generation_context'] = update_data.generation_context
            
            update_dict['updated_at'] = datetime.utcnow()
            
            result = collection.update_one(
                {"id": comment_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                return cls.get_comment_by_id(comment_id)
            return None
            
        except Exception as e:
            logger.error(f"Error updating comment {comment_id}: {e}")
            return None
    
    @classmethod
    def delete_comment(cls, comment_id: str) -> bool:
        """删除评论"""
        try:
            collection = cls.get_collection()
            result = collection.delete_one({"id": comment_id})
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting comment {comment_id}: {e}")
            return False
    
    @classmethod
    def get_comment_stats(cls) -> CommentStats:
        """获取评论统计"""
        try:
            collection = cls.get_collection()
            
            # 总评论数
            total_comments = collection.count_documents({})
            
            # AI生成评论数
            ai_generated_comments = collection.count_documents({"ai_generated": True})
            
            # 情感分布
            sentiment_pipeline = [
                {"$group": {
                    "_id": "$sentiment",
                    "count": {"$sum": 1}
                }}
            ]
            sentiment_results = list(collection.aggregate(sentiment_pipeline))
            sentiment_distribution = {
                "positive": 0,
                "negative": 0,
                "neutral": 0
            }
            for result in sentiment_results:
                if result["_id"] in sentiment_distribution:
                    sentiment_distribution[result["_id"]] = result["count"]
            
            # 最活跃艺术家
            active_artists_pipeline = [
                {"$group": {
                    "_id": "$author_id",
                    "comment_count": {"$sum": 1}
                }},
                {"$sort": {"comment_count": -1}},
                {"$limit": 5}
            ]
            active_artists_results = list(collection.aggregate(active_artists_pipeline))
            most_active_artists = []
            
            for result in active_artists_results:
                try:
                    artist_response = ArtistService.get_by_id(result["_id"])
                    artist_name = artist_response.data.name if artist_response.success and artist_response.data else f"AI Artist {result['_id']}"
                except Exception:
                    artist_name = f"AI Artist {result['_id']}"
                
                most_active_artists.append({
                    "name": artist_name,
                    "comment_count": result["comment_count"]
                })
            
            # 活跃线程数（模拟）
            active_threads = 3  # 可以后续实现真实的线程统计
            
            return CommentStats(
                total_comments=total_comments,
                ai_generated_comments=ai_generated_comments,
                active_threads=active_threads,
                most_active_artists=most_active_artists,
                sentiment_distribution=sentiment_distribution
            )
            
        except Exception as e:
            logger.error(f"Error getting comment stats: {e}")
            return CommentStats()
    
    @classmethod
    def get_comment_replies(cls, parent_comment_id: str) -> List[Dict[str, Any]]:
        """获取评论的回复"""
        try:
            collection = cls.get_collection()

            replies = list(collection.find({"parent_comment_id": parent_comment_id})
                         .sort("created_at", 1))  # 回复按时间正序排列

            # 转换ObjectId为字符串并添加作者信息
            for reply in replies:
                reply['_id'] = str(reply['_id'])

                # 获取作者信息
                try:
                    artist_response = ArtistService.get_by_id(reply['author_id'])
                    if artist_response.success and artist_response.data:
                        reply['author_name'] = artist_response.data.name
                except Exception:
                    reply['author_name'] = f"AI Artist {reply['author_id']}"

            return replies

        except Exception as e:
            logger.error(f"Error getting replies for comment {parent_comment_id}: {e}")
            return []

    @classmethod
    def get_comments_with_replies(cls, target_type: str, target_id: str,
                                skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        """获取评论及其回复（嵌套结构）"""
        try:
            # 获取顶级评论（没有父评论的评论）
            collection = cls.get_collection()

            query = {
                "target_type": target_type,
                "target_id": target_id,
                "parent_comment_id": None  # 只获取顶级评论
            }

            top_level_comments = list(collection.find(query)
                                    .sort("created_at", -1)
                                    .skip(skip)
                                    .limit(limit))

            # 为每个顶级评论添加回复
            for comment in top_level_comments:
                comment['_id'] = str(comment['_id'])

                # 获取作者信息
                try:
                    artist_response = ArtistService.get_by_id(comment['author_id'])
                    if artist_response.success and artist_response.data:
                        comment['author_name'] = artist_response.data.name
                except Exception:
                    comment['author_name'] = f"AI Artist {comment['author_id']}"

                # 获取回复
                comment['replies'] = cls.get_comment_replies(comment['id'])
                comment['reply_count'] = len(comment['replies'])

            return top_level_comments

        except Exception as e:
            logger.error(f"Error getting comments with replies for {target_type}:{target_id}: {e}")
            return []

    @classmethod
    def create_comment_thread(cls, topic: str, participant_ids: List[str],
                            thread_type: str = "discussion", max_comments: int = 10) -> Optional[Dict[str, Any]]:
        """创建评论线程"""
        try:
            threads_collection = cls.get_threads_collection()

            thread = AICommentThread(
                topic=topic,
                participants=participant_ids,
                thread_type=thread_type,
                max_comments=max_comments
            )

            thread_dict = thread.to_dict()
            thread_dict['id'] = str(uuid.uuid4())

            result = threads_collection.insert_one(thread_dict)

            if result.inserted_id:
                thread_dict['_id'] = str(result.inserted_id)
                logger.info(f"Created comment thread {thread_dict['id']}")
                return thread_dict
            else:
                raise Exception("Failed to insert comment thread")

        except Exception as e:
            logger.error(f"Error creating comment thread: {e}")
            return None
