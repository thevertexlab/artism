const Movement = require('../models/Movement');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const mongoose = require('mongoose');

// 获取所有艺术运动数据，包括相关的艺术家和作品信息
exports.getAllArtMovements = async (req, res) => {
  try {
    // 从movements集合获取所有艺术运动
    const movements = await Movement.find().lean();
    
    // 使用Promise.all并行处理每个艺术运动
    const enrichedMovements = await Promise.all(movements.map(async (movement) => {
      // 从artists集合获取相关艺术家信息
      const artists = await Artist.find({
        _id: { $in: movement.representative_artists || [] }
      }).lean();
      
      // 从artworks集合获取相关作品信息
      const artworks = await Artwork.find({
        _id: { $in: movement.notable_artworks || [] }
      }).lean();

      // 处理图片数据
      const processedImages = [];
      
      // 添加艺术运动自身的图片
      if (movement.images && movement.images.length > 0) {
        processedImages.push(...movement.images);
      }
      
      // 添加艺术品的图片
      artworks.forEach(artwork => {
        if (artwork.images && artwork.images.length > 0) {
          // 处理不同格式的图片数据
          const imageUrls = artwork.images.map(img => 
            typeof img === 'object' && img.url ? img.url : img
          );
          processedImages.push(...imageUrls);
        }
      });

      // 返回与前端接口匹配的数据结构
      return {
        id: movement._id.toString(),
        title: movement.name,
        year: movement.start_year,
        description: movement.description,
        characteristics: movement.characteristics || [],
        artists: artists.map(artist => artist.name),
        images: processedImages,
        period: {
          start: movement.start_year,
          end: movement.end_year || new Date().getFullYear()
        },
        artworks: artworks.map(artwork => ({
          id: artwork._id.toString(),
          title: artwork.title,
          year: artwork.year_created || movement.start_year,
          artist: artists.find(a => a._id.toString() === artwork.artist_id?.toString())?.name || '未知艺术家',
          imageUrl: artwork.images && artwork.images.length > 0 ? 
            (typeof artwork.images[0] === 'object' ? artwork.images[0].url : artwork.images[0]) : '',
          description: artwork.description,
          medium: artwork.medium,
          location: artwork.location,
          fullImages: artwork.images
        })),
        keyArtists: artists.map(artist => ({
          id: artist._id.toString(),
          name: artist.name,
          birthYear: artist.birth_year,
          deathYear: artist.death_year,
          nationality: artist.nationality,
          biography: artist.biography
        })),
        styleMovement: movement.name,
        influences: movement.influences || [],
        influencedBy: movement.influencedBy || [],
        tags: movement.tags || [],
        position: movement.position || { x: 0, y: 0 }
      };
    }));

    res.json(enrichedMovements);
  } catch (error) {
    console.error('Error fetching art movements:', error);
    res.status(500).json({ message: 'Error fetching art movements' });
  }
};

