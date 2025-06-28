import uvicorn
from app import create_app
from app.core.config import HOST, PORT, BASE_URL
from app.utils.startup import run_startup

# 创建应用
app = create_app()

# 输出 API 文档地址
print(f"\n{'='*50}")
print(f"AIDA API is running at: {BASE_URL}")
print(f"API Documentation:")
print(f"- Swagger UI: {BASE_URL}/api/docs")
print(f"- ReDoc: {BASE_URL}/api/redoc")
print(f"{'='*50}\n")

if __name__ == "__main__":
    print("Running startup initialization...")
    startup_success = run_startup()
    if startup_success:
        print(f"✅ Database initialized successfully")
    else:
        print(f"⚠️  Database initialization had issues")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)