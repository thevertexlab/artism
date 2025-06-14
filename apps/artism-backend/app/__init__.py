from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html

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
    
    # 根路由
    @app.get("/")
    async def root():
        return {"message": "Welcome to AIDA API"}
    
    # 包含 API 路由
    app.include_router(api_router, prefix=API_V1_STR)
    
    return app
