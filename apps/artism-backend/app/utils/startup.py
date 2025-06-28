"""
应用启动时的初始化脚本
"""

import asyncio
from typing import Optional

from app.utils.database_setup import DatabaseSetup, DatabaseMigration


async def initialize_database():
    """
    初始化数据库
    """
    try:
        print("Initializing database...")
        
        # 1. 确保集合存在
        DatabaseSetup.ensure_collections_exist()
        
        # 2. 创建索引
        DatabaseSetup.create_indexes()
        
        # 3. 执行迁移（如果需要）
        try:
            DatabaseMigration.add_timestamps()
            DatabaseMigration.migrate_to_new_schema()
        except Exception as e:
            print(f"Migration warning (this is normal for new databases): {e}")
        
        # 4. 显示统计信息
        stats = DatabaseSetup.get_collection_stats()
        print("Database initialization completed!")
        print("Collection statistics:")
        for collection, stat in stats.items():
            if "error" in stat:
                print(f"  {collection}: Error - {stat['error']}")
            else:
                print(f"  {collection}: {stat['document_count']} documents, {stat['indexes']} indexes")
        
        return True
        
    except Exception as e:
        print(f"Database initialization failed: {e}")
        return False


async def startup_sequence():
    """
    完整的启动序列
    """
    print("Starting AIDA backend initialization...")
    
    # 初始化数据库
    db_success = await initialize_database()
    
    if db_success:
        print("✅ Database initialization successful")
    else:
        print("❌ Database initialization failed")
    
    print("AIDA backend initialization completed!")
    return db_success


def run_startup():
    """
    运行启动序列（同步版本）
    """
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # 如果事件循环已在运行，使用 ensure_future 并等待结果
            future = asyncio.ensure_future(startup_sequence())
            # 兼容 Jupyter/嵌入环境
            import time
            while not future.done():
                time.sleep(0.1)
            return future.result()
        else:
            return loop.run_until_complete(startup_sequence())
    except RuntimeError:
        # 没有事件循环时
        return asyncio.run(startup_sequence())


if __name__ == "__main__":
    run_startup()
