const Movement = require('../models/Movement');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');

// 获取所有艺术运动数据，包括相关的艺术家和作品信息
exports.getAllArtMovements = async (req, res) => {
  try {
    const movements = await Movement.find();
    const enrichedMovements = await Promise.all(movements.map(async (movement) => {
      // 获取相关艺术家信息
      const artists = await Artist.find({
        _id: { $in: movement.representative_artists }
      });
      
      // 获取相关作品信息
      const artworks = await Artwork.find({
        _id: { $in: movement.notable_artworks }
      });

      // 处理新的images数据结构
      const processedImages = artworks.reduce((acc, artwork) => {
        if (artwork.images && artwork.images.length > 0) {
          // 如果images是对象数组，提取url属性
          const imageUrls = artwork.images.map(img => typeof img === 'object' && img.url ? img.url : img);
          return [...acc, ...imageUrls];
        }
        return acc;
      }, []);

      // 返回与IArtStyle接口匹配的数据结构
      return {
        id: movement._id,
        title: movement.name,
        year: movement.start_year,
        description: movement.description,
        characteristics: [], // 默认为空数组
        artists: artists.map(artist => artist.name),
        images: processedImages, // 使用处理后的图片URL数组
        period: {
          start: movement.start_year,
          end: movement.end_year || new Date().getFullYear()
        },
        artworks: artworks.map(artwork => ({
          id: artwork._id,
          title: artwork.title,
          year: artwork.year_created || movement.start_year,
          artist: artists.find(a => a._id.toString() === artwork.artist_id?.toString())?.name || '未知艺术家',
          imageUrl: artwork.images && artwork.images.length > 0 ? 
            (typeof artwork.images[0] === 'object' ? artwork.images[0].url : artwork.images[0]) : '',
          description: artwork.description,
          medium: artwork.medium,
          location: artwork.location,
          // 添加完整的图片信息
          fullImages: artwork.images
        })),
        keyArtists: artists.map(artist => ({
          id: artist._id,
          name: artist.name,
          birthYear: artist.birth_year,
          deathYear: artist.death_year,
          nationality: artist.nationality,
          biography: artist.biography
        })),
        styleMovement: movement.name,
        influences: [],
        influencedBy: [],
        tags: []
      };
    }));

    res.json(enrichedMovements);
  } catch (error) {
    console.error('Error fetching art movements:', error);
    res.status(500).json({ message: 'Error fetching art movements' });
  }
}; 