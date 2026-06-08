# BeatMe Deployment Guide

Complete guide to deploy BeatMe to Vercel and production.

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Vercel (Frontend + Backend)                │
│  - Next.js Frontend                         │
│  - Express API (serverless)                 │
└─────────────────────────────────────────────┘
             │
             ├──────────────────┬──────────────┐
             │                  │              │
    ┌────────▼────────┐  ┌─────▼──────┐  ┌──▼─────────┐
    │ AWS RDS         │  │ ElastiCache│  │AWS S3 (CDN)│
    │ PostgreSQL      │  │  Redis     │  │Audio files │
    └─────────────────┘  └────────────┘  └────────────┘
```

## Prerequisites

- Vercel account (https://vercel.com)
- AWS account (https://aws.amazon.com)
- GitHub account with repository
- Domain name (optional)

## Part 1: Prepare for Deployment

### 1.1 Update Configuration Files

**Update `backend/vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Update `frontend/vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next@latest"
    }
  ]
}
```

### 1.2 Set Up AWS Services

#### Create AWS RDS PostgreSQL Database

1. Go to AWS RDS Console
2. Click "Create database"
3. Select PostgreSQL engine
4. Choose "Free tier" template
5. Fill in:
   - DB instance identifier: `beatme-prod`
   - Master username: `beatme_user`
   - Password: Generate strong password
6. Under "Connectivity":
   - Make publicly accessible: Yes
   - VPC security group: Allow inbound on port 5432
7. Create database
8. Note the endpoint (e.g., `beatme-prod.xxxxx.us-east-1.rds.amazonaws.com`)

#### Create AWS ElastiCache Redis

1. Go to AWS ElastiCache Console
2. Click "Create cache"
3. Select "Redis"
4. Fill in:
   - Cluster name: `beatme-redis`
   - Engine version: 7.x
   - Node type: cache.t3.micro (free tier eligible)
5. Under "Connectivity":
   - Security groups: Allow inbound on port 6379
6. Create
7. Note the endpoint

#### Create AWS S3 Bucket (Optional - for audio files)

1. Go to S3 Console
2. Click "Create bucket"
3. Bucket name: `beatme-audio-${your-username}`
4. Region: Same as your other services
5. Block all public access: Disable (for audio streaming)
6. Create
7. Configure CORS in bucket settings

### 1.3 Set Up Environment Variables

Create `.env.production` with production values:

```bash
# Core
NODE_ENV=production
PORT=5000

# URLs
API_URL=https://beatme-api.vercel.app
FRONTEND_URL=https://beatme.vercel.app
NEXT_PUBLIC_API_URL=https://beatme-api.vercel.app/api

# Database (from AWS RDS)
DATABASE_URL=postgresql://beatme_user:PASSWORD@beatme-prod.xxxxx.us-east-1.rds.amazonaws.com:5432/beatme

# Redis (from AWS ElastiCache)
REDIS_URL=redis://default:PASSWORD@beatme-redis.xxxxx.cache.amazonaws.com:6379

# JWT (Generate new secure values)
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)

# Spotify (use same as dev, or create new app for prod)
SPOTIFY_CLIENT_ID=your_prod_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_prod_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://beatme.vercel.app/auth/callback/spotify

# OAuth - Update to production URLs
GOOGLE_CLIENT_ID=your_prod_google_client_id
GOOGLE_CLIENT_SECRET=your_prod_google_client_secret
GOOGLE_REDIRECT_URI=https://beatme-api.vercel.app/api/auth/google/callback

GITHUB_CLIENT_ID=your_prod_github_client_id
GITHUB_CLIENT_SECRET=your_prod_github_client_secret
GITHUB_REDIRECT_URI=https://beatme-api.vercel.app/api/auth/github/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Elasticsearch (if using managed service)
ELASTICSEARCH_URL=https://your-elasticsearch-endpoint:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=your_password

# CORS
CORS_ORIGIN=https://beatme.vercel.app
```

## Part 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for `beatme`
4. Click "Import"

### 2.2 Configure Project

**For Frontend:**

1. Set Framework Preset: "Next.js"
2. Root Directory: `frontend`
3. Environment Variables: Add all `NEXT_PUBLIC_*` variables
4. Deploy

**For Backend API:**

1. Create new project for backend
2. Set Framework: "Node.js"
3. Root Directory: `backend`
4. Environment Variables: Add all backend variables
5. Deploy

### 2.3 Set Production Environment Variables

In Vercel Dashboard:

1. Go to Project Settings
2. Click "Environment Variables"
3. Add all variables from `.env.production`
4. Set Environment: "Production"
5. Redeploy

