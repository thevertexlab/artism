const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Movement = require('../models/Movement');

// 连接到数据库
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ismism-machine', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// 示例数据
const movementData = [
  {
    name: '印象派',
    start_year: 1872,
    end_year: 1892,
    description: '印象派是19世纪末在法国兴起的艺术运动，强调捕捉光线和色彩的瞬间印象，而不是细节。这种风格以短促、可见的笔触和对自然光线的强调为特点。',
    representative_artists: [],
    notable_artworks: [],
    influences: ['巴比松画派', '日本浮世绘'],
    influencedBy: [],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Claude_Monet%2C_Impression%2C_soleil_levant.jpg/800px-Claude_Monet%2C_Impression%2C_soleil_levant.jpg'
    ],
    tags: ['印象派', '法国', '19世纪'],
    position: { x: 100, y: 150 }
  },
  {
    name: '立体主义',
    start_year: 1907,
    end_year: 1922,
    description: '立体主义是20世纪初由毕加索和布拉克创立的前卫艺术运动，它打破了传统的透视法则，从多个角度同时呈现对象，将其分解为几何形状。',
    representative_artists: [],
    notable_artworks: [],
    influences: ['塞尚', '非洲艺术'],
    influencedBy: ['印象派'],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/9/9c/Violin_and_Candlestick.jpg'
    ],
    tags: ['立体主义', '法国', '20世纪初'],
    position: { x: 350, y: 250 }
  },
  {
    name: '超现实主义',
    start_year: 1924,
    end_year: 1966,
    description: '超现实主义是一种文化运动，始于20世纪20年代，强调梦境、幻想和潜意识的表达，通过将不相关的元素并置来创造出超越现实的奇特景象。',
    representative_artists: [],
    notable_artworks: [],
    influences: ['达达主义', '弗洛伊德心理学'],
    influencedBy: ['立体主义'],
    images: [
      'https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg'
    ],
    tags: ['超现实主义', '法国', '西班牙', '20世纪'],
    position: { x: 600, y: 180 }
  }
];

// 清空并重新填充数据
const seedData = async () => {
  try {
    // 连接数据库
    await connectDB();
    
    // 清空现有数据
    await Movement.deleteMany({});
    console.log('已清空现有数据');
    
    // 插入新数据
    const createdMovements = await Movement.insertMany(movementData);
    console.log(`成功添加了 ${createdMovements.length} 个艺术运动数据`);
    
    // 关闭数据库连接
    mongoose.connection.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('数据填充过程中出错:', error);
    process.exit(1);
  }
};

// 执行数据填充
seedData(); 