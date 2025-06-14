// 静态艺术家数据，用于 Vercel 部署
export const MOCK_ARTISTS = [
  {
    id: 1,
    name: "Leonardo da Vinci",
    birth_year: 1452,
    death_year: 1519,
    nationality: "Italian",
    art_movement: "Renaissance",
    famous_works: ["Mona Lisa", "The Last Supper", "Vitruvian Man"],
    biography: "Leonardo da Vinci was an Italian polymath of the Renaissance whose areas of interest included invention, drawing, painting, sculpture, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, paleontology, and cartography.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    birth_place: "Vinci, Republic of Florence",
    death_place: "Amboise, Kingdom of France",
    influenced_by: ["Andrea del Verrocchio", "Classical antiquity"],
    influenced: ["Raphael", "Michelangelo", "Renaissance artists"],
    art_style: "High Renaissance, Sfumato technique",
    medium: ["Oil painting", "Fresco", "Drawing", "Sculpture"],
    themes: ["Religious subjects", "Portraits", "Scientific studies", "Anatomy"],
    notable_techniques: ["Sfumato", "Chiaroscuro", "Linear perspective"],
    major_works_years: {
      "Mona Lisa": "1503-1519",
      "The Last Supper": "1495-1498",
      "Vitruvian Man": "1490"
    },
    museums: ["Louvre Museum", "Santa Maria delle Grazie", "Various collections worldwide"],
    legacy: "Considered one of the greatest minds in human history, epitome of Renaissance humanism"
  },
  {
    id: 2,
    name: "Vincent van Gogh",
    birth_year: 1853,
    death_year: 1890,
    nationality: "Dutch",
    art_movement: "Post-Impressionism",
    famous_works: ["The Starry Night", "Sunflowers", "The Potato Eaters"],
    biography: "Vincent Willem van Gogh was a Dutch post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history.",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    birth_place: "Groot-Zundert, Netherlands",
    death_place: "Auvers-sur-Oise, France",
    influenced_by: ["Jean-François Millet", "Japanese art", "Impressionists"],
    influenced: ["Expressionism", "Modern art", "Fauvism"],
    art_style: "Post-Impressionism, Expressionism",
    medium: ["Oil painting", "Drawing", "Watercolor"],
    themes: ["Landscapes", "Still life", "Portraits", "Rural life"],
    notable_techniques: ["Impasto", "Bold colors", "Dynamic brushstrokes"],
    major_works_years: {
      "The Starry Night": "1889",
      "Sunflowers": "1888",
      "The Potato Eaters": "1885"
    },
    museums: ["Van Gogh Museum", "Museum of Modern Art", "National Gallery"],
    legacy: "Pioneer of modern art, influence on 20th-century art movements"
  },
  {
    id: 3,
    name: "Pablo Picasso",
    birth_year: 1881,
    death_year: 1973,
    nationality: "Spanish",
    art_movement: "Cubism",
    famous_works: ["Les Demoiselles d'Avignon", "Guernica", "The Old Guitarist"],
    biography: "Pablo Ruiz Picasso was a Spanish painter, sculptor, printmaker, ceramicist and theatre designer who spent most of his adult life in France.",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    birth_place: "Málaga, Spain",
    death_place: "Mougins, France",
    influenced_by: ["Paul Cézanne", "African art", "Iberian sculpture"],
    influenced: ["Modern art", "Contemporary art", "Abstract art"],
    art_style: "Cubism, Blue Period, Rose Period",
    medium: ["Oil painting", "Sculpture", "Ceramics", "Printmaking"],
    themes: ["Fragmented forms", "Multiple perspectives", "War", "Love"],
    notable_techniques: ["Analytical Cubism", "Synthetic Cubism", "Collage"],
    major_works_years: {
      "Les Demoiselles d'Avignon": "1907",
      "Guernica": "1937",
      "The Old Guitarist": "1903"
    },
    museums: ["Museo Reina Sofía", "Museum of Modern Art", "Picasso Museums worldwide"],
    legacy: "Co-founder of Cubism, most influential artist of the 20th century"
  },
  {
    id: 4,
    name: "Frida Kahlo",
    birth_year: 1907,
    death_year: 1954,
    nationality: "Mexican",
    art_movement: "Surrealism",
    famous_works: ["The Two Fridas", "Self-Portrait with Thorn Necklace", "The Broken Column"],
    biography: "Frida Kahlo was a Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.",
    image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    birth_place: "Coyoacán, Mexico City, Mexico",
    death_place: "Coyoacán, Mexico City, Mexico",
    influenced_by: ["Mexican folk art", "Pre-Columbian art", "Diego Rivera"],
    influenced: ["Feminist art", "Latin American art", "Contemporary artists"],
    art_style: "Surrealism, Folk art, Symbolism",
    medium: ["Oil painting", "Self-portraits"],
    themes: ["Identity", "Pain", "Mexican culture", "Femininity"],
    notable_techniques: ["Symbolic imagery", "Vivid colors", "Detailed realism"],
    major_works_years: {
      "The Two Fridas": "1939",
      "Self-Portrait with Thorn Necklace": "1940",
      "The Broken Column": "1944"
    },
    museums: ["Frida Kahlo Museum", "Museum of Modern Art", "Various international collections"],
    legacy: "Icon of Mexican culture, feminist symbol, influence on contemporary art"
  },
  {
    id: 5,
    name: "Claude Monet",
    birth_year: 1840,
    death_year: 1926,
    nationality: "French",
    art_movement: "Impressionism",
    famous_works: ["Water Lilies", "Impression, Sunrise", "Rouen Cathedral series"],
    biography: "Oscar-Claude Monet was a French painter and founder of French Impressionist painting, and the most consistent and prolific practitioner of the movement's philosophy.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    birth_place: "Paris, France",
    death_place: "Giverny, France",
    influenced_by: ["Eugène Boudin", "Japanese art", "Plein air painting"],
    influenced: ["Post-Impressionism", "Modern art", "Abstract art"],
    art_style: "Impressionism, En plein air",
    medium: ["Oil painting", "Pastel"],
    themes: ["Light and atmosphere", "Landscapes", "Water scenes", "Gardens"],
    notable_techniques: ["Broken color", "Loose brushwork", "Capturing light"],
    major_works_years: {
      "Impression, Sunrise": "1872",
      "Water Lilies": "1896-1926",
      "Rouen Cathedral": "1892-1894"
    },
    museums: ["Musée de l'Orangerie", "Musée d'Orsay", "Metropolitan Museum of Art"],
    legacy: "Founder of Impressionism, revolutionized landscape painting"
  }
];

