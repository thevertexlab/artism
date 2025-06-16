from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from app.core.config import settings
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 数据库客户端
client = None
db = None

async def connect_to_mongo():
    """连接到MongoDB数据库"""
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        # 从URI中提取数据库名称
        db_name = settings.MONGODB_URI.split("/")[-1]
        db = client[db_name]
        logger.info(f"Connected to MongoDB: {settings.MONGODB_URI}")
        # 测试连接
        await client.admin.command('ping')
        return db
    except ConnectionFailure as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """关闭MongoDB连接"""
    global client
    if client:
        client.close()
        logger.info("Closed MongoDB connection")

def get_database():
    """获取数据库实例"""
    return db 