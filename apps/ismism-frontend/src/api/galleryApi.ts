import api from './axios';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  style: string;
  description: string;
  images?: string[];
  styleMovement?: string;
  tags?: string[];
  medium?: string;
  dimensions?: {
    height_cm?: number;
    width_cm?: number;
  };
  location?: string;
}

// 从后端API获取所有艺术作品
export const fetchAllArtworks = async (): Promise<Artwork[]> => {
  try {
    const response = await api.get('/artworks');
    
    // 将API返回的数据映射到Artwork接口
    const artworks: Artwork[] = response.data.map((artwork: any) => ({
      id: artwork.id || artwork._id || String(Date.now()),
      title: artwork.title || '无标题作品',
      artist: artwork.artist_name || '未知艺术家',
      year: artwork.year_created || artwork.year || 1900,
      imageUrl: (artwork.images && artwork.images.length > 0 && artwork.images[0].url) 
        ? artwork.images[0].url 
        : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      style: artwork.movement_name || '未分类风格',
      description: artwork.description || '这是一幅艺术作品。',
      images: artwork.images ? artwork.images.map((img: any) => img.url) : [],
      styleMovement: artwork.movement_id || '',
      tags: artwork.tags || [],
      medium: artwork.medium || '',
      dimensions: artwork.dimensions || {},
      location: artwork.location || ''
    }));
    
    return artworks;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    // 如果API调用失败，尝试使用/movements端点作为备选
    try {
      console.log('Falling back to /movements endpoint');
      const response = await api.get('/movements');
      
      // 将艺术主义数据映射到Artwork接口
      const artworks: Artwork[] = [];
      
      response.data.forEach((movement: any) => {
        // 为每个艺术主义创建一个代表性作品
        const mainArtwork: Artwork = {
          id: `artwork-${movement.id || movement._id}`,
          title: movement.title || movement.name,
          artist: (movement.representative_artists && movement.representative_artists.length > 0) 
            ? movement.representative_artists[0] 
            : '未知艺术家',
          year: movement.start_year || movement.year || 1900,
          imageUrl: (movement.images && movement.images.length > 0) 
            ? movement.images[0] 
            : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
          style: movement.title || movement.name,
          description: movement.description || `这是一个${movement.title || movement.name}风格的艺术作品。`,
          images: movement.images || [],
          styleMovement: (movement.title || movement.name).toLowerCase().replace(/\s+/g, '-'),
          tags: movement.tags || []
        };
        
        artworks.push(mainArtwork);
        
        // 如果有多个图片，为每个图片创建一个作品
        if (movement.images && movement.images.length > 1) {
          movement.images.slice(1).forEach((image: string, index: number) => {
            const additionalArtwork: Artwork = {
              id: `artwork-${movement.id || movement._id}-${index + 1}`,
              title: `${movement.title || movement.name} 作品 ${index + 1}`,
              artist: (movement.representative_artists && movement.representative_artists.length > index + 1) 
                ? movement.representative_artists[index + 1] 
                : '未知艺术家',
              year: (movement.start_year || movement.year || 1900) + index,
              imageUrl: image,
              style: movement.title || movement.name,
              description: `这是一个${movement.title || movement.name}风格的艺术作品。`,
              images: [image],
              styleMovement: (movement.title || movement.name).toLowerCase().replace(/\s+/g, '-'),
              tags: movement.tags || []
            };
            
            artworks.push(additionalArtwork);
          });
        }
      });
      
      return artworks;
    } catch (fallbackError) {
      console.error('Error in fallback to /movements:', fallbackError);
      throw error; // 抛出原始错误
    }
  }
};

