from typing import Optional, Dict, Any, List
from datetime import datetime
from .base import BaseModel
import uuid

class Comment(BaseModel):
    """
    评论数据模型

    用于表示AI艺术家之间的评论和互动
    """

    def __init__(
        self,
        content: str,
        author_id: str,  # 改为字符串类型以匹配艺术家ID
        target_type: str,  # 'artwork', 'artist', 'comment'
        target_id: str,   # 改为字符串类型
        parent_comment_id: Optional[str] = None,  # 改为字符串类型
        sentiment: Optional[str] = None,  # 'positive', 'negative', 'neutral'
        ai_generated: bool = True,
        generation_context: Optional[Dict[str, Any]] = None,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.id = kwargs.get('id', str(uuid.uuid4()))
        self.content = content
        self.author_id = author_id
        self.target_type = target_type
        self.target_id = target_id
        self.parent_comment_id = parent_comment_id
        self.sentiment = sentiment
        self.ai_generated = ai_generated
        self.generation_context = generation_context or {}
        self.created_at = kwargs.get('created_at', datetime.utcnow())
        self.updated_at = kwargs.get('updated_at', datetime.utcnow())
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Comment':
        """
        从字典创建评论实例
        
        Args:
            data: 包含评论数据的字典
            
        Returns:
            Comment: 评论实例
        """
        if 'content' not in data:
            raise ValueError("Comment data must contain 'content' field")
        if 'author_id' not in data:
            raise ValueError("Comment data must contain 'author_id' field")
        if 'target_type' not in data:
            raise ValueError("Comment data must contain 'target_type' field")
        if 'target_id' not in data:
            raise ValueError("Comment data must contain 'target_id' field")
            
        return super().from_dict(data)
    
    def validate_data(self) -> List[str]:
        """
        验证评论数据
        
        Returns:
            List[str]: 验证错误列表
        """
        errors = super().validate_data()
        
        if not self.content or not self.content.strip():
            errors.append("Comment content is required")
            
        if self.target_type not in ['artwork', 'artist', 'comment']:
            errors.append("Invalid target_type. Must be 'artwork', 'artist', or 'comment'")
            
        if self.sentiment and self.sentiment not in ['positive', 'negative', 'neutral']:
            errors.append("Invalid sentiment. Must be 'positive', 'negative', or 'neutral'")
            
        return errors

class AICommentThread(BaseModel):
    """
    AI评论线程模型
    
    用于管理AI之间的对话串
    """
    
    def __init__(
        self,
        topic: str,
        participants: List[int],  # AI艺术家ID列表
        status: str = 'active',  # 'active', 'completed', 'paused'
        thread_type: str = 'discussion',  # 'discussion', 'debate', 'collaboration'
        max_comments: int = 10,
        **kwargs
    ):
        super().__init__(**kwargs)
        self.topic = topic
        self.participants = participants
        self.status = status
        self.thread_type = thread_type
        self.max_comments = max_comments
        self.comment_count = 0
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def add_comment(self, comment_id: int):
        """添加评论到线程"""
        self.comment_count += 1
        self.updated_at = datetime.utcnow()
        
        if self.comment_count >= self.max_comments:
            self.status = 'completed'
