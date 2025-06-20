import { useState } from 'react';

interface AIStyleOption {
  id: string;
  name: string;
  description: string;
  previewImage: string;
}

const AICreateSection = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Example art styles
  const artStyles: AIStyleOption[] = [
    {
      id: 'impressionism',
      name: 'Impressionism',
      description: 'Emphasizes light and color with immediate visual impressions, loose visible brushstrokes',
      previewImage: '/styles/impressionism.jpg'
    },
    {
      id: 'cubism',
      name: 'Cubism',
      description: 'Breaks objects into geometric shapes, showing multiple perspectives simultaneously',
      previewImage: '/styles/cubism.jpg'
    },
    {
      id: 'surrealism',
      name: 'Surrealism',
      description: 'Combines dreams with reality, creating visuals that transcend rationality',
      previewImage: '/styles/surrealism.jpg'
    },
    {
      id: 'expressionism',
      name: 'Expressionism',
      description: 'Expresses emotions through distortion and exaggeration, with intense colors',
      previewImage: '/styles/expressionism.jpg'
    },
    {
      id: 'popart',
      name: 'Pop Art',
      description: 'Incorporates elements of popular culture, with bright colors and repetitive patterns',
      previewImage: '/styles/popart.jpg'
    }
  ];
  
  const handleGenerate = () => {
    if (!prompt || !selectedStyle) return;
    
    setGenerating(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      // In an actual project, this would call an AI generation API
      setGeneratedImage(`/generated/${selectedStyle}-example.jpg`);
      setGenerating(false);
    }, 2000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800 mb-2">AI Art Movement Creation Lab</h2>
        <p className="text-sm text-gray-600">
          Use AI to present your ideas in different art movement styles. Choose an art style, enter a description, then generate an image.
        </p>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">1. Choose Art Style</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {artStyles.map(style => (
              <div
                key={style.id}
                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedStyle === style.id 
                    ? 'ring-2 ring-blue-500 shadow-md' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={style.previewImage} 
                    alt={style.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">{style.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{style.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">2. Enter Your Creative Description</h3>
          <div className="space-y-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Describe the image you want to create, for example: 'A castle on a mountaintop, surrounded by clouds'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {prompt.length} / 200 characters
              </div>
              
              <button 
                className={`px-4 py-2 rounded-lg ${
                  !prompt || !selectedStyle || generating
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                onClick={handleGenerate}
                disabled={!prompt || !selectedStyle || generating}
              >
                {generating ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>
        </div>
        
        {generatedImage && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">3. Your AI Generated Image</h3>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={generatedImage} 
                alt="AI Generated Art" 
                className="w-full h-full object-contain"
              />
              
              <div className="p-4 bg-gray-50 border-t flex justify-between">
                <div>
                  <span className="text-sm font-medium">Style: </span>
                  <span className="text-sm text-gray-600">
                    {artStyles.find(s => s.id === selectedStyle)?.name}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                    Download
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICreateSection; 