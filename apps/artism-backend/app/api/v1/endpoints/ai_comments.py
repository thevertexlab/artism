from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.comment import (
    CommentResponse,
    GenerateCommentsRequest,
    CreateThreadRequest,
    CommentStats,
    Comment,
    CommentCreate,
    CommentUpdate
)
from app.services.ai_comment_service import AICommentService
from app.services.comment_service import CommentService
from app.schemas.response import APIResponse, create_success_response, create_error_response

router = APIRouter()

@router.post("/generate", response_model=List[Dict[str, Any]])
async def generate_ai_comments(request: GenerateCommentsRequest):
    """
    生成AI艺术家自动评论并保存到数据库

    Args:
        request: 生成评论的请求参数

    Returns:
        List[Dict[str, Any]]: 生成的评论列表
    """
    try:
        comments = await AICommentService.generate_auto_comments(
            max_comments=request.max_comments,
            save_to_db=True
        )

        return comments

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating comments: {str(e)}")

@router.post("/thread/create")
async def create_comment_thread(request: CreateThreadRequest):
    """
    创建AI评论对话线程

    Args:
        request: 创建线程的请求参数

    Returns:
        Dict[str, Any]: 创建的线程信息
    """
    try:
        # 转换participant_ids为字符串类型
        participant_ids = [str(pid) for pid in request.participant_ids]

        thread = CommentService.create_comment_thread(
            topic=request.topic,
            participant_ids=participant_ids,
            thread_type=request.thread_type
        )

        if not thread:
            raise HTTPException(status_code=400, detail="Failed to create comment thread")

        return {
            "success": True,
            "thread": thread,
            "message": "Comment thread created successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating thread: {str(e)}")

