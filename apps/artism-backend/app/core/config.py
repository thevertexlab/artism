import os
from dotenv import load_dotenv
from pathlib import Path

# 获取项目根目录
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 加载环境变量
env_file = BASE_DIR / ".env"
env_example = BASE_DIR / ".env.example"

if not env_file.exists():
    if env_example.exists():
        print("Error: .env file not found. Please copy .env.example to .env and update the values.")
        print("You can use the following command:")
        print(f"cp {env_example} {env_file}")
    else:
        print("Error: Neither .env nor .env.example files found. Please create a .env file with the required environment variables.")
    
    # 在开发环境中继续使用默认值
    print("Warning: Continuing with default configuration values.")

load_dotenv(env_file)

# API 配置
API_V1_STR = "/api/v1"
PROJECT_NAME = "AIDA API"
PROJECT_DESCRIPTION = "AI Artist Database API"
PROJECT_VERSION = "0.1.0"

# 服务器配置
HOST = os.getenv("API_HOST", "0.0.0.0")
PORT = int(os.getenv("API_PORT", "8000"))
BASE_URL = f"http://{'localhost' if HOST == '0.0.0.0' else HOST}:{PORT}"

# 数据库配置
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/aida")
DATABASE_NAME = os.getenv("DATABASE_NAME", "aida")

# 集合名称常量
ARTISTS_COLLECTION = "artists"
ARTWORKS_COLLECTION = "artworks"
ART_MOVEMENTS_COLLECTION = "art_movements"

# 安全配置
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OpenAI 配置
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# 数据目录
DATA_DIR = BASE_DIR.parent / "data" 