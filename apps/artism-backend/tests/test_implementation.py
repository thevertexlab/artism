#!/usr/bin/env python3
"""
AIDA Backend Implementation Test Script

This script tests all the implemented functionality to ensure everything works correctly.
"""

import asyncio
import json
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__)))

from app.utils.startup import run_startup
from app.services.artist_service import ArtistService
from app.services.artwork_service import ArtworkService
from app.services.art_movement_service import ArtMovementService
from app.utils.data_generator import FullDatasetGenerator
from app.utils.database_setup import DatabaseSetup
from app.utils.query_params import QueryParams


class ImplementationTester:
    """
    实现测试器
    """
    
    def __init__(self):
        self.test_results = []
        self.test_data = {}
    
    def log_test(self, test_name: str, success: bool, message: str = ""):
        """记录测试结果"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"    {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message
        })
    
    def test_database_setup(self):
        """测试数据库设置"""
        print("\n=== Testing Database Setup ===")
        
        try:
            # 测试数据库连接
            stats = DatabaseSetup.get_collection_stats()
            self.log_test("Database Connection", True, f"Connected to database with {len(stats)} collections")
            
            # 测试集合创建
            DatabaseSetup.ensure_collections_exist()
            self.log_test("Collection Creation", True, "All collections exist")
            
            # 测试索引创建
            DatabaseSetup.create_indexes()
            self.log_test("Index Creation", True, "All indexes created")
            
        except Exception as e:
            self.log_test("Database Setup", False, str(e))
    
    def test_data_generation(self):
        """测试数据生成"""
        print("\n=== Testing Data Generation ===")
        
        try:
            # 生成完整数据集
            dataset = FullDatasetGenerator.generate_complete_dataset(
                real_artists_count=3,
                fictional_artists_count=3,
                artworks_per_artist=2,
                include_movements=True
            )
            
            self.test_data = dataset
            
            self.log_test("Data Generation", True, 
                         f"Generated {len(dataset['artists'])} artists, "
                         f"{len(dataset['artworks'])} artworks, "
                         f"{len(dataset['movements'])} movements")
            
        except Exception as e:
            self.log_test("Data Generation", False, str(e))
    
    def test_artist_service(self):
        """测试艺术家服务"""
        print("\n=== Testing Artist Service ===")
        
        try:
            # 测试创建艺术家
            if self.test_data.get('artists'):
                artist_data = self.test_data['artists'][0]
                response = ArtistService.create(artist_data)
                
                if response.success:
                    self.log_test("Artist Creation", True, f"Created artist: {artist_data['name']}")
                    
                    # 测试获取艺术家
                    get_response = ArtistService.get_by_id(artist_data['id'])
                    if get_response.success:
                        self.log_test("Artist Retrieval", True, f"Retrieved artist: {get_response.data['name']}")
                    else:
                        self.log_test("Artist Retrieval", False, get_response.message)
                    
                    # 测试更新艺术家
                    update_data = {"bio": "Updated biography for testing"}
                    update_response = ArtistService.update(artist_data['id'], update_data)
                    if update_response.success:
                        self.log_test("Artist Update", True, "Artist updated successfully")
                    else:
                        self.log_test("Artist Update", False, update_response.message)
                    
                    # 测试搜索艺术家
                    search_results = ArtistService.search_artists(artist_data['name'][:5], limit=5)
                    self.log_test("Artist Search", len(search_results) > 0, 
                                 f"Found {len(search_results)} artists")
                    
                else:
                    self.log_test("Artist Creation", False, response.message)
            else:
                self.log_test("Artist Service", False, "No test data available")
                
        except Exception as e:
            self.log_test("Artist Service", False, str(e))
    
    def test_artwork_service(self):
        """测试艺术品服务"""
        print("\n=== Testing Artwork Service ===")
        
        try:
            # 测试创建艺术品
            if self.test_data.get('artworks'):
                artwork_data = self.test_data['artworks'][0]
                response = ArtworkService.create(artwork_data)
                
                if response.success:
                    self.log_test("Artwork Creation", True, f"Created artwork: {artwork_data['title']}")
                    
                    # 测试获取艺术品
                    get_response = ArtworkService.get_by_id(artwork_data['id'])
                    if get_response.success:
                        self.log_test("Artwork Retrieval", True, f"Retrieved artwork: {get_response.data['title']}")
                    else:
                        self.log_test("Artwork Retrieval", False, get_response.message)
                    
                    # 测试根据艺术家获取作品
                    artist_artworks = ArtworkService.get_artworks_by_artist(artwork_data['artist_id'])
                    self.log_test("Artworks by Artist", len(artist_artworks) > 0, 
                                 f"Found {len(artist_artworks)} artworks for artist")
                    
                else:
                    self.log_test("Artwork Creation", False, response.message)
            else:
                self.log_test("Artwork Service", False, "No test data available")
                
        except Exception as e:
            self.log_test("Artwork Service", False, str(e))
    
    def test_movement_service(self):
        """测试艺术运动服务"""
        print("\n=== Testing Art Movement Service ===")
        
        try:
            # 测试创建艺术运动
            if self.test_data.get('movements'):
                movement_data = self.test_data['movements'][0]
                response = ArtMovementService.create(movement_data)
                
                if response.success:
                    self.log_test("Movement Creation", True, f"Created movement: {movement_data['name']}")
                    
                    # 测试获取艺术运动
                    get_response = ArtMovementService.get_by_id(movement_data['id'])
                    if get_response.success:
                        self.log_test("Movement Retrieval", True, f"Retrieved movement: {get_response.data['name']}")
                    else:
                        self.log_test("Movement Retrieval", False, get_response.message)
                    
                    # 测试搜索艺术运动
                    search_results = ArtMovementService.search_movements(movement_data['name'][:5], limit=5)
                    self.log_test("Movement Search", len(search_results) > 0, 
                                 f"Found {len(search_results)} movements")
                    
                    # 测试时期查询
                    if movement_data.get('start_year') and movement_data.get('end_year'):
                        period_movements = ArtMovementService.get_movements_by_period(
                            movement_data['start_year'], movement_data['end_year']
                        )
                        self.log_test("Movement by Period", len(period_movements) > 0, 
                                     f"Found {len(period_movements)} movements in period")
                    
                else:
                    self.log_test("Movement Creation", False, response.message)
            else:
                self.log_test("Movement Service", False, "No test data available")
                
        except Exception as e:
            self.log_test("Movement Service", False, str(e))
    
    def test_query_params(self):
        """测试查询参数"""
        print("\n=== Testing Query Parameters ===")
        
        try:
            # 测试基本查询参数
            params = QueryParams(
                page=1,
                page_size=10,
                search="test",
                sort_by="name",
                order="asc"
            )
            
            # 测试获取所有艺术家（带参数）
            response = ArtistService.get_all(params)
            self.log_test("Paginated Query", response.success, 
                         f"Retrieved {len(response.data)} artists with pagination")
            
        except Exception as e:
            self.log_test("Query Parameters", False, str(e))
    
    def test_unified_response_format(self):
        """测试统一响应格式"""
        print("\n=== Testing Unified Response Format ===")
        
        try:
            # 测试成功响应
            from app.schemas.response import create_success_response, create_error_response
            
            success_response = create_success_response(
                data={"test": "data"},
                message="Test success"
            )
            
            self.log_test("Success Response Format", 
                         success_response.success and success_response.message == "Test success",
                         "Success response format is correct")
            
            # 测试错误响应
            error_response = create_error_response(
                message="Test error",
                code=400
            )
            
            self.log_test("Error Response Format", 
                         not error_response.success and error_response.code == 400,
                         "Error response format is correct")
            
        except Exception as e:
            self.log_test("Response Format", False, str(e))
    
    def run_all_tests(self):
        """运行所有测试"""
        print("🚀 Starting AIDA Backend Implementation Tests")
        print("=" * 60)
        
        # 运行启动初始化
        print("Running startup initialization...")
        startup_success = run_startup()
        self.log_test("Startup Initialization", startup_success, 
                     "Database and application initialized")
        
        if not startup_success:
            print("❌ Startup failed, skipping other tests")
            return False
        
        # 运行各项测试
        self.test_database_setup()
        self.test_data_generation()
        self.test_artist_service()
        self.test_artwork_service()
        self.test_movement_service()
        self.test_query_params()
        self.test_unified_response_format()
        
        # 汇总结果
        self.print_summary()
        
        return all(result["success"] for result in self.test_results)
    
    def print_summary(self):
        """打印测试汇总"""
        print("\n" + "=" * 60)
        print("🏁 Test Summary")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {passed/total*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        if passed == total:
            print("\n🎉 All tests passed! The AIDA backend implementation is working correctly.")
        else:
            print(f"\n⚠️  {total - passed} tests failed. Please check the implementation.")


def main():
    """主函数"""
    tester = ImplementationTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ AIDA Backend Implementation Test: SUCCESS")
        return 0
    else:
        print("\n❌ AIDA Backend Implementation Test: FAILED")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
