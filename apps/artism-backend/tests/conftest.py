"""
高效学术项目测试配置
使用mongomock解决MongoDB依赖问题
"""

import pytest
import asyncio
from typing import Generator, Dict, Any
from unittest.mock import patch

from fastapi.testclient import TestClient
import mongomock

from app import create_app
from app.utils.data_generator import ArtistDataGenerator, ArtworkDataGenerator, ArtMovementDataGenerator


@pytest.fixture(scope="session")
def event_loop():
    """创建事件循环"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def mock_mongo_client():
    """Mock MongoDB客户端 - 使用mongomock"""
    return mongomock.MongoClient()


@pytest.fixture(scope="function")
def mock_db(mock_mongo_client):
    """Mock数据库 - 每个测试独立的数据库实例"""
    # 为每个测试创建独立的数据库
    db_name = f"test_db_{id(mock_mongo_client)}"
    db = mock_mongo_client[db_name]

    # Patch数据库连接
    with patch('app.db.mongodb.get_database', return_value=db):
        with patch('app.db.mongodb.get_collection') as mock_get_collection:
            def get_collection_side_effect(collection_name):
                return db[collection_name]
            mock_get_collection.side_effect = get_collection_side_effect

            # 返回一个包含集合的字典，方便测试中使用
            yield {
                "artists": db["artists"],
                "artworks": db["artworks"],
                "art_movements": db["art_movements"]
            }


@pytest.fixture(scope="session")
def app():
    """创建测试应用"""
    return create_app()


@pytest.fixture
def client(app, mock_db) -> Generator[TestClient, None, None]:
    """创建测试客户端"""
    with TestClient(app) as test_client:
        yield test_client


# 测试数据fixtures
@pytest.fixture
def sample_artist_data() -> Dict[str, Any]:
    """示例艺术家数据"""
    return {
        "id": "test-artist-1",
        "name": "Test Artist",
        "birth_year": 1980,
        "nationality": "Test Country",
        "bio": "A test artist for testing purposes",
        "is_fictional": False,
        "tags": ["test", "artist"],
        "notable_works": [],
        "associated_movements": [],
        "avatar_url": "https://example.com/avatar.jpg"
    }


@pytest.fixture
def sample_artwork_data() -> Dict[str, Any]:
    """示例艺术品数据"""
    return {
        "id": "test-artwork-1",
        "title": "Test Artwork",
        "artist_id": "test-artist-1",
        "year": 2023,
        "description": "A test artwork",
        "tags": ["test", "artwork"],
        "movement_ids": [],
        "style_vector": [0.1, 0.2, 0.3],
        "image_url": "https://example.com/artwork.jpg"
    }


@pytest.fixture
def sample_movement_data() -> Dict[str, Any]:
    """示例艺术运动数据"""
    return {
        "id": "test-movement-1",
        "name": "Test Movement",
        "description": "A test art movement",
        "start_year": 2020,
        "end_year": 2025,
        "key_artists": [],
        "representative_works": [],
        "tags": ["test", "movement"]
    }


@pytest.fixture
def fictional_artist_data() -> Dict[str, Any]:
    """虚构艺术家数据"""
    return {
        "id": "fictional-artist-1",
        "name": "AI Artist 001",
        "birth_year": 2023,
        "nationality": "Digital",
        "bio": "An AI-generated artist",
        "is_fictional": True,
        "fictional_meta": {
            "origin_project": "zhuyizhuyi",
            "origin_story": "Born in the digital realm",
            "fictional_style": ["AI-Futurism"],
            "model_prompt_seed": "Create a futuristic AI artist"
        },
        "agent": {
            "enabled": True,
            "personality_profile": "Futuristic AI artist",
            "prompt_seed": "You are an AI artist from the future",
            "connected_network_ids": []
        },
        "tags": ["AI", "digital", "futuristic"],
        "notable_works": [],
        "associated_movements": []
    }


# 测试工具函数
@pytest.fixture
def assert_response_format():
    """验证API响应格式的工具函数"""
    def _assert_response_format(response_data, success=True):
        """验证统一响应格式"""
        assert "success" in response_data
        assert "message" in response_data
        assert "code" in response_data
        assert "timestamp" in response_data
        assert response_data["success"] == success
        
        if success:
            assert "data" in response_data
        else:
            assert response_data["code"] >= 400
    
    return _assert_response_format


@pytest.fixture
def assert_paginated_response():
    """验证分页响应格式的工具函数"""
    def _assert_paginated_response(response_data):
        """验证分页响应格式"""
        assert "success" in response_data
        assert "data" in response_data
        assert "total" in response_data
        assert "page" in response_data
        assert "page_size" in response_data
        assert "total_pages" in response_data
        assert "has_next" in response_data
        assert "has_prev" in response_data
        assert isinstance(response_data["data"], list)
    
    return _assert_paginated_response
