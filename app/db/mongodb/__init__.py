import pymongo
import os
import mongomock
from app.core.config import MONGODB_URI, DATABASE_NAME

# MongoDB 客户端单例
_client = None

def get_client():
    """
    获取 MongoDB 客户端实例（单例模式）
    如果环境变量USE_MOCK_DB=True，则使用mongomock
    """
    global _client
    if _client is None:
        use_mock = os.getenv("USE_MOCK_DB", "True").lower() == "true"
        if use_mock:
            print("Using mock MongoDB client")
            _client = mongomock.MongoClient()
        else:
            print(f"Connecting to MongoDB: {MONGODB_URI}")
            _client = pymongo.MongoClient(MONGODB_URI)
    return _client

def get_database():
    """
    获取数据库实例
    """
    return get_client().get_database(DATABASE_NAME)

def get_collection(collection_name):
    """
    获取集合实例
    
    Args:
        collection_name: 集合名称
        
    Returns:
        pymongo.collection.Collection: 集合实例
    """
    return get_database()[collection_name] 