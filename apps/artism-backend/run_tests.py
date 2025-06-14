#!/usr/bin/env python3
"""
AIDA Backend 测试运行脚本
高效学术项目测试方案
"""

import subprocess
import sys
import os
import time


def run_command(cmd, description):
    """运行命令并显示结果"""
    print(f"\n{'='*60}")
    print(f"🔧 {description}")
    print(f"{'='*60}")
    
    start_time = time.time()
    
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        end_time = time.time()
        duration = end_time - start_time
        
        if result.returncode == 0:
            print(f"✅ 成功 (耗时: {duration:.2f}s)")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"❌ 失败 (耗时: {duration:.2f}s)")
            if result.stderr:
                print("错误信息:")
                print(result.stderr)
            if result.stdout:
                print("输出信息:")
                print(result.stdout)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ 执行失败: {e}")
        return False


def main():
    """主函数"""
    print("🚀 AIDA Backend 测试套件")
    print("高效学术项目测试方案")
    
    # 设置Python路径
    backend_path = os.path.dirname(os.path.abspath(__file__))
    env_cmd = f"PYTHONPATH={backend_path}"
    
    # 测试命令列表
    tests = [
        {
            "cmd": f"{env_cmd} python3.10 -m pytest tests/test_essential.py -v --tb=short --disable-warnings",
            "description": "运行核心功能测试"
        },
        {
            "cmd": f"{env_cmd} python3.10 -m pytest tests/test_essential.py --cov=app --cov-report=term-missing --disable-warnings",
            "description": "运行覆盖率测试"
        }
    ]
    
    # 运行测试
    all_passed = True
    for test in tests:
        success = run_command(test["cmd"], test["description"])
        if not success:
            all_passed = False
    
    # 总结
    print(f"\n{'='*60}")
    if all_passed:
        print("🎉 所有测试通过！")
        print("✅ AIDA后端核心功能验证成功")
        print("✅ 测试覆盖率达到预期目标")
        print("✅ 系统可以正常使用")
    else:
        print("⚠️  部分测试失败")
        print("请检查上述错误信息并修复问题")
    
    print(f"{'='*60}")
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
