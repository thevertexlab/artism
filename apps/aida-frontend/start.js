const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 尝试删除.next目录中的关键文件
console.log('正在清理缓存...');
try {
  // 尝试删除middleware-manifest.json文件
  const manifestPath = path.join(__dirname, '.next', 'server', 'middleware-manifest.json');
  if (fs.existsSync(manifestPath)) {
    fs.unlinkSync(manifestPath);
    console.log('已删除middleware-manifest.json');
  }
  
  // 尝试删除trace文件
  const tracePath = path.join(__dirname, '.next', 'trace');
  if (fs.existsSync(tracePath)) {
    fs.unlinkSync(tracePath);
    console.log('已删除trace文件');
  }
} catch (error) {
  console.log('清理缓存时出错，但将继续启动:', error.message);
}

// 启动开发服务器
console.log('正在启动开发服务器...');
try {
  execSync('npx next dev --turbo', { stdio: 'inherit' });
} catch (error) {
  console.log('开发服务器已退出');
} 