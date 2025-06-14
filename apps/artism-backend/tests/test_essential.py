"""
核心功能验证测试 - 最精简高效的测试方案
专注于验证系统核心功能正常工作
"""

import pytest


class TestDataModels:
    """数据模型核心验证"""
    
    def test_artist_model_basic_functionality(self):
        """测试艺术家模型基本功能"""
        from app.models.artist import Artist
        
        # 真实艺术家
        real_artist_data = {
            "name": "Leonardo da Vinci",
            "birth_year": 1452,
            "death_year": 1519,
            "nationality": "Italian",
            "is_fictional": False,
            "tags": ["Renaissance", "Painting"]
        }
        
        artist = Artist.from_dict(real_artist_data)
        assert artist.name == "Leonardo da Vinci"
        assert artist.is_fictional == False
        
        # 虚构艺术家
        fictional_artist_data = {
            "name": "AI Artist 001",
            "birth_year": 2023,
            "nationality": "Digital",
            "is_fictional": True,
            "fictional_meta": {
                "origin_project": "zhuyizhuyi",
                "origin_story": "Born in the digital realm"
            },
            "agent": {
                "enabled": True,
                "personality_profile": "Futuristic AI artist"
            }
        }
        
        fictional_artist = Artist.from_dict(fictional_artist_data)
        assert fictional_artist.is_fictional == True
        assert fictional_artist.fictional_meta["origin_project"] == "zhuyizhuyi"
        assert fictional_artist.agent["enabled"] == True
    
    def test_artwork_model_basic_functionality(self):
        """测试艺术品模型基本功能"""
        from app.models.artwork import Artwork
        
        artwork_data = {
            "title": "Mona Lisa",
            "artist_id": "leonardo-da-vinci",
            "year": 1503,
            "description": "Famous portrait painting",
            "tags": ["portrait", "Renaissance"],
            "style_vector": [0.1, 0.2, 0.3, 0.4, 0.5]
        }
        
        artwork = Artwork.from_dict(artwork_data)
        assert artwork.title == "Mona Lisa"
        assert artwork.artist_id == "leonardo-da-vinci"
        assert len(artwork.style_vector) == 5
        
        # 测试风格相似度计算
        vector1 = [1.0, 0.0, 0.0]
        vector2 = [1.0, 0.0, 0.0]
        similarity = Artwork.calculate_style_similarity(vector1, vector2)
        assert abs(similarity - 1.0) < 0.001  # 相同向量相似度为1
    
    def test_art_movement_model_basic_functionality(self):
        """测试艺术运动模型基本功能"""
        from app.models.art_movement import ArtMovement
        
        movement_data = {
            "name": "Renaissance",
            "description": "A period of European cultural rebirth",
            "start_year": 1400,
            "end_year": 1600,
            "key_artists": [],
            "representative_works": [],
            "tags": ["classical", "humanism"]
        }
        
        movement = ArtMovement.from_dict(movement_data)
        assert movement.name == "Renaissance"
        assert movement.get_duration() == 200
        assert movement.is_active_in_year(1500) == True
        assert movement.is_active_in_year(1300) == False


class TestDataGeneration:
    """数据生成功能验证"""
    
    def test_real_artist_generation(self):
        """测试真实艺术家生成"""
        from app.utils.data_generator import ArtistDataGenerator
        
        artists = ArtistDataGenerator.generate_real_artists(count=3)
        
        assert len(artists) == 3
        for artist in artists:
            assert "id" in artist
            assert "name" in artist
            assert artist["is_fictional"] == False
            assert "agent" in artist
            assert artist["agent"]["enabled"] == True
    
    def test_fictional_artist_generation(self):
        """测试虚构艺术家生成"""
        from app.utils.data_generator import ArtistDataGenerator
        
        artists = ArtistDataGenerator.generate_fictional_artists(count=2, project="zhuyizhuyi")
        
        assert len(artists) == 2
        for artist in artists:
            assert artist["is_fictional"] == True
            assert artist["fictional_meta"]["origin_project"] == "zhuyizhuyi"
            assert "agent" in artist
    
    def test_artwork_generation(self):
        """测试艺术品生成"""
        from app.utils.data_generator import ArtworkDataGenerator
        
        artist_ids = ["artist-1", "artist-2"]
        artworks = ArtworkDataGenerator.generate_artworks(artist_ids, count=4)
        
        assert len(artworks) == 4
        for artwork in artworks:
            assert artwork["artist_id"] in artist_ids
            assert "style_vector" in artwork
            assert len(artwork["style_vector"]) == 128  # 128维向量
    
    def test_complete_dataset_generation(self):
        """测试完整数据集生成"""
        from app.utils.data_generator import FullDatasetGenerator
        
        dataset = FullDatasetGenerator.generate_complete_dataset(
            real_artists_count=2,
            fictional_artists_count=2,
            artworks_per_artist=2,
            include_movements=True
        )
        
        assert "artists" in dataset
        assert "artworks" in dataset
        assert "movements" in dataset
        
        assert len(dataset["artists"]) == 4
        assert len(dataset["artworks"]) == 8
        assert len(dataset["movements"]) > 0


