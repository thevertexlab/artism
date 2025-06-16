// 艺术家类型
export interface Artist {
  id: string;
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  art_movement?: string;
  biography?: string;
  style_description?: string;
  famous_works?: string[];
  ai_personality?: string;
  created_at: string;
  updated_at: string;
}

// 创建艺术家请求类型
export interface CreateArtistRequest {
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  art_movement?: string;
  biography?: string;
  style_description?: string;
  famous_works?: string[];
  ai_personality?: string;
}

// 更新艺术家请求类型
export interface UpdateArtistRequest {
  name?: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  art_movement?: string;
  biography?: string;
  style_description?: string;
  famous_works?: string[];
  ai_personality?: string;
}

// 艺术作品类型
export interface Artwork {
  id: string;
  title: string;
  artist_id: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
  style_tags?: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// 创建艺术作品请求类型
export interface CreateArtworkRequest {
  title: string;
  artist_id: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
  style_tags?: string[];
  image_url?: string;
}

// 更新艺术作品请求类型
export interface UpdateArtworkRequest {
  title?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
  style_tags?: string[];
  image_url?: string;
}

// 艺术流派类型
export interface ArtMovement {
  id: string;
  name: string;
  start_year?: number;
  end_year?: number;
  description?: string;
  characteristics?: string[];
  key_artists?: string[];
  influences?: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// 创建艺术流派请求类型
export interface CreateArtMovementRequest {
  name: string;
  start_year?: number;
  end_year?: number;
  description?: string;
  characteristics?: string[];
  key_artists?: string[];
  influences?: string[];
  image_url?: string;
}

// 更新艺术流派请求类型
export interface UpdateArtMovementRequest {
  name?: string;
  start_year?: number;
  end_year?: number;
  description?: string;
  characteristics?: string[];
  key_artists?: string[];
  influences?: string[];
  image_url?: string;
}

// 搜索参数类型
export interface SearchParams {
  skip?: number;
  limit?: number;
  [key: string]: any;
}

// 艺术家搜索参数
export interface ArtistSearchParams extends SearchParams {
  name?: string;
  movement?: string;
  nationality?: string;
} 