// 根据ID获取艺术作品
export const fetchArtworkById = async (id: string): Promise<Artwork> => {
  try {
    const response = await api.get(`/artworks/${id}`);
    const artwork = response.data;
    
    return {
      id: artwork.id || artwork._id,
      title: artwork.title || '无标题作品',
      artist: artwork.artist_name || '未知艺术家',
      year: artwork.year_created || artwork.year || 1900,
      imageUrl: (artwork.images && artwork.images.length > 0 && artwork.images[0].url) 
        ? artwork.images[0].url 
        : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      style: artwork.movement_name || '未分类风格',
      description: artwork.description || '这是一幅艺术作品。',
      images: artwork.images ? artwork.images.map((img: any) => img.url) : [],
      styleMovement: artwork.movement_id || '',
      tags: artwork.tags || [],
      medium: artwork.medium || '',
      dimensions: artwork.dimensions || {},
      location: artwork.location || ''
    };
  } catch (error) {
    console.error(`Error fetching artwork ${id}:`, error);
    
    // 如果API调用失败，尝试使用/movements端点作为备选
    try {
      console.log('Falling back to /movements endpoint for artwork details');
      // 解析ID，如果是复合ID（如artwork-123-1），提取主要ID部分
      const idParts = id.split('-');
      let movementId = idParts[1];
      
      // 如果是artwork-123-1这种形式，提取123作为movementId
      if (idParts.length > 2) {
        movementId = idParts[1];
      }
      
      const response = await api.get(`/movements/${movementId}`);
      const movement = response.data;
      
      // 如果是复合ID，需要返回特定图片的作品
      let imageIndex = 0;
      if (idParts.length > 2) {
        imageIndex = parseInt(idParts[2], 10);
      }
      
      const artwork: Artwork = {
        id: id,
        title: idParts.length > 2 
          ? `${movement.title || movement.name} 作品 ${imageIndex}` 
          : movement.title || movement.name,
        artist: (movement.representative_artists && movement.representative_artists.length > imageIndex) 
          ? movement.representative_artists[imageIndex] 
          : '未知艺术家',
        year: movement.start_year || movement.year || 1900,
        imageUrl: (movement.images && movement.images.length > imageIndex) 
          ? movement.images[imageIndex] 
          : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
        style: movement.title || movement.name,
        description: movement.description || `这是一个${movement.title || movement.name}风格的艺术作品。`,
        images: movement.images || [],
        styleMovement: (movement.title || movement.name).toLowerCase().replace(/\s+/g, '-'),
        tags: movement.tags || []
      };
      
      return artwork;
    } catch (fallbackError) {
      console.error('Error in fallback to /movements for artwork details:', fallbackError);
      throw error; // 抛出原始错误
    }
  }
};

// 根据风格获取艺术作品
export const fetchArtworksByStyle = async (style: string): Promise<Artwork[]> => {
  try {
    // 将风格名称转换为ID格式
    const styleId = style.toLowerCase().replace(/\s+/g, '-');
    
    // 尝试使用movement_id查询
    const response = await api.get(`/artworks`, {
      params: { movement_id: styleId }
    });
    
    // 将API返回的数据映射到Artwork接口
    return response.data.map((artwork: any) => ({
      id: artwork.id || artwork._id,
      title: artwork.title || '无标题作品',
      artist: artwork.artist_name || '未知艺术家',
      year: artwork.year_created || artwork.year || 1900,
      imageUrl: (artwork.images && artwork.images.length > 0 && artwork.images[0].url) 
        ? artwork.images[0].url 
        : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      style: artwork.movement_name || style,
      description: artwork.description || '这是一幅艺术作品。',
      images: artwork.images ? artwork.images.map((img: any) => img.url) : [],
      styleMovement: artwork.movement_id || styleId,
      tags: artwork.tags || [],
      medium: artwork.medium || '',
      dimensions: artwork.dimensions || {},
      location: artwork.location || ''
    }));
  } catch (error) {
    console.error(`Error fetching artworks by style ${style}:`, error);
    
    // 如果API调用失败，尝试使用/movements端点作为备选
    try {
      console.log('Falling back to filtering from all artworks');
      // 获取所有艺术主义
      const allArtworks = await fetchAllArtworks();
      
      // 过滤出指定风格的作品
      return allArtworks.filter(artwork => 
        artwork.styleMovement === style.toLowerCase().replace(/\s+/g, '-') || 
        artwork.style.toLowerCase() === style.toLowerCase()
      );
    } catch (fallbackError) {
      console.error('Error in fallback to filtering artworks:', fallbackError);
      throw error; // 抛出原始错误
    }
  }
}; 