class TestResponseFormats:
    """响应格式验证"""
    
    def test_success_response(self):
        """测试成功响应格式"""
        from app.schemas.response import create_success_response
        
        response = create_success_response(
            data={"test": "data"},
            message="Operation successful"
        )
        
        assert response.success == True
        assert response.data == {"test": "data"}
        assert response.message == "Operation successful"
        assert response.code == 200
        assert response.timestamp is not None
    
    def test_error_response(self):
        """测试错误响应格式"""
        from app.schemas.response import create_error_response
        
        response = create_error_response(
            message="Something went wrong",
            code=400,
            error_details={"field": "error"}
        )
        
        assert response.success == False
        assert response.message == "Something went wrong"
        assert response.code == 400
        assert response.error_details == {"field": "error"}
    
    def test_paginated_response(self):
        """测试分页响应格式"""
        from app.schemas.response import create_paginated_response
        
        response = create_paginated_response(
            data=[{"id": 1}, {"id": 2}],
            total=100,
            page=2,
            page_size=10
        )
        
        assert response.success == True
        assert len(response.data) == 2
        assert response.total == 100
        assert response.page == 2
        assert response.page_size == 10
        assert response.total_pages == 10
        assert response.has_next == True
        assert response.has_prev == True


class TestQueryParameters:
    """查询参数功能验证"""
    
    def test_query_params_basic(self):
        """测试查询参数基本功能"""
        from app.utils.query_params import QueryParams, QueryParamsParser

        # 创建查询参数
        params = QueryParams(
            search="test",
            page=2
        )

        assert params.search == "test"
        assert params.page == 2
        assert params.page_size == 10  # 默认值

        # 测试虚构筛选参数 - 使用正确的字段名
        fictional_params = QueryParams(**{"isFictional": True})
        assert fictional_params.is_fictional == True
    
    def test_mongo_filter_building(self):
        """测试MongoDB过滤器构建"""
        from app.utils.query_params import QueryParams, QueryParamsParser
        
        # 测试虚构筛选
        params = QueryParams(is_fictional=True)
        filter_dict = QueryParamsParser.build_mongo_filter(params)
        
        # 基本验证 - 确保函数能正常运行
        assert isinstance(filter_dict, dict)
        
        # 测试搜索条件
        params = QueryParams(search="test")
        filter_dict = QueryParamsParser.build_mongo_filter(params)
        assert isinstance(filter_dict, dict)
    
    def test_pagination_calculation(self):
        """测试分页计算"""
        from app.utils.query_params import QueryParamsParser
        
        # 第一页
        skip = QueryParamsParser.calculate_skip(page=1, page_size=10)
        assert skip == 0
        
        # 第三页
        skip = QueryParamsParser.calculate_skip(page=3, page_size=20)
        assert skip == 40


class TestUtilityFunctions:
    """工具函数验证"""
    
    def test_data_cleaning(self):
        """测试数据清理功能"""
        from app.models.base import BaseModel
        
        dirty_data = {
            "name": "  Test Name  ",
            "bio": "",
            "nationality": None,
            "year": 2023,
            "empty_field": ""
        }
        
        clean_data = BaseModel.clean_data(dirty_data)
        
        assert clean_data["name"] == "Test Name"  # 去除空格
        assert "bio" not in clean_data  # 移除空字符串
        assert "nationality" not in clean_data  # 移除None值
        assert clean_data["year"] == 2023  # 保留有效值
    
    def test_id_generation(self):
        """测试ID生成"""
        from app.utils.data_generator import DataGenerator
        
        id1 = DataGenerator.generate_id()
        id2 = DataGenerator.generate_id()
        
        assert isinstance(id1, str)
        assert isinstance(id2, str)
        assert id1 != id2  # 确保唯一性
        assert len(id1) > 10  # UUID应该有合理长度


class TestIntegration:
    """集成测试 - 验证组件协作"""
    
    def test_artist_artwork_relationship(self):
        """测试艺术家-作品关系"""
        from app.utils.data_generator import ArtistDataGenerator, ArtworkDataGenerator
        
        # 生成艺术家
        artists = ArtistDataGenerator.generate_real_artists(count=1)
        artist = artists[0]
        
        # 生成该艺术家的作品
        artworks = ArtworkDataGenerator.generate_artworks([artist["id"]], count=2)
        
        # 验证关系
        for artwork in artworks:
            assert artwork["artist_id"] == artist["id"]
    
    def test_movement_artist_relationship(self):
        """测试艺术运动-艺术家关系"""
        from app.models.art_movement import ArtMovement
        
        movement_data = {
            "name": "Test Movement",
            "key_artists": [],
            "representative_works": []
        }
        
        movement = ArtMovement.from_dict(movement_data)
        
        # 添加艺术家
        movement.add_artist("artist-1")
        assert "artist-1" in movement.key_artists
        
        # 移除艺术家
        movement.remove_artist("artist-1")
        assert "artist-1" not in movement.key_artists