### 2.4 Run Database Migrations

```bash
# After deploying backend, run migrations
vercel env pull  # Pull environment variables

cd backend
npm run migrate:prod
cd ..
```

## Part 3: Update OAuth Providers

### Spotify

1. Go to https://developer.spotify.com/dashboard
2. Edit app settings
3. Update Redirect URIs to production URL
4. Copy new Client ID and Secret
5. Update in Vercel environment variables

### Google

1. Go to https://console.cloud.google.com/
2. Edit OAuth credentials
3. Add production URLs to authorized redirect URIs
4. Copy credentials
5. Update in Vercel environment variables

### GitHub

1. Go to https://github.com/settings/developers
2. Edit OAuth app
3. Update Authorization callback URL to production
4. Copy credentials
5. Update in Vercel environment variables

## Part 4: Domain Setup (Optional)

### Add Custom Domain

1. In Vercel Dashboard: Project Settings → Domains
2. Add your domain
3. Update DNS records according to Vercel instructions
4. Wait for DNS propagation (up to 48 hours)

### Enable HTTPS

Vercel automatically provides SSL certificates via Let's Encrypt.

## Part 5: Monitoring & Maintenance

### View Logs

```bash
# Frontend logs
vercel logs frontend

# Backend logs
vercel logs backend
```

### Scale Database

If you need more performance:

1. AWS RDS Console → Modify instance
2. Choose larger instance type
3. Apply immediately or during maintenance window

### Backup Database

```bash
# Create manual backup
aws rds create-db-snapshot \
  --db-instance-identifier beatme-prod \
  --db-snapshot-identifier beatme-prod-backup-$(date +%Y%m%d)
```

### Monitor Performance

**In Vercel:**
- Analytics: https://vercel.com/docs/analytics
- Web Vitals: https://vercel.com/docs/web-analytics

**In AWS:**
- CloudWatch for RDS
- CloudWatch for ElastiCache

## Part 6: CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_FRONTEND }}
      
      - name: Deploy Backend
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID_BACKEND }}
```

### Add Secrets to GitHub

1. Go to Repository Settings → Secrets
2. Add:
   - `VERCEL_TOKEN` - Generate from Vercel settings
   - `VERCEL_ORG_ID` - From Vercel team settings
   - `VERCEL_PROJECT_ID_FRONTEND` - Frontend project ID
   - `VERCEL_PROJECT_ID_BACKEND` - Backend project ID

## Troubleshooting

### Build Fails

```bash
# Check logs
vercel logs --follow

# Rebuild
vercel redeploy
```

### Database Connection Error

- Check RDS security group allows inbound 5432
- Verify DATABASE_URL environment variable
- Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Redis Connection Error

- Check ElastiCache security group allows 6379
- Verify REDIS_URL environment variable
- Test connection: `redis-cli -u $REDIS_URL ping`

### OAuth Callback Not Working

- Verify redirect URIs in OAuth provider match exactly
- Check environment variables are set correctly
- Verify domain is accessible from internet

## Performance Optimization

### Database
- Enable query caching with Redis
- Add database indexes for frequently queried fields
- Use connection pooling

### Frontend
- Enable image optimization
- Implement code splitting
- Use CDN for static assets

### API
- Implement rate limiting
- Enable gzip compression
- Cache API responses in Redis

## Backup & Recovery

### Database Backups

```bash
# Automated backups (AWS RDS)
# 1. AWS Console → RDS → Parameter groups
# 2. Modify backup retention to 30 days
# 3. Backups are automatic

# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier beatme-prod \
  --db-snapshot-identifier beatme-prod-backup
```

### Restore from Backup

```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier beatme-prod-restored \
  --db-snapshot-identifier beatme-prod-backup
```

## Costs

**Estimated Monthly Costs:**
- Vercel: $0-20 (depends on usage)
- AWS RDS (t3.micro): ~$15/month
- AWS ElastiCache (t3.micro): ~$10/month
- Bandwidth: $0.09 per GB
- **Total:** ~$25-50/month

## Success Checklist

- [ ] Repository connected to Vercel
- [ ] Frontend deployed and accessible
- [ ] Backend API deployed and accessible
- [ ] Database migrations run successfully
- [ ] Environment variables set in Vercel
- [ ] OAuth providers updated with production URLs
- [ ] HTTPS working on custom domain
- [ ] Database backups enabled
- [ ] Monitoring and alerts configured
- [ ] CI/CD pipeline working

## Next Steps

1. Test all features in production
2. Monitor logs and performance metrics
3. Set up alerts for errors
4. Plan scaling if needed
5. Regular backup and maintenance schedule
