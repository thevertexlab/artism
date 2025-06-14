from typing import List, Dict, Any
import pymongo
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT

from app.db.mongodb import get_database
from app.core.config import ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION


class DatabaseSetup:
    """
    数据库设置和索引管理
    """
    
    @staticmethod
    def create_indexes():
        """
        创建所有必要的数据库索引
        """
        db = get_database()
        
        # 艺术家集合索引
        artists_collection = db[ARTISTS_COLLECTION]
        artist_indexes = [
            IndexModel([("id", ASCENDING)], unique=True),
            IndexModel([("name", TEXT)]),
            IndexModel([("nationality", ASCENDING)]),
            IndexModel([("birth_year", ASCENDING)]),
            IndexModel([("death_year", ASCENDING)]),
            IndexModel([("is_fictional", ASCENDING)]),
            IndexModel([("tags", ASCENDING)]),
            IndexModel([("associated_movements", ASCENDING)]),
            IndexModel([("fictional_meta.origin_project", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("updated_at", DESCENDING)])
        ]
        
        try:
            artists_collection.create_indexes(artist_indexes)
            print(f"Created {len(artist_indexes)} indexes for {ARTISTS_COLLECTION}")
        except Exception as e:
            print(f"Error creating indexes for {ARTISTS_COLLECTION}: {e}")
        
        # 艺术品集合索引
        artworks_collection = db[ARTWORKS_COLLECTION]
        artwork_indexes = [
            IndexModel([("id", ASCENDING)], unique=True),
            IndexModel([("title", TEXT)]),
            IndexModel([("artist_id", ASCENDING)]),
            IndexModel([("year", ASCENDING)]),
            IndexModel([("tags", ASCENDING)]),
            IndexModel([("movement_ids", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("updated_at", DESCENDING)]),
            # 复合索引
            IndexModel([("artist_id", ASCENDING), ("year", ASCENDING)]),
            IndexModel([("year", ASCENDING), ("tags", ASCENDING)])
        ]
        
        try:
            artworks_collection.create_indexes(artwork_indexes)
            print(f"Created {len(artwork_indexes)} indexes for {ARTWORKS_COLLECTION}")
        except Exception as e:
            print(f"Error creating indexes for {ARTWORKS_COLLECTION}: {e}")
        
        # 艺术运动集合索引
        movements_collection = db[ART_MOVEMENTS_COLLECTION]
        movement_indexes = [
            IndexModel([("id", ASCENDING)], unique=True),
            IndexModel([("name", TEXT)]),
            IndexModel([("start_year", ASCENDING)]),
            IndexModel([("end_year", ASCENDING)]),
            IndexModel([("key_artists", ASCENDING)]),
            IndexModel([("representative_works", ASCENDING)]),
            IndexModel([("tags", ASCENDING)]),
            IndexModel([("created_at", DESCENDING)]),
            IndexModel([("updated_at", DESCENDING)]),
            # 复合索引
            IndexModel([("start_year", ASCENDING), ("end_year", ASCENDING)])
        ]
        
        try:
            movements_collection.create_indexes(movement_indexes)
            print(f"Created {len(movement_indexes)} indexes for {ART_MOVEMENTS_COLLECTION}")
        except Exception as e:
            print(f"Error creating indexes for {ART_MOVEMENTS_COLLECTION}: {e}")
    
    @staticmethod
    def drop_indexes():
        """
        删除所有索引（除了默认的_id索引）
        """
        db = get_database()
        
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        
        for collection_name in collections:
            try:
                collection = db[collection_name]
                collection.drop_indexes()
                print(f"Dropped indexes for {collection_name}")
            except Exception as e:
                print(f"Error dropping indexes for {collection_name}: {e}")
    
    @staticmethod
    def list_indexes():
        """
        列出所有集合的索引
        """
        db = get_database()
        
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        
        for collection_name in collections:
            try:
                collection = db[collection_name]
                indexes = list(collection.list_indexes())
                print(f"\nIndexes for {collection_name}:")
                for idx in indexes:
                    print(f"  - {idx['name']}: {idx.get('key', {})}")
            except Exception as e:
                print(f"Error listing indexes for {collection_name}: {e}")
    
    @staticmethod
    def get_collection_stats():
        """
        获取集合统计信息
        """
        db = get_database()
        
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        stats = {}
        
        for collection_name in collections:
            try:
                collection = db[collection_name]
                count = collection.count_documents({})
                stats[collection_name] = {
                    "document_count": count,
                    "indexes": len(list(collection.list_indexes()))
                }
            except Exception as e:
                stats[collection_name] = {"error": str(e)}
        
        return stats
    
    @staticmethod
    def ensure_collections_exist():
        """
        确保所有必要的集合存在
        """
        db = get_database()
        
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        existing_collections = db.list_collection_names()
        
        for collection_name in collections:
            if collection_name not in existing_collections:
                try:
                    db.create_collection(collection_name)
                    print(f"Created collection: {collection_name}")
                except Exception as e:
                    print(f"Error creating collection {collection_name}: {e}")
            else:
                print(f"Collection {collection_name} already exists")
    
    @staticmethod
    def setup_database():
        """
        完整的数据库设置流程
        """
        print("Starting database setup...")
        
        # 1. 确保集合存在
        print("\n1. Ensuring collections exist...")
        DatabaseSetup.ensure_collections_exist()
        
        # 2. 创建索引
        print("\n2. Creating indexes...")
        DatabaseSetup.create_indexes()
        
        # 3. 显示统计信息
        print("\n3. Database statistics:")
        stats = DatabaseSetup.get_collection_stats()
        for collection, stat in stats.items():
            if "error" in stat:
                print(f"  {collection}: Error - {stat['error']}")
            else:
                print(f"  {collection}: {stat['document_count']} documents, {stat['indexes']} indexes")
        
        print("\nDatabase setup completed!")
    
    @staticmethod
    def reset_database():
        """
        重置数据库（清除所有数据和索引）
        """
        print("WARNING: This will delete all data!")
        
        db = get_database()
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        
        for collection_name in collections:
            try:
                collection = db[collection_name]
                collection.drop()
                print(f"Dropped collection: {collection_name}")
            except Exception as e:
                print(f"Error dropping collection {collection_name}: {e}")
        
        # 重新设置数据库
        DatabaseSetup.setup_database()


class DatabaseMigration:
    """
    数据库迁移工具
    """
    
    @staticmethod
    def migrate_to_new_schema():
        """
        迁移到新的数据模式
        """
        db = get_database()
        
        # 迁移艺术家数据
        print("Migrating artists...")
        artists_collection = db[ARTISTS_COLLECTION]
        
        # 为现有艺术家添加新字段
        artists_collection.update_many(
            {"is_fictional": {"$exists": False}},
            {"$set": {"is_fictional": False}}
        )
        
        artists_collection.update_many(
            {"tags": {"$exists": False}},
            {"$set": {"tags": []}}
        )
        
        artists_collection.update_many(
            {"notable_works": {"$exists": False}},
            {"$set": {"notable_works": []}}
        )
        
        artists_collection.update_many(
            {"associated_movements": {"$exists": False}},
            {"$set": {"associated_movements": []}}
        )
        
        # 迁移艺术品数据
        print("Migrating artworks...")
        artworks_collection = db[ARTWORKS_COLLECTION]
        
        artworks_collection.update_many(
            {"movement_ids": {"$exists": False}},
            {"$set": {"movement_ids": []}}
        )
        
        artworks_collection.update_many(
            {"tags": {"$exists": False}},
            {"$set": {"tags": []}}
        )
        
        artworks_collection.update_many(
            {"style_vector": {"$exists": False}},
            {"$set": {"style_vector": []}}
        )
        
        print("Migration completed!")
    
    @staticmethod
    def add_timestamps():
        """
        为现有记录添加时间戳
        """
        from datetime import datetime
        
        db = get_database()
        now = datetime.utcnow()
        
        collections = [ARTISTS_COLLECTION, ARTWORKS_COLLECTION, ART_MOVEMENTS_COLLECTION]
        
        for collection_name in collections:
            collection = db[collection_name]
            
            # 添加创建时间
            collection.update_many(
                {"created_at": {"$exists": False}},
                {"$set": {"created_at": now}}
            )
            
            # 添加更新时间
            collection.update_many(
                {"updated_at": {"$exists": False}},
                {"$set": {"updated_at": now}}
            )
            
            print(f"Added timestamps to {collection_name}")


if __name__ == "__main__":
    # 运行数据库设置
    DatabaseSetup.setup_database()
