import asyncio
import random
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.services.post_service import PostService
from app.services.ai_comment_service import AICommentService
from app.services.comment_service import CommentService
import logging

logger = logging.getLogger(__name__)

class AutoCommentService:
    """自动评论服务，为帖子自动生成AI评论"""
    
    # 自动评论配置
    AUTO_COMMENT_CONFIG = {
        'min_delay': 30,  # 最小延迟（秒）
        'max_delay': 300,  # 最大延迟（秒）
        'max_comments_per_post': 5,  # 每个帖子最大评论数
        'comment_probability': 0.7,  # 生成评论的概率
        'reply_probability': 0.3,  # 生成回复的概率
    }
    
    @classmethod
    async def start_auto_commenting(cls, duration_minutes: int = 60):
        """
        启动自动评论服务
        
        Args:
            duration_minutes: 运行时长（分钟）
        """
        logger.info(f"Starting auto comment service for {duration_minutes} minutes")
        
        end_time = datetime.utcnow() + timedelta(minutes=duration_minutes)
        
        while datetime.utcnow() < end_time:
            try:
                await cls._process_auto_comments()
                
                # 随机延迟
                delay = random.randint(
                    cls.AUTO_COMMENT_CONFIG['min_delay'],
                    cls.AUTO_COMMENT_CONFIG['max_delay']
                )
                logger.info(f"Waiting {delay} seconds before next auto comment cycle")
                await asyncio.sleep(delay)
                
            except Exception as e:
                logger.error(f"Error in auto comment cycle: {e}")
                await asyncio.sleep(60)  # 出错时等待1分钟
        
        logger.info("Auto comment service stopped")
    
    @classmethod
    async def _process_auto_comments(cls):
        """处理一轮自动评论"""
        try:
            # 获取最近的帖子
            recent_posts = PostService.get_recent_posts(limit=10)
            
            if not recent_posts:
                logger.info("No recent posts found for auto commenting")
                return
            
            for post in recent_posts:
                # 检查是否应该为这个帖子生成评论
                if await cls._should_generate_comment(post):
                    await cls._generate_auto_comment(post)
                
                # 检查是否应该为现有评论生成回复
                if await cls._should_generate_reply(post):
                    await cls._generate_auto_reply(post)
                
                # 短暂延迟避免过于频繁
                await asyncio.sleep(random.uniform(1, 5))
                
        except Exception as e:
            logger.error(f"Error processing auto comments: {e}")
    
    @classmethod
    async def _should_generate_comment(cls, post: Dict[str, Any]) -> bool:
        """
        判断是否应该为帖子生成评论
        
        Args:
            post: 帖子数据
            
        Returns:
            bool: 是否应该生成评论
        """
        try:
            # 检查帖子年龄（只为较新的帖子生成评论）
            created_at = datetime.fromisoformat(post['created_at'].replace('Z', '+00:00'))
            age_hours = (datetime.utcnow() - created_at).total_seconds() / 3600
            
            if age_hours > 24:  # 超过24小时的帖子不再生成评论
                return False
            
            # 检查现有评论数
            current_comments = post.get('comments_count', 0)
            if current_comments >= cls.AUTO_COMMENT_CONFIG['max_comments_per_post']:
                return False
            
            # 基于概率决定
            if random.random() > cls.AUTO_COMMENT_CONFIG['comment_probability']:
                return False
            
            # 基于帖子热度调整概率
            likes_count = post.get('likes_count', 0)
            views_count = post.get('views_count', 0)
            
            # 热度越高，生成评论的概率越大
            heat_factor = min((likes_count + views_count / 10) / 100, 1.0)
            adjusted_probability = cls.AUTO_COMMENT_CONFIG['comment_probability'] * (0.5 + heat_factor)
            
            return random.random() < adjusted_probability
            
        except Exception as e:
            logger.error(f"Error checking if should generate comment: {e}")
            return False
    
    @classmethod
    async def _should_generate_reply(cls, post: Dict[str, Any]) -> bool:
        """
        判断是否应该为帖子的评论生成回复
        
        Args:
            post: 帖子数据
            
        Returns:
            bool: 是否应该生成回复
        """
        try:
            # 只有当帖子有评论时才考虑生成回复
            if post.get('comments_count', 0) == 0:
                return False
            
            # 基于概率决定
            return random.random() < cls.AUTO_COMMENT_CONFIG['reply_probability']
            
        except Exception as e:
            logger.error(f"Error checking if should generate reply: {e}")
            return False
    
    @classmethod
    async def _generate_auto_comment(cls, post: Dict[str, Any]):
        """
        为帖子生成自动评论
        
        Args:
            post: 帖子数据
        """
        try:
            logger.info(f"Generating auto comment for post: {post.get('title', '')[:50]}...")
            
            # 生成1-2条评论
            comment_count = random.randint(1, 2)
            comments = await AICommentService.generate_post_comments(
                post['id'], 
                max_comments=comment_count
            )
            
            if comments:
                logger.info(f"Generated {len(comments)} auto comments for post {post['id']}")
            else:
                logger.warning(f"Failed to generate auto comments for post {post['id']}")
                
        except Exception as e:
            logger.error(f"Error generating auto comment for post {post['id']}: {e}")
    
    @classmethod
    async def _generate_auto_reply(cls, post: Dict[str, Any]):
        """
        为帖子的评论生成自动回复
        
        Args:
            post: 帖子数据
        """
        try:
            # 获取帖子的评论
            comments = CommentService.get_comments_with_replies("post", post['id'], skip=0, limit=5)
            
            if not comments:
                return
            
            # 随机选择一个评论进行回复
            target_comment = random.choice(comments)
            
            # 检查该评论是否已有足够的回复
            if target_comment.get('reply_count', 0) >= 3:
                return
            
            logger.info(f"Generating auto reply for comment: {target_comment.get('content', '')[:50]}...")
            
            # 生成回复
            replies = await AICommentService.generate_reply_comments(
                target_comment['id'],
                max_replies=1
            )
            
            if replies:
                logger.info(f"Generated auto reply for comment {target_comment['id']}")
            else:
                logger.warning(f"Failed to generate auto reply for comment {target_comment['id']}")
                
        except Exception as e:
            logger.error(f"Error generating auto reply for post {post['id']}: {e}")
    
    @classmethod
    async def trigger_immediate_comments(cls, post_id: str, comment_count: int = 3) -> List[Dict[str, Any]]:
        """
        立即为指定帖子生成评论
        
        Args:
            post_id: 帖子ID
            comment_count: 评论数量
            
        Returns:
            List[Dict[str, Any]]: 生成的评论列表
        """
        try:
            logger.info(f"Triggering immediate comments for post {post_id}")
            
            # 生成评论
            comments = await AICommentService.generate_post_comments(post_id, comment_count)
            
            # 随机延迟后生成一些回复
            if comments and random.random() < 0.5:
                await asyncio.sleep(random.uniform(5, 15))
                
                # 为其中一个评论生成回复
                target_comment = random.choice(comments)
                if 'id' in target_comment:
                    await AICommentService.generate_reply_comments(
                        target_comment['id'],
                        max_replies=random.randint(1, 2)
                    )
            
            return comments
            
        except Exception as e:
            logger.error(f"Error triggering immediate comments for post {post_id}: {e}")
            return []
    
    @classmethod
    def get_auto_comment_stats(cls) -> Dict[str, Any]:
        """
        获取自动评论统计信息
        
        Returns:
            Dict[str, Any]: 统计信息
        """
        try:
            # 获取最近24小时的AI评论统计
            from app.services.comment_service import CommentService
            
            # 这里可以添加更详细的统计逻辑
            stats = {
                'auto_comment_enabled': True,
                'config': cls.AUTO_COMMENT_CONFIG,
                'last_run': datetime.utcnow().isoformat(),
                'status': 'active'
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting auto comment stats: {e}")
            return {
                'auto_comment_enabled': False,
                'error': str(e)
            }
