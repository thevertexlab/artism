import asyncio
import schedule
import time
from datetime import datetime
from typing import Optional
from app.services.ai_comment_service import AICommentService

class SchedulerService:
    """
    定时任务服务
    
    负责管理AI评论的自动生成任务
    """
    
    def __init__(self):
        self.running = False
        self.task = None
    
    def start_auto_comment_generation(self, interval_minutes: int = 5):
        """
        启动自动评论生成任务
        
        Args:
            interval_minutes: 生成间隔（分钟）
        """
        if self.running:
            print("Auto comment generation is already running")
            return
        
        # 设置定时任务
        schedule.every(interval_minutes).minutes.do(self._generate_comments_job)
        
        self.running = True
        print(f"Started auto comment generation every {interval_minutes} minutes")
        
        # 启动调度器
        self.task = asyncio.create_task(self._run_scheduler())
    
    def stop_auto_comment_generation(self):
        """
        停止自动评论生成任务
        """
        if not self.running:
            print("Auto comment generation is not running")
            return
        
        self.running = False
        schedule.clear()
        
        if self.task:
            self.task.cancel()
        
        print("Stopped auto comment generation")
    
    async def _run_scheduler(self):
        """
        运行调度器的异步任务
        """
        try:
            while self.running:
                schedule.run_pending()
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            print("Scheduler task cancelled")
        except Exception as e:
            print(f"Error in scheduler: {e}")
    
    def _generate_comments_job(self):
        """
        生成评论的定时任务
        """
        try:
            # 创建新的事件循环来运行异步函数
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            # 生成评论
            comments = loop.run_until_complete(
                AICommentService.generate_auto_comments(max_comments=3)
            )
            
            print(f"[{datetime.now()}] Generated {len(comments)} auto comments")
            
            # 这里可以添加保存到数据库的逻辑
            # await self._save_comments_to_database(comments)
            
        except Exception as e:
            print(f"Error in comment generation job: {e}")
        finally:
            loop.close()
    
    def get_status(self) -> dict:
        """
        获取调度器状态
        
        Returns:
            dict: 状态信息
        """
        return {
            "running": self.running,
            "scheduled_jobs": len(schedule.jobs),
            "next_run": str(schedule.next_run()) if schedule.jobs else None
        }

# 全局调度器实例
scheduler = SchedulerService()
