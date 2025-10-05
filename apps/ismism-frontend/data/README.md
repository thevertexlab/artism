# Art Movements Database

This local test database contains information and image resources for all art movements on the timeline.

## File Structure

- `artStyles.json` - Contains detailed information about all art movements, including titles, years, descriptions, artists, etc.
- `connections.json` - Contains relationships and influences between art movements
- `imageSearchUrls.json` - Sample image URLs that can be used to download or display artworks
- `images/` - Image folders organized by art style
  - `impressionism/` - Impressionist artwork images
  - `cubism/` - Cubist artwork images
  - `surrealism/` - Surrealist artwork images
  - etc...

## How to Use

### Adding Images

For each art movement, you can add related images in the corresponding folder:

1. Navigate to the appropriate folder, e.g., `images/impressionism/`
2. Save images in the format `[Artist Name]_[Artwork Name].jpg`

### Using Data

You can use this data in the following ways:

```javascript
// Read art style data
const artStyles = require('./data/artStyles.json');

// Read connection data
const connections = require('./data/connections.json');

// Display specific style information
const impressionism = artStyles.find(style => style.id === 'impressionism');
console.log(impressionism.title);  // Output: Impressionism
```

## Data Format

### Art Style Object

```json
{
  "id": "cubism",
  "title": "Cubism",
  "year": 1907,
  "description": "Breaks down objects into geometric shapes, representing them from multiple angles simultaneously",
  "artists": ["Picasso", "Braque"],
  "styleMovement": "cubism",
  "influences": ["Cézanne", "African Art"],
  "influencedBy": ["Impressionism"],
  "tags": ["Cubism", "France", "Early 20th Century"]
}
```

### Connection Object

```json
{
  "source": "impressionism",
  "target": "cubism",
  "type": "influence"
}
```

## Search and Extension

You can add real image links by replacing the sample URLs in `imageSearchUrls.json`, then use scripts to download these images to the corresponding folders.