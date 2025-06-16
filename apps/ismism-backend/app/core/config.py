import os
from dotenv import load_dotenv
from pydantic import BaseModel

# 加载环境变量
load_dotenv()

class Settings(BaseModel):
    """应用配置类"""
    # 应用信息
    APP_NAME: str = "Ismism Backend API"
    APP_DESCRIPTION: str = "Ismism艺术流派探索后端API"
    APP_VERSION: str = "1.0.0"
    
    # API配置
    API_HOST: str = os.getenv("API_HOST", "localhost")
    API_PORT: int = int(os.getenv("API_PORT", 8000))
    
    # MongoDB配置
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017/ismism-db")
    
    # CORS配置
    CORS_ORIGIN: str = os.getenv("CORS_ORIGIN", "http://localhost:5173")
    
    # 其他配置
    DEBUG: bool = os.getenv("NODE_ENV", "development") == "development"

# 创建全局设置实例
settings = Settings() 