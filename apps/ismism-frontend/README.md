# Ismism Machine

The Ismism Machine is an interactive art movement visualization platform for displaying and exploring relationships between various art movements (isms). Built with React, Vite, and TailwindCSS, it supports interactive timelines, multi-level classification systems, and AI-assisted art creation features.

## Project Features

- 📊 **Interactive Timeline**: Visualize the development history of art movements
- 🔄 **Multi-level Classification**: Classify art movements through different attributes and relationships
- 🏷️ **Keyword Tags**: Use tag system to quickly filter art movements
- 🌐 **Responsive Design**: Interface adapted for desktop and mobile devices
- 🎨 **AI Image Generation**: AI image generation based on art styles

## Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + CSS Modules
- **State Management**: Zustand
- **Deployment**: Docker / Nginx

## Quick Start

### Method 1: Using Node.js

#### Prerequisites
- Node.js v18.12.1 or higher
- npm v8.0.0 or higher

```bash
# Clone repository
git clone https://github.com/yourusername/ismism-machine.git
cd ismism-machine

# Windows system
.\install.bat

# Mac/Linux system
chmod +x setup.sh
./setup.sh
```

### Method 2: Using Docker

#### Prerequisites
- Install Docker and Docker Compose

```bash
# Development environment
docker-compose up

# Production environment
docker build -t ismism-machine:latest .
docker run -d -p 80:80 --name ismism-machine ismism-machine:latest
```

## Project Structure

```
Ismism-Machine/
├── public/             # Static assets
├── src/
│   ├── components/     # Components directory
│   │   ├── Navbar.tsx  # Navigation bar component
│   │   ├── Sidebar.tsx # Sidebar component
│   │   └── ...         # Other components
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry file
│   └── index.css       # Global styles
├── Dockerfile          # Docker build file
├── docker-compose.yml  # Docker Compose configuration
├── setup.sh            # Unix/Linux installation script
├── install.bat         # Windows installation script
└── ...                 # Other configuration files
```

## Development Guide

### Local Development

Start local development server:

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Preview Build Results

```bash
npm run preview
```

## Deployment

For detailed deployment guide, please refer to [deployment.md](deployment.md) documentation.

## Contributing Guide

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## License

[MIT License](LICENSE)