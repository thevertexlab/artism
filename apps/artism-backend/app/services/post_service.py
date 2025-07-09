from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.db.mongodb import get_collection
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate, PostStats
from app.services.artist_service import ArtistService
import uuid
import logging

logger = logging.getLogger(__name__)

class PostService:
    """帖子服务类"""
    
    @staticmethod
    def get_collection():
        """获取帖子集合"""
        return get_collection("posts")
    
    @classmethod
    def create_post(cls, post_data: PostCreate) -> Dict[str, Any]:
        """创建帖子"""
        try:
            collection = cls.get_collection()
            
            # 创建帖子对象
            post = Post(
                title=post_data.title,
                content=post_data.content,
                author_id=post_data.author_id,
                image_url=post_data.image_url,
                artwork_id=post_data.artwork_id,
                tags=post_data.tags,
                location=post_data.location
            )
            
            # 转换为字典并插入数据库
            post_dict = post.to_dict()
            result = collection.insert_one(post_dict)
            
            if result.inserted_id:
                post_dict['_id'] = str(result.inserted_id)
                logger.info(f"Created post {post.id}")
                return post_dict
            else:
                raise Exception("Failed to insert post")
                
        except Exception as e:
            logger.error(f"Error creating post: {e}")
            raise
    
    @classmethod
    def get_post_by_id(cls, post_id: str) -> Optional[Dict[str, Any]]:
        """根据ID获取帖子"""
        try:
            collection = cls.get_collection()
            post = collection.find_one({"id": post_id})
            
            if post:
                post['_id'] = str(post['_id'])
                # 增加浏览数
                collection.update_one(
                    {"id": post_id},
                    {"$inc": {"views_count": 1}, "$set": {"updated_at": datetime.utcnow()}}
                )
                post['views_count'] = post.get('views_count', 0) + 1
                return post
            return None
            
        except Exception as e:
            logger.error(f"Error getting post {post_id}: {e}")
            return None
    
    @classmethod
    def get_recent_posts(cls, limit: int = 20, skip: int = 0) -> List[Dict[str, Any]]:
        """获取最近的帖子"""
        try:
            collection = cls.get_collection()
            
            posts = list(collection.find()
                        .sort("created_at", -1)
                        .skip(skip)
                        .limit(limit))
            
            # 转换ObjectId为字符串并添加作者信息
            for post in posts:
                post['_id'] = str(post['_id'])
                
                # 获取作者信息
                try:
                    artist_response = ArtistService.get_by_id(post['author_id'])
                    if artist_response.success and artist_response.data:
                        post['author_name'] = artist_response.data.name
                        post['author_avatar'] = artist_response.data.avatar_url
                        post['author_username'] = artist_response.data.name.lower().replace(' ', '_')
                        post['is_verified'] = True  # AI艺术家都是认证的
                except Exception:
                    post['author_name'] = f"AI Artist {post['author_id']}"
                    post['author_username'] = f"ai_artist_{post['author_id']}"
                    post['is_verified'] = True
                
                # 添加显示时间
                if 'created_at' in post:
                    post['timestamp_display'] = cls._get_display_timestamp(post['created_at'])
            
            return posts
            
        except Exception as e:
            logger.error(f"Error getting recent posts: {e}")
            return []
    
    @classmethod
    def update_post(cls, post_id: str, update_data: PostUpdate) -> Optional[Dict[str, Any]]:
        """更新帖子"""
        try:
            collection = cls.get_collection()
            
            # 准备更新数据
            update_dict = {}
            if update_data.title is not None:
                update_dict['title'] = update_data.title
            if update_data.content is not None:
                update_dict['content'] = update_data.content
            if update_data.image_url is not None:
                update_dict['image_url'] = update_data.image_url
            if update_data.tags is not None:
                update_dict['tags'] = update_data.tags
            if update_data.location is not None:
                update_dict['location'] = update_data.location
            
            update_dict['updated_at'] = datetime.utcnow()
            
            result = collection.update_one(
                {"id": post_id},
                {"$set": update_dict}
            )
            
            if result.modified_count > 0:
                return cls.get_post_by_id(post_id)
            return None
            
        except Exception as e:
            logger.error(f"Error updating post {post_id}: {e}")
            return None
    
    @classmethod
    def delete_post(cls, post_id: str) -> bool:
        """删除帖子"""
        try:
            collection = cls.get_collection()
            result = collection.delete_one({"id": post_id})
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting post {post_id}: {e}")
            return False
    
    @classmethod
    def increment_likes(cls, post_id: str) -> bool:
        """增加帖子点赞数"""
        try:
            collection = cls.get_collection()
            result = collection.update_one(
                {"id": post_id},
                {"$inc": {"likes_count": 1}, "$set": {"updated_at": datetime.utcnow()}}
            )
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error incrementing likes for post {post_id}: {e}")
            return False
    
    @classmethod
    def increment_comments(cls, post_id: str) -> bool:
        """增加帖子评论数"""
        try:
            collection = cls.get_collection()
            result = collection.update_one(
                {"id": post_id},
                {"$inc": {"comments_count": 1}, "$set": {"updated_at": datetime.utcnow()}}
            )
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error incrementing comments for post {post_id}: {e}")
            return False
    
    @classmethod
    def get_post_stats(cls) -> PostStats:
        """获取帖子统计"""
        try:
            collection = cls.get_collection()
            
            # 总帖子数
            total_posts = collection.count_documents({})
            
            # 总点赞数和评论数
            pipeline = [
                {"$group": {
                    "_id": None,
                    "total_likes": {"$sum": "$likes_count"},
                    "total_comments": {"$sum": "$comments_count"}
                }}
            ]
            stats_result = list(collection.aggregate(pipeline))
            total_likes = stats_result[0]["total_likes"] if stats_result else 0
            total_comments = stats_result[0]["total_comments"] if stats_result else 0
            
            # 最活跃帖子
            most_active_posts = list(collection.find()
                                   .sort("comments_count", -1)
                                   .limit(5))
            
            for post in most_active_posts:
                post['_id'] = str(post['_id'])
            
            # 最近帖子
            recent_posts = cls.get_recent_posts(limit=5)
            
            return PostStats(
                total_posts=total_posts,
                total_likes=total_likes,
                total_comments=total_comments,
                most_active_posts=most_active_posts,
                recent_posts=recent_posts
            )
            
        except Exception as e:
            logger.error(f"Error getting post stats: {e}")
            return PostStats()
    
    @staticmethod
    def _get_display_timestamp(created_at: datetime) -> str:
        """获取显示用的时间戳"""
        now = datetime.utcnow()
        diff = now - created_at
        
        if diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hours ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minutes ago"
        else:
            return "Just now"
