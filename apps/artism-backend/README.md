# AIDA Backend

This is the backend service for the AI Artist Database (AIDA) project. It provides RESTful APIs for managing artist data and AI artist interactions.

## Technology Stack

- **FastAPI**: High-performance web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **MongoDB**: NoSQL database for storing artist data
- **LangChain**: Framework for LLM applications
- **OpenAI**: Integration for AI artist interactions
- **Pandas**: Data analysis and manipulation tool for CSV processing

## Project Structure

```
backend/
├── app/                    # Main application package
│   ├── api/                # API routes
│   │   └── v1/             # API version 1
│   │       ├── endpoints/  # API endpoints
│   │       └── __init__.py # API router initialization
│   ├── core/               # Core configuration
│   │   ├── config.py       # Application configuration
│   │   └── __init__.py
│   ├── db/                 # Database related
│   │   ├── mongodb/        # MongoDB connection and operations
│   │   └── __init__.py
│   ├── models/             # Data models
│   │   ├── artist.py       # Artist model
│   │   └── __init__.py
│   ├── schemas/            # Pydantic schemas
│   │   ├── artist.py       # Artist schema
│   │   └── __init__.py
│   ├── services/           # Business logic
│   │   ├── artist_service.py # Artist service
│   │   ├── ai_service.py   # AI interaction service
│   │   └── __init__.py
│   ├── utils/              # Utility functions
│   │   ├── csv_handler.py  # CSV processing
│   │   └── __init__.py
│   └── __init__.py         # Application initialization
├── main.py                 # Application entry point
├── requirements.txt        # Dependencies
├── .env.example            # Environment variables example
└── Dockerfile.dev          # Development Docker configuration
```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. **Important**: Create a `.env` file by copying from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file to set your specific configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/aida
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret
   ```
   
   > **Note**: The application will check for the existence of the `.env` file and will attempt to create it from `.env.example` if it doesn't exist. However, it's recommended to manually review and update the values.

4. Ensure MongoDB is running:
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux (with systemd)
   sudo systemctl start mongod
   
   # Direct command
   mongod
   ```

5. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

You can also run the following command to display the API documentation URLs:
```bash
npm run show:api-docs
```

## Available Endpoints

### Core Endpoints
- `GET /`: Welcome message
- `GET /api/v1/artists`: List all artists
- `GET /api/v1/artists/{artist_id}`: Get a specific artist by ID
- `POST /api/v1/artists`: Create a new artist
- `PUT /api/v1/artists/{artist_id}`: Update an existing artist
- `DELETE /api/v1/artists/{artist_id}`: Delete an artist
- `GET /api/v1/artists/search`: Search artists with various filters
- `POST /api/v1/ai-interaction`: Interact with AI artists

### Data Management Endpoints
- `POST /api/v1/data/upload-csv`: Upload a CSV file for processing
- `GET /api/v1/data/import-test-data`: Import test data from the data/test_table.csv file

### Test Endpoints
- `GET /api/v1/test`: Test GET API with query parameters
- `POST /api/v1/test`: Test POST API with request body

## Development

### Adding New Endpoints

1. Create a new file in `app/api/v1/endpoints/`
2. Define your router and endpoints
3. Register the router in `app/api/v1/__init__.py`

### Adding New Models

1. Create a new file in `app/models/`
2. Define your model class
3. Create corresponding schema in `app/schemas/`

### Adding New Services

1. Create a new file in `app/services/`
2. Define your service class with business logic
3. Use the service in your endpoints