@router.get("/recent")
async def get_recent_comments(limit: int = Query(20, description="返回评论数量限制")):
    """
    获取最近的AI评论

    Args:
        limit: 返回评论数量限制

    Returns:
        Dict[str, Any]: 最近的评论列表
    """
    try:
        recent_comments = CommentService.get_recent_comments(limit=limit)

        return {
            "success": True,
            "comments": recent_comments,
            "total": len(recent_comments)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent comments: {str(e)}")

@router.post("/auto-generate")
async def trigger_auto_generation(background_tasks: BackgroundTasks):
    """
    触发自动评论生成（后台任务）
    
    Returns:
        Dict[str, Any]: 操作结果
    """
    try:
        # 添加后台任务
        background_tasks.add_task(auto_generate_comments_task)
        
        return {
            "success": True,
            "message": "Auto comment generation started in background"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting auto generation: {str(e)}")

async def auto_generate_comments_task():
    """
    自动生成评论的后台任务
    """
    try:
        # 生成一批评论并保存到数据库
        comments = await AICommentService.generate_auto_comments(max_comments=10, save_to_db=True)
        print(f"Generated and saved {len(comments)} auto comments to database")

    except Exception as e:
        print(f"Error in auto generation task: {e}")

@router.get("/stats")
async def get_comment_stats():
    """
    获取评论统计信息

    Returns:
        Dict[str, Any]: 统计信息
    """
    try:
        stats = CommentService.get_comment_stats()

        return {
            "success": True,
            "stats": stats.dict()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

@router.get("/by-artist/{artist_id}")
async def get_comments_by_artist(
    artist_id: str,
    limit: int = Query(10, description="返回评论数量限制")
):
    """
    获取特定艺术家的评论

    Args:
        artist_id: 艺术家ID
        limit: 返回评论数量限制

    Returns:
        Dict[str, Any]: 艺术家的评论列表
    """
    try:
        # 获取该艺术家作为作者的评论
        author_comments = CommentService.get_comments_by_target("artist", artist_id, limit=limit)

        return {
            "success": True,
            "artist_id": artist_id,
            "comments": author_comments,
            "total": len(author_comments)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching artist comments: {str(e)}")

@router.get("/by-target/{target_type}/{target_id}")
async def get_comments_by_target(
    target_type: str,
    target_id: str,
    skip: int = Query(0, description="跳过的评论数"),
    limit: int = Query(20, description="返回评论数量限制")
):
    """
    根据目标获取评论

    Args:
        target_type: 目标类型 (artist, artwork, comment)
        target_id: 目标ID
        skip: 跳过的评论数
        limit: 返回评论数量限制

    Returns:
        Dict[str, Any]: 评论列表
    """
    try:
        comments = CommentService.get_comments_by_target(target_type, target_id, skip, limit)

        return {
            "success": True,
            "target_type": target_type,
            "target_id": target_id,
            "comments": comments,
            "total": len(comments)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comments: {str(e)}")

@router.post("/", response_model=Dict[str, Any])
async def create_comment(comment: CommentCreate):
    """
    创建新评论

    Args:
        comment: 评论创建数据

    Returns:
        Dict[str, Any]: 创建的评论信息
    """
    try:
        created_comment = CommentService.create_comment(comment)

        return {
            "success": True,
            "comment": created_comment,
            "message": "Comment created successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating comment: {str(e)}")

@router.get("/{comment_id}", response_model=Dict[str, Any])
async def get_comment(comment_id: str):
    """
    根据ID获取评论

    Args:
        comment_id: 评论ID

    Returns:
        Dict[str, Any]: 评论信息
    """
    try:
        comment = CommentService.get_comment_by_id(comment_id)

        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        return {
            "success": True,
            "comment": comment
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comment: {str(e)}")

@router.put("/{comment_id}", response_model=Dict[str, Any])
async def update_comment(comment_id: str, comment_update: CommentUpdate):
    """
    更新评论

    Args:
        comment_id: 评论ID
        comment_update: 更新数据

    Returns:
        Dict[str, Any]: 更新后的评论信息
    """
    try:
        updated_comment = CommentService.update_comment(comment_id, comment_update)

        if not updated_comment:
            raise HTTPException(status_code=404, detail="Comment not found or update failed")

        return {
            "success": True,
            "comment": updated_comment,
            "message": "Comment updated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating comment: {str(e)}")

@router.delete("/{comment_id}", response_model=Dict[str, Any])
async def delete_comment(comment_id: str):
    """
    删除评论

    Args:
        comment_id: 评论ID

    Returns:
        Dict[str, Any]: 删除结果
    """
    try:
        success = CommentService.delete_comment(comment_id)

        if not success:
            raise HTTPException(status_code=404, detail="Comment not found or delete failed")

        return {
            "success": True,
            "message": "Comment deleted successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting comment: {str(e)}")

@router.get("/search/", response_model=Dict[str, Any])
async def search_comments(
    query: str = Query(..., description="搜索关键词"),
    limit: int = Query(20, description="结果数量限制"),
    sentiment: Optional[str] = Query(None, description="情感过滤: positive, negative, neutral")
):
    """
    搜索评论

    Args:
        query: 搜索关键词
        limit: 结果数量限制
        sentiment: 情感过滤

    Returns:
        Dict[str, Any]: 搜索结果
    """
    try:
        # 这里可以实现更复杂的搜索逻辑
        # 目前简单实现为获取最近评论并过滤
        all_comments = CommentService.get_recent_comments(limit=100)

        # 按关键词过滤
        filtered_comments = [
            comment for comment in all_comments
            if query.lower() in comment.get('content', '').lower()
        ]

        # 按情感过滤
        if sentiment:
            filtered_comments = [
                comment for comment in filtered_comments
                if comment.get('sentiment') == sentiment
            ]

        # 限制结果数量
        filtered_comments = filtered_comments[:limit]

        return {
            "success": True,
            "comments": filtered_comments,
            "total": len(filtered_comments),
            "query": query,
            "sentiment_filter": sentiment
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching comments: {str(e)}")

@router.get("/analytics/sentiment-trends", response_model=Dict[str, Any])
async def get_sentiment_trends():
    """
    获取情感趋势分析

    Returns:
        Dict[str, Any]: 情感趋势数据
    """
    try:
        stats = CommentService.get_comment_stats()

        # 计算情感比例
        total_comments = stats.total_comments
        sentiment_percentages = {}

        if total_comments > 0:
            for sentiment, count in stats.sentiment_distribution.items():
                sentiment_percentages[sentiment] = round((count / total_comments) * 100, 2)

        return {
            "success": True,
            "sentiment_distribution": stats.sentiment_distribution,
            "sentiment_percentages": sentiment_percentages,
            "total_comments": total_comments,
            "analysis_time": datetime.utcnow().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting sentiment trends: {str(e)}")

@router.get("/analytics/artist-interactions", response_model=Dict[str, Any])
async def get_artist_interactions():
    """
    获取艺术家互动分析

    Returns:
        Dict[str, Any]: 艺术家互动数据
    """
    try:
        stats = CommentService.get_comment_stats()

        return {
            "success": True,
            "most_active_artists": stats.most_active_artists,
            "total_interactions": stats.total_comments,
            "ai_generated_ratio": round((stats.ai_generated_comments / stats.total_comments) * 100, 2) if stats.total_comments > 0 else 0,
            "analysis_time": datetime.utcnow().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting artist interactions: {str(e)}")

@router.get("/with-replies/{target_type}/{target_id}")
async def get_comments_with_replies(
    target_type: str,
    target_id: str,
    skip: int = Query(0, description="跳过的评论数"),
    limit: int = Query(10, description="返回评论数量限制")
):
    """
    获取评论及其回复（嵌套结构）

    Args:
        target_type: 目标类型 (artist, artwork, comment)
        target_id: 目标ID
        skip: 跳过的评论数
        limit: 返回评论数量限制

    Returns:
        Dict[str, Any]: 嵌套的评论列表
    """
    try:
        comments = CommentService.get_comments_with_replies(target_type, target_id, skip, limit)

        return {
            "success": True,
            "target_type": target_type,
            "target_id": target_id,
            "comments": comments,
            "total": len(comments)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comments with replies: {str(e)}")

@router.post("/generate-replies/{comment_id}")
async def generate_replies(
    comment_id: str,
    max_replies: int = Query(3, description="最大回复数量")
):
    """
    为指定评论生成AI回复

    Args:
        comment_id: 评论ID
        max_replies: 最大回复数量

    Returns:
        Dict[str, Any]: 生成的回复列表
    """
    try:
        replies = await AICommentService.generate_reply_comments(comment_id, max_replies)

        return {
            "success": True,
            "parent_comment_id": comment_id,
            "replies": replies,
            "total": len(replies)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating replies: {str(e)}")

@router.get("/{comment_id}/replies")
async def get_comment_replies(comment_id: str):
    """
    获取评论的回复

    Args:
        comment_id: 评论ID

    Returns:
        Dict[str, Any]: 回复列表
    """
    try:
        replies = CommentService.get_comment_replies(comment_id)

        return {
            "success": True,
            "parent_comment_id": comment_id,
            "replies": replies,
            "total": len(replies)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching replies: {str(e)}")

@router.post("/generate-for-post/{post_id}")
async def generate_post_comments(
    post_id: str,
    max_comments: int = Query(5, description="最大评论数量")
):
    """
    为指定帖子生成AI评论

    Args:
        post_id: 帖子ID
        max_comments: 最大评论数量

    Returns:
        Dict[str, Any]: 生成的评论列表
    """
    try:
        comments = await AICommentService.generate_post_comments(post_id, max_comments)

        return {
            "success": True,
            "post_id": post_id,
            "comments": comments,
            "total": len(comments)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating post comments: {str(e)}")

@router.post("/auto-comment/{post_id}")
async def trigger_auto_comments(
    post_id: str,
    comment_count: int = Query(3, description="评论数量")
):
    """
    立即为帖子触发自动AI评论

    Args:
        post_id: 帖子ID
        comment_count: 评论数量

    Returns:
        Dict[str, Any]: 生成结果
    """
    try:
        from app.services.auto_comment_service import AutoCommentService
        comments = await AutoCommentService.trigger_immediate_comments(post_id, comment_count)

        return {
            "success": True,
            "post_id": post_id,
            "comments": comments,
            "total": len(comments),
            "message": f"Generated {len(comments)} auto comments"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error triggering auto comments: {str(e)}")

@router.get("/auto-comment/stats")
async def get_auto_comment_stats():
    """
    获取自动评论统计信息

    Returns:
        Dict[str, Any]: 统计信息
    """
    try:
        from app.services.auto_comment_service import AutoCommentService
        stats = AutoCommentService.get_auto_comment_stats()

        return {
            "success": True,
            "stats": stats
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting auto comment stats: {str(e)}")

@router.post("/auto-comment/start")
async def start_auto_commenting(
    duration_minutes: int = Query(60, description="运行时长（分钟）")
):
    """
    启动自动评论服务

    Args:
        duration_minutes: 运行时长（分钟）

    Returns:
        Dict[str, Any]: 启动结果
    """
    try:
        from app.services.auto_comment_service import AutoCommentService

        # 在后台启动自动评论服务
        import asyncio
        asyncio.create_task(AutoCommentService.start_auto_commenting(duration_minutes))

        return {
            "success": True,
            "message": f"Auto commenting service started for {duration_minutes} minutes",
            "duration_minutes": duration_minutes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting auto commenting: {str(e)}")