// 获取单个艺术运动
exports.getArtMovementById = async (req, res) => {
  try {
    const movement = await Movement.findById(req.params.id).lean();
    
    if (!movement) {
      return res.status(404).json({ message: '找不到该艺术运动' });
    }
    
    // 获取相关艺术家信息
    const artists = await Artist.find({
      _id: { $in: movement.representative_artists || [] }
    }).lean();
    
    // 获取相关作品信息
    const artworks = await Artwork.find({
      _id: { $in: movement.notable_artworks || [] }
    }).lean();
    
    // 处理图片数据
    const processedImages = [];
    
    // 添加艺术运动自身的图片
    if (movement.images && movement.images.length > 0) {
      processedImages.push(...movement.images);
    }
    
    // 添加艺术品的图片
    artworks.forEach(artwork => {
      if (artwork.images && artwork.images.length > 0) {
        const imageUrls = artwork.images.map(img => 
          typeof img === 'object' && img.url ? img.url : img
        );
        processedImages.push(...imageUrls);
      }
    });
    
    const enrichedMovement = {
      id: movement._id.toString(),
      title: movement.name,
      year: movement.start_year,
      description: movement.description,
      characteristics: movement.characteristics || [],
      artists: artists.map(artist => artist.name),
      images: processedImages,
      period: {
        start: movement.start_year,
        end: movement.end_year || new Date().getFullYear()
      },
      artworks: artworks.map(artwork => ({
        id: artwork._id.toString(),
        title: artwork.title,
        year: artwork.year_created || movement.start_year,
        artist: artists.find(a => a._id.toString() === artwork.artist_id?.toString())?.name || '未知艺术家',
        imageUrl: artwork.images && artwork.images.length > 0 ? 
          (typeof artwork.images[0] === 'object' ? artwork.images[0].url : artwork.images[0]) : '',
        description: artwork.description,
        medium: artwork.medium,
        location: artwork.location,
        fullImages: artwork.images
      })),
      keyArtists: artists.map(artist => ({
        id: artist._id.toString(),
        name: artist.name,
        birthYear: artist.birth_year,
        deathYear: artist.death_year,
        nationality: artist.nationality,
        biography: artist.biography
      })),
      styleMovement: movement.name,
      influences: movement.influences || [],
      influencedBy: movement.influencedBy || [],
      tags: movement.tags || [],
      position: movement.position || { x: 0, y: 0 }
    };
    
    res.json(enrichedMovement);
  } catch (error) {
    console.error(`Error fetching art movement ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching art movement' });
  }
};

// 创建艺术运动
exports.createArtMovement = async (req, res) => {
  try {
    const { name, start_year, end_year, description, representative_artists, notable_artworks, images, tags, influences, influencedBy } = req.body;
    
    const newMovement = new Movement({
      name,
      start_year,
      end_year,
      description,
      representative_artists: representative_artists || [],
      notable_artworks: notable_artworks || [],
      images: images || [],
      tags: tags || [],
      influences: influences || [],
      influencedBy: influencedBy || []
    });
    
    const savedMovement = await newMovement.save();
    res.status(201).json(savedMovement);
  } catch (error) {
    console.error('Error creating art movement:', error);
    res.status(400).json({ message: 'Error creating art movement', error: error.message });
  }
};

// 更新艺术运动
exports.updateArtMovement = async (req, res) => {
  try {
    const { name, start_year, end_year, description, representative_artists, notable_artworks, images, tags, influences, influencedBy, position } = req.body;
    
    const updatedMovement = await Movement.findByIdAndUpdate(
      req.params.id,
      {
        name,
        start_year,
        end_year,
        description,
        representative_artists,
        notable_artworks,
        images,
        tags,
        influences,
        influencedBy,
        position
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedMovement) {
      return res.status(404).json({ message: '找不到该艺术运动' });
    }
    
    res.json(updatedMovement);
  } catch (error) {
    console.error(`Error updating art movement ${req.params.id}:`, error);
    res.status(400).json({ message: 'Error updating art movement', error: error.message });
  }
};

// 删除艺术运动
exports.deleteArtMovement = async (req, res) => {
  try {
    const deletedMovement = await Movement.findByIdAndDelete(req.params.id);
    
    if (!deletedMovement) {
      return res.status(404).json({ message: '找不到该艺术运动' });
    }
    
    res.json({ message: '艺术运动已成功删除', data: deletedMovement });
  } catch (error) {
    console.error(`Error deleting art movement ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting art movement' });
  }
};

// 获取contemporary_movements数据库中的艺术运动数据
exports.getContemporaryMovements = async (req, res) => {
  try {
    // 创建一个新的连接到contemporary_movements数据库
    const uri = 'mongodb://localhost:27017/contemporary_movements';
    const client = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // 获取movements集合
    const collection = client.collection('movements');
    
    // 查询所有艺术运动数据
    const movements = await collection.find({}).toArray();
    
    // 转换为前端所需的格式
    const formattedMovements = movements.map(movement => ({
      id: movement._id.toString(),
      title: movement.name,
      year: movement.start_year,
      description: movement.description || '',
      characteristics: movement.characteristics || [],
      // 确保artists是字符串数组
      artists: Array.isArray(movement.representative_artists) ? movement.representative_artists : [],
      // 确保images是数组
      images: Array.isArray(movement.images) ? movement.images : [],
      period: {
        start: movement.start_year,
        end: movement.end_year || new Date().getFullYear()
      },
      // 添加空的artworks数组，避免前端报错
      artworks: [],
      // 添加空的keyArtists数组，避免前端报错
      keyArtists: [],
      styleMovement: movement.name,
      influences: Array.isArray(movement.influences) ? movement.influences : [],
      influencedBy: Array.isArray(movement.influencedBy) ? movement.influencedBy : [],
      tags: Array.isArray(movement.tags) ? movement.tags : [],
      position: movement.position || { x: Math.random() * 800, y: Math.random() * 400 }
    }));
    
    // 关闭连接
    await client.close();
    
    console.log(`Fetched ${formattedMovements.length} contemporary movements`);
    
    res.json(formattedMovements);
  } catch (error) {
    console.error('Error fetching contemporary movements:', error);
    res.status(500).json({ message: 'Error fetching contemporary movements', error: error.message });
  }
}; 