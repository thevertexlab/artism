from fastapi import APIRouter, HTTPException, Depends
from app.schemas.artist import AIInteractionRequest, AIInteractionResponse
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/", response_model=AIInteractionResponse)
async def ai_interaction(request: AIInteractionRequest):
    """
    与 AI 艺术家交互
    
    发送消息给 AI 艺术家并获取回复
    
    Args:
        request: AI 交互请求，包含消息和可选的艺术家 ID
    """
    try:
        # 检查 OpenAI API 密钥是否已配置
        if not AIService.is_api_key_configured():
            # 在开发环境中使用模拟响应
            response = AIService.interact(request.message, request.artist_id)
        else:
            # 在生产环境中使用 OpenAI API
            response = AIService.interact(request.message, request.artist_id)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in AI interaction: {str(e)}") 