// 静态艺术品数据
export const MOCK_ARTWORKS = [
  {
    id: 1,
    title: "Mona Lisa",
    artist_id: 1,
    artist_name: "Leonardo da Vinci",
    year_created: 1519,
    medium: "Oil on poplar panel",
    dimensions: "77 cm × 53 cm",
    location: "Louvre Museum, Paris",
    description: "The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci.",
    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
    style: "Renaissance",
    subject: "Portrait",
    technique: "Sfumato",
    provenance: "French royal collection since 1797",
    estimated_value: "Priceless",
    exhibition_history: ["Louvre Museum permanent collection"],
    condition: "Excellent",
    significance: "Most famous painting in the world"
  },
  {
    id: 2,
    title: "The Starry Night",
    artist_id: 2,
    artist_name: "Vincent van Gogh",
    year_created: 1889,
    medium: "Oil on canvas",
    dimensions: "73.7 cm × 92.1 cm",
    location: "Museum of Modern Art, New York",
    description: "The Starry Night is an oil-on-canvas painting by Dutch Post-Impressionist painter Vincent van Gogh.",
    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop",
    style: "Post-Impressionism",
    subject: "Landscape",
    technique: "Impasto",
    provenance: "Acquired by MoMA in 1941",
    estimated_value: "$100+ million",
    exhibition_history: ["MoMA permanent collection", "Various international exhibitions"],
    condition: "Good",
    significance: "Icon of modern art"
  }
];

// AI 交互模拟响应
export const MOCK_AI_RESPONSES = {
  "Leonardo da Vinci": [
    "Greetings! I am Leonardo, a student of all things in nature. Art and science are not separate realms, but unified expressions of understanding the divine creation around us.",
    "The eye, which is called the window of the soul, is the principal means by which understanding may most fully appreciate the infinite works of nature.",
    "Painting is poetry that is seen rather than felt, and poetry is painting that is felt rather than seen."
  ],
  "Vincent van Gogh": [
    "Hello, my friend. I paint not what I see, but what I feel. The colors of my soul flow through my brush onto the canvas.",
    "I dream of painting and then I paint my dream. Art is to console those who are broken by life.",
    "Great things are done by a series of small things brought together. Each brushstroke carries my passion."
  ],
  "Pablo Picasso": [
    "¡Hola! I am Pablo. Art washes away from the soul the dust of everyday life. Every child is an artist - the problem is staying an artist when you grow up.",
    "I paint objects as I think them, not as I see them. Reality is more than what meets the eye.",
    "The meaning of life is to find your gift. The purpose of life is to give it away through art."
  ],
  "Frida Kahlo": [
    "Hola, querido. I paint my own reality. The thing is to suffer without complaining. Art is the most intense mode of individualism.",
    "I never paint dreams or nightmares. I paint my own reality - the pain, the joy, the struggle of being human.",
    "Feet, what do I need you for when I have wings to fly? My art gives me wings beyond physical limitations."
  ],
  "Claude Monet": [
    "Bonjour! I am Claude. I must have flowers, always, and always. My garden is my most beautiful masterpiece.",
    "Color is my day-long obsession, joy and torment. Light constantly changes, and I chase these changes with my brush.",
    "I perhaps owe having become a painter to flowers. My water lilies teach me about the beauty of reflection and time."
  ]
}; 