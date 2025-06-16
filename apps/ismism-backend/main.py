from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from app.db.mongodb.database import connect_to_mongo, close_mongo_connection

# 加载环境变量
load_dotenv()

# 创建FastAPI应用
app = FastAPI(
    title="Ismism Backend API",
    description="Ismism艺术流派探索后端API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/openapi.json"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 根路由
@app.get("/")
async def root():
    return {"message": "Ismism Backend API is running"}

# 启动事件
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

# 关闭事件
@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# 导入路由模块
from app.api.v1.routes import artists, artworks, art_movements

# 注册路由
app.include_router(artists.router, prefix="/api/v1/artists", tags=["Artists"])
app.include_router(artworks.router, prefix="/api/v1/artworks", tags=["Artworks"])
app.include_router(art_movements.router, prefix="/api/v1/art-movements", tags=["Art Movements"])

# 测试路由
@app.get("/api/v1/test/db-status")
async def test_db_status():
    """测试数据库连接状态"""
    try:
        from app.db.mongodb.database import get_database
        db = get_database()
        if db:
            return {"status": "connected", "message": "Database connection is working"}
        return {"status": "error", "message": "Database connection not established"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    host = os.getenv("API_HOST", "localhost")
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True) 