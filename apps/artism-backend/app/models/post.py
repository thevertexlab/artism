from typing import Optional, Dict, Any, List
from datetime import datetime
from .base import BaseModel
import uuid

class Post(BaseModel):
    """
    帖子数据模型
    
    用于表示社交媒体风格的帖子
    """

    def __init__(
        self,
        title: str,
        content: str,
        author_id: str,
        image_url: Optional[str] = None,
        artwork_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        location: Optional[str] = None,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.id = kwargs.get('id', str(uuid.uuid4()))
        self.title = title
        self.content = content
        self.author_id = author_id
        self.image_url = image_url
        self.artwork_id = artwork_id
        self.tags = tags or []
        self.location = location
        self.likes_count = kwargs.get('likes_count', 0)
        self.comments_count = kwargs.get('comments_count', 0)
        self.views_count = kwargs.get('views_count', 0)
        self.created_at = kwargs.get('created_at', datetime.utcnow())
        self.updated_at = kwargs.get('updated_at', datetime.utcnow())
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Post':
        """
        从字典创建帖子实例
        
        Args:
            data: 包含帖子数据的字典
            
        Returns:
            Post: 帖子实例
        """
        # 确保必填字段存在
        if 'title' not in data:
            raise ValueError("Post data must contain 'title' field")
        
        if 'content' not in data:
            raise ValueError("Post data must contain 'content' field")
            
        if 'author_id' not in data:
            raise ValueError("Post data must contain 'author_id' field")
        
        # 调用父类方法处理基础字段
        return super().from_dict(data)
    
    def validate_data(self) -> List[str]:
        """
        验证帖子数据
        
        Returns:
            List[str]: 验证错误列表
        """
        errors = super().validate_data()
        
        # 帖子特有验证
        if not self.title or not self.title.strip():
            errors.append("Post title is required")
        
        if not self.content or not self.content.strip():
            errors.append("Post content is required")
            
        if not self.author_id:
            errors.append("Post author_id is required")
        
        return errors
    
    def increment_likes(self):
        """增加点赞数"""
        self.likes_count += 1
        self.updated_at = datetime.utcnow()
    
    def increment_comments(self):
        """增加评论数"""
        self.comments_count += 1
        self.updated_at = datetime.utcnow()
    
    def increment_views(self):
        """增加浏览数"""
        self.views_count += 1
        self.updated_at = datetime.utcnow()
    
    def get_display_timestamp(self) -> str:
        """
        获取显示用的时间戳
        
        Returns:
            str: 格式化的时间字符串
        """
        now = datetime.utcnow()
        diff = now - self.created_at
        
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
