from fastapi import APIRouter

from app.api.v1.endpoints import (
    artists, ai_interaction, ai_artists, ai_comments, data, test, artworks,
    art_movements, data_generation, database_management, posts
)

api_router = APIRouter()

# 注册路由
api_router.include_router(artists.router, prefix="/artists", tags=["artists"])
api_router.include_router(artworks.router, prefix="/artworks", tags=["artworks"])
api_router.include_router(art_movements.router, prefix="/art-movements", tags=["art-movements"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(data_generation.router, prefix="/data-generation", tags=["data-generation"])
api_router.include_router(database_management.router, prefix="/database", tags=["database-management"])
api_router.include_router(ai_interaction.router, prefix="/ai-interaction", tags=["ai-interaction"])
api_router.include_router(ai_artists.router, prefix="/ai-artists", tags=["ai-artists"])
api_router.include_router(ai_comments.router, prefix="/ai-comments", tags=["ai-comments"])
api_router.include_router(data.router, prefix="/data", tags=["data"])
api_router.include_router(test.router, prefix="/test", tags=["test"])
