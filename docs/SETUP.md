# BeatMe Setup Guide

Complete guide to set up BeatMe locally for development.

## Prerequisites

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download/))
- **Git** ([Download](https://git-scm.com/))

### Verify Installations

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be 9.x or higher
psql --version    # Should be 14.x or higher
redis-cli --version  # Should be 7.x or higher
```

## Step 1: Clone Repository

```bash
git clone https://github.com/skadzorze-1/beatme.git
cd beatme
```

## Step 2: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 3: Set Up Databases

### PostgreSQL Setup

```bash
# On macOS with Homebrew
brew services start postgresql

# On Linux
sudo service postgresql start

# On Windows - start PostgreSQL service from Services
```

**Create database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql terminal:
create database beatme;
create database beatme_test;
\q  # Exit psql
```

### Redis Setup

```bash
# On macOS with Homebrew
brew services start redis

# On Linux
sudo service redis-server start

# On Windows - start Redis from Services

# Verify Redis is running
redis-cli ping  # Should return PONG
```

## Step 4: Configure Environment Variables

```bash
# Backend environment
cp backend/.env.example backend/.env.local

# Frontend environment
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env.local` and update:
- `DATABASE_URL` to your PostgreSQL connection
- `REDIS_URL` to your Redis connection
- `JWT_SECRET` to a random string
- `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

Edit `frontend/.env.local` and update:
- `NEXT_PUBLIC_API_URL` to `http://localhost:5000/api`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GITHUB_CLIENT_ID`

See [ENV.md](./ENV.md) for detailed environment variable documentation.

## Step 5: Set Up Database Schema

```bash
cd backend

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed

cd ..
```

## Step 6: Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api/docs

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  provider VARCHAR(50),  -- 'local', 'google', 'github'
  provider_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Songs Table
```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE,
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id),
  album_id UUID REFERENCES albums(id),
  duration_ms INTEGER,
  explicit BOOLEAN DEFAULT false,
  popularity INTEGER,
  preview_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Artists Table
```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  popularity INTEGER,
  followers INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Albums Table
```sql
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE,
  title VARCHAR(255) NOT NULL,
  artist_id UUID REFERENCES artists(id),
  image_url TEXT,
  release_date DATE,
  total_tracks INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Playlists Table
```sql
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Playlist_Songs Table
```sql
CREATE TABLE playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, song_id)
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, song_id)
);
```

### Listening_History Table
```sql
CREATE TABLE listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id),
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_played_ms INTEGER
);
```

### Create Indexes for Performance
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_songs_spotify_id ON songs(spotify_id);
CREATE INDEX idx_artists_spotify_id ON artists(spotify_id);
CREATE INDEX idx_albums_spotify_id ON albums(spotify_id);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_listening_history_user_id ON listening_history(user_id);
CREATE INDEX idx_listening_history_played_at ON listening_history(played_at);
```

## Testing the Setup

```bash
# Test backend
cd backend
npm run test

# Test frontend
cd frontend
npm run test
```

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Make sure PostgreSQL is running
```bash
sudo service postgresql status  # Linux
brew services list              # macOS
```

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:** Make sure Redis is running
```bash
redis-cli ping  # Should return PONG
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Kill the process using the port
```bash
# macOS/Linux
sudo lsof -i :3000
sudo kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Next Steps

1. Read [API Documentation](./API.md)
2. Explore the codebase
3. Start building features
4. When ready, see [Deployment Guide](./DEPLOYMENT.md)
