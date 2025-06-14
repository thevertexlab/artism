from typing import Dict, Any, Optional
from app.core.config import OPENAI_API_KEY
from app.services.artist_service import ArtistService

class AIService:
    """
    AI 服务类
    
    提供与 AI 艺术家交互的功能
    """
    
    @classmethod
    def interact(cls, message: str, artist_id: Optional[int] = None) -> Dict[str, Any]:
        """
        与 AI 艺术家交互
        
        Args:
            message: 用户消息
            artist_id: 艺术家 ID，如果为 None 则使用默认 AI 艺术家
            
        Returns:
            Dict[str, Any]: 包含 AI 艺术家回复的字典
        """
        # 获取艺术家信息（如果指定了艺术家 ID）
        artist_info = None
        artist_name = "AI Leonardo da Vinci"  # 默认 AI 艺术家名称
        
        if artist_id is not None:
            artist = ArtistService.get_artist_by_id(artist_id)
            if artist:
                artist_info = artist
                artist_name = f"AI {artist['name']}"
        
        # TODO: 在生产环境中，这里应该集成 OpenAI API 或其他 LLM
        # 目前返回模拟响应
        response = cls._generate_mock_response(message, artist_info)
        
        return {
            "response": response,
            "artist_name": artist_name
        }
    
    @staticmethod
    def _generate_mock_response(message: str, artist_info: Optional[Dict[str, Any]] = None) -> str:
        """
        生成模拟 AI 响应
        
        Args:
            message: 用户消息
            artist_info: 艺术家信息
            
        Returns:
            str: 模拟 AI 响应
        """
        if artist_info:
            return f"作为 AI {artist_info['name']}，我的回复是：{message}"
        else:
            return f"AI 艺术家回复：{message}"
    
    @classmethod
    def is_api_key_configured(cls) -> bool:
        """
        检查 OpenAI API 密钥是否已配置
        
        Returns:
            bool: 是否已配置 API 密钥
        """
        return bool(OPENAI_API_KEY) 