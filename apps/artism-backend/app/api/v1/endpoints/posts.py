from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostWithComments,
    PostStats
)
from app.services.post_service import PostService
from app.services.comment_service import CommentService
from app.schemas.response import APIResponse, create_success_response, create_error_response

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def get_posts(
    skip: int = Query(0, description="跳过的帖子数"),
    limit: int = Query(20, description="返回帖子数量限制")
):
    """
    获取帖子列表
    
    Args:
        skip: 跳过的帖子数
        limit: 返回帖子数量限制
        
    Returns:
        Dict[str, Any]: 帖子列表
    """
    try:
        posts = PostService.get_recent_posts(limit=limit, skip=skip)
        
        return {
            "success": True,
            "posts": posts,
            "total": len(posts)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching posts: {str(e)}")

@router.get("/{post_id}", response_model=Dict[str, Any])
async def get_post(post_id: str):
    """
    根据ID获取帖子
    
    Args:
        post_id: 帖子ID
        
    Returns:
        Dict[str, Any]: 帖子信息
    """
    try:
        post = PostService.get_post_by_id(post_id)
        
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {
            "success": True,
            "post": post
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching post: {str(e)}")

@router.post("/", response_model=Dict[str, Any])
async def create_post(post: PostCreate):
    """
    创建新帖子
    
    Args:
        post: 帖子创建数据
        
    Returns:
        Dict[str, Any]: 创建的帖子信息
    """
    try:
        created_post = PostService.create_post(post)
        
        return {
            "success": True,
            "post": created_post,
            "message": "Post created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating post: {str(e)}")

@router.put("/{post_id}", response_model=Dict[str, Any])
async def update_post(post_id: str, post_update: PostUpdate):
    """
    更新帖子
    
    Args:
        post_id: 帖子ID
        post_update: 更新数据
        
    Returns:
        Dict[str, Any]: 更新后的帖子信息
    """
    try:
        updated_post = PostService.update_post(post_id, post_update)
        
        if not updated_post:
            raise HTTPException(status_code=404, detail="Post not found or update failed")
        
        return {
            "success": True,
            "post": updated_post,
            "message": "Post updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating post: {str(e)}")

@router.delete("/{post_id}", response_model=Dict[str, Any])
async def delete_post(post_id: str):
    """
    删除帖子
    
    Args:
        post_id: 帖子ID
        
    Returns:
        Dict[str, Any]: 删除结果
    """
    try:
        success = PostService.delete_post(post_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Post not found or delete failed")
        
        return {
            "success": True,
            "message": "Post deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting post: {str(e)}")

@router.post("/{post_id}/like", response_model=Dict[str, Any])
async def like_post(post_id: str):
    """
    点赞帖子
    
    Args:
        post_id: 帖子ID
        
    Returns:
        Dict[str, Any]: 点赞结果
    """
    try:
        success = PostService.increment_likes(post_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Post not found")
        
        return {
            "success": True,
            "message": "Post liked successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error liking post: {str(e)}")

@router.get("/{post_id}/comments", response_model=Dict[str, Any])
async def get_post_comments(
    post_id: str,
    skip: int = Query(0, description="跳过的评论数"),
    limit: int = Query(20, description="返回评论数量限制")
):
    """
    获取帖子的评论
    
    Args:
        post_id: 帖子ID
        skip: 跳过的评论数
        limit: 返回评论数量限制
        
    Returns:
        Dict[str, Any]: 评论列表
    """
    try:
        comments = CommentService.get_comments_with_replies("post", post_id, skip, limit)
        
        return {
            "success": True,
            "post_id": post_id,
            "comments": comments,
            "total": len(comments)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching post comments: {str(e)}")

@router.get("/stats/overview", response_model=Dict[str, Any])
async def get_post_stats():
    """
    获取帖子统计信息
    
    Returns:
        Dict[str, Any]: 统计信息
    """
    try:
        stats = PostService.get_post_stats()
        
        return {
            "success": True,
            "stats": stats.dict()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching post stats: {str(e)}")

@router.post("/generate-mock", response_model=Dict[str, Any])
async def generate_mock_posts(count: int = Query(10, description="生成帖子数量")):
    """
    生成模拟帖子数据

    Args:
        count: 生成帖子数量

    Returns:
        Dict[str, Any]: 生成结果
    """
    try:
        from app.services.mock_post_service import MockPostService
        posts = MockPostService.generate_mock_posts(count)

        return {
            "success": True,
            "posts": posts,
            "total": len(posts),
            "message": f"Generated {len(posts)} mock posts successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating mock posts: {str(e)}")
