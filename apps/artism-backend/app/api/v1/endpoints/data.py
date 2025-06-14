from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from bson import json_util
import json
import os

from app.schemas.artist import CSVUploadResponse
from app.services.artist_service import ArtistService
from app.utils.csv_handler import CSVHandler

router = APIRouter()

@router.post("/upload-csv", response_model=CSVUploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    """
    上传 CSV 文件
    
    上传 CSV 文件并处理其中的数据
    
    Args:
        file: 上传的 CSV 文件
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # 保存文件
        file_path = await CSVHandler.save_upload_file(file)
        
        # 读取 CSV 文件
        df = CSVHandler.read_csv(file_path)
        rows_count = len(df)
        
        # 这里可以添加数据处理逻辑
        # 例如，将数据导入到数据库
        
        return {
            "filename": file.filename,
            "rows_processed": rows_count,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@router.get("/import-test-data")
async def import_test_data():
    """
    导入测试数据
    
    从 test_table.csv 文件导入测试数据到 MongoDB
    """
    try:
        # 获取测试数据文件路径
        test_data_path = CSVHandler.get_test_data_path()
        
        if not test_data_path:
            raise HTTPException(status_code=404, detail="Test data file not found")
        
        # 导入数据
        result = ArtistService.import_from_csv(test_data_path)
        
        if result["status"] == "error":
            raise HTTPException(status_code=400, detail={"message": "Error importing test data", "errors": result["errors"]})
        
        # 返回自定义响应
        return JSONResponse(content={
            "message": "Test data import successful",
            "records_count": result["rows_processed"],
            "collection": ArtistService.COLLECTION_NAME,
            "sample_records": result["sample_records"]
        })
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error importing test data: {str(e)}") 