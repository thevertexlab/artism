# AIDA Backend Implementation Guide

## Overview

This document describes the complete backend restructuring implementation for the AIDA project, following the requirements specified in `gptmemory/req.md` and `gptmemory/newbknd_working_memory.md`.

## Architecture Overview

### Core Principles
- **DRY (Don't Repeat Yourself)**: Unified base classes and services
- **Unified Response Format**: Consistent API responses across all endpoints
- **Modular Design**: Clear separation of concerns
- **Extensibility**: Easy to add new features and models

### Key Components

1. **Base Infrastructure**
   - `BaseModel`: Common model functionality
   - `BaseService`: Unified CRUD operations
   - `APIResponse`: Standardized response format
   - `QueryParams`: Universal query parameter handling

2. **Data Models**
   - `Artist`: Enhanced with fictional support and AI agent configuration
   - `Artwork`: Updated with style vectors and movement associations
   - `ArtMovement`: New model for art movements

3. **Service Layer**
   - `ArtistService`: Artist-specific operations
   - `ArtworkService`: Artwork-specific operations
   - `ArtMovementService`: Art movement operations

4. **API Layer**
   - RESTful endpoints with unified response format
   - Query parameter support
   - Advanced features (search, similarity, etc.)

## Database Schema

### Collections

#### Artists Collection (`artists`)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "birth_year": "number",
  "death_year": "number",
  "nationality": "string",
  "bio": "string",
  "avatar_url": "string",
  "notable_works": ["artwork_id"],
  "associated_movements": ["movement_id"],
  "tags": ["string"],
  "is_fictional": "boolean",
  "fictional_meta": {
    "origin_project": "string",
    "origin_story": "string",
    "fictional_style": ["string"],
    "model_prompt_seed": "string"
  },
  "agent": {
    "enabled": "boolean",
    "personality_profile": "string",
    "prompt_seed": "string",
    "connected_network_ids": ["string"]
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Artworks Collection (`artworks`)
```json
{
  "id": "string (UUID)",
  "title": "string",
  "artist_id": "string",
  "year": "number",
  "description": "string",
  "image_url": "string",
  "movement_ids": ["movement_id"],
  "tags": ["string"],
  "style_vector": ["float"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Art Movements Collection (`art_movements`)
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "start_year": "number",
  "end_year": "number",
  "key_artists": ["artist_id"],
  "representative_works": ["artwork_id"],
  "tags": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## API Endpoints

### Artists (`/api/v1/artists`)
- `GET /` - Get all artists (with query parameters)
- `GET /{artist_id}` - Get specific artist
- `POST /` - Create artist
- `PUT /{artist_id}` - Update artist
- `DELETE /{artist_id}` - Delete artist
- `GET /search/` - Search artists
- `GET /fictional/` - Get fictional artists
- `GET /real/` - Get real artists
- `GET /{artist_id}/social-network/` - Get artist's social network

### Artworks (`/api/v1/artworks`)
- `GET /` - Get all artworks (with query parameters)
- `GET /{artwork_id}` - Get specific artwork
- `POST /` - Create artwork
- `PUT /{artwork_id}` - Update artwork
- `DELETE /{artwork_id}` - Delete artwork
- `GET /artist/{artist_id}` - Get artworks by artist
- `GET /{artwork_id}/similar` - Get similar artworks
- `GET /movement/{movement_id}` - Get artworks by movement
- `GET /style/search` - Search artworks by style
- `GET /year-range/` - Get artworks by year range

### Art Movements (`/api/v1/art-movements`)
- `GET /` - Get all art movements (with query parameters)
- `GET /{movement_id}` - Get specific art movement
- `POST /` - Create art movement
- `PUT /{movement_id}` - Update art movement
- `DELETE /{movement_id}` - Delete art movement
- `GET /search/` - Search art movements
- `GET /period/` - Get movements by period
- `GET /active/{year}` - Get active movements in year
- `GET /timeline/` - Get movements timeline
- `GET /{movement_id}/statistics` - Get movement statistics
- `POST /{movement_id}/artists` - Add artist to movement
- `DELETE /{movement_id}/artists/{artist_id}` - Remove artist from movement

### Data Generation (`/api/v1/data-generation`)
- `POST /artists` - Generate artist data
- `POST /artworks` - Generate artwork data
- `POST /art-movements` - Generate art movement data
- `POST /full-dataset` - Generate complete dataset
- `GET /sample-data` - Get sample data (without saving)

### Database Management (`/api/v1/database`)
- `POST /setup` - Setup database
- `POST /create-indexes` - Create indexes
- `DELETE /drop-indexes` - Drop indexes
- `GET /indexes` - List indexes
- `GET /stats` - Get database statistics
- `POST /migrate` - Run database migration
- `GET /health` - Check database health

## Query Parameters

All list endpoints support the following query parameters:

- `project`: Filter by project name
- `fields`: Limit returned fields (comma-separated)
- `include`: Include related data (comma-separated)
- `search`: Search keyword
- `tags`: Filter by tags (comma-separated)
- `yearFrom`: Start year filter
- `yearTo`: End year filter
- `sortBy`: Sort field
- `order`: Sort direction (`asc` or `desc`)
- `page`: Page number
- `pageSize`: Items per page
- `isFictional`: Filter fictional/real items

## Response Format

All API responses follow a unified format:

### Success Response
```json
{
  "success": true,
  "data": "any",
  "message": "string",
  "code": 200,
  "timestamp": "datetime"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": ["any"],
  "message": "string",
  "code": 200,
  "timestamp": "datetime",
  "total": "number",
  "page": "number",
  "page_size": "number",
  "total_pages": "number",
  "has_next": "boolean",
  "has_prev": "boolean"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "string",
  "code": "number",
  "timestamp": "datetime",
  "error_details": "object"
}
```

## Data Generation

The system includes comprehensive data generation utilities:

### Real Artists
- Pre-defined historical artists (Leonardo da Vinci, Van Gogh, Picasso, etc.)
- Authentic biographical information
- AI agent configurations for historical personalities

### Fictional Artists
- AI-generated artist personas
- Configurable for different projects (AIDA, 主义主义机)
- Futuristic styles and digital art focus

### Artworks
- Generated based on artist associations
- Style vectors for similarity calculations
- Movement associations

### Art Movements
- Historical movements (Renaissance, Impressionism, Cubism, etc.)
- Fictional movements (AI-Futurism, Quantum Aesthetics)
- Artist and artwork associations

## Database Indexing

Comprehensive indexing for optimal performance:

### Artists Collection
- Unique index on `id`
- Text index on `name`
- Indexes on `nationality`, `birth_year`, `death_year`, `is_fictional`
- Array indexes on `tags`, `associated_movements`

### Artworks Collection
- Unique index on `id`
- Text index on `title`
- Indexes on `artist_id`, `year`
- Array indexes on `tags`, `movement_ids`
- Compound indexes for common queries

### Art Movements Collection
- Unique index on `id`
- Text index on `name`
- Indexes on `start_year`, `end_year`
- Array indexes on `key_artists`, `representative_works`

## Testing

Run the comprehensive test suite:

```bash
cd backend
python test_implementation.py
```

The test script verifies:
- Database connectivity and setup
- Data generation functionality
- All service operations (CRUD)
- Query parameter handling
- Response format consistency
- Advanced features (search, similarity, etc.)

## Deployment

1. **Environment Setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Database Initialization**
   ```bash
   python -m app.utils.startup
   ```

3. **Start Application**
   ```bash
   python main.py
   ```

4. **Generate Sample Data**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/data-generation/full-dataset" \
        -H "Content-Type: application/json" \
        -d '{"real_artists_count": 5, "fictional_artists_count": 5}'
   ```

## Key Features Implemented

✅ **Core Requirements**
- Unified base models and services (DRY principle)
- Standardized API response format
- Comprehensive query parameter support
- MongoDB integration with proper collection names

✅ **Data Models**
- Enhanced Artist model with fictional support
- Updated Artwork model with style vectors
- New ArtMovement model
- Proper relationships between models

✅ **Advanced Features**
- Style-based artwork similarity
- Artist social networks
- Art movement timeline
- Period-based queries
- Full-text search capabilities

✅ **Data Generation**
- Real and fictional artist generation
- Artwork generation with style vectors
- Art movement generation
- Complete dataset generation with relationships

✅ **Database Management**
- Automatic indexing
- Migration utilities
- Health monitoring
- Statistics tracking

✅ **API Completeness**
- All CRUD operations
- Advanced query endpoints
- Data generation endpoints
- Database management endpoints

This implementation fully satisfies the requirements specified in the working memory documents while maintaining clean, extensible, and well-documented code.
