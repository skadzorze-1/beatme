# BeatMe 🎵

A modern, mobile-first music streaming application built with Next.js, Express, and PostgreSQL.

## Features

- 🎵 **Music Streaming** - Stream millions of songs via Spotify API
- 🔐 **Authentication** - Email/password and social login (Google, GitHub)
- 🎧 **Playlists** - Create and manage custom playlists
- ❤️ **Favorites** - Mark songs as favorites
- 🔍 **Smart Search** - Full-text search with Elasticsearch
- 📱 **Mobile-First** - Optimized for mobile devices
- 💨 **Fast Performance** - Redis caching for optimal speed
- 📊 **Listening History** - Track your listening habits
- 🎯 **Recommendations** - Personalized music recommendations

## Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API server
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **Elasticsearch** - Full-text search
- **Spotify API** - Music data source
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Project Structure

```
beatme/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── pages/            # API routes
│   ├── styles/           # CSS modules
│   ├── lib/              # Utilities and hooks
│   ├── store/            # Redux store
│   └── package.json
├── backend/              # Express backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utilities
│   │   └── app.ts        # Express app setup
│   ├── migrations/       # Database migrations
│   └── package.json
├── docs/                 # Documentation
│   ├── SETUP.md         # Setup instructions
│   ├── API.md           # API documentation
│   ├── DEPLOYMENT.md    # Deployment guide
│   └── ENV.md           # Environment variables
└── package.json
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skadzorze-1/beatme.git
   cd beatme
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env.local
   cp frontend/.env.example frontend/.env.local
   ```
   Edit the `.env.local` files with your actual values.

4. **Set up databases**
   ```bash
   # Create PostgreSQL database
   createdb beatme
   
   # Run migrations
   cd backend && npm run migrate && cd ..
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Documentation

Detailed documentation is available in the `docs/` folder:

- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [API Documentation](./docs/API.md) - REST API endpoints
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deploy to Vercel & production
- [Environment Variables](./docs/ENV.md) - Configuration reference

## Environment Variables

See [ENV.md](./docs/ENV.md) for complete list of required variables.

## API Endpoints

See [API.md](./docs/API.md) for complete API documentation.

## Database Schema

See [SETUP.md](./docs/SETUP.md) for database schema details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [ ] Push notifications
- [ ] Offline mode
- [ ] Social sharing
- [ ] Podcast support
- [ ] Audio equalizer
- [ ] Lyrics display
- [ ] Collaborative playlists
