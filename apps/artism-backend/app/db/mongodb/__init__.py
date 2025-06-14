import pymongo
from app.core.config import MONGODB_URI, DATABASE_NAME

# MongoDB 客户端单例
_client = None

def get_client():
    """
    获取 MongoDB 客户端实例（单例模式）
    """
    global _client
    if _client is None:
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
