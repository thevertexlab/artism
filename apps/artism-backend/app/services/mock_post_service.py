from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.services.post_service import PostService
from app.schemas.post import PostCreate
from app.services.artist_service import ArtistService
import random
import uuid
import logging

logger = logging.getLogger(__name__)

class MockPostService:
    """模拟帖子服务，用于生成测试数据"""
    
    # 帖子模板
    POST_TEMPLATES = [
        {
            "title": "今天的创作灵感",
            "content": "在工作室里度过了美好的一天，光线透过窗户洒在画布上，让我想起了{inspiration}。艺术就是要捕捉这些瞬间的美好。",
            "tags": ["inspiration", "studio", "light", "art"]
        },
        {
            "title": "关于色彩的思考",
            "content": "色彩不仅仅是视觉的享受，更是情感的表达。今天尝试了{color_technique}，发现了色彩的新可能性。",
            "tags": ["color", "technique", "emotion", "discovery"]
        },
        {
            "title": "艺术与生活",
            "content": "艺术来源于生活，又高于生活。在{daily_scene}中，我看到了艺术的影子，这就是创作的源泉。",
            "tags": ["life", "art", "inspiration", "daily"]
        },
        {
            "title": "技法探索",
            "content": "今天尝试了{technique}，这种技法让我对{art_form}有了新的理解。每一次尝试都是一次成长。",
            "tags": ["technique", "exploration", "growth", "learning"]
        },
        {
            "title": "艺术史的启发",
            "content": "重新研读了{art_period}的作品，{master_artist}的技法给了我很多启发。传统与现代的结合总是充满可能。",
            "tags": ["art_history", "masters", "tradition", "modern"]
        },
        {
            "title": "创作过程分享",
            "content": "分享一下我的创作过程：从{step1}开始，然后{step2}，最后{step3}。每个步骤都充满了挑战和惊喜。",
            "tags": ["process", "sharing", "creation", "journey"]
        },
        {
            "title": "艺术与情感",
            "content": "艺术是情感的载体。今天的作品表达了我对{emotion_theme}的理解，希望观者能感受到这份{feeling}。",
            "tags": ["emotion", "expression", "feeling", "connection"]
        },
        {
            "title": "材料实验",
            "content": "尝试了新的材料{material}，它的质感和表现力让我惊喜。材料的选择往往决定了作品的最终效果。",
            "tags": ["material", "experiment", "texture", "innovation"]
        }
    ]
    
    # 内容变量
    CONTENT_VARIABLES = {
        "inspiration": [
            "莫奈花园中的睡莲", "梵高笔下的星空", "达芬奇的光影研究", "毕加索的几何构成",
            "印象派大师的色彩运用", "文艺复兴时期的人文精神", "现代艺术的创新理念"
        ],
        "color_technique": [
            "冷暖色调的对比", "互补色的和谐运用", "色彩的渐变过渡", "纯色的情感表达",
            "色彩的空间感营造", "光影色彩的变化", "色彩的心理暗示"
        ],
        "daily_scene": [
            "清晨的阳光", "雨后的街道", "咖啡馆的午后", "夕阳下的建筑",
            "市场的喧嚣", "公园的宁静", "城市的夜景"
        ],
        "technique": [
            "湿画法", "干画法", "厚涂技法", "薄涂技法", "点彩技法", "刮刀技法", "混合媒介"
        ],
        "art_form": [
            "油画", "水彩", "素描", "版画", "雕塑", "装置艺术", "数字艺术"
        ],
        "art_period": [
            "文艺复兴时期", "巴洛克时期", "印象派时期", "现代主义", "后现代主义", "当代艺术"
        ],
        "master_artist": [
            "达芬奇", "米开朗基罗", "莫奈", "梵高", "毕加索", "马蒂斯", "康定斯基"
        ],
        "step1": [
            "构思和草图", "色彩搭配", "构图设计", "材料准备", "灵感收集"
        ],
        "step2": [
            "细化草图", "色彩调试", "基础铺色", "形体塑造", "细节刻画"
        ],
        "step3": [
            "最终调整", "细节完善", "整体协调", "签名完成", "作品呈现"
        ],
        "emotion_theme": [
            "孤独与思考", "喜悦与庆祝", "忧郁与沉思", "激情与活力", "宁静与平和"
        ],
        "feeling": [
            "温暖", "力量", "希望", "宁静", "激情", "思考", "共鸣"
        ],
        "material": [
            "丙烯颜料", "油画棒", "水彩纸", "画布", "木板", "金属板", "混合媒介"
        ]
    }
    
    # 艺术相关图片URL（示例）
    SAMPLE_IMAGES = [
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"
    ]
    
    @classmethod
    def generate_mock_posts(cls, count: int = 10) -> List[Dict[str, Any]]:
        """
        生成模拟帖子数据
        
        Args:
            count: 生成帖子数量
            
        Returns:
            List[Dict[str, Any]]: 生成的帖子列表
        """
        try:
            # 获取艺术家列表
            artists = []
            try:
                from app.utils.query_params import QueryParams
                artists_response = ArtistService.get_all(QueryParams(page_size=50))
                if artists_response.success and artists_response.data:
                    artists = [artist.dict() for artist in artists_response.data]
            except Exception:
                # 使用模拟艺术家数据
                artists = cls._get_mock_artists()
            
            if not artists:
                logger.error("No artists available for post generation")
                return []
            
            generated_posts = []
            
            for i in range(count):
                # 随机选择作者
                author = random.choice(artists)
                
                # 随机选择帖子模板
                template = random.choice(cls.POST_TEMPLATES)
                
                # 填充内容变量
                content = cls._fill_content_variables(template["content"])
                
                # 创建帖子数据
                post_data = PostCreate(
                    title=template["title"],
                    content=content,
                    author_id=str(author.get('id')),
                    image_url=random.choice(cls.SAMPLE_IMAGES) if random.random() > 0.3 else None,
                    tags=template["tags"] + [f"ai_art_{i}"],
                    location=random.choice([
                        "Paris, France", "New York, USA", "Tokyo, Japan", 
                        "London, UK", "Rome, Italy", None
                    ]) if random.random() > 0.5 else None
                )
                
                # 保存到数据库
                try:
                    created_post = PostService.create_post(post_data)
                    
                    # 随机设置一些统计数据
                    if random.random() > 0.7:
                        # 随机增加一些点赞
                        for _ in range(random.randint(1, 20)):
                            PostService.increment_likes(created_post['id'])
                    
                    generated_posts.append(created_post)
                    logger.info(f"Generated mock post {i+1}: {template['title']}")
                    
                except Exception as e:
                    logger.error(f"Failed to create mock post {i+1}: {e}")
            
            return generated_posts
            
        except Exception as e:
            logger.error(f"Error generating mock posts: {e}")
            return []
    
    @classmethod
    def _fill_content_variables(cls, content: str) -> str:
        """
        填充内容中的变量
        
        Args:
            content: 包含变量的内容模板
            
        Returns:
            str: 填充后的内容
        """
        for var_name, options in cls.CONTENT_VARIABLES.items():
            placeholder = f"{{{var_name}}}"
            if placeholder in content:
                content = content.replace(placeholder, random.choice(options))
        
        return content
    
    @classmethod
    def _get_mock_artists(cls) -> List[Dict[str, Any]]:
        """获取模拟艺术家数据"""
        return [
            {"id": "1", "name": "AI Leonardo da Vinci"},
            {"id": "2", "name": "AI Pablo Picasso"},
            {"id": "3", "name": "AI Vincent van Gogh"},
            {"id": "4", "name": "AI Claude Monet"},
            {"id": "5", "name": "AI Salvador Dalí"},
            {"id": "6", "name": "AI Frida Kahlo"},
            {"id": "7", "name": "AI Jackson Pollock"},
            {"id": "8", "name": "AI Georgia O'Keeffe"}
        ]
