from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.core.config import PROJECT_NAME, PROJECT_DESCRIPTION, PROJECT_VERSION, API_V1_STR
from app.api.v1 import api_router

def create_app() -> FastAPI:
    """
    创建 FastAPI 应用
    
    Returns:
        FastAPI: FastAPI 应用实例
    """
    # 初始化 FastAPI 应用
    app = FastAPI(
        title=PROJECT_NAME,
        description=PROJECT_DESCRIPTION,
        version=PROJECT_VERSION,
        docs_url=None,  # 禁用默认文档
        redoc_url=None  # 禁用默认 ReDoc
    )
    
    # 配置 CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # 在生产环境中，替换为特定来源
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # 自定义 API 文档路由
    @app.get("/api/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title=app.title + " - Swagger UI",
            oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
            swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
            swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        )

    @app.get("/api/redoc", include_in_schema=False)
    async def redoc_html():
        return get_redoc_html(
            openapi_url=app.openapi_url,
            title=app.title + " - ReDoc",
            redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
        )
    
    # 静态文件服务
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
    if os.path.exists(static_dir):
        app.mount("/static", StaticFiles(directory=static_dir), name="static")

    # AI Comments 页面路由
    @app.get("/ai-comments", response_class=FileResponse)
    async def ai_comments_page():
        static_file = os.path.join(static_dir, "ai-comments.html")
        if os.path.exists(static_file):
            return FileResponse(static_file)
        return {"error": "AI Comments page not found"}

    # AI Social Demo 页面路由
    @app.get("/ai-social-demo", response_class=FileResponse)
    async def ai_social_demo_page():
        static_file = os.path.join(static_dir, "ai-social-demo.html")
        if os.path.exists(static_file):
            return FileResponse(static_file)
        return {"error": "AI Social Demo page not found"}

    # 根路由 - 返回主页面
    @app.get("/", response_class=FileResponse)
    async def root():
        static_file = os.path.join(static_dir, "index.html")
        if os.path.exists(static_file):
            return FileResponse(static_file)
        return {
            "message": "Welcome to AIDA API",
            "pages": {
                "ai_comments": "/ai-comments",
                "ai_social_demo": "/ai-social-demo",
                "api_docs": "/api/docs",
                "redoc": "/api/redoc"
            }
        }

    # API信息路由
    @app.get("/api")
    async def api_info():
        return {
            "message": "Welcome to AIDA API",
            "pages": {
                "ai_comments": "/ai-comments",
                "ai_social_demo": "/ai-social-demo",
                "api_docs": "/api/docs",
                "redoc": "/api/redoc"
            }
        }

    # 包含 API 路由
    app.include_router(api_router, prefix=API_V1_STR)

    return app
