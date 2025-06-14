"""
核心功能测试 - 高效学术项目测试方案
重点测试关键功能，确保系统正常工作
"""

import pytest
from unittest.mock import MagicMock


@pytest.mark.unit
@pytest.mark.core
class TestModels:
    """数据模型核心测试"""
    
    def test_artist_model_creation(self, sample_artist_data):
        """测试艺术家模型创建"""
        from app.models.artist import Artist
        
        artist = Artist.from_dict(sample_artist_data)
        
        assert artist.name == "Test Artist"
        assert artist.birth_year == 1980
        assert artist.is_fictional == False
        assert isinstance(artist.tags, list)
    
    def test_fictional_artist_creation(self, fictional_artist_data):
        """测试虚构艺术家创建"""
        from app.models.artist import Artist
        
        artist = Artist.from_dict(fictional_artist_data)
        
        assert artist.is_fictional == True
        assert artist.fictional_meta is not None
        assert artist.agent is not None
    
    def test_artwork_model_creation(self, sample_artwork_data):
        """测试艺术品模型创建"""
        from app.models.artwork import Artwork
        
        artwork = Artwork.from_dict(sample_artwork_data)
        
        assert artwork.title == "Test Artwork"
        assert artwork.artist_id == "test-artist-1"
        assert isinstance(artwork.style_vector, list)
    
    def test_movement_model_creation(self, sample_movement_data):
        """测试艺术运动模型创建"""
        from app.models.art_movement import ArtMovement
        
        movement = ArtMovement.from_dict(sample_movement_data)
        
        assert movement.name == "Test Movement"
        assert movement.start_year == 2020
        assert movement.end_year == 2025


@pytest.mark.unit
@pytest.mark.core
class TestServices:
    """服务层核心测试"""
    
    def test_artist_service_create(self, mock_db, sample_artist_data):
        """测试艺术家服务创建功能"""
        from app.services.artist_service import ArtistService
        
        # Mock数据库操作
        mock_db["artists"].find_one.return_value = None
        mock_db["artists"].insert_one.return_value = MagicMock()
        
        response = ArtistService.create(sample_artist_data)
        
        assert response.success == True
        assert response.code == 201
        mock_db["artists"].insert_one.assert_called_once()
    
    def test_artist_service_get_by_id(self, mock_db, sample_artist_data):
        """测试艺术家服务获取功能"""
        from app.services.artist_service import ArtistService
        
        mock_db["artists"].find_one.return_value = sample_artist_data
        
        response = ArtistService.get_by_id("test-artist-1")
        
        assert response.success == True
        assert response.data["name"] == "Test Artist"
    
    def test_artwork_service_create(self, mock_db, sample_artwork_data):
        """测试艺术品服务创建功能"""
        from app.services.artwork_service import ArtworkService
        
        mock_db["artworks"].find_one.return_value = None
        mock_db["artworks"].insert_one.return_value = MagicMock()
        
        response = ArtworkService.create(sample_artwork_data)
        
        assert response.success == True
        assert response.code == 201


@pytest.mark.api
@pytest.mark.core
class TestAPI:
    """API端点核心测试"""
    
    def test_artists_list_endpoint(self, client, mock_db, assert_paginated_response):
        """测试艺术家列表API"""
        mock_db["artists"].count_documents.return_value = 1
        mock_db["artists"].find.return_value.skip.return_value.limit.return_value = [
            {"id": "1", "name": "Test Artist"}
        ]
        
        response = client.get("/api/v1/artists/")
        
        assert response.status_code == 200
        data = response.json()
        assert_paginated_response(data)
    
    def test_artist_create_endpoint(self, client, mock_db, assert_response_format):
        """测试艺术家创建API"""
        mock_db["artists"].find_one.return_value = None
        mock_db["artists"].insert_one.return_value = None
        
        artist_data = {
            "name": "New Artist",
            "birth_year": 1990,
            "nationality": "Test Country"
        }
        
        response = client.post("/api/v1/artists/", json=artist_data)
        
        assert response.status_code == 201
        data = response.json()
        assert_response_format(data, success=True)
    
    def test_artworks_list_endpoint(self, client, mock_db, assert_paginated_response):
        """测试艺术品列表API"""
        mock_db["artworks"].count_documents.return_value = 1
        mock_db["artworks"].find.return_value.skip.return_value.limit.return_value = [
            {"id": "1", "title": "Test Artwork"}
        ]
        
        response = client.get("/api/v1/artworks/")
        
        assert response.status_code == 200
        data = response.json()
        assert_paginated_response(data)
    
    def test_movements_list_endpoint(self, client, mock_db, assert_paginated_response):
        """测试艺术运动列表API"""
        mock_db["art_movements"].count_documents.return_value = 1
        mock_db["art_movements"].find.return_value.skip.return_value.limit.return_value = [
            {"id": "1", "name": "Test Movement"}
        ]
        
        response = client.get("/api/v1/art-movements/")
        
        assert response.status_code == 200
        data = response.json()
        assert_paginated_response(data)


