# Environment Variables Configuration

This document details all environment variables needed for BeatMe.

## Backend Environment Variables

Create `backend/.env.local` with the following variables:

### Core Configuration
```bash
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/beatme
DATABASE_TEST_URL=postgresql://user:password@localhost:5432/beatme_test

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key
REFRESH_TOKEN_EXPIRE=30d

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback/spotify

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:5000/api/auth/github/callback

# Email (for password reset, verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@beatme.app

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Frontend Environment Variables

Create `frontend/.env.local` with the following variables:

### Core Configuration
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Getting API Credentials

### Spotify API
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Accept the terms and create
4. Copy Client ID and Client Secret
5. Add Redirect URI in settings

### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs
6. Copy Client ID and Secret

### GitHub OAuth
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Fill in application name and URLs
4. Copy Client ID and generate Client Secret
5. Add authorization callback URL

### Email (Gmail SMTP)
1. Enable 2-Factor Authentication in Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in SMTP_PASS

## Production Environment Variables

For production (Vercel deployment):

```bash
# Use strong secrets
JWT_SECRET=<generate-strong-random-string>
REFRESH_TOKEN_SECRET=<generate-strong-random-string>

# Update URLs
API_URL=https://beatme-api.vercel.app
FRONTEND_URL=https://beatme.vercel.app
NEXT_PUBLIC_API_URL=https://beatme-api.vercel.app/api

# Database (use managed service)
DATABASE_URL=postgresql://<user>:<pass>@<host>/<db>

# Redis (use managed service)
REDIS_URL=redis://:<password>@<host>:<port>

# Update redirect URIs to production URLs
SPOTIFY_REDIRECT_URI=https://beatme.vercel.app/auth/callback/spotify
GOOGLE_REDIRECT_URI=https://beatme-api.vercel.app/api/auth/google/callback
GITHUB_REDIRECT_URI=https://beatme-api.vercel.app/api/auth/github/callback

# CORS
CORS_ORIGIN=https://beatme.vercel.app
```

## Security Notes

⚠️ **Never commit `.env.local` files to Git!**

- Use `.env.example` as template
- Generate strong random strings for secrets
- Use different values for dev and production
- Rotate secrets regularly
- Use managed services for databases in production
- Enable HTTPS in production

## Verifying Setup

```bash
# Test backend connection
cd backend
npm run test:db

# Test Redis connection
npm run test:redis

# Test Elasticsearch connection
npm run test:elasticsearch
```
