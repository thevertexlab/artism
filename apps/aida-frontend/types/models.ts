/**
 * Artist model interface
 */
export interface Artist {
  id: number;
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  bio?: string;
  art_movement?: string;
  image_url?: string;
  notable_works?: string[];
}

/**
 * Artwork model interface
 */
export interface Artwork {
  id: number;
  title: string;
  artist_id: number;
  year?: number;
  medium?: string;
  dimensions?: string;
  location?: string;
  description?: string;
  image_url?: string;
}

/**
 * Artist filter interface for search and filtering
 */
export interface ArtistFilter {
  name?: string;
  nationality?: string;
  style?: string;
  min_year?: number;
  max_year?: number;
}

/**
 * Artwork filter interface for search and filtering
 */
export interface ArtworkFilter {
  title?: string;
  artist_id?: number;
  min_year?: number;
  max_year?: number;
  medium?: string;
}

/**
 * User model interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  bio?: string;
}

/**
 * Forum post interface
 */
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: User;
  created_at: string;
  updated_at?: string;
  likes: number;
  comments: number;
}

/**
 * AI Interaction response interface
 */
export interface AIInteractionResponse {
  response: string;
  artist_name: string;
  artist_id?: number;
} 