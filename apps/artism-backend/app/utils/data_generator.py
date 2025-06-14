from typing import List, Dict, Any, Optional
import random
import uuid
from datetime import datetime
import json

from app.models.artist import Artist
from app.models.artwork import Artwork
from app.models.art_movement import ArtMovement


class DataGenerator:
    """
    数据生成器基类
    """
    
    @staticmethod
    def generate_id() -> str:
        """生成唯一ID"""
        return str(uuid.uuid4())
    
    @staticmethod
    def generate_tags(base_tags: List[str], count: int = 3) -> List[str]:
        """生成随机标签"""
        return random.sample(base_tags, min(count, len(base_tags)))


class ArtistDataGenerator(DataGenerator):
    """
    艺术家数据生成器
    """
    
    # 真实艺术家数据模板
    REAL_ARTISTS_DATA = [
        {
            "name": "Leonardo da Vinci",
            "birth_year": 1452,
            "death_year": 1519,
            "nationality": "Italian",
            "bio": "Italian polymath of the Renaissance whose areas of interest included invention, drawing, painting, sculpture, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, paleontology, and cartography.",
            "tags": ["Renaissance", "Painting", "Sculpture", "Science"]
        },
        {
            "name": "Vincent van Gogh",
            "birth_year": 1853,
            "death_year": 1890,
            "nationality": "Dutch",
            "bio": "Dutch post-impressionist painter who is among the most famous and influential figures in the history of Western art.",
            "tags": ["Post-Impressionism", "Painting", "Expressionism"]
        },
        {
            "name": "Pablo Picasso",
            "birth_year": 1881,
            "death_year": 1973,
            "nationality": "Spanish",
            "bio": "Spanish painter, sculptor, printmaker, ceramicist and theatre designer who spent most of his adult life in France.",
            "tags": ["Cubism", "Modern Art", "Painting", "Sculpture"]
        },
        {
            "name": "Claude Monet",
            "birth_year": 1840,
            "death_year": 1926,
            "nationality": "French",
            "bio": "French painter and founder of French Impressionist painting, and the most consistent and prolific practitioner of the movement's philosophy.",
            "tags": ["Impressionism", "Landscape", "Painting"]
        },
        {
            "name": "Frida Kahlo",
            "birth_year": 1907,
            "death_year": 1954,
            "nationality": "Mexican",
            "bio": "Mexican artist who painted many portraits, self-portraits and works inspired by the nature and artifacts of Mexico.",
            "tags": ["Surrealism", "Self-Portrait", "Mexican Art"]
        }
    ]
    
    # 虚构艺术家名称模板
    FICTIONAL_NAMES = [
        "Zara Nexus", "Kai Quantum", "Luna Synthesis", "Orion Flux", "Nova Prism",
        "Echo Vortex", "Sage Hologram", "Raven Matrix", "Phoenix Digital", "Storm Pixel"
    ]
    
    # 虚构风格标签
    FICTIONAL_STYLES = [
        "AI融合主义", "数字未来主义", "虚拟现实主义", "算法表现主义", "赛博朋克艺术",
        "量子美学", "神经网络艺术", "区块链艺术", "元宇宙主义", "机器学习艺术"
    ]
    
    @classmethod
    def generate_real_artists(cls, count: int = 5) -> List[Dict[str, Any]]:
        """
        生成真实艺术家数据
        
        Args:
            count: 生成数量
            
        Returns:
            List[Dict[str, Any]]: 艺术家数据列表
        """
        artists = []
        
        # 使用预定义的真实艺术家数据
        base_data = cls.REAL_ARTISTS_DATA[:count]
        
        for i, artist_data in enumerate(base_data):
            artist = {
                "id": cls.generate_id(),
                "name": artist_data["name"],
                "birth_year": artist_data["birth_year"],
                "death_year": artist_data["death_year"],
                "nationality": artist_data["nationality"],
                "bio": artist_data["bio"],
                "avatar_url": f"https://example.com/avatars/real_artist_{i+1}.jpg",
                "notable_works": [],
                "associated_movements": [],
                "tags": artist_data["tags"],
                "is_fictional": False,
                "fictional_meta": None,
                "agent": {
                    "enabled": True,
                    "personality_profile": f"Historical personality based on {artist_data['name']}",
                    "prompt_seed": f"You are {artist_data['name']}, the famous artist.",
                    "connected_network_ids": []
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            artists.append(artist)
        
        return artists
    
    @classmethod
    def generate_fictional_artists(cls, count: int = 5, project: str = "zhuyizhuyi") -> List[Dict[str, Any]]:
        """
        生成虚构艺术家数据
        
        Args:
            count: 生成数量
            project: 项目名称
            
        Returns:
            List[Dict[str, Any]]: 虚构艺术家数据列表
        """
        artists = []
        
        for i in range(count):
            name = random.choice(cls.FICTIONAL_NAMES)
            birth_year = random.randint(2020, 2050)
            
            artist = {
                "id": cls.generate_id(),
                "name": f"{name} #{i+1:03d}",
                "birth_year": birth_year,
                "death_year": None,
                "nationality": "Digital",
                "bio": f"AI-generated artist from the {project} project, specializing in digital and virtual art forms.",
                "avatar_url": f"https://example.com/avatars/fictional_artist_{i+1}.jpg",
                "notable_works": [],
                "associated_movements": [],
                "tags": cls.generate_tags(cls.FICTIONAL_STYLES, 3),
                "is_fictional": True,
                "fictional_meta": {
                    "origin_project": project,
                    "origin_story": f"Born in the digital realm of {project}, {name} represents the fusion of artificial intelligence and artistic expression.",
                    "fictional_style": cls.generate_tags(cls.FICTIONAL_STYLES, 2),
                    "model_prompt_seed": f"Create an AI artist named {name} who specializes in {random.choice(cls.FICTIONAL_STYLES)}"
                },
                "agent": {
                    "enabled": True,
                    "personality_profile": f"Futuristic AI artist with expertise in {random.choice(cls.FICTIONAL_STYLES)}",
                    "prompt_seed": f"You are {name}, an AI-generated artist from the future.",
                    "connected_network_ids": []
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            artists.append(artist)
        
        return artists


class ArtworkDataGenerator(DataGenerator):
    """
    艺术品数据生成器
    """
    
    # 作品标题模板
    ARTWORK_TITLES = [
        "Starry Night", "The Persistence of Memory", "Girl with a Pearl Earring",
        "The Great Wave", "Mona Lisa", "The Scream", "Guernica", "The Birth of Venus",
        "American Gothic", "The Last Supper", "Water Lilies", "The Thinker",
        "David", "The Kiss", "Sunflowers", "The Creation of Adam"
    ]
    
    # 虚构作品标题
    FICTIONAL_TITLES = [
        "Digital Dreams", "Quantum Entanglement", "Neural Network Symphony", "Virtual Reality",
        "Algorithmic Beauty", "Cyber Landscape", "AI Consciousness", "Digital Metamorphosis",
        "Quantum Superposition", "Virtual Emotions", "Digital Evolution", "Cyber Genesis"
    ]
    
    @classmethod
    def generate_artworks(cls, artist_ids: List[str], count: int = 10, fictional: bool = False) -> List[Dict[str, Any]]:
        """
        生成艺术品数据
        
        Args:
            artist_ids: 艺术家ID列表
            count: 生成数量
            fictional: 是否为虚构作品
            
        Returns:
            List[Dict[str, Any]]: 艺术品数据列表
        """
        artworks = []
        titles = cls.FICTIONAL_TITLES if fictional else cls.ARTWORK_TITLES
        
        for i in range(count):
            artist_id = random.choice(artist_ids)
            year = random.randint(2020 if fictional else 1400, 2024)
            
            artwork = {
                "id": cls.generate_id(),
                "title": f"{random.choice(titles)} #{i+1:03d}",
                "artist_id": artist_id,
                "year": year,
                "description": f"A {'digital' if fictional else 'traditional'} artwork created in {year}",
                "image_url": f"https://example.com/artworks/{'fictional' if fictional else 'real'}_{i+1}.jpg",
                "movement_ids": [],
                "tags": cls.generate_tags(
                    ArtistDataGenerator.FICTIONAL_STYLES if fictional else ["Classical", "Modern", "Contemporary", "Abstract"],
                    3
                ),
                "style_vector": [random.random() for _ in range(128)],  # 128维风格向量
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            artworks.append(artwork)
        
        return artworks


class ArtMovementDataGenerator(DataGenerator):
    """
    艺术运动数据生成器
    """
    
    # 真实艺术运动数据
    REAL_MOVEMENTS = [
        {
            "name": "Renaissance",
            "description": "A period of European cultural, artistic, political and economic rebirth following the Middle Ages.",
            "start_year": 1400,
            "end_year": 1600,
            "tags": ["Classical", "Humanism", "Perspective"]
        },
        {
            "name": "Impressionism",
            "description": "A 19th-century art movement characterized by relatively small, thin, yet visible brush strokes.",
            "start_year": 1860,
            "end_year": 1886,
            "tags": ["Light", "Color", "Outdoor Painting"]
        },
        {
            "name": "Cubism",
            "description": "An early-20th-century avant-garde art movement that revolutionized European painting and sculpture.",
            "start_year": 1907,
            "end_year": 1914,
            "tags": ["Geometric", "Abstract", "Multiple Perspectives"]
        },
        {
            "name": "Surrealism",
            "description": "A cultural movement that began in the early 1920s, and is best known for its visual artworks and writings.",
            "start_year": 1920,
            "end_year": 1960,
            "tags": ["Dreams", "Unconscious", "Fantasy"]
        }
    ]
    
    # 虚构艺术运动
    FICTIONAL_MOVEMENTS = [
        {
            "name": "AI-Futurism",
            "description": "A digital art movement that explores the intersection of artificial intelligence and human creativity.",
            "start_year": 2020,
            "end_year": None,
            "tags": ["AI", "Digital", "Future"]
        },
        {
            "name": "Quantum Aesthetics",
            "description": "An art movement inspired by quantum physics and the uncertainty principle.",
            "start_year": 2022,
            "end_year": None,
            "tags": ["Quantum", "Physics", "Uncertainty"]
        }
    ]
    
    @classmethod
    def generate_movements(cls, fictional: bool = False) -> List[Dict[str, Any]]:
        """
        生成艺术运动数据
        
        Args:
            fictional: 是否为虚构运动
            
        Returns:
            List[Dict[str, Any]]: 艺术运动数据列表
        """
        movements = []
        source_data = cls.FICTIONAL_MOVEMENTS if fictional else cls.REAL_MOVEMENTS
        
        for movement_data in source_data:
            movement = {
                "id": cls.generate_id(),
                "name": movement_data["name"],
                "description": movement_data["description"],
                "start_year": movement_data["start_year"],
                "end_year": movement_data["end_year"],
                "key_artists": [],
                "representative_works": [],
                "tags": movement_data["tags"],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            movements.append(movement)
        
        return movements


class FullDatasetGenerator:
    """
    完整数据集生成器
    """
    
    @classmethod
    def generate_complete_dataset(
        cls,
        real_artists_count: int = 5,
        fictional_artists_count: int = 5,
        artworks_per_artist: int = 2,
        include_movements: bool = True
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        生成完整的数据集
        
        Args:
            real_artists_count: 真实艺术家数量
            fictional_artists_count: 虚构艺术家数量
            artworks_per_artist: 每个艺术家的作品数量
            include_movements: 是否包含艺术运动
            
        Returns:
            Dict[str, List[Dict[str, Any]]]: 完整数据集
        """
        # 生成艺术家
        real_artists = ArtistDataGenerator.generate_real_artists(real_artists_count)
        fictional_artists = ArtistDataGenerator.generate_fictional_artists(fictional_artists_count)
        all_artists = real_artists + fictional_artists
        
        # 生成艺术品
        real_artist_ids = [artist["id"] for artist in real_artists]
        fictional_artist_ids = [artist["id"] for artist in fictional_artists]
        
        real_artworks = ArtworkDataGenerator.generate_artworks(
            real_artist_ids, 
            real_artists_count * artworks_per_artist, 
            fictional=False
        )
        fictional_artworks = ArtworkDataGenerator.generate_artworks(
            fictional_artist_ids, 
            fictional_artists_count * artworks_per_artist, 
            fictional=True
        )
        all_artworks = real_artworks + fictional_artworks
        
        # 生成艺术运动
        movements = []
        if include_movements:
            real_movements = ArtMovementDataGenerator.generate_movements(fictional=False)
            fictional_movements = ArtMovementDataGenerator.generate_movements(fictional=True)
            movements = real_movements + fictional_movements
        
        # 建立关联关系
        cls._establish_relationships(all_artists, all_artworks, movements)
        
        return {
            "artists": all_artists,
            "artworks": all_artworks,
            "movements": movements
        }
    
    @classmethod
    def _establish_relationships(
        cls, 
        artists: List[Dict[str, Any]], 
        artworks: List[Dict[str, Any]], 
        movements: List[Dict[str, Any]]
    ):
        """
        建立数据之间的关联关系
        
        Args:
            artists: 艺术家列表
            artworks: 艺术品列表
            movements: 艺术运动列表
        """
        # 为艺术家分配作品
        for artist in artists:
            artist_artworks = [aw for aw in artworks if aw["artist_id"] == artist["id"]]
            artist["notable_works"] = [aw["id"] for aw in artist_artworks]
        
        # 为艺术家和作品分配运动
        if movements:
            for artist in artists:
                # 随机分配1-2个艺术运动
                assigned_movements = random.sample(movements, min(2, len(movements)))
                artist["associated_movements"] = [mv["id"] for mv in assigned_movements]
                
                # 更新运动的关键艺术家
                for movement in assigned_movements:
                    if artist["id"] not in movement["key_artists"]:
                        movement["key_artists"].append(artist["id"])
            
            for artwork in artworks:
                # 根据艺术家的运动分配作品运动
                artist = next((a for a in artists if a["id"] == artwork["artist_id"]), None)
                if artist and artist["associated_movements"]:
                    artwork["movement_ids"] = random.sample(
                        artist["associated_movements"], 
                        min(1, len(artist["associated_movements"]))
                    )
                    
                    # 更新运动的代表作品
                    for movement_id in artwork["movement_ids"]:
                        movement = next((m for m in movements if m["id"] == movement_id), None)
                        if movement and artwork["id"] not in movement["representative_works"]:
                            movement["representative_works"].append(artwork["id"])