@pytest.mark.integration
@pytest.mark.core
class TestDataGeneration:
    """数据生成核心测试"""
    
    def test_real_artist_generation(self):
        """测试真实艺术家生成"""
        from app.utils.data_generator import ArtistDataGenerator
        
        artists = ArtistDataGenerator.generate_real_artists(count=2)
        
        assert len(artists) == 2
        for artist in artists:
            assert artist["is_fictional"] == False
            assert "name" in artist
            assert "birth_year" in artist
    
    def test_fictional_artist_generation(self):
        """测试虚构艺术家生成"""
        from app.utils.data_generator import ArtistDataGenerator
        
        artists = ArtistDataGenerator.generate_fictional_artists(count=2)
        
        assert len(artists) == 2
        for artist in artists:
            assert artist["is_fictional"] == True
            assert "fictional_meta" in artist
            assert "agent" in artist
    
    def test_artwork_generation(self):
        """测试艺术品生成"""
        from app.utils.data_generator import ArtworkDataGenerator
        
        artist_ids = ["artist-1", "artist-2"]
        artworks = ArtworkDataGenerator.generate_artworks(artist_ids, count=3)
        
        assert len(artworks) == 3
        for artwork in artworks:
            assert artwork["artist_id"] in artist_ids
            assert "style_vector" in artwork
            assert len(artwork["style_vector"]) == 128
    
    def test_movement_generation(self):
        """测试艺术运动生成"""
        from app.utils.data_generator import ArtMovementDataGenerator
        
        movements = ArtMovementDataGenerator.generate_movements()
        
        assert len(movements) > 0
        for movement in movements:
            assert "name" in movement
            assert "description" in movement


@pytest.mark.unit
class TestResponseFormats:
    """响应格式测试"""
    
    def test_success_response_creation(self):
        """测试成功响应创建"""
        from app.schemas.response import create_success_response
        
        response = create_success_response(data={"test": "data"}, message="Success")
        
        assert response.success == True
        assert response.data == {"test": "data"}
        assert response.message == "Success"
    
    def test_error_response_creation(self):
        """测试错误响应创建"""
        from app.schemas.response import create_error_response
        
        response = create_error_response(message="Error", code=400)
        
        assert response.success == False
        assert response.message == "Error"
        assert response.code == 400
    
    def test_paginated_response_creation(self):
        """测试分页响应创建"""
        from app.schemas.response import create_paginated_response
        
        response = create_paginated_response(
            data=[{"id": 1}],
            total=100,
            page=2,
            page_size=10
        )
        
        assert response.success == True
        assert response.total == 100
        assert response.page == 2
        assert response.total_pages == 10
        assert response.has_next == True
        assert response.has_prev == True


@pytest.mark.unit
class TestQueryParams:
    """查询参数测试"""
    
    def test_query_params_creation(self):
        """测试查询参数创建"""
        from app.utils.query_params import QueryParams

        # 测试基本参数
        params = QueryParams(search="test", page=2)
        assert params.search == "test"
        assert params.page == 2
        assert params.page_size == 10  # 默认值

        # 测试虚构筛选
        params = QueryParams(is_fictional=True)
        assert params.is_fictional == True
    
    def test_mongo_filter_building(self):
        """测试MongoDB过滤器构建"""
        from app.utils.query_params import QueryParams, QueryParamsParser

        # 测试虚构筛选
        params = QueryParams(is_fictional=True)
        filter_dict = QueryParamsParser.build_mongo_filter(params)
        assert "is_fictional" in filter_dict
        assert filter_dict["is_fictional"] == True

        # 测试搜索条件
        params = QueryParams(search="test")
        filter_dict = QueryParamsParser.build_mongo_filter(params)
        assert "$or" in filter_dict  # 搜索条件
