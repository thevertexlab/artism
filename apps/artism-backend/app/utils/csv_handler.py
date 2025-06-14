import os
import pandas as pd
from typing import Dict, Any, List, Optional
from fastapi import UploadFile
from app.core.config import DATA_DIR

class CSVHandler:
    """
    CSV 处理工具类
    
    提供 CSV 文件的读取、验证和处理功能
    """
    
    @staticmethod
    async def save_upload_file(file: UploadFile) -> str:
        """
        保存上传的 CSV 文件
        
        Args:
            file: 上传的文件
            
        Returns:
            str: 保存的文件路径
        """
        # 确保数据目录存在
        os.makedirs(DATA_DIR, exist_ok=True)
        
        # 保存文件
        file_path = os.path.join(DATA_DIR, file.filename)
        content = await file.read()
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        return file_path
    
    @staticmethod
    def read_csv(file_path: str) -> pd.DataFrame:
        """
        读取 CSV 文件
        
        Args:
            file_path: CSV 文件路径
            
        Returns:
            pd.DataFrame: 包含 CSV 数据的 DataFrame
        """
        return pd.read_csv(file_path)
    
    @staticmethod
    def validate_csv_structure(df: pd.DataFrame, required_columns: List[str]) -> List[str]:
        """
        验证 CSV 结构
        
        Args:
            df: 包含 CSV 数据的 DataFrame
            required_columns: 必需的列名列表
            
        Returns:
            List[str]: 验证错误列表，如果没有错误则为空列表
        """
        errors = []
        
        # 检查必需列
        for column in required_columns:
            if column not in df.columns:
                errors.append(f"Missing required column: '{column}'")
        
        return errors
    
    @staticmethod
    def clean_data(df: pd.DataFrame) -> pd.DataFrame:
        """
        清理数据
        
        Args:
            df: 包含 CSV 数据的 DataFrame
            
        Returns:
            pd.DataFrame: 清理后的 DataFrame
        """
        # 复制 DataFrame 以避免修改原始数据
        cleaned_df = df.copy()
        
        # 处理缺失值
        for column in cleaned_df.columns:
            # 对于数值列，将缺失值替换为 None（而不是 NaN）
            if pd.api.types.is_numeric_dtype(cleaned_df[column]):
                cleaned_df[column] = cleaned_df[column].astype('object')
                cleaned_df[column] = cleaned_df[column].where(pd.notna(cleaned_df[column]), None)
            
            # 对于字符串列，将缺失值替换为 None
            elif pd.api.types.is_string_dtype(cleaned_df[column]):
                cleaned_df[column] = cleaned_df[column].where(cleaned_df[column].notna() & (cleaned_df[column] != ""), None)
        
        return cleaned_df
    
    @staticmethod
    def get_test_data_path(filename: str = "test_table.csv") -> Optional[str]:
        """
        获取测试数据文件路径
        
        Args:
            filename: 测试数据文件名，默认为 test_table.csv
            
        Returns:
            Optional[str]: 测试数据文件路径，如果不存在则返回 None
        """
        test_data_path = os.path.join(DATA_DIR, filename)
        
        if os.path.exists(test_data_path):
            return test_data_path
        
        return None 